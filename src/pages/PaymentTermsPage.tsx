import React from 'react';
import { CreditCard, ShieldCheck, Clock, FileText, ChevronRight } from 'lucide-react';

export default function PaymentTermsPage() {
  const sections = [
    {
      title: "Accepted Payment Methods",
      icon: <CreditCard className="text-accent-blue" />,
      content: "We accept a wide range of secure payment methods to provide convenience to our customers:",
      items: [
        "UPI (Google Pay, PhonePe, Paytm, etc.)",
        "Credit and Debit Cards (Visa, Mastercard, RuPay)",
        "Net Banking from all major Indian banks",
        "Mobile Wallets"
      ]
    },
    {
      title: "Advance Payment Requirement",
      icon: <Clock className="text-accent-amber" />,
      content: "Due to the custom nature of our printing services (PVC cards, photos, and documents), 100% advance payment is required at the time of order placement. Production will only commence once the payment has been successfully verified."
    },
    {
      title: "Transaction Security",
      icon: <ShieldCheck className="text-green-500" />,
      content: "All payments are processed through encrypted, industry-standard payment gateways. M S STAR XEROX does not store your credit card or bank account details on our servers. Your financial information is handled directly by our secure payment partners."
    },
    {
      title: "Billing & Invoices",
      icon: <FileText className="text-purple-500" />,
      content: "A digital invoice will be generated and sent to your registered email address immediately after a successful transaction. You can also download your past invoices from your User Dashboard."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-20">
      <div className="max-w-4xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest border border-blue-100">
            <CreditCard size={12} />
            <span>Financial Policy</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-black font-headline tracking-tighter text-ink">
            PAYMENT <span className="text-blue-600">TERMS.</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
            Clear, secure, and transparent payment guidelines for all our professional printing services.
          </p>
        </div>

        <div className="space-y-6">
          {sections.map((section, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                  {section.icon}
                </div>
                <h2 className="text-2xl font-black text-ink">{section.title}</h2>
              </div>
              <p className="text-slate-600 font-medium leading-relaxed">
                {section.content}
              </p>
              {section.items && (
                <ul className="grid sm:grid-cols-2 gap-3 pt-2">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                      <ChevronRight size={14} className="text-accent-blue" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="bg-slate-100 p-8 rounded-[2.5rem] text-center">
          <p className="text-sm text-slate-500 font-bold">
            Last updated: April 12, 2026. For any payment related queries, please contact us at <span className="text-ink">msgunjur@gmail.com</span>
          </p>
        </div>
      </div>
    </div>
  );
}
