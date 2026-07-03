import { Outlet } from "react-router-dom"
import SideBar from "../features/admin/components/SideBar"


const AdminLayout = () => {
  return (
    <div className="flex h-screen overflow-auto relative">
      <SideBar />

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

