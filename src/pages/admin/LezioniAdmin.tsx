import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  Container,
  Table,
  Button,
  Modal,
  Form,
  Alert,
  Row,
  Col,
} from "react-bootstrap";
import type { AxiosError } from "axios";
import { lezioneApi } from "@/api/lezioneApi";
import { corsoApi } from "@/api/corsoApi";
import { salaApi } from "@/api/salaApi";
import { useNotifica } from "@/components/common/ToastProvider";
import { estraiMessaggioErrore } from "@/utils/erroreApi";
import { formattaPrezzo } from "@/utils/formattaPrezzo";
import {
  StatoCaricamento,
  StatoErrore,
  StatoVuoto,
  AvvisoLimite,
} from "@/components/common/StatiLista";
import type { LezioneRespDTO, NewLezioneDTO } from "@/interfaces/lezione";
import type { CorsoRespDTO, SalaRespDTO } from "@/interfaces/catalogo";
import type { Page, ErrorsDTO } from "@/interfaces/common";

const formVuoto: NewLezioneDTO = {
  dataOraInizio: "",
  dataOraFine: "",
  prezzoLezione: 0,
  idCorso: "",
  idSala: "",
};

function adessoPerInput(): string {
  const adesso = new Date();
  adesso.setMinutes(adesso.getMinutes() - adesso.getTimezoneOffset());
  return adesso.toISOString().slice(0, 16);
}

