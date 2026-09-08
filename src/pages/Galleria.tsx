import { useEffect, useState } from "react";
import { Carousel, Modal } from "react-bootstrap";
import { LuX } from "react-icons/lu";
import { mediaApi } from "@/api/mediaApi";
import { spettacoloApi } from "@/api/spettacoloApi";
import {
  StatoCaricamento,
  StatoErrore,
  StatoVuoto,
  AvvisoLimite,
} from "@/components/common/StatiLista";
import type { MediaRespDTO, SpettacoloRespDTO } from "@/interfaces/galleria";
import type { Page } from "@/interfaces/common";

function formattaDataEvento(data: string): string {
  return new Date(data).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function Galleria() {
  const [pagina, setPagina] = useState<Page<MediaRespDTO> | null>(null);
  const [spettacoli, setSpettacoli] = useState<
    Record<string, SpettacoloRespDTO>
  >({});
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState(false);
  const [tentativo, setTentativo] = useState(0);
  const [indiceHover, setIndiceHover] = useState<number | null>(null);
  const [indiceAperto, setIndiceAperto] = useState<number | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCaricamento(true);
    Promise.all([
      mediaApi.lista({ size: 50 }),
      spettacoloApi.lista({ size: 50 }),
    ])
      .then(([paginaMedia, paginaSpettacoli]) => {
        setPagina(paginaMedia);
        setSpettacoli(
          Object.fromEntries(paginaSpettacoli.content.map((s) => [s.id, s])),
        );
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
                  role="button"
                  tabIndex={0}
                  onMouseEnter={() => setIndiceHover(indice)}
                  onMouseLeave={() => setIndiceHover(null)}
                  onClick={() => setIndiceAperto(indice)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setIndiceAperto(indice);
                    }
                  }}
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

          <Modal
            show={indiceAperto !== null}
            onHide={() => setIndiceAperto(null)}
            size="xl"
            fullscreen="sm-down"
            className="galleria-lightbox"
          >
            <button
              type="button"
              className="galleria-lightbox-chiudi"
              onClick={() => setIndiceAperto(null)}
              aria-label="Chiudi"
            >
              <LuX size={22} />
            </button>
            {indiceAperto !== null && (
              <Carousel
                activeIndex={indiceAperto}
                onSelect={(i) => setIndiceAperto(i)}
                interval={null}
                indicators={false}
                controls={foto.length > 1}
              >
                {foto.map((elemento) => {
                  const spettacolo = spettacoli[elemento.idSpettacolo];
                  return (
                    <Carousel.Item key={elemento.id}>
                      <div className="galleria-lightbox-slide">
                        <img
                          src={elemento.url}
                          alt={elemento.titolo}
                          className="galleria-lightbox-img"
                        />
                      </div>
                      <div className="galleria-lightbox-info">
                        <p className="galleria-lightbox-titolo">
                          {elemento.titolo}
                        </p>
                        {spettacolo && (
                          <p className="galleria-lightbox-meta">
                            {spettacolo.titolo} ·{" "}
                            {formattaDataEvento(spettacolo.dataEvento)} ·{" "}
                            {spettacolo.luogo}
                          </p>
                        )}
                      </div>
                    </Carousel.Item>
                  );
                })}
              </Carousel>
            )}
          </Modal>
        </>
      )}
    </div>
  );
}

export default Galleria;
