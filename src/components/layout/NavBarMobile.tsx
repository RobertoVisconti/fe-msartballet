import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Offcanvas } from "react-bootstrap";
import {
  LuMenu,
  LuArrowRight,
  LuUser,
  LuBookOpen,
  LuTicket,
} from "react-icons/lu";
import { vociMenu } from "./navItems";
import { useAppSelector } from "@/redux/store/hooks";

function NavBarMobile() {
  const [aperto, setAperto] = useState(false);
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
