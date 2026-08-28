import { useEffect, useState } from "react";
import type { AxiosError } from "axios";
import { useAppSelector } from "@/redux/store/hooks";
import { corsoApi } from "@/api/corsoApi";
import { iscrizioneApi } from "@/api/iscrizioneApi";
import {
  StatoCaricamento,
  StatoErrore,
  StatoVuoto,
  AvvisoLimite,
} from "@/components/common/StatiLista";
import type { CorsoRespDTO } from "@/interfaces/catalogo";
import type { Page, ErrorsDTO } from "@/interfaces/common";

const ETICHETTE_GIORNO: Record<string, string> = {
  LUNEDI: "Lunedì",
  MARTEDI: "Martedì",
  MERCOLEDI: "Mercoledì",
  GIOVEDI: "Giovedì",
  VENERDI: "Venerdì",
  SABATO: "Sabato",
  DOMENICA: "Domenica",
};

function Corsi() {
  const [pagina, setPagina] = useState<Page<CorsoRespDTO> | null>(null);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState(false);
  const [tentativo, setTentativo] = useState(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCaricamento(true);
    corsoApi
      .lista({ size: 50 })
      .then((risultato) => {
        setPagina(risultato);
        setErrore(false);
      })
      .catch(() => setErrore(true))
      .finally(() => setCaricamento(false));
  }, [tentativo]);

  return (
    <div className="catalogo-page">
      <h1>Corsi</h1>
      <p className="catalogo-intro">
        Classico, contemporaneo, hip hop, modern: un percorso per ogni età e
        livello, guidato dai nostri insegnanti.
      </p>

      {caricamento ? (
        <StatoCaricamento testo="Caricamento corsi..." />
      ) : errore ? (
        <StatoErrore
          testo="Impossibile caricare i corsi."
          onRiprova={() => setTentativo((t) => t + 1)}
        />
      ) : !pagina || pagina.empty ? (
        <StatoVuoto testo="Nessun corso disponibile al momento." />
      ) : (
        <>
          <AvvisoLimite pagina={pagina} />
          <div className="corsi-grid">
            {pagina.content.map((corso, indice) => (
              <CorsoCard key={corso.id} corso={corso} indice={indice} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

interface CorsoCardProps {
  corso: CorsoRespDTO;
  indice: number;
}

function CorsoCard({ corso, indice }: CorsoCardProps) {
  const utente = useAppSelector((state) => state.auth.utente);
  const [inCorso, setInCorso] = useState(false);
  const [esito, setEsito] = useState<"ok" | "errore" | null>(null);
  const [messaggioErrore, setMessaggioErrore] = useState<string | null>(null);

  async function iscriviti() {
    if (!utente) return;
    setInCorso(true);
    setEsito(null);
    try {
      await iscrizioneApi.crea({ idAllievo: utente.id, idCorso: corso.id });
      setEsito("ok");
    } catch (err) {
      const error = err as AxiosError<ErrorsDTO>;
      setMessaggioErrore(
        error.response?.data?.message ?? "Iscrizione non riuscita",
      );
      setEsito("errore");
    } finally {
      setInCorso(false);
    }
  }

  return (
    <article className="corso-card">
      <span className="corso-numero">
        {String(indice + 1).padStart(2, "0")}
      </span>
      <h3>{corso.titolo}</h3>
      <span className="corso-meta">
        {corso.nomeDisciplina} · {corso.livelloCorso}
      </span>
      <p>{corso.descrizione}</p>
      <div className="corso-footer">
        <span>
          {ETICHETTE_GIORNO[corso.giornoSettimana]} ·{" "}
          {corso.oraInizio.slice(0, 5)}–{corso.oraFine.slice(0, 5)}
        </span>
        <span className="corso-prezzo">€ {corso.prezzoMensile}/mese</span>
      </div>

      {utente?.ruolo === "ALLIEVO" && (
        <div className="corso-iscrizione">
          {esito === "ok" ? (
            <span className="corso-iscrizione-ok">Iscrizione inviata ✓</span>
          ) : (
            <button
              type="button"
              className="corso-iscriviti"
              onClick={iscriviti}
              disabled={inCorso}
            >
              {inCorso ? "Invio..." : "Iscriviti"}
            </button>
          )}
          {esito === "errore" && (
            <span className="corso-iscrizione-errore">{messaggioErrore}</span>
          )}
        </div>
      )}
    </article>
  );
}

export default Corsi;
