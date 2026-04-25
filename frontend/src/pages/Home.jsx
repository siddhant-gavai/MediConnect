import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { 
  Stethoscope, Search, MapPin, Calendar, Heart, Brain, Bone, 
  Eye, Baby, Sun, Activity, Star, ArrowRight, Github, 
  Twitter, Linkedin, Facebook, MapPin as MapPinIcon, Phone, Mail, User
} from 'lucide-react';
import doctorsData from '../data/doctors';
import DoctorCard from '../components/DoctorCard';

const Counter = ({ end, duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      let start = 0;
      const endVal = parseFloat(end);
      if (isNaN(endVal)) return;
      
      const totalMiliseconds = duration * 1000;
      const incrementTime = totalMiliseconds / endVal;
      
      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start >= endVal) clearInterval(timer);
      }, incrementTime);
      
      return () => clearInterval(timer);
    }
  }, [inView, end, duration]);

  return <span ref={ref}>{count}{end.includes('+') ? '+' : ''}{end.includes('.') ? '' : ''}</span>;
};

const Typewriter = ({ texts }) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (subIndex === texts[index].length + 1 && !reverse) {
      setTimeout(() => setReverse(true), 2000);
      return;
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % texts.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 75 : 150);

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, texts]);

  return (
    <span className="typewriter-cursor">
      {texts[index].substring(0, subIndex)}
    </span>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [searchParams, setSearchParams] = useState({
    speciality: '',
    location: '',
    date: ''
  });
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchTopDoctors = async () => {
      try {
        const { data } = await api.get('/doctors');
        if (data.success) {
          setDoctors(data.data.slice(0, 3));
        }
      } catch (error) {
        console.error('Failed to load doctors');
      }
    };
    fetchTopDoctors();
  }, []);

  const specialities = [
    { name: 'Cardiology', icon: Heart, count: 120, slug: 'Cardiology' },
    { name: 'Neurology', icon: Brain, count: 85, slug: 'Neurology' },
    { name: 'Orthopedic', icon: Bone, count: 94, slug: 'Orthopedic' },
    { name: 'Ophthalmology', icon: Eye, count: 76, slug: 'Ophthalmology' },
    { name: 'Pediatrics', icon: Baby, count: 142, slug: 'Pediatrics' },
    { name: 'Dermatology', icon: Sun, count: 110, slug: 'Dermatology' },
    { name: 'Dental', icon: Activity, count: 156, slug: 'Dental' },
    { name: 'Psychiatry', icon: Brain, count: 64, slug: 'Psychiatry' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (searchParams.speciality) query.set('specialization', searchParams.speciality);
    if (searchParams.location) query.set('location', searchParams.location);
    if (searchParams.date) query.set('date', searchParams.date);
    navigate(`/doctors?${query.toString()}`);
  };


  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-[#475569]">
      {/* 1. NAVBAR */}
      {/* Navbar is now global in App.jsx */}

      {/* 2. HERO SECTION */}
      <section className="bg-[#EFF6FF] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="inline-block bg-white px-4 py-1.5 rounded-full border border-[#E2E8F0] shadow-sm">
                <p className="text-xs font-bold text-[#10B981] uppercase tracking-widest">🏥 Trusted Healthcare Partner</p>
              </div>
              <h1 className="text-4xl lg:text-6xl font-black text-[#0F172A] leading-tight">
                <Typewriter texts={["Find Doctors", "Book Instantly", "Get Expert Care"]} /> <br />
                <span className="text-[#2563EB]">Near You</span>
              </h1>
              <p className="text-lg text-[#475569] max-w-lg leading-relaxed">
                Connect with verified medical professionals instantly. Book appointments, manage health records, and get expert consultation from the comfort of your home.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/doctors" className="bg-[#2563EB] text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition shadow-md">
                  Book Appointment <ArrowRight className="h-5 w-5" />
                </Link>
                <button 
                  onClick={() => scrollToSection('how-it-works')}
                  className="border border-[#2563EB] text-[#2563EB] px-8 py-3.5 rounded-xl font-bold hover:bg-blue-50 transition"
                >
                  How it works
                </button>
              </div>
            </motion.div>

            {/* Hero Stats Card */}
            <div className="relative">
              <div className="bg-white p-8 rounded-[32px] border border-[#E2E8F0] shadow-xl relative z-10 space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-3xl font-black text-[#0F172A]">500+</p>
                    <p className="text-xs font-bold text-[#475569] uppercase mt-1">Verified Doctors</p>
                  </div>
                  <div>
                    <p className="text-3xl font-black text-[#0F172A]">50+</p>
                    <p className="text-xs font-bold text-[#475569] uppercase mt-1">Specialities</p>
                  </div>
                  <div>
                    <p className="text-3xl font-black text-[#0F172A]">10k+</p>
                    <p className="text-xs font-bold text-[#475569] uppercase mt-1">Happy Patients</p>
                  </div>
                  <div>
                    <p className="text-3xl font-black text-[#0F172A]">4.9★</p>
                    <p className="text-xs font-bold text-[#475569] uppercase mt-1">Avg. Rating</p>
                  </div>
                </div>
                <div className="pt-8 border-t border-[#E2E8F0] flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {[1,2,3].map(i => (
                      <img key={i} src={`https://placehold.co/40x40?text=U${i}`} className="h-10 w-10 rounded-full border-2 border-white" alt="User" />
                    ))}
                  </div>
                  <p className="text-sm font-bold text-[#475569]">Joined by 200+ new patients today</p>
                </div>
              </div>
              
              {/* Floating Stat Cards */}
              <motion.div 
                className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 z-20 animate-float"
              >
                <p className="text-xs font-black text-blue-600">15,000+ Doctors</p>
              </motion.div>
              <motion.div 
                className="absolute top-1/2 -right-12 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 z-20 animate-float-delayed"
              >
                <p className="text-xs font-black text-green-600">50k+ Patients</p>
              </motion.div>
              <motion.div 
                className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 z-20 animate-float-slow"
              >
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-amber-500 fill-current" />
                  <p className="text-xs font-black text-amber-600">4.9 Avg Rating</p>
                </div>
              </motion.div>

              {/* Decorative Blur */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-100/50 rounded-full blur-3xl -z-0" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. STATS COUNTER SECTION */}
      <section className="bg-blue-600 py-16 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <p className="text-4xl md:text-5xl font-black"><Counter end="15000" />+</p>
              <p className="text-sm font-bold text-blue-100 uppercase tracking-widest">Verified Doctors</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl md:text-5xl font-black"><Counter end="50000" />+</p>
              <p className="text-sm font-bold text-blue-100 uppercase tracking-widest">Happy Patients</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl md:text-5xl font-black"><Counter end="100" />+</p>
              <p className="text-sm font-bold text-blue-100 uppercase tracking-widest">Cities Covered</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl md:text-5xl font-black"><Counter end="4" />.9/5</p>
              <p className="text-sm font-bold text-blue-100 uppercase tracking-widest">Average Rating</p>
            </div>
          </div>
        </div>
        {/* Decorative background patterns */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-24 h-24 border-4 border-white rounded-full" />
          <div className="absolute bottom-10 right-10 w-32 h-32 border-4 border-white rounded-full opacity-20" />
        </div>
      </section>

      {/* 4. SEARCH BAR SECTION */}
      <div className="max-w-5xl mx-auto px-4 -mt-10 relative z-30">
        <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xl grid md:grid-cols-4 gap-2">
          <div className="flex items-center gap-3 px-4 py-3 bg-[#F8FAFC] rounded-xl border border-transparent focus-within:border-[#2563EB] transition">
            <Search className="h-5 w-5 text-[#475569]" />
            <input 
              type="text" 
              placeholder="Speciality / Name" 
              className="bg-transparent border-none outline-none text-sm font-bold w-full"
              value={searchParams.speciality}
              onChange={(e) => setSearchParams({ ...searchParams, speciality: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-3 px-4 py-3 bg-[#F8FAFC] rounded-xl border border-transparent focus-within:border-[#2563EB] transition">
            <MapPin className="h-5 w-5 text-[#475569]" />
            <input 
              type="text" 
              placeholder="Location" 
              className="bg-transparent border-none outline-none text-sm font-bold w-full"
              value={searchParams.location}
              onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-3 px-4 py-3 bg-[#F8FAFC] rounded-xl border border-transparent focus-within:border-[#2563EB] transition">
            <Calendar className="h-5 w-5 text-[#475569]" />
            <input 
              type="date" 
              className="bg-transparent border-none outline-none text-sm font-bold w-full text-[#475569]"
              value={searchParams.date}
              onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
            />
          </div>
          <button 
            onClick={handleSearch}
            className="bg-[#2563EB] text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg flex items-center justify-center gap-2"
          >
            <Search className="h-5 w-5" /> Search
          </button>
        </div>
      </div>

      {/* 4. SPECIALITIES SECTION */}
      <section id="specialities" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-black text-[#0F172A]">Browse by Speciality</h2>
            <p className="text-[#475569] max-w-2xl mx-auto font-medium">Get instant consultation with our top specialists across various medical fields.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {specialities.map((spec, i) => (
              <div 
                key={i} 
                onClick={() => navigate(`/doctors?specialization=${spec.slug}`)}
                className="group p-6 rounded-2xl border border-[#E2E8F0] hover:border-[#2563EB] hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer text-center bg-white"
              >
                <div className="bg-[#F8FAFC] p-4 rounded-xl group-hover:bg-[#EFF6FF] transition mb-4 inline-block">
                  <spec.icon className="h-8 w-8 text-[#2563EB]" />
                </div>
                <h4 className="text-sm font-bold text-[#0F172A]">{spec.name}</h4>
                <p className="text-[10px] font-bold text-[#475569] mt-1 uppercase tracking-tighter">{spec.count} Doctors</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW: FEATURED DOCTORS SECTION */}
      <section className="py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="space-y-4">
              <h2 className="text-3xl font-black text-[#0F172A]">Featured Doctors</h2>
              <p className="text-[#475569] font-medium">Trusted by thousands of patients across India</p>
            </div>
            <Link to="/doctors" className="text-[#1565C0] font-black uppercase tracking-widest text-sm flex items-center gap-2 hover:gap-3 transition-all">
              View All Doctors <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {doctorsData
              .filter(d => d.available)
              .sort((a, b) => b.rating - a.rating)
              .slice(0, 8)
              .map((doc) => (
                <DoctorCard key={doc.id} doctor={doc} />
              ))
            }
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-24 bg-white border-t border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-3xl font-black text-[#0F172A]">How it Works</h2>
            <p className="text-[#475569] max-w-2xl mx-auto font-medium">Get the medical care you need in just four simple steps.</p>
          </div>
          
          <div className="relative">
            {/* Connecting Dotted Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full border-t-2 border-dotted border-slate-200 -z-0" />
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
              {[
                { 
                  title: 'Search Specialists', 
                  desc: 'Find the right doctor based on speciality or location.',
                  icon: Search,
                  color: 'bg-blue-600 text-white'
                },
                { 
                  title: 'Choose Doctor', 
                  desc: 'Check ratings, experience, and fees before picking.',
                  icon: User,
                  color: 'bg-blue-600 text-white'
                },
                { 
                  title: 'Book Slot', 
                  desc: 'Schedule your appointment with a single click.',
                  icon: Calendar,
                  color: 'bg-blue-600 text-white'
                },
                { 
                  title: 'Consult', 
                  desc: 'Meet your doctor at the hospital or online.',
                  icon: Activity,
                  color: 'bg-blue-600 text-white'
                }
              ].map((step, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2 }}
                  viewport={{ once: true }}
                  className="text-center space-y-6"
                >
                  <div className="relative inline-block">
                    <div className={`h-20 w-20 ${step.color} rounded-full flex items-center justify-center mx-auto shadow-xl ring-8 ring-white`}>
                      <step.icon className="h-10 w-10" />
                    </div>
                    <div className="absolute -top-2 -right-2 h-8 w-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-black text-sm border-4 border-white">
                      {i + 1}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-[#0F172A] uppercase tracking-tight">{step.title}</h3>
                  <p className="text-[#475569] text-sm leading-relaxed max-w-[200px] mx-auto font-medium">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. PATIENT TESTIMONIALS SECTION */}
      <section className="py-24 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-black text-[#0F172A]">What our patients say</h2>
            <p className="text-[#475569] font-medium italic">Join thousands of satisfied patients who trust MediConnect.</p>
          </div>

          <div className="relative h-[300px] md:h-[250px]">
            <AnimatePresence mode="wait">
              <motion.div 
                key={testimonialIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 grid md:grid-cols-3 gap-8"
              >
                {[
                  {
                    text: "Dr. Sharma was amazing! Got appointment same day.",
                    author: "Rahul M",
                    location: "Delhi",
                    stars: 5
                  },
                  {
                    text: "Easy to use, found a pediatrician in minutes.",
                    author: "Sneha K",
                    location: "Mumbai",
                    stars: 5
                  },
                  {
                    text: "Best platform for online doctor consultation.",
                    author: "Amit V",
                    location: "Bangalore",
                    stars: 5
                  }
                ].map((item, i) => (
                  <div key={i} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6 flex flex-col justify-between">
                    <div className="flex gap-1">
                      {[...Array(item.stars)].map((_, s) => (
                        <Star key={s} className="h-4 w-4 text-amber-500 fill-current" />
                      ))}
                    </div>
                    <p className="text-slate-600 font-medium italic leading-relaxed">"{item.text}"</p>
                    <div>
                      <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{item.author}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.location}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
          
          <div className="flex justify-center gap-2 mt-12">
            {[0, 1, 2].map((i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-500 ${testimonialIndex === i ? 'w-8 bg-blue-600' : 'w-2 bg-slate-200'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 7. TOP DOCTORS SECTION */}
      <section className="py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="space-y-4">
              <h2 className="text-3xl font-black text-[#0F172A]">Top Rated Doctors</h2>
              <p className="text-[#475569] font-medium">Handpicked healthcare professionals for your safety and well-being.</p>
            </div>
            <Link to="/doctors" className="text-[#2563EB] font-bold flex items-center gap-1 hover:gap-2 transition-all">View All <ArrowRight className="h-5 w-5" /></Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {doctors.map((doc, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden hover:shadow-xl transition flex flex-col">
                <div className="h-64 bg-slate-100 relative">
                  <img src={doc.avatar || `https://placehold.co/400x300?text=Dr.+${doc.name}`} className="w-full h-full object-cover" alt={doc.name} />
                  <div className="absolute top-4 left-4 bg-[#10B981] text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" /> Available
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-black text-[#0F172A] uppercase tracking-tight">{doc.name}</h3>
                      <p className="text-xs font-bold text-[#10B981] uppercase tracking-widest">{doc.doctorProfile?.specialization}</p>
                    </div>
                    <div className="bg-amber-50 px-2 py-1 rounded border border-amber-100 flex items-center gap-1">
                      <Star className="h-3 w-3 text-amber-500 fill-current" />
                      <span className="text-xs font-black text-amber-700">{doc.doctorProfile?.rating || '4.9'}</span>
                    </div>
                  </div>
                  <div className="flex gap-4 pt-2">
                    <div className="flex-1 text-center py-2 bg-[#F8FAFC] rounded-lg">
                      <p className="text-[10px] font-bold text-[#475569] uppercase tracking-widest mb-1">Exp.</p>
                      <p className="text-sm font-bold text-[#0F172A]">{doc.doctorProfile?.experience} Yrs</p>
                    </div>
                    <div className="flex-1 text-center py-2 bg-[#F8FAFC] rounded-lg">
                      <p className="text-[10px] font-bold text-[#475569] uppercase tracking-widest mb-1">Fee</p>
                      <p className="text-sm font-bold text-[#2563EB]">${doc.doctorProfile?.fees}</p>
                    </div>
                  </div>
                  <Link to={`/book/${doc.id}`} className="w-full bg-[#2563EB] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition">
                    Book Now <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="bg-blue-600 text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 pb-16 border-b border-blue-500">
            <div className="space-y-6">
              <Link to="/" className="flex items-center gap-2">
                <Stethoscope className="h-8 w-8 text-white" />
                <span className="text-xl font-extrabold text-white">MediConnect</span>
              </Link>
              <p className="text-blue-100 text-sm leading-relaxed max-w-xs">
                Empowering access to quality healthcare. Verified doctors at your fingertips for all your medical needs.
              </p>
              <div className="flex gap-4">
                {[Twitter, Github, Linkedin, Facebook].map((Icon, i) => (
                  <Link key={i} to="#" className="p-2 bg-blue-700 rounded-lg hover:bg-white hover:text-blue-600 transition duration-300">
                    <Icon className="h-5 w-5" />
                  </Link>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Quick Links</h4>
              <ul className="space-y-4 text-sm text-blue-100 font-bold">
                <li><Link to="/doctors" className="hover:text-white transition">Find Doctors</Link></li>
                <li><button onClick={() => scrollToSection('specialities')} className="hover:text-white transition text-left">Specialities</button></li>
                <li><button onClick={() => scrollToSection('how-it-works')} className="hover:text-white transition text-left">How it Works</button></li>
                <li><Link to="/my-bookings" className="hover:text-white transition">My Bookings</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Specialities</h4>
              <ul className="space-y-4 text-sm text-blue-100 font-bold">
                <li><Link to="/doctors?specialization=Cardiology" className="hover:text-white transition">Cardiology</Link></li>
                <li><Link to="/doctors?specialization=Neurology" className="hover:text-white transition">Neurology</Link></li>
                <li><Link to="/doctors?specialization=Pediatrics" className="hover:text-white transition">Pediatrics</Link></li>
                <li><Link to="/doctors?specialization=Dermatology" className="hover:text-white transition">Dermatology</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="font-bold text-white uppercase tracking-widest text-xs">Contact Us</h4>
              <ul className="space-y-4 text-sm text-blue-100 font-bold">
                <li className="flex items-start gap-3">
                  <MapPinIcon className="h-5 w-5 text-blue-200 shrink-0" />
                  <span>123 Health Ave, Medical District, NY 10001</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-blue-200 shrink-0" />
                  <span>+1 (234) 567-890</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-blue-200 shrink-0" />
                  <span>support@mediconnect.com</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="text-center text-blue-200 text-[10px] font-black uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} MediConnect. All rights reserved. Made with ❤️ for your health.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
