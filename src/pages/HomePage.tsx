import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { db } from '../firebase';
import { ShoppingBasket, Clock, ArrowRight, ShieldCheck, Zap, Truck, Lock } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';

const INITIAL_SERVICES = [
  { id: 'pvc-1', title: 'PVC Aadhaar Card Printing', description: 'Waterproof and durable PVC printing for your e-Aadhaar.', price: 50, category: 'PVC CARDS', imageUrl: 'https://images.unsplash.com/photo-1633265486064-086b219458ce?w=800&q=80' },
  { id: 'pvc-2', title: 'PVC PAN Card Printing', description: 'Official standard PVC printing for your permanent account number card.', price: 50, category: 'PVC CARDS', imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80' },
  { id: 'pvc-3', title: 'PVC Voter ID Printing', description: 'Get your digital voter ID converted to a long-lasting PVC card.', price: 50, category: 'PVC CARDS', imageUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&q=80' },
  { id: 'pvc-4', title: 'PVC Health Card Printing', description: 'Durable Ayushman Bharat or State Health IDs on smart cards.', price: 60, category: 'PVC CARDS', imageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80' },
  { id: 'pvc-5', title: 'PVC Smart ID Card', description: 'Custom institutional or corporate employee IDs with HD print.', price: 75, category: 'PVC CARDS', imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&q=80' },
  { id: 'photo-1', title: 'Passport Size Photo (Set of 8)', description: 'Premium quality studio finish passport photos for all official uses.', price: 40, category: 'PHOTOS', imageUrl: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80' },
  { id: 'photo-2', title: '4x6 Photo Print', description: 'High-gloss 4x6 inch photographic memories for your albums.', price: 15, category: 'PHOTOS', imageUrl: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80' },
  { id: 'photo-3', title: 'Stamp Size Photo (Set of 16)', description: 'Set of 16 precision-cut stamp size photos for admission forms.', price: 30, category: 'PHOTOS', imageUrl: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6?w=800&q=80' },
];

export default function HomePage() {
  const [services, setServices] = useState<any[]>(INITIAL_SERVICES);

  useEffect(() => {
    let isMounted = true;
    const fetchServices = async () => {
      try {
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 3000)
        );
        const querySnapshot = await Promise.race([
          getDocs(collection(db, 'products')), 
          timeoutPromise
        ]) as any;
        if (isMounted && !querySnapshot.empty) {
          setServices(querySnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })));
        }
      } catch (error) {
        console.warn("Using fallback products.");
      }
    };
    fetchServices();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative px-6 pt-12 lg:pt-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 bg-accent-blue/5 text-accent-blue px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest border border-accent-blue/10">
              <Zap size={12} />
              <span>Next-Gen Printing Hub</span>
            </div>
            <h1 className="text-6xl lg:text-7xl font-black font-headline leading-[0.9] tracking-tighter text-ink">
              PRINTING <br />
              <span className="text-accent-blue">REIMAGINED.</span>
            </h1>
            <p className="text-xl text-slate-500 max-w-lg leading-relaxed font-medium">
              Precision-crafted PVC Smart Cards, studio-grade photography, and document services delivered with lightning speed.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/document-printing" className="bg-accent-blue text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 flex items-center gap-3 group">
                Start Printing
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/rate-calculator" className="bg-white text-ink px-10 py-5 rounded-2xl font-black text-lg border border-slate-200 hover:bg-slate-50 transition-all">
                Price List
              </Link>
            </div>
            
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                  </div>
                ))}
              </div>
              <p className="text-sm font-bold text-slate-400">
                <span className="text-ink">5,000+</span> Happy Customers
              </p>
              
              {/* Hidden Admin Link */}
              <Link to="/admin" className="ml-auto flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors opacity-50 hover:opacity-100" title="Admin Login">
                <Lock size={14} />
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="relative z-10 bg-white p-4 rounded-[3rem] shadow-[0_50px_100px_rgba(15,23,42,0.1)] rotate-2 border border-slate-100">
              <div className="aspect-[4/3] bg-slate-100 rounded-[2.5rem] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&q=80&w=1000" 
                  alt="Premium Printing" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            {/* Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent-amber/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-accent-blue/10 rounded-full blur-3xl" />
            
            <div className="absolute -bottom-6 -right-6 z-20 glass p-6 rounded-3xl shadow-xl flex items-center gap-4 animate-bounce-slow">
              <div className="bg-accent-amber text-white p-3 rounded-2xl">
                <Clock size={24} />
              </div>
              <div>
                <p className="font-black text-ink leading-none">24H Delivery</p>
                <p className="text-xs font-bold text-slate-400">Bangalore Wide</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-slate-100">
          <div className="flex items-center gap-3 text-slate-400">
            <ShieldCheck size={20} />
            <span className="font-bold text-sm uppercase tracking-widest">Secure Payments</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <Truck size={20} />
            <span className="font-bold text-sm uppercase tracking-widest">Express Shipping</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <Zap size={20} />
            <span className="font-bold text-sm uppercase tracking-widest">Instant Quotes</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <Clock size={20} />
            <span className="font-bold text-sm uppercase tracking-widest">24/7 Support</span>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <h2 className="text-4xl lg:text-5xl font-black font-headline tracking-tighter text-ink">
              OUR <span className="text-accent-blue">SERVICES.</span>
            </h2>
            <p className="text-slate-500 font-medium max-w-md">
              Explore our range of professional printing solutions tailored for your specific needs.
            </p>
          </div>
          <Link to="/document-printing" className="inline-flex items-center gap-2 font-black text-accent-blue group">
            View All Services
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.slice(0, 8).map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link 
                to={`/product/${service.id}`} 
                className="group block bg-white p-4 rounded-[2.5rem] border border-slate-100 card-hover"
              >
                <div className="aspect-square bg-slate-50 rounded-[2rem] mb-6 overflow-hidden relative">
                  <img 
                    src={service.imageUrl || `https://images.unsplash.com/photo-1633265486064-086b219458ce?w=400&q=80`} 
                    alt={service.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    referrerPolicy="no-referrer" 
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl font-black text-xs text-ink shadow-sm">
                    ₹{service.price}
                  </div>
                </div>
                <div className="px-2 pb-2 space-y-3">
                  <h3 className="font-black text-lg text-ink leading-tight group-hover:text-accent-blue transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-slate-400 font-medium line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                      {service.category}
                    </span>
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-accent-blue group-hover:text-white transition-all">
                      <ShoppingBasket size={18} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="bg-ink rounded-[3rem] p-12 lg:p-20 relative overflow-hidden">
          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="text-5xl lg:text-6xl font-black font-headline text-white leading-[0.9] tracking-tighter">
                READY TO <br />
                <span className="text-accent-amber">START?</span>
              </h2>
              <p className="text-slate-400 text-lg font-medium max-w-md">
                Upload your files now and experience the MS STAR difference. Same-day delivery available for all orders placed before noon.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/document-printing" className="bg-accent-amber text-ink px-10 py-5 rounded-2xl font-black text-lg hover:bg-amber-500 transition-all shadow-xl shadow-amber-900/20">
                  Upload Now
                </Link>
                <Link to="/contact-us" className="bg-white/10 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-white/20 transition-all border border-white/10 backdrop-blur-md">
                  Contact Support
                </Link>
              </div>
            </div>
            <div className="hidden lg:block relative">
              <div className="bg-white/5 backdrop-blur-3xl p-8 rounded-[3rem] border border-white/10 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent-blue rounded-2xl flex items-center justify-center text-white">
                    <Zap size={24} />
                  </div>
                  <div>
                    <p className="font-black text-white">Instant Processing</p>
                    <p className="text-xs text-slate-500 font-bold">No waiting time</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent-amber rounded-2xl flex items-center justify-center text-ink">
                    <Truck size={24} />
                  </div>
                  <div>
                    <p className="font-black text-white">Doorstep Delivery</p>
                    <p className="text-xs text-slate-500 font-bold">Across Bangalore</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-accent-blue/10 blur-[120px] -rotate-12 translate-x-1/4" />
        </div>
      </section>
    </div>
  );
}
