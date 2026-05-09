const { prisma } = require('../config/prisma');

// @desc Add a review for a doctor
// @route POST /api/reviews
// @access Private (Patient)
const addReview = async (req, res, next) => {
  const { doctorId, appointmentId, rating, comment } = req.body;

  if (!doctorId || !appointmentId || !rating) {
    return res.status(400).json({ success: false, message: 'Please provide doctorId, appointmentId, and rating' });
  }

  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId }
    });

    if (!appointment || appointment.status !== 'COMPLETED') {
      return res.status(400).json({ success: false, message: 'Can only review completed appointments' });
    }

    const review = await prisma.review.create({
      data: {
        patientId: req.user.id,
        doctorId,
        appointmentId,
        rating,
        comment
      }
    });

    // Update doctor's average rating
    const reviews = await prisma.review.findMany({ where: { doctorId } });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await prisma.doctorProfile.update({
      where: { id: doctorId },
      data: { rating: avgRating }
    });

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

// @desc Get reviews for a doctor
// @route GET /api/reviews/doctor/:id
// @access Public
const getDoctorReviews = async (req, res, next) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { doctorId: req.params.id },
      include: { patient: { select: { name: true, avatar: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
};

module.exports = { addReview, getDoctorReviews };
