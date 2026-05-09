const express = require('express');
const { addReview, getDoctorReviews } = require('../controllers/review.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

const router = express.Router();

// Get all reviews for a specific doctor
router.get('/doctor/:id', getDoctorReviews);

// Add a new review (restricted to PATIENT role)
router.post('/', protect, authorize('PATIENT'), addReview);

module.exports = router;
