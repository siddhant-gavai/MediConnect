import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Doctors from './pages/Doctors';
import DoctorProfile from './pages/DoctorProfile';
import PatientDashboard from './pages/patient/Dashboard';
import DoctorDashboard from './pages/doctor/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import ManageSlots from './pages/doctor/ManageSlots';
import ManageDoctors from './pages/admin/ManageDoctors';
import BookAppointment from './pages/BookAppointment';
import BookingConfirmed from './pages/BookingConfirmed';
import MyBookings from './pages/MyBookings';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <div className="min-h-screen bg-white">
            <Navbar />
            <Chatbot />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/doctor/:id" element={<DoctorProfile />} />
              
              {/* Protected Routes */}
              <Route path="/book/:id" element={
                <ProtectedRoute>
                  <BookAppointment />
                </ProtectedRoute>
              } />
              <Route path="/booking-confirmed" element={
                <ProtectedRoute>
                  <BookingConfirmed />
                </ProtectedRoute>
              } />
              <Route path="/my-bookings" element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              } />

              <Route path="/patient/dashboard" element={
                <ProtectedRoute>
                  <PatientDashboard />
                </ProtectedRoute>
              } />
              <Route path="/doctor/dashboard" element={
                <ProtectedRoute>
                  <DoctorDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/dashboard" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/doctor/manage-slots" element={
                <ProtectedRoute>
                  <ManageSlots />
                </ProtectedRoute>
              } />
              <Route path="/admin/doctors" element={
                <ProtectedRoute>
                  <ManageDoctors />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
