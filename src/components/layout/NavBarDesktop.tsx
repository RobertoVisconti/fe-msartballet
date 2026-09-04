import { NavLink } from "react-router-dom";
import {
  LuArrowRight,
  LuUser,
  LuBookOpen,
  LuTicket,
  LuLogOut,
  LuLayoutDashboard,
} from "react-icons/lu";
import { vociMenu } from "./navItems";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { logout } from "@/redux/slices/authSlice";

function NavBarDesktop() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, utente } = useAppSelector((state) => state.auth);

  return (
    <nav className="navbar-desktop">
      <div className="navbar-logo">
        <img src="/Logo_CapStone.png" alt="MS Art Ballet" />
      </div>

      <span className="navbar-section-label">Navigazione</span>

      <ul className="navbar-menu">
        {vociMenu.map(({ path, label, icon: Icon }) => (
          <li key={path}>
            <NavLink
              to={path}
              end={path === "/"}
              className={({ isActive }) =>
                isActive ? "navbar-link active" : "navbar-link"
              }
            >
              <Icon size={17} strokeWidth={1.8} />
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      {isAuthenticated && utente && (
        <>
          <span className="navbar-section-label">Area personale</span>
          <ul className="navbar-menu">
            {utente.ruolo === "ADMIN" && (
              <li>
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    isActive ? "navbar-link active" : "navbar-link"
                  }
                >
                  <LuLayoutDashboard size={17} strokeWidth={1.8} />
                  <span>Area Admin</span>
                </NavLink>
              </li>
            )}
            <li>
              <NavLink
                to="/il-mio-profilo"
                className={({ isActive }) =>
                  isActive ? "navbar-link active" : "navbar-link"
                }
              >
                <LuUser size={17} strokeWidth={1.8} />
                <span>Il mio profilo</span>
              </NavLink>
            </li>
            {utente.ruolo === "ALLIEVO" && (
              <>
                <li>
                  <NavLink
                    to="/le-mie-iscrizioni"
                    className={({ isActive }) =>
                      isActive ? "navbar-link active" : "navbar-link"
                    }
                  >
                    <LuBookOpen size={17} strokeWidth={1.8} />
                    <span>Le mie iscrizioni</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/le-mie-prenotazioni"
                    className={({ isActive }) =>
                      isActive ? "navbar-link active" : "navbar-link"
                    }
                  >
                    <LuTicket size={17} strokeWidth={1.8} />
                    <span>Le mie prenotazioni</span>
                  </NavLink>
                </li>
              </>
            )}
            <li>
              <button
                type="button"
                className="navbar-link"
                onClick={() => dispatch(logout())}
              >
                <LuLogOut size={17} strokeWidth={1.8} />
                <span>Esci</span>
              </button>
            </li>
          </ul>
        </>
      )}

      <div className="navbar-footer-block">
        <NavLink to="/lezioni" className="navbar-cta">
          <span>Prenota una prova</span>
          <LuArrowRight size={16} />
        </NavLink>
        <p className="navbar-orari">
          Lun–Ven 15:00–21:00
          <br />
          Sab 09:00–13:00
        </p>
      </div>
    </nav>
  );
}

export default NavBarDesktop;
