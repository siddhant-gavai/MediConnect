const express = require('express');
const { bookAppointment, getMyAppointments, getDoctorAppointments, updateStatus } = require('../controllers/appointment.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

const router = express.Router();

router.use(protect);

router.post('/', authorize('PATIENT'), bookAppointment);
router.get('/my', authorize('PATIENT'), getMyAppointments);
router.get('/doctor', authorize('DOCTOR'), getDoctorAppointments);
router.put('/:id/status', updateStatus);

module.exports = router;
