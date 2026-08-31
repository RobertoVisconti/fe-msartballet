import { useEffect, useState } from "react";
import {
  Container,
  Table,
  Form,
  Row,
  Col,
  Badge,
  Button,
} from "react-bootstrap";
import type { AxiosError } from "axios";
import { iscrizioneApi } from "@/api/iscrizioneApi";
import { corsoApi } from "@/api/corsoApi";
import { useNotifica } from "@/components/common/ToastProvider";
import { estraiMessaggioErrore } from "@/utils/erroreApi";
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
import type { CorsoRespDTO } from "@/interfaces/catalogo";
import type { Page, ErrorsDTO } from "@/interfaces/common";

const DIMENSIONE_PAGINA = 20;

const STATI: StatoIscrizione[] = ["ATTIVA", "COMPLETATA", "ANNULLATA"];

const BADGE_STATO: Record<StatoIscrizione, string> = {
  ATTIVA: "success",
  COMPLETATA: "secondary",
  ANNULLATA: "danger",
};

function IscrizioniAdmin() {
  const [pagina, setPagina] = useState<Page<IscrizioneRespDTO> | null>(null);
  const [numeroPagina, setNumeroPagina] = useState(0);
  const [corsi, setCorsi] = useState<CorsoRespDTO[]>([]);
  const [filtroCorso, setFiltroCorso] = useState("");
  const [filtroStato, setFiltroStato] = useState("");
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState(false);
  const [tentativo, setTentativo] = useState(0);
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
        page: numeroPagina,
        size: DIMENSIONE_PAGINA,
      })
      .then((risultato) => {
        setPagina(risultato);
        setErrore(false);
      })
      .catch(() => {
        setErrore(true);
        notifica("Impossibile caricare le iscrizioni", "errore");
      })
      .finally(() => setCaricamento(false));
  }

  useEffect(() => {
    caricaLista();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroCorso, filtroStato, numeroPagina, tentativo]);

  async function cambiaStato(
    iscrizione: IscrizioneRespDTO,
    nuovoStato: StatoIscrizione,
  ) {
    try {
      const aggiornata = await iscrizioneApi.cambiaStato(iscrizione.id, {
        stato: nuovoStato,
      });
      setPagina((precedente) =>
        precedente
          ? {
              ...precedente,
              content: precedente.content.map((i) =>
                i.id === aggiornata.id ? aggiornata : i,
              ),
            }
          : precedente,
      );
    } catch (err) {
      const error = err as AxiosError<ErrorsDTO>;
      notifica(
        estraiMessaggioErrore(error.response?.data, "Cambio stato non riuscito"),
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
      if (pagina && pagina.numberOfElements === 1 && !pagina.first) {
        setNumeroPagina((n) => n - 1);
      } else {
        caricaLista();
      }
    } catch (err) {
      const error = err as AxiosError<ErrorsDTO>;
      notifica(
        estraiMessaggioErrore(error.response?.data, "Eliminazione non riuscita"),
        "errore",
      );
    }
  }

  const filtriAttivi = filtroCorso !== "" || filtroStato !== "";

  return (
    <Container className="page-container">
      <h1>Iscrizioni</h1>

      <Row className="filtri-riga">
        <Col md={6}>
          <Form.Select
            value={filtroCorso}
            onChange={(e) => {
              setNumeroPagina(0);
              setFiltroCorso(e.target.value);
            }}
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
            onChange={(e) => {
              setNumeroPagina(0);
              setFiltroStato(e.target.value);
            }}
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
        <StatoCaricamento testo="Caricamento iscrizioni..." />
      ) : errore ? (
        <StatoErrore
          testo="Impossibile caricare le iscrizioni."
          onRiprova={() => setTentativo((t) => t + 1)}
        />
      ) : !pagina || pagina.empty ? (
        <StatoVuoto
          testo={
            filtriAttivi
              ? "Nessuna iscrizione corrisponde ai filtri impostati."
              : "Nessuna iscrizione registrata."
          }
        />
      ) : (
        <>
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
              {pagina.content.map((iscrizione) => (
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
                        cambiaStato(
                          iscrizione,
                          e.target.value as StatoIscrizione,
                        )
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

          <Paginazione pagina={pagina} onCambiaPagina={setNumeroPagina} />
        </>
      )}
    </Container>
  );
}

export default IscrizioniAdmin;
