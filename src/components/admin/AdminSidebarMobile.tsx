import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Offcanvas } from "react-bootstrap";
import { LuMenu, LuArrowLeft, LuLogOut } from "react-icons/lu";
import { vociMenuAdmin } from "./adminNavItems";
import { useAppDispatch } from "@/redux/store/hooks";
import { logout } from "@/redux/slices/authSlice";

function AdminSidebarMobile() {
  const [aperto, setAperto] = useState(false);
  const dispatch = useAppDispatch();

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
          aria-label="Apri il menu admin"
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
          <Offcanvas.Title>Area Admin</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ul className="navbar-menu">
            {vociMenuAdmin.map(({ path, label, icon: Icon }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  end={path === "/admin"}
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

          <ul className="navbar-menu">
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

          <NavLink
            to="/"
            onClick={() => setAperto(false)}
            className="navbar-cta"
          >
            <LuArrowLeft size={16} />
            <span>Torna al sito</span>
          </NavLink>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default AdminSidebarMobile;
