import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBasket, ShieldAlert, Zap, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import ProductCard from '../components/ProductCard';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

const FALLBACK_PVC_CARDS = [
  { id: 'pvc-1', title: 'Aadhar PVC Card Printing', description: 'High-quality Aadhar card printing on durable PVC material.', price: 99, category: 'PVC CARDS', imageUrl: 'https://picsum.photos/seed/aadhar/400/300' },
  { id: 'pvc-2', title: 'PAN Card PVC Printing', description: 'Get your PAN card printed on a premium PVC card.', price: 99, category: 'PVC CARDS', imageUrl: 'https://picsum.photos/seed/pan/400/300' },
  { id: 'pvc-3', title: 'Voter ID PVC Card', description: 'Durable and waterproof Voter ID PVC card printing.', price: 99, category: 'PVC CARDS', imageUrl: 'https://picsum.photos/seed/voter/400/300' },
  { id: 'pvc-4', title: 'Custom ID Card', description: 'Custom ID cards for schools, colleges, and corporate offices.', price: 149, category: 'PVC CARDS', imageUrl: 'https://picsum.photos/seed/idcard/400/300' }
];

export default function PVCCardsPage() {
  const [pvcCards, setPvcCards] = useState<any[]>(FALLBACK_PVC_CARDS);

  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      try {
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000));
        const q = query(collection(db, 'products'), where('category', '==', 'PVC CARDS'));
        const querySnapshot = await Promise.race([getDocs(q), timeoutPromise]) as any;
        if (isMounted && querySnapshot?.docs?.length > 0) {
          setPvcCards(querySnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })));
        }
      } catch (error) {
        console.warn("Using fallback PVC cards.");
      }
    };
    fetchProducts();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      {/* Header */}
      <div className="relative overflow-hidden bg-ink rounded-[3rem] p-12 lg:p-16 text-white">
        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest border border-white/10 backdrop-blur-md">
              <Zap size={12} className="text-accent-amber" />
              <span>Durable & Waterproof</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-black font-headline leading-[0.9] tracking-tighter">
              PVC SMART <br />
              <span className="text-accent-amber">CARDS.</span>
            </h1>
            <p className="text-lg text-slate-400 font-medium leading-relaxed max-w-md">
              High-definition printing on premium PVC material. Perfect for Aadhar, PAN, Voter ID, and Custom IDs.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-md space-y-4">
            <div className="flex items-center gap-3 text-accent-amber">
              <ShieldAlert size={20} />
              <span className="font-black text-xs uppercase tracking-widest">Important Notice</span>
            </div>
            <p className="text-sm text-slate-300 font-bold leading-relaxed">
              We print exactly what you upload without any modifications. Ensure your file matches the product requirements.
            </p>
            <Link to="/terms-conditions" className="inline-flex items-center gap-2 text-white font-black text-xs uppercase tracking-widest hover:text-accent-amber transition-colors">
              Read Terms <ArrowRight size={14} />
            </Link>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-accent-blue/20 blur-[100px] -rotate-12 translate-x-1/4" />
      </div>

      {pvcCards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pvcCards.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <ProductCard 
                id={product.id}
                title={product.title} 
                description={product.description} 
                price={product.price} 
                category={product.category} 
                imageUrl={product.imageUrl}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 glass rounded-[3rem] border border-slate-100">
          <p className="text-slate-400 font-black text-xl">No PVC cards available at the moment.</p>
        </div>
      )}
    </div>
  );
}
