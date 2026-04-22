import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { 
  Stethoscope, Search, MapPin, Calendar, Heart, Brain, Bone, 
  Eye, Baby, Sun, Activity, Star, ArrowRight, Github, 
  Twitter, Linkedin, Facebook, MapPin as MapPinIcon, Phone, Mail 
} from 'lucide-react';

const Home = () => {
  const { user, logout } = useAuth();
  const [doctors, setDoctors] = useState([]);

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
    { name: 'Cardiology', icon: Heart, count: 120 },
    { name: 'Neurology', icon: Brain, count: 85 },
    { name: 'Orthopedic', icon: Bone, count: 94 },
    { name: 'Ophthalmology', icon: Eye, count: 76 },
    { name: 'Pediatrics', icon: Baby, count: 142 },
    { name: 'Dermatology', icon: Sun, count: 110 },
    { name: 'Dental', icon: Activity, count: 156 },
    { name: 'Psychiatry', icon: Brain, count: 64 },
  ];

  return (
    <div className="flex flex-col min-h-screen text-[#475569]">
      {/* 1. NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center gap-2">
              <Stethoscope className="h-8 w-8 text-[#2563EB]" />
              <span className="text-xl font-extrabold text-[#0F172A]">MediConnect</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-[#475569]">
              <Link to="/doctors" className="hover:text-[#2563EB] transition-colors font-bold">Find Doctors</Link>
              <Link to="#" className="hover:text-[#2563EB] transition-colors font-bold">Specialities</Link>
              <Link to="#" className="hover:text-[#2563EB] transition-colors font-bold">About</Link>
            </div>

            <div className="flex items-center gap-4">
              {user ? (
                <button onClick={logout} className="text-sm font-bold text-[#0F172A] hover:text-[#2563EB]">Sign Out</button>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-bold text-[#0F172A] hover:text-[#2563EB]">Sign In</Link>
                  <Link to="/register" className="bg-[#2563EB] text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition shadow-sm">Get Started</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="bg-[#EFF6FF] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block bg-white px-4 py-1.5 rounded-full border border-[#E2E8F0] shadow-sm">
                <p className="text-xs font-bold text-[#10B981] uppercase tracking-widest">🏥 Trusted Healthcare Partner</p>
              </div>
              <h1 className="text-4xl lg:text-6xl font-black text-[#0F172A] leading-tight">
                Find the Best <span className="text-[#2563EB]">Doctor</span> Near You
              </h1>
              <p className="text-lg text-[#475569] max-w-lg leading-relaxed">
                Connect with verified medical professionals instantly. Book appointments, manage health records, and get expert consultation from the comfort of your home.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/doctors" className="bg-[#2563EB] text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition shadow-md">
                  Book Appointment <ArrowRight className="h-5 w-5" />
                </Link>
                <button className="border border-[#2563EB] text-[#2563EB] px-8 py-3.5 rounded-xl font-bold hover:bg-blue-50 transition">How it works</button>
              </div>
            </div>

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
              {/* Decorative Blur */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-100/50 rounded-full blur-3xl -z-0" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. SEARCH BAR SECTION */}
      <div className="max-w-5xl mx-auto px-4 -mt-10 relative z-30">
        <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xl grid md:grid-cols-4 gap-2">
          <div className="flex items-center gap-3 px-4 py-3 bg-[#F8FAFC] rounded-xl border border-transparent focus-within:border-[#2563EB] transition gap-1">
            <Search className="h-5 w-5 text-[#475569]" />
            <input type="text" placeholder="Speciality / Name" className="bg-transparent border-none outline-none text-sm font-bold w-full" />
          </div>
          <div className="flex items-center gap-3 px-4 py-3 bg-[#F8FAFC] rounded-xl border border-transparent focus-within:border-[#2563EB] transition gap-1">
            <MapPin className="h-5 w-5 text-[#475569]" />
            <input type="text" placeholder="Location" className="bg-transparent border-none outline-none text-sm font-bold w-full" />
          </div>
          <div className="flex items-center gap-3 px-4 py-3 bg-[#F8FAFC] rounded-xl border border-transparent focus-within:border-[#2563EB] transition gap-1">
            <Calendar className="h-5 w-5 text-[#475569]" />
            <input type="text" placeholder="Date" className="bg-transparent border-none outline-none text-sm font-bold w-full" />
          </div>
          <button className="bg-[#2563EB] text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg flex items-center justify-center gap-2">
            <Search className="h-5 w-5" /> Search
          </button>
        </div>
      </div>

      {/* 4. SPECIALITIES SECTION */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-black text-[#0F172A]">Browse by Speciality</h2>
            <p className="text-[#475569] max-w-2xl mx-auto font-medium">Get instant consultation with our top specialists across various medical fields.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {specialities.map((spec, i) => (
              <div key={i} className="group p-6 rounded-2xl border border-[#E2E8F0] hover:border-[#2563EB] hover:shadow-lg transition cursor-pointer text-center bg-white">
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

      {/* 5. TOP DOCTORS SECTION */}
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
                  <Link to={`/doctors/${doc.id}`} className="w-full bg-[#2563EB] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition">
                    Book Now <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="bg-[#0F172A] text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 pb-16 border-b border-slate-800">
            <div className="space-y-6">
              <Link to="/" className="flex items-center gap-2">
                <Stethoscope className="h-8 w-8 text-[#2563EB]" />
                <span className="text-xl font-extrabold text-white">MediConnect</span>
              </Link>
              <p className="text-slate-400 text-sm leading-relaxed">
                Empowering access to quality healthcare. Verified doctors at your fingertips.
              </p>
              <div className="flex gap-4">
                {[Twitter, Github, Linkedin, Facebook].map((Icon, i) => (
                  <Link key={i} to="#" className="p-2 bg-slate-800 rounded-lg hover:bg-[#2563EB] transition">
                    <Icon className="h-5 w-5" />
                  </Link>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-6">Quick Links</h4>
              <ul className="space-y-3 text-sm text-slate-400 font-medium">
                <li><Link to="/doctors" className="hover:text-white transition">Find Doctors</Link></li>
                <li><Link to="#" className="hover:text-white transition">Specialities</Link></li>
                <li><Link to="#" className="hover:text-white transition">How it Works</Link></li>
                <li><Link to="#" className="hover:text-white transition">Privacy Policy</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">Services</h4>
              <ul className="space-y-3 text-sm text-slate-400 font-medium">
                <li><Link to="#" className="hover:text-white transition">Cardiology</Link></li>
                <li><Link to="#" className="hover:text-white transition">Dermatology</Link></li>
                <li><Link to="#" className="hover:text-white transition">Pediatrics</Link></li>
                <li><Link to="#" className="hover:text-white transition">Mental Health</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="font-bold text-white">Get in touch</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li className="flex items-start gap-3">
                  <MapPinIcon className="h-5 w-5 text-[#2563EB] shrink-0" />
                  <span>123 Health Ave, Medical District, NY 10001</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-[#2563EB] shrink-0" />
                  <span>+1 (234) 567-890</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-[#2563EB] shrink-0" />
                  <span>support@mediconnect.com</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="text-center text-slate-500 text-xs">
            © {new Date().getFullYear()} MediConnect. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
