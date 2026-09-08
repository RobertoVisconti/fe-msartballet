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
import SelectRicercabile from "@/components/common/SelectRicercabile";
import Paginazione from "@/components/common/Paginazione";
import {
  StatoCaricamento,
  StatoErrore,
  StatoVuoto,
} from "@/components/common/StatiLista";
import type { LezioneRespDTO, NewLezioneDTO } from "@/interfaces/lezione";
import type { CorsoRespDTO, SalaRespDTO } from "@/interfaces/catalogo";
import type { Page, ErrorsDTO } from "@/interfaces/common";

const DIMENSIONE_PAGINA = 20;

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
  const [numeroPagina, setNumeroPagina] = useState(0);
  const [corsi, setCorsi] = useState<CorsoRespDTO[]>([]);
  const [sale, setSale] = useState<SalaRespDTO[]>([]);
  const [filtroCorso, setFiltroCorso] = useState("");
  const [filtroSala, setFiltroSala] = useState("");
  const [dal, setDal] = useState("");
  const [al, setAl] = useState("");
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState(false);
  const [tentativo, setTentativo] = useState(0);

  const [modaleAperto, setModaleAperto] = useState(false);
  const [inModifica, setInModifica] = useState<LezioneRespDTO | null>(null);
  const [form, setForm] = useState<NewLezioneDTO>(formVuoto);
  const [erroreForm, setErroreForm] = useState<string | null>(null);
  const [inCorso, setInCorso] = useState(false);
  const notifica = useNotifica();

  useEffect(() => {
    corsoApi.lista({ size: 100 }).then((pagina) => setCorsi(pagina.content));
    salaApi.lista({ size: 100 }).then((pagina) => setSale(pagina.content));
  }, []);

  function caricaLista() {
    setCaricamento(true);
    lezioneApi
      .lista({
        idCorso: filtroCorso || undefined,
        idSala: filtroSala || undefined,
        dal: dal || undefined,
        al: al || undefined,
        page: numeroPagina,
        size: DIMENSIONE_PAGINA,
      })
      .then((risultato) => {
        setPagina(risultato);
        setErrore(false);
      })
      .catch(() => {
        setErrore(true);
        notifica("Impossibile caricare le lezioni", "errore");
      })
      .finally(() => setCaricamento(false));
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    caricaLista();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroCorso, filtroSala, dal, al, numeroPagina, tentativo]);

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
      caricaLista();
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
      if (pagina && pagina.numberOfElements === 1 && !pagina.first) {
        setNumeroPagina((n) => n - 1);
      } else {
        caricaLista();
      }
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
  const filtriAttivi =
    filtroCorso !== "" || filtroSala !== "" || dal !== "" || al !== "";

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

      <Row className="filtri-riga">
        <Col md={6}>
          <SelectRicercabile
            opzioni={corsi.map((c) => ({ id: c.id, etichetta: c.titolo }))}
            value={filtroCorso}
            onChange={(id) => {
              setNumeroPagina(0);
              setFiltroCorso(id);
            }}
            placeholder="Tutti i corsi"
          />
        </Col>
        <Col md={6}>
          <SelectRicercabile
            opzioni={sale.map((s) => ({ id: s.id, etichetta: s.titolo }))}
            value={filtroSala}
            onChange={(id) => {
              setNumeroPagina(0);
              setFiltroSala(id);
            }}
            placeholder="Tutte le sale"
          />
        </Col>
      </Row>

      <Row className="filtri-riga">
        <Col md={6}>
          <Form.Group>
            <Form.Label className="testo-secondario">Dal</Form.Label>
            <Form.Control
              type="datetime-local"
              value={dal}
              onChange={(e) => {
                setNumeroPagina(0);
                setDal(e.target.value);
              }}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label className="testo-secondario">Al</Form.Label>
            <Form.Control
              type="datetime-local"
              value={al}
              onChange={(e) => {
                setNumeroPagina(0);
                setAl(e.target.value);
              }}
            />
          </Form.Group>
        </Col>
      </Row>

      {caricamento ? (
        <StatoCaricamento testo="Caricamento lezioni..." />
      ) : errore ? (
        <StatoErrore
          testo="Impossibile caricare le lezioni."
          onRiprova={() => setTentativo((t) => t + 1)}
        />
      ) : !pagina || pagina.empty ? (
        <StatoVuoto
          testo={
            filtriAttivi
              ? "Nessuna lezione corrisponde ai filtri impostati."
              : "Nessuna lezione programmata."
          }
        />
      ) : (
        <>
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

          <Paginazione pagina={pagina} onCambiaPagina={setNumeroPagina} />
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
                  <SelectRicercabile
                    opzioni={corsi.map((c) => ({
                      id: c.id,
                      etichetta: c.titolo,
                    }))}
                    value={form.idCorso}
                    onChange={(id) => setForm((p) => ({ ...p, idCorso: id }))}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Sala</Form.Label>
                  <SelectRicercabile
                    opzioni={sale.map((s) => ({
                      id: s.id,
                      etichetta: s.titolo,
                    }))}
                    value={form.idSala}
                    onChange={(id) => setForm((p) => ({ ...p, idSala: id }))}
                    required
                  />
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
