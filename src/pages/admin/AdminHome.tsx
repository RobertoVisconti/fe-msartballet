import { Link } from "react-router-dom";

function AdminHome() {
  return (
    <div className="in-arrivo">
      <h1>Area Admin</h1>
      <p>Sezioni disponibili:</p>
      <ul className="admin-menu-lista">
        <li>
          <Link to="/admin/allievi">Gestione Allievi</Link>
        </li>
        <li>
          <Link to="/admin/insegnanti">Gestione Insegnanti</Link>
        </li>
        <li>
          <Link to="/admin/ospiti">Gestione Ospiti (sola lettura)</Link>
        </li>
        <li>
          <Link to="/admin/discipline">Discipline</Link>
        </li>
        <li>
          <Link to="/admin/sale">Sale</Link>
        </li>
        <li>
          <Link to="/admin/prodotti">Prodotti</Link>
        </li>
        <li>
          <Link to="/admin/spettacoli">Spettacoli</Link>
        </li>
        <li>
          <Link to="/admin/corsi">Corsi</Link>
        </li>
        <li>
          <Link to="/admin/media">Media</Link>
        </li>
      </ul>
      <p className="testo-secondario">
        Gestione Admin (utenti con ruolo ADMIN) in sospeso — il backend non ha
        un endpoint per elencarli.
      </p>
    </div>
  );
}

export default AdminHome;
