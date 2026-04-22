import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Users, ClipboardList, CheckCircle, XCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get('/appointments/doctor');
      if (data.success) {
        setAppointments(data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch doctor appointments');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const { data } = await api.put(`/appointments/${id}/status`, { status });
      if (data.success) {
        toast.success(`Appointment ${status.toLowerCase()}`);
        fetchAppointments();
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Doctor Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage your patients and upcoming consultations</p>
        </div>
        <Link 
          to="/doctor/manage-slots"
          className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center gap-2"
        >
          <Calendar className="h-5 w-5" />
          Manage Availability
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total Patients</p>
              <p className="text-2xl font-black text-slate-900">{new Set(appointments.map(a => a.patientId)).size}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Pending Visits</p>
              <p className="text-2xl font-black text-slate-900">{appointments.filter(a => a.status === 'PENDING').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Completed</p>
              <p className="text-2xl font-black text-slate-900">{appointments.filter(a => a.status === 'COMPLETED').length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">In-queue Appointments</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-black tracking-widest">
              <tr>
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Schedule</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Symptoms</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {appointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center font-bold text-blue-700">
                        {apt.patient.name[0]}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{apt.patient.name}</div>
                        <div className="text-xs text-slate-500">{apt.patient.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-900">{new Date(apt.slot.date).toLocaleDateString()}</div>
                    <div className="text-xs text-slate-500 font-medium">{apt.slot.startTime}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter border ${
                      apt.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      apt.status === 'CONFIRMED' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      apt.status === 'CANCELLED' ? 'bg-red-50 text-red-700 border-red-200' :
                      'bg-green-50 text-green-700 border-green-200'
                    }`}>
                      {apt.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-600 max-w-xs truncate font-medium italic">"{apt.symptoms || 'N/A'}"</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      {apt.status === 'PENDING' && (
                        <>
                          <button 
                            onClick={() => updateStatus(apt.id, 'CONFIRMED')}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg shadow-sm"
                            title="Confirm"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => updateStatus(apt.id, 'CANCELLED')}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg shadow-sm"
                            title="Cancel"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      {apt.status === 'CONFIRMED' && (
                        <button 
                          onClick={() => updateStatus(apt.id, 'COMPLETED')}
                          className="px-4 py-1.5 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 shadow-md shadow-green-100"
                        >
                          Mark Done
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {appointments.length === 0 && (
            <div className="py-20 text-center text-slate-400 font-medium">No appointments to show</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
