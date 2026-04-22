const express = require('express');
const { addReview, getDoctorReviews } = require('../controllers/review.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

const router = express.Router();

router.get('/doctor/:id', getDoctorReviews);
router.post('/', protect, authorize('PATIENT'), addReview);

module.exports = router;
