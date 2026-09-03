import { useEffect, useState } from "react";
import { Container, Table, Badge } from "react-bootstrap";
import { iscrizioneApi } from "@/api/iscrizioneApi";
import Paginazione from "@/components/common/Paginazione";
import {
  StatoCaricamento,
  StatoErrore,
  StatoVuoto,
} from "@/components/common/StatiLista";
import type {
  IscrizioneRespDTO,
  StatoIscrizione,
} from "@/interfaces/iscrizione";
import type { Page } from "@/interfaces/common";

const DIMENSIONE_PAGINA = 10;

const BADGE_STATO: Record<StatoIscrizione, string> = {
  ATTIVA: "success",
  COMPLETATA: "secondary",
  ANNULLATA: "danger",
};

function LeMieIscrizioni() {
  const [pagina, setPagina] = useState<Page<IscrizioneRespDTO> | null>(null);
  const [numeroPagina, setNumeroPagina] = useState(0);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState(false);
  const [tentativo, setTentativo] = useState(0);

  useEffect(() => {
    setCaricamento(true);
    iscrizioneApi
      .mie({ page: numeroPagina, size: DIMENSIONE_PAGINA })
      .then((risultato) => {
        setPagina(risultato);
        setErrore(false);
      })
      .catch(() => setErrore(true))
      .finally(() => setCaricamento(false));
    // eslint-disable-next-line react-hooks/set-state-in-effect
  }, [numeroPagina, tentativo]);

  return (
    <Container className="page-container">
      <h1>Le mie iscrizioni</h1>

      {caricamento ? (
        <StatoCaricamento testo="Caricamento iscrizioni..." />
      ) : errore ? (
        <StatoErrore
          testo="Impossibile caricare le tue iscrizioni."
          onRiprova={() => setTentativo((t) => t + 1)}
        />
      ) : !pagina || pagina.empty ? (
        <StatoVuoto testo="Non risulta ancora nessuna iscrizione a un corso." />
      ) : (
        <>
          <Table responsive className="tabella-admin">
            <thead>
              <tr>
                <th>Corso</th>
                <th>Data iscrizione</th>
                <th>Stato</th>
              </tr>
            </thead>
            <tbody>
              {pagina.content.map((iscrizione) => (
                <tr key={iscrizione.id}>
                  <td>{iscrizione.titoloCorso}</td>
                  <td>
                    {new Date(iscrizione.dataIscrizione).toLocaleDateString(
                      "it-IT",
                    )}
                  </td>
                  <td>
                    <Badge bg={BADGE_STATO[iscrizione.stato]}>
                      {iscrizione.stato}
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

export default LeMieIscrizioni;
