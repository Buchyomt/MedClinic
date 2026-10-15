const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['user_login', 'appointment_booked', 'appointment_approved', 'prescription_order', 'nafdac_verification'],
    required: true 
  },
  userName: { type: String, required: true },
  userEmail: { type: String },
  role: { type: String, default: 'patient' },
  message: { type: String, required: true },
  details: { type: String },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: false },
  metadata: { type: mongoose.Schema.Types.Mixed },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
