import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { AxiosError } from "axios";
import { Form } from "react-bootstrap";
import { useAppSelector } from "@/redux/store/hooks";
import { lezioneApi } from "@/api/lezioneApi";
import { corsoApi } from "@/api/corsoApi";
import { prenotazioneApi } from "@/api/prenotazioneApi";
import type { LezioneRespDTO } from "@/interfaces/lezione";
import type { CorsoRespDTO } from "@/interfaces/catalogo";
import type { ErrorsDTO } from "@/interfaces/common";
import { estraiMessaggioErrore } from "@/utils/erroreApi";

function formattaData(iso: string): string {
  return new Date(iso).toLocaleDateString("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function formattaOra(iso: string): string {
  return new Date(iso).toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Lezioni() {
  const [lezioni, setLezioni] = useState<LezioneRespDTO[]>([]);
  const [corsi, setCorsi] = useState<CorsoRespDTO[]>([]);
  const [filtroCorso, setFiltroCorso] = useState("");
  const [caricamento, setCaricamento] = useState(true);

  useEffect(() => {
    corsoApi.lista({ size: 100 }).then((pagina) => setCorsi(pagina.content));
  }, []);

  useEffect(() => {
    setCaricamento(true);
    lezioneApi
      .lista({
        idCorso: filtroCorso || undefined,
        dal: new Date().toISOString(),
        size: 50,
      })
      .then((pagina) => setLezioni(pagina.content))
      .finally(() => setCaricamento(false));
  }, [filtroCorso]);

  return (
    <div className="catalogo-page">
      <h1>Lezioni</h1>
      <p className="catalogo-intro">
        Il calendario delle prossime lezioni, corso per corso.
      </p>

      <Form.Select
        className="lezioni-filtro"
        value={filtroCorso}
        onChange={(e) => setFiltroCorso(e.target.value)}
      >
        <option value="">Tutti i corsi</option>
        {corsi.map((corso) => (
          <option key={corso.id} value={corso.id}>
            {corso.titolo}
          </option>
        ))}
      </Form.Select>

      {caricamento ? (
        <p>Caricamento...</p>
      ) : lezioni.length === 0 ? (
        <p className="testo-secondario">Nessuna lezione in programma.</p>
      ) : (
        <ul className="lezioni-lista">
          {lezioni.map((lezione) => (
            <LezioneRiga key={lezione.id} lezione={lezione} />
          ))}
        </ul>
      )}
    </div>
  );
}

interface LezioneRigaProps {
  lezione: LezioneRespDTO;
}

const RUOLI_CHE_POSSONO_PRENOTARE = ["ALLIEVO", "OSPITE", "ADMIN"];

function LezioneRiga({ lezione }: LezioneRigaProps) {
  const utente = useAppSelector((state) => state.auth.utente);
  const [inCorso, setInCorso] = useState(false);
  const [esito, setEsito] = useState<"ok" | "errore" | null>(null);
  const [messaggioErrore, setMessaggioErrore] = useState<string | null>(null);
  const [formOspiteAperto, setFormOspiteAperto] = useState(false);
  const [formOspite, setFormOspite] = useState({
    nome: "",
    cognome: "",
    email: "",
    telefono: "",
  });

  async function prenota() {
    if (!utente) return;
    setInCorso(true);
    setEsito(null);
    try {
      await prenotazioneApi.crea({
        idUtente: utente.id,
        idLezione: lezione.id,
      });
      setEsito("ok");
    } catch (err) {
      const error = err as AxiosError<ErrorsDTO>;
      setMessaggioErrore(
        estraiMessaggioErrore(error.response?.data, "Prenotazione non riuscita"),
      );
      setEsito("errore");
    } finally {
      setInCorso(false);
    }
  }

  async function prenotaComeOspite(evento: FormEvent) {
    evento.preventDefault();
    setInCorso(true);
    setEsito(null);
    try {
      await prenotazioneApi.creaOspite({
        nome: formOspite.nome,
        cognome: formOspite.cognome,
        email: formOspite.email,
        telefono: formOspite.telefono || undefined,
        idLezione: lezione.id,
      });
      setEsito("ok");
      setFormOspiteAperto(false);
    } catch (err) {
      const error = err as AxiosError<ErrorsDTO>;
      setMessaggioErrore(
        estraiMessaggioErrore(error.response?.data, "Prenotazione non riuscita"),
      );
      setEsito("errore");
    } finally {
      setInCorso(false);
    }
  }

  const puoPrenotareSubito =
    utente && RUOLI_CHE_POSSONO_PRENOTARE.includes(utente.ruolo);

  return (
    <li className="lezione-riga">
      <div className="lezione-data">
        <span className="lezione-giorno">
          {formattaData(lezione.dataOraInizio)}
        </span>
        <span className="lezione-ora">
          {formattaOra(lezione.dataOraInizio)}–
          {formattaOra(lezione.dataOraFine)}
        </span>
      </div>
      <div className="lezione-info">
        <span className="lezione-corso">{lezione.titoloCorso}</span>
        <span className="lezione-sala">{lezione.titoloSala}</span>
      </div>
      <span className="lezione-prezzo">€ {lezione.prezzoLezione}</span>

      {esito === "ok" ? (
        <span className="lezione-prenota-ok">Prenotata ✓</span>
      ) : puoPrenotareSubito ? (
        <div className="lezione-prenota">
          <button
            type="button"
            className="lezione-prenota-btn"
            onClick={prenota}
            disabled={inCorso}
          >
            {inCorso ? "Invio..." : "Prenota"}
          </button>
          {esito === "errore" && (
            <span className="lezione-prenota-errore">{messaggioErrore}</span>
          )}
        </div>
      ) : !utente ? (
        <div className="lezione-prenota">
          {!formOspiteAperto ? (
            <button
              type="button"
              className="lezione-prenota-btn"
              onClick={() => setFormOspiteAperto(true)}
            >
              Prenota
            </button>
          ) : (
            <Form onSubmit={prenotaComeOspite} className="lezione-form-ospite">
              <Form.Control
                size="sm"
                placeholder="Nome"
                value={formOspite.nome}
                onChange={(e) =>
                  setFormOspite((p) => ({ ...p, nome: e.target.value }))
                }
                required
              />
              <Form.Control
                size="sm"
                placeholder="Cognome"
                value={formOspite.cognome}
                onChange={(e) =>
                  setFormOspite((p) => ({ ...p, cognome: e.target.value }))
                }
                required
              />
              <Form.Control
                size="sm"
                type="email"
                placeholder="Email"
                value={formOspite.email}
                onChange={(e) =>
                  setFormOspite((p) => ({ ...p, email: e.target.value }))
                }
                required
              />
              <Form.Control
                size="sm"
                type="tel"
                placeholder="Telefono (facoltativo)"
                value={formOspite.telefono}
                onChange={(e) =>
                  setFormOspite((p) => ({ ...p, telefono: e.target.value }))
                }
              />
              <div className="lezione-form-ospite-azioni">
                <button
                  type="submit"
                  className="lezione-prenota-btn"
                  disabled={inCorso}
                >
                  {inCorso ? "Invio..." : "Conferma"}
                </button>
                <button
                  type="button"
                  className="lezione-prenota-annulla"
                  onClick={() => setFormOspiteAperto(false)}
                >
                  Annulla
                </button>
              </div>
              {esito === "errore" && (
                <span className="lezione-prenota-errore">
                  {messaggioErrore}
                </span>
              )}
            </Form>
          )}
        </div>
      ) : null}
    </li>
  );
}

export default Lezioni;
