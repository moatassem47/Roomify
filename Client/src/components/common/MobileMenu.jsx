import { useState } from "react"
import { Menu, X } from "lucide-react"
import {  NavLink } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false)

  
  const menuVariants = {
    closed: { x: "100%", transition: { type: "tween", duration: 0.3 } },
    open: { x: 0, transition: { type: "tween", duration: 0.3 } }
  }

 
  const linkVariants = {
    closed: { opacity: 0, x: 20 },
    open: i => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1 + 0.1 }
    })
  }

  const links = [
    { name: "Home", path: "/" },
    { name: "Shop All", path: "/shop" },
    { name: "Our Story", path: "/story" }
  ]

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none md:hidden"
      >
        <Menu color="#825032" size={30} className="cursor-pointer active:opacity-80" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />

            
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 right-0 bottom-0 w-[80vw] max-w-fit bg-white z-50 flex flex-col shadow-2xl"
            >
              
              <div className="flex justify-end p-6">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-black/5 transition-colors focus:outline-none"
                >
                  <X color="#825032" size={32} />
                </button>
              </div>

              
              <div className="flex flex-col px-8 mt-4 gap-8">
                {links.map((link, i) => (
                  <motion.div
                    custom={i}
                    variants={linkVariants}
                    key={link.name}
                  >
                    <NavLink
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className="text-3xl font-semibold text-[#84746c] hover:text-brand-cedar transition-colors block"
                    >
                      {link.name}
                    </NavLink>
                  </motion.div>
                ))}
              </div>

              <div>

              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default MobileMenu