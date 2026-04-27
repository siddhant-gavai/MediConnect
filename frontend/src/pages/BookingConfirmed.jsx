import React, { useEffect } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Calendar, Clock, IndianRupee, MapPin, Building2, LayoutGrid, Search, Copy } from 'lucide-react';
import { useToast } from '../components/Toast';

const BookingConfirmed = () => {
  const location = useLocation();
  const { showToast } = useToast();
  const booking = location.state?.booking;

  useEffect(() => {
    document.title = 'Booking Confirmed | MediConnect';
  }, []);

  if (!booking) return <Navigate to="/doctors" />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center py-20 px-4 overflow-hidden relative">
      
      {/* CSS Confetti Animation */}
      <div className="confetti-container">
        {[...Array(50)].map((_, i) => (
          <div key={i} className={`confetti piece-${i}`} />
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl w-full bg-white rounded-[40px] shadow-2xl border border-slate-100 p-10 text-center relative z-10"
      >
        {/* Animated Checkmark */}
        <div className="flex justify-center mb-8">
          <div className="h-24 w-24 rounded-full bg-green-50 flex items-center justify-center relative">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="h-16 w-16 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-100"
            >
              <Check size={40} className="text-white" />
            </motion.div>
            <div className="absolute inset-0 border-4 border-green-500 rounded-full animate-ping opacity-20" />
          </div>
        </div>

        <div className="space-y-4 mb-10">
          <h1 className="text-3xl font-black text-green-700 uppercase tracking-tight">Appointment Confirmed!</h1>
          <p className="text-slate-500 font-bold">You will receive a confirmation on your email shortly.</p>
          
          <div className="inline-flex items-center gap-3 bg-blue-50 px-6 py-2 rounded-full border border-blue-100 mt-4 group">
            <p className="text-sm font-black text-[#1565C0] uppercase tracking-[0.2em]">
              Booking ID: <span className="text-blue-700">{booking.id}</span>
            </p>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(booking.id);
                showToast('Booking ID copied to clipboard!', 'success');
              }}
              className="p-1.5 hover:bg-blue-100 rounded-lg text-[#1565C0] transition-colors"
              title="Copy ID"
            >
              <Copy size={14} />
            </button>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-slate-50 rounded-3xl p-8 text-left space-y-6 mb-10 border border-slate-100">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{booking.doctorName}</h3>
              <p className="text-xs font-bold text-[#1565C0] uppercase tracking-widest">{booking.speciality} • {booking.hospital}</p>
            </div>
            <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100">
              <div className="h-10 w-10 bg-[#1565C0] rounded-lg flex items-center justify-center text-white font-black">
                {booking.doctorName.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-3">
              <Calendar size={18} className="text-slate-400" />
              <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Date</p>
                <p className="text-sm font-black text-slate-700">{new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' })}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={18} className="text-slate-400" />
              <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Time</p>
                <p className="text-sm font-black text-slate-700">{booking.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <IndianRupee size={18} className="text-slate-400" />
              <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Amount Paid</p>
                <p className="text-sm font-black text-slate-700">₹{booking.fee}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={18} className="text-slate-400" />
              <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Location</p>
                <p className="text-sm font-black text-slate-700 truncate max-w-[120px]">Hospital Facility</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => {
              const text = `I just booked an appointment with Dr. ${booking.doctorName} on MediConnect!`;
              if (navigator.share) {
                navigator.share({ title: 'MediConnect Booking', text, url: window.location.origin });
              } else {
                navigator.clipboard.writeText(text);
                showToast('Success! Message copied to clipboard', 'success');
              }
            }}
            className="flex-1 bg-white border-2 border-slate-100 px-8 py-4 rounded-2xl font-black text-slate-600 hover:bg-slate-50 transition flex items-center justify-center gap-2"
          >
            Share Booking
          </button>
          <Link 
            to="/doctors" 
            className="flex-1 bg-[#1565C0] text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-blue-800 transition flex items-center justify-center gap-2"
          >
            <Search size={20} /> Book Another
          </Link>
        </div>
      </motion.div>

      <style jsx>{`
        .confetti-container {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .confetti {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          top: -10px;
          opacity: 0;
        }
        ${[...Array(50)].map((_, i) => {
          const color = ['#f2d74e', '#95c3de', '#ff9a91', '#f2d74e', '#59d9a1'][i % 5];
          const left = Math.random() * 100;
          const duration = 2 + Math.random() * 3;
          const delay = Math.random() * 2;
          return `
            .piece-${i} {
              background-color: ${color};
              left: ${left}%;
              animation: fall ${duration}s ease-out ${delay}s infinite;
            }
          `;
        }).join('')}
        @keyframes fall {
          0% { transform: translateY(0) rotate(0); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default BookingConfirmed;
