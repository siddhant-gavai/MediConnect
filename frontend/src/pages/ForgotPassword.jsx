import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F8FAFC] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[32px] shadow-2xl border border-slate-100 p-10 text-center"
      >
        {!submitted ? (
          <>
            <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 text-[#1565C0]">
              <Mail size={32} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Forgot Password?</h1>
            <p className="text-slate-500 font-bold mb-8">Enter your email and we'll send reset instructions</p>

            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1565C0] transition-colors">
                    <Mail size={18} />
                  </div>
                  <input 
                    type="email"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[#1565C0] outline-none font-bold text-sm transition-all"
                    placeholder="john@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-2xl bg-[#1565C0] text-white font-black uppercase tracking-widest text-sm shadow-xl shadow-blue-100 hover:bg-blue-800 transition active:scale-95 flex items-center justify-center gap-3 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Send Reset Link <Send size={18} /></>
                )}
              </button>

              <Link to="/signin" className="flex items-center justify-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-[#1565C0] transition">
                <ArrowLeft size={16} /> Back to Sign In
              </Link>
            </form>
          </>
        ) : (
          <div className="space-y-6">
            <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-green-500">
              <CheckCircle size={40} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Email Sent!</h2>
              <p className="text-slate-500 font-bold mt-2">If <span className="text-[#1565C0]">{email}</span> is registered, you'll receive a reset link shortly.</p>
            </div>
            <Link to="/signin" className="block w-full py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 text-slate-600 font-black uppercase tracking-widest text-xs hover:bg-slate-100 transition">
              Return to Sign In
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
