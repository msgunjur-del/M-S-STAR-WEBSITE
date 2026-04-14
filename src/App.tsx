/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useCart } from './context/CartContext';
import { 
  ShieldCheck, ShieldAlert, ShoppingBasket, Search, 
  Menu, X, ChevronRight, Phone, Mail, MapPin,
  Clock, Zap, ArrowRight, ShoppingBag, Settings, Lock, MessageCircle
} from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { CartProvider } from './context/CartContext';
import HomePage from './pages/HomePage';
import DocumentPrintingPage from './pages/DocumentPrintingPage';
import PVCCardsPage from './pages/PVCCardsPage';
import PhotosPage from './pages/PhotosPage';
import TrackOrderPage from './pages/TrackOrderPage';
import AboutUsPage from './pages/AboutUsPage';
import ContactUsPage from './pages/ContactUsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsConditionsPage from './pages/TermsConditionsPage';
import RefundCancellationPage from './pages/RefundCancellationPage';
import ShippingPolicyPage from './pages/ShippingPolicy';
import CheckoutPage from './pages/CheckoutPage';
import AdminPanel from './pages/AdminPanel';
import ProductDetailsPage from './pages/ProductDetailsPage';
import RateCalculatorPage from './pages/RateCalculatorPage';
import SitemapPage from './pages/SitemapPage';
import PaymentTermsPage from './pages/PaymentTermsPage';
import WorkWithUsPage from './pages/WorkWithUsPage';
import QualityTermsPage from './pages/QualityTermsPage';
import FaqPage from './pages/FaqPage';
import DisclaimerPage from './pages/DisclaimerPage';
import UserDashboardPage from './pages/UserDashboardPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import SecurityBadgeSection from './components/SecurityBadgeSection';
import SlideOutCart from './components/SlideOutCart';

