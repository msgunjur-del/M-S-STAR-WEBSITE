import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-24">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="relative">
          <div className="text-[12rem] font-black text-slate-100 leading-none select-none">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-accent-blue text-white rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-200 rotate-12">
              <ShieldAlert size={48} />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-3xl font-black text-ink font-headline tracking-tight">Page Not Found</h1>
          <p className="text-slate-500 font-medium leading-relaxed">
            Oops! The page you are looking for doesn't exist or has been moved. 
            Let's get you back on track.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link 
            to="/" 
            className="w-full sm:w-auto bg-slate-900 text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
          >
            <Home size={18} />
            Back to Home
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="w-full sm:w-auto bg-white text-ink border-2 border-slate-100 px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:border-accent-blue hover:text-accent-blue transition-all"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
