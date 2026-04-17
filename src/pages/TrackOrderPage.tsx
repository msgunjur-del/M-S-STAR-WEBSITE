import React, { useState } from 'react';
import { Search, ShoppingBasket, Clock, Package, Truck, CheckCircle2, AlertCircle, ExternalLink, Phone, Calendar } from 'lucide-react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [status, setStatus] = useState<null | 'searching' | 'found' | 'error'>(null);
  const [orderData, setOrderData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return;
    
    setStatus('searching');
    setErrorMessage('');
    
    try {
      // Clean order ID (remove # if present)
      const cleanId = orderId.trim().replace('#', '');
      const orderRef = doc(db, 'orders', cleanId);
      const orderSnap = await getDoc(orderRef);

      if (orderSnap.exists()) {
        setOrderData({ id: orderSnap.id, ...orderSnap.data() });
        setStatus('found');
      } else {
        setStatus('error');
        setErrorMessage('Order not found. Please check your Order ID and try again.');
      }
    } catch (error) {
      console.error("Error tracking order:", error);
      setStatus('error');
      setErrorMessage('An error occurred while fetching your order. Please try again later.');
    }
  };

  const getStatusStep = (orderStatus: string) => {
    const s = orderStatus?.toLowerCase() || 'pending';
    if (s === 'delivered') return 4;
    if (s === 'shipped') return 3;
    if (['printing', 'ready', 'processing'].includes(s)) return 2;
    return 1; // Pending
  };

  const currentStep = orderData ? getStatusStep(orderData.status) : 0;

  const getTrackingUrl = (courier: string, trackingNumber: string) => {
    const c = courier?.toLowerCase() || 'delhivery';
    if (c === 'bluedart') return `https://www.bluedart.com/tracking?trackid=${trackingNumber}`;
    if (c === 'ecom express') return `https://ecomexpress.in/tracking/?tracking_id=${trackingNumber}`;
    if (c === 'xpressbees') return `https://www.xpressbees.com/track?shipment_id=${trackingNumber}`;
    if (c === 'shadowfax') return `https://www.shadowfax.in/track?orderId=${trackingNumber}`;
    if (c === 'india post') return `https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/trackconsignment.aspx`;
    return `https://www.delhivery.com/track/package/${trackingNumber}`;
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

        {status === 'error' && (
          <div className="mt-8 p-6 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-4 text-red-700 animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={24} />
            <p className="font-bold">{errorMessage}</p>
          </div>
        )}

        {status === 'found' && orderData && (
          <div className="mt-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 text-center">
                <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">Status</p>
                <p className="text-blue-900 font-black">{orderData.status || 'Pending'}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Order ID</p>
                <p className="text-slate-900 font-black">#{orderData.id}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Date</p>
                <p className="text-slate-900 font-black">
                  {orderData.createdAt?.toDate ? orderData.createdAt.toDate().toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Items</p>
                <p className="text-slate-900 font-black">{orderData.items?.length || 0} Products</p>
              </div>
            </div>

            {/* Detailed Tracking Details */}
            <div className="grid md:grid-cols-2 gap-6">
              {orderData.estimatedDeliveryDate && (
                <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-blue-400 uppercase tracking-widest leading-none mb-1">Estimated Delivery</p>
                    <p className="text-lg font-black text-blue-900 tracking-tight">{orderData.estimatedDeliveryDate}</p>
                  </div>
                </div>
              )}
              {orderData.courierPhone && (
                <div className="p-6 bg-green-50 rounded-3xl border border-green-100 flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-100">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-green-400 uppercase tracking-widest leading-none mb-1">Courier Contact</p>
                    <a href={`tel:${orderData.courierPhone}`} className="text-lg font-black text-green-900 hover:text-blue-600 transition-colors tracking-tight">
                      {orderData.courierPhone}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {orderData.trackingNumber && (
              <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                    <Truck size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-indigo-400 uppercase tracking-widest">Tracking Number ({orderData.courier || 'Delhivery'})</p>
                    <p className="text-xl font-black text-indigo-900 tracking-tight">{orderData.trackingNumber}</p>
                  </div>
                </div>
                <a 
                  href={getTrackingUrl(orderData.courier, orderData.trackingNumber)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold text-sm border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-2 shadow-sm"
                >
                  Track on {orderData.courier || 'Courier'} Site
                  <ExternalLink size={16} />
                </a>
              </div>
            )}

            <div className="relative pt-4 pb-8">
              <div className="absolute top-[44px] left-0 w-full h-1 bg-slate-100"></div>
              <div 
                className="absolute top-[44px] left-0 h-1 bg-green-500 transition-all duration-1000"
                style={{ width: `${(Math.max(0, currentStep - 1) / 3) * 100}%` }}
              ></div>
              
              <div className="relative flex justify-between items-center">
                <div className="flex flex-col items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                    currentStep >= 1 ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 'bg-slate-100 text-slate-300'
                  }`}>
                    {currentStep > 1 ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                  </div>
                  <p className={`text-xs font-black uppercase tracking-widest ${currentStep >= 1 ? 'text-slate-900' : 'text-slate-400'}`}>Ordered</p>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                    currentStep >= 2 ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 'bg-slate-100 text-slate-300'
                  }`}>
                    {currentStep > 2 ? <CheckCircle2 size={24} /> : <Package size={24} />}
                  </div>
                  <p className={`text-xs font-black uppercase tracking-widest ${currentStep >= 2 ? 'text-slate-900' : 'text-slate-400'}`}>Processing</p>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                    currentStep >= 3 ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-100 text-slate-300'
                  }`}>
                    {currentStep > 3 ? <CheckCircle2 size={24} /> : <Truck size={24} />}
                  </div>
                  <p className={`text-xs font-black uppercase tracking-widest ${currentStep >= 3 ? 'text-blue-600' : 'text-slate-400'}`}>Shipping</p>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                    currentStep >= 4 ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 'bg-slate-100 text-slate-300'
                  }`}>
                    <CheckCircle2 size={24} />
                  </div>
                  <p className={`text-xs font-black uppercase tracking-widest ${currentStep >= 4 ? 'text-slate-900' : 'text-slate-400'}`}>Delivered</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
              <h3 className="text-xl font-black font-headline mb-6">Order Summary</h3>
              <div className="space-y-4">
                {orderData.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center py-3 border-b border-slate-200 last:border-0">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <Package size={20} className="text-slate-300" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{item.title}</p>
                        <p className="text-xs text-slate-500">Qty: {item.quantity || 1}</p>
                      </div>
                    </div>
                    <p className="font-black text-slate-900">₹{item.price * (item.quantity || 1)}</p>
                  </div>
                ))}
                <div className="pt-4 flex justify-between items-center">
                  <p className="text-slate-500 font-bold">Total Amount</p>
                  <p className="text-2xl font-black text-blue-600">₹{orderData.totalPrice}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
