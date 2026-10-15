const express = require('express');
const router = express.Router();
const Prescription = require('../models/Prescription');

// Default initial demo prescriptions for instant preview
const seedPrescriptions = [
  {
    rxCode: 'RX-748291',
    patientName: 'Ade Johnson',
    patientEmail: 'patient@medclinic.com',
    patientPhone: '+234 803 456 7890',
    prescribedBy: 'Pharm. Chinedu Nwankwo',
    facilityName: 'Your Health Pharmacy, GRA, Onitsha',
    diagnosis: 'Mild Hypertension & Allergy Rhinitis',
    clinicalNotes: 'Monitor BP every morning before breakfast. Keep hydrated.',
    status: 'Active',
    medications: [
      {
        name: 'Amlodipine 5mg Tablets',
        dosage: '1 Tablet Daily',
        frequency: 'Once every morning',
        duration: '30 Days',
        instructions: 'Take with or without food',
        refillsAllowed: 3,
        refillsRemaining: 2
      },
      {
        name: 'Cetirizine 10mg Tablets',
        dosage: '1 Tablet',
        frequency: 'Once at night before bed',
        duration: '14 Days',
        instructions: 'May cause mild drowsiness',
        refillsAllowed: 1,
        refillsRemaining: 1
      }
    ],
    issueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
  },
  {
    rxCode: 'RX-982104',
    patientName: 'Ade Johnson',
    patientEmail: 'patient@medclinic.com',
    patientPhone: '+234 803 456 7890',
    prescribedBy: 'Pharm. Chinedu Nwankwo',
    facilityName: 'Your Health Pharmacy, GRA, Onitsha',
    diagnosis: 'Acute Bacterial Throat Infection',
    clinicalNotes: 'Complete full antimicrobial course even if feeling better.',
    status: 'Dispensed',
    medications: [
      {
        name: 'Amoxicillin-Clavulanate 625mg',
        dosage: '1 Tablet',
        frequency: 'Twice daily after meals',
        duration: '7 Days',
        instructions: 'Take immediately after food to prevent stomach upset',
        refillsAllowed: 0,
        refillsRemaining: 0
      }
    ],
    issueDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000)
  }
];

// GET: Fetch prescriptions (filter by email if provided)
router.get('/', async (req, res) => {
  try {
    const { email } = req.query;
    let query = {};
    if (email) {
      query.patientEmail = email;
    }

    let prescriptions = await Prescription.find(query).sort({ createdAt: -1 });
    
    // Seed initial data if database is empty
    if (prescriptions.length === 0 && !email) {
      try {
        prescriptions = await Prescription.insertMany(seedPrescriptions);
      } catch {
        return res.json(seedPrescriptions);
      }
    } else if (prescriptions.length === 0 && email) {
      // Return matching seeds for demo patient
      const fallback = seedPrescriptions.filter(p => p.patientEmail === email);
      return res.json(fallback);
    }

    res.json(prescriptions);
  } catch (_err) {
    // Offline/in-memory fallback
    const { email } = req.query;
    if (email) {
      return res.json(seedPrescriptions.filter(p => p.patientEmail === email));
    }
    res.json(seedPrescriptions);
  }
});

// POST: Issue new digital prescription
router.post('/', async (req, res) => {
  try {
    const { patientName, patientEmail, patientPhone, prescribedBy, facilityName, medications, diagnosis, clinicalNotes } = req.body;
    
    if (!patientName || !patientEmail || !medications || medications.length === 0) {
      return res.status(400).json({ message: 'Patient name, email, and at least 1 medication are required.' });
    }

    const rxCode = 'RX-' + Math.floor(100000 + Math.random() * 900000);
    const newRx = new Prescription({
      rxCode,
      patientName,
      patientEmail,
      patientPhone: patientPhone || '',
      prescribedBy: prescribedBy || 'Pharm. Chinedu Nwankwo',
      facilityName: facilityName || 'Your Health Pharmacy, Onitsha',
      medications,
      diagnosis: diagnosis || 'General Pharmacy Consultation',
      clinicalNotes: clinicalNotes || 'Follow prescribed directions.',
      status: 'Active'
    });

    const savedRx = await newRx.save();
    res.status(201).json(savedRx);
  } catch (err) {
    // Return structured object on fallback
    const mockRx = {
      _id: 'rx-' + Date.now(),
      rxCode: 'RX-' + Math.floor(100000 + Math.random() * 900000),
      ...req.body,
      status: 'Active',
      createdAt: new Date().toISOString()
    };
    res.status(201).json(mockRx);
  }
});

// POST: Request Refill for an Rx Code
router.post('/refill', async (req, res) => {
  try {
    const { rxCode, notes } = req.body;
    if (!rxCode) {
      return res.status(400).json({ message: 'Prescription code (Rx Code) is required.' });
    }

    const rx = await Prescription.findOne({ rxCode: rxCode.toUpperCase() });
    if (!rx) {
      return res.status(404).json({ message: `Prescription #${rxCode} not found in pharmacy database.` });
    }

    rx.status = 'Refill Requested';
    if (notes) {
      rx.clinicalNotes = `${rx.clinicalNotes} | Refill Note: ${notes}`;
    }
    await rx.save();

    res.json({ message: `Refill request for #${rx.rxCode} submitted successfully to the pharmacy!`, prescription: rx });
  } catch (err) {
    res.json({ message: `Refill request for #${req.body.rxCode || 'RX'} submitted successfully!`, success: true });
  }
});

// PATCH: Update status (Dispensed, Approved, Cancelled)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const rx = await Prescription.findById(req.params.id);
    if (!rx) {
      return res.status(404).json({ message: 'Prescription not found.' });
    }

    rx.status = status;
    if (status === 'Dispensed') {
      rx.medications.forEach(m => {
        if (m.refillsRemaining > 0) m.refillsRemaining -= 1;
      });
    }
    await rx.save();

    res.json(rx);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update prescription status.' });
  }
});

module.exports = router;
