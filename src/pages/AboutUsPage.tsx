import React from 'react';
import { ShieldCheck, Clock, Users, Printer, ShoppingBasket, MapPin, Award } from 'lucide-react';

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="relative bg-ink py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent-blue via-ink to-ink"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest border border-white/10 backdrop-blur-md text-accent-blue">
            <Users size={14} />
            <span>Our Story</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-black text-white font-headline tracking-tighter">
            About M S Star
          </h1>
          <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
            We are on a mission to make professional printing accessible, affordable, and hassle-free for everyone. 
            From students to enterprises, we deliver quality right to your doorstep.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-6 -mt-12 relative z-20 pb-24">
        <div className="bg-white rounded-[3rem] p-8 lg:p-16 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-20">
          
          {/* Our Story Section */}
          <section className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="w-12 h-12 bg-accent-blue/10 text-accent-blue rounded-2xl flex items-center justify-center mb-6">
                <Printer size={24} />
              </div>
              <h2 className="text-3xl lg:text-4xl font-black text-ink tracking-tight">The M S Star Journey</h2>
              <div className="space-y-4 text-slate-600 font-medium leading-relaxed">
                <p>
                  Located in the heart of Gunjur, Bangalore, <strong>M S Star Xerox and Stationery</strong> started with a simple observation: getting documents printed, obtaining PVC smart cards, or buying quality stationery was often a tedious process involving long queues and inconsistent quality.
                </p>
                <p>
                  We built a platform that bridges the gap between digital convenience and physical print quality. 
                  Today, we serve thousands of customers across Bangalore and beyond, providing everything from simple A4 
                  document prints to professional-grade PVC ID cards, passport photos, and essential office supplies.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-accent-blue to-accent-amber opacity-10 rounded-[2.5rem] transform rotate-3"></div>
              <div className="bg-slate-50 rounded-[2.5rem] p-12 flex flex-col items-center justify-center border border-slate-100 shadow-inner relative z-10 aspect-square text-center space-y-6">
                <div className="w-24 h-24 bg-white rounded-full shadow-md flex items-center justify-center text-accent-blue">
                  <MapPin size={40} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-ink">Gunjur, Bangalore</h3>
                  <p className="text-slate-500 font-medium mt-2">Our central hub for quality printing and fast dispatch.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Why Choose Us Section */}
          <section className="space-y-12 pt-12 border-t border-slate-100">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-black text-ink tracking-tight">Why Choose M S Star</h2>
              <p className="text-slate-500 font-medium">We combine state-of-the-art technology with a customer-first approach to deliver the best printing experience.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 hover:border-accent-blue/30 transition-colors space-y-6 group">
                <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center text-accent-blue shadow-sm group-hover:scale-110 transition-transform">
                  <Award size={28} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-black text-ink">Uncompromising Quality</h3>
                  <p className="text-slate-600 font-medium text-sm leading-relaxed">
                    We use industrial-grade Canon and Epson printers with premium paper and PVC stock to ensure every print meets professional standards.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 hover:border-accent-blue/30 transition-colors space-y-6 group">
                <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center text-accent-blue shadow-sm group-hover:scale-110 transition-transform">
                  <Clock size={28} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-black text-ink">Lightning Fast</h3>
                  <p className="text-slate-600 font-medium text-sm leading-relaxed">
                    Time is money. Our automated workflows and dedicated delivery partners ensure your prints arrive exactly when you need them.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 hover:border-accent-blue/30 transition-colors space-y-6 group">
                <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center text-accent-blue shadow-sm group-hover:scale-110 transition-transform">
                  <ShieldCheck size={28} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-black text-ink">Secure & Private</h3>
                  <p className="text-slate-600 font-medium text-sm leading-relaxed">
                    Your documents are safe with us. We employ strict data security measures and automatically purge uploaded files 24 hours after delivery.
                  </p>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
