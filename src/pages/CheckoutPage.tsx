import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ShoppingBasket, Clock, Loader2, CreditCard, Smartphone, Truck, Store, Tag, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.VITE_STRIPE_PUBLIC_KEY || '');

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('paytm');
  const [deliveryMethod, setDeliveryMethod] = useState<'Home Delivery' | 'Store Pickup'>('Home Delivery');
  
  // Reset payment method if it was 'cash' but user switched to 'Home Delivery'
  React.useEffect(() => {
    if (deliveryMethod === 'Home Delivery' && paymentMethod === 'cash') {
      setPaymentMethod('paytm');
    }
  }, [deliveryMethod, paymentMethod]);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'WELCOME10') {
      setDiscount(totalPrice * 0.1);
      alert('Coupon applied! 10% discount added.');
    } else {
      alert('Invalid coupon code.');
      setDiscount(0);
    }
  };

  const finalTotal = totalPrice - discount;
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async () => {
    console.log("handlePayment called, method:", paymentMethod, "delivery:", deliveryMethod);
    
    if (!formData.name) { alert("Please enter your Full Name."); return; }
    if (!formData.phone) { alert("Please enter your Phone Number."); return; }
    if (!formData.email) { alert("Please enter your Email Address."); return; }
    if (deliveryMethod === 'Home Delivery' && !formData.address) { alert("Please enter your Delivery Address."); return; }

    setLoading(true);
    try {
      if (paymentMethod === 'cash') {
        console.log("Calling createOrder for cash");
        await createOrder('Pending (Cash on Pickup)');
      } else {
        // Stripe Payment
        console.log("Stripe payment flow");
        const stripe = await stripePromise;
        if (!stripe) throw new Error("Stripe not initialized");

        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: finalTotal }),
        });
        const { clientSecret } = await response.json();

        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: {} as any, // Placeholder for Stripe Elements
            billing_details: { name: formData.name, email: formData.email },
          },
        });

        if (result.error) {
          throw new Error(result.error.message);
        } else {
          await createOrder('Paid');
        }
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("An error occurred during payment processing: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (paymentStatus: string) => {
    console.log("createOrder called, status:", paymentStatus);
    try {
      const orderData = {
        uid: auth.currentUser?.uid || 'guest',
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        deliveryAddress: deliveryMethod === 'Home Delivery' ? formData.address : 'Store Pickup',
        deliveryMethod,
        couponCode,
        items: cart,
        subtotal: totalPrice,
        discount: discount,
        totalPrice: finalTotal,
        status: 'Pending',
        paymentStatus,
        paymentMethod,
        createdAt: serverTimestamp(),
        files: cart.flatMap(item => item.files || [])
      };
      
      console.log("Order data:", orderData);

      const docRef = await addDoc(collection(db, 'orders'), orderData);
      console.log("Order created with ID:", docRef.id);
      const orderId = docRef.id;

      clearCart();
      navigate(`/order-success/${orderId}`);
    } catch (error) {
      console.error("Firestore error in createOrder:", error);
      throw error;
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
          <ShoppingBasket size={48} />
        </div>
        <h2 className="text-3xl font-black font-headline">Your bucket is empty</h2>
        <p className="text-slate-500">Add some premium prints to get started.</p>
        <button onClick={() => navigate('/')} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold">Browse Services</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-extrabold font-headline">Secure Checkout</h1>
          <p className="text-xl text-slate-600">Finalize your premium print order. Handcrafted precision is just a few steps away.</p>
        </div>
        <div className="flex items-center gap-4 bg-blue-50 p-6 rounded-[2rem] border border-blue-100">
          <div className="relative">
            <ShoppingBasket className="text-blue-600" size={48} />
            <div className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
              <Clock size={12} />
            </div>
          </div>
          <div>
            <p className="font-black text-blue-900 leading-none">Express</p>
            <p className="text-blue-600 font-bold text-sm">Bucket</p>
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Delivery Method */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h2 className="text-2xl font-bold font-headline flex items-center gap-3">
              <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span> Delivery Method
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <button 
                onClick={() => setDeliveryMethod('Home Delivery')}
                className={`flex items-center gap-4 p-6 rounded-2xl border-2 transition-all ${deliveryMethod === 'Home Delivery' ? 'border-blue-600 bg-blue-50' : 'border-slate-100 hover:border-slate-200'}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${deliveryMethod === 'Home Delivery' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <Truck size={24} />
                </div>
                <div className="text-left">
                  <p className="font-black text-ink">Home Delivery</p>
                  <p className="text-xs text-slate-500">Bangalore & Gunjur</p>
                </div>
              </button>
              <button 
                onClick={() => setDeliveryMethod('Store Pickup')}
                className={`flex items-center gap-4 p-6 rounded-2xl border-2 transition-all ${deliveryMethod === 'Store Pickup' ? 'border-blue-600 bg-blue-50' : 'border-slate-100 hover:border-slate-200'}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${deliveryMethod === 'Store Pickup' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <Store size={24} />
                </div>
                <div className="text-left">
                  <p className="font-black text-ink">Store Pickup</p>
                  <p className="text-xs text-slate-500">Gunjur Main Road</p>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h2 className="text-2xl font-bold font-headline flex items-center gap-3">
              <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span> Shipping Details
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Full Name" className="w-full p-4 rounded-xl border-slate-200" />
              <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone Number" className="w-full p-4 rounded-xl border-slate-200" />
            </div>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email Address" className="w-full p-4 rounded-xl border-slate-200" />
            {deliveryMethod === 'Home Delivery' && (
              <textarea name="address" value={formData.address} onChange={handleInputChange} placeholder="Delivery Address (Bangalore/Gunjur)" className="w-full p-4 rounded-xl border-slate-200 h-32" />
            )}
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h2 className="text-2xl font-bold font-headline flex items-center gap-3">
              <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span> Payment Method
            </h2>
            <div className="space-y-4">
              <label 
                className={`flex items-center p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'paytm' ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input type="radio" name="payment" value="paytm" checked={paymentMethod === 'paytm'} onChange={() => setPaymentMethod('paytm')} className="hidden" />
                <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center transition-colors ${
                  paymentMethod === 'paytm' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                }`}>
                  <AnimatePresence>
                    {paymentMethod === 'paytm' && (
                      <motion.div
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        <Check size={14} strokeWidth={4} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <span className={`font-bold ${paymentMethod === 'paytm' ? 'text-blue-700' : 'text-slate-700'}`}>Paytm / UPI / Wallet</span>
                  <Smartphone size={20} className="text-slate-400" />
                </div>
              </label>

              <label 
                className={`flex items-center p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'card' ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="hidden" />
                <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center transition-colors ${
                  paymentMethod === 'card' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                }`}>
                  <AnimatePresence>
                    {paymentMethod === 'card' && (
                      <motion.div
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        <Check size={14} strokeWidth={4} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <span className={`font-bold ${paymentMethod === 'card' ? 'text-blue-700' : 'text-slate-700'}`}>Credit / Debit Cards</span>
                  <CreditCard size={20} className="text-slate-400" />
                </div>
              </label>

              {deliveryMethod === 'Store Pickup' && (
                <label 
                  className={`flex items-center p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'cash' ? 'border-accent-amber bg-amber-50' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input type="radio" name="payment" value="cash" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} className="hidden" />
                  <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center transition-colors ${
                    paymentMethod === 'cash' ? 'border-accent-amber bg-accent-amber text-ink' : 'border-slate-300'
                  }`}>
                    <AnimatePresence>
                      {paymentMethod === 'cash' && (
                        <motion.div
                          initial={{ scale: 0, rotate: -45 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        >
                          <Check size={14} strokeWidth={4} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className={`font-black ${paymentMethod === 'cash' ? 'text-amber-900' : 'text-slate-700'}`}>Cash on Pickup</span>
                      <p className="text-[10px] font-bold text-amber-700/60 uppercase tracking-widest">Pay at Store</p>
                    </div>
                    <Store size={20} className="text-slate-400" />
                  </div>
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 sticky top-28">
            <h2 className="text-2xl font-bold font-headline">Order Summary</h2>
            <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              {cart.map((item, index) => (
                <div key={index} className="bg-slate-50 p-4 rounded-2xl space-y-3">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <p className="font-black text-slate-900 leading-tight">{item.title}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">{item.category}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-slate-100">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-slate-400 hover:text-ink"><Minus size={14} /></button>
                      <span className="font-black text-sm w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-slate-400 hover:text-ink"><Plus size={14} /></button>
                    </div>
                    <span className="font-black text-slate-900">₹{item.price * item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative">
              <input 
                type="text" 
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Coupon Code" 
                className="w-full p-4 pr-24 rounded-xl border-slate-200 bg-slate-50 text-sm font-bold"
              />
              <button 
                onClick={applyCoupon}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors"
              >
                Apply
              </button>
            </div>

            <hr className="border-slate-100" />
            
            <div className="space-y-4">
              <div className="flex justify-between text-sm font-bold text-slate-500">
                <span>Subtotal</span>
                <span className="text-ink">₹{totalPrice}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm font-bold text-green-600">
                  <span>Discount (WELCOME10)</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-slate-500">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <hr className="border-slate-100" />
              <div className="flex justify-between items-end">
                <span className="font-black text-slate-900">Total Amount</span>
                <span className="text-3xl font-black text-accent-blue tracking-tighter">₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {paymentMethod === 'paytm' ? (
              <div className="space-y-3">
                <div id="paytm-checkout-btn">
                  {/* 
                    USER: PASTE YOUR PAYTM BUTTON SCRIPT HERE 
                    To accept real payments, replace this button with the code generated from your Paytm Dashboard.
                  */}
                  <button 
                    onClick={handlePayment} 
                    disabled={loading}
                    className="w-full bg-[#002970] text-white py-5 rounded-2xl font-black text-xl hover:bg-[#001f54] transition-all shadow-xl shadow-[#002970]/20 flex items-center justify-center gap-3 group disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={24} />
                    ) : (
                      <>
                        Pay with <span className="text-[#00baf2]">Paytm</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[10px] text-center text-slate-400 font-bold px-4">
                  Note: This is a simulated Paytm button. To accept real payments, replace this button with the code generated from your Paytm Dashboard.
                </p>
              </div>
            ) : paymentMethod === 'cash' ? (
              <button 
                onClick={handlePayment} 
                disabled={loading}
                className="w-full bg-accent-amber text-ink py-5 rounded-2xl font-black text-xl hover:bg-amber-500 transition-all shadow-xl shadow-amber-200 flex items-center justify-center gap-3 group disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <>
                    Confirm Order (Cash)
                    <Check size={24} className="group-hover:scale-110 transition-transform" />
                  </>
                )}
              </button>
            ) : (
              <button 
                onClick={handlePayment} 
                disabled={loading}
                className="w-full bg-accent-blue text-white py-5 rounded-2xl font-black text-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3 group disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <>
                    Place Order
                    <Check size={24} className="group-hover:scale-110 transition-transform" />
                  </>
                )}
              </button>
            )}
            
            <div className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <Clock size={12} />
              <span>Secure SSL Encrypted Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
