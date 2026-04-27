import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Star, MapPin, Building2, Clock, IndianRupee, 
  ArrowLeft, CheckCircle2, Calendar, GraduationCap, 
  Stethoscope, Info, Phone, Mail, Award, Share2 
} from 'lucide-react';
import doctorsData from '../data/doctors';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import DoctorCard from '../components/DoctorCard';

const DoctorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { showToast } = useToast();
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    const foundDoctor = doctorsData.find(d => d.id === parseInt(id));
    if (foundDoctor) {
      setDoctor(foundDoctor);
    } else {
      navigate('/doctors');
    }
    window.scrollTo(0, 0);
  }, [id, navigate]);

  const handleShare = () => {
    const text = `Check out Dr. ${doctor.name} on MediConnect!`;
    if (navigator.share) {
      navigator.share({ title: 'MediConnect Doctor Profile', text, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast("Profile link copied to clipboard!", "success");
    }
  };

  if (!doctor) return null;

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20">
      {/* 1. PREMIUM HEADER */}
      <div className="bg-gradient-to-br from-[#1565C0] to-[#0288D1] pt-32 pb-48">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-10">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative"
            >
              <div className="h-48 w-48 rounded-[48px] bg-white p-3 shadow-2xl relative z-10">
                <div className="h-full w-full rounded-[40px] bg-[#1565C0] flex items-center justify-center text-white text-6xl font-black shadow-inner">
                  {doctor.name[0]}
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-[#10B981] p-3 rounded-2xl shadow-xl border-4 border-white animate-pulse">
                <CheckCircle2 className="text-white" size={24} />
              </div>
            </motion.div>
            
            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">{doctor.name}</h1>
                <div className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-xl border border-white/30">
                  <p className="text-xs font-black text-white uppercase tracking-widest">{doctor.speciality}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-8">
                <div className="flex items-center gap-2 text-white/90">
                  <Star className="text-amber-400 fill-amber-400" size={20} />
                  <span className="text-lg font-black">{doctor.rating}</span>
                  <span className="text-xs font-bold text-white/60">({doctor.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <MapPin className="text-white/60" size={20} />
                  <span className="text-lg font-black">{doctor.location}, India</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={handleShare}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-4 rounded-2xl border border-white/20 transition active:scale-95"
              >
                <Share2 size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24">
        <div className="grid lg:grid-cols-3 gap-10">
          
          <div className="lg:col-span-2 space-y-10">
            {/* About Section */}
            <div className="bg-white p-10 rounded-[48px] shadow-xl border border-slate-50 space-y-6">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                About Dr. {doctor.name.split(' ')[1]}
                <div className="h-1.5 w-1.5 rounded-full bg-[#1565C0]" />
              </h2>
              <p className="text-slate-500 font-bold leading-relaxed">
                Dr. {doctor.name} is a highly accomplished {doctor.speciality} specialist at {doctor.hospital} with over {doctor.exp} years of dedicated experience. Known for a patient-centric approach and clinical excellence, they specialize in complex diagnostics and innovative treatment methodologies.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Education</p>
                  <p className="text-sm font-black text-slate-700">{doctor.edu}</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Languages Spoken</p>
                  <div className="flex flex-wrap gap-2">
                    {['English', 'Hindi', 'Regional'].map(lang => (
                      <span key={lang} className="px-3 py-1 bg-white rounded-lg text-[10px] font-black text-[#1565C0] border border-blue-100 uppercase tracking-widest">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Availability Section */}
            <div className="bg-white p-10 rounded-[48px] shadow-xl border border-slate-50 space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Available Slots</h2>
                <div className="flex items-center gap-2 text-[#10B981]">
                  <Clock size={18} />
                  <span className="text-xs font-black uppercase tracking-widest">Next Available: {doctor.slot}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {['09:00 AM', '11:30 AM', '02:00 PM', '04:30 PM'].map((time) => (
                  <button key={time} className="py-4 bg-slate-50 rounded-2xl text-sm font-black text-slate-600 hover:bg-[#1565C0] hover:text-white transition-all uppercase tracking-widest active:scale-95">
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-10">
            {/* Booking Card */}
            <div className="bg-white p-8 rounded-[48px] shadow-2xl border border-slate-50 sticky top-24 space-y-8">
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Consultation Fee</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-slate-900">₹{doctor.fee}</span>
                  <span className="text-xs font-bold text-slate-400">/ Session</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <div className="h-10 w-10 rounded-xl bg-[#1565C0] flex items-center justify-center text-white">
                    <IndianRupee size={20} />
                  </div>
                  <p className="text-xs font-black text-[#1565C0] uppercase tracking-widest">Pay at Hospital</p>
                </div>
                <button 
                  onClick={() => navigate(`/book/${doctor.id}`)}
                  className="w-full bg-[#1565C0] text-white py-6 rounded-3xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-100 hover:bg-blue-800 transition active:scale-95"
                >
                  Book Appointment
                </button>
              </div>
              <p className="text-[10px] text-center font-bold text-slate-400 uppercase tracking-widest">No booking fees required</p>
            </div>
          </div>
        </div>

        {/* Similar Doctors Section */}
        <div className="mt-32 space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Similar Specialists</h2>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Recommended for you based on this profile</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {doctorsData
              .filter(d => d.speciality === doctor.speciality && d.id !== doctor.id)
              .slice(0, 3)
              .map(simDoc => (
                <DoctorCard key={simDoc.id} doctor={simDoc} />
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
