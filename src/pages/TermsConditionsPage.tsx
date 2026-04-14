import React from 'react';
import { Shield, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function TermsConditionsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="relative bg-ink py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent-blue via-ink to-ink"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest border border-white/10 backdrop-blur-md text-accent-blue">
            <FileText size={14} />
            <span>Legal Information</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-black text-white font-headline tracking-tighter">
            Terms & Conditions
          </h1>
          <p className="text-slate-400 text-lg font-medium">Last updated: April 13, 2026</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-6 -mt-12 relative z-20 pb-24">
        <div className="bg-white rounded-[3rem] p-8 lg:p-16 shadow-xl shadow-slate-200/50 border border-slate-100">
          
          <div className="prose prose-slate max-w-none space-y-12">
            
            <div className="bg-accent-blue/5 border border-accent-blue/10 p-6 rounded-2xl flex gap-4 items-start">
              <Shield className="text-accent-blue shrink-0 mt-1" size={24} />
              <p className="text-sm font-bold text-slate-700 leading-relaxed m-0">
                Welcome to MS STAR. By accessing our website (msstar.in) and using our professional printing services, 
                you agree to be bound by the following terms and conditions. Please read them carefully before placing an order.
              </p>
            </div>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-ink tracking-tight flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center text-sm">1</span>
                Service Usage & File Uploads
              </h2>
              <ul className="space-y-3 text-slate-600 font-medium ml-11 list-disc">
                <li>Our services are provided for lawful purposes only.</li>
                <li>You agree not to use our printing services for any material that is illegal, offensive, defamatory, or infringes on the intellectual property rights of others.</li>
                <li><strong>No Modifications:</strong> We print exactly what you upload. We do not proofread, edit, or alter your files. It is your responsibility to ensure the file is correct before uploading.</li>
                <li>We reserve the right to refuse service and cancel orders for any content we deem inappropriate or illegal.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-ink tracking-tight flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center text-sm">2</span>
                Pricing & Payment
              </h2>
              <p className="text-slate-600 font-medium ml-11 leading-relaxed">
                All prices listed on our website are in Indian Rupees (₹) and are subject to change without prior notice. 
                Full payment is required at the time of placing an order. We use secure third-party payment gateways (like Paytm) 
                to process all transactions. Your payment information is never stored on our servers.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-ink tracking-tight flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center text-sm">3</span>
                Order Processing & Cancellation
              </h2>
              <p className="text-slate-600 font-medium ml-11 leading-relaxed">
                Due to the automated nature of our printing process, orders begin processing almost immediately after payment is confirmed. 
                Once an order has entered the printing queue, it cannot be modified or cancelled. Please review your cart and uploaded files 
                carefully before completing your purchase. For more details, see our <Link to="/refund-cancellation" className="text-accent-blue hover:underline">Refund & Cancellation Policy</Link>.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-ink tracking-tight flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center text-sm">4</span>
                Quality & Color Variations
              </h2>
              <div className="ml-11 bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-3">
                <div className="flex items-center gap-2 text-amber-600 font-bold">
                  <AlertTriangle size={18} />
                  <span>Important Note on Colors</span>
                </div>
                <p className="text-slate-600 font-medium text-sm leading-relaxed">
                  While we strive for perfection and use high-quality commercial printers, minor variations in color and finish are inherent to the printing process. Colors viewed on a backlit screen (phone/computer) will always look slightly different when printed on physical media (paper/PVC). We do not offer refunds for slight color variations.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-ink tracking-tight flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center text-sm">5</span>
                Limitation of Liability
              </h2>
              <p className="text-slate-600 font-medium ml-11 leading-relaxed">
                MS STAR shall not be liable for any indirect, incidental, or consequential damages resulting from 
                the use or inability to use our services, including delays in shipping or delivery. Our maximum liability 
                for any order is strictly limited to the total amount paid by the customer for that specific order.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-ink tracking-tight flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center text-sm">6</span>
                Governing Law
              </h2>
              <p className="text-slate-600 font-medium ml-11 leading-relaxed">
                These terms and conditions are governed by and construed in accordance with the laws of India. 
                Any disputes arising out of or in connection with these terms shall be subject to the exclusive 
                jurisdiction of the courts in Bangalore, Karnataka.
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
