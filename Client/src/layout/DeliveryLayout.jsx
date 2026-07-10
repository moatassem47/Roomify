import { Outlet } from "react-router-dom";
import DeliveryNavbar from "../features/delivery/components/DeliveryNavbar";
import DeliverySidebar from "../features/delivery/components/DeliverySidebar";

const DeliveryLayout = () => {
  return (
    <div className="flex  bg-brand-cream relative">
      <DeliverySidebar />
      <div className="flex min-w-0 flex-1 flex-col relative lg:ml-64">
        <DeliveryNavbar />
        <main className="flex-1 overflow-y-auto  mt-21 ">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DeliveryLayout;
