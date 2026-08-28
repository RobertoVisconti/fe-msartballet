import { useEffect, useState } from "react";
import { salaApi } from "@/api/salaApi";
import {
  StatoCaricamento,
  StatoErrore,
  StatoVuoto,
  AvvisoLimite,
} from "@/components/common/StatiLista";
import type { SalaRespDTO } from "@/interfaces/catalogo";
import type { Page } from "@/interfaces/common";

function Sale() {
  const [pagina, setPagina] = useState<Page<SalaRespDTO> | null>(null);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState(false);
  const [tentativo, setTentativo] = useState(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCaricamento(true);
    salaApi
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
      <h1>Sale</h1>
      <p className="catalogo-intro">
        Due spazi attrezzati, disponibili anche in affitto per prove e
        ripetizioni private.
      </p>

      {caricamento ? (
        <StatoCaricamento testo="Caricamento sale..." />
      ) : errore ? (
        <StatoErrore
          testo="Impossibile caricare le sale."
          onRiprova={() => setTentativo((t) => t + 1)}
        />
      ) : !pagina || pagina.empty ? (
        <StatoVuoto testo="Nessuna sala disponibile al momento." />
      ) : (
        <>
          <AvvisoLimite pagina={pagina} />
          <div className="sale-grid">
            {pagina.content.map((sala, indice) => (
              <article key={sala.id} className="sala-card">
                {sala.imgSala ? (
                  <img
                    src={sala.imgSala}
                    alt={sala.titolo}
                    className="sala-img img-hover-color"
                  />
                ) : (
                  <div className="sala-img sala-img-placeholder" />
                )}
                <div className="sala-titolo-riga">
                  <h3>{sala.titolo}</h3>
                  <span className="sala-numero">
                    {String(indice + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="sala-prezzo">€ {sala.prezzoAffitto} / affitto</p>
                <div className="sala-footer">
                  <span className="sala-affitta">→ Affitta</span>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Sale;
