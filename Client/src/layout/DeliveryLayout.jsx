import { Outlet } from "react-router-dom";
import DeliveryNavbar from "../features/delivery/components/DeliveryNavbar";
import DeliverySidebar from "../features/delivery/components/DeliverySidebar";

const DeliveryLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-brand-cream">
      <DeliverySidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <DeliveryNavbar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DeliveryLayout;
