import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Table } from "react-bootstrap";
import { ospiteApi } from "@/api/ospiteApi";
import { useNotifica } from "@/components/common/ToastProvider";
import Paginazione from "@/components/common/Paginazione";
import {
  StatoCaricamento,
  StatoErrore,
  StatoVuoto,
} from "@/components/common/StatiLista";
import type { OspiteRespDTO } from "@/interfaces/utente";
import type { Page } from "@/interfaces/common";

const DIMENSIONE_PAGINA = 20;

function OspitiList() {
  const [pagina, setPagina] = useState<Page<OspiteRespDTO> | null>(null);
  const [numeroPagina, setNumeroPagina] = useState(0);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState(false);
  const [tentativo, setTentativo] = useState(0);
  const notifica = useNotifica();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCaricamento(true);
    ospiteApi
      .lista({ page: numeroPagina, size: DIMENSIONE_PAGINA })
      .then((risultato) => {
        setPagina(risultato);
        setErrore(false);
      })
      .catch(() => {
        setErrore(true);
        notifica("Impossibile caricare gli ospiti", "errore");
      })
      .finally(() => setCaricamento(false));
  }, [numeroPagina, tentativo]);

  return (
    <Container className="page-container">
      <h1>Gestione Ospiti</h1>
      <p className="testo-secondario">
        Sola lettura — il backend non prevede modifica o disattivazione per gli
        ospiti.
      </p>

      {caricamento ? (
        <StatoCaricamento testo="Caricamento ospiti..." />
      ) : errore ? (
        <StatoErrore
          testo="Impossibile caricare gli ospiti."
          onRiprova={() => setTentativo((t) => t + 1)}
        />
      ) : !pagina || pagina.empty ? (
        <StatoVuoto testo="Nessun ospite registrato." />
      ) : (
        <>
          <Table responsive className="tabella-admin">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Cognome</th>
                <th>Email</th>
                <th>Telefono</th>
                <th>Iscritto dal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pagina.content.map((ospite) => (
                <tr key={ospite.id}>
                  <td>{ospite.nome}</td>
                  <td>{ospite.cognome}</td>
                  <td>{ospite.email}</td>
                  <td>{ospite.telefono ?? "—"}</td>
                  <td>{ospite.dataRegistrazione}</td>
                  <td className="azioni-cella">
                    <Link to={`/admin/ospiti/${ospite.id}`}>Apri</Link>
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

export default OspitiList;
