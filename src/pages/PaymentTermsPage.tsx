import React from 'react';

export default function PaymentTermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold font-headline text-slate-900">Payment Terms</h1>
        <p className="text-slate-500">Last updated: 4/12/2026</p>
      </div>

      <p className="text-slate-600 leading-relaxed">
        To ensure a smooth and secure transaction process for our professional printing services, 
        we have established the following payment terms.
      </p>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">1. Accepted Payment Methods</h2>
        <p className="text-slate-600 leading-relaxed">
          We accept a wide range of secure payment methods to provide convenience to our customers:
        </p>
        <ul className="space-y-3 text-slate-600 ml-4">
          <li className="flex gap-2"><span>•</span> UPI (Google Pay, PhonePe, Paytm, etc.)</li>
          <li className="flex gap-2"><span>•</span> Credit and Debit Cards (Visa, Mastercard, RuPay)</li>
          <li className="flex gap-2"><span>•</span> Net Banking from all major Indian banks</li>
          <li className="flex gap-2"><span>•</span> Mobile Wallets</li>
        </ul>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">2. Advance Payment Requirement</h2>
        <p className="text-slate-600 leading-relaxed">
          Due to the custom nature of our printing services (PVC cards, photos, and documents), 
          <strong> 100% advance payment</strong> is required at the time of order placement. 
          Production will only commence once the payment has been successfully verified.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">3. Transaction Security</h2>
        <p className="text-slate-600 leading-relaxed">
          All payments are processed through encrypted, industry-standard payment gateways. 
          MS Star does not store your credit card or bank account details on our servers. 
          Your financial information is handled directly by our secure payment partners.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">4. Billing & Invoices</h2>
        <p className="text-slate-600 leading-relaxed">
          A digital invoice will be generated and sent to your registered email address immediately 
          after a successful transaction. You can also download your past invoices from your 
          User Dashboard.
        </p>
      </section>
    </div>
  );
}
