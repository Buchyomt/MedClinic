const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  rating: { type: Number, required: true },
  reviews: { type: Number, required: true },
  experience: { type: String, required: true },
  patients: { type: String, required: true },
  about: { type: String, required: true },
  image: { type: String, required: true },
  availability: [
    {
      date: { type: String, required: true }, 
      slots: [{ type: String }] 
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
