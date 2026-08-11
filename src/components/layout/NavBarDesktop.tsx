import { NavLink } from "react-router-dom";
import { LuArrowRight } from "react-icons/lu";
import { vociMenu } from "./navItems";

function NavBarDesktop() {
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

      <div className="navbar-footer-block">
        <NavLink to="/prenota-prova" className="navbar-cta">
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
