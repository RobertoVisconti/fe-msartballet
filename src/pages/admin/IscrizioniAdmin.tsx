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
import { iscrizioneApi } from "@/api/iscrizioneApi";
import { corsoApi } from "@/api/corsoApi";
import { useNotifica } from "@/components/common/ToastProvider";
import type {
  IscrizioneRespDTO,
  StatoIscrizione,
} from "@/interfaces/iscrizione";
import type { CorsoRespDTO } from "@/interfaces/catalogo";
import type { ErrorsDTO } from "@/interfaces/common";

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
  const notifica = useNotifica();

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
      .catch(() => notifica("Impossibile caricare le iscrizioni", "errore"))
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
    try {
      const aggiornata = await iscrizioneApi.cambiaStato(iscrizione.id, {
        stato: nuovoStato,
      });
      setIscrizioni((precedente) =>
        precedente.map((i) => (i.id === aggiornata.id ? aggiornata : i)),
      );
    } catch (err) {
      const error = err as AxiosError<ErrorsDTO>;
      notifica(
        error.response?.data?.message ?? "Cambio stato non riuscito",
        "errore",
      );
    }
  }

  async function handleElimina(iscrizione: IscrizioneRespDTO) {
    if (
      !window.confirm(
        `Eliminare l'iscrizione di ${iscrizione.nomeAllievo} a "${iscrizione.titoloCorso}"?`,
      )
    )
      return;
    try {
      await iscrizioneApi.elimina(iscrizione.id);
      caricaLista();
    } catch (err) {
      const error = err as AxiosError<ErrorsDTO>;
      notifica(
        error.response?.data?.message ?? "Eliminazione non riuscita",
        "errore",
      );
    }
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
