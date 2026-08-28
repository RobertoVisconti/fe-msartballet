import { useEffect, useState } from "react";
import { insegnanteApi } from "@/api/insegnanteApi";
import {
  StatoCaricamento,
  StatoErrore,
  StatoVuoto,
  AvvisoLimite,
} from "@/components/common/StatiLista";
import type { InsegnantePubblicoRespDTO } from "@/interfaces/utente";
import type { Page } from "@/interfaces/common";

function Insegnanti() {
  const [pagina, setPagina] = useState<Page<InsegnantePubblicoRespDTO> | null>(
    null,
  );
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState(false);
  const [tentativo, setTentativo] = useState(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCaricamento(true);
    insegnanteApi
      .listaPubblica({ size: 50 })
      .then((risultato) => {
        setPagina(risultato);
        setErrore(false);
      })
      .catch(() => setErrore(true))
      .finally(() => setCaricamento(false));
  }, [tentativo]);

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
        <StatoCaricamento testo="Caricamento insegnanti..." />
      ) : errore ? (
        <StatoErrore
          testo="Impossibile caricare gli insegnanti."
          onRiprova={() => setTentativo((t) => t + 1)}
        />
      ) : !pagina || pagina.empty ? (
        <StatoVuoto testo="Nessun insegnante disponibile al momento." />
      ) : (
        <>
          <AvvisoLimite pagina={pagina} />
          <div className="insegnanti-grid">
            {pagina.content.map((insegnante) => (
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
        </>
      )}
    </div>
  );
}

export default Insegnanti;
