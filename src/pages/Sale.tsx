import { useEffect, useState } from "react";
import { salaApi } from "@/api/salaApi";
import type { SalaRespDTO } from "@/interfaces/catalogo";

function Sale() {
  const [sale, setSale] = useState<SalaRespDTO[]>([]);
  const [caricamento, setCaricamento] = useState(true);

  useEffect(() => {
    salaApi
      .lista({ size: 50 })
      .then((pagina) => setSale(pagina.content))
      .finally(() => setCaricamento(false));
  }, []);

  return (
    <div className="catalogo-page">
      <h1>Sale</h1>
      <p className="catalogo-intro">
        Due spazi attrezzati, disponibili anche in affitto per prove e
        ripetizioni private.
      </p>

      {caricamento ? (
        <p>Caricamento...</p>
      ) : (
        <div className="sale-grid">
          {sale.map((sala, indice) => (
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
      )}
    </div>
  );
}

export default Sale;
