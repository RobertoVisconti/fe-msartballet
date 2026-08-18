import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Table,
  Form,
  Row,
  Col,
  Button,
  Badge,
} from "react-bootstrap";
import type { AxiosError } from "axios";
import { allievoApi } from "@/api/allievoApi";
import { useNotifica } from "@/components/common/ToastProvider";
import Paginazione from "@/components/common/Paginazione";
import {
  StatoCaricamento,
  StatoErrore,
  StatoVuoto,
} from "@/components/common/StatiLista";
import type { AllievoRespDTO } from "@/interfaces/utente";
import type { Page, ErrorsDTO } from "@/interfaces/common";

const DIMENSIONE_PAGINA = 20;

function AllieviList() {
  const [pagina, setPagina] = useState<Page<AllievoRespDTO> | null>(null);
  const [numeroPagina, setNumeroPagina] = useState(0);
  const [filtri, setFiltri] = useState({
    nome: "",
    cognome: "",
    accountAttivo: "",
  });
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState(false);
  const [tentativo, setTentativo] = useState(0);
  const notifica = useNotifica();

  useEffect(() => {
    setCaricamento(true);
    allievoApi
      .lista({
        nome: filtri.nome || undefined,
        cognome: filtri.cognome || undefined,
        accountAttivo:
          filtri.accountAttivo === ""
            ? undefined
            : filtri.accountAttivo === "true",
        page: numeroPagina,
        size: DIMENSIONE_PAGINA,
      })
      .then((risultato) => {
        setPagina(risultato);
        setErrore(false);
      })
      .catch(() => {
        setErrore(true);
        notifica("Impossibile caricare gli allievi", "errore");
      })
      .finally(() => setCaricamento(false));
  }, [filtri, numeroPagina, tentativo]);

  async function toggleAttivo(allievo: AllievoRespDTO) {
    const azione = allievo.accountAttivo
      ? allievoApi.disattiva
      : allievoApi.riattiva;
    try {
      const aggiornato = await azione(allievo.id);
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
        error.response?.data?.message ?? "Operazione non riuscita",
        "errore",
      );
    }
  }

  const filtriAttivi =
    filtri.nome !== "" || filtri.cognome !== "" || filtri.accountAttivo !== "";

  return (
    <Container className="page-container">
      <h1>Gestione Allievi</h1>

      <Row className="filtri-riga">
        <Col md={4}>
          <Form.Control
            placeholder="Filtra per nome"
            value={filtri.nome}
            onChange={(e) => {
              setNumeroPagina(0);
              setFiltri((f) => ({ ...f, nome: e.target.value }));
            }}
          />
        </Col>
        <Col md={4}>
          <Form.Control
            placeholder="Filtra per cognome"
            value={filtri.cognome}
            onChange={(e) => {
              setNumeroPagina(0);
              setFiltri((f) => ({ ...f, cognome: e.target.value }));
            }}
          />
        </Col>
        <Col md={4}>
          <Form.Select
            value={filtri.accountAttivo}
            onChange={(e) => {
              setNumeroPagina(0);
              setFiltri((f) => ({ ...f, accountAttivo: e.target.value }));
            }}
          >
            <option value="">Tutti gli stati</option>
            <option value="true">Solo attivi</option>
            <option value="false">Solo disattivati</option>
          </Form.Select>
        </Col>
      </Row>

      {caricamento ? (
        <StatoCaricamento testo="Caricamento allievi..." />
      ) : errore ? (
        <StatoErrore
          testo="Impossibile caricare gli allievi."
          onRiprova={() => setTentativo((t) => t + 1)}
        />
      ) : !pagina || pagina.empty ? (
        <StatoVuoto
          testo={
            filtriAttivi
              ? "Nessun allievo corrisponde ai filtri impostati."
              : "Nessun allievo registrato."
          }
        />
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
              {pagina.content.map((allievo) => (
                <tr key={allievo.id}>
                  <td>{allievo.nome}</td>
                  <td>{allievo.cognome}</td>
                  <td>{allievo.email}</td>
                  <td>
                    <Badge bg={allievo.accountAttivo ? "success" : "secondary"}>
                      {allievo.accountAttivo ? "Attivo" : "Disattivato"}
                    </Badge>
                  </td>
                  <td className="azioni-cella">
                    <Link to={`/admin/allievi/${allievo.id}`}>Apri</Link>
                    <Button
                      size="sm"
                      variant="outline-light"
                      onClick={() => toggleAttivo(allievo)}
                    >
                      {allievo.accountAttivo ? "Disattiva" : "Riattiva"}
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

export default AllieviList;
