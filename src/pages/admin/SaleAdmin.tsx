import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Container, Table, Button, Modal, Form } from "react-bootstrap";
import type { AxiosError } from "axios";
import { salaApi } from "@/api/salaApi";
import CaricaImmagine from "@/components/admin/CaricaImmagine";
import { useNotifica } from "@/components/common/ToastProvider";
import { estraiMessaggioErrore } from "@/utils/erroreApi";
import {
  StatoCaricamento,
  StatoErrore,
  StatoVuoto,
  AvvisoLimite,
} from "@/components/common/StatiLista";
import type { SalaRespDTO, SalaDTO } from "@/interfaces/catalogo";
import type { Page, ErrorsDTO } from "@/interfaces/common";

const formVuoto: SalaDTO = { titolo: "", imgSala: "", prezzoAffitto: 0 };

function SaleAdmin() {
  const [pagina, setPagina] = useState<Page<SalaRespDTO> | null>(null);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState(false);
  const [tentativo, setTentativo] = useState(0);

  const [modaleAperto, setModaleAperto] = useState(false);
  const [inModifica, setInModifica] = useState<SalaRespDTO | null>(null);
  const [form, setForm] = useState<SalaDTO>(formVuoto);
  const [inCorso, setInCorso] = useState(false);
  const notifica = useNotifica();

  function caricaLista() {
    setCaricamento(true);
    salaApi
      .lista({ size: 100 })
      .then((risultato) => {
        setPagina(risultato);
        setErrore(false);
      })
      .catch(() => {
        setErrore(true);
        notifica("Impossibile caricare le sale", "errore");
      })
      .finally(() => setCaricamento(false));
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    caricaLista();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tentativo]);

  function apriCreazione() {
    setInModifica(null);
    setForm(formVuoto);
    setModaleAperto(true);
  }

  function apriModifica(sala: SalaRespDTO) {
    setInModifica(sala);
    setForm({
      titolo: sala.titolo,
      imgSala: sala.imgSala,
      prezzoAffitto: sala.prezzoAffitto,
    });
    setModaleAperto(true);
  }

  async function handleSubmit(evento: FormEvent) {
    evento.preventDefault();
    setInCorso(true);

    try {
      if (inModifica) {
        await salaApi.modifica(inModifica.id, form);
      } else {
        await salaApi.crea(form);
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

  async function handleElimina(sala: SalaRespDTO) {
    if (!window.confirm(`Eliminare la sala "${sala.titolo}"?`)) return;
    try {
      await salaApi.elimina(sala.id);
      caricaLista();
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

  return (
    <Container className="page-container">
      <div className="dettaglio-intestazione">
        <h1>Sale</h1>
        <Button className="btn-accent" onClick={apriCreazione}>
          + Nuova sala
        </Button>
      </div>

      {caricamento ? (
        <StatoCaricamento testo="Caricamento sale..." />
      ) : errore ? (
        <StatoErrore
          testo="Impossibile caricare le sale."
          onRiprova={() => setTentativo((t) => t + 1)}
        />
      ) : !pagina || pagina.empty ? (
        <StatoVuoto testo="Nessuna sala registrata." />
      ) : (
        <>
          <AvvisoLimite pagina={pagina} />
          <Table responsive className="tabella-admin">
            <thead>
              <tr>
                <th>Titolo</th>
                <th>Prezzo affitto</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {pagina.content.map((sala) => (
                <tr key={sala.id}>
                  <td>{sala.titolo}</td>
                  <td>€ {sala.prezzoAffitto}</td>
                  <td className="azioni-cella">
                    <Button
                      size="sm"
                      variant="outline-light"
                      onClick={() => apriModifica(sala)}
                    >
                      Modifica
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => handleElimina(sala)}
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
              {inModifica ? "Modifica sala" : "Nuova sala"}
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
            <CaricaImmagine
              value={form.imgSala}
              onCaricata={(url) => setForm((p) => ({ ...p, imgSala: url }))}
              etichetta="Immagine sala"
              richiesta
            />
            <Form.Group className="mb-3">
              <Form.Label>Prezzo affitto (€)</Form.Label>
              <Form.Control
                type="number"
                min={0}
                step="0.01"
                value={form.prezzoAffitto}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    prezzoAffitto: Number(e.target.value),
                  }))
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

export default SaleAdmin;
