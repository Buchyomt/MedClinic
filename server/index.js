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

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected successfully'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/activity', activityRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
