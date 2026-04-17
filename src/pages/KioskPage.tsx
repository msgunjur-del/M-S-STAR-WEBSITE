import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Monitor, ArrowUpRight, ShieldCheck, Zap, Cpu, MousePointer2, Maximize2, ExternalLink } from 'lucide-react';

export default function KioskPage() {
  const kioskUrl = "https://msstar.in/kiosk";
  const [isEmbedded, setIsEmbedded] = useState(true);

  return (
    <div className="min-h-screen space-y-24 pb-24">
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
              <Cpu size={12} />
              <span>Smart Ecosystem</span>
            </div>
            <h1 className="text-6xl lg:text-7xl font-black font-headline leading-[0.9] tracking-tighter text-ink uppercase">
              M S STAR <br />
              <span className="text-accent-blue text-4xl lg:text-5xl">SMART PRINT KIOSK</span>
            </h1>
            <p className="text-xl text-slate-700 max-w-lg leading-relaxed font-bold">
              Experience the future of self-service printing. Use our specialized Smart Print Kiosk for instant, touch-optimized document handling.
            </p>

            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => {
                   document.getElementById('kiosk-frame')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-accent-blue text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 flex items-center gap-3 group hover:-translate-y-1"
              >
                Use Terminal Here
                <Monitor className="group-hover:translate-y-1 transition-transform" />
              </button>
              <a 
                href={kioskUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white border-2 border-slate-200 text-ink px-10 py-5 rounded-2xl font-black text-lg hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-3 group hover:-translate-y-1"
              >
                Open in Fullscreen
                <ExternalLink className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-8">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-600 shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="font-black text-sm text-ink uppercase tracking-tight">Self-Service</p>
                  <p className="text-xs font-bold text-slate-500">Fast & Privately controlled</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600 shrink-0">
                  <Zap size={20} />
                </div>
                <div>
                  <p className="font-black text-sm text-ink uppercase tracking-tight">Instant Sync</p>
                  <p className="text-xs font-bold text-slate-500">Direct studio integration</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Graphic Element */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative hidden lg:block"
          >
            <div className="relative z-10 bg-card p-4 rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.1)] border border-slate-300 overflow-hidden aspect-video group">
              <div className="absolute inset-0 bg-accent-blue/5 overflow-hidden flex items-center justify-center transition-colors group-hover:bg-accent-blue/10">
                <Monitor size={120} className="text-accent-blue/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/50 text-center space-y-4 max-w-sm">
                      <div className="w-16 h-16 bg-accent-blue rounded-2xl flex items-center justify-center text-white mx-auto shadow-xl">
                        <Monitor size={32} />
                      </div>
                      <h3 className="text-2xl font-black text-ink tracking-tight uppercase">SMART KIOSK</h3>
                      <p className="text-sm font-bold text-slate-600">Integrated directly into your workflow.</p>
                      <button 
                        onClick={() => {
                          document.getElementById('kiosk-frame')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="inline-block bg-accent-blue text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform"
                      >
                        Scroll to Terminal
                      </button>
                   </div>
                </div>
              </div>
              
              <div className="absolute top-4 right-4 flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent-blue/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-accent-blue/10 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </section>

      {/* Embedded Terminal Section */}
      <section id="kiosk-frame" className="px-6 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="bg-ink p-4 rounded-t-[2rem] flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="flex gap-2 pl-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="bg-white/10 text-white/50 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full backdrop-blur-md font-mono">
                msstar.in/kiosk
              </div>
            </div>
            <a 
              href={kioskUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-accent-blue transition-colors flex items-center gap-2 text-xs font-black uppercase tracking-widest pr-2"
            >
              Open Fullscreen <Maximize2 size={14} />
            </a>
          </div>
          <div className="bg-[#f0f0f0] rounded-b-[2.5rem] shadow-2xl overflow-hidden h-[700px] border border-slate-300 relative w-full">
            {isEmbedded ? (
              <iframe 
                src={kioskUrl} 
                className="w-full h-full border-0 absolute inset-0"
                title="M S STAR Smart Print Kiosk"
                allow="camera; microphone; fullscreen"
              />
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center text-slate-500 space-y-4">
                    <Monitor size={64} className="text-slate-300 mb-4" />
                    <h3 className="text-2xl font-black text-ink font-headline">Kiosk Integration Disabled</h3>
                    <p className="font-medium max-w-lg">Click the button below to reactivate the terminal integration.</p>
                    <button onClick={() => setIsEmbedded(true)} className="bg-accent-blue text-white px-8 py-3 rounded-xl font-bold mt-4 shadow-lg shadow-blue-200">
                        Activate Terminal
                    </button>
                </div>
            )}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-card py-24 px-6 border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-black font-headline tracking-tighter text-ink uppercase">Why use the Smart Kiosk?</h2>
            <p className="text-slate-500 font-bold max-w-2xl mx-auto">Our Kiosk app provides a streamlined interface for heavy-duty printing tasks and public terminal usage.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Simplified UI", desc: "Large buttons and touch-friendly controls for easy navigation on public tablets or monitors." },
              { title: "Privacy First", desc: "Built-in session management ensures your private documents aren't left behind on public terminals." },
              { title: "Batch Processing", desc: "Quickly upload and queue dozens of documents for simultaneous printing." }
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-3xl bg-paper border border-slate-200 space-y-4 shadow-sm">
                <div className="w-12 h-12 bg-accent-blue/10 rounded-2xl flex items-center justify-center text-accent-blue">
                  < ShieldCheck size={24} />
                </div>
                <h3 className="text-xl font-black text-ink uppercase tracking-tight">{item.title}</h3>
                <p className="text-slate-600 font-bold leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
