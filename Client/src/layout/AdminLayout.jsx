import { Outlet } from "react-router-dom"
import SideBar from "../features/admin/components/SideBar"


const AdminLayout = () => {
  return (
    <div className="flex min-h-screen relative">
      <SideBar />

      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

