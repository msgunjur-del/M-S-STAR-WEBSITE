import React from 'react';
import { ShieldCheck, Trash2, DatabaseZap } from 'lucide-react';

export default function SecurityBadgeSection() {
  return (
    <section className="max-w-7xl mx-auto px-8 my-16">
      <div className="bg-slate-50 p-10 md:p-16 rounded-[2.5rem] border border-dashed border-slate-300 text-center space-y-8">
        <div className="space-y-2">
          <h3 className="text-2xl md:text-3xl font-bold text-blue-600 font-headline">Your Privacy is Our Priority</h3>
          <p className="text-slate-600 max-w-2xl mx-auto">We handle your documents with industrial-grade security protocols.</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-12 pt-4">
          <div className="flex items-start text-left gap-5 max-w-xs group">
            <div className="bg-green-500 text-white w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-green-100 group-hover:scale-110 transition-transform">
              <Trash2 size={24} />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-lg">Instant Auto-Deletion</h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                All uploaded files are automatically wiped from our server memory immediately after the printing process is complete.
              </p>
            </div>
          </div>

          <div className="flex items-start text-left gap-5 max-w-xs group">
            <div className="bg-green-500 text-white w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-green-100 group-hover:scale-110 transition-transform">
              <DatabaseZap size={24} />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-lg">Zero Permanent Storage</h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                We do not store, view, or share your personal documents. Your data exists only for the duration of the print job.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
