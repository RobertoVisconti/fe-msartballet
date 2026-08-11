import { useEffect, useState } from "react";
import { corsoApi } from "@/api/corsoApi";
import type { CorsoRespDTO } from "@/interfaces/catalogo";

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
  const [corsi, setCorsi] = useState<CorsoRespDTO[]>([]);
  const [caricamento, setCaricamento] = useState(true);

  useEffect(() => {
    corsoApi
      .lista({ size: 50 })
      .then((pagina) => setCorsi(pagina.content))
      .finally(() => setCaricamento(false));
  }, []);

  return (
    <div className="catalogo-page">
      <h1>Corsi</h1>
      <p className="catalogo-intro">
        Classico, contemporaneo, hip hop, modern: un percorso per ogni età e
        livello, guidato dai nostri insegnanti.
      </p>

      {caricamento ? (
        <p>Caricamento...</p>
      ) : (
        <div className="corsi-grid">
          {corsi.map((corso, indice) => (
            <article key={corso.id} className="corso-card">
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
                <span className="corso-prezzo">
                  € {corso.prezzoMensile}/mese
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default Corsi;
