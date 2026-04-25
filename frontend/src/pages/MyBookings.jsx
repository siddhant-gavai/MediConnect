import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Clock, MapPin, Building2, ChevronRight, 
  Trash2, RefreshCw, AlertCircle, Search, Info
} from 'lucide-react';
import toast from 'react-hot-toast';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [showCancelConfirm, setShowCancelConfirm] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedBookings = JSON.parse(localStorage.getItem('mediconnect_bookings') || '[]');
    setBookings(savedBookings);
  }, []);

  const updateBookingStatus = (id, newStatus) => {
    const updatedBookings = bookings.map(b => 
      b.id === id ? { ...b, status: newStatus } : b
    );
    setBookings(updatedBookings);
    localStorage.setItem('mediconnect_bookings', JSON.stringify(updatedBookings));
  };

  const handleCancel = (id) => {
    updateBookingStatus(id, 'cancelled');
    setShowCancelConfirm(null);
    toast.success('Appointment cancelled successfully');
  };

  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'All') return true;
    return b.status.toLowerCase() === activeTab.toLowerCase();
  });

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'upcoming': return 'bg-blue-50 text-[#1565C0] border-blue-100';
      case 'completed': return 'bg-green-50 text-green-600 border-green-100';
      case 'cancelled': return 'bg-slate-50 text-slate-400 border-slate-100';
      default: return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">My Appointments</h1>
            <p className="text-slate-500 font-bold mt-1">Manage and track your medical consultations</p>
          </div>
          
          <div className="bg-white p-1.5 rounded-2xl border border-slate-200 flex gap-1 shadow-sm">
            {['All', 'Upcoming', 'Completed', 'Cancelled'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === tab ? 'bg-[#1565C0] text-white shadow-lg shadow-blue-100' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <motion.div
                  key={booking.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-[32px] border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 p-8"
                >
                  <div className="flex flex-col sm:flex-row gap-8">
                    {/* Doctor Info */}
                    <div className="flex gap-4 min-w-[240px]">
                      <div className="h-16 w-16 rounded-2xl bg-[#1565C0] flex items-center justify-center text-white text-xl font-black shadow-inner shrink-0">
                        {booking.doctorName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="space-y-1">
                        <div className={`inline-block px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-[0.2em] border ${getStatusStyle(booking.status)}`}>
                          {booking.status}
                        </div>
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">{booking.doctorName}</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{booking.speciality} • {booking.hospital}</p>
                      </div>
                    </div>

                    {/* DateTime Info */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 sm:py-0 border-y sm:border-y-0 sm:border-x border-slate-100 sm:px-8">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                          <Calendar size={18} />
                        </div>
                        <div>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Date</p>
                          <p className="text-sm font-black text-slate-700">{new Date(booking.date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                          <Clock size={18} />
                        </div>
                        <div>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Time Slot</p>
                          <p className="text-sm font-black text-slate-700">{booking.time}</p>
                        </div>
                      </div>
                    </div>

                    {/* Status & ID */}
                    <div className="flex flex-col justify-center sm:items-end min-w-[120px]">
                      <p className="text-2xl font-black text-[#1565C0]">₹{booking.fee}</p>
                      <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">ID: {booking.id}</p>
                    </div>
                  </div>

                  {booking.status === 'upcoming' && (
                    <div className="mt-8 pt-8 border-t border-slate-50 flex flex-wrap gap-4">
                      <button 
                        onClick={() => navigate(`/book/${booking.doctorId}`)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-white border-2 border-slate-100 rounded-xl text-xs font-black text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition"
                      >
                        <RefreshCw size={14} /> Reschedule
                      </button>
                      <button 
                        onClick={() => setShowCancelConfirm(booking.id)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-white border-2 border-red-50 rounded-xl text-xs font-black text-red-400 uppercase tracking-widest hover:bg-red-50 transition"
                      >
                        <Trash2 size={14} /> Cancel Appointment
                      </button>
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-24 bg-white rounded-[40px] border-2 border-dashed border-slate-100"
              >
                <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="text-slate-200" size={48} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">No Appointments Found</h3>
                <p className="text-slate-400 font-bold max-w-xs mx-auto mt-2">Book your first appointment with our verified specialists today.</p>
                <Link to="/doctors" className="mt-8 inline-flex items-center gap-2 bg-[#1565C0] text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-blue-800 transition">
                  Find Doctors <Search size={20} />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      <AnimatePresence>
        {showCancelConfirm && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
              onClick={() => setShowCancelConfirm(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white rounded-[32px] shadow-2xl p-8 z-[110]"
            >
              <div className="text-center space-y-6">
                <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-red-500">
                  <AlertCircle size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Cancel Appointment?</h3>
                  <p className="text-slate-500 font-bold mt-2">Are you sure you want to cancel this appointment? Cancellation is free if done 2 hours before.</p>
                </div>
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => handleCancel(showCancelConfirm)}
                    className="w-full py-4 bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-red-100 hover:bg-red-600 transition"
                  >
                    Yes, Cancel
                  </button>
                  <button 
                    onClick={() => setShowCancelConfirm(null)}
                    className="w-full py-4 bg-white border-2 border-slate-100 text-slate-400 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-50 transition"
                  >
                    Keep Appointment
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyBookings;
