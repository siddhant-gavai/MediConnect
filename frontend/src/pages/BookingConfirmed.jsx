import { useLocation, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircle, Calendar, Clock, MapPin, 
  Download, ArrowRight, Home, List 
} from 'lucide-react';
import { useEffect, useState } from 'react';

const BookingConfirmed = () => {
  const location = useLocation();
  const { booking, doctor } = location.state || {};
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    setShowAnimation(true);
  }, []);

  if (!booking) {
    return <Navigate to="/" replace />;
  }

  const generateICS = () => {
    const { doctorName, date, time } = booking;
    const startDateTime = `${date.replace(/-/g, '')}T${time.split(':')[0]}0000`;
    const endDateTime = `${date.replace(/-/g, '')}T${parseInt(time.split(':')[0]) + 1}0000`;

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `SUMMARY:Medical Appointment with ${doctorName}`,
      `DTSTART:${startDateTime}`,
      `DTEND:${endDateTime}`,
      'LOCATION:Central Medical Center, NY',
      `DESCRIPTION:Appointment with ${doctorName} (${booking.speciality})`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `appointment-${booking.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-[40px] shadow-2xl shadow-blue-100/50 overflow-hidden border border-white">
          <div className="bg-blue-600 p-12 text-center relative overflow-hidden">
            {/* Success Animation Container */}
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 12 }}
              className="relative z-10"
            >
              <div className="h-24 w-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <motion.div
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  <CheckCircle className="h-12 w-12 text-white" />
                </motion.div>
                {/* CSS Animation: Pulse Ring */}
                <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping" />
              </div>
              <h1 className="text-3xl font-black text-white uppercase tracking-tight">Booking Confirmed!</h1>
              <p className="text-blue-100 font-bold mt-2">Your appointment has been successfully scheduled.</p>
            </motion.div>

            {/* Decorative circles */}
            <div className="absolute -top-12 -right-12 h-40 w-40 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-12 -left-12 h-40 w-40 bg-blue-400/20 rounded-full blur-3xl" />
          </div>

          <div className="p-12 space-y-10">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Booking ID</p>
                <p className="text-lg font-black text-slate-900 tracking-tight">#{booking.id}</p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Consultation Fee</p>
                <p className="text-2xl font-black text-blue-600">${booking.fee}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-sm border border-slate-100">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Appointment Date</p>
                  <p className="text-sm font-black text-slate-900">{new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs font-bold text-slate-500">
                    <Clock className="h-3.5 w-3.5" />
                    {booking.time}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-sm border border-slate-100">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</p>
                  <p className="text-sm font-black text-slate-900">Central Medical Center</p>
                  <p className="text-xs font-bold text-slate-500 mt-1">123 Health Ave, Medical District, NY 10001</p>
                </div>
              </div>
            </div>

            <div className="pt-6 flex flex-col gap-4">
              <button 
                onClick={generateICS}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-slate-800 transition shadow-xl"
              >
                <Download className="h-5 w-5" /> Add to Calendar
              </button>
              
              <div className="grid grid-cols-2 gap-4">
                <Link 
                  to="/my-bookings"
                  className="py-4 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-slate-50 transition"
                >
                  <List className="h-5 w-5" /> My Bookings
                </Link>
                <Link 
                  to="/"
                  className="py-4 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-slate-50 transition"
                >
                  <Home className="h-5 w-5" /> Go Home
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center space-y-4">
          <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">What's Next?</p>
          <div className="flex justify-center gap-8">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">1</div>
              <p className="text-[10px] font-black text-slate-500 uppercase">Arrive Early</p>
            </div>
            <div className="flex flex-col items-center gap-2 text-slate-300">
              <div className="h-8 w-8 rounded-full border border-slate-200 flex items-center justify-center text-xs font-bold">2</div>
              <p className="text-[10px] font-black uppercase">Check-in</p>
            </div>
            <div className="flex flex-col items-center gap-2 text-slate-300">
              <div className="h-8 w-8 rounded-full border border-slate-200 flex items-center justify-center text-xs font-bold">3</div>
              <p className="text-[10px] font-black uppercase">Consultation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmed;
