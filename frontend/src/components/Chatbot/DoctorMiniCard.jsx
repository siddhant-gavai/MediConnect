import React from 'react';
import { Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DoctorMiniCard = ({ doctor }) => {
  const navigate = useNavigate();

  // Get doctor initials for avatar fallback
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-3 mb-2">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#1565C0] flex items-center justify-center text-white text-xs font-black shadow-inner">
          {getInitials(doctor.name)}
        </div>
        <div>
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">{doctor.name}</h4>
          <div className="flex items-center gap-1 mt-0.5">
            <Star size={10} className="fill-amber-400 text-amber-400" />
            <span className="text-[10px] font-black text-slate-700">{doctor.rating}</span>
          </div>
        </div>
      </div>
      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate">
        {doctor.hospital}
      </div>
      <button
        onClick={() => navigate(`/book/${doctor.id}`)}
        className="w-full bg-white border border-[#1565C0] text-[#1565C0] py-2 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1 hover:bg-blue-50 transition"
      >
        Book Now <ArrowRight size={12} />
      </button>
    </div>
  );
};

export default DoctorMiniCard;
