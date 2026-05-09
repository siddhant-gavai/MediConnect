const express = require('express');
const { bookAppointment, getMyAppointments, getDoctorAppointments, updateStatus } = require('../controllers/appointment.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

const router = express.Router();

router.use(protect);

// Book a new appointment (PATIENT only)
router.post('/', authorize('PATIENT'), bookAppointment);

// Get all appointments for logged-in patient
router.get('/my', authorize('PATIENT'), getMyAppointments);

// Get all appointments for logged-in doctor
router.get('/doctor', authorize('DOCTOR'), getDoctorAppointments);

// Update status of an appointment
router.put('/:id/status', updateStatus);

module.exports = router;
