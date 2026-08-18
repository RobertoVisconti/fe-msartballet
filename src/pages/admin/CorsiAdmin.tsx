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
import { corsoApi } from "@/api/corsoApi";
import { disciplinaApi } from "@/api/disciplinaApi";
import { insegnanteApi } from "@/api/insegnanteApi";
import { useNotifica } from "@/components/common/ToastProvider";
import {
  StatoCaricamento,
  StatoErrore,
  StatoVuoto,
  AvvisoLimite,
} from "@/components/common/StatiLista";
import type {
  CorsoRespDTO,
  NewCorsoDTO,
  DisciplinaRespDTO,
  LivelloCorso,
  GiornoSettimana,
} from "@/interfaces/catalogo";
import type { InsegnanteRespDTO } from "@/interfaces/utente";
import type { Page, ErrorsDTO } from "@/interfaces/common";

const LIVELLI: LivelloCorso[] = ["PRINCIPIANTE", "INTERMEDIO", "AVANZATO"];
const GIORNI: { valore: GiornoSettimana; etichetta: string }[] = [
  { valore: "LUNEDI", etichetta: "Lunedì" },
  { valore: "MARTEDI", etichetta: "Martedì" },
  { valore: "MERCOLEDI", etichetta: "Mercoledì" },
  { valore: "GIOVEDI", etichetta: "Giovedì" },
  { valore: "VENERDI", etichetta: "Venerdì" },
  { valore: "SABATO", etichetta: "Sabato" },
  { valore: "DOMENICA", etichetta: "Domenica" },
];

const formVuoto: NewCorsoDTO = {
  titolo: "",
  descrizione: "",
  livelloCorso: "PRINCIPIANTE",
  giornoSettimana: "LUNEDI",
  oraInizio: "",
  oraFine: "",
  prezzoMensile: 0,
  idDisciplina: "",
  idInsegnante: "",
};

