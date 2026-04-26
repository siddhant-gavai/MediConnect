import { Link } from 'react-router-dom';
import { Stethoscope, Github, Twitter, Linkedin, Facebook, MapPin, Phone, Mail, Send } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0F172A] text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Column 1: Brand */}
          <div className="space-y-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-[#1565C0] p-2.5 rounded-2xl group-hover:rotate-12 transition-transform duration-300">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-black text-white uppercase tracking-tighter">MediConnect</span>
            </Link>
            <p className="text-slate-400 leading-relaxed text-sm font-bold">
              Making healthcare accessible, reliable, and modern. Connecting patients with verified medical experts across 50+ specialities.
            </p>
            <div className="flex gap-4">
              {[Twitter, Github, Linkedin, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="p-3 bg-slate-800/50 rounded-xl hover:bg-[#1565C0] hover:scale-110 transition-all duration-300 group">
                  <Icon className="h-5 w-5 text-slate-400 group-hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-8">Quick Links</h4>
            <ul className="space-y-4">
              {['Find Doctors', 'About Us', 'Contact', 'Terms of Service', 'Privacy Policy'].map((link) => (
                <li key={link}>
                  <Link to="#" className="text-sm font-bold text-slate-400 hover:text-white hover:translate-x-2 transition-all inline-block">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-8">Contact Us</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4 group">
                <div className="p-2 bg-slate-800/50 rounded-lg group-hover:bg-[#1565C0] transition-colors">
                  <MapPin className="h-4 w-4 text-[#1565C0] group-hover:text-white" />
                </div>
                <span className="text-sm font-bold text-slate-400">123 Medical Plaza, Health Avenue, Digital City, 560001</span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="p-2 bg-slate-800/50 rounded-lg group-hover:bg-[#1565C0] transition-colors">
                  <Phone className="h-4 w-4 text-[#1565C0] group-hover:text-white" />
                </div>
                <span className="text-sm font-bold text-slate-400">+1 (234) 567-890</span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="p-2 bg-slate-800/50 rounded-lg group-hover:bg-[#1565C0] transition-colors">
                  <Mail className="h-4 w-4 text-[#1565C0] group-hover:text-white" />
                </div>
                <span className="text-sm font-bold text-slate-400">support@mediconnect.com</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-8">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-8">Newsletter</h4>
            <p className="text-sm font-bold text-slate-400">Subscribe to get health tips and updates.</p>
            <form className="relative group">
              <input 
                type="email" 
                placeholder="Your email" 
                className="w-full bg-slate-800/50 border-2 border-transparent focus:border-[#1565C0] outline-none rounded-2xl px-6 py-4 text-sm font-bold transition-all"
              />
              <button className="absolute right-2 top-2 p-2 bg-[#1565C0] text-white rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/20">
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>

        <div className="pt-12 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
            © {new Date().getFullYear()} MediConnect. Built for health.
          </p>
          <div className="flex items-center gap-8">
            <Link to="#" className="text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">Cookies</Link>
            <Link to="#" className="text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">Security</Link>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              Made with <span className="text-red-500 animate-pulse text-xs">❤️</span> by MediConnect Team
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
