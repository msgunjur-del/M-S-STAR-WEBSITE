import React from 'react';
import { MapPin, Phone, Mail, MessageCircle, Send, ShoppingBasket, Clock } from 'lucide-react';

export default function ContactUsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="relative bg-ink py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent-blue via-ink to-ink"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest border border-white/10 backdrop-blur-md text-accent-blue">
            <MessageCircle size={14} />
            <span>Support & Enquiries</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-black text-white font-headline tracking-tighter">
            Let's Connect
          </h1>
          <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
            Whether you're looking for high-end printing solutions, PVC Smart Cards, or have a custom design request, 
            our atelier in Gunjur is ready to bring your vision to life.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-6 -mt-12 relative z-20 pb-24">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-start">
          
          {/* Contact Info Card */}
          <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-12">
            <div className="flex gap-6 group">
              <div className="bg-accent-blue/10 w-16 h-16 rounded-2xl flex items-center justify-center text-accent-blue shrink-0 group-hover:scale-110 transition-transform">
                <MapPin size={28} />
              </div>
              <div className="space-y-2">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Physical Atelier</h3>
                <p className="text-lg font-black text-ink leading-tight">
                  M S STAR XEROX<br />
                  no 247 gunjur bangalore 560087
                </p>
                <div className="inline-block bg-green-500/10 text-green-600 px-3 py-1.5 rounded-full text-xs font-bold mt-2">
                  Open: Mon - Sat (8:30 AM - 9:00 PM)
                </div>
              </div>
            </div>

            <div className="flex gap-6 group">
              <div className="bg-accent-blue/10 w-16 h-16 rounded-2xl flex items-center justify-center text-accent-blue shrink-0 group-hover:scale-110 transition-transform">
                <Phone size={28} />
              </div>
              <div className="space-y-2">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Call Us</h3>
                <div className="space-y-1">
                  <p className="text-lg font-black text-ink">+91 9901526231</p>
                  <p className="text-lg font-black text-ink">+91 9148868257</p>
                </div>
              </div>
            </div>

            <div className="flex gap-6 group">
              <div className="bg-accent-blue/10 w-16 h-16 rounded-2xl flex items-center justify-center text-accent-blue shrink-0 group-hover:scale-110 transition-transform">
                <Mail size={28} />
              </div>
              <div className="space-y-2">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Us</h3>
                <a href="mailto:msgunjur@gmail.com" className="text-lg font-black text-ink hover:text-accent-blue transition-colors">
                  msgunjur@gmail.com
                </a>
              </div>
            </div>

            <div className="flex gap-6 group">
              <div className="bg-[#25D366]/10 w-16 h-16 rounded-2xl flex items-center justify-center text-[#25D366] shrink-0 group-hover:scale-110 transition-transform">
                <MessageCircle size={28} />
              </div>
              <div className="space-y-2">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">WhatsApp Support</h3>
                <p className="text-slate-500 font-medium text-sm">Instant support for file uploads & price quotes.</p>
                <a 
                  href="https://wa.me/919901526231" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#25D366] font-black hover:gap-3 transition-all mt-1"
                >
                  Chat with us now <span className="text-xl">→</span>
                </a>
              </div>
            </div>
          </div>

          {/* Message Form Card */}
          <div className="bg-white rounded-[3rem] p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
            <h2 className="text-2xl font-black text-ink mb-8">Send a Message</h2>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                <input 
                  type="text" 
                  placeholder="Gireesh J R" 
                  className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-accent-blue focus:ring-4 focus:ring-accent-blue/10 transition-all font-medium text-ink placeholder:text-slate-400"
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">WhatsApp Number</label>
                <input 
                  type="tel" 
                  placeholder="+91..." 
                  className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-accent-blue focus:ring-4 focus:ring-accent-blue/10 transition-all font-medium text-ink placeholder:text-slate-400"
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">How can we help?</label>
                <textarea 
                  rows={5} 
                  placeholder="Details about your printing or document request..." 
                  className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-accent-blue focus:ring-4 focus:ring-accent-blue/10 transition-all resize-none font-medium text-ink placeholder:text-slate-400"
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-accent-blue text-white py-5 rounded-2xl font-black hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-3"
              >
                <Send size={20} />
                Dispatch Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
