import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  Container,
  Table,
  Button,
  Modal,
  Form,
  Spinner,
  Row,
  Col,
} from "react-bootstrap";
import type { AxiosError } from "axios";
import { transazioneApi } from "@/api/transazioneApi";
import { allievoApi } from "@/api/allievoApi";
import { ospiteApi } from "@/api/ospiteApi";
import { prodottoApi } from "@/api/prodottoApi";
import { corsoApi } from "@/api/corsoApi";
import { salaApi } from "@/api/salaApi";
import { useNotifica } from "@/components/common/ToastProvider";
import type {
  TransazioneRespDTO,
  NewTransazioneDTO,
} from "@/interfaces/transazione";
import type {
  ProdottoRespDTO,
  CorsoRespDTO,
  SalaRespDTO,
} from "@/interfaces/catalogo";
import type { ErrorsDTO } from "@/interfaces/common";

type TipoAcquisto = "PRODOTTO" | "CORSO" | "SALA";

interface UtenteAcquirente {
  id: string;
  etichetta: string;
}

const formVuoto = {
  metodoPagamento: "",
  idUtente: "",
  tipoAcquisto: "PRODOTTO" as TipoAcquisto,
  idAcquisto: "",
};

function TransazioniAdmin() {
  const [transazioni, setTransazioni] = useState<TransazioneRespDTO[]>([]);
  const [utenti, setUtenti] = useState<UtenteAcquirente[]>([]);
  const [prodotti, setProdotti] = useState<ProdottoRespDTO[]>([]);
  const [corsi, setCorsi] = useState<CorsoRespDTO[]>([]);
  const [sale, setSale] = useState<SalaRespDTO[]>([]);
  const [caricamento, setCaricamento] = useState(true);

  const [modaleAperto, setModaleAperto] = useState(false);
  const [form, setForm] = useState(formVuoto);
  const [inCorso, setInCorso] = useState(false);
  const notifica = useNotifica();

  function caricaTutto() {
    setCaricamento(true);
    Promise.all([
      transazioneApi.lista({ size: 100 }),
      allievoApi.lista({ size: 100 }),
      ospiteApi.lista({ size: 100 }),
      prodottoApi.lista({ size: 100 }),
      corsoApi.lista({ size: 100 }),
      salaApi.lista({ size: 100 }),
    ])
      .then(
        ([
          paginaTransazioni,
          paginaAllievi,
          paginaOspiti,
          paginaProdotti,
          paginaCorsi,
          paginaSale,
        ]) => {
          setTransazioni(paginaTransazioni.content);
          const allieviEtichettati = paginaAllievi.content.map((a) => ({
            id: a.id,
            etichetta: `${a.nome} ${a.cognome} (Allievo)`,
          }));
          const ospitiEtichettati = paginaOspiti.content.map((o) => ({
            id: o.id,
            etichetta: `${o.nome} ${o.cognome} (Ospite)`,
          }));
          setUtenti([...allieviEtichettati, ...ospitiEtichettati]);
          setProdotti(paginaProdotti.content);
          setCorsi(paginaCorsi.content);
          setSale(paginaSale.content);
        },
      )
      .catch(() => notifica("Impossibile caricare i dati", "errore"))
      .finally(() => setCaricamento(false));
  }

  useEffect(() => {
    caricaTutto();
  }, []);

  function apriCreazione() {
    setForm(formVuoto);
    setModaleAperto(true);
  }

  async function handleSubmit(evento: FormEvent) {
    evento.preventDefault();
    setInCorso(true);
    try {
      const dto: NewTransazioneDTO = {
        metodoPagamento: form.metodoPagamento,
        idUtente: form.idUtente,
        idProdotto:
          form.tipoAcquisto === "PRODOTTO" ? form.idAcquisto : undefined,
        idCorso: form.tipoAcquisto === "CORSO" ? form.idAcquisto : undefined,
        idSala: form.tipoAcquisto === "SALA" ? form.idAcquisto : undefined,
      };
      await transazioneApi.crea(dto);
      setModaleAperto(false);
      caricaTutto();
    } catch (err) {
      const error = err as AxiosError<ErrorsDTO>;
      notifica(
        error.response?.data?.message ?? "Registrazione non riuscita",
        "errore",
      );
    } finally {
      setInCorso(false);
    }
  }

  async function handleElimina(transazione: TransazioneRespDTO) {
    if (!window.confirm("Eliminare questa transazione?")) return;
    try {
      await transazioneApi.elimina(transazione.id);
      caricaTutto();
    } catch (err) {
      const error = err as AxiosError<ErrorsDTO>;
      notifica(
        error.response?.data?.message ?? "Eliminazione non riuscita",
        "errore",
      );
    }
  }

  function etichettaUtente(id: string): string {
    return utenti.find((u) => u.id === id)?.etichetta ?? "—";
  }

  function etichettaAcquisto(transazione: TransazioneRespDTO): string {
    if (transazione.idProdotto)
      return (
        prodotti.find((p) => p.id === transazione.idProdotto)?.titolo ??
        "Prodotto"
      );
    if (transazione.idCorso)
      return corsi.find((c) => c.id === transazione.idCorso)?.titolo ?? "Corso";
    if (transazione.idSala)
      return sale.find((s) => s.id === transazione.idSala)?.titolo ?? "Sala";
    return "—";
  }

  function opzioniAcquisto() {
    if (form.tipoAcquisto === "PRODOTTO")
      return prodotti.map((p) => ({ id: p.id, etichetta: p.titolo }));
    if (form.tipoAcquisto === "CORSO")
      return corsi.map((c) => ({ id: c.id, etichetta: c.titolo }));
    return sale.map((s) => ({ id: s.id, etichetta: s.titolo }));
  }

  return (
    <Container className="page-container">
      <div className="dettaglio-intestazione">
        <h1>Transazioni</h1>
        <Button className="btn-accent" onClick={apriCreazione}>
          + Nuova transazione
        </Button>
      </div>

      {caricamento ? (
        <Spinner animation="border" />
      ) : (
        <Table responsive className="tabella-admin">
          <thead>
            <tr>
              <th>Data</th>
              <th>Utente</th>
              <th>Acquisto</th>
              <th>Importo</th>
              <th>Metodo</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {transazioni.map((transazione) => (
              <tr key={transazione.id}>
                <td>
                  {new Date(transazione.dataTransazione).toLocaleString(
                    "it-IT",
                  )}
                </td>
                <td>{etichettaUtente(transazione.idUtente)}</td>
                <td>{etichettaAcquisto(transazione)}</td>
                <td>€ {transazione.importo}</td>
                <td>{transazione.metodoPagamento}</td>
                <td className="azioni-cella">
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => handleElimina(transazione)}
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
            <Modal.Title>Nuova transazione</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Utente</Form.Label>
              <Form.Select
                value={form.idUtente}
                onChange={(e) =>
                  setForm((p) => ({ ...p, idUtente: e.target.value }))
                }
                required
              >
                <option value="">Seleziona...</option>
                {utenti.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.etichetta}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Metodo di pagamento</Form.Label>
              <Form.Control
                value={form.metodoPagamento}
                onChange={(e) =>
                  setForm((p) => ({ ...p, metodoPagamento: e.target.value }))
                }
                placeholder="Carta, contanti, bonifico..."
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cosa acquista</Form.Label>
              <Row>
                <Col xs={5}>
                  <Form.Select
                    value={form.tipoAcquisto}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        tipoAcquisto: e.target.value as TipoAcquisto,
                        idAcquisto: "",
                      }))
                    }
                  >
                    <option value="PRODOTTO">Prodotto</option>
                    <option value="CORSO">Corso</option>
                    <option value="SALA">Sala</option>
                  </Form.Select>
                </Col>
                <Col xs={7}>
                  <Form.Select
                    value={form.idAcquisto}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, idAcquisto: e.target.value }))
                    }
                    required
                  >
                    <option value="">Seleziona...</option>
                    {opzioniAcquisto().map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.etichetta}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
              </Row>
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
              {inCorso ? "Registrazione..." : "Registra"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}

export default TransazioniAdmin;
