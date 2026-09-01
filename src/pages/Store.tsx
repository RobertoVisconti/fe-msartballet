import { useEffect, useState } from "react";
import { prodottoApi } from "@/api/prodottoApi";
import { formattaPrezzo } from "@/utils/formattaPrezzo";
import {
  StatoCaricamento,
  StatoErrore,
  StatoVuoto,
  AvvisoLimite,
} from "@/components/common/StatiLista";
import type { ProdottoRespDTO } from "@/interfaces/catalogo";
import type { Page } from "@/interfaces/common";

function Store() {
  const [pagina, setPagina] = useState<Page<ProdottoRespDTO> | null>(null);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState(false);
  const [tentativo, setTentativo] = useState(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCaricamento(true);
    prodottoApi
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
      <h1>Store</h1>
      <p className="catalogo-intro">
        Abbigliamento e accessori pensati per chi danza.
      </p>

      {caricamento ? (
        <StatoCaricamento testo="Caricamento prodotti..." />
      ) : errore ? (
        <StatoErrore
          testo="Impossibile caricare i prodotti."
          onRiprova={() => setTentativo((t) => t + 1)}
        />
      ) : !pagina || pagina.empty ? (
        <StatoVuoto testo="Nessun prodotto disponibile al momento." />
      ) : (
        <>
          <AvvisoLimite pagina={pagina} />
          <div className="store-grid">
            {pagina.content.map((prodotto) => (
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
                    {formattaPrezzo(prodotto.prezzoProdotto)}
                  </span>
                </div>
                <p className="prodotto-descrizione">
                  {prodotto.descrizioneProdotto}
                </p>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Store;
