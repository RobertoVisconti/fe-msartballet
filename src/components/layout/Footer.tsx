import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <img src="/Logo_CapStone_Close.png" alt="" className="footer-logo" />
        <span>MS Art Ballet — Scuola di danza</span>
      </div>

      <nav className="footer-links">
        <Link to="/la-scuola">La scuola</Link>
        <Link to="/corsi">Corsi</Link>
        <Link to="/sale">Sale</Link>
        <Link to="/contatti">Contatti</Link>
      </nav>

      <span className="footer-copyright">
        © {new Date().getFullYear()} MS Art Ballet. Tutti i diritti riservati.
      </span>
    </footer>
  );
}

export default Footer;
