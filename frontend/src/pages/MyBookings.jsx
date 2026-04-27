import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Clock, MapPin, Building2, ChevronRight, 
  Trash2, RefreshCw, AlertCircle, Search, Star
} from 'lucide-react';
import { useToast } from '../components/Toast';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [showCancelConfirm, setShowCancelConfirm] = useState(null);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [ratings, setRatings] = useState(() => {
    return JSON.parse(localStorage.getItem('mediconnect_ratings') || '{}');
  });

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
    showToast('Appointment cancelled successfully', 'success');
  };

  const handleRate = (bookingId, rating) => {
    const updated = { ...ratings, [bookingId]: rating };
    setRatings(updated);
    localStorage.setItem('mediconnect_ratings', JSON.stringify(updated));
    showToast('Thank you for your feedback!', 'success');
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
    <div className="min-h-screen bg-[#F8FAFC] py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tight">My Appointments</h1>
            <p className="text-slate-500 font-bold mt-1">Manage and track your medical consultations</p>
          </div>
          
          <div className="bg-white p-2 rounded-[24px] border border-slate-100 flex gap-1 shadow-xl shadow-slate-100">
            {['All', 'Upcoming', 'Completed', 'Cancelled'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab ? 'bg-[#1565C0] text-white shadow-lg shadow-blue-200' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <AnimatePresence mode="popLayout">
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <motion.div
                  key={booking.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-[48px] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 p-10 group"
                >
                  <div className="flex flex-col lg:flex-row gap-10">
                    {/* Doctor Info */}
                    <div className="flex gap-6 min-w-[280px]">
                      <div className="h-20 w-20 rounded-[28px] bg-gradient-to-br from-[#1565C0] to-[#0288D1] flex items-center justify-center text-white text-2xl font-black shadow-xl group-hover:scale-110 transition-transform duration-500">
                        {booking.doctorName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="space-y-2">
                        <div className={`inline-block px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border ${getStatusStyle(booking.status)}`}>
                          {booking.status}
                        </div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-[#1565C0] transition-colors">{booking.doctorName}</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">{booking.speciality}<br/>{booking.hospital}</p>
                      </div>
                    </div>

                    {/* DateTime Info */}
                    <div className="flex-1 grid grid-cols-2 gap-6 lg:border-x lg:border-slate-100 lg:px-10">
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Date</p>
                        <div className="flex items-center gap-2 text-slate-700">
                          <Calendar size={16} className="text-[#1565C0]" />
                          <span className="text-sm font-black">{new Date(booking.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Time Slot</p>
                        <div className="flex items-center gap-2 text-slate-700">
                          <Clock size={16} className="text-[#1565C0]" />
                          <span className="text-sm font-black">{booking.time}</span>
                        </div>
                      </div>
                    </div>

                    {/* Fee */}
                    <div className="flex flex-col justify-center lg:items-end">
                      <p className="text-3xl font-black text-slate-900">₹{booking.fee}</p>
                      <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">ID: {booking.id}</p>
                    </div>
                  </div>

                  {/* Actions & Rating */}
                  <div className="mt-10 pt-10 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-6">
                    {booking.status === 'upcoming' && (
                      <div className="flex gap-4 w-full sm:w-auto">
                        <button 
                          onClick={() => navigate(`/book/${booking.doctorId}`)}
                          className="flex-1 px-8 py-4 bg-slate-50 rounded-2xl text-[10px] font-black text-slate-600 uppercase tracking-widest hover:bg-blue-50 hover:text-[#1565C0] transition active:scale-95"
                        >
                          Reschedule
                        </button>
                        <button 
                          onClick={() => setShowCancelConfirm(booking.id)}
                          className="flex-1 px-8 py-4 bg-white border-2 border-red-50 rounded-2xl text-[10px] font-black text-red-400 uppercase tracking-widest hover:bg-red-50 transition active:scale-95"
                        >
                          Cancel
                        </button>
                      </div>
                    )}

                    {booking.status === 'completed' && (
                      <div className="w-full bg-slate-50 p-6 rounded-[32px] border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="bg-white p-3 rounded-2xl shadow-sm">
                            <Star size={20} className="text-amber-400 fill-amber-400" />
                          </div>
                          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Rate your experience</p>
                        </div>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => handleRate(booking.id, star)}
                              className={`p-2 transition-all hover:scale-125 ${
                                (ratings[booking.id] || 0) >= star ? 'text-amber-400' : 'text-slate-300'
                              }`}
                            >
                              <Star size={24} fill={(ratings[booking.id] || 0) >= star ? 'currentColor' : 'none'} />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {booking.status === 'cancelled' && (
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">This appointment was cancelled</p>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-32 bg-white rounded-[64px] border-4 border-dashed border-slate-50"
              >
                <motion.div 
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="bg-slate-50 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner"
                >
                  <Calendar className="text-slate-200" size={64} />
                </motion.div>
                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Empty Calendar</h3>
                <p className="text-slate-400 font-bold max-w-xs mx-auto mt-2 leading-relaxed">Your healing journey starts here. Book your first appointment with our verified specialists.</p>
                <Link to="/doctors" className="mt-10 inline-flex items-center gap-3 bg-[#1565C0] text-white px-12 py-5 rounded-[24px] font-black uppercase tracking-widest text-xs shadow-2xl shadow-blue-200 hover:bg-blue-800 transition active:scale-95">
                  Browse Doctors <Search size={20} />
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
