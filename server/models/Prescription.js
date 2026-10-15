const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: { type: String, required: true }, // e.g. '500mg' or '1 Capsule'
  frequency: { type: String, required: true }, // e.g. '3x Daily after meals'
  duration: { type: String, required: true }, // e.g. '7 Days'
  instructions: { type: String, default: 'Take with full glass of water' },
  refillsAllowed: { type: Number, default: 2 },
  refillsRemaining: { type: Number, default: 2 }
});

const prescriptionSchema = new mongoose.Schema({
  rxCode: {
    type: String,
    unique: true,
    required: true,
    default: () => 'RX-' + Math.floor(100000 + Math.random() * 900000)
  },
  patientName: { type: String, required: true },
  patientEmail: { type: String, required: true },
  patientPhone: { type: String, default: '' },
  prescribedBy: { type: String, required: true }, // Pharmacist or Doctor Name
  facilityName: { type: String, default: 'PharmaCare Wellness Clinic, Onitsha' },
  medications: [medicationSchema],
  diagnosis: { type: String, default: 'General Consultation & Care' },
  clinicalNotes: { type: String, default: 'Follow prescribed dosage. Reach out if symptoms persist.' },
  status: {
    type: String,
    enum: ['Active', 'Refill Requested', 'Dispensed', 'Expired'],
    default: 'Active'
  },
  issueDate: { type: Date, default: Date.now },
  expiryDate: {
    type: Date,
    default: () => new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days validity
  }
}, { timestamps: true });

module.exports = mongoose.model('Prescription', prescriptionSchema);
