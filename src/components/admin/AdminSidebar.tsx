import { NavLink } from "react-router-dom";
import { LuArrowLeft } from "react-icons/lu";
import { vociMenuAdmin } from "./adminNavItems";

function AdminSidebar() {
  return (
    <nav className="navbar-desktop">
      <div className="navbar-logo">
        <img src="/Logo_CapStone.png" alt="MS Art Ballet" />
      </div>

      <span className="navbar-section-label">Area Admin</span>

      <ul className="navbar-menu">
        {vociMenuAdmin.map(({ path, label, icon: Icon }) => (
          <li key={path}>
            <NavLink
              to={path}
              end={path === "/admin"}
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
        <NavLink to="/" className="navbar-cta">
          <LuArrowLeft size={16} />
          <span>Torna al sito</span>
        </NavLink>
      </div>
    </nav>
  );
}

export default AdminSidebar;