function LezioniAdmin() {
  const [pagina, setPagina] = useState<Page<LezioneRespDTO> | null>(null);
  const [corsi, setCorsi] = useState<CorsoRespDTO[]>([]);
  const [sale, setSale] = useState<SalaRespDTO[]>([]);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState(false);
  const [tentativo, setTentativo] = useState(0);

  const [modaleAperto, setModaleAperto] = useState(false);
  const [inModifica, setInModifica] = useState<LezioneRespDTO | null>(null);
  const [form, setForm] = useState<NewLezioneDTO>(formVuoto);
  const [erroreForm, setErroreForm] = useState<string | null>(null);
  const [inCorso, setInCorso] = useState(false);
  const notifica = useNotifica();

  function caricaTutto() {
    setCaricamento(true);
    Promise.all([
      lezioneApi.lista({ size: 100 }),
      corsoApi.lista({ size: 100 }),
      salaApi.lista({ size: 100 }),
    ])
      .then(([paginaLezioni, paginaCorsi, paginaSale]) => {
        setPagina(paginaLezioni);
        setCorsi(paginaCorsi.content);
        setSale(paginaSale.content);
        setErrore(false);
      })
      .catch(() => {
        setErrore(true);
        notifica("Impossibile caricare i dati", "errore");
      })
      .finally(() => setCaricamento(false));
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    caricaTutto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tentativo]);

  function apriCreazione() {
    setInModifica(null);
    setForm(formVuoto);
    setErroreForm(null);
    setModaleAperto(true);
  }

  function apriModifica(lezione: LezioneRespDTO) {
    setInModifica(lezione);
    setForm({
      dataOraInizio: lezione.dataOraInizio.slice(0, 16),
      dataOraFine: lezione.dataOraFine.slice(0, 16),
      prezzoLezione: lezione.prezzoLezione,
      idCorso: lezione.idCorso,
      idSala: lezione.idSala,
    });
    setErroreForm(null);
    setModaleAperto(true);
  }

  async function handleSubmit(evento: FormEvent) {
    evento.preventDefault();
    setInCorso(true);
    setErroreForm(null);
    try {
      if (inModifica) {
        await lezioneApi.modifica(inModifica.id, form);
      } else {
        await lezioneApi.crea(form);
      }
      setModaleAperto(false);
      caricaTutto();
    } catch (err) {
      const error = err as AxiosError<ErrorsDTO>;
      setErroreForm(
        estraiMessaggioErrore(error.response?.data, "Salvataggio non riuscito"),
      );
    } finally {
      setInCorso(false);
    }
  }

  async function handleElimina(lezione: LezioneRespDTO) {
    const etichetta = new Date(lezione.dataOraInizio).toLocaleString("it-IT");
    if (!window.confirm(`Eliminare la lezione del ${etichetta}?`)) return;
    try {
      await lezioneApi.elimina(lezione.id);
      caricaTutto();
    } catch (err) {
      const error = err as AxiosError<ErrorsDTO>;
      notifica(
        estraiMessaggioErrore(
          error.response?.data,
          "Eliminazione non riuscita",
        ),
        "errore",
      );
    }
  }

  const nessunCorso = corsi.length === 0;
  const nessunaSala = sale.length === 0;

  return (
    <Container className="page-container">
      <div className="dettaglio-intestazione">
        <h1>Lezioni</h1>
        <Button
          className="btn-accent"
          onClick={apriCreazione}
          disabled={nessunCorso || nessunaSala}
        >
          + Nuova lezione
        </Button>
      </div>

      {(nessunCorso || nessunaSala) && !caricamento && (
        <Alert variant="warning">
          Serve almeno un corso e una sala prima di poter creare una lezione.
        </Alert>
      )}

      {caricamento ? (
        <StatoCaricamento testo="Caricamento lezioni..." />
      ) : errore ? (
        <StatoErrore
          testo="Impossibile caricare le lezioni."
          onRiprova={() => setTentativo((t) => t + 1)}
        />
      ) : !pagina || pagina.empty ? (
        <StatoVuoto testo="Nessuna lezione programmata." />
      ) : (
        <>
          <AvvisoLimite pagina={pagina} />
          <Table responsive className="tabella-admin">
            <thead>
              <tr>
                <th>Data e ora</th>
                <th>Corso</th>
                <th>Sala</th>
                <th>Prezzo</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {pagina.content.map((lezione) => (
                <tr key={lezione.id}>
                  <td>
                    {new Date(lezione.dataOraInizio).toLocaleString("it-IT")}
                  </td>
                  <td>{lezione.titoloCorso}</td>
                  <td>{lezione.titoloSala}</td>
                  <td>{formattaPrezzo(lezione.prezzoLezione)}</td>
                  <td className="azioni-cella">
                    <Button
                      size="sm"
                      variant="outline-light"
                      onClick={() => apriModifica(lezione)}
                    >
                      Modifica
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => handleElimina(lezione)}
                    >
                      Elimina
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      <Modal show={modaleAperto} onHide={() => setModaleAperto(false)} centered>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>
              {inModifica ? "Modifica lezione" : "Nuova lezione"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {erroreForm && <Alert variant="danger">{erroreForm}</Alert>}
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Inizio</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    min={adessoPerInput()}
                    value={form.dataOraInizio}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, dataOraInizio: e.target.value }))
                    }
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fine</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    min={adessoPerInput()}
                    value={form.dataOraFine}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, dataOraFine: e.target.value }))
                    }
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Corso</Form.Label>
                  <Form.Select
                    value={form.idCorso}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, idCorso: e.target.value }))
                    }
                    required
                  >
                    <option value="">Seleziona...</option>
                    {corsi.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.titolo}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Sala</Form.Label>
                  <Form.Select
                    value={form.idSala}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, idSala: e.target.value }))
                    }
                    required
                  >
                    <option value="">Seleziona...</option>
                    {sale.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.titolo}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Prezzo lezione (€)</Form.Label>
                  <Form.Control
                    type="number"
                    min={0}
                    step="0.01"
                    value={form.prezzoLezione}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        prezzoLezione: Number(e.target.value),
                      }))
                    }
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="outline-light"
              onClick={() => setModaleAperto(false)}
            >
              Annulla
            </Button>
            <Button type="submit" className="btn-accent" disabled={inCorso}>
              {inCorso ? "Salvataggio..." : "Salva"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}

export default LezioniAdmin;
