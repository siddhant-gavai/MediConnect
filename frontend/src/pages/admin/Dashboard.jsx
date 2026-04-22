import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { LayoutDashboard, Users, Activity, CheckSquare, ShieldCheck, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/admin/stats');
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        toast.error('Failed to fetch admin stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div>Loading...</div>;

  const statCards = [
    { label: 'Total Patients', value: stats?.totalPatients, icon: Users, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Doctors', value: stats?.totalDoctors, icon: Activity, color: 'bg-purple-50 text-purple-600' },
    { label: 'Verified Doctors', value: stats?.totalVerifiedDoctors, icon: ShieldCheck, color: 'bg-green-50 text-green-600' },
    { label: 'Appointments', value: stats?.totalAppointments, icon: CheckSquare, color: 'bg-amber-50 text-amber-600' },
  ];

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Overview</h1>
          <p className="text-slate-500 mt-1">MediConnect administrative control panel</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className={`h-14 w-14 ${stat.color} rounded-2xl flex items-center justify-center mb-6`}>
              <stat.icon className="h-7 w-7" />
            </div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-4xl font-black text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-blue-600" />
              Doctor Verification
            </h3>
            <p className="text-slate-600 mb-8 leading-relaxed">
              New doctors registered on the platform are restricted from appearing in search results until they are manually verified by an administrator. Check the pending applications.
            </p>
          </div>
          <Link 
            to="/admin/doctors"
            className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group"
          >
            Review Applications
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </section>

        <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Users className="h-6 w-6 text-blue-600" />
              User Management
            </h3>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Monitor user growth, audit accounts, and manage platform safety. View the complete list of patients and doctors registered in the system.
            </p>
          </div>
          <button className="w-full py-4 bg-white text-slate-900 border-2 border-slate-200 font-bold rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
            View All Users
          </button>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
