import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Stethoscope, LogOut, User, LayoutDashboard, ChevronDown } from 'lucide-react';
import { cn } from '../utils/cn';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      {/* Top green accent border */}
      <div className="h-1.5 w-full bg-accent sticky top-0 z-[60]" />
      
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-1.5 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="bg-primary p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-primary/20">
                  <Stethoscope className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-black text-secondary tracking-tight">MediConnect</span>
              </Link>
              
              <div className="hidden lg:ml-12 lg:flex lg:space-x-8">
                {['Find Doctors', 'Specialities', 'About'].map((item) => (
                  <Link 
                    key={item}
                    to={item === 'Find Doctors' ? '/doctors' : '#'} 
                    className="inline-flex items-center px-1 pt-1 text-sm font-semibold text-slate-600 hover:text-primary transition-colors relative group"
                  >
                    {item}
                    <span className="absolute bottom-4 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-6">
              {user ? (
                <div className="flex items-center gap-6">
                  <Link to={user.role === 'DOCTOR' ? '/doctor/dashboard' : user.role === 'ADMIN' ? '/admin/dashboard' : '/patient/dashboard'} 
                    className="hidden sm:flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-primary transition-colors bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                  
                  <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-bold text-secondary leading-none">{user.name}</p>
                      <p className="text-[10px] font-black text-accent uppercase tracking-tighter mt-1">{user.role}</p>
                    </div>
                    
                    <button className="flex items-center gap-1 group">
                      <div className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center border-2 border-slate-100 overflow-hidden transition-all group-hover:border-primary/30 shadow-sm",
                        user.avatar ? "" : "bg-primary/5 text-primary"
                      )}>
                        {user.avatar ? (
                          <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover" />
                        ) : (
                          <User className="h-5 w-5" />
                        )}
                      </div>
                    </button>

                    <button 
                      onClick={handleLogout}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <LogOut className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/login" className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:text-secondary transition-colors">
                    Sign in
                  </Link>
                  <Link to="/register" className="px-8 py-3 text-sm font-bold text-white bg-primary hover:bg-primary/90 rounded-full shadow-lg shadow-primary/20 hover:shadow-xl transition-all hover:-translate-y-0.5">
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
