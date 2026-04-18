import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Monitor, ExternalLink, ShieldCheck, Zap, Cpu, Maximize2, MousePointer2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function KioskPage() {
  const kioskUrl = "https://ais-dev-jcusho2nkmrm6xb3mltosk-591801513327.asia-east1.run.app";

  return (
    <div className="min-h-screen space-y-24 pb-24 dark:bg-slate-950">
      {/* Editorial Hero Section */}
      <section className="relative pt-12 lg:pt-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8 relative z-10"
          >
            <div className="inline-flex items-center gap-2 bg-accent-blue/10 text-accent-blue px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-accent-blue/20">
              <Cpu size={12} />
              <span>Smart Ecosystem</span>
            </div>
            
            <h1 className="text-6xl lg:text-8xl font-black font-headline leading-[0.85] tracking-tighter text-ink dark:text-white uppercase italic">
              SMART <br />
              <span className="text-accent-blue">KIOSK</span><br />
              <span className="text-3xl lg:text-5xl tracking-normal not-italic opacity-50">MODE</span>
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md font-medium leading-relaxed">
              Transform your browsing experience into a professional self-service terminal. Ideal for high-volume document uploads and instant processing.
            </p>

            <div className="flex flex-wrap gap-4">
              <a 
                href={kioskUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-accent-blue text-white px-8 py-4 rounded-2xl font-black text-lg hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/20 flex items-center gap-3 group"
              >
                Launch Terminal
                <ExternalLink size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
              <Link
                to="/"
                className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-ink dark:text-white px-8 py-4 rounded-2xl font-black text-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-3"
              >
                Back to Store
                <ArrowRight size={20} />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-600">
                  <ShieldCheck size={20} />
                </div>
                <span className="text-xs font-black uppercase tracking-tighter text-slate-500">Secure Sync</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600">
                  <Zap size={20} />
                </div>
                <span className="text-xs font-black uppercase tracking-tighter text-slate-500">Instant Load</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1 }}
            className="hidden lg:block relative"
          >
             <div className="relative z-10 bg-white dark:bg-slate-900 p-4 rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.15)] border border-slate-200 dark:border-slate-800 aspect-square flex items-center justify-center">
                <div className="w-full h-full rounded-[3.5rem] bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center space-y-6 relative overflow-hidden group">
                  <Monitor size={120} className="text-accent-blue animate-pulse" />
                  <div className="text-center">
                    <p className="text-2xl font-black text-ink dark:text-white tracking-tighter uppercase">Terminal Ready</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Connection</p>
                  </div>
                  <div className="absolute inset-0 bg-accent-blue/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
             </div>
             {/* Decorative Background Accents */}
             <div className="absolute -top-10 -right-10 w-64 h-64 bg-accent-blue/20 rounded-full blur-[100px] -z-10" />
             <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-accent-amber/10 rounded-full blur-[80px] -z-10" />
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-card dark:bg-slate-900/50 py-24 px-6 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-black font-headline tracking-tighter text-ink dark:text-white uppercase italic">Advanced Ecosystem <span className="text-accent-blue not-italic">Benefits</span></h2>
            <p className="text-slate-500 font-bold max-w-2xl mx-auto">Our Kiosk mode provides a specialized interface for production-grade printing tasks.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "One Logic", desc: "Shared database means your orders here go straight to our main fulfillment system." },
              { title: "Touch Ready", desc: "Interface is optimized for tablet and touchscreen usage in public kiosks." },
              { title: "Privacy Mode", desc: "Secure sessions ensure your document data is cleared after every transaction." }
            ].map((benefit, i) => (
              <div key={i} className="p-8 rounded-[2.5rem] bg-paper dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm hover:translate-y-[-4px] transition-transform">
                <div className="w-12 h-12 bg-accent-blue/10 rounded-2xl flex items-center justify-center text-accent-blue">
                   <ShieldCheck size={24} />
                </div>
                <h3 className="text-xl font-black text-ink dark:text-white uppercase tracking-tight italic">{benefit.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 font-bold leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="bg-accent-blue rounded-[3rem] p-12 text-center space-y-8 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-4xl lg:text-5xl font-black text-white leading-[0.9] tracking-tighter uppercase italic">
              Ready to <span className="text-white/60 not-italic">switch?</span>
            </h2>
            <p className="text-blue-100 font-bold text-lg">
              Return to our homepage for full product catalog and detailed printing services.
            </p>
            <Link to="/" className="inline-flex items-center gap-3 bg-white text-accent-blue px-10 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-transform shadow-2xl">
              Back to Main Site <ArrowRight />
            </Link>
          </div>
          <div className="absolute top-0 left-0 w-full h-full bg-white/10 -rotate-12 translate-y-1/2 scale-150 blur-3xl opacity-50" />
        </div>
      </section>
    </div>
  );
}
