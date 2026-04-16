import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Printer, ShoppingCart, Truck, Phone, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const faqCategories = [
  {
    title: "General Services & Product Info",
    icon: <Printer size={20} />,
    items: [
      {
        q: "What types of PVC cards do you offer?",
        a: (
          <div className="space-y-2">
            <p>At <strong>M S STAR XEROX</strong>, we provide high-quality printing for a variety of needs:</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Driving License & PAN Card PVC Prints</li>
              <li>RC Book Smart Cards</li>
              <li>Health IDs (Ayushman / Digital Health Cards)</li>
              <li>Ration Card PVC Reprints</li>
              <li>School & Employee ID Cards</li>
              <li>Custom Business Cards & NFC/RFID Smart Cards</li>
              <li><strong>Self-Service Printing:</strong> You can upload any document or design to our portal, and we will print it to your exact specifications.</li>
            </ul>
          </div>
        )
      },
      {
        q: "What is a PVC card?",
        a: "It is a durable, water-resistant plastic card made from polyvinyl chloride. It is the ideal professional format for carrying important documents like your PAN or Aadhaar in a compact, \"credit card\" style that fits easily in any wallet."
      },
      {
        q: "What are the technical specifications?",
        a: (
          <div className="space-y-2">
            <p>We follow the international standard <strong>CR80</strong> size:</p>
            <ul className="list-disc ml-5 space-y-1">
              <li><strong>Dimensions:</strong> 85.6 mm x 54 mm</li>
              <li><strong>Thickness:</strong> 760 microns (Standard) or 1100 microns (Premium/Heavy Duty)</li>
              <li><strong>Hardware:</strong> We use industrial-grade <strong>Canon</strong> and <strong>Epson</strong> printers to ensure high-DPI clarity and color accuracy.</li>
            </ul>
          </div>
        )
      }
    ]
  },
  {
    title: "Ordering & Customization",
    icon: <ShoppingCart size={20} />,
    items: [
      {
        q: "How do I place an order on msstar.in?",
        a: (
          <ol className="list-decimal ml-5 space-y-2">
            <li>Navigate to our <strong>Shop</strong> or specific product page.</li>
            <li>Upload your front and back images (JPEG, PNG, or PDF).</li>
            <li><em>Note:</em> If your document is a single page, upload it to the "Front" section and our team will handle the alignment.</li>
            <li>Enter any necessary details (such as a PDF password for protected files).</li>
            <li>Add to cart and complete your payment via our secure gateway.</li>
          </ol>
        )
      },
      {
        q: "Can I print government ID cards?",
        a: "Yes. Printing an existing government document onto PVC for personal convenience is a common service we provide. Important: We strictly print the files provided by you. We do not edit, modify, or tamper with government-issued data, and we do not offer document editing services."
      },
      {
        q: "Can I place bulk or corporate orders?",
        a: (
          <div className="space-y-2">
            <p>Absolutely. We specialize in bulk fulfillment for:</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Schools, Colleges, and Hospitals</li>
              <li>Corporates and Startups in Bangalore</li>
              <li>Government Departments and NGOs</li>
            </ul>
            <p>Contact us directly for a custom bulk-pricing quote.</p>
          </div>
        )
      }
    ]
  },
  {
    title: "Shipping & Tracking",
    icon: <Truck size={20} />,
    items: [
      {
        q: "What is the delivery timeline?",
        a: (
          <div className="space-y-2">
            <p>We aim for a total turnaround of <strong>8 to 10 business days</strong>:</p>
            <ul className="list-disc ml-5 space-y-1">
              <li><strong>Processing:</strong> 1 to 2 days for high-quality printing and verification.</li>
              <li><strong>Transit:</strong> 5 to 8 days depending on your location.</li>
              <li><strong>Partners:</strong> We ship via Registered Post, Speed Post, and DTDC.</li>
            </ul>
          </div>
        )
      },
      {
        q: "How do I track my order?",
        a: (
          <div className="space-y-2">
            <p>Once dispatched, we will send the following to your registered <strong>WhatsApp</strong> or email:</p>
            <ol className="list-decimal ml-5 space-y-1">
              <li>A photo of your finished, printed card.</li>
              <li>The courier tracking number and a direct link to track the shipment.</li>
            </ol>
          </div>
        )
      }
    ]
  },
  {
    title: "Support & Contact",
    icon: <Phone size={20} />,
    items: [
      {
        q: "What is your return policy?",
        a: "Because each card is custom-printed with your specific data, we cannot accept returns or cancellations once the printing process has begun. Please double-check your uploaded files for clarity before finalizing the order."
      },
      {
        q: "How can I reach M S STAR XEROX?",
        a: (
          <div className="space-y-2">
            <p>We are located in Gunjur, Bangalore, and are ready to help:</p>
            <ul className="list-disc ml-5 space-y-1">
              <li><strong>WhatsApp/Phone:</strong> 9148868257 / 9901526231</li>
              <li><strong>Website:</strong> msstar.in</li>
              <li><strong>Business Hours:</strong> Visit us at our Gunjur hub for immediate assistance with document services, lamination, or stationery needs.</li>
            </ul>
          </div>
        )
      }
    ]
  }
];

