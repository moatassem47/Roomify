import { NavLink } from "react-router-dom"
import logo from"../../../assets/icons/roomify-logo.svg"
import { LayoutDashboard, ShoppingCart, PackageSearch, Motorbike, User, Menu, X } from "lucide-react"
import navLinkClass from "./navLinkClass"
import useAuth from "../../../store/authStore"
import UserDropdown from "../../../components/common/UserDropdown"
import { useState } from "react"

const SideBar = () => {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <>
     
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 "
        onClick={() => setIsMobileOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="text-primary" size={22} />
      </button>

     
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      
      <aside
        className={`
          bg-white h-screen w-60 border-r border-r-brand-surface-container flex flex-col gap-5 pl-3
          fixed top-0 left-0 z-50 transition-transform duration-300
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        <button
          className="lg:hidden self-end mr-3 mt-3 p-1 rounded-lg hover:bg-brand-cedar/10"
          onClick={() => setIsMobileOpen(false)}
          aria-label="Close menu"
        >
          <X className="text-primary" size={20} />
        </button>

        <figure><img src={logo} alt="roomify logo" /></figure>

        <nav>
          <ul className="flex flex-col gap-2 [&_span]:font-serif [&_span]:text-xl">
            <li>
              <NavLink to="/admin" end className={navLinkClass} onClick={() => setIsMobileOpen(false)}>
                {({ isActive }) => (
                  <>
                    <LayoutDashboard className={isActive ? "text-primary" : "text-on-surface-variant"} />
                    <span className={isActive ? "text-primary" : ""}>Dashboard</span>
                  </>
                )}
              </NavLink>
            </li>

            <li>
              <NavLink to="inventory" className={navLinkClass} onClick={() => setIsMobileOpen(false)}>
                {({ isActive }) => (
                  <>
                    <ShoppingCart className={isActive ? "text-primary" : "text-on-surface-variant"} />
                    <span className={isActive ? "text-primary" : ""}>Inventory</span>
                  </>
                )}
              </NavLink>
            </li>

            <li>
              <NavLink to="orders" className={navLinkClass} onClick={() => setIsMobileOpen(false)}>
                {({ isActive }) => (
                  <>
                    <PackageSearch className={isActive ? "text-primary" : "text-on-surface-variant"} />
                    <span className={isActive ? "text-primary" : ""}>Orders</span>
                  </>
                )}
              </NavLink>
            </li>

            <li>
              <NavLink to="delivery" className={navLinkClass} onClick={() => setIsMobileOpen(false)}>
                {({ isActive }) => (
                  <>
                    <Motorbike className={isActive ? "text-primary" : "text-on-surface-variant"} />
                    <span className={isActive ? "text-primary" : ""}>Delivery</span>
                  </>
                )}
              </NavLink>
            </li>
          </ul>
        </nav>

        <UserDropdown
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          children={
            <div
              className="flex bg-brand-cedar/10 px-2 py-3 rounded-xl mr-2 gap-3 mb-8 cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            >
              <User color="white" size={40} className="p-3 bg-brand-cedar/50 rounded-full" />
              <div className="flex flex-col">
                <span className="font-bold text-sm">{user.firstName} {user.lastName}</span>
                <span className="text-xs">Administrator</span>
              </div>
            </div>
          }
          className={"-top-50 -right-55"}
        />
      </aside>
    </>
  )
}

export default SideBar
