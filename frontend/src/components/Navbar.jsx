import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation, NavLink } from 'react-router-dom';
import { 
  Stethoscope, User, Calendar, LayoutDashboard, Settings, 
  LogOut, ChevronDown, Menu, X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Find Doctors', path: '/doctors' },
    { name: 'Specialities', onClick: () => scrollToSection('specialities') },
    { name: 'How it Works', onClick: () => scrollToSection('how-it-works') },
    { name: 'My Bookings', path: '/my-bookings', badge: true },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-lg border-b border-slate-100 py-3' : 'bg-white/50 backdrop-blur-sm py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          <Link to="/" title="Go to Home" className="flex items-center gap-2 group">
            <div className="p-2 bg-[#1565C0] rounded-xl relative overflow-hidden">
              <Stethoscope className="h-6 w-6 text-white animate-pulse-subtle" />
            </div>
            <span className="text-xl font-black text-slate-900 uppercase tracking-tighter">MediConnect</span>
          </Link>
          
          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              link.path ? (
                <NavLink 
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) => 
                    `text-xs font-black uppercase tracking-widest transition-all hover:text-[#1565C0] ${
                      isActive ? 'nav-link-active' : 'text-slate-500'
                    } flex items-center gap-1.5`
                  }
                >
                  {link.name}
                  {link.badge && upcomingCount > 0 && (
                    <span className="h-2 w-2 rounded-full bg-[#1565C0] animate-pulse shadow-sm shadow-blue-200" />
                  )}
                </NavLink>
              ) : (
                <button 
                  key={link.name}
                  onClick={link.onClick}
                  className="text-xs font-black text-slate-500 uppercase tracking-widest hover:text-[#1565C0] transition-colors"
                >
                  {link.name}
                </button>
              )
            ))}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-3 p-1 rounded-full bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-all active:scale-95"
                >
                  <div className="h-9 w-9 rounded-full bg-[#1565C0] flex items-center justify-center text-white text-xs font-black shadow-lg shadow-blue-100">
                    {user.avatar}
                  </div>
                  <span className="hidden sm:block text-xs font-black text-slate-700 uppercase tracking-tight ml-1">{user.name.split(' ')[0]}</span>
                  <ChevronDown size={14} className={`text-slate-400 mr-2 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-2xl border border-slate-50 overflow-hidden py-2"
                    >
                      <div className="px-6 py-4 border-b border-slate-50 mb-2 text-center sm:text-left">
                        <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{user.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 truncate">{user.email}</p>
                      </div>

                      <Link to="/my-bookings" onClick={() => setShowDropdown(false)} className="flex items-center gap-3 px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hover:bg-slate-50 hover:text-[#1565C0] transition">
                        <Calendar size={16} /> My Bookings
                      </Link>
                      <Link to="/dashboard" onClick={() => setShowDropdown(false)} className="flex items-center gap-3 px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hover:bg-slate-50 hover:text-[#1565C0] transition">
                        <LayoutDashboard size={16} /> Dashboard
                      </Link>
                      <Link to="/dashboard" onClick={() => setShowDropdown(false)} className="flex items-center gap-3 px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hover:bg-slate-50 hover:text-[#1565C0] transition">
                        <Settings size={16} /> Settings
                      </Link>

                      <div className="h-px bg-slate-50 my-2" />

                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-6 py-4 text-[10px] font-black text-red-500 uppercase tracking-[0.2em] hover:bg-red-50 transition">
                        <LogOut size={16} /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-4">
                <Link to="/signin" className="text-xs font-black text-[#1565C0] uppercase tracking-widest hover:text-blue-800 transition">Sign In</Link>
                <Link to="/register" className="bg-[#1565C0] text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-800 transition shadow-xl shadow-blue-100 active:scale-95">Get Started</Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-t border-slate-50 overflow-hidden"
          >
            <div className="px-4 py-8 space-y-6">
              {navLinks.map((link) => (
                link.path ? (
                  <NavLink 
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) => 
                      `block text-sm font-black uppercase tracking-widest ${
                        isActive ? 'text-[#1565C0]' : 'text-slate-500'
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                ) : (
                  <button 
                    key={link.name}
                    onClick={link.onClick}
                    className="block w-full text-left text-sm font-black text-slate-500 uppercase tracking-widest"
                  >
                    {link.name}
                  </button>
                )
              ))}
              {!user && (
                <div className="pt-6 border-t border-slate-50 flex flex-col gap-4">
                  <Link to="/signin" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-4 text-center text-sm font-black text-[#1565C0] border-2 border-[#1565C0] rounded-2xl">Sign In</Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-4 text-center text-sm font-black text-white bg-[#1565C0] rounded-2xl">Get Started</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
