import React from 'react';
import { Clock, ShieldCheck, RefreshCw, MessageCircle, Mail, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function RefundCancellationPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="relative bg-ink py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent-blue via-ink to-ink"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest border border-white/10 backdrop-blur-md text-accent-blue">
            <RefreshCw size={14} />
            <span>Returns & Exchanges</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-black text-white font-headline tracking-tighter">
            Refund & Cancellation Policy
          </h1>
          <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto">
            Transparency and trust for every custom print at msstar.in
          </p>
          <p className="text-slate-500 text-sm font-medium">Last updated: April 16, 2026</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-5xl mx-auto px-6 -mt-12 relative z-20 pb-24">
        
        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 text-center space-y-4">
            <div className="bg-accent-blue/10 w-16 h-16 rounded-2xl flex items-center justify-center text-accent-blue mx-auto">
              <Clock size={32} />
            </div>
            <h3 className="text-lg font-black text-ink">1-Hour Window</h3>
            <p className="text-sm text-slate-500 font-medium">Easy cancellation before production starts.</p>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 text-center space-y-4">
            <div className="bg-green-500/10 w-16 h-16 rounded-2xl flex items-center justify-center text-green-600 mx-auto">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-lg font-black text-ink">Quality Check</h3>
            <p className="text-sm text-slate-500 font-medium">100% reprint or refund for print defects.</p>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 text-center space-y-4">
            <div className="bg-accent-amber/10 w-16 h-16 rounded-2xl flex items-center justify-center text-accent-amber mx-auto">
              <RefreshCw size={32} />
            </div>
            <h3 className="text-lg font-black text-ink">Quick Processing</h3>
            <p className="text-sm text-slate-500 font-medium">Refunds initiated within 48-72 hours.</p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-8">
          <div className="bg-white rounded-[3rem] p-8 lg:p-12 shadow-xl shadow-slate-200/50 border border-slate-100">
            <p className="text-slate-600 font-medium leading-relaxed text-center max-w-3xl mx-auto mb-12">
              At M S STAR XEROX (msstar.in), we strive to provide high-quality professional printing 
              and document services. Because our products are custom-made and involve sensitive data processing, 
              our policy is strictly defined below:
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <section className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent-blue/10 text-accent-blue rounded-xl flex items-center justify-center">
                    <span className="font-black">1</span>
                  </div>
                  <h2 className="text-xl font-black text-ink">Order Cancellations</h2>
                </div>
                <ul className="space-y-4 text-slate-600 font-medium text-sm">
                  <li className="flex gap-3">
                    <div className="w-1.5 h-1.5 bg-accent-blue rounded-full mt-2 shrink-0" />
                    <div><span className="font-bold text-ink">Pre-Production:</span> Orders can be cancelled within 1 hour of placement for a full refund.</div>
                  </li>
                  <li className="flex gap-3">
                    <div className="w-1.5 h-1.5 bg-accent-blue rounded-full mt-2 shrink-0" />
                    <div><span className="font-bold text-ink">In-Production:</span> Since our services are personalized, cancellations are not accepted once printing has commenced.</div>
                  </li>
                  <li className="flex gap-3">
                    <div className="w-1.5 h-1.5 bg-accent-blue rounded-full mt-2 shrink-0" />
                    <div><span className="font-bold text-ink">Government Services:</span> No cancellations are possible once an application (PAN, E-Stamp, etc.) is submitted.</div>
                  </li>
                </ul>
              </section>

              <section className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/10 text-green-600 rounded-xl flex items-center justify-center">
                    <span className="font-black">2</span>
                  </div>
                  <h2 className="text-xl font-black text-ink">Refund Eligibility</h2>
                </div>
                <p className="text-sm text-slate-500 font-bold">Refunds or replacements are granted for:</p>
                <ul className="space-y-4 text-slate-600 font-medium text-sm">
                  <li className="flex gap-3 items-center">
                    <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                    Physical damage to the product during transit.
                  </li>
                  <li className="flex gap-3 items-center">
                    <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                    Manufacturing defects (smudged ink, faded print).
                  </li>
                  <li className="flex gap-3 items-center">
                    <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                    Duplicate payment due to technical glitches.
                  </li>
                  <li className="flex gap-3 items-center">
                    <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                    Non-delivery beyond the promised timeline.
                  </li>
                </ul>
              </section>

              <section className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-500/10 text-red-600 rounded-xl flex items-center justify-center">
                    <span className="font-black">3</span>
                  </div>
                  <h2 className="text-xl font-black text-ink">Non-Refundable Items</h2>
                </div>
                <ul className="space-y-4 text-slate-600 font-medium text-sm">
                  <li className="flex gap-3 items-start">
                    <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
                    Data entry errors made by the customer.
                  </li>
                  <li className="flex gap-3 items-start">
                    <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
                    Low-quality prints due to low-resolution uploads.
                  </li>
                  <li className="flex gap-3 items-start">
                    <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
                    Minor color variations inherent to printing.
                  </li>
                  <li className="flex gap-3 items-start">
                    <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
                    Orders already shipped or delivered in good condition.
                  </li>
                </ul>
              </section>

              <section className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent-amber/10 text-accent-amber rounded-xl flex items-center justify-center">
                    <span className="font-black">4</span>
                  </div>
                  <h2 className="text-xl font-black text-ink">How to Request</h2>
                </div>
                <p className="text-slate-600 font-medium text-sm">Contact our support team within 24 hours of delivery:</p>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center gap-3 text-ink">
                    <MessageCircle size={20} className="text-accent-blue" />
                    <span className="font-black text-sm">WhatsApp: +91 9901526231</span>
                  </div>
                  <div className="flex items-center gap-3 text-ink">
                    <Mail size={20} className="text-accent-blue" />
                    <span className="font-black text-sm">Email: msgunjur@gmail.com</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 font-bold italic">
                  *Approved refunds are credited to the original source (Paytm PG / Bank Account) within 5-7 working days.
                </p>
              </section>

              <section className="bg-blue-50 p-8 rounded-[2rem] border border-blue-100 space-y-6 md:col-span-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/10 text-blue-600 rounded-xl flex items-center justify-center">
                    <ShieldCheck size={20} />
                  </div>
                  <h2 className="text-xl font-black text-ink">Payment Gateway (Paytm PG) Policy</h2>
                </div>
                <div className="space-y-4 text-slate-600 font-medium text-sm">
                  <p>For all online payments processed via <strong>Paytm Payment Gateway</strong>:</p>
                  <ul className="list-disc ml-5 space-y-2">
                    <li>Refunds for failed transactions or double-deductions are automatically initiated by Paytm and credited back to your original payment mode (UPI, Card, or Wallet).</li>
                    <li>In case of order cancellation (within the 1-hour window), the refund will be processed through the Paytm PG dashboard.</li>
                    <li>Please note that convenience fees or taxes charged by the payment gateway at the time of transaction are non-refundable as per gateway terms.</li>
                    <li>For any payment-related disputes, please provide the <strong>Paytm Transaction ID</strong> found in your order confirmation.</li>
                  </ul>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
