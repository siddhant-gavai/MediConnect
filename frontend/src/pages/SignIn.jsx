import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Check, Stethoscope, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isShaking, setIsShaking] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.title = "Sign In | MediConnect";
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';
    
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Minimum 6 characters';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('mediconnect_users') || '[]');
      const userMatch = users.find(u => u.email === email && u.password === password);

      if (userMatch) {
        const initials = userMatch.name.split(' ').map(n => n[0]).join('').toUpperCase();
        login({ 
          name: userMatch.name, 
          email: userMatch.email, 
          phone: userMatch.phone, 
          avatar: initials 
        });
        
        showToast(`Welcome back, ${userMatch.name}! 👋`, 'success');
        
        const destination = location.state?.from?.pathname || '/';
        navigate(destination, { replace: true });
      } else {
        setLoading(false);
        setIsShaking(true);
        showToast('Invalid email or password. Please try again.', 'error');
        setTimeout(() => setIsShaking(false), 500);
      }
    }, 800);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex overflow-hidden">
      
      {/* Left Panel - Hidden on Mobile */}
      <div className="hidden lg:flex w-[40%] bg-[#1565C0] relative p-12 flex-col justify-between overflow-hidden">
        {/* Floating Circles */}
        <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] rounded-full bg-white/5" />
        <div className="absolute bottom-[-50px] right-[-50px] w-[200px] h-[200px] rounded-full bg-white/10" />
        <div className="absolute top-[20%] right-[-30px] w-[80px] h-[80px] rounded-full bg-white/5" />

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 text-white mb-12">
            <Stethoscope size={32} />
            <span className="text-2xl font-black uppercase tracking-tight">MediConnect</span>
          </Link>
          
          <h2 className="text-4xl font-black text-white leading-tight mb-8">
            Your health, <br />our priority
          </h2>

          <div className="space-y-6">
            {[
              "15,000+ Verified Doctors",
              "Instant Appointment Booking",
              "Secure Health Records"
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-4 text-white/90">
                <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center">
                  <Check size={14} className="text-white" />
                </div>
                <span className="text-sm font-bold uppercase tracking-widest">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-white/50 text-xs font-bold uppercase tracking-widest">
          © 2026 MediConnect India • All Rights Reserved
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 bg-white flex items-center justify-center p-8 sm:p-12">
        <motion.div 
          animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[440px] space-y-8"
        >
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Welcome Back 👋</h1>
            <p className="text-slate-500 font-bold mt-2">Sign in to book appointments</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1565C0] transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="email"
                  className={`w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-2 outline-none font-bold text-sm transition-all ${errors.email ? 'border-red-100 focus:border-red-500 bg-red-50' : 'border-transparent focus:border-[#1565C0]'}`}
                  placeholder="john@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              {errors.email && <p className="text-[10px] font-bold text-red-500 ml-1">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1565C0] transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"}
                  className={`w-full pl-12 pr-12 py-4 bg-slate-50 rounded-2xl border-2 outline-none font-bold text-sm transition-all ${errors.password ? 'border-red-100 focus:border-red-500 bg-red-50' : 'border-transparent focus:border-[#1565C0]'}`}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-[10px] font-bold text-red-500 ml-1">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${rememberMe ? 'bg-[#1565C0] border-[#1565C0]' : 'border-slate-200 group-hover:border-slate-300'}`}>
                  {rememberMe && <Check size={14} className="text-white" />}
                </div>
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                />
                <span className="text-xs font-bold text-slate-600">Remember me</span>
              </label>
              <Link to="/forgot-password" size="sm" className="text-xs font-black text-[#1565C0] uppercase tracking-widest hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-2xl bg-[#1565C0] text-white font-black uppercase tracking-widest text-sm shadow-xl shadow-blue-100 hover:bg-blue-800 transition active:scale-95 flex items-center justify-center gap-3 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </button>

            <div className="relative flex items-center justify-center py-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <span className="relative px-4 bg-white text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">or</span>
            </div>

            <button 
              type="button"
              onClick={() => showToast('Google login coming soon!', 'info')}
              className="w-full py-4 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-50 transition active:scale-95"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-xs font-black text-slate-600 uppercase tracking-widest">Continue with Google</span>
            </button>

            <div className="text-center pt-4">
              <p className="text-xs font-bold text-slate-400">
                Don't have an account? {' '}
                <Link to="/register" className="text-[#1565C0] font-black uppercase tracking-widest hover:underline">
                  Register &rarr;
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default SignIn;