function CorsiAdmin() {
  const [pagina, setPagina] = useState<Page<CorsoRespDTO> | null>(null);
  const [discipline, setDiscipline] = useState<DisciplinaRespDTO[]>([]);
  const [insegnanti, setInsegnanti] = useState<InsegnanteRespDTO[]>([]);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState(false);
  const [tentativo, setTentativo] = useState(0);

  const [modaleAperto, setModaleAperto] = useState(false);
  const [inModifica, setInModifica] = useState<CorsoRespDTO | null>(null);
  const [form, setForm] = useState<NewCorsoDTO>(formVuoto);
  const [inCorso, setInCorso] = useState(false);
  const notifica = useNotifica();

  function caricaTutto() {
    setCaricamento(true);
    Promise.all([
      corsoApi.lista({ size: 100 }),
      disciplinaApi.lista({ size: 100 }),
      insegnanteApi.lista({ size: 100 }),
    ])
      .then(([paginaCorsi, paginaDiscipline, paginaInsegnanti]) => {
        setPagina(paginaCorsi);
        setDiscipline(paginaDiscipline.content);
        setInsegnanti(paginaInsegnanti.content);
        setErrore(false);
      })
      .catch(() => {
        setErrore(true);
        notifica("Impossibile caricare i dati", "errore");
      })
      .finally(() => setCaricamento(false));
  }

  useEffect(() => {
    caricaTutto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tentativo]);

  function apriCreazione() {
    setInModifica(null);
    setForm(formVuoto);
    setModaleAperto(true);
  }

  function apriModifica(corso: CorsoRespDTO) {
    setInModifica(corso);
    setForm({
      titolo: corso.titolo,
      descrizione: corso.descrizione,
      livelloCorso: corso.livelloCorso,
      giornoSettimana: corso.giornoSettimana,
      oraInizio: corso.oraInizio.slice(0, 5),
      oraFine: corso.oraFine.slice(0, 5),
      prezzoMensile: corso.prezzoMensile,
      idDisciplina: corso.idDisciplina,
      idInsegnante: corso.idInsegnante,
    });
    setModaleAperto(true);
  }

  async function handleSubmit(evento: FormEvent) {
    evento.preventDefault();
    setInCorso(true);
    try {
      if (inModifica) {
        await corsoApi.modifica(inModifica.id, form);
      } else {
        await corsoApi.crea(form);
      }
      setModaleAperto(false);
      caricaTutto();
    } catch (err) {
      const error = err as AxiosError<ErrorsDTO>;
      notifica(
        error.response?.data?.message ?? "Salvataggio non riuscito",
        "errore",
      );
    } finally {
      setInCorso(false);
    }
  }

  async function handleElimina(corso: CorsoRespDTO) {
    if (!window.confirm(`Eliminare il corso "${corso.titolo}"?`)) return;
    try {
      await corsoApi.elimina(corso.id);
      caricaTutto();
    } catch (err) {
      const error = err as AxiosError<ErrorsDTO>;
      notifica(
        error.response?.data?.message ?? "Eliminazione non riuscita",
        "errore",
      );
    }
  }

  const nessunaDisciplina = discipline.length === 0;
  const nessunInsegnante = insegnanti.length === 0;

  return (
    <Container className="page-container">
      <div className="dettaglio-intestazione">
        <h1>Corsi</h1>
        <Button
          className="btn-accent"
          onClick={apriCreazione}
          disabled={nessunaDisciplina || nessunInsegnante}
        >
          + Nuovo corso
        </Button>
      </div>

      {(nessunaDisciplina || nessunInsegnante) && !caricamento && (
        <Alert variant="warning">
          Serve almeno una disciplina e un insegnante prima di poter creare un
          corso.
        </Alert>
      )}

      {caricamento ? (
        <StatoCaricamento testo="Caricamento corsi..." />
      ) : errore ? (
        <StatoErrore
          testo="Impossibile caricare i corsi."
          onRiprova={() => setTentativo((t) => t + 1)}
        />
      ) : !pagina || pagina.empty ? (
        <StatoVuoto testo="Nessun corso registrato." />
      ) : (
        <>
          <AvvisoLimite pagina={pagina} />
          <Table responsive className="tabella-admin">
            <thead>
              <tr>
                <th>Titolo</th>
                <th>Disciplina</th>
                <th>Insegnante</th>
                <th>Giorno</th>
                <th>Prezzo</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {pagina.content.map((corso) => (
                <tr key={corso.id}>
                  <td>{corso.titolo}</td>
                  <td>{corso.nomeDisciplina}</td>
                  <td>{corso.nomeInsegnante}</td>
                  <td>{corso.giornoSettimana}</td>
                  <td>€ {corso.prezzoMensile}</td>
                  <td className="azioni-cella">
                    <Button
                      size="sm"
                      variant="outline-light"
                      onClick={() => apriModifica(corso)}
                    >
                      Modifica
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => handleElimina(corso)}
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

      <Modal
        show={modaleAperto}
        onHide={() => setModaleAperto(false)}
        centered
        size="lg"
      >
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>
              {inModifica ? "Modifica corso" : "Nuovo corso"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Titolo</Form.Label>
                  <Form.Control
                    value={form.titolo}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, titolo: e.target.value }))
                    }
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Prezzo mensile (€)</Form.Label>
                  <Form.Control
                    type="number"
                    min={0}
                    step="0.01"
                    value={form.prezzoMensile}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        prezzoMensile: Number(e.target.value),
                      }))
                    }
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Descrizione</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={form.descrizione}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, descrizione: e.target.value }))
                    }
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Disciplina</Form.Label>
                  <Form.Select
                    value={form.idDisciplina}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, idDisciplina: e.target.value }))
                    }
                    required
                  >
                    <option value="">Seleziona...</option>
                    {discipline.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.nome}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Insegnante</Form.Label>
                  <Form.Select
                    value={form.idInsegnante}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, idInsegnante: e.target.value }))
                    }
                    required
                  >
                    <option value="">Seleziona...</option>
                    {insegnanti.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.nome} {i.cognome}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Livello</Form.Label>
                  <Form.Select
                    value={form.livelloCorso}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        livelloCorso: e.target.value as LivelloCorso,
                      }))
                    }
                  >
                    {LIVELLI.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Giorno</Form.Label>
                  <Form.Select
                    value={form.giornoSettimana}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        giornoSettimana: e.target.value as GiornoSettimana,
                      }))
                    }
                  >
                    {GIORNI.map((g) => (
                      <option key={g.valore} value={g.valore}>
                        {g.etichetta}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group className="mb-3">
                  <Form.Label>Inizio</Form.Label>
                  <Form.Control
                    type="time"
                    value={form.oraInizio}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, oraInizio: e.target.value }))
                    }
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group className="mb-3">
                  <Form.Label>Fine</Form.Label>
                  <Form.Control
                    type="time"
                    value={form.oraFine}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, oraFine: e.target.value }))
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

export default CorsiAdmin;
