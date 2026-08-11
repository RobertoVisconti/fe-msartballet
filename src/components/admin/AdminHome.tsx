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
      </ul>
      <p className="testo-secondario">
        Insegnanti, Ospiti e Admin arrivano nella prossima iterazione.
      </p>
    </div>
  );
}

export default AdminHome;
