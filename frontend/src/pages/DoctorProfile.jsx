import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Star, MapPin, Building2, Clock, IndianRupee, 
  ArrowLeft, CheckCircle, Calendar, GraduationCap, 
  Stethoscope, Info, Phone, Mail, Award
} from 'lucide-react';
import doctorsData from '../data/doctors';

const DoctorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", 
    "2:00 PM", "3:00 PM", "4:00 PM", 
    "5:00 PM", "6:00 PM"
  ];

  useEffect(() => {
    const foundDoctor = doctorsData.find(d => d.id === parseInt(id));
    if (foundDoctor) {
      setDoctor(foundDoctor);
    } else {
      navigate('/doctors');
    }
    window.scrollTo(0, 0);
  }, [id, navigate]);

  if (!doctor) return null;

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const handleBooking = () => {
    if (!selectedSlot) return alert("Please select a time slot first!");
    navigate(`/book/${doctor.id}?slot=${selectedSlot}`);
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20">
      {/* Header / Hero Area */}
      <div className="bg-white border-b border-slate-200 pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/doctors" className="inline-flex items-center gap-2 text-slate-500 font-bold hover:text-[#1565C0] transition mb-8 group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Doctors
          </Link>

          <div className="flex flex-col md:flex-row gap-10 items-start">
            {/* Avatar Section */}
            <div className="h-40 w-40 rounded-3xl bg-[#1565C0] flex items-center justify-center text-white text-5xl font-black shadow-2xl shrink-0 ring-8 ring-blue-50">
              {getInitials(doctor.name)}
            </div>

            {/* Info Section */}
            <div className="space-y-6 flex-1">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-4xl font-black text-slate-900 tracking-tight">{doctor.name}</h1>
                  <span className="px-4 py-1.5 bg-blue-50 text-[#1565C0] text-xs font-black uppercase tracking-widest rounded-full border border-blue-100">
                    {doctor.speciality}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-lg border border-amber-100">
                    <Star size={16} className="fill-amber-400 text-amber-400" />
                    <span className="text-sm font-black text-amber-700">{doctor.rating}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-400">({doctor.reviews} Patient Reviews)</span>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <MapPin size={16} />
                    <span className="text-sm font-bold">{doctor.location}, India</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Experience</p>
                  <p className="text-lg font-black text-slate-900">{doctor.exp} Years</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Fee</p>
                  <p className="text-lg font-black text-[#1565C0]">₹{doctor.fee}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Satisfied Patients</p>
                  <p className="text-lg font-black text-slate-900">98%</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Availability</p>
                  <p className="text-lg font-black text-green-600">Available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* About Section */}
            <section className="space-y-4">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                <Info size={24} className="text-[#1565C0]" />
                About {doctor.name}
              </h3>
              <p className="text-slate-600 font-medium leading-relaxed text-lg">
                {doctor.name} is a highly skilled and compassionate {doctor.speciality} specialist with over {doctor.exp} years of experience in providing exceptional healthcare services. Known for their meticulous approach and patient-centric care, Dr. {doctor.name.split(' ')[1]} has successfully treated thousands of patients at {doctor.hospital}. Their expertise in {doctor.speciality.toLowerCase()} and commitment to medical excellence makes them one of the most trusted names in {doctor.location}.
              </p>
            </section>

            {/* Education & Experience */}
            <div className="grid md:grid-cols-2 gap-10">
              <section className="space-y-6">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                  <GraduationCap size={24} className="text-[#1565C0]" />
                  Education
                </h3>
                <div className="relative pl-8 border-l-2 border-slate-100 space-y-8">
                  <div className="relative">
                    <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-[#1565C0] ring-4 ring-blue-50" />
                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{doctor.edu.split(' – ')[1] || 'Medical Institute'}</p>
                    <p className="text-sm font-bold text-slate-500 uppercase">{doctor.edu.split(' – ')[0]}</p>
                    <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Graduated with Distinction</p>
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                  <Building2 size={24} className="text-[#1565C0]" />
                  Hospital Affiliations
                </h3>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="bg-blue-50 p-3 rounded-xl">
                    <Stethoscope className="text-[#1565C0]" />
                  </div>
                  <div>
                    <p className="text-lg font-black text-slate-900 uppercase tracking-tight">{doctor.hospital}</p>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{doctor.location}, India</p>
                  </div>
                </div>
              </section>
            </div>

            {/* Specialties & Skills */}
            <section className="space-y-6">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                <Award size={24} className="text-[#1565C0]" />
                Specializations
              </h3>
              <div className="flex flex-wrap gap-3">
                {["General Consultation", "Critical Care", doctor.speciality, "Diagnostic Procedures", "Preventative Care"].map(skill => (
                  <span key={skill} className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-black text-slate-700 uppercase tracking-widest shadow-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          </div>

          {/* Booking Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-8 sticky top-24">
              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Book Appointment</h3>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Select an available time slot</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {timeSlots.map(slot => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-3 rounded-xl text-sm font-black transition-all border-2 ${
                      selectedSlot === slot 
                        ? 'bg-[#1565C0] border-[#1565C0] text-white shadow-lg shadow-blue-100' 
                        : 'bg-slate-50 border-transparent text-slate-600 hover:border-[#1565C0] hover:bg-white'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Consultation Fee</span>
                  <span className="text-xl font-black text-slate-900">₹{doctor.fee}</span>
                </div>
                <div className="flex justify-between items-center text-[#1565C0]">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} />
                    <span className="text-xs font-black uppercase tracking-widest">Instant Booking</span>
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest">No extra charges</span>
                </div>
              </div>

              <button 
                onClick={handleBooking}
                disabled={!selectedSlot}
                className={`w-full py-4 rounded-2xl font-black uppercase tracking-[0.2em] transition-all shadow-xl ${
                  selectedSlot 
                    ? 'bg-[#1565C0] text-white hover:bg-blue-800 shadow-blue-100' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                }`}
              >
                Book This Slot
              </button>

              <div className="flex flex-col gap-4 text-center">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Or contact support</p>
                <div className="flex justify-center gap-6">
                  <Link to="#" className="text-slate-400 hover:text-[#1565C0] transition"><Phone size={20} /></Link>
                  <Link to="#" className="text-slate-400 hover:text-[#1565C0] transition"><Mail size={20} /></Link>
                  <Link to="#" className="text-slate-400 hover:text-[#1565C0] transition"><Calendar size={20} /></Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
