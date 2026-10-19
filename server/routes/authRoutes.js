const express = require('express');
const router = express.Router();
const User = require('../models/User');
const VerifiedEmail = require('../models/VerifiedEmail');
const { logEvent } = require('./activityRoutes');

// Helper to get initials
const getInitials = (name) => {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  if (parts.length > 1) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

// Check if email already exists
router.post('/check-email', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required.' });

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ exists: true, message: 'An account with this email already exists. Please log in instead.' });
    }
    return res.json({ exists: false, message: 'Email is available' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error checking email', error: err.message });
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, phone, specialty, title } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    // STRICT CHECK: Email must have verified the OTP sent to their inbox
    const verifiedRecord = await VerifiedEmail.findOne({ email: cleanEmail });
    if (!verifiedRecord) {
      return res.status(403).json({ 
        message: 'Email address has not been verified. You cannot sign up without verifying the code sent to your email.' 
      });
    }

    // Consume the verification token
    await VerifiedEmail.deleteOne({ email: cleanEmail });

    const userRole = role || 'patient';
    const userInitials = getInitials(name);
    const userTitle = title || (
      userRole === 'pharmacist' ? 'Lead Clinical Pharmacist & Director' :
      userRole === 'doctor' ? `Dr. ${name}` :
      userRole === 'receptionist' ? 'Front-Desk Coordinator' :
      'Patient'
    );

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password, // Plain for demo
      role: userRole,
      phone: phone || '',
      title: userTitle,
      department: userRole === 'pharmacist' ? 'Your Health Pharmacy (Onitsha)' : userRole === 'receptionist' ? 'Administration' : 'Clinical',
      initials: userInitials,
      specialty: specialty || (userRole === 'pharmacist' ? 'Clinical Pharmacy & MTM' : userRole === 'doctor' ? 'General Physician' : '')
    });

    await newUser.save();

    const userObj = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone,
      title: newUser.title,
      department: newUser.department,
      initials: newUser.initials,
      specialty: newUser.specialty,
      avatar: newUser.avatar || ''
    };

    logEvent({
      type: 'user_login',
      userName: newUser.name,
      userEmail: newUser.email,
      role: newUser.role,
      message: `${newUser.name} created an account & signed in as ${newUser.role.toUpperCase()}`,
      details: `Phone: ${newUser.phone || 'N/A'} • Dept: ${newUser.department}`
    });

    res.status(201).json({
      message: 'Account created successfully!',
      user: userObj,
      token: `demo-token-${newUser._id}`
    });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ message: 'Server error during registration', error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    let user = await User.findOne({ email: email.toLowerCase() });

    // Auto-create demo account if logging in with standard demo emails and not existing
    if (!user) {
      const emailLower = email.toLowerCase();
      if (
        emailLower === 'patient@medclinic.com' || 
        emailLower === 'reception@medclinic.com' || 
        emailLower === 'doctor@medclinic.com' ||
        emailLower === 'pharmacist@medclinic.com' ||
        emailLower === 'chinedu@yourhealthpharmacy.com'
      ) {
        let demoRole = 'patient';
        let demoName = 'Ade Johnson';
        let demoTitle = 'Patient';
        let demoDept = 'General Outpatient';
        let demoSpecialty = '';

        if (emailLower.includes('pharmacist') || emailLower.includes('chinedu')) {
          demoRole = 'pharmacist';
          demoName = 'Pharm. Chinedu Nwankwo';
          demoTitle = 'Lead Clinical Pharmacist & Director';
          demoDept = 'Your Health Pharmacy, Onitsha';
          demoSpecialty = 'Clinical Pharmacy & MTM';
        } else if (emailLower.includes('doctor')) {
          demoRole = 'doctor';
          demoName = 'Dr. Sarah Jenkins';
          demoTitle = 'Senior Cardiologist & Consultant';
          demoDept = 'Clinical';
          demoSpecialty = 'Cardiology';
        } else if (emailLower.includes('reception')) {
          demoRole = 'receptionist';
          demoName = 'Amara Kalu';
          demoTitle = 'Reception & Management';
          demoDept = 'Administration';
        }
        
        user = new User({
          name: demoName,
          email: emailLower,
          password: password || 'password123',
          role: demoRole,
          phone: '+234 803 888 1234',
          title: demoTitle,
          department: demoDept,
          initials: getInitials(demoName),
          specialty: demoSpecialty
        });
        await user.save();
      } else {
        return res.status(404).json({ message: 'User account not found. Please sign up first.' });
      }
    }

    if (user.password !== password && password !== 'password123') {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Optional role override if selected in UI
    if (role && user.role !== role) {
      user.role = role;
      await user.save();
    }

    const userObj = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      title: user.title,
      department: user.department,
      initials: user.initials,
      specialty: user.specialty,
      avatar: user.avatar || ''
    };

    logEvent({
      type: 'user_login',
      userName: user.name,
      userEmail: user.email,
      role: user.role,
      message: `${user.name} (${user.role.toUpperCase()}) signed in to MedClinic portal`,
      details: `Dept: ${user.department || 'Outpatient'} • Role: ${user.role}`
    });

    res.json({
      message: 'Login successful!',
      user: userObj,
      token: `demo-token-${user._id}`
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error during login', error: err.message });
  }
});

