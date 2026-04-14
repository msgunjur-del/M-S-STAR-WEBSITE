import React from 'react';
import { Check, Cpu, Printer, Layers, Shield } from 'lucide-react';

export default function QualityTermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Hero Section */}
      <section 
        className="relative h-[400px] flex items-center justify-center text-center text-white px-6"
        style={{
          background: `linear-gradient(rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.9)), url('https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&q=80&w=1000')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-4xl space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold font-headline tracking-widest uppercase">
            Quality Terms & Standards
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-medium">
            Precision in Every Pixel. Excellence in Every Print.
          </p>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="max-w-5xl mx-auto px-6 -mt-20 relative z-10">
        <div className="bg-white rounded-[2rem] shadow-2xl p-8 md:p-12 border border-slate-100">
          <div className="inline-block bg-slate-100 px-4 py-1 rounded-full text-xs font-bold text-slate-600 mb-8">
            Last Updated: April 12, 2026
          </div>
          
          <p className="text-lg text-slate-700 leading-relaxed mb-12">
            At <strong className="text-slate-900">MS Star Xerox and Stationery</strong>, quality is our signature. 
            We utilize state-of-the-art printing technology and premium materials to ensure that every product we 
            deliver—from government IDs to industrial prints—meets the highest professional benchmarks.
          </p>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border border-slate-100 hover:border-amber-500 transition-all duration-300 group">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3 mb-3">
                <Check className="text-amber-600" size={20} />
                Material Standards
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                We use CR80 standard high-density PVC for smart cards and 75-100 GSM high-whiteness paper for 
                documents to ensure durability and a premium feel.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-100 hover:border-amber-500 transition-all duration-300 group">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3 mb-3">
                <Check className="text-amber-600" size={20} />
                Color Accuracy
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Using CMYK calibrated workflows, we aim for a 95% color match. Please note that digital screens 
                (RGB) may show slight variations from physical ink.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-100 hover:border-amber-500 transition-all duration-300 group">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3 mb-3">
                <Check className="text-amber-600" size={20} />
                Print Resolution
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                We recommend 300 DPI for all uploads. Our systems automatically flag low-res files to prevent 
                pixelation before we hit print.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-100 hover:border-amber-500 transition-all duration-300 group">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3 mb-3">
                <Check className="text-amber-600" size={20} />
                Final Inspection
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Every order undergoes a manual 3-point check: Alignment, Color Consistency, and Surface Integrity.
              </p>
            </div>
          </div>

          {/* Tech Stack Section */}
          <div className="mt-12 bg-slate-50 rounded-3xl p-8 border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <Cpu className="text-blue-600" size={24} />
              Our Technology Stack
            </h2>
            <p className="text-slate-600 mb-6">To maintain these standards, we invest in industry-leading hardware:</p>
            <ul className="space-y-4">
              <li className="flex gap-4 items-start">
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  <Printer className="text-blue-600" size={18} />
                </div>
                <div>
                  <strong className="text-slate-900 block">Industrial Printing</strong>
                  <span className="text-sm text-slate-500">Powered by Canon iR series for precision documentation.</span>
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  <Layers className="text-blue-600" size={18} />
                </div>
                <div>
                  <strong className="text-slate-900 block">Photo & ID Excellence</strong>
                  <span className="text-sm text-slate-500">Epson High-Definition 6-color ink systems for vibrant, true-to-life portraits.</span>
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  <Shield className="text-blue-600" size={18} />
                </div>
                <div>
                  <strong className="text-slate-900 block">Lamination</strong>
                  <span className="text-sm text-slate-500">Heavy-duty thermal bonding to prevent peeling or fading over time.</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Footer Note */}
          <div className="mt-12 text-center text-slate-500 text-sm border-t border-slate-100 pt-8">
            Questions about our process? Contact our Quality Assurance team at <strong className="text-slate-900">msgunjur@gmail.com</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
