import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Table, Button, Badge } from "react-bootstrap";
import type { AxiosError } from "axios";
import { insegnanteApi } from "@/api/insegnanteApi";
import { useNotifica } from "@/components/common/ToastProvider";
import Paginazione from "@/components/common/Paginazione";
import {
  StatoCaricamento,
  StatoErrore,
  StatoVuoto,
} from "@/components/common/StatiLista";
import type { InsegnanteRespDTO } from "@/interfaces/utente";
import type { Page, ErrorsDTO } from "@/interfaces/common";

const DIMENSIONE_PAGINA = 20;

function InsegnantiList() {
  const [pagina, setPagina] = useState<Page<InsegnanteRespDTO> | null>(null);
  const [numeroPagina, setNumeroPagina] = useState(0);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState(false);
  const [tentativo, setTentativo] = useState(0);
  const notifica = useNotifica();

  useEffect(() => {
    setCaricamento(true);
    insegnanteApi
      .lista({ page: numeroPagina, size: DIMENSIONE_PAGINA })
      .then((risultato) => {
        setPagina(risultato);
        setErrore(false);
      })
      .catch(() => {
        setErrore(true);
        notifica("Impossibile caricare gli insegnanti", "errore");
      })
      .finally(() => setCaricamento(false));
  }, [numeroPagina, tentativo]);

  async function toggleAttivo(insegnante: InsegnanteRespDTO) {
    const azione = insegnante.accountAttivo
      ? insegnanteApi.disattiva
      : insegnanteApi.riattiva;
    try {
      const aggiornato = await azione(insegnante.id);
      setPagina((precedente) =>
        precedente
          ? {
              ...precedente,
              content: precedente.content.map((i) =>
                i.id === aggiornato.id ? aggiornato : i,
              ),
            }
          : precedente,
      );
    } catch (err) {
      const error = err as AxiosError<ErrorsDTO>;
      notifica(
        error.response?.data?.message ?? "Operazione non riuscita",
        "errore",
      );
    }
  }

  return (
    <Container className="page-container">
      <h1>Gestione Insegnanti</h1>

      {caricamento ? (
        <StatoCaricamento testo="Caricamento insegnanti..." />
      ) : errore ? (
        <StatoErrore
          testo="Impossibile caricare gli insegnanti."
          onRiprova={() => setTentativo((t) => t + 1)}
        />
      ) : !pagina || pagina.empty ? (
        <StatoVuoto testo="Nessun insegnante registrato." />
      ) : (
        <>
          <Table responsive className="tabella-admin">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Cognome</th>
                <th>Email</th>
                <th>Stato</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {pagina.content.map((insegnante) => (
                <tr key={insegnante.id}>
                  <td>{insegnante.nome}</td>
                  <td>{insegnante.cognome}</td>
                  <td>{insegnante.email}</td>
                  <td>
                    <Badge
                      bg={insegnante.accountAttivo ? "success" : "secondary"}
                    >
                      {insegnante.accountAttivo ? "Attivo" : "Disattivato"}
                    </Badge>
                  </td>
                  <td className="azioni-cella">
                    <Link to={`/admin/insegnanti/${insegnante.id}`}>Apri</Link>
                    <Button
                      size="sm"
                      variant="outline-light"
                      onClick={() => toggleAttivo(insegnante)}
                    >
                      {insegnante.accountAttivo ? "Disattiva" : "Riattiva"}
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

export default InsegnantiList;
