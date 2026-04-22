const { prisma } = require('../config/prisma');

// @desc Get all doctors with filters
// @route GET /api/doctors
// @access Public
const getDoctors = async (req, res, next) => {
  const { specialization, fees, rating, search } = req.query;

  try {
    const where = {
      role: 'DOCTOR',
      doctorProfile: {
        isVerified: true,
        ...(specialization && { specialization }),
        ...(fees && { fees: { lte: parseInt(fees) } }),
        ...(rating && { rating: { gte: parseFloat(rating) } }),
      },
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
        ]
      })
    };

    const doctors = await prisma.user.findMany({
      where,
      include: {
        doctorProfile: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, data: doctors });
  } catch (error) {
    next(error);
  }
};

// @desc Get doctor profile by ID
// @route GET /api/doctors/:id
// @access Public
const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        doctorProfile: {
          include: {
            reviews: { include: { patient: { select: { name: true, avatar: true } } } },
            timeSlots: { where: { isBooked: false, date: { gte: new Date() } } }
          }
        }
      }
    });

    if (!doctor || doctor.role !== 'DOCTOR') {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    res.json({ success: true, data: doctor });
  } catch (error) {
    next(error);
  }
};

// @desc Update doctor profile
// @route PUT /api/doctors/profile
// @access Private (Doctor)
const updateProfile = async (req, res, next) => {
  const { specialization, experience, fees, about } = req.body;

  try {
    const profile = await prisma.doctorProfile.upsert({
      where: { userId: req.user.id },
      update: { specialization, experience, fees, about },
      create: {
        userId: req.user.id,
        specialization,
        experience,
        fees,
        about
      }
    });

    res.json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};

// @desc Create time slots
// @route POST /api/doctors/slots
// @access Private (Doctor)
const createSlots = async (req, res, next) => {
  const { date, slots } = req.body; // slots is an array of { startTime, endTime }

  try {
    const doctorProfile = await prisma.doctorProfile.findUnique({
      where: { userId: req.user.id }
    });

    if (!doctorProfile) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    }

    const createdSlots = await prisma.timeSlot.createMany({
      data: slots.map(slot => ({
        doctorId: doctorProfile.id,
        date: new Date(date),
        startTime: slot.startTime,
        endTime: slot.endTime
      }))
    });

    res.status(201).json({ success: true, data: createdSlots });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDoctors, getDoctorById, updateProfile, createSlots };
