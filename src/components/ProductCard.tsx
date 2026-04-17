import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBasket, ArrowRight, X, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProductCardProps {
  id: string;
  title: string;
  description: string;
  price: string | number;
  category: string;
  imageUrl?: string;
  key?: React.Key;
}

export default function ProductCard({ id, title, description, price, category, imageUrl }: ProductCardProps) {
  const [showQuickView, setShowQuickView] = useState(false);

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="h-full group/card relative"
      >
        {/* Subtle Gradient Border on Hover */}
        <div className="absolute -inset-[1.5px] rounded-[2.5rem] bg-gradient-to-br from-blue-400 to-blue-600 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
        
        <Link 
          to={`/product/${id}`} 
          className="bg-card rounded-[2.5rem] p-6 border border-slate-300 shadow-sm card-hover flex flex-col h-full group relative overflow-hidden z-10 transition-colors duration-500 group-hover/card:border-transparent dark:border-slate-800"
        >
          <div className="aspect-square bg-slate-50 rounded-[1.5rem] mb-6 flex items-center justify-center text-slate-400 font-bold overflow-hidden relative">
            <img 
              src={imageUrl || `https://images.unsplash.com/photo-1633265486064-086b219458ce?w=400&q=80`} 
              alt={title} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              referrerPolicy="no-referrer" 
            />
            <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/40 transition-colors duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleQuickView}
                className="bg-white text-ink p-4 rounded-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 flex items-center gap-2 font-bold"
              >
                <ShoppingBasket size={20} />
                <span className="text-sm">Quick View</span>
              </motion.div>
            </div>
            <div className="absolute top-4 left-4">
              <span className="bg-white/90 backdrop-blur-md text-ink px-3 py-1.5 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-sm border border-white/20">
                {category}
              </span>
            </div>
          </div>
          
          <div className="space-y-3 flex-grow">
            <h3 className="text-xl font-black font-headline tracking-tight text-ink group-hover:text-accent-blue transition-colors leading-tight">
              {title}
            </h3>
            <p className="text-xs font-black text-slate-700 leading-relaxed line-clamp-2 dark:text-slate-400">
              {description}
            </p>
          </div>

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest dark:text-slate-400">Starting from</span>
              <span className="text-2xl font-black text-ink tracking-tighter">₹{price}</span>
            </div>
            <motion.div 
              whileHover={{ x: 5 }}
              className="w-12 h-12 bg-slate-50 text-ink rounded-2xl flex items-center justify-center group-hover:bg-accent-blue group-hover:text-white transition-all duration-500 shadow-sm"
            >
              <ArrowRight size={20} />
            </motion.div>
          </div>
        </Link>
      </motion.div>

      <AnimatePresence>
        {showQuickView && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowQuickView(false)}
              className="absolute inset-0 bg-ink/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
              <button 
                onClick={() => setShowQuickView(false)}
                className="absolute top-6 right-6 z-10 w-10 h-10 bg-white/80 backdrop-blur-md text-ink rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm"
              >
                <X size={20} />
              </button>

              <div className="w-full md:w-1/2 aspect-square md:aspect-auto bg-slate-50">
                <img 
                  src={imageUrl || `https://images.unsplash.com/photo-1633265486064-086b219458ce?w=800&q=80`} 
                  alt={title} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer" 
                />
              </div>

              <div className="w-full md:w-1/2 p-8 sm:p-10 flex flex-col">
                <div className="mb-2">
                  <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                    {category}
                  </span>
                </div>
                <h2 className="text-3xl font-black font-headline text-ink mb-4 leading-tight">
                  {title}
                </h2>
                <p className="text-slate-700 font-bold text-sm leading-relaxed mb-8 flex-grow dark:text-slate-400">
                  {description}
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Starting from</span>
                      <span className="text-3xl font-black text-ink tracking-tighter">₹{price}</span>
                    </div>
                  </div>

                  <Link 
                    to={`/product/${id}`}
                    className="w-full bg-accent-blue text-white py-5 rounded-2xl font-black text-center hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-3 group"
                  >
                    View Full Details
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
