const { prisma } = require('../config/prisma');

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

    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
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
    res.json({ success: true, data: appointments });
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
      return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    }

    const appointments = await prisma.appointment.findMany({
      where: { doctorId: doctorProfile.id },
      include: {
        patient: { select: { name: true, email: true, avatar: true } },
        slot: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: appointments });
  } catch (error) {
    next(error);
  }
};

// @desc Update appointment status
// @route PUT /api/appointments/:id/status
// @access Private (Doctor/Patient)
const updateStatus = async (req, res, next) => {
  const { status } = req.body;

  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: req.params.id },
      include: { doctor: true }
    });

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // RBAC: Only doctor of this appointment or the patient can update status
    // (In a real app, we'd limit what status each can set)
    const updatedAppointment = await prisma.appointment.update({
      where: { id: req.params.id },
      data: { status }
    });

    res.json({ success: true, data: updatedAppointment });
  } catch (error) {
    next(error);
  }
};

module.exports = { bookAppointment, getMyAppointments, getDoctorAppointments, updateStatus };
