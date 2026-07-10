import { ClipboardList, History, LayoutDashboard, Menu, User, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import logo from "../../../assets/icons/roomify-logo.svg";

const navLinkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition ${
    isActive
      ? "bg-primary/10 text-primary"
      : "text-on-surface-variant hover:bg-surface-container-low"
  }`;

const DeliverySidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <button
        className="fixed left-4 top-4  z-50 rounded-lg bg-white p-2 shadow-sm lg:hidden"
        onClick={() => setIsOpen(true)}
        aria-label="Open delivery menu"
      >
        <Menu className="text-primary" size={22} />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={closeMenu}
        />
      )}

      <aside
        className={`fixed left-0 top-0 bottom-0 z-51 flex  w-64 flex-col border-r border-surface-variant bg-white px-4 py-5 transition-transform  lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          className="self-end rounded-lg p-1 hover:bg-surface-container-low lg:hidden"
          onClick={closeMenu}
          aria-label="Close delivery menu"
        >
          <X className="text-primary" size={20} />
        </button>

        <figure className="mb-8">
          <img src={logo} alt="Roomify logo" />
        </figure>

        <nav>
          <ul className="space-y-2">
            <li>
              <NavLink to="/delivery" end className={navLinkClass} onClick={closeMenu}>
                <LayoutDashboard size={20} />
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/delivery/orders" className={navLinkClass} onClick={closeMenu}>
                <ClipboardList size={20} />
                Orders
              </NavLink>
            </li>
            <li>
              <NavLink to="/delivery/history" className={navLinkClass} onClick={closeMenu}>
                <History size={20} />
                History
              </NavLink>
            </li>
            <li>
              <NavLink to="/delivery/profile" className={navLinkClass} onClick={closeMenu}>
                <User size={20} />
                Profile
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default DeliverySidebar;
