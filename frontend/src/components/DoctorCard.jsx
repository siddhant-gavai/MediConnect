import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Star, MapPin, Building2, Clock, IndianRupee, ArrowRight, Heart } from 'lucide-react';
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

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const handleBooking = (doctorId) => {
    if (isLoggedIn) {
      navigate(`/book/${doctorId}`);
    } else {
      navigate('/signin', { state: { from: { pathname: `/book/${doctorId}` } } });
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
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
          <div className="relative">
            <div className="h-16 w-16 rounded-full bg-[#1565C0] flex items-center justify-center text-white font-black text-xl shadow-inner shrink-0">
              {getInitials(doctor.name)}
            </div>
            <button 
              onClick={toggleSave}
              className={`absolute -bottom-1 -right-1 p-1.5 rounded-full border-2 transition-all shadow-sm ${
                isSaved ? 'bg-red-50 border-red-100 text-red-500' : 'bg-white border-slate-100 text-slate-300 hover:text-red-400'
              }`}
            >
              <Heart size={14} className={isSaved ? 'fill-current' : ''} />
            </button>
          </div>
          <div className="flex flex-col items-end gap-2">
            {doctor.available ? (
              <span className="px-2.5 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-green-100 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-green-600 animate-pulse" />
                Available Today
              </span>
            ) : (
              <span className="px-2.5 py-1 bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-slate-100">
                Next: {doctor.slot}
              </span>
            )}
            <span className="px-2.5 py-1 bg-blue-50 text-[#1565C0] text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100">
              {doctor.speciality}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-black text-slate-900 leading-tight">
              {doctor.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              {renderStars(doctor.rating)}
              <span className="text-xs font-bold text-slate-400">
                ({doctor.reviews} reviews)
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-600">
              <Building2 size={16} className="text-slate-400" />
              <span className="text-sm font-bold truncate">{doctor.hospital}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <MapPin size={16} className="text-slate-400" />
              <span className="text-sm font-bold">{doctor.location}, India</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <div className="px-3 py-1.5 bg-slate-50 rounded-lg flex items-center gap-1.5 border border-slate-100">
              <Clock size={14} className="text-slate-400" />
              <span className="text-[11px] font-black text-slate-600 uppercase tracking-tight">
                {doctor.exp} Years Exp
              </span>
            </div>
            <div className="px-3 py-1.5 bg-slate-50 rounded-lg flex items-center gap-1.5 border border-slate-100">
              <IndianRupee size={14} className="text-slate-400" />
              <span className="text-[11px] font-black text-slate-600 uppercase tracking-tight">
                ₹{doctor.fee}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section: Actions */}
      <div className="p-5 pt-0 mt-auto space-y-3">
        <button
          onClick={() => handleBooking(doctor.id)}
          className="w-full bg-[#1565C0] text-white py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:bg-blue-800 transition shadow-lg shadow-blue-100"
        >
          {buttonText}
          <ArrowRight size={16} />
        </button>
        <Link
          to={`/doctor/${doctor.id}`}
          className="w-full text-center block text-sm font-black text-[#1565C0] hover:text-blue-800 transition uppercase tracking-widest py-1"
        >
          View Profile
        </Link>
      </div>
    </motion.div>
  );
};

export default DoctorCard;
