import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

import AdminSidebarMobile from "./AdminSidebarMobile";

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
