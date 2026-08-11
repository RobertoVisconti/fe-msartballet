import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Offcanvas } from "react-bootstrap";
import { LuMenu, LuArrowRight } from "react-icons/lu";
import { vociMenu } from "./navItems";

function NavBarMobile() {
  const [aperto, setAperto] = useState(false);

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
          <NavLink
            to="/prenota-prova"
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
