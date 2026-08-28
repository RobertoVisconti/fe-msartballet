import { useEffect, useState } from "react";
import { mediaApi } from "@/api/mediaApi";
import {
  StatoCaricamento,
  StatoErrore,
  StatoVuoto,
  AvvisoLimite,
} from "@/components/common/StatiLista";
import type { MediaRespDTO } from "@/interfaces/galleria";
import type { Page } from "@/interfaces/common";

function Galleria() {
  const [pagina, setPagina] = useState<Page<MediaRespDTO> | null>(null);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState(false);
  const [tentativo, setTentativo] = useState(0);
  const [indiceHover, setIndiceHover] = useState<number | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCaricamento(true);
    mediaApi
      .lista({ size: 50 })
      .then((risultato) => {
        setPagina(risultato);
        setErrore(false);
      })
      .catch(() => setErrore(true))
      .finally(() => setCaricamento(false));
  }, [tentativo]);

  const foto = pagina?.content.filter((m) => m.tipoMedia === "FOTO") ?? [];

  return (
    <div className="catalogo-page">
      <h1>Galleria</h1>
      <p className="catalogo-intro">
        Momenti di lezioni, prove e spettacoli, colti dal vivo.
      </p>

      {caricamento ? (
        <StatoCaricamento testo="Caricamento galleria..." />
      ) : errore ? (
        <StatoErrore
          testo="Impossibile caricare la galleria."
          onRiprova={() => setTentativo((t) => t + 1)}
        />
      ) : foto.length === 0 ? (
        <StatoVuoto testo="Nessuna foto disponibile al momento." />
      ) : (
        <>
          <AvvisoLimite pagina={pagina} />
          <div className="galleria-grid">
            {foto.map((elemento, indice) => {
              const invertita =
                ((indice % 4) + Math.floor(indice / 4)) % 2 === 1;
              const inHover = indiceHover === indice;
              const inGrigio = inHover ? invertita : !invertita;

              return (
                <div
                  key={elemento.id}
                  className="galleria-cella"
                  onMouseEnter={() => setIndiceHover(indice)}
                  onMouseLeave={() => setIndiceHover(null)}
                >
                  <img
                    src={elemento.url}
                    alt={elemento.titolo}
                    className={`galleria-img ${inGrigio ? "in-grigio" : "a-colori"} ${inHover ? "in-hover" : ""}`}
                  />
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default Galleria;
