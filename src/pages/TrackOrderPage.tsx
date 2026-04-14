import React, { useState } from 'react';
import { Search, ShoppingBasket, Clock, Package, Truck, CheckCircle2 } from 'lucide-react';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [status, setStatus] = useState<null | 'searching' | 'found'>(null);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return;
    setStatus('searching');
    setTimeout(() => setStatus('found'), 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
      <header className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full font-bold text-sm border border-blue-100">
          <div className="relative">
            <ShoppingBasket size={16} />
            <div className="absolute -top-1 -right-1 bg-red-500 text-white w-2 h-2 rounded-full flex items-center justify-center">
              <Clock size={6} />
            </div>
          </div>
          Express Bucket Tracking
        </div>
        <h1 className="text-5xl font-extrabold font-headline">Track Your Order</h1>
        <p className="text-xl text-slate-600">Enter your Order ID to see the real-time status of your premium prints.</p>
      </header>

      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
        <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Enter Order ID (e.g. MS-12345)" 
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
            />
          </div>
          <button 
            type="submit"
            className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            Track Now
          </button>
        </form>

        {status === 'searching' && (
          <div className="mt-12 text-center space-y-4 animate-pulse">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-slate-500 font-medium">Locating your bucket...</p>
          </div>
        )}

        {status === 'found' && (
          <div className="mt-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 text-center">
                <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">Status</p>
                <p className="text-blue-900 font-black">In Transit</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Order ID</p>
                <p className="text-slate-900 font-black">{orderId}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Delivery</p>
                <p className="text-slate-900 font-black">Today, 6 PM</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Items</p>
                <p className="text-slate-900 font-black">3 Files</p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2"></div>
              <div className="relative flex justify-between items-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-green-200">
                    <CheckCircle2 size={20} />
                  </div>
                  <p className="text-xs font-bold text-slate-900">Ordered</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-green-200">
                    <Package size={20} />
                  </div>
                  <p className="text-xs font-bold text-slate-900">Packed</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-blue-200 scale-110 ring-4 ring-blue-50">
                    <Truck size={24} />
                  </div>
                  <p className="text-xs font-black text-blue-600">Shipping</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 bg-slate-100 text-slate-300 rounded-full flex items-center justify-center">
                    <CheckCircle2 size={20} />
                  </div>
                  <p className="text-xs font-bold text-slate-400">Delivered</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
