import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Container, Table, Button, Modal, Form } from "react-bootstrap";
import type { AxiosError } from "axios";
import { disciplinaApi } from "@/api/disciplinaApi";
import { useNotifica } from "@/components/common/ToastProvider";
import { estraiMessaggioErrore } from "@/utils/erroreApi";
import {
  StatoCaricamento,
  StatoErrore,
  StatoVuoto,
  AvvisoLimite,
} from "@/components/common/StatiLista";
import type {
  DisciplinaRespDTO,
  NewDisciplinaDTO,
} from "@/interfaces/catalogo";
import type { Page, ErrorsDTO } from "@/interfaces/common";

const formVuoto: NewDisciplinaDTO = { nome: "", descrizione: "" };

function DisciplineAdmin() {
  const [pagina, setPagina] = useState<Page<DisciplinaRespDTO> | null>(null);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState(false);
  const [tentativo, setTentativo] = useState(0);

  const [modaleAperto, setModaleAperto] = useState(false);
  const [inModifica, setInModifica] = useState<DisciplinaRespDTO | null>(null);
  const [form, setForm] = useState<NewDisciplinaDTO>(formVuoto);
  const [inCorso, setInCorso] = useState(false);
  const notifica = useNotifica();

  function caricaLista() {
    setCaricamento(true);
    disciplinaApi
      .lista({ size: 100 })
      .then((risultato) => {
        setPagina(risultato);
        setErrore(false);
      })
      .catch(() => {
        setErrore(true);
        notifica("Impossibile caricare le discipline", "errore");
      })
      .finally(() => setCaricamento(false));
  }

  useEffect(() => {
    caricaLista();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tentativo]);

  function apriCreazione() {
    setInModifica(null);
    setForm(formVuoto);
    setModaleAperto(true);
  }

  function apriModifica(disciplina: DisciplinaRespDTO) {
    setInModifica(disciplina);
    setForm({ nome: disciplina.nome, descrizione: disciplina.descrizione });
    setModaleAperto(true);
  }

  async function handleSubmit(evento: FormEvent) {
    evento.preventDefault();
    setInCorso(true);
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
      notifica(
        estraiMessaggioErrore(error.response?.data, "Salvataggio non riuscito"),
        "errore",
      );
    } finally {
      setInCorso(false);
    }
  }

  async function handleElimina(disciplina: DisciplinaRespDTO) {
    if (!window.confirm(`Eliminare la disciplina "${disciplina.nome}"?`))
      return;
    try {
      await disciplinaApi.elimina(disciplina.id);
      caricaLista();
    } catch (err) {
      const error = err as AxiosError<ErrorsDTO>;
      notifica(
        estraiMessaggioErrore(error.response?.data, "Eliminazione non riuscita"),
        "errore",
      );
    }
  }

  return (
    <Container className="page-container">
      <div className="dettaglio-intestazione">
        <h1>Discipline</h1>
        <Button className="btn-accent" onClick={apriCreazione}>
          + Nuova disciplina
        </Button>
      </div>

      {caricamento ? (
        <StatoCaricamento testo="Caricamento discipline..." />
      ) : errore ? (
        <StatoErrore
          testo="Impossibile caricare le discipline."
          onRiprova={() => setTentativo((t) => t + 1)}
        />
      ) : !pagina || pagina.empty ? (
        <StatoVuoto testo="Nessuna disciplina registrata." />
      ) : (
        <>
          <AvvisoLimite pagina={pagina} />
          <Table responsive className="tabella-admin">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Descrizione</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {pagina.content.map((disciplina) => (
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
        </>
      )}

      <Modal show={modaleAperto} onHide={() => setModaleAperto(false)} centered>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>
              {inModifica ? "Modifica disciplina" : "Nuova disciplina"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
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
