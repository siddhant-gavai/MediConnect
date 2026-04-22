import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { 
  Search, Filter, Star, Clock, User, ChevronRight, 
  MapPin, Calendar, Stethoscope, ArrowRight 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';
import toast from 'react-hot-toast';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    specialization: '',
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams(filters).toString();
      const { data } = await api.get(`/doctors?${query}`);
      if (data.success) {
        setDoctors(data.data);
      }
    } catch (error) {
      toast.error('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDoctors();
  };

  const specialities = [
    'Cardiology', 'Dermatology', 'Pediatrics', 'Neurology', 'Orthopedic', 'General'
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-2"
        >
          <div className="text-primary font-bold uppercase tracking-widest text-xs flex items-center gap-2">
            <Stethoscope className="h-4 w-4" />
            Healthcare Experts
          </div>
          <h1 className="text-4xl font-black text-secondary tracking-tight">Find your <span className="text-primary italic">specialist</span></h1>
          <p className="text-slate-500 font-medium">Browse through our directory of verified medical professionals.</p>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-[1fr_3fr] gap-10 items-start">
        {/* Sidebar Filters */}
        <aside className="space-y-8 sticky top-24">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-8">
            <div className="space-y-4">
              <h3 className="font-bold text-secondary flex items-center gap-2">
                <Filter className="h-4 w-4 text-primary" />
                Filter by Speciality
              </h3>
              <div className="space-y-2">
                <button 
                  onClick={() => { setFilters({...filters, specialization: ''}); fetchDoctors(); }}
                  className={cn(
                    "w-full text-left px-4 py-2 rounded-xl text-sm font-bold transition-all",
                    filters.specialization === '' ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-500 hover:bg-slate-50"
                  )}
                >
                  All Specialists
                </button>
                {specialities.map(spec => (
                  <button 
                    key={spec}
                    onClick={() => { setFilters({...filters, specialization: spec}); fetchDoctors(); }}
                    className={cn(
                      "w-full text-left px-4 py-2 rounded-xl text-sm font-bold transition-all",
                      filters.specialization === spec ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-500 hover:bg-slate-50"
                    )}
                  >
                    {spec}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100 space-y-4">
              <h3 className="font-bold text-secondary">Search Details</h3>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    name="search"
                    type="text" 
                    placeholder="Doctor name..." 
                    value={filters.search}
                    onChange={handleFilterChange}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border-none text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <button 
                  onClick={handleSearch}
                  className="w-full py-3 bg-secondary text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="space-y-8">
          {loading ? (
            <div className="grid md:grid-cols-2 gap-8">
              {[1, 2, 4].map(n => <div key={n} className="h-64 bg-slate-100 rounded-3xl animate-pulse" />)}
            </div>
          ) : doctors.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8">
              {doctors.map((doc, i) => (
                <motion.div 
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group bg-white rounded-[32px] border border-slate-100 p-6 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="flex gap-6 relative z-10">
                    <div className="h-24 w-24 rounded-2xl bg-slate-50 overflow-hidden border border-slate-100 flex-shrink-0">
                      {doc.avatar ? (
                        <img src={doc.avatar} alt={doc.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-2xl font-black text-primary/20">{doc.name[0]}</div>
                      )}
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-black text-secondary tracking-tight group-hover:text-primary transition-colors uppercase">{doc.name}</h3>
                        <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                          <Star className="h-3 w-3 text-amber-500 fill-current" />
                          <span className="text-[10px] font-black text-amber-700">{doc.doctorProfile?.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <p className="text-xs font-bold text-accent uppercase tracking-widest">{doc.doctorProfile?.specialization}</p>
                      
                      <div className="flex gap-4 pt-3 flex-wrap">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                          <Clock className="h-3.5 w-3.5" />
                          {doc.doctorProfile?.experience} YRS EXP
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                          <MapPin className="h-3.5 w-3.5" />
                          NEARBY
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Consultation Fee</p>
                      <p className="text-lg font-black text-secondary">${doc.doctorProfile?.fees}</p>
                    </div>
                    <Link to={`/doctors/${doc.id}`} className="px-6 py-3 bg-primary/5 text-primary font-bold rounded-xl group-hover:bg-primary group-hover:text-white transition-all text-sm flex items-center gap-2">
                      Book Now
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                  
                  {/* Decorative background circle */}
                  <div className="absolute top-0 right-0 h-24 w-24 bg-primary/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-white rounded-[40px] border border-dashed border-slate-200">
              <Search className="h-12 w-12 text-slate-100 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-secondary">No specialists found</h3>
              <p className="text-slate-400 text-sm">Try adjusting your filters or search keywords.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
