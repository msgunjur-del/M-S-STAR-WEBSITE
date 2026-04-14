import React from 'react';
import { ShieldAlert, Info, UserX, Truck, Scale, Phone, Mail, Globe, MapPin, Printer } from 'lucide-react';

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-red-900 via-slate-900 to-red-900 py-24 px-6 text-center text-white">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/30 px-4 py-2 rounded-full text-red-300 text-sm font-medium backdrop-blur-sm">
            <ShieldAlert size={16} />
            Important Legal Notice
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold font-headline tracking-tight">Disclaimer</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Please read this legal disclaimer carefully before using msstar.in or our professional services.
          </p>
          <div className="text-slate-400 text-sm">Last updated: April 12, 2026</div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 -mt-12">
        <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-slate-100 space-y-12">
          <p className="text-slate-600 leading-relaxed text-lg italic border-l-4 border-red-500 pl-6">
            This Disclaimer applies to the use of www.msstar.in, operated by MS Star Xerox and Stationery, 
            having its registered and operational office at No 213/214, 1a, Near Gokul Circle, Gunjur, 
            Bangalore 560087, Karnataka, India. By accessing this website, you acknowledge that you have 
            read, understood, and agreed to this Disclaimer.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <section className="space-y-4 p-6 rounded-3xl bg-slate-50 border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                <UserX className="text-red-600" size={24} />
                1. No Government Affiliation
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                MS Star Xerox and Stationery is a private professional document services hub. We are not affiliated, 
                associated, authorized, endorsed, or connected with any government authority. We do not issue, 
                generate, or approve any government-issued documents. All printed products are created solely 
                based on customer-submitted content as a printing service only.
              </p>
            </section>

            <section className="space-y-4 p-6 rounded-3xl bg-slate-50 border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                <Info className="text-blue-600" size={24} />
                2. Printing Service & Privacy
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                <strong>Privacy & Data Deletion:</strong> To protect customer privacy, our system automatically 
                deletes uploaded files immediately following the completion of the print job. 
                <strong> No Verification:</strong> We do not verify the authenticity or legality of documents, 
                nor do we check government databases to confirm validity.
              </p>
            </section>

            <section className="space-y-4 p-6 rounded-3xl bg-slate-50 border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                <Scale className="text-blue-600" size={24} />
                3. Customer Responsibility
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                The customer is solely responsible for the content of files uploaded and the legality of the 
                purpose for which the printed materials are used. MS Star Xerox and Stationery shall not be 
                liable for any legal consequences arising from misuse or misrepresentation.
              </p>
            </section>

            <section className="space-y-4 p-6 rounded-3xl bg-slate-50 border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                <Printer className="text-blue-600" size={24} />
                4. Accuracy & Technical Variations
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Printed output may not exactly match screen previews due to differences in device displays 
                or material finishes. Minor variations in color, alignment, or finish are considered 
                industry standard and not defects.
              </p>
            </section>

            <section className="space-y-4 p-6 rounded-3xl bg-slate-50 border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                <Truck className="text-blue-600" size={24} />
                5. Courier & Delivery Disclaimer
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Once an order is dispatched via our third-party courier partners, we are not responsible 
                for delivery delays, incorrect status updates, or loss/theft during transit. Our responsibility 
                is limited to dispatching the order with valid tracking details.
              </p>
            </section>

            <section className="space-y-4 p-6 rounded-3xl bg-slate-50 border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                <ShieldAlert className="text-red-600" size={24} />
                6. Limitation of Liability
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Under no circumstances shall MS Star Xerox and Stationery be liable for indirect, incidental, 
                or legal consequences arising from the customer's use of printed materials. Our maximum 
                liability is limited strictly to the amount paid for the specific order.
              </p>
            </section>
          </div>

          <div className="bg-red-50 p-8 rounded-[2rem] border border-red-100 space-y-4">
            <h2 className="text-2xl font-bold text-red-900">7. Abuse and Harassment</h2>
            <p className="text-red-800 leading-relaxed">
              We maintain a zero-tolerance policy for abusive or threatening communication directed toward 
              our staff. We reserve the right to refuse service and initiate legal action under applicable 
              Indian laws if necessary.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">8. Governing Law</h2>
            <p className="text-slate-600 leading-relaxed">
              This Disclaimer shall be governed by and interpreted in accordance with the laws of India. 
              Any disputes shall be subject to the exclusive jurisdiction of the competent courts of 
              Bangalore, Karnataka, India only.
            </p>
          </div>

          <div className="pt-12 border-t border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">9. Contact Information</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                <Globe className="text-blue-600" size={20} />
                <span className="text-slate-700 font-medium">www.msstar.in</span>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                <MapPin className="text-blue-600" size={20} />
                <span className="text-slate-700 font-medium text-sm">No 213/214, 1a, Gunjur, Bangalore</span>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                <Phone className="text-blue-600" size={20} />
                <span className="text-slate-700 font-medium">+91 9901526231</span>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                <Mail className="text-blue-600" size={20} />
                <span className="text-slate-700 font-medium">msgunjur@gmail.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
