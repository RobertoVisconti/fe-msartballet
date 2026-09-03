import { useEffect, useState } from "react";
import {
  Container,
  Table,
  Form,
  Row,
  Col,
  Badge,
  Button,
} from "react-bootstrap";
import type { AxiosError } from "axios";
import { prenotazioneApi } from "@/api/prenotazioneApi";
import { lezioneApi } from "@/api/lezioneApi";
import { corsoApi } from "@/api/corsoApi";
import { useNotifica } from "@/components/common/ToastProvider";
import { estraiMessaggioErrore } from "@/utils/erroreApi";
import Paginazione from "@/components/common/Paginazione";
import {
  StatoCaricamento,
  StatoErrore,
  StatoVuoto,
} from "@/components/common/StatiLista";
import type {
  PrenotazioneRespDTO,
  StatoPrenotazione,
} from "@/interfaces/prenotazione";
import type { LezioneRespDTO } from "@/interfaces/lezione";
import type { CorsoRespDTO } from "@/interfaces/catalogo";
import type { Page, ErrorsDTO } from "@/interfaces/common";

const DIMENSIONE_PAGINA = 20;

const STATI: StatoPrenotazione[] = [
  "IN_ATTESA",
  "CONFERMATA",
  "ANNULLATA",
  "COMPLETATA",
];

const BADGE_STATO: Record<StatoPrenotazione, string> = {
  IN_ATTESA: "warning",
  CONFERMATA: "success",
  ANNULLATA: "danger",
  COMPLETATA: "secondary",
};

