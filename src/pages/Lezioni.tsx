import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { lezioneApi } from "@/api/lezioneApi";
import { corsoApi } from "@/api/corsoApi";
import type { LezioneRespDTO } from "@/interfaces/lezione";
import type { CorsoRespDTO } from "@/interfaces/catalogo";

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
            <li key={lezione.id} className="lezione-riga">
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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Lezioni;
