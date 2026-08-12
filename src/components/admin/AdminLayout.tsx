import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSideBar";
import AdminSidebarMobile from "./AdminSideBarMobile";

function AdminLayout() {
  return (
    <div className="app-shell">
      <AdminSidebar />
      <AdminSidebarMobile />
      <div className="app-main">
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
