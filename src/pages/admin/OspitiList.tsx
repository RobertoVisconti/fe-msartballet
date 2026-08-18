import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Table, Pagination, Spinner, Alert } from "react-bootstrap";
import { ospiteApi } from "@/api/ospiteApi";
import type { OspiteRespDTO } from "@/interfaces/utente";
import type { Page } from "@/interfaces/common";

const DIMENSIONE_PAGINA = 20;

function OspitiList() {
  const [pagina, setPagina] = useState<Page<OspiteRespDTO> | null>(null);
  const [numeroPagina, setNumeroPagina] = useState(0);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState<string | null>(null);

  useEffect(() => {
    setCaricamento(true);
    ospiteApi
      .lista({ page: numeroPagina, size: DIMENSIONE_PAGINA })
      .then(setPagina)
      .catch(() => setErrore("Impossibile caricare gli ospiti"))
      .finally(() => setCaricamento(false));
  }, [numeroPagina]);

  return (
    <Container className="page-container">
      <h1>Gestione Ospiti</h1>
      <p className="testo-secondario">
        Sola lettura — il backend non prevede modifica o disattivazione per gli
        ospiti.
      </p>

      {errore && <Alert variant="danger">{errore}</Alert>}

      {caricamento ? (
        <Spinner animation="border" />
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
              {pagina?.content.map((ospite) => (
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

          {pagina && pagina.totalPages > 1 && (
            <Pagination>
              {Array.from({ length: pagina.totalPages }, (_, i) => (
                <Pagination.Item
                  key={i}
                  active={i === numeroPagina}
                  onClick={() => setNumeroPagina(i)}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          )}
        </>
      )}
    </Container>
  );
}

export default OspitiList;
