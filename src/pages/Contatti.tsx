function Contatti() {
  return (
    <section className="contatti-section">
      <div className="contatti-sinistra">
        <h2>La prima lezione è di prova.</h2>
        <p>
          Vieni a conoscerci: la prima lezione di prova è gratuita, in qualsiasi
          disciplina.
        </p>
        <a href="mailto:segreteria@msartballet.it" className="contatti-cta">
          Scrivi alla segreteria
        </a>
      </div>
      <div className="contatti-destra">
        <div className="contatto-blocco">
          <span className="contatto-etichetta">Indirizzo</span>
          <span className="contatto-valore">Via della Danza 12, Milano</span>
        </div>
        <div className="contatto-blocco">
          <span className="contatto-etichetta">Segreteria</span>
          <span className="contatto-valore">+39 02 0000000</span>
        </div>
        <div className="contatto-blocco">
          <span className="contatto-etichetta">Orari</span>
          <span className="contatto-valore">
            Lun–Ven 15:00–21:00, Sab 09:00–13:00
          </span>
        </div>
        <div className="contatto-blocco">
          <span className="contatto-etichetta">Social</span>
          <a href="#" className="contatto-social">
            Instagram
          </a>
        </div>
      </div>
    </section>
  );
}

export default Contatti;
