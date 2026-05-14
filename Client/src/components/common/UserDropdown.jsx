import { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../store/authStore";
import {  User } from "lucide-react";
import {motion,AnimatePresence} from "framer-motion"
const UserDropdown = () => {
  
  const { user, logout } = useAuth();
  
 
  const [isOpen, setIsOpen] = useState(false);

  
  const handleLogout = () => {
    setIsOpen(false);
    logout();
  };

  return (
    
    <div className="relative">
      
       
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 focus:outline-none"
      >
        <User color="#825032"  className="cursor-pointer hover:-translate-y-1  transition-all duration-300 active:opacity-80"/>
      </button>

      <AnimatePresence>

        {isOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }}   
        exit={{ opacity: 0, y: -10 }}
        transition={{duration:0.25}}
        className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
            
            
            <div className="px-4 py-3 bg-brand-surface/30 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-800">{user?.firstName || "User"} {user?.lastName}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email || "user@example.com"}</p>
            </div>

            
            <div className="py-1">
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