import { Outlet } from "react-router-dom";
import NavBarDesktop from "./NavBarDesktop";
import NavBarMobile from "./NavBarMobile";
import Footer from "./Footer";

function Layout() {
  return (
    <div className="app-shell">
      <NavBarDesktop />
      <NavBarMobile />
      <div className="app-main">
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default Layout;
