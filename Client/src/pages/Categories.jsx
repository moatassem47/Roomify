import { MoveRight } from 'lucide-react';
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';

const Categories = ({setActive}) => {
  const navigate=useNavigate()
  const rooms = [
    { id: 1, name: "Living room", image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=400&q=80", shape: "rounded-t-full" },
    { id: 2, name: "Kitchen", image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=400&q=80", shape: "rounded-tr-[4rem] rounded-bl-[4rem]" },
    { id: 3, name: "Bedroom", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=400&q=80", shape: "rounded-t-full" },
    { id: 4, name: "Office", image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=400&q=80", shape: "rounded-b-4xl" },
    { id: 5, name: "Hallway", image: "https://images.unsplash.com/photo-1630699294288-3bc2ae7bf361?q=80&w=1170&auto=format&fit=crop", shape: "rounded-r-full" }
  ];

  const handleCategoryClick = (roomName) => {
    navigate(`/shop?category=${roomName}`)
    setActive(false)
  };

  return (
    <AnimatePresence mode='wait'>
      <motion.div 
        
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }} 
        exit={{ opacity: 0, y: 10 }}  
        transition={{ duration: 0.3, ease: "easeOut" }} 
        
        
        className="w-full bg-white border-b border-brand-surface-container py-10  -top-22absolute left-0 shadow-lg z-50"
      >
        <div className="max-w-7xl mx-auto flex items-center gap-6 overflow-x-auto scrollbar-none pb-4">
          {rooms.map((room) => (
            <div
              key={room.id}
              onClick={() => handleCategoryClick(room.name)}
              className="flex flex-col gap-4 min-w-37.5 md:min-w-45 cursor-pointer group shrink-0"
            >
              <div className={`w-full h-52 md:h-60 overflow-hidden ${room.shape} relative bg-gray-100`}>
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>

              <div className="flex items-center justify-between px-1">
                <span className="font-sans text-sm md:text-base font-medium text-brand-charcoal group-hover:text-brand-cedar transition-colors duration-200">
                  {room.name}
                </span>
                <MoveRight 
                  size={16} 
                  className="text-brand-charcoal transform -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-brand-cedar transition-all duration-300"
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Categories;