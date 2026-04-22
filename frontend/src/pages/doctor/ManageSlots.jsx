import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { Calendar, Plus, Trash2, Clock, Save, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageSlots = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState([{ startTime: '', endTime: '' }]);

  const addSlotRow = () => {
    setSlots([...slots, { startTime: '', endTime: '' }]);
  };

  const removeSlotRow = (index) => {
    const newSlots = slots.filter((_, i) => i !== index);
    setSlots(newSlots);
  };

  const handleSlotChange = (index, field, value) => {
    const newSlots = [...slots];
    newSlots[index][field] = value;
    setSlots(newSlots);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date) return toast.error('Please select a date');
    
    // Validation
    const invalid = slots.some(s => !s.startTime || !s.endTime);
    if (invalid) return toast.error('Please fill all time fields');

    try {
      const { data } = await api.post('/doctors/slots', { date, slots });
      if (data.success) {
        toast.success(`Slots created for ${new Date(date).toLocaleDateString()}`);
        navigate('/doctor/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create slots');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 bg-white rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
        >
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Expand Availability</h1>
          <p className="text-slate-500">Create new time slots for your patients</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-3xl border border-slate-200 shadow-xl shadow-blue-50 space-y-8">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-widest flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            Select Appointment Date
          </label>
          <input
            type="date"
            required
            value={date}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none text-lg font-bold"
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              Time Slots
            </label>
            <button
              type="button"
              onClick={addSlotRow}
              className="px-4 py-2 bg-blue-50 text-blue-700 text-sm font-bold rounded-xl hover:bg-blue-100 transition-all flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Add Row
            </button>
          </div>

          <div className="space-y-3">
            {slots.map((slot, index) => (
              <div key={index} className="group flex flex-col sm:flex-row gap-4 p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-blue-100 hover:bg-white transition-all group">
                <div className="flex-1 space-y-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase ml-1">Start Time</span>
                  <input
                    type="time"
                    required
                    value={slot.startTime}
                    onChange={(e) => handleSlotChange(index, 'startTime', e.target.value)}
                    className="w-full p-2 bg-transparent border-none focus:ring-0 outline-none font-bold text-slate-900"
                  />
                </div>
                <div className="flex-1 space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase ml-1">End Time</span>
                  <input
                    type="time"
                    required
                    value={slot.endTime}
                    onChange={(e) => handleSlotChange(index, 'endTime', e.target.value)}
                    className="w-full p-2 bg-transparent border-none focus:ring-0 outline-none font-bold text-slate-900"
                  />
                </div>
                <div className="flex items-end justify-end pb-1">
                  <button
                    type="button"
                    onClick={() => removeSlotRow(index)}
                    disabled={slots.length === 1}
                    className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all disabled:opacity-0"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-3"
        >
          <Save className="h-5 w-5" />
          Finalize & Save Slots
        </button>
      </form>
    </div>
  );
};

export default ManageSlots;
