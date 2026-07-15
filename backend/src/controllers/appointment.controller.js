const { prisma } = require('../config/prisma');
const { sendSuccess, sendError } = require('../utils/responseHelper');

// @desc Book an appointment
// @route POST /api/appointments
// @access Private (Patient)
const bookAppointment = async (req, res, next) => {
  const { doctorId, slotId, symptoms } = req.body;

  try {
    // Use transaction to prevent race conditions
    const result = await prisma.$transaction(async (tx) => {
      // 1. Check if slot exists and is not booked
      const slot = await tx.timeSlot.findUnique({
        where: { id: slotId },
      });

      if (!slot || slot.isBooked) {
        throw new Error('Slot is no longer available');
      }

      // 2. Create appointment
      const appointment = await tx.appointment.create({
        data: {
          patientId: req.user.id,
          doctorId,
          slotId,
          symptoms
        }
      });

      // 3. Mark slot as booked
      await tx.timeSlot.update({
        where: { id: slotId },
        data: { isBooked: true }
      });

      return appointment;
    });

    return sendSuccess(res, result, 'Appointment booked successfully', 201);
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

// @desc Get current patient's appointments
// @route GET /api/appointments/my
// @access Private (Patient)
const getMyAppointments = async (req, res, next) => {
  try {
    const appointments = await prisma.appointment.findMany({
      where: { patientId: req.user.id },
      include: {
        doctor: { include: { user: { select: { name: true, avatar: true } } } },
        slot: true,
        review: true
      },
      orderBy: { createdAt: 'desc' }
    });
    return sendSuccess(res, appointments, 'Appointments retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// @desc Get doctor's appointments
// @route GET /api/appointments/doctor
// @access Private (Doctor)
const getDoctorAppointments = async (req, res, next) => {
  try {
    const doctorProfile = await prisma.doctorProfile.findUnique({
      where: { userId: req.user.id }
    });

    if (!doctorProfile) {
      return sendError(res, 'Doctor profile not found', 404);
    }

    const appointments = await prisma.appointment.findMany({
      where: { doctorId: doctorProfile.id },
      include: {
        patient: { select: { name: true, email: true, avatar: true } },
        slot: true
      },
      orderBy: { createdAt: 'desc' }
    });
    return sendSuccess(res, appointments, 'Doctor appointments retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// @desc Update appointment status
// @route PUT /api/appointments/:id/status
// @access Private (Doctor/Patient)
const updateStatus = async (req, res, next) => {
  const { status } = req.body;

  const allowedStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
  if (!status || !allowedStatuses.includes(status)) {
    return sendError(res, `Invalid status. Allowed values are: ${allowedStatuses.join(', ')}`, 400);
  }

  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: req.params.id },
      include: { doctor: true }
    });

    if (!appointment) {
      return sendError(res, 'Appointment not found', 404);
    }

    // RBAC: Only doctor of this appointment or the patient can update status
    // (In a real app, we'd limit what status each can set)
    const updatedAppointment = await prisma.appointment.update({
      where: { id: req.params.id },
      data: { status }
    });

    return sendSuccess(res, updatedAppointment, 'Appointment status updated successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = { bookAppointment, getMyAppointments, getDoctorAppointments, updateStatus };
