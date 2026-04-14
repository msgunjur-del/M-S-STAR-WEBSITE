import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { Calculator, FileText, CreditCard, Camera, ArrowRight, Zap, Info } from 'lucide-react';
import { motion } from 'motion/react';

export default function RateCalculatorPage() {
  const [settings, setSettings] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const settingsSnap = await getDoc(doc(db, 'settings', 'global'));
        if (settingsSnap.exists()) {
          setSettings(settingsSnap.data());
        }
        
        const productsSnap = await getDocs(collection(db, 'products'));
        setProducts(productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching rates:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest border border-blue-100">
          <Calculator size={12} />
          <span>Transparent Pricing</span>
        </div>
        <h1 className="text-5xl lg:text-6xl font-black font-headline tracking-tighter text-ink">
          RATE <span className="text-blue-600">CALCULATOR.</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
          Get instant estimates for all our premium printing services. No hidden costs, just pure precision.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Document Printing Rates */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6"
        >
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <FileText size={28} />
          </div>
          <h3 className="text-2xl font-black font-headline text-ink">Document Printing</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
              <span className="text-sm font-bold text-slate-600">B&W Print (Single)</span>
              <span className="font-black text-ink">₹{settings?.pricePerPrintBW || 3}/pg</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
              <span className="text-sm font-bold text-slate-600">B&W Print (Double)</span>
              <span className="font-black text-ink">₹{(settings?.pricePerPrintBW || 3) * 0.8}/pg</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
              <span className="text-sm font-bold text-slate-600">Color Print</span>
              <span className="font-black text-ink">₹{settings?.pricePerPrintColor || 10}/pg</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
              <span className="text-sm font-bold text-slate-600">Spiral Binding</span>
              <span className="font-black text-ink">₹{settings?.spiralBindingCost || 50}</span>
            </div>
          </div>
        </motion.div>

        {/* PVC Card Rates */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6"
        >
          <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
            <CreditCard size={28} />
          </div>
          <h3 className="text-2xl font-black font-headline text-ink">PVC Smart Cards</h3>
          <div className="space-y-4">
            {products.filter(p => p.category === 'PVC CARDS').slice(0, 4).map(p => (
              <div key={p.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                <span className="text-sm font-bold text-slate-600 truncate max-w-[150px]">{p.title}</span>
                <span className="font-black text-ink">₹{p.price}</span>
              </div>
            ))}
            {products.filter(p => p.category === 'PVC CARDS').length === 0 && (
              <div className="p-4 bg-slate-50 rounded-2xl text-center text-slate-400 text-sm font-bold italic">
                Check individual products for rates
              </div>
            )}
          </div>
        </motion.div>

        {/* Photo Rates */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6"
        >
          <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
            <Camera size={28} />
          </div>
          <h3 className="text-2xl font-black font-headline text-ink">Passport Photos</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
              <span className="text-sm font-bold text-slate-600">8 Passport Photos</span>
              <span className="font-black text-ink">₹99</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
              <span className="text-sm font-bold text-slate-600">16 Passport Photos</span>
              <span className="font-black text-ink">₹149</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
              <span className="text-sm font-bold text-slate-600">Combo Pack</span>
              <span className="font-black text-ink">₹149</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
              <span className="text-sm font-bold text-slate-600">Express Delivery</span>
              <span className="font-black text-green-600">FREE</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Calculator Tool */}
      <section className="bg-ink text-white p-12 lg:p-16 rounded-[3rem] shadow-2xl relative overflow-hidden">
        <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest border border-white/10">
              <Zap size={12} className="text-accent-amber" />
              <span>Bulk Pricing Available</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black font-headline leading-tight tracking-tighter">
              NEED A CUSTOM <br />
              <span className="text-accent-amber">QUOTATION?</span>
            </h2>
            <p className="text-lg text-slate-400 font-medium leading-relaxed">
              For bulk orders or specialized printing requirements, our team can provide custom rates tailored to your needs.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="bg-accent-amber text-ink px-10 py-5 rounded-2xl font-black text-lg hover:bg-amber-500 transition-all shadow-xl shadow-amber-900/20 flex items-center gap-3">
                Contact on WhatsApp
                <ArrowRight size={20} />
              </a>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-md space-y-6">
            <div className="flex items-center gap-3 text-accent-amber">
              <Info size={20} />
              <span className="font-black text-xs uppercase tracking-widest">Pricing Policy</span>
            </div>
            <div className="space-y-4 text-sm text-slate-300 font-bold leading-relaxed">
              <p>• All prices are inclusive of GST where applicable.</p>
              <p>• Standard delivery is free for orders above ₹500.</p>
              <p>• Bulk discounts start from 50+ copies of the same document.</p>
              <p>• Rates are subject to change based on market paper costs.</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-accent-blue/10 blur-[100px] -rotate-12 translate-x-1/4" />
      </section>
    </div>
  );
}
