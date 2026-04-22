const express = require('express');
const { getDoctors, getDoctorById, updateProfile, createSlots } = require('../controllers/doctor.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

const router = express.Router();

router.get('/', getDoctors);
router.get('/:id', getDoctorById);

router.put('/profile', protect, authorize('DOCTOR'), updateProfile);
router.post('/slots', protect, authorize('DOCTOR'), createSlots);

module.exports = router;
