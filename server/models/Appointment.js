const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  reason: { type: String },
  date: { type: String, required: true },
  time: { type: String, required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: false },
  providerName: { type: String, default: 'Pharm. Chinedu Nwankwo' },
  providerType: { type: String, default: 'pharmacist' }, // 'pharmacist' | 'doctor'
  serviceName: { type: String, default: 'Clinical Consultation' },
  consultationType: { type: String, enum: ['in_person', 'telehealth'], default: 'in_person' },
  tokenNumber: { type: String },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'], default: 'Pending' },
  rating: { type: Number, min: 1, max: 5 },
  feedback: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
