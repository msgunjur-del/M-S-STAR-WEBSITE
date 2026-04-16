import React from 'react';
import { Briefcase, Mail, Users, Zap, Star, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

export default function WorkWithUsPage() {
  const benefits = [
    { title: 'Growth Mindset', desc: 'We encourage learning and provide opportunities to master the latest printing technologies.', icon: <Zap size={20} /> },
    { title: 'Dynamic Team', desc: 'Work with a passionate group of individuals dedicated to customer satisfaction.', icon: <Users size={20} /> },
    { title: 'Impactful Work', desc: 'Help thousands of people get their essential documents printed with precision.', icon: <Star size={20} /> }
  ];

  const openings = [
    { title: 'Print Operations Specialist', type: 'Full-time', location: 'Gunjur, Bangalore' },
    { title: 'Graphic Designer', type: 'Part-time / Freelance', location: 'Remote / Hybrid' },
    { title: 'Customer Support Executive', type: 'Full-time', location: 'Gunjur, Bangalore' }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="relative bg-ink py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent-blue via-ink to-ink"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest border border-white/10 backdrop-blur-md text-accent-blue">
            <Briefcase size={14} />
            <span>Careers</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-black text-white font-headline tracking-tighter">
            Join the M S STAR XEROX Team
          </h1>
          <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
            Help us redefine the printing industry. We're looking for passionate people to join our mission in Bangalore.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-12 relative z-20 pb-24 space-y-12">
        {/* Benefits Section */}
        <div className="bg-white rounded-[3rem] p-8 lg:p-16 shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="space-y-4">
                <div className="w-12 h-12 bg-accent-blue/10 text-accent-blue rounded-2xl flex items-center justify-center">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-black text-ink">{benefit.title}</h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Openings Section */}
        <div className="space-y-8">
          <h2 className="text-3xl font-black text-ink font-headline tracking-tight text-center">Current Openings</h2>
          <div className="grid gap-4">
            {openings.map((job, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ x: 10 }}
                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group"
              >
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-ink group-hover:text-accent-blue transition-colors">{job.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-400 font-bold">
                    <span className="flex items-center gap-1"><Briefcase size={14} /> {job.type}</span>
                    <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                  </div>
                </div>
                <a 
                  href={`mailto:msgunjur@gmail.com?subject=Application for ${job.title}`}
                  className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-slate-800 transition-colors"
                >
                  Apply Now
                </a>
              </motion.div>
            ))}
          </div>
        </div>

        {/* General Inquiry */}
        <div className="bg-accent-blue rounded-[3rem] p-12 text-center text-white space-y-6 relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <h2 className="text-3xl font-black font-headline tracking-tight">Don't see a perfect fit?</h2>
            <p className="text-blue-100 font-medium max-w-xl mx-auto">
              We're always on the lookout for great talent. Send your resume and a brief intro to our email, and we'll keep you in mind for future roles.
            </p>
            <div className="pt-4">
              <a 
                href="mailto:msgunjur@gmail.com" 
                className="inline-flex items-center gap-2 bg-white text-accent-blue px-8 py-4 rounded-2xl font-black hover:bg-blue-50 transition-all shadow-xl shadow-blue-900/20"
              >
                <Mail size={20} />
                msgunjur@gmail.com
              </a>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
        </div>
      </div>
    </div>
  );
}
