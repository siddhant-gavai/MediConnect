import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Clock, MapPin, Trash2, 
  AlertCircle, ChevronRight, Search, Inbox,
  Stethoscope, ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../utils/cn';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [showConfirm, setShowConfirm] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('mediconnect_bookings') || '[]');
    setBookings(saved);
  }, []);

  const cancelBooking = (id) => {
    const updated = bookings.map(b => b.id === id ? { ...b, status: 'Cancelled' } : b);
    setBookings(updated);
    localStorage.setItem('mediconnect_bookings', JSON.stringify(updated));
    setShowConfirm(null);
    toast.success('Appointment cancelled');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Upcoming': return 'bg-blue-100 text-blue-600';
      case 'Completed': return 'bg-green-100 text-green-600';
      case 'Cancelled': return 'bg-red-100 text-red-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">My Appointments</h1>
          <p className="text-slate-500 font-medium italic">Manage and track your healthcare schedule</p>
        </div>
        <Link to="/doctors" className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-blue-700 transition shadow-xl shadow-blue-200">
          Book New <ArrowRight className="h-5 w-5" />
        </Link>
      </div>

      {bookings.length > 0 ? (
        <div className="grid gap-6">
          <AnimatePresence>
            {bookings.map((booking, i) => (
              <motion.div 
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl border border-slate-100 p-8 hover:shadow-2xl hover:shadow-blue-600/5 transition-all group relative overflow-hidden"
              >
                <div className="flex flex-col md:flex-row gap-8 items-start md:items-center relative z-10">
                  <div className="h-20 w-20 bg-slate-50 rounded-2xl flex items-center justify-center text-blue-600 border border-slate-100 shrink-0">
                    <Stethoscope className="h-10 w-10" />
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">{booking.doctorName}</h3>
                      <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", getStatusColor(booking.status))}>
                        {booking.status}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-6">
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        {new Date(booking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                        <Clock className="h-4 w-4 text-blue-600" />
                        {booking.time}
                      </div>
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        Central Medical Center
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-auto pt-6 md:pt-0 border-t md:border-t-0 border-slate-50">
                    <div className="flex-1 md:text-right">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Fee Paid</p>
                      <p className="text-xl font-black text-slate-900">${booking.fee}</p>
                    </div>
                    {booking.status === 'Upcoming' && (
                      <button 
                        onClick={() => setShowConfirm(booking.id)}
                        className="p-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                        title="Cancel Appointment"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Confirm Dialog Overlay */}
                <AnimatePresence>
                  {showConfirm === booking.id && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-20 bg-white/95 backdrop-blur-sm flex items-center justify-center p-8"
                    >
                      <div className="text-center space-y-4 max-w-sm">
                        <div className="h-12 w-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
                          <AlertCircle className="h-6 w-6" />
                        </div>
                        <h4 className="font-black text-slate-900 uppercase">Cancel Appointment?</h4>
                        <p className="text-xs text-slate-500 font-medium">This action cannot be undone. You will need to re-book for a new slot.</p>
                        <div className="flex gap-4 pt-2">
                          <button 
                            onClick={() => setShowConfirm(null)}
                            className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition"
                          >
                            Keep it
                          </button>
                          <button 
                            onClick={() => cancelBooking(booking.id)}
                            className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition shadow-lg shadow-red-200"
                          >
                            Yes, Cancel
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Decorative background circle */}
                <div className="absolute top-0 right-0 h-32 w-32 bg-blue-50/50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-32 bg-white rounded-[40px] border border-dashed border-slate-200 space-y-6">
          <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
            <Inbox className="h-12 w-12 text-slate-200" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">No appointments yet</h3>
            <p className="text-slate-400 font-medium max-w-xs mx-auto">Your upcoming medical visits will appear here once you book them.</p>
          </div>
          <Link 
            to="/doctors" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-200"
          >
            Find a Specialist <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
