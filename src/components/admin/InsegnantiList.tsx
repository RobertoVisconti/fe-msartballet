import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Table,
  Button,
  Badge,
  Pagination,
  Spinner,
  Alert,
} from "react-bootstrap";
import { insegnanteApi } from "@/api/insegnanteApi";
import type { InsegnanteRespDTO } from "@/interfaces/utente";
import type { Page } from "@/interfaces/common";

const DIMENSIONE_PAGINA = 20;

function InsegnantiList() {
  const [pagina, setPagina] = useState<Page<InsegnanteRespDTO> | null>(null);
  const [numeroPagina, setNumeroPagina] = useState(0);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState<string | null>(null);

  useEffect(() => {
    setCaricamento(true);
    insegnanteApi
      .lista({ page: numeroPagina, size: DIMENSIONE_PAGINA })
      .then(setPagina)
      .catch(() => setErrore("Impossibile caricare gli insegnanti"))
      .finally(() => setCaricamento(false));
  }, [numeroPagina]);

  async function toggleAttivo(insegnante: InsegnanteRespDTO) {
    const azione = insegnante.accountAttivo
      ? insegnanteApi.disattiva
      : insegnanteApi.riattiva;
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
  }

  return (
    <Container className="page-container">
      <h1>Gestione Insegnanti</h1>

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
                <th>Stato</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {pagina?.content.map((insegnante) => (
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

export default InsegnantiList;