interface FaqItemProps {
  key?: React.Key;
  q: string;
  a: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

function FaqItem({ q, a, isOpen, onToggle }: FaqItemProps) {
  return (
    <div className={`border rounded-2xl bg-white overflow-hidden transition-all duration-300 ${isOpen ? 'border-accent-blue shadow-lg shadow-blue-50' : 'border-slate-100 shadow-sm hover:shadow-md'}`}>
      <button
        onClick={onToggle}
        className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-none"
      >
        <span className={`font-black text-lg transition-colors duration-300 ${isOpen ? 'text-accent-blue' : 'text-ink'}`}>{q}</span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${isOpen ? 'bg-accent-blue text-white rotate-180' : 'bg-slate-50 text-slate-400'}`}>
          <ChevronDown size={18} />
        </div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div className="px-6 pb-6 text-slate-600 font-medium leading-relaxed border-t border-slate-50 mt-2 pt-4">
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {a}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaqPage() {
  const [activeId, setActiveId] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="relative bg-ink py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent-blue via-ink to-ink"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest border border-white/10 backdrop-blur-md text-accent-blue">
            <HelpCircle size={14} />
            <span>Help Center</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-black text-white font-headline tracking-tighter">
            Frequently Asked Questions
          </h1>
          <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
            Welcome to the <strong>M S STAR XEROX</strong> help center. Below are common questions regarding our PVC card printing, custom stationery, and document services. We update this page regularly to ensure you have the most accurate information for your orders in Gunjur and beyond.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-6 -mt-12 relative z-20 pb-24">
        <div className="bg-white rounded-[3rem] p-8 lg:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-12">
          
          {faqCategories.map((category, catIdx) => (
            <div key={catIdx} className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 bg-accent-blue/10 text-accent-blue rounded-xl flex items-center justify-center">
                  {category.icon}
                </div>
                <h2 className="text-2xl font-black text-ink">{category.title}</h2>
              </div>
              
              <div className="space-y-4">
                {category.items.map((item, itemIdx) => {
                  const id = `${catIdx}-${itemIdx}`;
                  return (
                    <FaqItem 
                      key={itemIdx} 
                      q={item.q} 
                      a={item.a} 
                      isOpen={activeId === id}
                      onToggle={() => toggleFaq(id)}
                    />
                  );
                })}
              </div>
            </div>
          ))}

          {/* Contact CTA */}
          <div className="mt-12 bg-slate-50 rounded-[2rem] p-8 text-center border border-slate-100 space-y-4">
            <div className="w-16 h-16 bg-accent-blue/10 text-accent-blue rounded-2xl flex items-center justify-center mx-auto mb-2">
              <MessageCircle size={32} />
            </div>
            <h3 className="text-2xl font-black text-ink">Still have questions?</h3>
            <p className="text-slate-500 font-medium max-w-md mx-auto">
              Can't find the answer you're looking for? Please chat to our friendly team.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="https://wa.me/919901526231" target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-[#128C7E] transition-colors shadow-lg shadow-green-200 w-full sm:w-auto justify-center">
                <MessageCircle size={20} />
                Chat on WhatsApp
              </a>
              <a href="tel:+919148868257" className="bg-white text-ink border-2 border-slate-200 px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:border-accent-blue hover:text-accent-blue transition-colors w-full sm:w-auto justify-center">
                <Phone size={20} />
                Call Us
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
