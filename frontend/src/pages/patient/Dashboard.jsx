import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Calendar, Heart, FileText, Settings, 
  User, LogOut, ChevronRight, Bell, Search, 
  Clock, CheckCircle, XCircle, MoreVertical, 
  Plus, Download, Trash2, Camera, Mail, Phone,
  Droplets, CalendarDays, AlertCircle, Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';
import doctorsData from '../../data/doctors';
import DoctorCard from '../../components/DoctorCard';

const PatientDashboard = () => {
  const { user, logout, login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('Overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [savedDoctors, setSavedDoctors] = useState([]);
  const [healthRecords, setHealthRecords] = useState([]);
  const [profileData, setProfileData] = useState({ ...user });

  useEffect(() => {
    if (user) {
      setProfileData({ ...user });
    }
  }, [user]);

  useEffect(() => {
    // Load data from localStorage
    const savedApts = JSON.parse(localStorage.getItem('mediconnect_bookings') || '[]');
    setAppointments(savedApts);

    const savedDocIds = JSON.parse(localStorage.getItem('saved_doctors') || '[]');
    const savedDocs = doctorsData.filter(d => savedDocIds.includes(d.id));
    setSavedDoctors(savedDocs);

    const savedRecords = JSON.parse(localStorage.getItem('health_records') || '[]');
    setHealthRecords(savedRecords);
  }, []);

  const handleLogout = () => {
    logout();
    showToast('Signed out successfully', 'success');
    navigate('/');
  };

  const menuItems = [
    { id: 'Overview', icon: LayoutDashboard, label: 'Overview' },
    { id: 'Appointments', icon: Calendar, label: 'My Appointments' },
    { id: 'Saved', icon: Heart, label: 'Saved Doctors' },
    { id: 'Records', icon: FileText, label: 'Health Records' },
    { id: 'Settings', icon: Settings, label: 'Profile Settings' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sidebar */}
      <aside className={`bg-white border-r border-slate-200 transition-all duration-300 hidden lg:flex flex-col sticky top-0 h-screen ${isSidebarCollapsed ? 'w-20' : 'w-72'}`}>
        <div className="p-6 border-b border-slate-50 flex items-center gap-3">
          <div className="bg-[#1565C0] p-2 rounded-xl">
            <LayoutDashboard size={20} className="text-white" />
          </div>
          {!isSidebarCollapsed && <span className="text-xl font-black text-slate-900 uppercase tracking-tighter">Dashboard</span>}
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all ${
                activeTab === item.id 
                  ? 'bg-[#1565C0] text-white shadow-lg shadow-blue-100' 
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
              }`}
            >
              <item.icon size={22} />
              {!isSidebarCollapsed && <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-50">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-red-400 hover:bg-red-50 transition-all"
          >
            <LogOut size={22} />
            {!isSidebarCollapsed && <span className="text-xs font-black uppercase tracking-widest">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden">
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 lg:hidden">
            <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="p-2 bg-slate-50 rounded-xl">
              <LayoutDashboard size={20} />
            </button>
            <span className="text-lg font-black uppercase tracking-tighter">MediConnect</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-slate-400">
            <span className="text-[10px] font-black uppercase tracking-widest">Pages</span>
            <ChevronRight size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">{activeTab}</span>
          </div>

          <div className="flex items-center gap-6">
            <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{user?.name}</p>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em]">Patient Account</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-[#1565C0] flex items-center justify-center text-white text-xs font-black shadow-lg shadow-blue-100">
                {user?.avatar}
              </div>
            </div>
          </div>
        </header>

        {/* Tab Content */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'Overview' && <OverviewTab appointments={appointments} savedDocs={savedDoctors} records={healthRecords} user={user} setActiveTab={setActiveTab} />}
            {activeTab === 'Appointments' && <AppointmentsTab appointments={appointments} setAppointments={setAppointments} />}
            {activeTab === 'Saved' && <SavedDoctorsTab savedDocs={savedDoctors} setSavedDocs={setSavedDoctors} />}
            {activeTab === 'Records' && <RecordsTab records={healthRecords} setRecords={setHealthRecords} />}
            {activeTab === 'Settings' && <SettingsTab profileData={profileData} setProfileData={setProfileData} />}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

/* --- SUB-COMPONENTS --- */

const OverviewTab = ({ appointments, savedDocs, records, user, setActiveTab }) => {
  const nextApt = appointments.find(a => a.status === 'upcoming');
  
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
      {/* Welcome Card */}
      <div className="bg-[#1565C0] rounded-[32px] p-10 text-white relative overflow-hidden shadow-2xl shadow-blue-100">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative z-10 max-w-lg">
          <h1 className="text-4xl font-black mb-4">Good morning, {user?.name.split(' ')[0]}!</h1>
          <p className="text-blue-100 font-bold text-lg mb-8 opacity-80">You have {appointments.filter(a => a.status === 'upcoming').length} upcoming appointments this week. Stay on top of your health!</p>
          <button onClick={() => setActiveTab('Appointments')} className="bg-white text-[#1565C0] px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-50 transition shadow-lg">
            View Schedule
          </button>
        </div>
      </div>

      {/* Stats Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Upcoming', value: appointments.filter(a => a.status === 'upcoming').length, icon: Calendar, color: 'bg-blue-500' },
          { label: 'Past Visits', value: appointments.filter(a => a.status === 'completed').length, icon: Clock, color: 'bg-green-500' },
          { label: 'Saved Doctors', value: savedDocs.length, icon: Heart, color: 'bg-red-500' },
          { label: 'Health Records', value: records.length, icon: FileText, color: 'bg-amber-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
            <div className={`${stat.color} p-4 rounded-2xl text-white shadow-lg`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Next Appointment Card */}
        <div className="lg:col-span-2 bg-white rounded-[32px] border border-slate-100 shadow-sm p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Next Appointment</h3>
            <button onClick={() => setActiveTab('Appointments')} className="text-[10px] font-black text-[#1565C0] uppercase tracking-widest hover:underline">See All</button>
          </div>

          {nextApt ? (
            <div className="bg-slate-50 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 border border-slate-100">
              <div className="h-20 w-20 bg-[#1565C0] rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-100">
                {nextApt.doctorName.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 text-center sm:text-left space-y-1">
                <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">{nextApt.doctorName}</h4>
                <p className="text-xs font-bold text-[#1565C0] uppercase tracking-widest">{nextApt.speciality} • {nextApt.hospital}</p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-3">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                    <Calendar size={14} className="text-blue-500" />
                    {new Date(nextApt.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                    <Clock size={14} className="text-blue-500" />
                    {nextApt.time}
                  </div>
                </div>
              </div>
              <button className="bg-[#1565C0] text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-800 transition shadow-lg shadow-blue-100">
                Join Call
              </button>
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-2xl">
              <p className="text-slate-400 font-bold">No upcoming appointments</p>
              <Link to="/doctors" className="text-[#1565C0] text-xs font-black uppercase tracking-widest mt-2 inline-block hover:underline">Book Now &rarr;</Link>
            </div>
          )}
        </div>

        {/* Quick Tips or Reminders */}
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 space-y-6">
          <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Health Tips</h3>
          <div className="space-y-4">
            {[
              { icon: AlertCircle, text: 'Remember to drink at least 3L of water daily.', color: 'text-amber-500' },
              { icon: CheckCircle, text: 'Your last blood report was excellent!', color: 'text-green-500' },
              { icon: Info, text: 'Dr. Sharma recommended a follow-up in 2 weeks.', color: 'text-blue-500' },
            ].map((tip, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <tip.icon size={20} className={`${tip.color} shrink-0`} />
                <p className="text-xs font-bold text-slate-600 leading-relaxed">{tip.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const AppointmentsTab = ({ appointments, setAppointments }) => {
  const [filter, setFilter] = useState('upcoming');
  const filtered = appointments.filter(a => a.status === filter);

  const handleCancel = (id) => {
    const updated = appointments.map(a => a.id === id ? { ...a, status: 'cancelled' } : a);
    setAppointments(updated);
    localStorage.setItem('mediconnect_bookings', JSON.stringify(updated));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">My Appointments</h2>
        <div className="bg-white p-1 rounded-2xl border border-slate-100 flex gap-1 shadow-sm">
          {['upcoming', 'completed', 'cancelled'].map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === t ? 'bg-[#1565C0] text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6">
        {filtered.length > 0 ? (
          filtered.map(apt => (
            <div key={apt.id} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-center gap-8">
              <div className="h-16 w-16 bg-[#1565C0] rounded-2xl flex items-center justify-center text-white text-xl font-black shrink-0">
                {apt.doctorName.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 text-center sm:text-left space-y-1">
                <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">{apt.doctorName}</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{apt.speciality} • {apt.hospital}</p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-3">
                  <span className="text-[10px] font-black text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 flex items-center gap-2">
                    <Calendar size={14} className="text-blue-500" /> {new Date(apt.date).toLocaleDateString()}
                  </span>
                  <span className="text-[10px] font-black text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 flex items-center gap-2">
                    <Clock size={14} className="text-blue-500" /> {apt.time}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-center sm:items-end gap-3 min-w-[140px]">
                <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                  apt.status === 'upcoming' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                  apt.status === 'completed' ? 'bg-green-50 text-green-600 border-green-100' :
                  'bg-red-50 text-red-600 border-red-100'
                }`}>
                  {apt.status}
                </span>
                {apt.status === 'upcoming' && (
                  <div className="flex gap-2">
                    <button onClick={() => handleCancel(apt.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition" title="Cancel">
                      <Trash2 size={18} />
                    </button>
                    <Link to={`/book/${apt.doctorId}`} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition" title="Reschedule">
                      <CalendarDays size={18} />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-24 bg-white rounded-[32px] border-2 border-dashed border-slate-100">
            <Calendar className="mx-auto text-slate-200 mb-4" size={48} />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No appointments found</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const SavedDoctorsTab = ({ savedDocs, setSavedDocs }) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Saved Doctors</h2>
      {savedDocs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
          {savedDocs.map(doc => (
            <div key={doc.id} className="relative group">
              <DoctorCard doctor={doc} buttonText="Book Again" />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-[32px] border-2 border-dashed border-slate-100">
          <Heart className="mx-auto text-slate-200 mb-4" size={48} />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No doctors saved yet</p>
          <Link to="/doctors" className="mt-6 inline-block bg-[#1565C0] text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-800 transition shadow-lg shadow-blue-100">Browse Doctors</Link>
        </div>
      )}
    </motion.div>
  );
};

const RecordsTab = ({ records, setRecords }) => {
  const fileInputRef = useRef(null);
  const { showToast } = useToast();

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const newRecord = {
        id: Date.now(),
        name: file.name,
        date: new Date().toISOString(),
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        type: file.type.includes('pdf') ? 'Report' : 'Prescription',
        data: event.target.result
      };
      const updated = [newRecord, ...records];
      setRecords(updated);
      localStorage.setItem('health_records', JSON.stringify(updated));
      showToast('Record uploaded successfully!', 'success');
    };
    reader.readAsDataURL(file);
  };

  const deleteRecord = (id) => {
    const updated = records.filter(r => r.id !== id);
    setRecords(updated);
    localStorage.setItem('health_records', JSON.stringify(updated));
    showToast('Record deleted', 'info');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Health Records</h2>
        <button 
          onClick={() => fileInputRef.current.click()}
          className="bg-[#1565C0] text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-800 transition shadow-lg shadow-blue-100"
        >
          <Plus size={18} /> Upload New
        </button>
        <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" accept="image/*,application/pdf" />
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        {records.length > 0 ? (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Document Name</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Upload Date</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {records.map(record => (
                <tr key={record.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-50 rounded-xl text-[#1565C0]">
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">{record.name}</p>
                        <p className="text-[10px] font-bold text-slate-400">{record.size}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-[11px] font-black text-slate-500">
                    {new Date(record.date).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                      record.type === 'Report' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                    }`}>
                      {record.type}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right space-x-2">
                    <a href={record.data} download={record.name} className="p-2.5 text-slate-400 hover:text-[#1565C0] hover:bg-blue-50 rounded-lg inline-block transition">
                      <Download size={18} />
                    </a>
                    <button onClick={() => deleteRecord(record.id)} className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-24">
            <FileText className="mx-auto text-slate-100 mb-4" size={64} />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No health records uploaded yet</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const SettingsTab = ({ profileData, setProfileData }) => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      // Update local state and context
      login(profileData);
      // Persist in users list too
      const users = JSON.parse(localStorage.getItem('mediconnect_users') || '[]');
      const updatedUsers = users.map(u => u.email === profileData.email ? { ...u, ...profileData } : u);
      localStorage.setItem('mediconnect_users', JSON.stringify(updatedUsers));
      
      setLoading(false);
      showToast('Profile updated successfully!', 'success');
    }, 800);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Profile Settings</h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-10 space-y-10">
        {/* Avatar Section */}
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <div className="relative group">
            <div className="h-32 w-32 rounded-full bg-[#1565C0] flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-blue-100 border-4 border-white">
              {profileData.avatar}
            </div>
            <label className="absolute bottom-0 right-0 p-2.5 bg-white rounded-full shadow-lg border border-slate-100 cursor-pointer hover:bg-slate-50 transition active:scale-90">
              <Camera size={18} className="text-[#1565C0]" />
              <input type="file" className="hidden" accept="image/*" />
            </label>
          </div>
          <div>
            <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">Profile Picture</h4>
            <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest leading-loose">Upload a high-quality picture to help doctors recognize you.<br />Max size: 2MB. Format: JPG, PNG.</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-8 pt-6 border-t border-slate-50">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                value={profileData.name}
                onChange={e => setProfileData({...profileData, name: e.target.value})}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#1565C0] outline-none font-bold text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="email" 
                readOnly
                value={profileData.email}
                className="w-full pl-12 pr-4 py-4 bg-slate-100 rounded-2xl border-none outline-none font-bold text-sm text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
            <div className="relative">
              <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="tel" 
                value={profileData.phone}
                onChange={e => setProfileData({...profileData, phone: e.target.value})}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#1565C0] outline-none font-bold text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Blood Group</label>
              <div className="relative">
                <Droplets size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-red-400" />
                <select 
                  value={profileData.bloodGroup || 'O+'}
                  onChange={e => setProfileData({...profileData, bloodGroup: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#1565C0] outline-none font-bold text-sm appearance-none"
                >
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Birth Date</label>
              <div className="relative">
                <CalendarDays size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="date" 
                  value={profileData.dob || ''}
                  onChange={e => setProfileData({...profileData, dob: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#1565C0] outline-none font-bold text-sm"
                />
              </div>
            </div>
          </div>

          <div className="sm:col-span-2 space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Known Allergies / Medical History</label>
            <textarea 
              value={profileData.allergies || ''}
              onChange={e => setProfileData({...profileData, allergies: e.target.value})}
              placeholder="E.g. Penicillin, Pollen, Diabetes, etc."
              className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#1565C0] outline-none font-bold text-sm min-h-[120px]"
            ></textarea>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-50 flex justify-end">
          <button 
            type="submit"
            disabled={loading}
            className="bg-[#1565C0] text-white px-12 py-4 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-blue-800 transition shadow-xl shadow-blue-100 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default PatientDashboard;
