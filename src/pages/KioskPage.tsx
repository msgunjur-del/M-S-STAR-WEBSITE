import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Monitor, ExternalLink, ShieldCheck, Zap, Cpu, 
  Maximize2, MousePointer2, ArrowLeft, MonitorDown,
  Printer, Contact2, Camera, Search, FileUp, 
  CreditCard, Image as ImageIcon, CheckCircle2,
  Clock, LogOut, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

type KioskView = 'menu' | 'printing' | 'pvc' | 'photos' | 'tracking';

export default function KioskPage() {
  const [view, setView] = useState<KioskView>('menu');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  
  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setDeferredPrompt(null);
    }
  };

  const modules = [
    { id: 'printing', title: 'Document Printing', icon: Printer, color: 'bg-blue-600', desc: 'Standard & Premium Paper' },
    { id: 'pvc', title: 'PVC Cards', icon: CreditCard, color: 'bg-emerald-600', desc: 'Aadhaar, ID, & Smart Cards' },
    { id: 'photos', title: 'Photo Center', icon: Camera, color: 'bg-purple-600', desc: 'Passport & Custom Sizes' },
    { id: 'tracking', title: 'Status Tracker', icon: Search, color: 'bg-amber-600', desc: 'Check Order Progress' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans overflow-hidden flex flex-col">
      {/* Kiosk Header */}
      <header className="h-20 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-900/50 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-accent-blue rounded-xl flex items-center justify-center text-white rotate-12 shadow-lg shadow-blue-500/20">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="font-headline font-black text-xl tracking-tighter leading-none">M S STAR</h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-accent-blue opacity-80">Terminal Kiosk v2.0</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end">
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Connection</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-300">Secure Node ACTIVE</span>
            </div>
          </div>
          <div className="h-8 w-px bg-slate-800 mx-2" />
          <Link to="/" className="p-2 text-slate-400 hover:text-white transition-colors" title="Exit Kiosk">
            <LogOut size={20} />
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow relative flex items-center justify-center p-6 lg:p-12">
        <AnimatePresence mode="wait">
          {view === 'menu' && (
            <motion.div 
              key="menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {modules.map((mod) => (
                <button
                  key={mod.id}
                  onClick={() => setView(mod.id as KioskView)}
                  className="group relative h-72 rounded-[2.5rem] bg-slate-900 border border-slate-800 p-8 flex flex-col justify-between items-start text-left hover:border-accent-blue hover:bg-slate-800/80 transition-all duration-500 shadow-2xl overflow-hidden"
                >
                  <div className={`w-14 h-14 ${mod.color} rounded-2xl flex items-center justify-center text-white shadow-xl shadow-black/50 group-hover:scale-110 transition-transform`}>
                    <mod.icon size={28} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black font-headline tracking-tighter text-white uppercase italic">{mod.title}</h3>
                    <p className="text-slate-500 font-bold text-sm tracking-tight">{mod.desc}</p>
                  </div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight size={20} className="text-accent-blue" />
                  </div>
                  <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-accent-blue/10 transition-all" />
                </button>
              ))}
              
              <div className="md:col-span-2 lg:col-span-4 mt-8 flex flex-col md:flex-row items-center justify-between gap-6 p-8 rounded-3xl bg-slate-900/50 border border-dashed border-slate-800">
                <div className="flex items-center gap-4 text-slate-400">
                  <MonitorDown size={32} />
                  <div>
                    <h4 className="font-black text-white uppercase text-sm tracking-widest">Install as Terminal App</h4>
                    <p className="text-xs font-bold leading-relaxed">Save to homescreen for a permanent fullscreen printing dedicated station.</p>
                  </div>
                </div>
                <button
                  onClick={handleInstallClick}
                  className="w-full md:w-auto px-10 py-4 bg-white text-slate-950 font-black rounded-2xl hover:bg-slate-200 transition-all shadow-xl shadow-white/5"
                >
                  INSTALL KIOSK
                </button>
              </div>
            </motion.div>
          )}

          {view !== 'menu' && (
            <motion.div 
              key="content"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-12">
                <button 
                  onClick={() => setView('menu')}
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
                >
                  <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                  <span className="font-black text-xs uppercase tracking-widest">Return to Menu</span>
                </button>
                <div className="flex items-center gap-2">
                  {modules.find(m => m.id === view)?.icon({ size: 16, className: 'text-accent-blue' })}
                  <span className="text-xs font-black uppercase text-slate-500 tracking-widest">{modules.find(m => m.id === view)?.title}</span>
                </div>
              </div>

              <div className="space-y-12">
                <div className="text-center space-y-4">
                  <h2 className="text-4xl font-headline font-black tracking-tighter uppercase italic">
                    {view === 'printing' && "Document Upload"}
                    {view === 'pvc' && "PVC Card Printing"}
                    {view === 'photos' && "Photo Selection"}
                    {view === 'tracking' && "Order Status"}
                  </h2>
                  <p className="text-slate-400 font-bold">
                    {view === 'printing' && "Upload your PDF or Word documents for high-quality printing."}
                    {view === 'pvc' && "Professional PVC printing for your identity and smart cards."}
                    {view === 'photos' && "Select passport size or custom frame photos."}
                    {view === 'tracking' && "Enter your order ID to see the current fulfillment status."}
                  </p>
                </div>

                {view === 'printing' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button className="p-8 rounded-3xl bg-blue-600/10 border border-blue-500/20 hover:bg-blue-600/20 transition-all text-left space-y-4 group">
                      <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white"><FileUp size={24} /></div>
                      <h4 className="font-black uppercase tracking-tight">Upload Documents</h4>
                      <p className="text-xs text-slate-400 font-bold">Multiple file formats supported (PDF, DOCX, TXT)</p>
                    </button>
                    <button className="p-8 rounded-3xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 transition-all text-left space-y-4 group">
                      <div className="w-12 h-12 bg-slate-700 rounded-2xl flex items-center justify-center text-white"><Monitor size={24} /></div>
                      <h4 className="font-black uppercase tracking-tight">Print from Cloud</h4>
                      <p className="text-xs text-slate-400 font-bold">Drive, Dropbox or Email attachments</p>
                    </button>
                  </div>
                )}

                {view === 'tracking' && (
                  <div className="max-w-md mx-auto space-y-6">
                    <div className="relative">
                      <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input 
                        type="text" 
                        placeholder="ENTER ORDER ID..." 
                        className="w-full bg-slate-800 border-2 border-slate-700 rounded-2xl py-5 pl-12 pr-6 text-white font-black tracking-widest focus:border-accent-blue outline-none transition-all uppercase"
                      />
                    </div>
                    <button className="w-full bg-accent-blue text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/20">
                      CHECK STATUS
                    </button>
                  </div>
                )}

                {/* Simplified Placeholder for other modules */}
                {(view === 'pvc' || view === 'photos') && (
                  <div className="bg-slate-800/40 p-12 rounded-3xl border border-dashed border-slate-700 flex flex-col items-center justify-center space-y-6 text-center">
                    <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center text-slate-400">
                      <Zap size={40} className="animate-pulse" />
                    </div>
                    <div className="space-y-2">
                       <h3 className="font-black uppercase tracking-widest text-lg">Initializing Module...</h3>
                       <p className="text-sm font-bold text-slate-500">Connecting to secure fulfillment engine.</p>
                    </div>
                    <button onClick={() => setView('menu')} className="bg-white/5 text-slate-400 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-white/10">Abort Connection</button>
                  </div>
                )}
              </div>

              {/* Decorative Glow */}
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-accent-blue/10 rounded-full blur-3xl -z-10" />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Kiosk Footer (Minimal) */}
      <footer className="h-16 border-t border-slate-800 flex items-center justify-between px-8 bg-slate-900/50 text-[10px] uppercase font-black tracking-widest text-slate-500">
        <div className="flex items-center gap-6">
          <span>© 2026 M S STAR XEROX</span>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-blue" />
            <span>ENCRYPTED_LINK_ESTABLISHED</span>
          </div>
        </div>
        <div className="flex gap-4">
          <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
          <span className="hover:text-white cursor-pointer transition-colors">Terms</span>
          <span className="hover:text-white cursor-pointer transition-colors">Support</span>
        </div>
      </footer>
    </div>
  );
}
