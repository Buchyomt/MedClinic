const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true
  },
  otp: {
    type: String,
    required: true
  },
  purpose: {
    type: String,
    enum: ['signup', 'booking', 'login', 'general'],
    default: 'booking'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300 // TTL Index: Auto-expires after 5 minutes
  }
});

module.exports = mongoose.model('Otp', otpSchema);
