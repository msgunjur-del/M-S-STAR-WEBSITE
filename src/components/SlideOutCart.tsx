import React from 'react';
import { X, ShoppingBasket, Trash2, ArrowRight, FileText } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function SlideOutCart() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalPrice } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
          />

          {/* Slide-out Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent-blue/10 rounded-xl flex items-center justify-center text-accent-blue">
                  <ShoppingBasket size={20} />
                </div>
                <h2 className="text-xl font-black font-headline tracking-tight text-ink">Your Cart</h2>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X size={24} className="text-slate-500" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="text-center text-slate-500 py-12 space-y-4">
                  <ShoppingBasket size={48} className="mx-auto text-slate-300" />
                  <p className="font-bold">Your cart is empty</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="text-accent-blue font-bold hover:underline"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-20 h-20 bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden border border-slate-200 shrink-0">
                      {item.files && item.files[0] && (
                        item.files[0].url.includes('firebasestorage') || 
                        item.files[0].url.startsWith('blob:') ||
                        item.files[0].url.startsWith('http')
                      ) ? (
                        item.files[0].name?.toLowerCase().endsWith('.pdf') ? (
                          <div className="flex flex-col items-center gap-1">
                            <FileText size={24} className="text-red-500" />
                            <span className="text-[8px] font-black uppercase">PDF</span>
                          </div>
                        ) : (
                          <img 
                            src={item.files[0].url} 
                            alt={item.title} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        )
                      ) : (
                        <ShoppingBasket size={24} className="text-slate-300" />
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-ink text-sm leading-tight">{item.title}</h3>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="text-xs text-slate-500 font-medium">
                        {item.category}
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg p-1">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center hover:bg-slate-100 rounded"
                          >-</button>
                          <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center hover:bg-slate-100 rounded"
                          >+</button>
                        </div>
                        <span className="font-black text-ink">₹{item.price * item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-6 bg-slate-50 border-t border-slate-100 space-y-6">
                <div className="flex justify-between items-center text-lg">
                  <span className="font-bold text-slate-600">Total</span>
                  <span className="font-black text-2xl text-ink">₹{totalPrice}</span>
                </div>
                
                <div className="space-y-3">
                  <button 
                    onClick={() => {
                      setIsCartOpen(false);
                      navigate('/checkout');
                    }}
                    className="w-full bg-accent-blue text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                  >
                    Proceed to Checkout
                    <ArrowRight size={20} />
                  </button>
                  
                  <div className="text-center text-[10px] text-slate-500 font-medium space-y-1">
                    <p>By proceeding to checkout, you agree to our</p>
                    <div className="flex items-center justify-center gap-2">
                      <Link to="/terms-conditions" className="text-accent-blue hover:underline" onClick={() => setIsCartOpen(false)}>Terms & Conditions</Link>
                      <span>&bull;</span>
                      <Link to="/refund-cancellation" className="text-accent-blue hover:underline" onClick={() => setIsCartOpen(false)}>Refund Policy</Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
