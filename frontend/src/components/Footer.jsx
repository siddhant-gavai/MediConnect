import { Link } from 'react-router-dom';
import { Stethoscope, Github, Twitter, Linkedin, Facebook, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-secondary text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Column 1: Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="bg-primary p-2 rounded-xl">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">MediConnect</span>
            </Link>
            <p className="text-slate-400 leading-relaxed text-sm">
              Making healthcare accessible, reliable, and modern. Connecting patients with verified medical experts across 50+ specialities.
            </p>
            <div className="flex gap-4">
              {[Twitter, Github, Linkedin, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-primary transition-colors duration-300">
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {['Find Doctors', 'About Us', 'Contact', 'Terms of Service', 'Privacy Policy'].map((link) => (
                <li key={link}>
                  <Link to="#" className="text-slate-400 hover:text-white hover:translate-x-1 transition-all inline-block">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Specialities */}
          <div>
            <h4 className="text-lg font-bold mb-6">Popular Specialities</h4>
            <ul className="space-y-4">
              {['Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 'Orthopedics'].map((spec) => (
                <li key={spec}>
                  <Link to="/doctors" className="text-slate-400 hover:text-white hover:translate-x-1 transition-all inline-block">
                    {spec}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="text-lg font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-400">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <span>123 Medical Plaza, Health Avenue, Digital City, 560001</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span>+1 (234) 567-890</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span>support@mediconnect.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} MediConnect. All rights reserved.
          </p>
          <p className="text-slate-500 text-sm flex items-center gap-1">
            Made with <span className="text-red-500">❤️</span> for better healthcare.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
