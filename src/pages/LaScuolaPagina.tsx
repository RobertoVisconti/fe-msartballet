import { Link } from "react-router-dom";
function LaScuolaPagina() {
  return (
    <div className="scuola-pagina">
      <div className="scuola-pagina-header">
        <h1>La Scuola</h1>
        <p className="scuola-pagina-lede">
          MS Art Ballet è una scuola di danza a Milano, pensata per chi vuole
          imparare sul serio senza perdere il piacere di ballare — dai primi
          passi fino al livello agonistico.
        </p>
      </div>
      <section className="scuola-pagina-blocco">
        <span className="scuola-pagina-eyebrow">Il metodo</span>
        <h2>Tecnica e libertà, nello stesso passo</h2>
        <p>
          Le nostre classi uniscono il rigore della tecnica classica alla
          libertà espressiva delle discipline contemporanee. Gruppi piccoli,
          massimo 12 allievi per classe, seguiti da vicino da insegnanti che
          lavorano ogni giorno in sala con loro — non solo davanti.
        </p>
      </section>
      <section className="scuola-pagina-blocco">
        <span className="scuola-pagina-eyebrow">Chi insegna</span>
        <h2>Un corpo docente che balla ancora</h2>
        <p>
          I nostri insegnanti arrivano da percorsi diversi — classico,
          contemporaneo, hip hop — e portano in sala esperienza vera di palco,
          non solo di aula.
        </p>
        <Link to="/insegnanti" className="scuola-pagina-link">
          Conosci il corpo docente →
        </Link>
      </section>
      <section className="scuola-pagina-blocco">
        <span className="scuola-pagina-eyebrow">Dove siamo</span>
        <h2>Via della Danza 12, Milano</h2>
        <p>
          Sale attrezzate, pavimenti dedicati alla danza, aperte dal lunedì al
          sabato. La prima lezione di prova è gratuita, in qualsiasi disciplina.
        </p>
        <Link to="/corsi" className="scuola-pagina-link">
          Guarda i corsi →
        </Link>
      </section>
    </div>
  );
}
export default LaScuolaPagina;
