import { useEffect, useState } from "react";
import {
  Container,
  Table,
  Form,
  Row,
  Col,
  Badge,
  Spinner,
  Button,
} from "react-bootstrap";
import type { AxiosError } from "axios";
import { prenotazioneApi } from "@/api/prenotazioneApi";
import { lezioneApi } from "@/api/lezioneApi";
import { useNotifica } from "@/components/common/ToastProvider";
import type {
  PrenotazioneRespDTO,
  StatoPrenotazione,
} from "@/interfaces/prenotazione";
import type { LezioneRespDTO } from "@/interfaces/lezione";
import type { ErrorsDTO } from "@/interfaces/common";

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
  const [prenotazioni, setPrenotazioni] = useState<PrenotazioneRespDTO[]>([]);
  const [lezioni, setLezioni] = useState<LezioneRespDTO[]>([]);
  const [filtroLezione, setFiltroLezione] = useState("");
  const [filtroStato, setFiltroStato] = useState("");
  const [caricamento, setCaricamento] = useState(true);
  const notifica = useNotifica();

  useEffect(() => {
    lezioneApi
      .lista({ size: 100 })
      .then((pagina) => setLezioni(pagina.content));
  }, []);

  function caricaLista() {
    setCaricamento(true);
    prenotazioneApi
      .lista({
        idLezione: filtroLezione || undefined,
        stato: filtroStato || undefined,
        size: 100,
      })
      .then((pagina) => setPrenotazioni(pagina.content))
      .catch(() => notifica("Impossibile caricare le prenotazioni", "errore"))
      .finally(() => setCaricamento(false));
  }

  useEffect(() => {
    caricaLista();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroLezione, filtroStato]);

  async function cambiaStato(
    prenotazione: PrenotazioneRespDTO,
    nuovoStato: StatoPrenotazione,
  ) {
    try {
      const aggiornata = await prenotazioneApi.cambiaStato(prenotazione.id, {
        statoPrenotazione: nuovoStato,
      });
      setPrenotazioni((precedente) =>
        precedente.map((p) => (p.id === aggiornata.id ? aggiornata : p)),
      );
    } catch (err) {
      const error = err as AxiosError<ErrorsDTO>;
      notifica(
        error.response?.data?.message ?? "Cambio stato non riuscito",
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
      caricaLista();
    } catch (err) {
      const error = err as AxiosError<ErrorsDTO>;
      notifica(
        error.response?.data?.message ?? "Eliminazione non riuscita",
        "errore",
      );
    }
  }

  function etichettaLezione(idLezione: string): string {
    const lezione = lezioni.find((l) => l.id === idLezione);
    if (!lezione) return "—";
    return `${lezione.titoloCorso} — ${new Date(lezione.dataOraInizio).toLocaleString("it-IT")}`;
  }

  return (
    <Container className="page-container">
      <h1>Prenotazioni</h1>

      <Row className="filtri-riga">
        <Col md={6}>
          <Form.Select
            value={filtroLezione}
            onChange={(e) => setFiltroLezione(e.target.value)}
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
            onChange={(e) => setFiltroStato(e.target.value)}
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

      {caricamento ? (
        <Spinner animation="border" />
      ) : (
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
            {prenotazioni.map((prenotazione) => (
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
      )}
    </Container>
  );
}

export default PrenotazioniAdmin;
