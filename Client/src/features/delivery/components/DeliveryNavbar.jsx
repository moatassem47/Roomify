import { UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import UserDropdown from "../../../components/UserDropdown";
import useAuth from "../../../store/authStore";

const pageTitles = [
  { match: "/delivery/orders", title: "Orders" },
  { match: "/delivery/history", title: "History" },
  { match: "/delivery/profile", title: "Profile" },
];

const DeliveryNavbar = () => {
  const user = useAuth((s)=>s.user);
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const title = useMemo(() => {
    return (
      pageTitles.find((item) => location.pathname.startsWith(item.match))
        ?.title || "Dashboard"
    );
  }, [location.pathname]);

  return (
    <header className="fixed right-0 left-0  lg:left-64 flex min-h-20 items-center justify-between border-b border-surface-variant bg-white px-6 shadow-sm lg:px-8">
      <div className="ml-10 lg:ml-0">
        <p className="text-xs font-semibold uppercase text-outline">
          Delivery
        </p>
        <h1 className="text-2xl font-semibold text-brand-charcoal">{title}</h1>
      </div>

      <UserDropdown
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        className="right-0 mt-3"
        children={
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-3 rounded-lg border border-surface-variant bg-white px-3 py-2 text-left hover:bg-surface-container-low"
          >
            <UserRound className="text-primary" size={22} />
            <span className="hidden text-sm font-semibold text-on-surface sm:block">
              {user?.firstName} {user?.lastName}
            </span>
          </button>
        }
      />
    </header>
  );
};

export default DeliveryNavbar;
