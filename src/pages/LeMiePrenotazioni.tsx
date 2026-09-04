import { useEffect, useState } from "react";
import { Container, Table, Badge } from "react-bootstrap";
import { prenotazioneApi } from "@/api/prenotazioneApi";
import { lezioneApi } from "@/api/lezioneApi";
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
import type { Page } from "@/interfaces/common";

const DIMENSIONE_PAGINA = 10;

const BADGE_STATO: Record<StatoPrenotazione, string> = {
  IN_ATTESA: "warning",
  CONFERMATA: "success",
  ANNULLATA: "danger",
  COMPLETATA: "secondary",
};

function LeMiePrenotazioni() {
  const [pagina, setPagina] = useState<Page<PrenotazioneRespDTO> | null>(null);
  const [numeroPagina, setNumeroPagina] = useState(0);
  const [lezioni, setLezioni] = useState<LezioneRespDTO[]>([]);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState(false);
  const [tentativo, setTentativo] = useState(0);

  useEffect(() => {
    lezioneApi
      .lista({ size: 100 })
      .then((pagina) => setLezioni(pagina.content));
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCaricamento(true);
    prenotazioneApi
      .mie({ page: numeroPagina, size: DIMENSIONE_PAGINA })
      .then((risultato) => {
        setPagina(risultato);
        setErrore(false);
      })
      .catch(() => setErrore(true))
      .finally(() => setCaricamento(false));
  }, [numeroPagina, tentativo]);

  function etichettaLezione(idLezione: string): string {
    const lezione = lezioni.find((l) => l.id === idLezione);
    if (!lezione) return "—";
    return `${lezione.titoloCorso} — ${new Date(lezione.dataOraInizio).toLocaleString("it-IT")}`;
  }

  return (
    <Container className="page-container">
      <h1>Le mie prenotazioni</h1>

      {caricamento ? (
        <StatoCaricamento testo="Caricamento prenotazioni..." />
      ) : errore ? (
        <StatoErrore
          testo="Impossibile caricare le tue prenotazioni."
          onRiprova={() => setTentativo((t) => t + 1)}
        />
      ) : !pagina || pagina.empty ? (
        <StatoVuoto testo="Non risulta ancora nessuna prenotazione." />
      ) : (
        <>
          <Table responsive className="tabella-admin">
            <thead>
              <tr>
                <th>Lezione</th>
                <th>Data prenotazione</th>
                <th>Stato</th>
              </tr>
            </thead>
            <tbody>
              {pagina.content.map((prenotazione) => (
                <tr key={prenotazione.id}>
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

export default LeMiePrenotazioni;
