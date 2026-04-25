import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, Eye, EyeOff, Check, Stethoscope, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    terms: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: 'None', color: 'bg-slate-100' });

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Create Account | MediConnect";
  }, []);

  useEffect(() => {
    const pass = formData.password;
    if (!pass) setPasswordStrength({ score: 0, label: 'None', color: 'bg-slate-100' });
    else if (pass.length < 6) setPasswordStrength({ score: 33, label: 'Weak', color: 'bg-red-500' });
    else if (pass.length < 10 || !/[0-9]/.test(pass)) setPasswordStrength({ score: 66, label: 'Medium', color: 'bg-amber-500' });
    else setPasswordStrength({ score: 100, label: 'Strong', color: 'bg-green-500' });
  }, [formData.password]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Full Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    
    if (!formData.phone) newErrors.phone = 'Phone Number is required';
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Enter valid 10-digit number';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Minimum 6 characters';
    
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.terms) newErrors.terms = 'You must agree to terms';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('mediconnect_users') || '[]');
      const emailExists = users.some(u => u.email === formData.email);

      if (emailExists) {
        setLoading(false);
        showToast('This email is already registered. Sign In instead.', 'warning');
        return;
      }

      const newUser = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem('mediconnect_users', JSON.stringify(users));
      
      const initials = newUser.name.split(' ').map(n => n[0]).join('').toUpperCase();
      login({ 
        name: newUser.name, 
        email: newUser.email, 
        phone: newUser.phone, 
        avatar: initials 
      });

      showToast('Account created successfully! Welcome 🎉', 'success');
      navigate('/');
    }, 1000);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex overflow-hidden">
      
      {/* Left Panel */}
      <div className="hidden lg:flex w-[40%] bg-[#1565C0] relative p-12 flex-col justify-between overflow-hidden">
        <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] rounded-full bg-white/5" />
        <div className="absolute bottom-[-50px] right-[-50px] w-[200px] h-[200px] rounded-full bg-white/10" />

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 text-white mb-12">
            <Stethoscope size={32} />
            <span className="text-2xl font-black uppercase tracking-tight">MediConnect</span>
          </Link>
          
          <h2 className="text-4xl font-black text-white leading-tight mb-8">
            Join <br />MediConnect Today
          </h2>

          <div className="space-y-6">
            {[
              "Personalized Health Experience",
              "Direct Access to Specialists",
              "Manage Bookings Anywhere"
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
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 bg-white flex items-center justify-center p-8 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-[480px] py-10 space-y-8">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Create Account</h1>
            <p className="text-slate-500 font-bold mt-2">Join 50k+ patients on MediConnect</p>
          </div>

          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2 space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1565C0] transition-colors">
                  <User size={18} />
                </div>
                <input 
                  type="text"
                  className={`w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-2 outline-none font-bold text-sm transition-all ${errors.name ? 'border-red-100 focus:border-red-500 bg-red-50' : 'border-transparent focus:border-[#1565C0]'}`}
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              {errors.name && <p className="text-[10px] font-bold text-red-500 ml-1">{errors.name}</p>}
            </div>

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
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
              {errors.email && <p className="text-[10px] font-bold text-red-500 ml-1">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1565C0] transition-colors">
                  <Phone size={18} />
                </div>
                <input 
                  type="tel"
                  maxLength="10"
                  className={`w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-2 outline-none font-bold text-sm transition-all ${errors.phone ? 'border-red-100 focus:border-red-500 bg-red-50' : 'border-transparent focus:border-[#1565C0]'}`}
                  placeholder="10-digit number"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})}
                />
              </div>
              {errors.phone && <p className="text-[10px] font-bold text-red-500 ml-1">{errors.phone}</p>}
            </div>

            <div className="sm:col-span-2 space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1565C0] transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"}
                  className={`w-full pl-12 pr-12 py-4 bg-slate-50 rounded-2xl border-2 outline-none font-bold text-sm transition-all ${errors.password ? 'border-red-100 focus:border-red-500 bg-red-50' : 'border-transparent focus:border-[#1565C0]'}`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {/* Strength Meter */}
              <div className="px-1 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Strength: {passwordStrength.label}</span>
                </div>
                <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${passwordStrength.score}%` }}
                    className={`h-full ${passwordStrength.color} transition-colors`}
                  />
                </div>
              </div>
              {errors.password && <p className="text-[10px] font-bold text-red-500 ml-1">{errors.password}</p>}
            </div>

            <div className="sm:col-span-2 space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
              <input 
                type="password"
                className={`w-full px-4 py-4 bg-slate-50 rounded-2xl border-2 outline-none font-bold text-sm transition-all ${errors.confirmPassword ? 'border-red-100 focus:border-red-500 bg-red-50' : 'border-transparent focus:border-[#1565C0]'}`}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
              />
              {errors.confirmPassword && <p className="text-[10px] font-bold text-red-500 ml-1">{errors.confirmPassword}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${formData.terms ? 'bg-[#1565C0] border-[#1565C0]' : 'border-slate-200 group-hover:border-slate-300'}`}>
                  {formData.terms && <Check size={14} className="text-white" />}
                </div>
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={formData.terms}
                  onChange={e => setFormData({...formData, terms: e.target.checked})}
                />
                <span className="text-xs font-bold text-slate-500">
                  I agree to <Link className="text-[#1565C0] underline">Terms & Conditions</Link> and <Link className="text-[#1565C0] underline">Privacy Policy</Link>
                </span>
              </label>
              {errors.terms && <p className="text-[10px] font-bold text-red-500 mt-2 ml-1">{errors.terms}</p>}
            </div>

            <button 
              type="submit"
              disabled={loading}
              className={`sm:col-span-2 w-full py-4 rounded-2xl bg-[#1565C0] text-white font-black uppercase tracking-widest text-sm shadow-xl shadow-blue-100 hover:bg-blue-800 transition active:scale-95 flex items-center justify-center gap-3 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Create Account <ArrowRight size={18} /></>
              )}
            </button>

            <div className="sm:col-span-2 text-center pt-2">
              <p className="text-xs font-bold text-slate-400">
                Already have an account? {' '}
                <Link to="/signin" className="text-[#1565C0] font-black uppercase tracking-widest hover:underline">
                  Sign In &rarr;
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
