import { useEffect, useState } from "react";
import { mediaApi } from "@/api/mediaApi";
import type { MediaRespDTO } from "@/interfaces/galleria";

function Galleria() {
  const [media, setMedia] = useState<MediaRespDTO[]>([]);
  const [caricamento, setCaricamento] = useState(true);
  const [indiceHover, setIndiceHover] = useState<number | null>(null);

  useEffect(() => {
    mediaApi
      .lista({ size: 50 })
      .then((pagina) =>
        setMedia(pagina.content.filter((m) => m.tipoMedia === "FOTO")),
      )
      .finally(() => setCaricamento(false));
  }, []);

  return (
    <div className="catalogo-page">
      <h1>Galleria</h1>
      <p className="catalogo-intro">
        Momenti di lezioni, prove e spettacoli, colti dal vivo.
      </p>

      {caricamento ? (
        <p>Caricamento...</p>
      ) : (
        <div className="galleria-grid">
          {media.map((foto, indice) => {
            const invertita = ((indice % 4) + Math.floor(indice / 4)) % 2 === 1;
            const inHover = indiceHover === indice;
            const inGrigio = inHover ? invertita : !invertita;

            return (
              <div
                key={foto.id}
                className="galleria-cella"
                onMouseEnter={() => setIndiceHover(indice)}
                onMouseLeave={() => setIndiceHover(null)}
              >
                <img
                  src={foto.url}
                  alt={foto.titolo}
                  className={`galleria-img ${inGrigio ? "in-grigio" : "a-colori"} ${inHover ? "in-hover" : ""}`}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Galleria;
