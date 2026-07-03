import { Link } from "react-router-dom";
import useAuth from "../../store/authStore";
import {motion,AnimatePresence} from "framer-motion"
import { useQueryClient } from "@tanstack/react-query";

const UserDropdown = ({children ,isOpen,setIsOpen,links,className}) => {
  
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  
 
 
   
   const handleLogout = () => {
     setIsOpen(false);
     logout();
     queryClient.clear();
   };

  return (
    
    <div className="relative mt-auto">
      
       {children}
      
      <AnimatePresence>

        {isOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }}   
        exit={{ opacity: 0, y: -10 }}
        transition={{duration:0.25}}
        className={`absolute ${className} w-56 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden`}>
            
            
            <div className="px-4 py-3 bg-brand-surface/30 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-800">{user?.firstName || "User"} {user?.lastName}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email || "user@example.com"}</p>
            </div>

            
            <div className="py-1">
              {user?.role === "admin" && (
                <Link
                  to="/admin/products"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-surface hover:text-brand-brown transition-colors"
                >
                  Admin Products
                </Link>
              )}
              <Link 
                to="/profile" 
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-surface hover:text-brand-brown transition-colors"
              >
                My Profile
              </Link>
              <Link 
                to="/orders" 
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-surface hover:text-brand-brown transition-colors"
              >
                My Orders
              </Link>
            </div>

            
            <div className="py-1 border-t border-gray-100">
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                Logout
              </button>
            </div>
            
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserDropdown;
