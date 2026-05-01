import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Star, MapPin, Building2, Clock, IndianRupee, ArrowRight, Heart, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const DoctorCard = ({ doctor, buttonText = "Book Appointment" }) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { showToast } = useToast();
  
  const [isSaved, setIsSaved] = React.useState(() => {
    const saved = JSON.parse(localStorage.getItem('saved_doctors') || '[]');
    return saved.includes(doctor.id);
  });

  // Toggles the saved state of a doctor in local storage
  const toggleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const saved = JSON.parse(localStorage.getItem('saved_doctors') || '[]');
    let updated;
    if (isSaved) {
      updated = saved.filter(id => id !== doctor.id);
      showToast('Removed from saved doctors', 'info');
    } else {
      updated = [...saved, doctor.id];
      showToast('Saved to your favorites!', 'success');
    }
    localStorage.setItem('saved_doctors', JSON.stringify(updated));
    setIsSaved(!isSaved);
  };

  // Helper to get initials from a doctor's name
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  // Handles navigation to the booking page, prompting login if necessary
  const handleBooking = (doctorId) => {
    if (isLoggedIn) {
      navigate(`/book/${doctorId}`);
    } else {
      navigate('/signin', { state: { from: { pathname: `/book/${doctorId}` } } });
    }
  };

  const renderStars = (rating = 0) => {
    return (
      <div className="flex items-center gap-0.5" aria-label={`Rating: ${rating} out of 5 stars`} title={`${rating} out of 5 stars`}>
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            className={`${
              i < Math.floor(rating)
                ? 'fill-amber-400 text-amber-400'
                : 'fill-slate-200 text-slate-200'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <motion.div
      whileHover={{ translateY: -4 }}
      className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full"
    >
      <div className="p-5 flex-1 flex flex-col space-y-4">
        {/* Top Section: Avatar & Badges */}
        <div className="flex justify-between items-start">
          <div className="relative group/avatar">
            <div title={doctor.name} className="h-16 w-16 rounded-full bg-gradient-to-br from-[#1565C0] to-[#0288D1] flex items-center justify-center text-white font-black text-xl shadow-lg shrink-0 group-hover/avatar:scale-105 transition-transform duration-300">
              {getInitials(doctor.name)}
            </div>
            {doctor.available && (
              <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-md">
                <div className="h-3.5 w-3.5 bg-[#10B981] rounded-full ring-2 ring-white animate-pulse" />
              </div>
            )}
          </div>
          
          <div className="flex flex-col items-end gap-3">
            {doctor.available && (
              <span className="px-3 py-1 bg-[#10B981]/10 text-[#10B981] text-[8px] font-black uppercase tracking-[0.15em] rounded-lg border border-[#10B981]/20 flex items-center gap-1.5 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                Available Today
              </span>
            )}
            <button 
              onClick={toggleSave}
              aria-label={isSaved ? "Remove from saved doctors" : "Save doctor"}
              className={`p-2.5 rounded-2xl transition-all active:scale-90 border shadow-sm ${
                isSaved 
                  ? 'bg-red-50 border-red-100 text-red-500' 
                  : 'bg-white border-slate-100 text-slate-300 hover:text-red-500 hover:border-red-100 hover:bg-red-50'
              }`}
            >
              <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} strokeWidth={isSaved ? 0 : 2.5} />
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-[#1565C0] transition-colors">
                {doctor.name}
              </h3>
              <CheckCircle2 size={18} className="text-[#1565C0] fill-blue-50" />
            </div>
            <div className="flex items-center gap-2">
              {renderStars(doctor.rating)}
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {doctor.reviews || 0} Reviews
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-slate-500">
              <div className="p-1.5 bg-slate-50 rounded-lg">
                <Building2 size={14} className="text-slate-400" />
              </div>
              <span className="text-xs font-bold truncate">{doctor.hospital}</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-500">
              <div className="p-1.5 bg-slate-50 rounded-lg">
                <MapPin size={14} className="text-slate-400" />
              </div>
              <span className="text-xs font-bold">{doctor.location}, India</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <div className="px-4 py-2 bg-blue-50 rounded-xl flex items-center gap-2 border border-blue-100">
              <Clock size={12} className="text-[#1565C0]" />
              <span className="text-[9px] font-black text-[#1565C0] uppercase tracking-widest">
                {doctor.exp} Yrs Exp
              </span>
            </div>
            <div className="px-4 py-2 bg-pink-50 rounded-xl flex items-center gap-2 border border-pink-100">
              <IndianRupee size={12} className="text-pink-600" />
              <span className="text-[9px] font-black text-pink-600 uppercase tracking-widest">
                ₹{doctor.fee}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-4 space-y-3">
          <button
            onClick={() => navigate(`/book/${doctor.id}`)}
            className="w-full bg-[#1565C0] text-white py-4 rounded-2xl font-black uppercase tracking-[0.1em] flex items-center justify-center gap-2 hover:bg-blue-800 transition shadow-xl shadow-blue-100 group-hover:shadow-blue-200"
          >
            {buttonText}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <Link
            to={`/doctor/${doctor.id}`}
            className="w-full py-4 rounded-2xl border-2 border-slate-50 text-slate-400 text-center font-black uppercase tracking-[0.1em] hover:bg-slate-50 hover:text-slate-600 transition block text-xs"
          >
            View Profile
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default DoctorCard;
