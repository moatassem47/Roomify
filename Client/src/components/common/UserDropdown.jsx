import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import CancelPopUp from "./CancelPopUp";
import { USER_ROLES } from "../../utils/roleRoutes";

const UserDropdown = ({ children, isOpen, setIsOpen, className }) => {
  const user = useAuth((s)=>s.user);
  const  logout = useAuth((s)=>s.logout);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const isUser = USER_ROLES.includes(user?.role);

  const handleLogout = async () => {
    setIsOpen(false);
    setIsPopupOpen(false);
    await logout();
    queryClient.clear();
    navigate("/login", { replace: true });
  };

  return (
    <div className="relative">
      {children}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className={`absolute ${className} w-56 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden`}
          >
            <div className="px-4 py-3 bg-brand-surface/30 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-800">
                {user?.firstName || "User"} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || "user@example.com"}
              </p>
            </div>

            <div className="py-1">
              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-surface hover:text-brand-brown transition-colors"
                >
                  Admin DashBoard
                </Link>
              )}
              {user?.role === "delivery" && (
                <Link
                  to="/delivery"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-surface hover:text-brand-brown transition-colors"
                >
                  Delivery Dashboard
                </Link>
              )}
              {user?.role === "delivery" && (
                <Link
                  to="/delivery/profile"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-surface hover:text-brand-brown transition-colors"
                >
                  My Profile
                </Link>
              )}
              {isUser && (
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-surface hover:text-brand-brown transition-colors"
                >
                  My Profile
                </Link>
              )}
              {isUser && (
                <Link
                  to="/orders"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-surface hover:text-brand-brown transition-colors"
                >
                  My Orders
                </Link>
              )}
              {isUser&&<Link
                to="/wishlist"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-surface hover:text-brand-brown transition-colors"
              >
                My Wishlist
              </Link>}
            </div>

            <div className="py-1 border-t border-gray-100">
              <button
                onClick={() => setIsPopupOpen(true)}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {isPopupOpen && (
        <CancelPopUp
          handleClick={handleLogout}
          setOpenPopUp={setIsPopupOpen}
          title="Are you sure you want to Logout?"
          acceptMessage="Logout"
          refuseMessage="Cancel"
        />
      )}
    </div>
  );
};

export default UserDropdown;
