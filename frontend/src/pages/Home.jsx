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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showCityChips, setShowCityChips] = useState(false);

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
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gradient-to-b from-white to-[#EFF6FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="inline-block bg-white px-5 py-2 rounded-full border border-blue-100 shadow-sm">
                <p className="text-xs font-black text-[#1565C0] uppercase tracking-widest flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-[#1565C0] animate-pulse" />
                  India's Most Trusted Medical Network
                </p>
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
                <Typewriter texts={["Find the Right Doctor", "Book Appointments Instantly", "Get Expert Care at Home"]} />
              </h1>
              <p className="text-lg text-slate-500 max-w-lg leading-relaxed font-bold">
                Connect with verified medical professionals instantly. Manage health records and get expert consultation from the comfort of your home.
              </p>
              <div className="flex flex-wrap gap-5">
                <Link to="/doctors" className="group bg-[#1565C0] text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 hover:bg-blue-800 transition shadow-2xl shadow-blue-100 active:scale-95">
                  Book Appointment 
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </Link>
                <button 
                  onClick={() => scrollToSection('how-it-works')}
                  className="ripple-btn border-2 border-slate-200 text-slate-600 px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:border-[#1565C0] hover:text-[#1565C0] transition active:scale-95 bg-white"
                >
                  How it works
                </button>
              </div>
            </motion.div>

            {/* Hero Stats Card */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="bg-white p-10 rounded-[48px] border border-blue-50 shadow-2xl relative z-10 space-y-10 animate-float">
                <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-1">
                    <p className="text-4xl font-black text-slate-900">15k+</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Verified Doctors</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-4xl font-black text-[#1565C0]">50+</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Specialities</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-4xl font-black text-slate-900">100%</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Safe & Secure</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-4xl font-black text-[#1565C0]">4.9★</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Patient Rating</p>
                  </div>
                </div>
                <div className="pt-10 border-t border-slate-50 flex items-center gap-4">
                  <div className="flex -space-x-4">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="h-12 w-12 rounded-full border-4 border-white bg-slate-100 overflow-hidden shadow-sm">
                        <img src={`https://i.pravatar.cc/150?u=${i+10}`} className="w-full h-full object-cover" alt="User" />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs font-black text-slate-500 tracking-tight">Joined by <span className="text-[#1565C0]">500+</span> new patients today</p>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-blue-600/5 rounded-full blur-3xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. STATS COUNTER SECTION */}
      {/* Already implemented in previous step */}

      {/* 4. SEARCH BAR SECTION */}
      <div className="max-w-5xl mx-auto px-4 -mt-16 relative z-30">
        <div className="bg-white p-6 rounded-[32px] border border-blue-50 shadow-2xl space-y-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative group">
              <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 rounded-2xl border border-transparent focus-within:border-[#1565C0] focus-within:bg-white transition-all">
                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-[#1565C0]" />
                <input 
                  type="text" 
                  placeholder="Speciality (e.g. Cardiology)" 
                  className="bg-transparent border-none outline-none text-sm font-black w-full text-slate-700 placeholder:text-slate-300"
                  value={searchParams.speciality}
                  onChange={(e) => setSearchParams({ ...searchParams, speciality: e.target.value })}
                  onFocus={() => setShowSuggestions(true)}
                />
              </div>
              {showSuggestions && searchParams.speciality && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-50 py-2 z-40 max-h-60 overflow-y-auto">
                  {specialities
                    .filter(s => s.name.toLowerCase().includes(searchParams.speciality.toLowerCase()))
                    .map(s => (
                      <button 
                        key={s.name}
                        onClick={() => {
                          setSearchParams({ ...searchParams, speciality: s.name });
                          setShowSuggestions(false);
                        }}
                        className="w-full text-left px-6 py-3 text-xs font-black text-slate-500 hover:bg-slate-50 hover:text-[#1565C0] transition uppercase tracking-widest"
                      >
                        {s.name}
                      </button>
                    ))
                  }
                </div>
              )}
            </div>

            <div className="relative group">
              <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 rounded-2xl border border-transparent focus-within:border-[#1565C0] focus-within:bg-white transition-all">
                <MapPin className="h-5 w-5 text-slate-400 group-focus-within:text-[#1565C0]" />
                <input 
                  type="text" 
                  placeholder="Location" 
                  className="bg-transparent border-none outline-none text-sm font-black w-full text-slate-700 placeholder:text-slate-300"
                  value={searchParams.location}
                  onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                  onFocus={() => setShowCityChips(true)}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 rounded-2xl border border-transparent focus-within:border-[#1565C0] focus-within:bg-white transition-all">
              <Calendar className="h-5 w-5 text-slate-400 focus-within:text-[#1565C0]" />
              <input 
                type="date" 
                className="bg-transparent border-none outline-none text-sm font-black w-full text-slate-700"
                value={searchParams.date}
                onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
              />
            </div>

            <button 
              onClick={handleSearch}
              className="bg-[#1565C0] text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-800 transition shadow-xl shadow-blue-100 flex items-center justify-center gap-2 active:scale-95"
            >
              <Search className="h-5 w-5" /> Search
            </button>
          </div>

          {showCityChips && (
            <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
              {['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai'].map(city => (
                <button
                  key={city}
                  onClick={() => {
                    setSearchParams({ ...searchParams, location: city });
                    setShowCityChips(false);
                  }}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    searchParams.location === city 
                      ? 'bg-[#1565C0] text-white shadow-lg shadow-blue-100' 
                      : 'bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-[#1565C0]'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>


      {/* 4. SPECIALITIES SECTION */}
      <section id="specialities" className="py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight">Browse by Speciality</h2>
            <p className="text-slate-500 max-w-2xl mx-auto font-bold uppercase tracking-widest text-xs">Find the right specialist for your health needs</p>
            <div className="h-1.5 w-20 bg-[#1565C0] mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
            {specialities.map((spec, i) => (
              <motion.div 
                key={i} 
                whileHover={{ scale: 1.05, translateY: -5 }}
                onClick={() => navigate(`/doctors?speciality=${spec.slug}`)}
                className="group relative p-8 rounded-[32px] border border-slate-50 hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-100 transition-all cursor-pointer text-center bg-white"
              >
                {(spec.name === 'Cardiology' || spec.name === 'Pediatrics') && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1565C0] text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-blue-100 z-10 whitespace-nowrap">
                    Most Popular
                  </div>
                )}
                <div className="bg-slate-50 p-5 rounded-2xl group-hover:bg-blue-50 transition-colors mb-6 inline-block">
                  <spec.icon className={`h-8 w-8 transition-all ${
                    spec.name === 'Cardiology' || spec.name === 'Pediatrics' ? 'text-[#1565C0] fill-blue-100' : 'text-slate-400 group-hover:text-[#1565C0] group-hover:fill-blue-100'
                  }`} />
                </div>
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">{spec.name}</h4>
                <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="h-1 w-8 bg-[#1565C0] mx-auto rounded-full" />
                </div>
              </motion.div>
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

    </div>
  );
};

export default Home;
