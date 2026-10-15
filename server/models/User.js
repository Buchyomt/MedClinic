const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, default: '' },
  googleId: { type: String, default: '' },
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
  role: { 
    type: String, 
    enum: ['patient', 'receptionist', 'doctor', 'pharmacist'], 
    default: 'patient' 
  },
  phone: { type: String, default: '' },
  title: { type: String, default: '' },
  department: { type: String, default: '' },
  initials: { type: String, default: '' },
  specialty: { type: String, default: '' },
  avatar: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
