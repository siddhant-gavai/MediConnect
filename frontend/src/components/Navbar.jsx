import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Stethoscope, User, Calendar, LayoutDashboard, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const checkBookings = () => {
      const bookings = JSON.parse(localStorage.getItem('mediconnect_bookings') || '[]');
      const count = bookings.filter(b => b.status === 'upcoming').length;
      setUpcomingCount(count);
    };

    checkBookings();
    window.addEventListener('storage', checkBookings);
    return () => window.removeEventListener('storage', checkBookings);
  }, [location.pathname]);

  // Click outside listener for dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    showToast('Signed out successfully', 'success');
    navigate('/');
  };

  const scrollToSection = (id) => {
    if (location.pathname !== '/') {
      navigate('/#' + id);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-[#1565C0] rounded-xl group-hover:rotate-12 transition-transform duration-300">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-black text-slate-900 uppercase tracking-tighter">MediConnect</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-10">
            <Link to="/doctors" className="text-xs font-black text-slate-500 uppercase tracking-widest hover:text-[#1565C0] transition-colors">Find Doctors</Link>
            <button onClick={() => scrollToSection('specialities')} className="text-xs font-black text-slate-500 uppercase tracking-widest hover:text-[#1565C0] transition-colors">Specialities</button>
            <button onClick={() => scrollToSection('how-it-works')} className="text-xs font-black text-slate-500 uppercase tracking-widest hover:text-[#1565C0] transition-colors">How it Works</button>
            
            <Link to="/my-bookings" className="text-xs font-black text-slate-500 uppercase tracking-widest hover:text-[#1565C0] transition-colors flex items-center gap-1.5 relative">
              My Bookings
              {upcomingCount > 0 && (
                <span className="h-2 w-2 rounded-full bg-[#1565C0] animate-pulse shadow-sm shadow-blue-200" />
              )}
            </Link>
          </div>

          <div className="flex items-center gap-6">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-3 p-1.5 pr-4 rounded-full bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-all active:scale-95"
                >
                  <div className="h-9 w-9 rounded-full bg-[#1565C0] flex items-center justify-center text-white text-xs font-black shadow-lg shadow-blue-100">
                    {user.avatar}
                  </div>
                  <span className="hidden sm:block text-xs font-black text-slate-700 uppercase tracking-tight">{user.name.split(' ')[0]}</span>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-2xl border border-slate-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 py-2">
                    <div className="px-6 py-4 border-b border-slate-50 mb-2">
                      <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{user.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 truncate">{user.email}</p>
                    </div>

                    <Link 
                      to="/my-bookings" 
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-3 px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hover:bg-slate-50 hover:text-[#1565C0] transition"
                    >
                      <Calendar size={16} /> My Bookings
                    </Link>
                    <Link 
                      to="/patient/dashboard" 
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-3 px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hover:bg-slate-50 hover:text-[#1565C0] transition"
                    >
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>
                    <Link 
                      to="/profile" 
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-3 px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hover:bg-slate-50 hover:text-[#1565C0] transition"
                    >
                      <Settings size={16} /> Profile Settings
                    </Link>

                    <div className="h-px bg-slate-50 my-2" />

                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-6 py-4 text-[10px] font-black text-red-500 uppercase tracking-[0.2em] hover:bg-red-50 transition"
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/signin" className="hidden sm:block text-xs font-black text-[#1565C0] uppercase tracking-widest hover:text-blue-800 transition">Sign In</Link>
                <Link to="/register" className="bg-[#1565C0] text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-800 transition shadow-xl shadow-blue-100 active:scale-95">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
