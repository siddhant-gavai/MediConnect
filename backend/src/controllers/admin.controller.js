const { prisma } = require('../config/prisma');

// @desc Get all users (Admin)
// @route GET /api/admin/users
// @access Private (Admin)
const getAllUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

// @desc Verify/Approve a doctor
// @route PUT /api/admin/doctor/:id/verify
// @access Private (Admin)
const verifyDoctor = async (req, res, next) => {
  try {
    const doctorProfile = await prisma.doctorProfile.update({
      where: { userId: req.params.id },
      data: { isVerified: true }
    });
    res.json({ success: true, data: doctorProfile });
  } catch (error) {
    next(error);
  }
};

// @desc Get system stats
// @route GET /api/admin/stats
// @access Private (Admin)
const getStats = async (req, res, next) => {
  try {
    const totalPatients = await prisma.user.count({ where: { role: 'PATIENT' } });
    const totalDoctors = await prisma.user.count({ where: { role: 'DOCTOR' } });
    const totalAppointments = await prisma.appointment.count();
    const totalVerifiedDoctors = await prisma.doctorProfile.count({ where: { isVerified: true } });

    res.json({
      success: true,
      data: {
        totalPatients,
        totalDoctors,
        totalAppointments,
        totalVerifiedDoctors
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUsers, verifyDoctor, getStats };
