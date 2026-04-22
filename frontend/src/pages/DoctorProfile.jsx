import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { 
  Star, Clock, User, Calendar, ShieldCheck, MapPin, 
  MessageSquare, Stethoscope, ArrowRight, Award, 
  ThumbsUp, Share2, Heart
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';
import toast from 'react-hot-toast';

const DoctorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [symptoms, setSymptoms] = useState('');
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const { data } = await api.get(`/doctors/${id}`);
        if (data.success) {
          setDoctor(data.data);
        }
      } catch (error) {
        toast.error('Failed to load doctor profile');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  const handleBooking = async () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/doctors/${id}` } } });
      return;
    }

    if (!selectedSlot) {
      toast.error('Please select a time slot');
      return;
    }

    try {
      setBooking(true);
      const { data } = await api.post('/appointments', {
        doctorId: doctor.doctorProfile.id,
        slotId: selectedSlot.id,
        symptoms
      });

      if (data.success) {
        toast.success('Appointment booked successfully!');
        navigate('/patient/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return (
    <div className="animate-pulse space-y-12 py-12">
      <div className="h-64 bg-slate-100 rounded-[40px]" />
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 h-96 bg-slate-100 rounded-[40px]" />
        <div className="h-96 bg-slate-100 rounded-[40px]" />
      </div>
    </div>
  );

  if (!doctor) return <div className="text-center py-32 text-slate-400">Doctor not found</div>;

  return (
    <div className="pb-24 space-y-12 pt-8">
      {/* 1. Profile Header Card */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[48px] p-8 lg:p-12 border border-slate-100 shadow-2xl shadow-primary/5 relative overflow-hidden"
      >
        <div className="flex flex-col lg:row-row lg:items-center gap-12 relative z-10">
          <div className="h-48 w-48 rounded-[40px] bg-slate-50 border-4 border-white shadow-xl overflow-hidden flex-shrink-0 mx-auto lg:mx-0">
            {doctor.avatar ? (
              <img src={doctor.avatar} alt={doctor.name} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-5xl font-black text-primary/20">{doctor.name[0]}</div>
            )}
          </div>
          
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <h1 className="text-4xl lg:text-5xl font-black text-secondary tracking-tight uppercase leading-none">{doctor.name}</h1>
                {doctor.doctorProfile?.isVerified && (
                  <div className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-xs font-black flex items-center gap-2 border border-emerald-100 uppercase tracking-widest">
                    <ShieldCheck className="h-4 w-4" /> Trusted Specialist
                  </div>
                )}
              </div>
              <p className="text-lg font-bold text-primary italic tracking-wide">{doctor.doctorProfile?.specialization} Expert</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Experience</p>
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  <span className="text-xl font-black text-secondary">{doctor.doctorProfile?.experience} Years</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rating</p>
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <Star className="h-5 w-5 text-amber-500 fill-current" />
                  <span className="text-xl font-black text-secondary">{doctor.doctorProfile?.rating.toFixed(1)}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient Help</p>
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <ThumbsUp className="h-5 w-5 text-emerald-500" />
                  <span className="text-xl font-black text-secondary">500+ Saved</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cons. Fee</p>
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <span className="text-xl font-black text-primary">${doctor.doctorProfile?.fees}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <button className="p-4 rounded-2xl bg-slate-50 text-slate-400 hover:text-primary transition-colors border border-slate-100 group">
              <Heart className="h-6 w-6 group-hover:fill-current" />
            </button>
            <button className="p-4 rounded-2xl bg-slate-50 text-slate-400 hover:text-primary transition-colors border border-slate-100">
              <Share2 className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        {/* Background Accent */}
        <div className="absolute top-0 right-0 h-64 w-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 h-48 w-48 bg-emerald-500/5 rounded-full blur-[80px] -ml-24 -mb-24" />
      </motion.section>

      <div className="grid lg:grid-cols-[2fr_1.2fr] gap-12 items-start">
        {/* 2. Left Details */}
        <div className="space-y-12">
          {/* Biography */}
          <motion.section 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-black text-secondary flex items-center gap-3">
              <div className="h-8 w-1.5 bg-primary rounded-full" />
              Biography
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed font-medium whitespace-pre-line bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
              {doctor.doctorProfile?.about || "This specialist has not provided a biography yet."}
            </p>
          </motion.section>

          {/* Education & Experience Mockup */}
          <section className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
              <h3 className="font-black text-secondary flex items-center gap-2 tracking-tight">
                <Award className="h-5 w-5 text-primary" />
                Education
              </h3>
              <ul className="space-y-4">
                <li className="border-l-2 border-slate-100 pl-4 py-1">
                  <p className="text-sm font-bold text-secondary tracking-tight">Post Graduation in Cardiology</p>
                  <p className="text-[10px] font-bold text-slate-400">Harvard Medical School (2010)</p>
                </li>
                <li className="border-l-2 border-slate-100 pl-4 py-1">
                  <p className="text-sm font-bold text-secondary tracking-tight">Doctor of Medicine (MD)</p>
                  <p className="text-[10px] font-bold text-slate-400">Johns Hopkins University (2006)</p>
                </li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
              <h3 className="font-black text-secondary flex items-center gap-2 tracking-tight">
                <Activity className="h-5 w-5 text-emerald-500" />
                Specialities
              </h3>
              <div className="flex flex-wrap gap-2">
                {[doctor.doctorProfile?.specialization, 'Heart Surgery', 'Blood Pressure', 'Consultation'].map(tag => (
                  <span key={tag} className="px-4 py-2 bg-slate-50 text-[10px] font-black text-slate-500 uppercase tracking-widest rounded-xl border border-slate-100">{tag}</span>
                ))}
              </div>
            </div>
          </section>

          {/* Reviews */}
          <section className="space-y-8">
            <h2 className="text-2xl font-black text-secondary flex items-center gap-3">
              <div className="h-8 w-1.5 bg-amber-500 rounded-full" />
              Patient Experiences
            </h2>
            <div className="grid gap-6">
              {doctor.doctorProfile?.reviews?.length > 0 ? (
                doctor.doctorProfile.reviews.map((review) => (
                  <div key={review.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary font-black">
                          {review.patient?.name?.[0]}
                        </div>
                        <div>
                          <p className="font-black text-secondary leading-none">{review.patient?.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest">Verified Patient</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-xl">
                        <Star className="h-3 w-3 text-amber-500 fill-current" />
                        <span className="text-xs font-black text-amber-700">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-slate-500 italic text-lg leading-relaxed font-medium">"{review.comment}"</p>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
                  <MessageSquare className="h-10 w-10 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-400 font-bold uppercase tracking-widest">No reviews yet</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* 3. Right Booking Card */}
        <div className="sticky top-32 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-secondary text-white rounded-[48px] p-8 lg:p-10 shadow-2xl shadow-primary/20 relative overflow-hidden"
          >
            <div className="relative z-10 space-y-10">
              <div className="space-y-4">
                <h3 className="text-3xl font-black tracking-tight leading-none uppercase">Book a Visit</h3>
                <p className="text-slate-400 text-sm font-medium">Select an available time slot for your consultation</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Available Slots
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {doctor.doctorProfile?.timeSlots?.length > 0 ? (
                      doctor.doctorProfile.timeSlots.map((slot) => (
                        <button
                          key={slot.id}
                          onClick={() => setSelectedSlot(slot)}
                          className={cn(
                            "p-4 rounded-3xl border-2 text-sm font-black transition-all",
                            selectedSlot?.id === slot.id
                              ? "bg-primary border-primary text-white shadow-xl shadow-primary/30"
                              : "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-primary/50"
                          )}
                        >
                          <p className="text-[10px] opacity-60 uppercase mb-1">{new Date(slot.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                          <p className="text-base">{slot.startTime}</p>
                        </button>
                      ))
                    ) : (
                      <div className="col-span-2 py-8 text-center text-slate-600 font-bold uppercase tracking-widest text-xs border border-dashed border-slate-700 rounded-3xl">No slots available</div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                    <ClipboardList className="h-4 w-4" />
                    Visit Reason
                  </label>
                  <textarea
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="Briefly describe your symptoms..."
                    className="w-full p-6 bg-slate-800/50 border border-slate-700/50 rounded-3xl focus:ring-2 focus:ring-primary outline-none min-h-[120px] text-sm font-medium placeholder:text-slate-600"
                  ></textarea>
                </div>

                <button
                  disabled={booking || !selectedSlot || (user && user.role !== 'PATIENT')}
                  onClick={handleBooking}
                  className="w-full py-5 bg-primary text-white font-black rounded-full hover:bg-primary/90 disabled:bg-slate-700 disabled:cursor-not-allowed transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 group"
                >
                  {booking ? 'Processing...' : user?.role === 'DOCTOR' ? 'Patient Only Access' : 'Confirm Appointment'}
                  {!booking && <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />}
                </button>
              </div>
            </div>
            
            {/* Background design */}
            <div className="absolute top-0 right-0 h-48 w-48 bg-primary/10 rounded-full blur-[80px] -mr-24 -mt-24" />
          </motion.div>

          {/* Quick Support Card */}
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex items-center gap-6">
            <div className="h-14 w-14 bg-emerald-50 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Stethoscope className="h-7 w-7 text-emerald-500" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Need Help?</p>
              <p className="text-sm font-bold text-secondary">Contact support for instant assistance with booking.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