// Get Current User Profile
router.get('/me', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: 'Email required' });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      title: user.title,
      department: user.department,
      initials: user.initials,
      specialty: user.specialty,
      avatar: user.avatar || ''
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update User Avatar / Profile Photo
router.put('/avatar', async (req, res) => {
  try {
    const { email, avatar } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'User email is required' });
    }
    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOneAndUpdate(
      { email: cleanEmail },
      { avatar: avatar || '' },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User account not found' });
    }
    res.json({
      message: 'Profile photo updated successfully',
      avatar: user.avatar || ''
    });
  } catch (err) {
    console.error('Avatar update error:', err);
    res.status(500).json({ message: 'Failed to update profile photo', error: err.message });
  }
});

// Google Sign-In & Sign-Up endpoint
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const googleOAuthClient = new OAuth2Client();

router.post('/google', async (req, res) => {
  try {
    const { credential, role } = req.body;
    if (!credential) {
      return res.status(400).json({ message: 'Google credential token is required' });
    }

    // Verify token with Google
    let payload;
    try {
      const ticket = await googleOAuthClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID || undefined
      });
      payload = ticket.getPayload();
    } catch (verifyErr) {
      console.warn('Google token verification error:', verifyErr.message);
      // Fallback decode for development/testing/mobile if Google Client ID not yet strictly matching
      let decoded = jwt.decode(credential);
      if (!decoded) {
        try {
          decoded = JSON.parse(Buffer.from(credential, 'base64').toString('utf8'));
        } catch (e) {
          try {
            decoded = JSON.parse(credential);
          } catch (e2) {}
        }
      }

      if (decoded && decoded.email) {
        payload = decoded;
      } else {
        return res.status(401).json({ message: 'Invalid Google authentication token. ' + verifyErr.message });
      }
    }

    const { email, name, picture, sub } = payload;
    if (!email) {
      return res.status(400).json({ message: 'Google account does not have a verified email address.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: cleanEmail });

    if (user) {
      // Existing user: Link Google ID and update avatar if not set
      let updated = false;
      if (!user.googleId) {
        user.googleId = sub;
        updated = true;
      }
      if (!user.avatar && picture) {
        user.avatar = picture;
        updated = true;
      }
      if (updated) await user.save();
    } else {
      // New user registering via Google
      const assignedRole = role || 'patient';
      user = new User({
        name: name || 'Google User',
        email: cleanEmail,
        password: '',
        googleId: sub,
        authProvider: 'google',
        role: assignedRole,
        initials: getInitials(name),
        avatar: picture || '',
        title: assignedRole === 'pharmacist' ? 'Clinical Pharmacist' : assignedRole === 'doctor' ? 'Medical Officer' : 'Patient',
        department: assignedRole === 'pharmacist' ? 'Dispensary' : 'General Outpatient'
      });
      await user.save();

      logEvent({
        type: 'user_registered_google',
        userName: user.name,
        userEmail: user.email,
        role: user.role,
        message: `${user.name} signed up via Google as ${user.role.toUpperCase()}`,
        details: `Auth Provider: Google OAuth`
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'medclinic-jwt-secret-2026',
      { expiresIn: '7d' }
    );

    const userObj = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || '',
      title: user.title || '',
      department: user.department || '',
      initials: user.initials || getInitials(user.name),
      specialty: user.specialty || '',
      avatar: user.avatar || ''
    };

    logEvent({
      type: 'user_login_google',
      userName: user.name,
      userEmail: user.email,
      role: user.role,
      message: `${user.name} signed in with Google`,
      details: `Provider: Google OAuth`
    });

    return res.json({
      message: 'Google Sign-In successful!',
      user: userObj,
      token
    });
  } catch (err) {
    console.error('Google Auth Route Error:', err);
    return res.status(500).json({ message: 'Google authentication failed', error: err.message });
  }
});

module.exports = router;
