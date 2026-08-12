import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  Container,
  Table,
  Button,
  Modal,
  Form,
  Alert,
  Spinner,
} from "react-bootstrap";
import type { AxiosError } from "axios";
import { disciplinaApi } from "@/api/disciplinaApi";
import type {
  DisciplinaRespDTO,
  NewDisciplinaDTO,
} from "@/interfaces/catalogo";
import type { ErrorsDTO } from "@/interfaces/common";

const formVuoto: NewDisciplinaDTO = { nome: "", descrizione: "" };

function DisciplineAdmin() {
  const [discipline, setDiscipline] = useState<DisciplinaRespDTO[]>([]);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState<string | null>(null);

  const [modaleAperto, setModaleAperto] = useState(false);
  const [inModifica, setInModifica] = useState<DisciplinaRespDTO | null>(null);
  const [form, setForm] = useState<NewDisciplinaDTO>(formVuoto);
  const [erroreForm, setErroreForm] = useState<string | null>(null);
  const [inCorso, setInCorso] = useState(false);

  function caricaLista() {
    setCaricamento(true);
    disciplinaApi
      .lista({ size: 100 })
      .then((pagina) => setDiscipline(pagina.content))
      .catch(() => setErrore("Impossibile caricare le discipline"))
      .finally(() => setCaricamento(false));
  }

  useEffect(() => {
    caricaLista();
  }, []);

  function apriCreazione() {
    setInModifica(null);
    setForm(formVuoto);
    setErroreForm(null);
    setModaleAperto(true);
  }

  function apriModifica(disciplina: DisciplinaRespDTO) {
    setInModifica(disciplina);
    setForm({ nome: disciplina.nome, descrizione: disciplina.descrizione });
    setErroreForm(null);
    setModaleAperto(true);
  }

  async function handleSubmit(evento: FormEvent) {
    evento.preventDefault();
    setInCorso(true);
    setErroreForm(null);
    try {
      if (inModifica) {
        await disciplinaApi.modifica(inModifica.id, form);
      } else {
        await disciplinaApi.crea(form);
      }
      setModaleAperto(false);
      caricaLista();
    } catch (err) {
      const error = err as AxiosError<ErrorsDTO>;
      setErroreForm(
        error.response?.data?.message ?? "Salvataggio non riuscito",
      );
    } finally {
      setInCorso(false);
    }
  }

  async function handleElimina(disciplina: DisciplinaRespDTO) {
    if (!window.confirm(`Eliminare la disciplina "${disciplina.nome}"?`))
      return;
    await disciplinaApi.elimina(disciplina.id);
    caricaLista();
  }

  return (
    <Container className="page-container">
      <div className="dettaglio-intestazione">
        <h1>Discipline</h1>
        <Button className="btn-accent" onClick={apriCreazione}>
          + Nuova disciplina
        </Button>
      </div>

      {errore && <Alert variant="danger">{errore}</Alert>}

      {caricamento ? (
        <Spinner animation="border" />
      ) : (
        <Table responsive className="tabella-admin">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Descrizione</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {discipline.map((disciplina) => (
              <tr key={disciplina.id}>
                <td>{disciplina.nome}</td>
                <td>{disciplina.descrizione}</td>
                <td className="azioni-cella">
                  <Button
                    size="sm"
                    variant="outline-light"
                    onClick={() => apriModifica(disciplina)}
                  >
                    Modifica
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => handleElimina(disciplina)}
                  >
                    Elimina
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={modaleAperto} onHide={() => setModaleAperto(false)} centered>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>
              {inModifica ? "Modifica disciplina" : "Nuova disciplina"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {erroreForm && <Alert variant="danger">{erroreForm}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                value={form.nome}
                onChange={(e) =>
                  setForm((p) => ({ ...p, nome: e.target.value }))
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descrizione</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                maxLength={1000}
                value={form.descrizione}
                onChange={(e) =>
                  setForm((p) => ({ ...p, descrizione: e.target.value }))
                }
              />
            </Form.Group>
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

export default DisciplineAdmin;
