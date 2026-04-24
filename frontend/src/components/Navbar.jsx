import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id) => {
    if (location.pathname !== '/') {
      navigate('/#' + id);
      // We might need a small delay or a useEffect in Home to handle this, 
      // but for now, navigating to Home and letting the user scroll is fine.
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <Stethoscope className="h-8 w-8 text-[#2563EB]" />
            <span className="text-xl font-extrabold text-[#0F172A]">MediConnect</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-[#475569]">
            <Link to="/doctors" className="hover:text-[#2563EB] transition-colors font-bold">Find Doctors</Link>
            <button onClick={() => scrollToSection('specialities')} className="hover:text-[#2563EB] transition-colors font-bold">Specialities</button>
            <button onClick={() => scrollToSection('how-it-works')} className="hover:text-[#2563EB] transition-colors font-bold">How it Works</button>
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
  );
};

export default Navbar;
