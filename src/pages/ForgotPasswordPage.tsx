import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Mail, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent! Check your inbox.');
    } catch (err: any) {
      console.error("Password reset error:", err);
      if (err.code === 'auth/user-not-found') {
        setError('No user found with this email address.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError('Failed to send password reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl shadow-blue-100/50 border border-slate-100 overflow-hidden">
        <div className="p-8 md:p-12">
          
          <Link to="/login" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors mb-8">
            <ArrowLeft size={16} />
            Back to Login
          </Link>

          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-accent-blue text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200 rotate-3">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-3xl font-extrabold text-ink font-headline">Reset Password</h1>
            <p className="text-slate-500 mt-2 font-medium">Enter your email to receive a reset link</p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-accent-blue outline-none transition-all font-medium text-ink"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold border border-red-100">
                {error}
              </div>
            )}

            {message && (
              <div className="bg-green-50 text-green-600 p-4 rounded-2xl text-sm font-bold border border-green-100">
                {message}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-accent-blue text-white py-4 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {loading ? 'Sending...' : (
                <>
                  Send Reset Link
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
