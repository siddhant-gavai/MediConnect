import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Calendar, Clock, CheckCircle, XCircle, MessageSquare, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get('/appointments/my');
      if (data.success) {
        setAppointments(data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/reviews', {
        doctorId: showReviewModal.doctorId,
        appointmentId: showReviewModal.id,
        ...reviewData
      });
      if (data.success) {
        toast.success('Review submitted');
        setShowReviewModal(null);
        fetchAppointments();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) return <div>Loading...</div>;

  const getStatusBadge = (status) => {
    const styles = {
      PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
      CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-200',
      CANCELLED: 'bg-red-50 text-red-700 border-red-200',
      COMPLETED: 'bg-green-50 text-green-700 border-green-200',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Your Medical Dashboard</h1>
        <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm text-sm font-medium text-slate-600">
          Total Appointments: <span className="text-blue-600 font-bold">{appointments.length}</span>
        </div>
      </div>

      <div className="grid gap-6">
        {appointments.length > 0 ? (
          appointments.map((apt) => (
            <div key={apt.id} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row gap-6 items-center shadow-sm hover:shadow-md transition-shadow">
              <div className="h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center font-bold text-blue-700 border border-blue-100 flex-shrink-0">
                {apt.doctor.user.avatar ? (
                  <img src={apt.doctor.user.avatar} alt="Doctor" className="h-full w-full object-cover rounded-2xl" />
                ) : (
                  apt.doctor.user.name[0]
                )}
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold text-slate-900 mb-1">Dr. {apt.doctor.user.name}</h3>
                <p className="text-sm font-medium text-blue-600 uppercase tracking-wider mb-2">{apt.doctor.specialization}</p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-lg">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span>{new Date(apt.slot.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-lg">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span>{apt.slot.startTime}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center md:items-end gap-3">
                {getStatusBadge(apt.status)}
                
                {apt.status === 'COMPLETED' && !apt.review && (
                  <button 
                    onClick={() => setShowReviewModal(apt)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                  >
                    <Star className="h-4 w-4" /> Review Visit
                  </button>
                )}

                {apt.review && (
                  <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-3 py-1 rounded-full text-xs font-bold border border-amber-100">
                    <Star className="h-3 w-3 fill-current" /> Reviewed
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
            <XCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900">No appointments yet</h3>
            <p className="text-slate-500">Book your first consultation today!</p>
          </div>
        )}
      </div>

      {/* Review Modal Mockup */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-300">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Review Appointment</h2>
            <form onSubmit={submitReview} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewData({ ...reviewData, rating: star })}
                      className={`p-2 rounded-lg transition-all ${reviewData.rating >= star ? 'text-amber-500' : 'text-slate-300'}`}
                    >
                      <Star className={`h-8 w-8 ${reviewData.rating >= star ? 'fill-current' : ''}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Comment</label>
                <textarea
                  required
                  value={reviewData.comment}
                  onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-600 outline-none min-h-[100px]"
                  placeholder="Tell us about your experience..."
                ></textarea>
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(null)}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
