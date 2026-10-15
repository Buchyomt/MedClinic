// MedClinic Healthcare Backend Server
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const otpRoutes = require('./routes/otpRoutes');
const authRoutes = require('./routes/authRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const { router: activityRoutes } = require('./routes/activityRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Reusable Database Connection (Supports both continuous server and Vercel serverless)
let isConnected = false;
const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    isConnected = db.connections[0].readyState === 1;
    console.log('MongoDB Connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

// Ensure DB connected on requests
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Root Health Check Route
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    system: 'MedClinic & Your Health Pharmacy API',
    location: 'GRA Onitsha, Anambra State',
    version: '1.0.0'
  });
});

// Routes
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/activity', activityRoutes);

const PORT = process.env.PORT || 5000;

// Listen locally or when executed directly
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel Serverless Hosting
module.exports = app;
