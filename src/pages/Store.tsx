import { useEffect, useState } from "react";
import { prodottoApi } from "@/api/prodottoApi";
import type { ProdottoRespDTO } from "@/interfaces/catalogo";

function Store() {
  const [prodotti, setProdotti] = useState<ProdottoRespDTO[]>([]);
  const [caricamento, setCaricamento] = useState(true);

  useEffect(() => {
    prodottoApi
      .lista({ size: 50 })
      .then((pagina) => setProdotti(pagina.content))
      .finally(() => setCaricamento(false));
  }, []);

  return (
    <div className="catalogo-page">
      <h1>Store</h1>
      <p className="catalogo-intro">
        Abbigliamento e accessori pensati per chi danza.
      </p>

      {caricamento ? (
        <p>Caricamento...</p>
      ) : (
        <div className="store-grid">
          {prodotti.map((prodotto) => (
            <article key={prodotto.id} className="prodotto-card">
              {prodotto.imgProdotto ? (
                <img
                  src={prodotto.imgProdotto}
                  alt={prodotto.titolo}
                  className="prodotto-img img-hover-color"
                />
              ) : (
                <div className="prodotto-img prodotto-img-placeholder" />
              )}
              <div className="prodotto-riga">
                <h3>{prodotto.titolo}</h3>
                <span className="prodotto-prezzo">
                  € {prodotto.prezzoProdotto}
                </span>
              </div>
              <p className="prodotto-descrizione">
                {prodotto.descrizioneProdotto}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default Store;
