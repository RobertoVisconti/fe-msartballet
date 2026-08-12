import { useEffect, useState } from "react";
import { insegnanteApi } from "@/api/insegnanteApi";
import type { InsegnantePubblicoRespDTO } from "@/interfaces/utente";

function Insegnanti() {
  const [insegnanti, setInsegnanti] = useState<InsegnantePubblicoRespDTO[]>([]);
  const [caricamento, setCaricamento] = useState(true);

  useEffect(() => {
    insegnanteApi
      .listaPubblica({ size: 50 })
      .then((pagina) => setInsegnanti(pagina.content))
      .finally(() => setCaricamento(false));
  }, []);

  return (
    <div className="insegnanti-page">
      <div className="insegnanti-header">
        <h1>
          I nostri
          <br />
          insegnanti
        </h1>
      </div>

      {caricamento ? (
        <p className="catalogo-intro">Caricamento...</p>
      ) : (
        <div className="insegnanti-grid">
          {insegnanti.map((insegnante) => (
            <article key={insegnante.id} className="insegnante-card">
              {insegnante.imgProfilo ? (
                <img
                  src={insegnante.imgProfilo}
                  alt={`${insegnante.nome} ${insegnante.cognome}`}
                  className="insegnante-img img-hover-color"
                />
              ) : (
                <div className="insegnante-img insegnante-img-placeholder" />
              )}
              <div className="insegnante-testo">
                <h3>
                  {insegnante.nome} {insegnante.cognome}
                </h3>
                <p>{insegnante.biografia}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default Insegnanti;
