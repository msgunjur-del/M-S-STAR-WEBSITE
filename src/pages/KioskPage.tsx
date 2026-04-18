import React from 'react';
import { motion } from 'motion/react';
import { Monitor, ExternalLink, ShieldCheck, Zap, Cpu, ArrowRight, LogOut, Terminal, Maximize2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function KioskPage() {
  const kioskUrl = "https://ais-dev-jcusho2nkmrm6xb3mltosk-591801513327.asia-east1.run.app";

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.1),transparent_70%)] pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent-amber/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Launcher Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl w-full bg-slate-900/50 backdrop-blur-2xl border border-slate-800 rounded-[3rem] p-10 lg:p-14 shadow-2xl relative z-10 text-center space-y-10"
      >
        <div className="flex flex-col items-center gap-6">
          <div className="w-20 h-20 bg-accent-blue rounded-[1.8rem] flex items-center justify-center text-white rotate-12 shadow-2xl shadow-blue-500/20">
            <ShieldCheck size={40} />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-headline font-black tracking-tighter uppercase italic leading-none">
              Smart Kiosk <span className="text-accent-blue not-italic">Terminal</span>
            </h1>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Secure Production Node</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-800 pb-3">
              <span>Status: READY</span>
              <span className="text-emerald-500 flex items-center gap-1.5 animate-pulse">
                <Zap size={10} /> Live Connection
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm font-mono text-slate-300">
              <Terminal size={14} className="text-accent-blue" />
              <span>msstar.in/kiosk_portal</span>
            </div>
          </div>

          <p className="text-slate-400 font-bold text-sm leading-relaxed px-4">
            Access the high-volume printing terminal for documents, PVC cards, and smart orders. Optimized for desktop and tablet kiosk stations.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <a 
            href={kioskUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-accent-blue text-white py-6 rounded-2xl font-black text-xl hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3"
          >
            Launch Fullscreen Terminal
            <Maximize2 size={24} className="group-hover:scale-110 transition-transform" />
          </a>
          
          <div className="grid grid-cols-2 gap-3">
            <Link 
              to="/" 
              className="bg-slate-800/50 hover:bg-slate-800 text-slate-300 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all border border-slate-700 flex items-center justify-center gap-2"
            >
              <LogOut size={14} /> Exit Kiosk
            </Link>
            <button 
              onClick={() => window.location.reload()}
              className="bg-slate-800/50 hover:bg-slate-800 text-slate-300 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all border border-slate-700 flex items-center justify-center gap-2"
            >
              <Monitor size={14} /> Reset Terminal
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex items-center justify-center gap-8 text-[9px] font-black uppercase tracking-widest text-slate-600">
          <span className="flex items-center gap-1.5"><ShieldCheck size={10} /> Encrypted SS-256</span>
          <span className="flex items-center gap-1.5"><Cpu size={10} /> node_v2_gunjur</span>
        </div>
      </motion.div>

      {/* Footer Branding */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 opacity-30 select-none pointer-events-none">
        <ShieldCheck size={16} />
        <span className="text-xs font-black uppercase tracking-[0.5em]">M S STAR XEROX</span>
      </div>
    </div>
  );
}
