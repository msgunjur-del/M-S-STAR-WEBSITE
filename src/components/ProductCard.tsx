import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBasket, ArrowRight } from 'lucide-react';

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
  return (
    <Link to={`/product/${id}`} className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm card-hover flex flex-col h-full group relative overflow-hidden">
      <div className="aspect-square bg-slate-50 rounded-[1.5rem] mb-6 flex items-center justify-center text-slate-400 font-bold overflow-hidden relative">
        <img 
          src={imageUrl || `https://images.unsplash.com/photo-1562564055-71e051d33c19?w=400&q=80`} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
          referrerPolicy="no-referrer" 
        />
        <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/40 transition-colors duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="bg-white text-ink p-4 rounded-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <ShoppingBasket size={24} />
          </div>
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
        <p className="text-xs font-bold text-slate-400 leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-50">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Starting from</span>
          <span className="text-2xl font-black text-ink tracking-tighter">₹{price}</span>
        </div>
        <div className="w-12 h-12 bg-slate-50 text-ink rounded-2xl flex items-center justify-center group-hover:bg-accent-blue group-hover:text-white transition-all duration-500 shadow-sm">
          <ArrowRight size={20} />
        </div>
      </div>
    </Link>
  );
}
