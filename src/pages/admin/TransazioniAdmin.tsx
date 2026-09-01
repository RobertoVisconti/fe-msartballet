import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  Container,
  Table,
  Button,
  Modal,
  Form,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import type { AxiosError } from "axios";
import { transazioneApi } from "@/api/transazioneApi";
import { allievoApi } from "@/api/allievoApi";
import { prodottoApi } from "@/api/prodottoApi";
import { corsoApi } from "@/api/corsoApi";
import { salaApi } from "@/api/salaApi";
import { useNotifica } from "@/components/common/ToastProvider";
import { estraiMessaggioErrore } from "@/utils/erroreApi";
import { formattaPrezzo } from "@/utils/formattaPrezzo";
import Paginazione from "@/components/common/Paginazione";
import {
  StatoCaricamento,
  StatoErrore,
  StatoVuoto,
} from "@/components/common/StatiLista";
import type {
  TransazioneRespDTO,
  NewTransazioneDTO,
} from "@/interfaces/transazione";
import type {
  ProdottoRespDTO,
  CorsoRespDTO,
  SalaRespDTO,
} from "@/interfaces/catalogo";
import type { Page, ErrorsDTO } from "@/interfaces/common";

const DIMENSIONE_PAGINA = 20;

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
  const [pagina, setPagina] = useState<Page<TransazioneRespDTO> | null>(null);
  const [numeroPagina, setNumeroPagina] = useState(0);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState(false);
  const [tentativo, setTentativo] = useState(0);

  const [utenti, setUtenti] = useState<UtenteAcquirente[]>([]);
  const [prodotti, setProdotti] = useState<ProdottoRespDTO[]>([]);
  const [corsi, setCorsi] = useState<CorsoRespDTO[]>([]);
  const [sale, setSale] = useState<SalaRespDTO[]>([]);
  const [riferimentiCaricati, setRiferimentiCaricati] = useState(false);

  const [modaleAperto, setModaleAperto] = useState(false);
  const [form, setForm] = useState(formVuoto);
  const [inCorso, setInCorso] = useState(false);
  const notifica = useNotifica();

  // Dati per le select del modale: cambiano raramente, si caricano una
  // sola volta e non seguono la paginazione della tabella. Gli ospiti non
  // compaiono come acquirenti: non possono effettuare acquisti.
  useEffect(() => {
    Promise.all([
      allievoApi.lista({ size: 100 }),
      prodottoApi.lista({ size: 100 }),
      corsoApi.lista({ size: 100 }),
      salaApi.lista({ size: 100 }),
    ])
      .then(([paginaAllievi, paginaProdotti, paginaCorsi, paginaSale]) => {
        const allieviEtichettati = paginaAllievi.content.map((a) => ({
          id: a.id,
          etichetta: `${a.nome} ${a.cognome} (Allievo)`,
        }));
        setUtenti(allieviEtichettati);
        setProdotti(paginaProdotti.content);
        setCorsi(paginaCorsi.content);
        setSale(paginaSale.content);
      })
      .catch(() =>
        notifica("Impossibile caricare i dati di riferimento", "errore"),
      )
      .finally(() => setRiferimentiCaricati(true));
  }, []);

  function caricaTransazioni() {
    setCaricamento(true);
    transazioneApi
      .lista({ page: numeroPagina, size: DIMENSIONE_PAGINA })
      .then((risultato) => {
        setPagina(risultato);
        setErrore(false);
      })
      .catch(() => {
        setErrore(true);
        notifica("Impossibile caricare le transazioni", "errore");
      })
      .finally(() => setCaricamento(false));
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    caricaTransazioni();
  }, [numeroPagina, tentativo]);

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
      caricaTransazioni();
    } catch (err) {
      const error = err as AxiosError<ErrorsDTO>;
      notifica(
        estraiMessaggioErrore(
          error.response?.data,
          "Registrazione non riuscita",
        ),
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
      if (pagina && pagina.numberOfElements === 1 && !pagina.first) {
        setNumeroPagina((n) => n - 1);
      } else {
        caricaTransazioni();
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

  const nessunUtente = riferimentiCaricati && utenti.length === 0;

  return (
    <Container className="page-container">
      <div className="dettaglio-intestazione">
        <h1>Transazioni</h1>
        <Button
          className="btn-accent"
          onClick={apriCreazione}
          disabled={!riferimentiCaricati || nessunUtente}
        >
          + Nuova transazione
        </Button>
      </div>
      {nessunUtente && (
        <Alert variant="warning">
          Serve almeno un allievo prima di poter registrare una transazione.
        </Alert>
      )}

      {caricamento ? (
        <StatoCaricamento testo="Caricamento transazioni..." />
      ) : errore ? (
        <StatoErrore
          testo="Impossibile caricare le transazioni."
          onRiprova={() => setTentativo((t) => t + 1)}
        />
      ) : !pagina || pagina.empty ? (
        <StatoVuoto testo="Nessuna transazione registrata." />
      ) : (
        <>
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
              {pagina.content.map((transazione) => (
                <tr key={transazione.id}>
                  <td>
                    {new Date(transazione.dataTransazione).toLocaleString(
                      "it-IT",
                    )}
                  </td>
                  <td>{etichettaUtente(transazione.idUtente)}</td>
                  <td>{etichettaAcquisto(transazione)}</td>
                  <td>{formattaPrezzo(transazione.importo)}</td>
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

          <Paginazione pagina={pagina} onCambiaPagina={setNumeroPagina} />
        </>
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
