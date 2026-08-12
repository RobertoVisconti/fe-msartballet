import { useEffect, useState } from "react";
import {
  Container,
  Table,
  Form,
  Row,
  Col,
  Badge,
  Spinner,
  Alert,
  Button,
} from "react-bootstrap";
import { iscrizioneApi } from "@/api/iscrizioneApi";
import { corsoApi } from "@/api/corsoApi";
import type {
  IscrizioneRespDTO,
  StatoIscrizione,
} from "@/interfaces/iscrizione";
import type { CorsoRespDTO } from "@/interfaces/catalogo";

const STATI: StatoIscrizione[] = ["ATTIVA", "COMPLETATA", "ANNULLATA"];

const BADGE_STATO: Record<StatoIscrizione, string> = {
  ATTIVA: "success",
  COMPLETATA: "secondary",
  ANNULLATA: "danger",
};

function IscrizioniAdmin() {
  const [iscrizioni, setIscrizioni] = useState<IscrizioneRespDTO[]>([]);
  const [corsi, setCorsi] = useState<CorsoRespDTO[]>([]);
  const [filtroCorso, setFiltroCorso] = useState("");
  const [filtroStato, setFiltroStato] = useState("");
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState<string | null>(null);

  useEffect(() => {
    corsoApi.lista({ size: 100 }).then((pagina) => setCorsi(pagina.content));
  }, []);

  function caricaLista() {
    setCaricamento(true);
    iscrizioneApi
      .lista({
        idCorso: filtroCorso || undefined,
        stato: filtroStato || undefined,
        size: 100,
      })
      .then((pagina) => setIscrizioni(pagina.content))
      .catch(() => setErrore("Impossibile caricare le iscrizioni"))
      .finally(() => setCaricamento(false));
  }

  useEffect(() => {
    caricaLista();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroCorso, filtroStato]);

  async function cambiaStato(
    iscrizione: IscrizioneRespDTO,
    nuovoStato: StatoIscrizione,
  ) {
    const aggiornata = await iscrizioneApi.cambiaStato(iscrizione.id, {
      stato: nuovoStato,
    });
    setIscrizioni((precedente) =>
      precedente.map((i) => (i.id === aggiornata.id ? aggiornata : i)),
    );
  }

  async function handleElimina(iscrizione: IscrizioneRespDTO) {
    if (
      !window.confirm(
        `Eliminare l'iscrizione di ${iscrizione.nomeAllievo} a "${iscrizione.titoloCorso}"?`,
      )
    )
      return;
    await iscrizioneApi.elimina(iscrizione.id);
    caricaLista();
  }

  return (
    <Container className="page-container">
      <h1>Iscrizioni</h1>

      <Row className="filtri-riga">
        <Col md={6}>
          <Form.Select
            value={filtroCorso}
            onChange={(e) => setFiltroCorso(e.target.value)}
          >
            <option value="">Tutti i corsi</option>
            {corsi.map((c) => (
              <option key={c.id} value={c.id}>
                {c.titolo}
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

      {errore && <Alert variant="danger">{errore}</Alert>}

      {caricamento ? (
        <Spinner animation="border" />
      ) : (
        <Table responsive className="tabella-admin">
          <thead>
            <tr>
              <th>Allievo</th>
              <th>Corso</th>
              <th>Data iscrizione</th>
              <th>Stato</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {iscrizioni.map((iscrizione) => (
              <tr key={iscrizione.id}>
                <td>{iscrizione.nomeAllievo}</td>
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
                <td className="azioni-cella">
                  <Form.Select
                    size="sm"
                    className="azioni-select-stato"
                    value={iscrizione.stato}
                    onChange={(e) =>
                      cambiaStato(iscrizione, e.target.value as StatoIscrizione)
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
                    onClick={() => handleElimina(iscrizione)}
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

export default IscrizioniAdmin;
