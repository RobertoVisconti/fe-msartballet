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
import SelectRicercabile from "@/components/common/SelectRicercabile";
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

  const [filtroUtente, setFiltroUtente] = useState("");

  const [filtroAcquisto, setFiltroAcquisto] = useState("");
  const [dataDa, setDataDa] = useState("");
  const [dataA, setDataA] = useState("");

  const [modaleAperto, setModaleAperto] = useState(false);
  const [form, setForm] = useState(formVuoto);
  const [inCorso, setInCorso] = useState(false);
  const notifica = useNotifica();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function caricaTransazioni() {
    setCaricamento(true);
    const [tipoScelto, idScelto] = filtroAcquisto.split(":");
    transazioneApi
      .lista({
        page: numeroPagina,
        size: DIMENSIONE_PAGINA,
        idUtente: filtroUtente || undefined,
        idProdotto: tipoScelto === "PRODOTTO" ? idScelto : undefined,
        idCorso: tipoScelto === "CORSO" ? idScelto : undefined,
        idSala: tipoScelto === "SALA" ? idScelto : undefined,
        dal: dataDa ? `${dataDa}T00:00:00` : undefined,
        al: dataA ? `${dataA}T23:59:59` : undefined,
      })
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numeroPagina, tentativo, filtroUtente, filtroAcquisto, dataDa, dataA]);

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

  // Tutto il filtrabile in una lista sola, con il tipo davanti all'etichetta.
  function opzioniFiltroAcquisto() {
    return [
      ...prodotti.map((p) => ({
        id: `PRODOTTO:${p.id}`,
        etichetta: `Prodotto · ${p.titolo}`,
      })),
      ...corsi.map((c) => ({
        id: `CORSO:${c.id}`,
        etichetta: `Corso · ${c.titolo}`,
      })),
      ...sale.map((s) => ({
        id: `SALA:${s.id}`,
        etichetta: `Sala · ${s.titolo}`,
      })),
    ];
  }

  function azzeraFiltri() {
    setNumeroPagina(0);
    setFiltroUtente("");
    setFiltroAcquisto("");
    setDataDa("");
    setDataA("");
  }

  const filtriAttivi =
    filtroUtente !== "" ||
    filtroAcquisto !== "" ||
    dataDa !== "" ||
    dataA !== "";

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

      <Row className="filtri-riga">
        <Col md={6}>
          <SelectRicercabile
            opzioni={utenti}
            value={filtroUtente}
            onChange={(id) => {
              setNumeroPagina(0);
              setFiltroUtente(id);
            }}
            placeholder="Tutti gli utenti"
            disabled={!riferimentiCaricati}
          />
        </Col>
        <Col md={6}>
          <SelectRicercabile
            opzioni={opzioniFiltroAcquisto()}
            value={filtroAcquisto}
            onChange={(id) => {
              setNumeroPagina(0);
              setFiltroAcquisto(id);
            }}
            placeholder="Tutti gli acquisti"
            disabled={!riferimentiCaricati}
          />
        </Col>
      </Row>

      <Row className="filtri-riga">
        <Col md={4}>
          <Form.Group>
            <Form.Label className="testo-secondario">Dal</Form.Label>
            <Form.Control
              type="date"
              value={dataDa}
              onChange={(e) => {
                setNumeroPagina(0);
                setDataDa(e.target.value);
              }}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label className="testo-secondario">Al</Form.Label>
            <Form.Control
              type="date"
              value={dataA}
              onChange={(e) => {
                setNumeroPagina(0);
                setDataA(e.target.value);
              }}
            />
          </Form.Group>
        </Col>
        {filtriAttivi && (
          <Col md={4} className="d-flex align-items-end">
            <Button variant="outline-light" onClick={azzeraFiltri}>
              Azzera filtri
            </Button>
          </Col>
        )}
      </Row>

      {caricamento ? (
        <StatoCaricamento testo="Caricamento transazioni..." />
      ) : errore ? (
        <StatoErrore
          testo="Impossibile caricare le transazioni."
          onRiprova={() => setTentativo((t) => t + 1)}
        />
      ) : !pagina || pagina.empty ? (
        <StatoVuoto
          testo={
            filtriAttivi
              ? "Nessuna transazione corrisponde ai filtri impostati."
              : "Nessuna transazione registrata."
          }
        />
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
              <SelectRicercabile
                opzioni={utenti}
                value={form.idUtente}
                onChange={(id) => setForm((p) => ({ ...p, idUtente: id }))}
                required
              />
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
                  <SelectRicercabile
                    opzioni={opzioniAcquisto()}
                    value={form.idAcquisto}
                    onChange={(id) =>
                      setForm((p) => ({ ...p, idAcquisto: id }))
                    }
                    required
                  />
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
