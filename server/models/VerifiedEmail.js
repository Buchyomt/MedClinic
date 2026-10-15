const mongoose = require('mongoose');

const verifiedEmailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true
  },
  verifiedAt: {
    type: Date,
    default: Date.now,
    expires: 900 // Auto-expires in 15 minutes
  }
});

module.exports = mongoose.model('VerifiedEmail', verifiedEmailSchema);
