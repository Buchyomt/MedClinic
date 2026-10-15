const express = require('express');
const router = express.Router();
const ActivityLog = require('../models/ActivityLog');
const Appointment = require('../models/Appointment');

// Helper to log an activity event
const logEvent = async ({ type, userName, userEmail, role, message, details, appointmentId, metadata }) => {
  try {
    const event = new ActivityLog({
      type,
      userName: userName || 'Visitor',
      userEmail: userEmail || '',
      role: role || 'patient',
      message,
      details: details || '',
      appointmentId: appointmentId || null,
      metadata: metadata || null
    });
    await event.save();
    return event;
  } catch (err) {
    console.error('Failed to log activity event:', err);
    return null;
  }
};

// GET latest activity stream
router.get('/', async (req, res) => {
  try {
    const logs = await ActivityLog.find()
      .populate('appointmentId')
      .sort({ createdAt: -1 })
      .limit(40);

    res.json(logs);
  } catch (err) {
    console.error('Error fetching activity logs:', err);
    res.status(500).json({ message: 'Error fetching activity stream', error: err.message });
  }
});

// GET pharmacist notifications & stats (pending appointments + recent visitor logins)
router.get('/notifications', async (req, res) => {
  try {
    // Count pending appointments awaiting pharmacist approval
    const pendingAppointments = await Appointment.find({ status: 'Pending' })
      .sort({ createdAt: -1 })
      .limit(10);

    // Recent visitor logins
    const recentLogins = await ActivityLog.find({ type: 'user_login' })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      pendingCount: pendingAppointments.length,
      pendingAppointments,
      recentLogins
    });
  } catch (err) {
    console.error('Error fetching pharmacist notifications:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST a new activity log entry
router.post('/', async (req, res) => {
  try {
    const { type, userName, userEmail, role, message, details } = req.body;
    const event = await logEvent({ type, userName, userEmail, role, message, details });
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ message: 'Invalid activity data', error: err.message });
  }
});

// PUT mark all as read
router.put('/mark-read', async (req, res) => {
  try {
    await ActivityLog.updateMany({ isRead: false }, { $set: { isRead: true } });
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating notifications' });
  }
});

module.exports = {
  router,
  logEvent
};
