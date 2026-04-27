import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, MapPin, Star, Clock, IndianRupee, 
  X, ChevronDown, LayoutGrid, List, SlidersHorizontal, Building2 
} from 'lucide-react';
import doctorsData from '../data/doctors';
import DoctorCard from '../components/DoctorCard';

const DoctorsPage = () => {
  const [filters, setFilters] = useState({
    search: '',
    specialities: [],
    city: 'All Cities',
    availableToday: false,
    feeRange: 2000,
    minRating: 0,
    hospital: '',
  });

  const [sortBy, setSortBy] = useState('Relevance');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [compareList, setCompareList] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  useEffect(() => {
    document.title = 'Find Doctors | MediConnect';
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const specialities = [
    "Cardiology", "Neurology", "Pediatrics", "Orthopedic", 
    "Dermatology", "Dental", "Ophthalmology", "Psychiatry"
  ];

  const cities = ["All Cities", "Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Ahmedabad", "Pune", "Lucknow", "Jaipur", "Chandigarh", "Srinagar"];

  const filteredDoctors = useMemo(() => {
    let result = [...doctorsData];

    // Search
    if (filters.search) {
      result = result.filter(d => 
        d.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        d.speciality.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Hospital Search
    if (filters.hospital) {
      result = result.filter(d => 
        d.hospital.toLowerCase().includes(filters.hospital.toLowerCase())
      );
    }
    if (filters.specialities.length > 0) {
      result = result.filter(d => filters.specialities.includes(d.speciality));
    }

    // City
    if (filters.city !== 'All Cities') {
      result = result.filter(d => d.location === filters.city);
    }

    // Available Today
    if (filters.availableToday) {
      result = result.filter(d => d.available);
    }

    // Fee Range
    result = result.filter(d => d.fee <= filters.feeRange);

    // Rating
    if (filters.minRating > 0) {
      result = result.filter(d => d.rating >= filters.minRating);
    }

    // Sort
    switch (sortBy) {
      case 'Rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'Fee Low–High':
        result.sort((a, b) => a.fee - b.fee);
        break;
      case 'Fee High–Low':
        result.sort((a, b) => b.fee - a.fee);
        break;
      case 'Most Reviews':
        result.sort((a, b) => b.reviews - a.reviews);
        break;
      case 'Experience':
        result.sort((a, b) => b.exp - a.exp);
        break;
      default:
        // Relevance - default order or highest rated
        result.sort((a, b) => b.reviews - a.reviews);
    }

    return result;
  }, [filters, sortBy]);

  const toggleSpeciality = (spec) => {
    setFilters(prev => ({
      ...prev,
      specialities: prev.specialities.includes(spec)
        ? prev.specialities.filter(s => s !== spec)
        : [...prev.specialities, spec]
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      specialities: [],
      city: 'All Cities',
      availableToday: false,
      feeRange: 2000,
      minRating: 0,
      hospital: '',
    });
  };

  const SkeletonCard = () => (
    <div className="bg-white rounded-[32px] p-6 space-y-6 border border-slate-50 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="h-24 w-24 bg-slate-100 rounded-3xl" />
        <div className="h-10 w-10 bg-slate-100 rounded-2xl" />
      </div>
      <div className="space-y-3">
        <div className="h-6 bg-slate-100 rounded-full w-3/4" />
        <div className="h-4 bg-slate-100 rounded-full w-1/2" />
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-slate-100 rounded-full w-full" />
        <div className="h-4 bg-slate-100 rounded-full w-full" />
      </div>
      <div className="pt-4 space-y-3">
        <div className="h-12 bg-slate-100 rounded-2xl w-full" />
        <div className="h-12 bg-slate-100 rounded-2xl w-full" />
      </div>
    </div>
  );

  const toggleCompare = (doctor) => {
    if (compareList.find(d => d.id === doctor.id)) {
      setCompareList(compareList.filter(d => d.id !== doctor.id));
    } else {
      if (compareList.length >= 2) {
        // Replace the second one or show toast (for now just replace)
        setCompareList([compareList[0], doctor]);
      } else {
        setCompareList([...compareList, doctor]);
      }
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Find Specialists</h1>
            <p className="text-slate-500 font-bold mt-1">Showing {filteredDoctors.length} doctors available for you</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-slate-200 pl-4 pr-10 py-2.5 rounded-xl text-sm font-black text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer shadow-sm"
              >
                <option>Relevance</option>
                <option>Rating</option>
                <option>Fee Low–High</option>
                <option>Fee High–Low</option>
                <option>Most Reviews</option>
                <option>Experience</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
            
            <button 
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-[#1565C0] text-white px-6 py-2.5 rounded-xl font-black text-sm shadow-lg shadow-blue-100"
            >
              <SlidersHorizontal size={18} /> Filters
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-10">
          
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block space-y-8 sticky top-24 h-fit">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-8">
              
              {/* Search */}
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Search by Name</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Dr. Sharma..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                    value={filters.search}
                    onChange={(e) => setFilters({...filters, search: e.target.value})}
                  />
                </div>
              </div>

              {/* Search by Hospital */}
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Search by Hospital</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Apollo, Fortis..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                    value={filters.hospital}
                    onChange={(e) => setFilters({...filters, hospital: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Speciality</label>
                <div className="space-y-2.5 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                  {specialities.map(spec => (
                    <label key={spec} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${filters.specialities.includes(spec) ? 'bg-[#1565C0] border-[#1565C0]' : 'border-slate-200 group-hover:border-[#1565C0]'}`}>
                        {filters.specialities.includes(spec) && <X size={14} className="text-white rotate-45" />}
                        <input 
                          type="checkbox" 
                          className="hidden" 
                          checked={filters.specialities.includes(spec)}
                          onChange={() => toggleSpeciality(spec)}
                        />
                      </div>
                      <span className={`text-sm font-bold ${filters.specialities.includes(spec) ? 'text-slate-900' : 'text-slate-500'}`}>{spec}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* City */}
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Location</label>
                <div className="relative">
                  <select 
                    className="w-full appearance-none bg-slate-50 border-none pl-4 pr-10 py-2.5 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
                    value={filters.city}
                    onChange={(e) => setFilters({...filters, city: e.target.value})}
                  >
                    {cities.map(city => <option key={city}>{city}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Availability Toggle */}
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Available Today</label>
                <button 
                  onClick={() => setFilters({...filters, availableToday: !filters.availableToday})}
                  className={`w-11 h-6 rounded-full transition-all relative ${filters.availableToday ? 'bg-[#1565C0]' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-1 h-4 w-4 bg-white rounded-full transition-all ${filters.availableToday ? 'left-6' : 'left-1'}`} />
                </button>
              </div>

              {/* Fee Range */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Max Fee</label>
                  <span className="text-sm font-black text-[#1565C0]">₹{filters.feeRange}</span>
                </div>
                <input 
                  type="range" 
                  min="400" 
                  max="2000" 
                  step="100"
                  className="w-full accent-[#1565C0]"
                  value={filters.feeRange}
                  onChange={(e) => setFilters({...filters, feeRange: parseInt(e.target.value)})}
                />
              </div>

              {/* Rating */}
              <div className="space-y-4">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Rating</label>
                <div className="space-y-2">
                  {[4.8, 4.5, 4.0].map(rating => (
                    <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${filters.minRating === rating ? 'border-[#1565C0]' : 'border-slate-200 group-hover:border-[#1565C0]'}`}>
                        <div className={`w-2.5 h-2.5 rounded-full transition-all ${filters.minRating === rating ? 'bg-[#1565C0]' : 'bg-transparent'}`} />
                        <input 
                          type="radio" 
                          className="hidden" 
                          name="rating"
                          checked={filters.minRating === rating}
                          onChange={() => setFilters({...filters, minRating: rating})}
                        />
                      </div>
                      <span className="text-sm font-bold text-slate-600">{rating}+ Rating</span>
                    </label>
                  ))}
                </div>
              </div>

              <button 
                onClick={clearFilters}
                className="w-full text-center text-xs font-black text-red-500 uppercase tracking-widest hover:text-red-600 transition"
              >
                Clear All Filters
              </button>
            </div>
          </aside>

          {/* Doctors Grid */}
          <main>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-32">
              {isLoading ? (
                [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
              ) : (
                <AnimatePresence>
                  {filteredDoctors.map((doc) => (
                    <motion.div
                      key={doc.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="relative"
                    >
                      <DoctorCard doctor={doc} />
                      <label className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm cursor-pointer group hover:bg-white transition-all">
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${compareList.find(d => d.id === doc.id) ? 'bg-[#1565C0] border-[#1565C0]' : 'border-slate-200 group-hover:border-[#1565C0]'}`}>
                          {compareList.find(d => d.id === doc.id) && <Check size={10} className="text-white" />}
                          <input 
                            type="checkbox" 
                            className="hidden" 
                            checked={!!compareList.find(d => d.id === doc.id)}
                            onChange={() => toggleCompare(doc)}
                          />
                        </div>
                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Compare</span>
                      </label>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {!isLoading && filteredDoctors.length === 0 && (
              <div className="text-center py-24 bg-white rounded-[48px] border border-slate-100 border-dashed">
                <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="text-slate-300" size={48} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">No Doctors Found</h3>
                <p className="text-slate-500 font-bold max-w-xs mx-auto mt-2">Try adjusting your filters or city to find what you're looking for.</p>
                <button 
                  onClick={clearFilters}
                  className="mt-8 bg-[#1565C0] text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Compare Sticky Bar */}
      <AnimatePresence>
        {compareList.length > 0 && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-2xl"
          >
            <div className="bg-slate-900 text-white p-4 rounded-[32px] shadow-2xl flex items-center justify-between gap-6 border border-slate-800">
              <div className="flex items-center gap-4 flex-1">
                <div className="flex -space-x-4">
                  {compareList.map(doc => (
                    <div key={doc.id} className="h-12 w-12 rounded-full bg-[#1565C0] border-4 border-slate-900 flex items-center justify-center text-xs font-black ring-2 ring-blue-500/20">
                      {doc.name[0]}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest">{compareList.length} Doctor{compareList.length > 1 ? 's' : ''} Selected</p>
                  <p className="text-[10px] font-bold text-slate-400">Max 2 for side-by-side comparison</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setCompareList([])}
                  className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition px-4"
                >
                  Clear
                </button>
                <button 
                  disabled={compareList.length < 2}
                  onClick={() => setShowCompareModal(true)}
                  className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    compareList.length === 2 
                      ? 'bg-[#1565C0] hover:bg-blue-600 text-white shadow-xl shadow-blue-500/20' 
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  Compare Now
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comparison Modal */}
      <AnimatePresence>
        {showCompareModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCompareModal(false)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl bg-white rounded-[48px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Side-by-Side Comparison</h3>
                <button onClick={() => setShowCompareModal(false)} className="p-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-10">
                <div className="grid grid-cols-3 gap-10">
                  <div className="space-y-12 pt-24">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] h-6 flex items-center">Speciality</p>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] h-6 flex items-center">Experience</p>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] h-6 flex items-center">Rating</p>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] h-6 flex items-center">Consultation Fee</p>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] h-6 flex items-center">Hospital</p>
                  </div>
                  
                  {compareList.map(doc => (
                    <div key={doc.id} className="text-center space-y-12">
                      <div className="flex flex-col items-center gap-4">
                        <div className="h-20 w-20 rounded-3xl bg-[#1565C0] flex items-center justify-center text-white text-3xl font-black shadow-xl ring-8 ring-blue-50">
                          {doc.name[0]}
                        </div>
                        <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">{doc.name}</h4>
                      </div>
                      
                      <p className="text-sm font-black text-[#1565C0] uppercase tracking-widest h-6 flex items-center justify-center">{doc.speciality}</p>
                      <p className="text-sm font-black text-slate-700 uppercase tracking-widest h-6 flex items-center justify-center">{doc.exp} Years</p>
                      <div className="h-6 flex items-center justify-center gap-1.5 bg-amber-50 px-3 py-1 rounded-lg w-fit mx-auto border border-amber-100">
                        <Star size={14} className="fill-amber-400 text-amber-400" />
                        <span className="text-xs font-black text-amber-700">{doc.rating}</span>
                      </div>
                      <p className="text-lg font-black text-slate-900 h-6 flex items-center justify-center">₹{doc.fee}</p>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-relaxed">{doc.hospital}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-8 bg-slate-50 flex justify-center gap-6">
                {compareList.map(doc => (
                  <button 
                    key={doc.id}
                    onClick={() => navigate(`/book/${doc.id}`)}
                    className="flex-1 max-w-[240px] bg-[#1565C0] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-800 transition shadow-xl shadow-blue-100"
                  >
                    Book Dr. {doc.name.split(' ')[1]}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Filter Overlay */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-white z-[70] shadow-2xl p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-8 pb-4 border-b">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Filters</h3>
                <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">
                {/* Same filter content as desktop sidebar */}
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Search</label>
                  <input 
                    type="text" 
                    placeholder="Dr. Sharma..."
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none"
                    value={filters.search}
                    onChange={(e) => setFilters({...filters, search: e.target.value})}
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Speciality</label>
                  <div className="flex flex-wrap gap-2">
                    {specialities.map(spec => (
                      <button 
                        key={spec}
                        onClick={() => toggleSpeciality(spec)}
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${filters.specialities.includes(spec) ? 'bg-[#1565C0] text-white border-[#1565C0]' : 'bg-white text-slate-500 border-slate-200'}`}
                      >
                        {spec}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Add more filters here as needed for mobile */}
              </div>

              <div className="pt-6 mt-6 border-t space-y-4">
                <button 
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full bg-[#1565C0] text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg"
                >
                  Apply Filters
                </button>
                <button 
                  onClick={clearFilters}
                  className="w-full text-center text-xs font-black text-slate-400 uppercase tracking-widest"
                >
                  Reset All
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DoctorsPage;
