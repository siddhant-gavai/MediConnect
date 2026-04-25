import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, Clock, User, FileText, 
  ChevronRight, ChevronLeft, CheckCircle, Star, 
  MapPin, Shield, AlertCircle, ArrowRight, Check,
  ChevronRight as ChevronRightIcon, ChevronLeft as ChevronLeftIcon
} from 'lucide-react';
import doctors from '../data/doctors';
import toast from 'react-hot-toast';

const BookAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const doctor = doctors.find(d => d.id === parseInt(id));

  if (!doctor) return <Navigate to="/doctors" />;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Booking State
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [patientDetails, setPatientDetails] = useState({
    name: '',
    age: '',
    phone: '',
    email: '',
    gender: '',
    reason: '',
    isForSomeoneElse: false,
    relationship: 'Self'
  });

  const [errors, setErrors] = useState({});

  // Step 1: Calendar Logic
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const date = new Date(year, month, 1);
    const days = [];
    
    // Padding for start of month
    const firstDay = date.getDay();
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }, [currentMonth]);

  const slots = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'];
  
  // Random booked slots for demo
  const bookedSlots = useMemo(() => {
    if (!selectedDate) return [];
    return [slots[Math.floor(Math.random() * slots.length)], slots[Math.floor(Math.random() * slots.length)]];
  }, [selectedDate]);

  const validateStep3 = () => {
    const newErrors = {};
    if (!patientDetails.name) newErrors.name = 'Full Name is required';
    if (!patientDetails.age || patientDetails.age < 1 || patientDetails.age > 120) newErrors.age = 'Enter valid age (1-120)';
    if (!patientDetails.phone || !/^\d{10}$/.test(patientDetails.phone)) newErrors.phone = 'Enter valid 10-digit number';
    if (!patientDetails.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patientDetails.email)) newErrors.email = 'Enter valid email address';
    if (!patientDetails.gender) newErrors.gender = 'Gender is required';
    if (!patientDetails.reason) newErrors.reason = 'Reason for visit is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !selectedDate) return toast.error('Please select a date');
    if (step === 2 && !selectedSlot) return toast.error('Please select a time slot');
    if (step === 3 && !validateStep3()) return;
    setStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };

  const handleBack = () => setStep(prev => prev - 1);

  const confirmBooking = () => {
    setLoading(true);
    setTimeout(() => {
      const bookingId = `MC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;

      const newBooking = {
        id: bookingId,
        doctorId: doctor.id,
        doctorName: doctor.name,
        speciality: doctor.speciality,
        hospital: doctor.hospital,
        date: dateString,
        time: selectedSlot,
        patientName: patientDetails.name,
        age: patientDetails.age,
        phone: patientDetails.phone,
        email: patientDetails.email,
        gender: patientDetails.gender,
        reason: patientDetails.reason,
        fee: doctor.fee,
        status: "upcoming",
        bookedAt: new Date().toISOString()
      };

      const existingBookings = JSON.parse(localStorage.getItem('mediconnect_bookings') || '[]');
      localStorage.setItem('mediconnect_bookings', JSON.stringify([newBooking, ...existingBookings]));

      setLoading(false);
      navigate('/booking-confirmed', { state: { booking: newBooking } });
    }, 1500);
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isSunday = (date) => date.getDay() === 0;

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-10">
          
          {/* Left Panel: Doctor Summary */}
          <aside className="space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 sticky top-24">
              <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
                <div className="h-20 w-20 rounded-full bg-[#1565C0] flex items-center justify-center text-white text-2xl font-black shadow-inner shrink-0">
                  {getInitials(doctor.name)}
                </div>
                <div>
                  <div className="flex flex-wrap gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-blue-50 text-[#1565C0] text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100">
                      {doctor.speciality}
                    </span>
                    <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-green-100 flex items-center gap-1">
                      <Check size={10} /> Verified
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{doctor.name}</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Star size={14} className="fill-amber-400 text-amber-400" />
                    <span className="text-sm font-black text-slate-700">{doctor.rating}</span>
                    <span className="text-xs font-bold text-slate-400 ml-2">@ {doctor.hospital}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-slate-400 shrink-0" />
                  <p className="text-sm font-bold text-slate-600">{doctor.location}, India</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex justify-between items-center">
                  <span className="text-xs font-black text-[#1565C0] uppercase tracking-widest">Consultation Fee</span>
                  <span className="text-xl font-black text-[#1565C0]">₹{doctor.fee}</span>
                </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
                <p className="text-[11px] text-amber-800 font-medium leading-relaxed">
                  Please arrive 15 minutes prior to your scheduled time for check-in procedures.
                </p>
              </div>
            </div>
          </aside>

          {/* Right Panel: Booking Wizard */}
          <main className="bg-white rounded-[40px] border border-slate-200 shadow-sm p-8 sm:p-12 relative overflow-hidden">
            
            {/* Step Progress Bar */}
            <div className="mb-12">
              <div className="flex justify-between items-center relative">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 -z-0" />
                <div 
                  className="absolute top-1/2 left-0 h-0.5 bg-[#1565C0] -translate-y-1/2 -z-0 transition-all duration-500" 
                  style={{ width: `${((step - 1) / 3) * 100}%` }}
                />
                {[1, 2, 3, 4].map(s => (
                  <button 
                    key={s}
                    disabled={s > step && s !== step + 1}
                    onClick={() => s < step && setStep(s)}
                    className={`relative z-10 h-10 w-10 rounded-full flex items-center justify-center font-black text-sm transition-all duration-300 ${
                      step === s ? 'bg-white border-2 border-[#1565C0] text-[#1565C0] scale-110 shadow-lg shadow-blue-100' : 
                      step > s ? 'bg-[#1565C0] text-white' : 'bg-white border-2 border-slate-100 text-slate-300'
                    }`}
                  >
                    {step > s ? <Check size={18} /> : s}
                    <span className={`absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-black uppercase tracking-widest ${step >= s ? 'text-[#1565C0]' : 'text-slate-300'}`}>
                      {s === 1 ? 'Date' : s === 2 ? 'Time' : s === 3 ? 'Details' : 'Review'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Select Date</h2>
                      <p className="text-slate-500 font-bold text-sm">Choose a convenient day for your visit</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
                        className="p-2 hover:bg-slate-50 rounded-xl transition text-slate-400"
                      >
                        <ChevronLeftIcon size={20} />
                      </button>
                      <span className="text-sm font-black text-slate-900 uppercase tracking-widest min-w-[140px] text-center">
                        {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </span>
                      <button 
                        onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
                        className="p-2 hover:bg-slate-50 rounded-xl transition text-slate-400"
                      >
                        <ChevronRightIcon size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                      <div key={d} className="text-center text-[10px] font-black text-slate-300 uppercase tracking-widest py-2">{d}</div>
                    ))}
                    {daysInMonth.map((date, i) => {
                      if (!date) return <div key={`empty-${i}`} />;
                      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
                      const isToday = date.toDateString() === new Date().toDateString();
                      const isDisabled = isPastDate(date) || isSunday(date);

                      return (
                        <button
                          key={i}
                          disabled={isDisabled}
                          onClick={() => setSelectedDate(date)}
                          className={`h-14 sm:h-16 rounded-2xl flex flex-col items-center justify-center transition-all relative group ${
                            isSelected ? 'bg-[#1565C0] text-white shadow-xl shadow-blue-100 scale-105 z-10' : 
                            isDisabled ? 'bg-slate-50 text-slate-200 cursor-not-allowed opacity-50' : 
                            'bg-white border border-slate-100 text-slate-700 hover:border-[#1565C0] hover:text-[#1565C0]'
                          } ${isToday ? 'ring-2 ring-[#1565C0] ring-offset-2' : ''}`}
                        >
                          <span className="text-sm sm:text-base font-black">{date.getDate()}</span>
                          {isToday && <span className={`text-[8px] font-black uppercase tracking-tighter ${isSelected ? 'text-white/80' : 'text-[#1565C0]'}`}>Today</span>}
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
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Select Time Slot</h2>
                    <p className="text-slate-500 font-bold text-sm">Available slots for {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                  </div>

                  <div className="space-y-8">
                    {['Morning', 'Afternoon', 'Evening'].map(period => {
                      const periodSlots = slots.filter(s => {
                        const hour = parseInt(s.split(':')[0]);
                        const isPM = s.includes('PM');
                        if (period === 'Morning') return !isPM && hour < 12;
                        if (period === 'Afternoon') return (isPM && hour === 12) || (isPM && hour < 5);
                        if (period === 'Evening') return isPM && hour >= 5;
                        return false;
                      });

                      return (
                        <div key={period} className="space-y-4">
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{period}</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {periodSlots.map(slot => {
                              const isSelected = selectedSlot === slot;
                              const isBooked = bookedSlots.includes(slot);
                              return (
                                <button
                                  key={slot}
                                  disabled={isBooked}
                                  onClick={() => setSelectedSlot(slot)}
                                  className={`py-3.5 rounded-2xl text-xs font-black transition-all border-2 ${
                                    isSelected ? 'bg-[#1565C0] border-[#1565C0] text-white shadow-xl shadow-blue-100' : 
                                    isBooked ? 'bg-slate-50 border-transparent text-slate-200 cursor-not-allowed line-through' : 
                                    'bg-white border-slate-100 text-slate-600 hover:border-[#1565C0] hover:text-[#1565C0]'
                                  }`}
                                >
                                  {isBooked ? 'Booked' : slot}
                                </button>
                              );
                            })}
                          </div>
                        </div>
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
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Patient Details</h2>
                    <p className="text-slate-500 font-bold text-sm">Please provide accurate health information</p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient Full Name</label>
                      <input 
                        type="text"
                        className={`w-full px-4 py-3.5 rounded-2xl border-2 outline-none font-bold text-sm transition-all ${errors.name ? 'border-red-100 focus:border-red-500 bg-red-50' : patientDetails.name ? 'border-green-100 focus:border-[#1565C0] bg-green-50/30' : 'border-slate-50 focus:border-[#1565C0] bg-slate-50'}`}
                        placeholder="John Doe"
                        value={patientDetails.name}
                        onChange={e => setPatientDetails({...patientDetails, name: e.target.value})}
                      />
                      {errors.name && <p className="text-[10px] font-bold text-red-500 mt-1">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Age</label>
                      <input 
                        type="number"
                        min="1"
                        max="120"
                        className={`w-full px-4 py-3.5 rounded-2xl border-2 outline-none font-bold text-sm transition-all ${errors.age ? 'border-red-100 focus:border-red-500 bg-red-50' : patientDetails.age ? 'border-green-100 focus:border-[#1565C0] bg-green-50/30' : 'border-slate-50 focus:border-[#1565C0] bg-slate-50'}`}
                        placeholder="25"
                        value={patientDetails.age}
                        onChange={e => setPatientDetails({...patientDetails, age: e.target.value})}
                      />
                      {errors.age && <p className="text-[10px] font-bold text-red-500 mt-1">{errors.age}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</label>
                      <input 
                        type="tel"
                        maxLength="10"
                        className={`w-full px-4 py-3.5 rounded-2xl border-2 outline-none font-bold text-sm transition-all ${errors.phone ? 'border-red-100 focus:border-red-500 bg-red-50' : patientDetails.phone ? 'border-green-100 focus:border-[#1565C0] bg-green-50/30' : 'border-slate-50 focus:border-[#1565C0] bg-slate-50'}`}
                        placeholder="10-digit number"
                        value={patientDetails.phone}
                        onChange={e => setPatientDetails({...patientDetails, phone: e.target.value.replace(/\D/g, '')})}
                      />
                      {errors.phone && <p className="text-[10px] font-bold text-red-500 mt-1">{errors.phone}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                      <input 
                        type="email"
                        className={`w-full px-4 py-3.5 rounded-2xl border-2 outline-none font-bold text-sm transition-all ${errors.email ? 'border-red-100 focus:border-red-500 bg-red-50' : patientDetails.email ? 'border-green-100 focus:border-[#1565C0] bg-green-50/30' : 'border-slate-50 focus:border-[#1565C0] bg-slate-50'}`}
                        placeholder="example@mail.com"
                        value={patientDetails.email}
                        onChange={e => setPatientDetails({...patientDetails, email: e.target.value})}
                      />
                      {errors.email && <p className="text-[10px] font-bold text-red-500 mt-1">{errors.email}</p>}
                    </div>

                    <div className="space-y-3 sm:col-span-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gender</label>
                      <div className="flex gap-4">
                        {['Male', 'Female', 'Other'].map(g => (
                          <label key={g} className={`flex-1 flex items-center justify-center py-3.5 rounded-2xl border-2 cursor-pointer transition-all ${patientDetails.gender === g ? 'bg-[#1565C0] border-[#1565C0] text-white shadow-lg' : 'bg-slate-50 border-transparent text-slate-500 hover:border-slate-200'}`}>
                            <input 
                              type="radio" 
                              name="gender" 
                              className="hidden" 
                              value={g}
                              checked={patientDetails.gender === g}
                              onChange={e => setPatientDetails({...patientDetails, gender: e.target.value})}
                            />
                            <span className="text-xs font-black uppercase tracking-widest">{g}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="sm:col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reason for Visit</label>
                      <textarea 
                        rows={4}
                        className={`w-full px-4 py-3.5 rounded-2xl border-2 outline-none font-bold text-sm transition-all ${errors.reason ? 'border-red-100 focus:border-red-500 bg-red-50' : patientDetails.reason ? 'border-green-100 focus:border-[#1565C0] bg-green-50/30' : 'border-slate-50 focus:border-[#1565C0] bg-slate-50'}`}
                        placeholder="Briefly describe your symptoms..."
                        value={patientDetails.reason}
                        onChange={e => setPatientDetails({...patientDetails, reason: e.target.value})}
                      />
                      {errors.reason && <p className="text-[10px] font-bold text-red-500 mt-1">{errors.reason}</p>}
                    </div>

                    <div className="sm:col-span-2 space-y-4">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${patientDetails.isForSomeoneElse ? 'bg-[#1565C0] border-[#1565C0]' : 'border-slate-200 group-hover:border-[#1565C0]'}`}>
                          {patientDetails.isForSomeoneElse && <Check size={16} className="text-white" />}
                        </div>
                        <input 
                          type="checkbox" 
                          className="hidden"
                          checked={patientDetails.isForSomeoneElse}
                          onChange={e => setPatientDetails({...patientDetails, isForSomeoneElse: e.target.checked})}
                        />
                        <span className="text-sm font-bold text-slate-600">Is this visit for someone else?</span>
                      </label>

                      {patientDetails.isForSomeoneElse && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          className="space-y-2 pl-9"
                        >
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Relationship</label>
                          <select 
                            className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                            value={patientDetails.relationship}
                            onChange={e => setPatientDetails({...patientDetails, relationship: e.target.value})}
                          >
                            {['Self', 'Spouse', 'Child', 'Parent', 'Other'].map(r => <option key={r}>{r}</option>)}
                          </select>
                        </motion.div>
                      )}
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
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Review & Confirm</h2>
                    <p className="text-slate-500 font-bold text-sm">Double check your appointment details</p>
                  </div>

                  <div className="bg-slate-50 rounded-[32px] p-8 space-y-6">
                    <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-200">
                      <div className="p-3 bg-blue-100 text-[#1565C0] rounded-2xl">
                        <FileText size={24} />
                      </div>
                      <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Appointment Summary</h3>
                    </div>

                    <div className="grid gap-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Doctor</p>
                          <p className="text-sm font-black text-slate-900">{doctor.name}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Speciality</p>
                          <p className="text-sm font-bold text-[#1565C0] uppercase tracking-tight">{doctor.speciality}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</p>
                          <p className="text-sm font-black text-slate-900">{selectedDate?.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time</p>
                          <p className="text-sm font-black text-slate-900">{selectedSlot}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient</p>
                          <p className="text-sm font-black text-slate-900">{patientDetails.name}, {patientDetails.age} yrs</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone</p>
                          <p className="text-sm font-black text-slate-900">{patientDetails.phone}</p>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-slate-200 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-500 uppercase">Consultation Fee</span>
                          <span className="text-sm font-black text-slate-900">₹{doctor.fee}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-500 uppercase">Platform Fee</span>
                          <span className="text-sm font-black text-green-600">₹0 (Free)</span>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t-2 border-dotted border-slate-300">
                          <span className="text-sm font-black text-slate-900 uppercase">Total Payable</span>
                          <span className="text-2xl font-black text-[#1565C0]">₹{doctor.fee}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-slate-400">
                    <Shield size={16} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">100% Secure Booking • Free Cancellation within 2 hrs</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="mt-12 flex items-center justify-between gap-4 pt-8 border-t border-slate-100">
              {step > 1 && (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-slate-400 hover:bg-slate-50 transition"
                >
                  <ChevronLeft size={20} /> Back
                </button>
              )}
              <div className="flex-1" />
              {step < 4 ? (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-10 py-4 bg-[#1565C0] text-white rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-blue-800 transition active:scale-95"
                >
                  Next Step <ChevronRight size={20} />
                </button>
              ) : (
                <button
                  onClick={confirmBooking}
                  disabled={loading}
                  className={`w-full sm:w-auto flex items-center justify-center gap-3 px-12 py-4 bg-[#1565C0] text-white rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-blue-800 transition active:scale-95 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Confirm & Book Appointment <CheckCircle size={20} /></>
                  )}
                </button>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
