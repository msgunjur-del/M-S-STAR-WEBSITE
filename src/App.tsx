/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useCart } from './context/CartContext';
import { 
  ShieldCheck, ShieldAlert, ShoppingBasket, Search, 
  Menu, X, ChevronRight, Phone, Mail, MapPin,
  Clock, Zap, ArrowRight, ShoppingBag, Settings, Lock, MessageCircle, Monitor
} from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
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
import NotFoundPage from './pages/NotFoundPage';
import KioskPage from './pages/KioskPage';
import SecurityBadgeSection from './components/SecurityBadgeSection';
import SlideOutCart from './components/SlideOutCart';
import ThemeToggle from './components/ThemeToggle';
import ScrollToTopButton from './components/ScrollToTopButton';

function Layout({ children, user }: { children: React.ReactNode, user: any }) {
  const { cart, setIsCartOpen } = useCart();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [adminEmail, setAdminEmail] = React.useState('shankarboss3@gmail.com');

  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settingsSnap = await getDoc(doc(db, 'settings', 'global'));
        if (settingsSnap.exists() && settingsSnap.data().adminEmail) {
          setAdminEmail(settingsSnap.data().adminEmail);
        }
      } catch (error) {
        console.error("Error fetching admin email:", error);
      }
    };
    fetchSettings();
  }, []);
  
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-paper font-body text-ink antialiased flex flex-col transition-colors duration-300">
      <ThemeToggle />
      <SlideOutCart />
      <ScrollToTopButton />
      {/* TopNavBar */}
      <div className="bg-red-600 text-white text-center py-1.5 text-[10px] font-black uppercase tracking-[0.2em] z-[60] fixed top-0 w-full shadow-sm">
        <Link to="/disclaimer" className="animate-blink hover:underline flex items-center justify-center gap-2">
          <ShieldAlert size={10} />
          Important: Read our disclaimer before proceeding
        </Link>
      </div>
      <nav className={`fixed left-0 right-0 z-50 px-4 md:px-8 transition-all duration-300 ${isScrolled ? 'top-0 py-2' : 'top-7 py-0'}`}>
        <div className={`max-w-7xl mx-auto bg-card border border-slate-300 rounded-3xl shadow-xl flex justify-between items-center px-6 transition-all duration-300 dark:bg-slate-900 dark:border-slate-800 ${isScrolled ? 'py-2.5' : 'py-3'}`}>
          <Link to="/" className="text-2xl font-black text-ink font-headline tracking-tighter flex items-center gap-2 dark:text-white">
            <div className="w-8 h-8 bg-accent-blue rounded-xl flex items-center justify-center text-white rotate-12">
              <ShieldCheck size={20} />
            </div>
            <span>M S STAR XEROX</span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8 font-headline font-bold text-slate-700 text-sm tracking-tight dark:text-slate-300">
            <Link to="/" className="hover:text-accent-blue transition-colors dark:hover:text-white">Home</Link>
            <Link to="/document-printing" className="hover:text-accent-blue transition-colors dark:hover:text-white">Printing</Link>
            <Link to="/pvc-cards" className="hover:text-accent-blue transition-colors dark:hover:text-white">PVC Cards</Link>
            <Link to="/photos" className="hover:text-accent-blue transition-colors dark:hover:text-white">Photos</Link>
            <Link to="/kiosk" className="hover:text-accent-blue transition-colors dark:hover:text-white flex items-center gap-1.5"><Monitor size={14} className="text-accent-blue"/> Kiosk</Link>
            
            {/* Search Bar */}
            <div className="relative group">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-ink transition-colors dark:group-focus-within:text-white" />
              <input 
                type="text" 
                placeholder="Search services..." 
                className="bg-slate-100 text-ink placeholder-slate-400 border-none rounded-xl pl-10 pr-4 py-2 text-xs focus:ring-2 focus:ring-accent-blue/50 w-40 focus:w-60 transition-all outline-none dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2.5 bg-slate-100 text-ink rounded-xl border border-slate-200 hover:bg-slate-200 transition-all focus:ring-2 focus:ring-accent-blue/50 outline-none flex items-center justify-center shadow-sm dark:bg-slate-800 dark:text-white dark:border-slate-700" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <div className="hidden lg:flex items-center gap-4">
              {user?.email === adminEmail && (
                <Link to="/admin" className="flex items-center gap-1.5 text-slate-500 hover:text-ink font-bold text-sm dark:text-slate-300 dark:hover:text-white">
                  <Settings size={16} />
                  Admin
                </Link>
              )}
              {user ? (
                <Link to="/dashboard" className="flex items-center gap-2 bg-slate-100 text-ink px-4 py-2 rounded-2xl hover:bg-slate-200 transition-all font-bold text-sm dark:bg-slate-800 dark:text-white">
                  Account
                </Link>
              ) : (
                <Link to="/login" className="text-slate-500 hover:text-ink font-bold text-sm dark:text-slate-300 dark:hover:text-white">Login</Link>
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
          <div className="lg:hidden mt-2 bg-card border border-slate-200 rounded-3xl p-6 shadow-xl space-y-4 font-bold text-slate-500 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300">
            <Link to="/" className="block hover:text-ink dark:hover:text-white" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/document-printing" className="block hover:text-ink dark:hover:text-white" onClick={() => setIsMenuOpen(false)}>Printing</Link>
            <Link to="/pvc-cards" className="block hover:text-ink dark:hover:text-white" onClick={() => setIsMenuOpen(false)}>PVC Cards</Link>
            <Link to="/photos" className="block hover:text-ink dark:hover:text-white" onClick={() => setIsMenuOpen(false)}>Photos</Link>
            <Link to="/kiosk" className="block hover:text-ink dark:hover:text-white" onClick={() => setIsMenuOpen(false)}>Kiosk</Link>
            <Link to="/track-order" className="block hover:text-ink dark:hover:text-white" onClick={() => setIsMenuOpen(false)}>Track Order</Link>
            <hr className="border-slate-200 dark:border-slate-800" />
            {user?.email === adminEmail && (
              <Link to="/admin" className="flex items-center gap-2 hover:text-ink dark:hover:text-white" onClick={() => setIsMenuOpen(false)}>
                <Settings size={18} />
                Admin Panel
              </Link>
            )}
            {user ? (
              <Link to="/dashboard" className="block hover:text-ink dark:hover:text-white" onClick={() => setIsMenuOpen(false)}>Account</Link>
            ) : (
              <Link to="/login" className="block hover:text-ink dark:hover:text-white" onClick={() => setIsMenuOpen(false)}>Login</Link>
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

      <footer className="bg-[#2563EB] text-white py-20 mt-20 border-t border-blue-400 dark:bg-[#1E40AF]">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-2xl font-black font-headline tracking-tighter">
              <div className="w-8 h-8 bg-white text-[#2563EB] rounded-xl flex items-center justify-center rotate-12">
                <ShieldCheck size={20} />
              </div>
              <span className="text-white">M S STAR XEROX</span>
            </div>
            <p className="text-blue-100 text-sm leading-relaxed font-bold">
              Premium printing services for documents, PVC cards, and photos. 
              Quality you can feel, speed you can trust. Located in Gunjur, Bangalore.
            </p>
            <div className="flex gap-4">
              <Link to="/kiosk" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-blue-600 transition-colors" title="MS STAR Kiosk App">
                <Monitor size={18} />
              </Link>
              <a href="https://wa.me/919901526231" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-blue-600 transition-colors">
                <MessageCircle size={18} />
              </a>
              <a href="tel:+919148868257" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-blue-600 transition-colors">
                <Phone size={18} />
              </a>
              <a href="mailto:msgunjur@gmail.com" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-blue-600 transition-colors">
                <Mail size={18} />
              </a>
            </div>
          </div>
          
          <div className="space-y-6">
            <h4 className="font-black text-sm uppercase tracking-widest text-blue-200">Company</h4>
            <ul className="space-y-3 text-white text-sm font-black">
              <li><Link to="/about-us" className="hover:text-blue-200 transition-colors flex items-center gap-2"><ChevronRight size={14}/> About Us</Link></li>
              <li><Link to="/contact-us" className="hover:text-blue-200 transition-colors flex items-center gap-2"><ChevronRight size={14}/> Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-blue-200 transition-colors flex items-center gap-2"><ChevronRight size={14}/> FAQ</Link></li>
              <li><Link to="/track-order" className="hover:text-blue-200 transition-colors flex items-center gap-2"><ChevronRight size={14}/> Track Order</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-black text-sm uppercase tracking-widest text-blue-200">Legal</h4>
            <ul className="space-y-3 text-white text-sm font-black">
              <li><Link to="/privacy-policy" className="hover:text-blue-200 transition-colors flex items-center gap-2"><ChevronRight size={14}/> Privacy Policy</Link></li>
              <li><Link to="/terms-conditions" className="hover:text-blue-200 transition-colors flex items-center gap-2"><ChevronRight size={14}/> Terms & Conditions</Link></li>
              <li><Link to="/refund-cancellation" className="hover:text-blue-200 transition-colors flex items-center gap-2"><ChevronRight size={14}/> Refund/Cancellation Policy</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-blue-200 transition-colors flex items-center gap-2"><ChevronRight size={14}/> Shipping Policy</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-black text-sm uppercase tracking-widest text-blue-200">Contact</h4>
            <ul className="space-y-4 text-white text-sm font-black">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-blue-200 shrink-0 mt-0.5" />
                <span>M S STAR XEROX<br/>no 247 gunjur bangalore 560087</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-blue-200 shrink-0" />
                <span>+91 9148868257<br/>+91 9901526231</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-blue-200 shrink-0" />
                <span>msgunjur@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-12 mt-12 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-6 text-blue-200 text-xs font-bold">
          <div className="flex items-center gap-3">
            <p>© 2026 M S STAR XEROX. ALL RIGHTS RESERVED.</p>
            <Link to="/admin" className="text-white/20 hover:text-white/50 transition-colors" title="Admin Login">
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
      
      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/919901526231" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-[100] bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center group"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={28} />
        <span className="absolute right-full mr-4 bg-white text-ink px-4 py-2 rounded-xl text-xs font-black shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-100">
          Need Help? Chat with us!
        </span>
      </a>
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
            <Route path="/kiosk" element={<KioskPage />} />
            <Route path="/dashboard" element={<UserDashboardPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </CartProvider>
  );
}
