import React from 'react';
import { Shield, Lock, Eye, FileText, Smartphone, Globe, Trash2, UserCheck, Mail } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="relative bg-ink py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent-blue via-ink to-ink"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest border border-white/10 backdrop-blur-md text-accent-blue">
            <Shield size={14} />
            <span>Your Privacy is Our Priority</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-black text-white font-headline tracking-tighter">
            Privacy Policy
          </h1>
          <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto">
            At MS STAR, we treat your data with the same precision and care as our finest prints. 
            Learn how we protect your information in our digital atelier.
          </p>
          <p className="text-slate-500 text-sm font-medium">Last updated: April 13, 2026</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-6 -mt-12 relative z-20 pb-24">
        
        {/* Quick Summary Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 text-center space-y-3">
            <div className="bg-accent-blue/10 w-12 h-12 rounded-2xl flex items-center justify-center text-accent-blue mx-auto">
              <Lock size={24} />
            </div>
            <h3 className="text-sm font-black text-ink uppercase tracking-widest">Secure Encryption</h3>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 text-center space-y-3">
            <div className="bg-green-500/10 w-12 h-12 rounded-2xl flex items-center justify-center text-green-600 mx-auto">
              <Trash2 size={24} />
            </div>
            <h3 className="text-sm font-black text-ink uppercase tracking-widest">24h Data Purge</h3>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 text-center space-y-3">
            <div className="bg-purple-500/10 w-12 h-12 rounded-2xl flex items-center justify-center text-purple-600 mx-auto">
              <Eye size={24} />
            </div>
            <h3 className="text-sm font-black text-ink uppercase tracking-widest">Zero Data Sale</h3>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 text-center space-y-3">
            <div className="bg-accent-amber/10 w-12 h-12 rounded-2xl flex items-center justify-center text-accent-amber mx-auto">
              <UserCheck size={24} />
            </div>
            <h3 className="text-sm font-black text-ink uppercase tracking-widest">User Control</h3>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 bg-white rounded-[3rem] p-8 lg:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-12">
            
            <section className="space-y-6">
              <h2 className="text-2xl font-black text-ink tracking-tight flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center text-sm">1</span>
                Information We Collect
              </h2>
              <div className="space-y-4 text-slate-600 font-medium ml-11">
                <p>We collect information to provide better services to all our users. This includes:</p>
                <div className="grid gap-4 mt-4">
                  <div className="flex gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <FileText className="text-accent-blue shrink-0" size={24} />
                    <div>
                      <h4 className="font-black text-ink mb-1">Personal Identifiers</h4>
                      <p className="text-sm">Name, email address, phone number, and physical shipping address for order fulfillment.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <Smartphone className="text-accent-blue shrink-0" size={24} />
                    <div>
                      <h4 className="font-black text-ink mb-1">Device Information</h4>
                      <p className="text-sm">IP address, browser type, and device identifiers to prevent fraud and optimize our UI.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <Globe className="text-accent-blue shrink-0" size={24} />
                    <div>
                      <h4 className="font-black text-ink mb-1">Usage Data</h4>
                      <p className="text-sm">Information about how you interact with our website, including pages visited and products viewed.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-black text-ink tracking-tight flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center text-sm">2</span>
                How We Use Your Data
              </h2>
              <div className="ml-11 bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-4 text-slate-600 font-medium">
                <p>Your data is used exclusively for operational excellence:</p>
                <ul className="grid md:grid-cols-2 gap-4">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-accent-blue rounded-full" />
                    Order processing & delivery
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-accent-blue rounded-full" />
                    Customer support & communication
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-accent-blue rounded-full" />
                    Fraud prevention & security
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-accent-blue rounded-full" />
                    Personalized user experience
                  </li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-ink tracking-tight flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center text-sm">3</span>
                Cookies & Tracking
              </h2>
              <p className="text-slate-600 font-medium ml-11 leading-relaxed">
                We use cookies to enhance your browsing experience. Cookies are small files stored on your device that help us 
                remember your preferences and analyze site traffic. You can choose to disable cookies through your browser 
                settings, though some features of msstar.in may not function correctly without them.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-ink tracking-tight flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center text-sm">4</span>
                Third-Party Services
              </h2>
              <p className="text-slate-600 font-medium ml-11 leading-relaxed">
                We partner with trusted third-party providers for payments (e.g., Paytm) and analytics. 
                These providers have their own privacy policies and only receive the minimum data necessary to perform their services. 
                We never sell your personal information to third-party advertisers.
              </p>
            </section>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            <div className="bg-accent-blue rounded-[3rem] p-8 text-white space-y-6 shadow-xl shadow-blue-200">
              <h3 className="text-2xl font-black font-headline tracking-tight">Document Security</h3>
              <p className="text-blue-100 text-sm font-medium leading-relaxed">
                We understand the sensitivity of your documents. All uploads are:
              </p>
              <ul className="space-y-4">
                <li className="flex gap-3 items-start">
                  <Lock className="text-blue-300 shrink-0" size={20} />
                  <span className="text-sm font-bold">Encrypted with industry-standard SSL during transit.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <Trash2 className="text-blue-300 shrink-0" size={20} />
                  <span className="text-sm font-bold">Automatically purged from our servers 24 hours after delivery.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <Eye className="text-blue-300 shrink-0" size={20} />
                  <span className="text-sm font-bold">Never accessed by unauthorized personnel.</span>
                </li>
              </ul>
            </div>

            <div className="bg-ink rounded-[3rem] p-8 text-white space-y-6">
              <h3 className="text-2xl font-black font-headline tracking-tight">Your Rights</h3>
              <p className="text-slate-400 text-sm font-medium">You have the right to:</p>
              <div className="space-y-3">
                <div className="bg-white/5 p-4 rounded-2xl text-sm font-bold border border-white/10">Access your personal data</div>
                <div className="bg-white/5 p-4 rounded-2xl text-sm font-bold border border-white/10">Request data correction</div>
                <div className="bg-white/5 p-4 rounded-2xl text-sm font-bold border border-white/10">Request data deletion</div>
                <div className="bg-white/5 p-4 rounded-2xl text-sm font-bold border border-white/10">Object to data processing</div>
              </div>
            </div>

            <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-2xl font-black text-ink font-headline tracking-tight">Contact Us</h3>
              <p className="text-slate-500 text-sm font-medium">Have questions about your privacy?</p>
              <a 
                href="mailto:support@msstar.in" 
                className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl text-ink font-black hover:bg-slate-100 transition-colors"
              >
                <Mail className="text-accent-blue" size={20} />
                support@msstar.in
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
