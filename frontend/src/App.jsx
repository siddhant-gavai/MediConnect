import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Doctors from './pages/Doctors';
import DoctorProfile from './pages/DoctorProfile';
import PatientDashboard from './pages/patient/Dashboard';
import DoctorDashboard from './pages/doctor/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import ManageSlots from './pages/doctor/ManageSlots';
import ManageDoctors from './pages/admin/ManageDoctors';
import Booking from './pages/Booking';
import BookingConfirmed from './pages/BookingConfirmed';
import MyBookings from './pages/MyBookings';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-white">
          <Toaster position="top-right" />
          <Navbar />
          <Chatbot />
          <Routes>
            {/* All pages will now be self-contained or use elements within Home */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/doctor/:id" element={<DoctorProfile />} />
            <Route path="/book/:id" element={<Booking />} />
            <Route path="/booking-confirmed" element={<BookingConfirmed />} />
            <Route path="/my-bookings" element={<MyBookings />} />

            {/* Dashboards (with simple ProtectedRoute in logic if needed, or self-contained) */}
            <Route path="/patient/dashboard" element={<PatientDashboard />} />
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/doctor/manage-slots" element={<ManageSlots />} />
            <Route path="/admin/doctors" element={<ManageDoctors />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
