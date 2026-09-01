import { Link } from "react-router-dom";
function PaginaNonTrovata() {
  return (
    <div className="in-arrivo">
      <h1>Pagina non trovata</h1>
      <p>L'indirizzo che hai seguito non esiste, o è stato spostato.</p>
      <Link to="/" className="scuola-pagina-link">
        ← Torna alla home
      </Link>
    </div>
  );
}
export default PaginaNonTrovata;
