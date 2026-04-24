import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, Clock, User, FileText, 
  ChevronRight, ChevronLeft, CheckCircle, Star, 
  MapPin, Shield, AlertCircle, ArrowRight
} from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { cn } from '../utils/cn';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  // Booking State
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [patientDetails, setPatientDetails] = useState({
    name: '',
    age: '',
    phone: '',
    email: '',
    reason: ''
  });

  const slots = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'];
  const bookedSlots = ['11:00 AM', '04:00 PM']; // Mocked booked slots

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const { data } = await api.get(`/doctors/${id}`);
        if (data.success) {
          setDoctor(data.data);
        }
      } catch (error) {
        toast.error('Failed to load doctor details');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  const handleNext = () => {
    if (step === 1 && !selectedDate) return toast.error('Please select a date');
    if (step === 2 && !selectedSlot) return toast.error('Please select a time slot');
    if (step === 3) {
      const { name, age, phone, email } = patientDetails;
      if (!name || !age || !phone || !email) return toast.error('Please fill all required fields');
    }
    setStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };

  const handleBack = () => setStep(prev => prev - 1);

  const confirmBooking = () => {
    const bookingId = Math.random().toString(36).substring(2, 10).toUpperCase();
    const newBooking = {
      id: bookingId,
      doctorId: id,
      doctorName: doctor.name,
      speciality: doctor.doctorProfile?.specialization,
      date: selectedDate,
      time: selectedSlot,
      patientDetails,
      fee: doctor.doctorProfile?.fees,
      status: 'Upcoming',
      createdAt: new Date().toISOString()
    };

    // Save to localStorage
    const existingBookings = JSON.parse(localStorage.getItem('mediconnect_bookings') || '[]');
    localStorage.setItem('mediconnect_bookings', JSON.stringify([newBooking, ...existingBookings]));

    toast.success('Booking confirmed!');
    navigate('/booking-confirmed', { state: { booking: newBooking, doctor } });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Progress Stepper */}
      <div className="mb-12">
        <div className="flex justify-between items-center relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -z-10 -translate-y-1/2" />
          <div className="absolute top-1/2 left-0 h-1 bg-blue-600 -z-10 -translate-y-1/2 transition-all duration-500" style={{ width: `${((step - 1) / 3) * 100}%` }} />
          {[1, 2, 3, 4].map(s => (
            <div key={s} className="flex flex-col items-center gap-2">
              <div className={cn(
                "h-10 w-10 rounded-full flex items-center justify-center font-bold transition-all duration-300",
                step >= s ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110" : "bg-white text-slate-400 border-2 border-slate-200"
              )}>
                {step > s ? <CheckCircle className="h-5 w-5" /> : s}
              </div>
              <span className={cn("text-[10px] font-black uppercase tracking-widest", step >= s ? "text-blue-600" : "text-slate-400")}>
                {s === 1 ? 'Date' : s === 2 ? 'Time' : s === 3 ? 'Details' : 'Review'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
        <div className="space-y-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                    <CalendarIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Select Date</h2>
                    <p className="text-sm text-slate-500 font-medium">Choose a convenient day for your visit</p>
                  </div>
                </div>
                
                {/* Simple Calendar Placeholder */}
                <div className="grid grid-cols-7 gap-2">
                  {['S','M','T','W','T','F','S'].map(d => (
                    <div key={d} className="text-center text-xs font-black text-slate-300 py-2">{d}</div>
                  ))}
                  {Array.from({ length: 30 }).map((_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() + i);
                    const dateStr = date.toISOString().split('T')[0];
                    const isToday = i === 0;
                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedDate(dateStr)}
                        className={cn(
                          "h-12 rounded-xl text-sm font-bold transition-all flex flex-col items-center justify-center",
                          selectedDate === dateStr ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "hover:bg-slate-50 text-slate-700 border border-slate-100",
                          isToday && "ring-2 ring-blue-600 ring-offset-2"
                        )}
                      >
                        <span className="text-[10px] uppercase opacity-60">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                        {date.getDate()}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Select Time</h2>
                    <p className="text-sm text-slate-500 font-medium">Available slots for {new Date(selectedDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {slots.map(slot => {
                    const isBooked = bookedSlots.includes(slot);
                    return (
                      <button
                        key={slot}
                        disabled={isBooked}
                        onClick={() => setSelectedSlot(slot)}
                        className={cn(
                          "py-4 rounded-2xl text-sm font-black transition-all border",
                          selectedSlot === slot 
                            ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200" 
                            : isBooked 
                              ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed" 
                              : "bg-white text-slate-700 border-slate-200 hover:border-blue-600 hover:text-blue-600"
                        )}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Patient Details</h2>
                    <p className="text-sm text-slate-500 font-medium">Please provide accurate information</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                    <input 
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none text-sm font-bold"
                      placeholder="e.g. John Doe"
                      value={patientDetails.name}
                      onChange={e => setPatientDetails({...patientDetails, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Age</label>
                    <input 
                      type="number"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none text-sm font-bold"
                      placeholder="e.g. 28"
                      value={patientDetails.age}
                      onChange={e => setPatientDetails({...patientDetails, age: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Phone Number</label>
                    <input 
                      type="tel"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none text-sm font-bold"
                      placeholder="+1 (555) 000-0000"
                      value={patientDetails.phone}
                      onChange={e => setPatientDetails({...patientDetails, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                    <input 
                      type="email"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none text-sm font-bold"
                      placeholder="john@example.com"
                      value={patientDetails.email}
                      onChange={e => setPatientDetails({...patientDetails, email: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Reason for Visit</label>
                    <textarea 
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none text-sm font-bold"
                      placeholder="Briefly describe your symptoms..."
                      value={patientDetails.reason}
                      onChange={e => setPatientDetails({...patientDetails, reason: e.target.value})}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Review & Confirm</h2>
                    <p className="text-sm text-slate-500 font-medium">Double check your appointment details</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Doctor</span>
                      <span className="text-sm font-black text-slate-900">{doctor.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Speciality</span>
                      <span className="text-sm font-bold text-blue-600 uppercase tracking-tight">{doctor.doctorProfile?.specialization}</span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Date & Time</span>
                      <span className="text-sm font-black text-slate-900">{selectedDate} at {selectedSlot}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Consultation Fee</span>
                      <span className="text-lg font-black text-blue-600">${doctor.doctorProfile?.fees}</span>
                    </div>
                  </div>

                  <div className="p-6 border border-slate-200 rounded-2xl space-y-4">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Patient Summary</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Name</p>
                        <p className="text-sm font-bold">{patientDetails.name}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Contact</p>
                        <p className="text-sm font-bold">{patientDetails.phone}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                    <Shield className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-blue-800 font-medium leading-relaxed">
                      Your data is protected. By confirming, you agree to our terms of service and cancellation policy.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between pt-8">
            {step > 1 && (
              <button 
                onClick={handleBack}
                className="px-8 py-4 rounded-2xl font-black text-slate-600 hover:bg-slate-100 transition flex items-center gap-2"
              >
                <ChevronLeft className="h-5 w-5" /> Back
              </button>
            )}
            <div className="flex-1" />
            {step < 4 ? (
              <button 
                onClick={handleNext}
                className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-200 hover:bg-blue-700 transition flex items-center gap-2"
              >
                Next Step <ChevronRight className="h-5 w-5" />
              </button>
            ) : (
              <button 
                onClick={confirmBooking}
                className="px-10 py-4 bg-green-600 text-white rounded-2xl font-black shadow-lg shadow-green-200 hover:bg-green-700 transition flex items-center gap-2"
              >
                Confirm Appointment <CheckCircle className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Doctor Sidebar Summary */}
        <aside className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 sticky top-24">
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
              <div className="h-16 w-16 rounded-2xl bg-slate-50 overflow-hidden border border-slate-100">
                <img src={doctor.avatar || `https://placehold.co/100x100?text=${doctor.name[0]}`} alt={doctor.name} className="h-full w-full object-cover" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 uppercase tracking-tight">{doctor.name}</h3>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{doctor.doctorProfile?.specialization}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="h-3 w-3 text-amber-500 fill-current" />
                  <span className="text-xs font-black text-slate-700">{doctor.doctorProfile?.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hospital</p>
                  <p className="text-sm font-bold text-slate-700">Central Medical Center, NY</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="h-4 w-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Experience</p>
                  <p className="text-sm font-bold text-slate-700">{doctor.doctorProfile?.experience} Years</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <span className="text-xs font-black text-amber-900 uppercase">Note</span>
              </div>
              <p className="text-[10px] text-amber-800 font-medium leading-relaxed">
                Please arrive 15 minutes before your scheduled time for check-in.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Booking;
