
import { motion } from 'framer-motion';
import { ShieldCheck, Sparkles, Trees, Armchair } from 'lucide-react';

const OurStory = () => {
 
  const fadeInSpread = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="bg-brand-cream/30 min-h-screen text-brand-charcoal overflow-x-hidden">
      
     
      <section className="relative h-[60vh] flex items-center justify-center bg-brand-cedar text-white overflow-hidden">
       
        <div className="absolute inset-0 bg-black/20 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80" 
          alt="Beautifully crafted living room furniture" 
          className="absolute inset-0 w-full h-full object-cover transform scale-105 filter brightness-75 animate-pulse-slow"
        />
        
        <div className="relative z-20 text-center max-w-3xl px-6">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-serif text-white text-4xl md:text-6xl mb-4 tracking-wide"
          >
            Crafting Comfort, <br />Defining Spaces
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-sans text-lg md:text-xl text-white/90 max-w-xl mx-auto font-light"
          >
            The journey behind our obsession with thoughtful design and structural integrity.
          </motion.p>
        </div>
      </section>

     
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInSpread}
            className="space-y-6"
          >
            <span className="text-sm font-semibold uppercase tracking-widest text-brand-cedar block">
              How it Started
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-brand-cedar font-semibold leading-tight">
              From a single missing piece to rooms full of character.
            </h2>
            <p className="text-gray-600 leading-relaxed font-sans">
              Our story began in a simple workshop with an unmet need: furniture that honors the natural beauty of materials while standing up to the chaos of daily life. We found that modern offerings were either beautifully fragile or sturdily uninspiring. 
            </p>
            <p className="text-gray-600 leading-relaxed font-sans">
              We set out to change that by bridging the gap between intentional artistry and industrial endurance. Every structural frame, fabric blend, and finish selection we create is passed through a meticulous review before ever finding its place inside your home.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative h-100 rounded-2xl overflow-hidden shadow-ambient"
          >
            <img 
              src="https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&w=800&q=80" 
              alt="Artisan assembling wooden furniture joint" 
              className="w-full h-full object-cover"
            />
          </motion.div>

        </div>
      </section>

      
      <section className="bg-brand-cedar/5 border-t border-b border-brand-surface-container py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInSpread}
            className="max-w-xl mx-auto mb-16"
          >
            <h2 className="font-serif text-3xl md:text-4xl text-brand-cedar font-semibold mb-4">
              The Pillars of Our Process
            </h2>
            <p className="text-gray-600 text-sm">
              We manage our inventory and source our components through strict environmental and ethical checkpoints.
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
           
            <motion.div variants={fadeInSpread} className="bg-white p-6 rounded-2xl shadow-sm border border-brand-surface-container flex flex-col items-center">
              <div className="p-3 bg-brand-cream rounded-xl text-brand-cedar mb-4">
                <Trees size={28} />
              </div>
              <h3 className="font-serif font-semibold text-lg mb-2 text-brand-cedar">Sustainably Sourced</h3>
              <p className="text-gray-500 text-xs leading-relaxed font-sans">
                We prioritize certified woods harvested responsibly to ensure local ecosystems thrive for generations.
              </p>
            </motion.div>

           
            <motion.div variants={fadeInSpread} className="bg-white p-6 rounded-2xl shadow-sm border border-brand-surface-container flex flex-col items-center">
              <div className="p-3 bg-brand-cream rounded-xl text-brand-cedar mb-4">
                <Sparkles size={28} />
              </div>
              <h3 className="font-serif font-semibold text-lg mb-2 text-brand-cedar">Timeless Aesthetics</h3>
              <p className="text-gray-500 text-xs leading-relaxed font-sans">
                Avoiding short-lived trends to create silhouettes that look as classic tomorrow as they do today.
              </p>
            </motion.div>

          
            <motion.div variants={fadeInSpread} className="bg-white p-6 rounded-2xl shadow-sm border border-brand-surface-container flex flex-col items-center">
              <div className="p-3 bg-brand-cream rounded-xl text-brand-cedar mb-4">
                <ShieldCheck size={28} />
              </div>
              <h3 className="font-serif font-semibold text-lg mb-2 text-brand-cedar">Built for Generations</h3>
              <p className="text-gray-500 text-xs leading-relaxed font-sans">
                Reinforced joints and resilient, heavy-duty fabrics capable of handling real family lifetimes.
              </p>
            </motion.div>

           
            <motion.div variants={fadeInSpread} className="bg-white p-6 rounded-2xl shadow-sm border border-brand-surface-container flex flex-col items-center">
              <div className="p-3 bg-brand-cream rounded-xl text-brand-cedar mb-4">
                <Armchair size={28} />
              </div>
              <h3 className="font-serif font-semibold text-lg mb-2 text-brand-cedar">Ergonomic Depth</h3>
              <p className="text-gray-500 text-xs leading-relaxed font-sans">
                Beauty shouldn’t pinch. Every curve is scientifically mapped for maximum spinal distribution and relief.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <h2 className="font-serif text-3xl md:text-5xl text-brand-cedar font-semibold leading-tight">
            Ready to redesign your daily horizon?
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto font-sans text-sm md:text-base">
            Explore our curated collections of living room, bedroom, and workspace essentials designed to center your living space.
          </p>
          <div className="pt-4">
            <a 
              href="/shop" 
              className="inline-block bg-brand-cedar text-white px-8 py-3 rounded-base shadow-md font-sans font-semibold tracking-wide hover:bg-brand-cedar/90 transition-all transform hover:-y-0.5"
            >
              Explore Our Collection
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default OurStory;