const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const { prisma } = require('./config/prisma');
const requestLogger = require('./middleware/requestLogger');

dotenv.config();

const app = express();

app.use(requestLogger);

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

setInterval(() => {}, 1000); // Keep event loop alive

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
const authRoutes = require('./routes/auth.routes');
const doctorRoutes = require('./routes/doctor.routes');
const appointmentRoutes = require('./routes/appointment.routes');
const adminRoutes = require('./routes/admin.routes');
const reviewRoutes = require('./routes/review.routes');

app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      success: true,
      status: 'UP',
      timestamp: new Date(),
      uptime: process.uptime(),
      database: 'connected'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 'DOWN',
      timestamp: new Date(),
      error: error.message
    });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ success: false, message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = { app, prisma };