function PrenotazioniAdmin() {
  const [pagina, setPagina] = useState<Page<PrenotazioneRespDTO> | null>(null);
  const [numeroPagina, setNumeroPagina] = useState(0);
  const [lezioni, setLezioni] = useState<LezioneRespDTO[]>([]);
  const [corsi, setCorsi] = useState<CorsoRespDTO[]>([]);
  const [filtroLezione, setFiltroLezione] = useState("");
  const [filtroStato, setFiltroStato] = useState("");
  const [filtroCorso, setFiltroCorso] = useState("");
  const [dataDa, setDataDa] = useState("");
  const [dataA, setDataA] = useState("");
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState(false);
  const [tentativo, setTentativo] = useState(0);
  const notifica = useNotifica();

  useEffect(() => {
    lezioneApi
      .lista({ size: 100 })
      .then((pagina) => setLezioni(pagina.content));
    corsoApi.lista({ size: 100 }).then((pagina) => setCorsi(pagina.content));
  }, []);

  function caricaLista() {
    setCaricamento(true);
    prenotazioneApi
      .lista({
        idLezione: filtroLezione || undefined,
        stato: filtroStato || undefined,
        idCorso: filtroCorso || undefined,
        dataDa: dataDa || undefined,
        dataA: dataA || undefined,
        page: numeroPagina,
        size: DIMENSIONE_PAGINA,
      })
      .then((risultato) => {
        setPagina(risultato);
        setErrore(false);
      })
      .catch(() => {
        setErrore(true);
        notifica("Impossibile caricare le prenotazioni", "errore");
      })
      .finally(() => setCaricamento(false));
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    caricaLista();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filtroLezione,
    filtroStato,
    filtroCorso,
    dataDa,
    dataA,
    numeroPagina,
    tentativo,
  ]);

  async function cambiaStato(
    prenotazione: PrenotazioneRespDTO,
    nuovoStato: StatoPrenotazione,
  ) {
    try {
      const aggiornata = await prenotazioneApi.cambiaStato(prenotazione.id, {
        statoPrenotazione: nuovoStato,
      });
      setPagina((precedente) =>
        precedente
          ? {
              ...precedente,
              content: precedente.content.map((p) =>
                p.id === aggiornata.id ? aggiornata : p,
              ),
            }
          : precedente,
      );
    } catch (err) {
      const error = err as AxiosError<ErrorsDTO>;
      notifica(
        estraiMessaggioErrore(
          error.response?.data,
          "Cambio stato non riuscito",
        ),
        "errore",
      );
    }
  }

  async function handleElimina(prenotazione: PrenotazioneRespDTO) {
    if (
      !window.confirm(
        `Eliminare la prenotazione di ${prenotazione.nomeUtente}?`,
      )
    )
      return;
    try {
      await prenotazioneApi.elimina(prenotazione.id);
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

  function etichettaLezione(idLezione: string): string {
    const lezione = lezioni.find((l) => l.id === idLezione);
    if (!lezione) return "—";
    return `${lezione.titoloCorso} — ${new Date(lezione.dataOraInizio).toLocaleString("it-IT")}`;
  }

  const filtriAttivi =
    filtroLezione !== "" ||
    filtroStato !== "" ||
    filtroCorso !== "" ||
    dataDa !== "" ||
    dataA !== "";

  return (
    <Container className="page-container">
      <h1>Prenotazioni</h1>

      <Row className="filtri-riga">
        <Col md={6}>
          <Form.Select
            value={filtroLezione}
            onChange={(e) => {
              setNumeroPagina(0);
              setFiltroLezione(e.target.value);
            }}
          >
            <option value="">Tutte le lezioni</option>
            {lezioni.map((l) => (
              <option key={l.id} value={l.id}>
                {l.titoloCorso} —{" "}
                {new Date(l.dataOraInizio).toLocaleString("it-IT")}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={6}>
          <Form.Select
            value={filtroStato}
            onChange={(e) => {
              setNumeroPagina(0);
              setFiltroStato(e.target.value);
            }}
          >
            <option value="">Tutti gli stati</option>
            {STATI.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      <Row className="filtri-riga">
        <Col md={4}>
          <Form.Select
            value={filtroCorso}
            onChange={(e) => {
              setNumeroPagina(0);
              setFiltroCorso(e.target.value);
            }}
          >
            <option value="">Tutti i corsi</option>
            {corsi.map((c) => (
              <option key={c.id} value={c.id}>
                {c.titolo}
              </option>
            ))}
          </Form.Select>
        </Col>
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
      </Row>

      {caricamento ? (
        <StatoCaricamento testo="Caricamento prenotazioni..." />
      ) : errore ? (
        <StatoErrore
          testo="Impossibile caricare le prenotazioni."
          onRiprova={() => setTentativo((t) => t + 1)}
        />
      ) : !pagina || pagina.empty ? (
        <StatoVuoto
          testo={
            filtriAttivi
              ? "Nessuna prenotazione corrisponde ai filtri impostati."
              : "Nessuna prenotazione registrata."
          }
        />
      ) : (
        <>
          <Table responsive className="tabella-admin">
            <thead>
              <tr>
                <th>Utente</th>
                <th>Lezione</th>
                <th>Data prenotazione</th>
                <th>Stato</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {pagina.content.map((prenotazione) => (
                <tr key={prenotazione.id}>
                  <td>{prenotazione.nomeUtente}</td>
                  <td>{etichettaLezione(prenotazione.idLezione)}</td>
                  <td>
                    {new Date(prenotazione.dataPrenotazione).toLocaleDateString(
                      "it-IT",
                    )}
                  </td>
                  <td>
                    <Badge bg={BADGE_STATO[prenotazione.statoPrenotazione]}>
                      {prenotazione.statoPrenotazione}
                    </Badge>
                  </td>
                  <td className="azioni-cella">
                    <Form.Select
                      size="sm"
                      className="azioni-select-stato"
                      value={prenotazione.statoPrenotazione}
                      onChange={(e) =>
                        cambiaStato(
                          prenotazione,
                          e.target.value as StatoPrenotazione,
                        )
                      }
                    >
                      {STATI.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </Form.Select>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => handleElimina(prenotazione)}
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
    </Container>
  );
}

export default PrenotazioniAdmin;