function Layout({ children, user }: { children: React.ReactNode, user: any }) {
  const { cart, setIsCartOpen } = useCart();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  
  return (
    <div className="min-h-screen bg-surface font-body text-on-surface antialiased flex flex-col">
      <SlideOutCart />
      {/* TopNavBar */}
      <div className="bg-red-600 text-white text-center py-1.5 text-[10px] font-black uppercase tracking-[0.2em] z-[60] fixed top-0 w-full shadow-sm">
        <Link to="/disclaimer" className="animate-blink hover:underline flex items-center justify-center gap-2">
          <ShieldAlert size={10} />
          Important: Read our disclaimer before proceeding
        </Link>
      </div>
      <nav className="fixed top-7 w-full z-50 px-4 md:px-8">
        <div className="max-w-7xl mx-auto glass rounded-3xl shadow-[0_8px_32px_0_rgba(15,23,42,0.08)] flex justify-between items-center px-6 py-3">
          <Link to="/" className="text-2xl font-black text-accent-blue font-headline tracking-tighter flex items-center gap-2">
            <div className="w-8 h-8 bg-accent-blue rounded-xl flex items-center justify-center text-white rotate-12">
              <ShieldCheck size={20} />
            </div>
            <span>MS STAR</span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-10 font-headline font-bold text-slate-500 text-sm tracking-tight">
            <Link to="/" className="hover:text-accent-blue transition-colors">Home</Link>
            <Link to="/document-printing" className="hover:text-accent-blue transition-colors">Printing</Link>
            <Link to="/pvc-cards" className="hover:text-accent-blue transition-colors">PVC Cards</Link>
            <Link to="/photos" className="hover:text-accent-blue transition-colors">Photos</Link>
            <Link to="/track-order" className="hover:text-accent-blue transition-colors flex items-center gap-1.5">
              <Search size={14} />
              Track
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button className="lg:hidden p-2 text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className="hidden lg:flex items-center gap-4">
              {user?.email === 'shankarboss3@gmail.com' && (
                <Link to="/admin" className="flex items-center gap-1.5 text-slate-600 hover:text-accent-blue font-bold text-sm">
                  <Settings size={16} />
                  Admin
                </Link>
              )}
              {user ? (
                <Link to="/dashboard" className="flex items-center gap-2 bg-slate-100 text-slate-900 px-4 py-2 rounded-2xl hover:bg-slate-200 transition-all font-bold text-sm">
                  Account
                </Link>
              ) : (
                <Link to="/login" className="text-slate-600 hover:text-accent-blue font-bold text-sm">Login</Link>
              )}
              <button 
                onClick={() => setIsCartOpen(true)}
                className="bg-accent-blue text-white p-2.5 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center relative"
                aria-label="Cart"
              >
                <ShoppingBasket size={20} />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent-amber text-ink w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-2 glass rounded-3xl p-6 shadow-xl space-y-4 font-bold text-slate-700">
            <Link to="/" className="block hover:text-accent-blue" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/document-printing" className="block hover:text-accent-blue" onClick={() => setIsMenuOpen(false)}>Printing</Link>
            <Link to="/pvc-cards" className="block hover:text-accent-blue" onClick={() => setIsMenuOpen(false)}>PVC Cards</Link>
            <Link to="/photos" className="block hover:text-accent-blue" onClick={() => setIsMenuOpen(false)}>Photos</Link>
            <Link to="/track-order" className="block hover:text-accent-blue" onClick={() => setIsMenuOpen(false)}>Track Order</Link>
            <hr className="border-slate-200" />
            {user?.email === 'shankarboss3@gmail.com' && (
              <Link to="/admin" className="flex items-center gap-2 hover:text-accent-blue" onClick={() => setIsMenuOpen(false)}>
                <Settings size={18} />
                Admin Panel
              </Link>
            )}
            {user ? (
              <Link to="/dashboard" className="block hover:text-accent-blue" onClick={() => setIsMenuOpen(false)}>Account</Link>
            ) : (
              <Link to="/login" className="block hover:text-accent-blue" onClick={() => setIsMenuOpen(false)}>Login</Link>
            )}
            <button 
              className="block text-accent-blue font-black w-full text-left" 
              onClick={() => {
                setIsMenuOpen(false);
                setIsCartOpen(true);
              }}
            >
              Checkout ({cart.length})
            </button>
          </div>
        )}
      </nav>

      <main className="pt-32 flex-grow">
        {children}
      </main>

      <footer className="bg-ink text-white py-20 mt-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-2xl font-black font-headline tracking-tighter">
              <div className="w-8 h-8 bg-accent-blue rounded-xl flex items-center justify-center text-white rotate-12">
                <ShieldCheck size={20} />
              </div>
              <span>MS STAR</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed font-medium">
              Premium printing services for documents, PVC cards, and photos. 
              Quality you can feel, speed you can trust. Located in Gunjur, Bangalore.
            </p>
            <div className="flex gap-4">
              <a href="https://wa.me/919901526231" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent-blue transition-colors text-white">
                <MessageCircle size={18} />
              </a>
              <a href="tel:+919148868257" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent-blue transition-colors text-white">
                <Phone size={18} />
              </a>
              <a href="mailto:msgunjur@gmail.com" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent-blue transition-colors text-white">
                <Mail size={18} />
              </a>
            </div>
          </div>
          
          <div className="space-y-6">
            <h4 className="font-black text-sm uppercase tracking-widest text-accent-amber">Company</h4>
            <ul className="space-y-3 text-slate-400 text-sm font-bold">
              <li><Link to="/about-us" className="hover:text-white transition-colors flex items-center gap-2"><ChevronRight size={14} className="text-accent-blue"/> About Us</Link></li>
              <li><Link to="/contact-us" className="hover:text-white transition-colors flex items-center gap-2"><ChevronRight size={14} className="text-accent-blue"/> Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors flex items-center gap-2"><ChevronRight size={14} className="text-accent-blue"/> FAQ</Link></li>
              <li><Link to="/track-order" className="hover:text-white transition-colors flex items-center gap-2"><ChevronRight size={14} className="text-accent-blue"/> Track Order</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-black text-sm uppercase tracking-widest text-accent-amber">Legal</h4>
            <ul className="space-y-3 text-slate-400 text-sm font-bold">
              <li><Link to="/privacy-policy" className="hover:text-white transition-colors flex items-center gap-2"><ChevronRight size={14} className="text-accent-blue"/> Privacy Policy</Link></li>
              <li><Link to="/terms-conditions" className="hover:text-white transition-colors flex items-center gap-2"><ChevronRight size={14} className="text-accent-blue"/> Terms & Conditions</Link></li>
              <li><Link to="/refund-cancellation" className="hover:text-white transition-colors flex items-center gap-2"><ChevronRight size={14} className="text-accent-blue"/> Refund & Cancellation</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-white transition-colors flex items-center gap-2"><ChevronRight size={14} className="text-accent-blue"/> Shipping Policy</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-black text-sm uppercase tracking-widest text-accent-amber">Contact</h4>
            <ul className="space-y-4 text-slate-400 text-sm font-bold">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-accent-blue shrink-0 mt-0.5" />
                <span>M S Star Xerox and Stationery<br/>Gunjur, Bangalore, Karnataka</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-accent-blue shrink-0" />
                <span>+91 9148868257<br/>+91 9901526231</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-accent-blue shrink-0" />
                <span>msgunjur@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-12 mt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-xs font-bold">
          <div className="flex items-center gap-3">
            <p>© 2026 MS STAR PRINTING. ALL RIGHTS RESERVED.</p>
            <Link to="/admin" className="text-white/10 hover:text-white/40 transition-colors" title="Admin Login">
              <Lock size={12} />
            </Link>
          </div>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">PRIVACY</Link>
            <Link to="/terms-conditions" className="hover:text-white transition-colors">TERMS</Link>
            <Link to="/disclaimer" className="hover:text-white transition-colors">DISCLAIMER</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("[Auth] State changed:", currentUser?.uid || "Logged out");
      setUser(currentUser);
      // Note: Anonymous auth is disabled by default in Firebase. 
      // To enable: Go to Firebase Console > Authentication > Sign-in method > Add new provider > Anonymous
    });
    return () => unsubscribe();
  }, []);

  return (
    <CartProvider>
      <BrowserRouter>
        <Layout user={user}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/document-printing" element={<DocumentPrintingPage />} />
            <Route path="/pvc-cards" element={<PVCCardsPage />} />
            <Route path="/photos" element={<PhotosPage />} />
            <Route path="/track-order" element={<TrackOrderPage />} />
            <Route path="/about-us" element={<AboutUsPage />} />
            <Route path="/contact-us" element={<ContactUsPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-conditions" element={<TermsConditionsPage />} />
            <Route path="/refund-cancellation" element={<RefundCancellationPage />} />
            <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/product/:id" element={<ProductDetailsPage />} />
            <Route path="/rate-calculator" element={<RateCalculatorPage />} />
            <Route path="/sitemap" element={<SitemapPage />} />
            <Route path="/payment-terms" element={<PaymentTermsPage />} />
            <Route path="/work-with-us" element={<WorkWithUsPage />} />
            <Route path="/quality-terms" element={<QualityTermsPage />} />
            <Route path="/disclaimer" element={<DisclaimerPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/dashboard" element={<UserDashboardPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </CartProvider>
  );
}
