import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Offcanvas } from "react-bootstrap";
import {
  LuMenu,
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

function NavBarMobile() {
  const [aperto, setAperto] = useState(false);
  const dispatch = useAppDispatch();
  const { isAuthenticated, utente } = useAppSelector((state) => state.auth);

  return (
    <>
      <div className="navbar-mobile-bar">
        <img
          src="/Logo_CapStone_Close.png"
          alt="MS Art Ballet"
          className="navbar-mobile-logo"
        />
        <button
          type="button"
          className="navbar-mobile-toggle"
          onClick={() => setAperto(true)}
          aria-label="Apri il menu"
        >
          <LuMenu size={22} />
        </button>
      </div>

      <Offcanvas
        show={aperto}
        onHide={() => setAperto(false)}
        placement="end"
        className="navbar-offcanvas"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ul className="navbar-menu">
            {vociMenu.map(({ path, label, icon: Icon }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  end={path === "/"}
                  onClick={() => setAperto(false)}
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
                      onClick={() => setAperto(false)}
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
                    onClick={() => setAperto(false)}
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
                        onClick={() => setAperto(false)}
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
                        onClick={() => setAperto(false)}
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
                    onClick={() => {
                      dispatch(logout());
                      setAperto(false);
                    }}
                  >
                    <LuLogOut size={17} strokeWidth={1.8} />
                    <span>Esci</span>
                  </button>
                </li>
              </ul>
            </>
          )}

          <NavLink
            to="/lezioni"
            onClick={() => setAperto(false)}
            className="navbar-cta"
          >
            <span>Prenota una prova</span>
            <LuArrowRight size={16} />
          </NavLink>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default NavBarMobile;
