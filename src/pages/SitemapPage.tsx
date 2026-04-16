import React from 'react';
import { Link } from 'react-router-dom';
import { Map, ChevronRight, ExternalLink } from 'lucide-react';

export default function SitemapPage() {
  const links = [
    {
      title: "Main Pages",
      items: [
        { name: "Home", path: "/" },
        { name: "Document Printing", path: "/document-printing" },
        { name: "PVC Cards", path: "/pvc-cards" },
        { name: "Photos", path: "/photos" },
        { name: "Track Order", path: "/track-order" },
        { name: "Rate Calculator", path: "/rate-calculator" },
      ]
    },
    {
      title: "Company",
      items: [
        { name: "About Us", path: "/about-us" },
        { name: "Contact Us", path: "/contact-us" },
        { name: "FAQ", path: "/faq" },
        { name: "Work With Us", path: "/work-with-us" },
        { name: "Sitemap", path: "/sitemap" },
      ]
    },
    {
      title: "Legal & Policies",
      items: [
        { name: "Privacy Policy", path: "/privacy-policy" },
        { name: "Terms & Conditions", path: "/terms-conditions" },
        { name: "Refund & Cancellation", path: "/refund-cancellation" },
        { name: "Shipping Policy", path: "/shipping-policy" },
        { name: "Payment Terms", path: "/payment-terms" },
        { name: "Quality Terms", path: "/quality-terms" },
        { name: "Disclaimer", path: "/disclaimer" },
      ]
    },
    {
      title: "Account",
      items: [
        { name: "User Dashboard", path: "/dashboard" },
        { name: "Login", path: "/login" },
        { name: "Sign Up", path: "/signup" },
        { name: "Forgot Password", path: "/forgot-password" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-20">
      <div className="max-w-5xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest border border-blue-100">
            <Map size={12} />
            <span>Navigation Hub</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-black font-headline tracking-tighter text-ink">
            SITE <span className="text-blue-600">MAP.</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
            A complete directory of all pages and services available on M S STAR XEROX.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {links.map((group, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
              <h2 className="text-xl font-black text-ink border-b border-slate-50 pb-4">{group.title}</h2>
              <ul className="space-y-3">
                {group.items.map((item, itemIdx) => (
                  <li key={itemIdx}>
                    <Link 
                      to={item.path} 
                      className="flex items-center justify-between text-slate-500 hover:text-blue-600 font-bold transition-colors group"
                    >
                      <span className="flex items-center gap-2">
                        <ChevronRight size={14} className="text-blue-400 group-hover:translate-x-1 transition-transform" />
                        {item.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="bg-ink text-white p-12 rounded-[3rem] text-center space-y-6 relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <h3 className="text-2xl font-black">Can't find what you're looking for?</h3>
            <p className="text-slate-400 font-medium">Our support team is available 24/7 to assist you with any queries.</p>
            <div className="pt-4">
              <Link to="/contact-us" className="inline-flex items-center gap-2 bg-accent-blue text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-700 transition-all">
                Contact Support
                <ExternalLink size={18} />
              </Link>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/10 blur-[80px] rounded-full" />
        </div>
      </div>
    </div>
  );
}
