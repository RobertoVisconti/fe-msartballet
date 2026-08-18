import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  Container,
  Table,
  Button,
  Modal,
  Form,
  Spinner,
} from "react-bootstrap";
import type { AxiosError } from "axios";
import { spettacoloApi } from "@/api/spettacoloApi";
import { useNotifica } from "@/components/common/ToastProvider";
import type { SpettacoloRespDTO, SpettacoloDTO } from "@/interfaces/galleria";
import type { ErrorsDTO } from "@/interfaces/common";

const formVuoto: SpettacoloDTO = {
  titolo: "",
  descrizione: "",
  dataEvento: "",
  luogo: "",
};

function SpettacoliAdmin() {
  const [spettacoli, setSpettacoli] = useState<SpettacoloRespDTO[]>([]);
  const [caricamento, setCaricamento] = useState(true);

  const [modaleAperto, setModaleAperto] = useState(false);
  const [inModifica, setInModifica] = useState<SpettacoloRespDTO | null>(null);
  const [form, setForm] = useState<SpettacoloDTO>(formVuoto);
  const [inCorso, setInCorso] = useState(false);
  const notifica = useNotifica();

  function caricaLista() {
    setCaricamento(true);
    spettacoloApi
      .lista({ size: 100 })
      .then((pagina) => setSpettacoli(pagina.content))
      .catch(() => notifica("Impossibile caricare gli spettacoli", "errore"))
      .finally(() => setCaricamento(false));
  }

  useEffect(() => {
    caricaLista();
  }, []);

  function apriCreazione() {
    setInModifica(null);
    setForm(formVuoto);
    setModaleAperto(true);
  }

  function apriModifica(spettacolo: SpettacoloRespDTO) {
    setInModifica(spettacolo);
    setForm({
      titolo: spettacolo.titolo,
      descrizione: spettacolo.descrizione,
      dataEvento: spettacolo.dataEvento,
      luogo: spettacolo.luogo,
    });
    setModaleAperto(true);
  }

  async function handleSubmit(evento: FormEvent) {
    evento.preventDefault();
    setInCorso(true);
    try {
      if (inModifica) {
        await spettacoloApi.modifica(inModifica.id, form);
      } else {
        await spettacoloApi.crea(form);
      }
      setModaleAperto(false);
      caricaLista();
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

  async function handleElimina(spettacolo: SpettacoloRespDTO) {
    if (!window.confirm(`Eliminare lo spettacolo "${spettacolo.titolo}"?`))
      return;
    try {
      await spettacoloApi.elimina(spettacolo.id);
      caricaLista();
    } catch (err) {
      const error = err as AxiosError<ErrorsDTO>;
      notifica(
        error.response?.data?.message ?? "Eliminazione non riuscita",
        "errore",
      );
    }
  }

  return (
    <Container className="page-container">
      <div className="dettaglio-intestazione">
        <h1>Spettacoli</h1>
        <Button className="btn-accent" onClick={apriCreazione}>
          + Nuovo spettacolo
        </Button>
      </div>

      {caricamento ? (
        <Spinner animation="border" />
      ) : (
        <Table responsive className="tabella-admin">
          <thead>
            <tr>
              <th>Titolo</th>
              <th>Data evento</th>
              <th>Luogo</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {spettacoli.map((spettacolo) => (
              <tr key={spettacolo.id}>
                <td>{spettacolo.titolo}</td>
                <td>{spettacolo.dataEvento}</td>
                <td>{spettacolo.luogo}</td>
                <td className="azioni-cella">
                  <Button
                    size="sm"
                    variant="outline-light"
                    onClick={() => apriModifica(spettacolo)}
                  >
                    Modifica
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => handleElimina(spettacolo)}
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
              {inModifica ? "Modifica spettacolo" : "Nuovo spettacolo"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
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
            <Form.Group className="mb-3">
              <Form.Label>Descrizione</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                maxLength={2000}
                value={form.descrizione}
                onChange={(e) =>
                  setForm((p) => ({ ...p, descrizione: e.target.value }))
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Data evento</Form.Label>
              <Form.Control
                type="date"
                max={new Date().toISOString().split("T")[0]}
                value={form.dataEvento}
                onChange={(e) =>
                  setForm((p) => ({ ...p, dataEvento: e.target.value }))
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Luogo</Form.Label>
              <Form.Control
                value={form.luogo}
                onChange={(e) =>
                  setForm((p) => ({ ...p, luogo: e.target.value }))
                }
                required
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

export default SpettacoliAdmin;
