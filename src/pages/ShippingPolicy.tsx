import React from 'react';
import { Truck, MapPin, Clock, Package, CheckCircle2 } from 'lucide-react';

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="relative bg-ink py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent-blue via-ink to-ink"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest border border-white/10 backdrop-blur-md text-accent-blue">
            <Truck size={14} />
            <span>Delivery Information</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-black text-white font-headline tracking-tighter">
            Shipping Policy
          </h1>
          <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto">
            We are committed to delivering your professional prints as quickly and safely as possible. 
            This policy outlines our shipping procedures, timelines, and delivery expectations.
          </p>
          <p className="text-slate-500 text-sm font-medium">Last updated: April 13, 2026</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-6 -mt-12 relative z-20 pb-24">
        <div className="bg-white rounded-[3rem] p-8 lg:p-16 shadow-xl shadow-slate-200/50 border border-slate-100">
          
          <div className="prose prose-slate max-w-none space-y-12">
            
            <section className="space-y-4">
              <h2 className="text-2xl font-black text-ink tracking-tight flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center text-sm">1</span>
                Processing Times
              </h2>
              <div className="ml-11 bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-3">
                <div className="flex items-center gap-2 text-accent-blue font-bold">
                  <Clock size={18} />
                  <span>24 to 48 Hours Standard Processing</span>
                </div>
                <p className="text-slate-600 font-medium text-sm leading-relaxed">
                  All orders are processed within 24 to 48 hours (excluding weekends and holidays) 
                  after receiving your order confirmation. You will receive a notification once your order has 
                  been dispatched. During peak seasons or high volume periods, processing may take an additional 
                  24 hours.
                </p>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-black text-ink tracking-tight flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center text-sm">2</span>
                Delivery Estimates & Costs
              </h2>
              <div className="ml-11 overflow-x-auto">
                <table className="w-full text-left border-collapse bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                  <thead>
                    <tr className="bg-slate-50 text-ink">
                      <th className="p-5 font-black text-[10px] uppercase tracking-widest border-b border-slate-200">Method</th>
                      <th className="p-5 font-black text-[10px] uppercase tracking-widest border-b border-slate-200">Estimated Time</th>
                      <th className="p-5 font-black text-[10px] uppercase tracking-widest border-b border-slate-200">Cost</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-600 text-sm font-medium">
                    <tr className="border-b border-slate-50">
                      <td className="p-5 flex items-center gap-2"><MapPin size={16} className="text-accent-blue"/> Standard Local (Bangalore)</td>
                      <td className="p-5">1-2 business days</td>
                      <td className="p-5 font-bold text-ink">₹40</td>
                    </tr>
                    <tr className="border-b border-slate-50">
                      <td className="p-5 flex items-center gap-2"><Truck size={16} className="text-accent-blue"/> Standard National</td>
                      <td className="p-5">3-7 business days</td>
                      <td className="p-5 font-bold text-ink">Calculated at checkout</td>
                    </tr>
                    <tr>
                      <td className="p-5 flex items-center gap-2"><Package size={16} className="text-accent-amber"/> Express Delivery</td>
                      <td className="p-5">1-3 business days</td>
                      <td className="p-5 font-bold text-ink">Calculated at checkout</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-ink tracking-tight flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center text-sm">3</span>
                In-Store Pickup
              </h2>
              <p className="text-slate-600 font-medium ml-11 leading-relaxed">
                Customers in Bangalore can opt for free in-store pickup. Once your order is ready, you will 
                receive an "Order Ready for Pickup" email with our store location and pickup hours. Most 
                pickup orders are ready within 24 hours. Please bring your order confirmation email when picking up.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-ink tracking-tight flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center text-sm">4</span>
                Order Tracking
              </h2>
              <p className="text-slate-600 font-medium ml-11 leading-relaxed">
                When your order has shipped, you will receive an email notification which will include a 
                tracking number. Please allow 24 hours for the tracking information to become active on the 
                carrier's website. You can also track your order directly on our website using the "Track Order" page.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-ink tracking-tight flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center text-sm">5</span>
                Shipping Restrictions
              </h2>
              <ul className="space-y-3 text-slate-600 font-medium ml-11">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={18} className="text-accent-blue shrink-0 mt-0.5" />
                  <span>Currently, we ship within India only.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={18} className="text-accent-blue shrink-0 mt-0.5" />
                  <span>We do not ship to P.O. Boxes or APO/FPO addresses.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={18} className="text-accent-blue shrink-0 mt-0.5" />
                  <span>Please ensure your shipping address is accurate to avoid delivery delays or returns.</span>
                </li>
              </ul>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
