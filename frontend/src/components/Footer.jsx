import { Link } from 'react-router-dom';
import { Stethoscope, Github, Twitter, Linkedin, Facebook, MapPin, Phone, Mail, Send } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0F172A] text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          {/* Column 1: Brand */}
          <div className="space-y-8">
            <Link to="/" title="MediConnect Home" className="flex items-center gap-3 group">
              <div className="bg-[#1565C0] p-3 rounded-2xl group-hover:rotate-12 transition-transform duration-500 shadow-lg shadow-blue-500/20">
                <Stethoscope className="h-7 w-7 text-white" />
              </div>
              <span className="text-3xl font-black text-white uppercase tracking-tighter">MediConnect</span>
            </Link>
            <p className="text-slate-400 leading-relaxed text-sm font-bold">
              Connecting you with India's most trusted medical specialists. Experience healthcare that's digital, seamless, and patient-first.
            </p>
            <div className="flex gap-4">
              {[Twitter, Github, Linkedin, Facebook].map((Icon, i) => (
                <a key={i} href="#" aria-label={`Social Media Link ${i + 1}`} className="p-3 bg-slate-800/50 rounded-xl hover:bg-[#1565C0] hover:scale-110 transition-all duration-300 group">
                  <Icon className="h-5 w-5 text-slate-400 group-hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-10">Platform</h4>
            <ul className="space-y-5">
              {['Find Doctors', 'Specialities', 'About Us', 'Contact', 'My Bookings'].map((link) => (
                <li key={link}>
                  <Link to={`/${link.toLowerCase().replace(' ', '-')}`} className="text-sm font-bold text-slate-400 hover:text-white hover:translate-x-2 transition-all inline-block">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-10">Get in Touch</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4 group">
                <div className="p-2.5 bg-slate-800/50 rounded-xl group-hover:bg-[#1565C0] transition-colors">
                  <MapPin className="h-4 w-4 text-slate-400 group-hover:text-white" />
                </div>
                <span className="text-sm font-bold text-slate-400">123 Health Plaza, Digital District, Mumbai, 400001</span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="p-2.5 bg-slate-800/50 rounded-xl group-hover:bg-[#1565C0] transition-colors">
                  <Phone className="h-4 w-4 text-slate-400 group-hover:text-white" />
                </div>
                <span className="text-sm font-bold text-slate-400">+91 (22) 2345-6789</span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="p-2.5 bg-slate-800/50 rounded-xl group-hover:bg-[#1565C0] transition-colors">
                  <Mail className="h-4 w-4 text-slate-400 group-hover:text-white" />
                </div>
                <span className="text-sm font-bold text-slate-400">care@mediconnect.com</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Download */}
          <div className="space-y-10">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-10">Download Our App</h4>
            <div className="space-y-4">
              <button aria-label="Get it on Google Play" className="w-full bg-slate-800/50 p-4 rounded-2xl flex items-center gap-4 border border-slate-700 hover:bg-slate-800 hover:border-slate-600 transition group">
                <div className="h-10 w-10 bg-black rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center p-1">
                    <div className="w-full h-full bg-black rounded-full" />
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-[8px] font-black uppercase text-slate-500">Get it on</p>
                  <p className="text-sm font-black text-white">Google Play</p>
                </div>
              </button>
              <button aria-label="Download on the App Store" className="w-full bg-slate-800/50 p-4 rounded-2xl flex items-center gap-4 border border-slate-700 hover:bg-slate-800 hover:border-slate-600 transition group">
                <div className="h-10 w-10 bg-black rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white rounded-md" />
                </div>
                <div className="text-left">
                  <p className="text-[8px] font-black uppercase text-slate-500">Download on the</p>
                  <p className="text-sm font-black text-white">App Store</p>
                </div>
              </button>
            </div>
            <div className="p-6 bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl space-y-3 shadow-2xl shadow-blue-500/20">
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-200">New Feature</p>
              <h5 className="text-sm font-black text-white">AI Symptom Checker is now Live!</h5>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
            © {new Date().getFullYear()} MediConnect Healthcare. All rights reserved.
          </p>
          <div className="flex items-center gap-8">
            <Link to="#" className="text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">Privacy</Link>
            <Link to="#" className="text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">Terms</Link>
            <div className="h-1 w-1 rounded-full bg-slate-800" />
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              Built for <span className="text-[#1565C0] font-black">Digital India</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
