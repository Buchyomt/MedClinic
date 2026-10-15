const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const mongoose = require('mongoose');
const { logEvent } = require('./activityRoutes');

// Create a new appointment
router.post('/', async (req, res) => {
  try {
    const payload = { ...req.body };

    // If doctorId is provided but not a valid 24-char ObjectId, remove it and assign providerName
    if (payload.doctorId && !mongoose.Types.ObjectId.isValid(payload.doctorId)) {
      if (!payload.providerName) {
        payload.providerName = 'Pharm. Chinedu Nwankwo';
      }
      payload.providerType = 'pharmacist';
      delete payload.doctorId;
    }

    // Assign token number for queue check-in if not provided
    if (!payload.tokenNumber) {
      payload.tokenNumber = `MC-${Math.floor(100 + Math.random() * 900)}`;
    }
    if (!payload.consultationType) {
      payload.consultationType = 'in_person';
    }

    const appointment = new Appointment(payload);
    const createdAppointment = await appointment.save();
    let populated = createdAppointment;
    if (createdAppointment.doctorId) {
      populated = await Appointment.findById(createdAppointment._id).populate('doctorId', 'name specialty image');
    }
    // Log activity event for Pharmacist Command Center notification
    logEvent({
      type: 'appointment_booked',
      userName: payload.patientName,
      userEmail: payload.email,
      role: 'patient',
      message: `New booking: ${payload.patientName} requested ${payload.serviceName || 'Clinical Consultation'} (Awaiting Pharmacist Approval)`,
      details: `Date: ${payload.date} at ${payload.time} • Phone: ${payload.phone}`,
      appointmentId: createdAppointment._id,
      metadata: {
        appointmentId: createdAppointment._id,
        patientName: payload.patientName,
        phone: payload.phone,
        email: payload.email,
        serviceName: payload.serviceName || 'Clinical Consultation',
        reason: payload.reason,
        date: payload.date,
        time: payload.time,
        status: createdAppointment.status || 'Pending'
      }
    });

    res.status(201).json(populated);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
});

// Get appointments with filtering support (by email, doctorId, doctorName, or date)
router.get('/', async (req, res) => {
  try {
    const { email, doctorId, doctorName, date } = req.query;
    let query = {};

    if (date) {
      query.date = date;
    }

    if (email) {
      query.email = { $regex: new RegExp(`^${email.trim()}$`, 'i') };
    }

    if (doctorId && mongoose.Types.ObjectId.isValid(doctorId)) {
      query.doctorId = doctorId;
    }

    let appointments = await Appointment.find(query)
      .populate('doctorId', 'name specialty image')
      .sort({ createdAt: -1 });

    if (doctorName) {
      const nameKey = doctorName.replace(/^(Dr\.|Pharm\.)\s*/i, '').toLowerCase();
      appointments = appointments.filter(apt => 
        apt.doctorId?.name?.toLowerCase().includes(nameKey) ||
        apt.providerName?.toLowerCase().includes(nameKey)
      );
    }

    // Ensure fallback doctorId object for UI compatibility
    const mapped = appointments.map(apt => {
      const obj = apt.toObject();
      if (!obj.doctorId && obj.providerName) {
        obj.doctorId = {
          _id: 'pharmacist-chinedu',
          name: obj.providerName,
          specialty: obj.providerType === 'pharmacist' ? 'Clinical Pharmacy & MTM' : 'Clinical Specialist',
          image: '/doctor-1.jpg'
        };
      }
      return obj;
    });

    res.json(mapped);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Full update for an appointment (Edit details)
router.put('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const fields = ['patientName', 'email', 'phone', 'reason', 'date', 'time', 'status', 'doctorId'];
    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        appointment[field] = req.body[field];
      }
    });

    const updated = await appointment.save();
    const populated = await Appointment.findById(updated._id).populate('doctorId', 'name specialty image');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating appointment', error: error.message });
  }
});

// Update appointment status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (appointment) {
      appointment.status = status || appointment.status;
      const updated = await appointment.save();
      const populated = await Appointment.findById(updated._id).populate('doctorId', 'name specialty image');

      if (status === 'Confirmed') {
        logEvent({
          type: 'appointment_approved',
          userName: 'Pharm. Chinedu Nwankwo',
          role: 'pharmacist',
          message: `Pharm. Chinedu approved consultation for ${appointment.patientName}`,
          details: `Date: ${appointment.date} at ${appointment.time}`
        });
      }

      res.json(populated);
    } else {
      res.status(404).json({ message: 'Appointment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Explicit 1-click Pharmacist Approval endpoint
router.put('/:id/approve', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    appointment.status = 'Confirmed';
    const updated = await appointment.save();

    logEvent({
      type: 'appointment_approved',
      userName: 'Pharm. Chinedu Nwankwo',
      role: 'pharmacist',
      message: `Pharm. Chinedu approved consultation for ${appointment.patientName}`,
      details: `Scheduled: ${appointment.date} at ${appointment.time}`
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error approving appointment', error: error.message });
  }
});

// Rate an appointment
router.patch('/:id/rate', async (req, res) => {
  try {
    const { rating, feedback } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (appointment) {
      if (rating) appointment.rating = rating;
      if (feedback !== undefined) appointment.feedback = feedback;
      const updated = await appointment.save();
      const populated = await Appointment.findById(updated._id).populate('doctorId', 'name specialty image');
      res.json(populated);
    } else {
      res.status(404).json({ message: 'Appointment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error rating appointment', error: error.message });
  }
});

// Delete an appointment
router.delete('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (appointment) {
      res.json({ message: 'Appointment deleted successfully', id: req.params.id });
    } else {
      res.status(404).json({ message: 'Appointment not found' });
    }
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ message: 'Error deleting appointment', error: error.message });
  }
});

module.exports = router;
