import { useEffect, useState } from "react";
import { Container, Table, Button, Badge } from "react-bootstrap";
import type { AxiosError } from "axios";
import { adminApi } from "@/api/adminApi";
import { authApi } from "@/api/authApi";
import { useNotifica } from "@/components/common/ToastProvider";
import { estraiMessaggioErrore } from "@/utils/erroreApi";
import Paginazione from "@/components/common/Paginazione";
import {
  StatoCaricamento,
  StatoErrore,
  StatoVuoto,
} from "@/components/common/StatiLista";
import type { AdminRespDTO } from "@/interfaces/utente";
import type { Page, ErrorsDTO } from "@/interfaces/common";

const DIMENSIONE_PAGINA = 20;

function GestioneAdmin() {
  const [pagina, setPagina] = useState<Page<AdminRespDTO> | null>(null);
  const [numeroPagina, setNumeroPagina] = useState(0);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState(false);
  const [tentativo, setTentativo] = useState(0);
  const notifica = useNotifica();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCaricamento(true);
    adminApi
      .lista({ page: numeroPagina, size: DIMENSIONE_PAGINA })
      .then((risultato) => {
        setPagina(risultato);
        setErrore(false);
      })
      .catch(() => {
        setErrore(true);
        notifica("Impossibile caricare gli admin", "errore");
      })
      .finally(() => setCaricamento(false));
  }, [numeroPagina, tentativo]);

  async function toggleAttivo(admin: AdminRespDTO) {
    const azione = admin.accountAttivo
      ? adminApi.disattiva
      : adminApi.riattiva;
    try {
      const aggiornato = await azione(admin.id);
      setPagina((precedente) =>
        precedente
          ? {
              ...precedente,
              content: precedente.content.map((a) =>
                a.id === aggiornato.id ? aggiornato : a,
              ),
            }
          : precedente,
      );
    } catch (err) {
      const error = err as AxiosError<ErrorsDTO>;
      notifica(
        estraiMessaggioErrore(error.response?.data, "Operazione non riuscita"),
        "errore",
      );
    }
  }

  async function reinviaLink(admin: AdminRespDTO) {
    try {
      await authApi.reinviaAttivazione({ email: admin.email });
      notifica("Link di attivazione reinviato", "successo");
    } catch (err) {
      const error = err as AxiosError<ErrorsDTO>;
      notifica(
        estraiMessaggioErrore(error.response?.data, "Invio non riuscito"),
        "errore",
      );
    }
  }

  return (
    <Container className="page-container">
      <h1>Gestione Admin</h1>

      {caricamento ? (
        <StatoCaricamento testo="Caricamento admin..." />
      ) : errore ? (
        <StatoErrore
          testo="Impossibile caricare gli admin."
          onRiprova={() => setTentativo((t) => t + 1)}
        />
      ) : !pagina || pagina.empty ? (
        <StatoVuoto testo="Nessun admin registrato." />
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
              {pagina.content.map((admin) => (
                <tr key={admin.id}>
                  <td>{admin.nome}</td>
                  <td>{admin.cognome}</td>
                  <td>{admin.email}</td>
                  <td>
                    <Badge
                      bg={
                        admin.maiAttivato
                          ? "warning"
                          : admin.accountAttivo
                            ? "success"
                            : "secondary"
                      }
                    >
                      {admin.maiAttivato
                        ? "Mai attivato"
                        : admin.accountAttivo
                          ? "Attivo"
                          : "Disattivato"}
                    </Badge>
                  </td>
                  <td className="azioni-cella">
                    {admin.protetto ? (
                      <Badge bg="light" text="dark">
                        Protetto
                      </Badge>
                    ) : admin.maiAttivato ? (
                      <Button
                        size="sm"
                        variant="outline-light"
                        onClick={() => reinviaLink(admin)}
                      >
                        Reinvia link
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline-light"
                        onClick={() => toggleAttivo(admin)}
                      >
                        {admin.accountAttivo ? "Disattiva" : "Riattiva"}
                      </Button>
                    )}
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

export default GestioneAdmin;
