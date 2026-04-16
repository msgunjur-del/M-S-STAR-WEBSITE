import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { db } from '../firebase';
import { ShoppingBasket, Clock, ArrowRight, ShieldCheck, Zap, Truck, Lock, Search, X, Upload, CheckCircle2 } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { AnimatePresence } from 'motion/react';

const INITIAL_SERVICES = [
  { id: 'pvc-1', title: 'PVC Aadhaar Card Printing', description: 'Waterproof and durable PVC printing for your e-Aadhaar.', price: 50, category: 'PVC CARDS', imageUrl: 'https://images.unsplash.com/photo-1633265486064-086b219458ce?w=800&q=80' },
  { id: 'pvc-2', title: 'PVC PAN Card Printing', description: 'Official standard PVC printing for your permanent account number card.', price: 50, category: 'PVC CARDS', imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80' },
  { id: 'pvc-3', title: 'PVC Voter ID Printing', description: 'Get your digital voter ID converted to a long-lasting PVC card.', price: 50, category: 'PVC CARDS', imageUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&q=80' },
  { id: 'pvc-4', title: 'PVC Health Card Printing', description: 'Durable Ayushman Bharat or State Health IDs on smart cards.', price: 60, category: 'PVC CARDS', imageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80' },
  { id: 'pvc-5', title: 'PVC Smart ID Card', description: 'Custom institutional or corporate employee IDs with HD print.', price: 75, category: 'PVC CARDS', imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&q=80' },
  { id: 'photo-1', title: 'Passport Size Photo (Set of 8)', description: 'Premium quality studio finish passport photos for all official uses.', price: 40, category: 'PHOTOS', imageUrl: '/images/sample-girl.png' },
  { id: 'photo-2', title: '4x6 Photo Print', description: 'High-gloss 4x6 inch photographic memories for your albums.', price: 15, category: 'PHOTOS', imageUrl: '/images/sample-boy.png' },
  { id: 'photo-3', title: 'Stamp Size Photo (Set of 16)', description: 'Set of 16 precision-cut stamp size photos for admission forms.', price: 30, category: 'PHOTOS', imageUrl: '/images/sample-6-4.png' },
];

export default function HomePage() {
  const [services, setServices] = useState<any[]>(INITIAL_SERVICES);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const filtered = services.filter(service => 
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, services]);
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
        if (isMounted && querySnapshot?.docs?.length > 0) {
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

            {/* Search Bar */}
            <div ref={searchRef} className="relative max-w-lg z-30">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  setShowSuggestions(false);
                  document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="relative group"
              >
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-accent-blue transition-colors">
                  <Search size={20} />
                </div>
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.trim() && setShowSuggestions(true)}
                  placeholder="Search for PVC cards, photos..."
                  className="w-full pl-14 pr-12 py-5 bg-white border border-slate-200 rounded-[2rem] font-bold text-ink outline-none focus:ring-4 focus:ring-accent-blue/10 focus:border-accent-blue transition-all shadow-xl shadow-slate-200/50"
                />
                {searchQuery && (
                  <button 
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-5 flex items-center text-slate-400 hover:text-ink transition-colors"
                  >
                    <X size={18} />
                  </button>
                )}
              </form>

              <AnimatePresence>
                {showSuggestions && searchQuery.trim().length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-3 bg-white rounded-[2rem] border border-slate-100 shadow-2xl overflow-hidden z-50"
                  >
                    <div className="p-2">
                      {suggestions.length > 0 ? (
                        suggestions.map((item) => (
                          <Link
                            key={item.id}
                            to={`/product/${item.id}`}
                            className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors group"
                          >
                            <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-black text-ink truncate group-hover:text-accent-blue transition-colors">{item.title}</p>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.category}</p>
                            </div>
                            <ArrowRight size={16} className="text-slate-300 group-hover:text-accent-blue group-hover:translate-x-1 transition-all" />
                          </Link>
                        ))
                      ) : (
                        <div className="p-8 text-center space-y-2">
                          <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-300">
                            <Search size={24} />
                          </div>
                          <p className="font-black text-ink">No results found</p>
                          <p className="text-xs font-bold text-slate-400">Try searching for "PVC" or "Photos"</p>
                        </div>
                      )}
                    </div>
                    {suggestions.length > 0 && (
                      <div className="bg-slate-50 p-4 border-t border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                          Press enter to see all results
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

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
      <section id="services-section" className="max-w-7xl mx-auto px-6 space-y-12">
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
          {services
            .filter(service => 
              service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              service.category.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .length > 0 ? (
            services
              .filter(service => 
                service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                service.category.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .slice(0, 8)
              .map((service, idx) => (
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
            ))
          ) : (
            <div className="col-span-full py-20 text-center space-y-4">
              <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto text-slate-200">
                <Search size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-ink">No products found</h3>
                <p className="text-slate-400 font-medium">We couldn't find any products matching "{searchQuery}"</p>
              </div>
              <button 
                onClick={() => setSearchQuery('')}
                className="text-accent-blue font-black uppercase tracking-widest text-xs hover:underline"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Sample Work Gallery */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl lg:text-5xl font-black font-headline tracking-tighter text-ink">
            SAMPLE <span className="text-accent-blue">WORK.</span>
          </h2>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto">
            Take a look at the quality we deliver. From high-definition PVC cards to professional document finishing.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'PVC Smart Cards', img: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&q=80' },
            { title: 'Spiral Binding', img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80' },
            { title: 'Passport Photos', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
            { title: 'Color Prints', img: 'https://images.unsplash.com/photo-1586075010633-24426d5628fa?w=400&q=80' }
          ].map((sample, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative aspect-square rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm"
            >
              <img 
                src={sample.img} 
                alt={sample.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <p className="text-white font-black text-sm uppercase tracking-widest">{sample.title}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-slate-50 py-32 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/30 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-100/20 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center space-y-4 mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest text-accent-blue border border-blue-100"
            >
              <Clock size={12} />
              <span>Simple 4-Step Process</span>
            </motion.div>
            <h2 className="text-4xl lg:text-6xl font-black font-headline tracking-tighter text-ink">
              HOW IT <span className="text-accent-blue">WORKS.</span>
            </h2>
            <p className="text-slate-500 font-medium max-w-2xl mx-auto text-lg">
              Getting your documents printed has never been easier. Follow our streamlined process to get high-quality prints delivered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden lg:block absolute top-[40px] left-[10%] right-[10%] h-0.5 bg-slate-200 z-0">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="h-full bg-accent-blue"
              />
            </div>
            
            {[
              { 
                step: '01', 
                title: 'Select Service', 
                desc: 'Choose from PVC cards, photos, or document printing services.', 
                icon: <ShoppingBasket className="w-8 h-8" />,
                color: 'bg-blue-500'
              },
              { 
                step: '02', 
                title: 'Upload Files', 
                desc: 'Securely upload your documents or photos and provide details.', 
                icon: <Upload className="w-8 h-8" />,
                color: 'bg-indigo-500'
              },
              { 
                step: '03', 
                title: 'Secure Payment', 
                desc: 'Complete your order with our 100% secure payment gateway.', 
                icon: <Lock className="w-8 h-8" />,
                color: 'bg-violet-500'
              },
              { 
                step: '04', 
                title: 'Fast Delivery', 
                desc: 'Receive your high-quality prints at your doorstep in 24-48 hours.', 
                icon: <Truck className="w-8 h-8" />,
                color: 'bg-accent-blue'
              }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="relative z-10 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 space-y-6 text-center group hover:translate-y-[-8px] transition-all duration-500"
              >
                <div className={`w-20 h-20 ${item.color} text-white rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-blue-200 group-hover:rotate-6 transition-transform duration-500`}>
                  {item.icon}
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-6 h-px bg-slate-200" />
                    <p className="text-accent-blue font-black text-[10px] uppercase tracking-[0.3em]">{item.step}</p>
                    <span className="w-6 h-px bg-slate-200" />
                  </div>
                  <h3 className="text-2xl font-black text-ink tracking-tight">{item.title}</h3>
                  <p className="text-slate-500 font-bold text-sm leading-relaxed">{item.desc}</p>
                </div>
                
                {/* Step Number Badge */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center text-slate-300 font-black text-xl group-hover:bg-accent-blue group-hover:text-white group-hover:border-accent-blue transition-colors duration-500">
                  {idx + 1}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1 }}
            className="mt-20 text-center"
          >
            <Link to="/document-printing" className="inline-flex items-center gap-3 bg-white text-ink px-8 py-4 rounded-2xl font-black hover:bg-slate-50 transition-all border border-slate-200 shadow-sm group">
              Get Started Now
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform text-accent-blue" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl lg:text-5xl font-black font-headline tracking-tighter text-ink">
            CUSTOMER <span className="text-accent-blue">REVIEWS.</span>
          </h2>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our customers in Bangalore have to say.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: 'Rahul Sharma', role: 'Software Engineer', text: 'The PVC Aadhaar card quality is exceptional. It looks like an official smart card. Highly recommended for anyone in Gunjur!', rating: 5 },
            { name: 'Priya Patel', role: 'Student', text: 'Fastest printing service I have used. Uploaded my project at night and got it delivered by next afternoon. Great quality spiral binding.', rating: 5 },
            { name: 'Anish Kumar', role: 'Business Owner', text: 'Consistent quality and very professional. Their bulk printing rates are the best in the area. Very happy with the service.', rating: 5 }
          ].map((review, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
              <div className="flex gap-1 text-accent-amber">
                {[...Array(review.rating)].map((_, i) => <Zap key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="text-slate-600 font-medium italic leading-relaxed">"{review.text}"</p>
              <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${idx + 20}`} alt={review.name} />
                </div>
                <div>
                  <p className="font-black text-ink">{review.name}</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{review.role}</p>
                </div>
              </div>
            </div>
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
                Upload your files now and experience the M S STAR XEROX difference. Same-day delivery available for all orders placed before noon.
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
