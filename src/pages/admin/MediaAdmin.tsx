import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Container, Table, Button, Modal, Form, Alert } from "react-bootstrap";
import type { AxiosError } from "axios";
import { mediaApi } from "@/api/mediaApi";
import { spettacoloApi } from "@/api/spettacoloApi";
import CaricaImmagine from "@/components/admin/CaricaImmagine";
import { useNotifica } from "@/components/common/ToastProvider";
import { estraiMessaggioErrore } from "@/utils/erroreApi";
import {
  StatoCaricamento,
  StatoErrore,
  StatoVuoto,
  AvvisoLimite,
} from "@/components/common/StatiLista";
import type {
  MediaRespDTO,
  NewMediaDTO,
  SpettacoloRespDTO,
  TipoMedia,
} from "@/interfaces/galleria";
import type { Page, ErrorsDTO } from "@/interfaces/common";

const formVuoto: NewMediaDTO = {
  url: "",
  tipoMedia: "FOTO",
  titolo: "",
  idSpettacolo: "",
};

function MediaAdmin() {
  const [pagina, setPagina] = useState<Page<MediaRespDTO> | null>(null);
  const [spettacoli, setSpettacoli] = useState<SpettacoloRespDTO[]>([]);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState(false);
  const [tentativo, setTentativo] = useState(0);

  const [modaleAperto, setModaleAperto] = useState(false);
  const [inModifica, setInModifica] = useState<MediaRespDTO | null>(null);
  const [form, setForm] = useState<NewMediaDTO>(formVuoto);
  const [inCorso, setInCorso] = useState(false);
  const notifica = useNotifica();

  function caricaTutto() {
    setCaricamento(true);
    Promise.all([
      mediaApi.lista({ size: 100 }),
      spettacoloApi.lista({ size: 100 }),
    ])
      .then(([paginaMedia, paginaSpettacoli]) => {
        setPagina(paginaMedia);
        setSpettacoli(paginaSpettacoli.content);
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
    setModaleAperto(true);
  }

  function apriModifica(m: MediaRespDTO) {
    setInModifica(m);
    setForm({
      url: m.url,
      tipoMedia: m.tipoMedia,
      titolo: m.titolo,
      idSpettacolo: m.idSpettacolo,
    });
    setModaleAperto(true);
  }

  async function handleSubmit(evento: FormEvent) {
    evento.preventDefault();
    setInCorso(true);
    try {
      if (inModifica) {
        await mediaApi.modifica(inModifica.id, form);
      } else {
        await mediaApi.crea(form);
      }
      setModaleAperto(false);
      caricaTutto();
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

  async function handleElimina(m: MediaRespDTO) {
    if (!window.confirm(`Eliminare "${m.titolo}"?`)) return;
    try {
      await mediaApi.elimina(m.id);
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

  const nessunoSpettacolo = spettacoli.length === 0;

  return (
    <Container className="page-container">
      <div className="dettaglio-intestazione">
        <h1>Media</h1>
        <Button
          className="btn-accent"
          onClick={apriCreazione}
          disabled={nessunoSpettacolo}
        >
          + Nuovo media
        </Button>
      </div>

      {nessunoSpettacolo && !caricamento && (
        <Alert variant="warning">
          Serve almeno uno spettacolo prima di poter aggiungere un media.
        </Alert>
      )}

      {caricamento ? (
        <StatoCaricamento testo="Caricamento media..." />
      ) : errore ? (
        <StatoErrore
          testo="Impossibile caricare i media."
          onRiprova={() => setTentativo((t) => t + 1)}
        />
      ) : !pagina || pagina.empty ? (
        <StatoVuoto testo="Nessun media caricato." />
      ) : (
        <>
          <AvvisoLimite pagina={pagina} />
          <Table responsive className="tabella-admin">
            <thead>
              <tr>
                <th>Titolo</th>
                <th>Tipo</th>
                <th>Spettacolo</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {pagina.content.map((m) => {
                const spettacolo = spettacoli.find(
                  (s) => s.id === m.idSpettacolo,
                );
                return (
                  <tr key={m.id}>
                    <td>{m.titolo}</td>
                    <td>{m.tipoMedia}</td>
                    <td>{spettacolo?.titolo ?? "—"}</td>
                    <td className="azioni-cella">
                      <Button
                        size="sm"
                        variant="outline-light"
                        onClick={() => apriModifica(m)}
                      >
                        Modifica
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => handleElimina(m)}
                      >
                        Elimina
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </>
      )}

      <Modal show={modaleAperto} onHide={() => setModaleAperto(false)} centered>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>
              {inModifica ? "Modifica media" : "Nuovo media"}
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
              value={form.url}
              onCaricata={(url) => setForm((p) => ({ ...p, url }))}
              etichetta="File (foto o video)"
              accept="image/*,video/*"
              mostraAnteprima={form.tipoMedia === "FOTO"}
              richiesta
            />
            <Form.Group className="mb-3">
              <Form.Label>Tipo</Form.Label>
              <Form.Select
                value={form.tipoMedia}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    tipoMedia: e.target.value as TipoMedia,
                  }))
                }
              >
                <option value="FOTO">Foto</option>
                <option value="MEDIA">Media (video/altro)</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Spettacolo</Form.Label>
              <Form.Select
                value={form.idSpettacolo}
                onChange={(e) =>
                  setForm((p) => ({ ...p, idSpettacolo: e.target.value }))
                }
                required
              >
                <option value="">Seleziona...</option>
                {spettacoli.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.titolo}
                  </option>
                ))}
              </Form.Select>
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

export default MediaAdmin;
