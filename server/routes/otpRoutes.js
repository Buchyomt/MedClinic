const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Otp = require('../models/Otp');
const VerifiedEmail = require('../models/VerifiedEmail');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Create reusable transporter helper (hot-reloads .env on every request so no server restart is needed)
const getTransporter = () => {
  try {
    const envPath = path.resolve(__dirname, '../.env');
    if (fs.existsSync(envPath)) {
      const envConfig = dotenv.parse(fs.readFileSync(envPath));
      for (const k in envConfig) {
        process.env[k] = envConfig[k];
      }
    }
  } catch (e) {
    console.error('Error hot-reloading .env:', e.message);
  }

  const user = process.env.EMAIL_USER ? process.env.EMAIL_USER.trim() : null;
  const pass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, '').trim() : null;

  if (user && pass) {
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user, pass },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 20000
    });
  }
  return null;
};

// Generate HTML email template
const generateEmailHtml = (otp, purpose = 'booking') => {
  let headline = 'Confirm Your Consultation';
  let subtext = 'You have initiated an appointment booking. Please enter the 4-digit code below to confirm your clinical visit.';

  if (purpose === 'signup') {
    headline = 'Verify Your Account Registration';
    subtext = 'Welcome to MedClinic Healthcare! Please use the 4-digit verification code below to complete creating your account.';
  } else if (purpose === 'login') {
    headline = 'Sign In Security Verification';
    subtext = 'A sign-in request was made for your MedClinic account. Enter the 4-digit security code below to complete your login.';
  }

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${headline}</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 30px 15px;">
      <tr>
        <td align="center">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08); border: 1px solid #e2e8f0;">
            <!-- Header Banner -->
            <tr>
              <td style="background: linear-gradient(135deg, #1e40af 0%, #0284c7 50%, #0d9488 100%); padding: 32px 28px; text-align: center;">
                <div style="display: inline-block; background-color: rgba(255, 255, 255, 0.2); padding: 8px 16px; border-radius: 9999px; margin-bottom: 12px;">
                  <span style="color: #ffffff; font-size: 13px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">🏥 MedClinic Healthcare</span>
                </div>
                <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">${headline}</h1>
              </td>
            </tr>

            <!-- Body Content -->
            <tr>
              <td style="padding: 32px 28px; text-align: center;">
                <p style="margin: 0 0 24px 0; color: #475569; font-size: 14px; line-height: 1.6;">
                  ${subtext}
                </p>

                <!-- Code Container -->
                <div style="background-color: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 16px; padding: 20px; margin: 0 auto 24px auto; max-width: 320px;">
                  <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 6px;">Your 4-Digit Security Code</div>
                  <div style="font-size: 38px; font-weight: 900; letter-spacing: 10px; color: #1e3a8a; font-family: monospace;">
                    ${otp}
                  </div>
                </div>

                <!-- Expiry Note -->
                <div style="display: inline-flex; align-items: center; gap: 6px; background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 9999px; padding: 6px 14px; margin-bottom: 24px;">
                  <span style="color: #ef4444; font-size: 12px; font-weight: 700;">⏱️ Code expires in 5 minutes</span>
                </div>

                <p style="margin: 0; color: #94a3b8; font-size: 12px; line-height: 1.5;">
                  If you did not request this code, please secure your account immediately. Never disclose this code to anyone.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color: #f8fafc; padding: 20px 28px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="margin: 0; color: #64748b; font-size: 11px; font-weight: 500;">
                  MedClinic Healthcare Services &bull; Clinical Outpatient & Telehealth Network
                </p>
                <p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 10px;">
                  Automated security message. Please do not reply directly to this email.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
};

// Send OTP (Strictly sends to the real email address and never leaks code to terminal/client)
router.post('/send', async (req, res) => {
  const { email, purpose = 'booking' } = req.body;
  if (!email) return res.status(400).json({ message: 'Email address is required.' });

  const cleanEmail = email.toLowerCase().trim();

  // Validate standard email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    return res.status(400).json({ message: 'Please provide a valid email address.' });
  }

  // Generate random 4-digit OTP
  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  try {
    // 1. Save in MongoDB with auto-expiring TTL
    await Otp.findOneAndUpdate(
      { email: cleanEmail, purpose },
      { otp, createdAt: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // 2. Dispatch real email via Nodemailer
    const transporter = getTransporter();

    if (!transporter) {
      return res.status(500).json({ 
        message: 'Email service configuration missing. Please verify EMAIL_USER and EMAIL_PASS in server/.env' 
      });
    }

    let subject = `Your MedClinic Consultation Verification Code: ${otp}`;
    if (purpose === 'signup') {
      subject = `Your MedClinic Account Verification Code: ${otp}`;
    } else if (purpose === 'login') {
      subject = `Your MedClinic Sign-In Verification Code: ${otp}`;
    }

    await transporter.sendMail({
      from: `"MedClinic Healthcare" <${process.env.EMAIL_USER}>`,
      to: cleanEmail,
      subject,
      html: generateEmailHtml(otp, purpose)
    });

    console.log(`[EMAIL DISPATCH SUCCESS] Real verification code dispatched to: ${cleanEmail}`);

    return res.json({ 
      message: `A 4-digit verification code has been dispatched to ${cleanEmail}. Please check your inbox or spam folder.`, 
      delivered: true 
    });
  } catch (error) {
    console.error('Email Dispatch Failure:', error.message);
    return res.status(500).json({ 
      message: 'Failed to deliver verification code to this email address. Please check that the email is correct and able to receive messages.',
      error: error.message 
    });
  }
});

// Verify OTP against MongoDB
router.post('/verify', async (req, res) => {
  const { email, otp, purpose } = req.body;
  
  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and 4-digit code are required' });
  }

  const cleanEmail = email.toLowerCase().trim();
  const cleanOtp = String(otp).trim();

  try {
    const query = { email: cleanEmail, otp: cleanOtp };
    if (purpose) query.purpose = purpose;

    // Find and consume once verified
    const record = await Otp.findOneAndDelete(query);

    if (!record) {
      return res.status(400).json({ 
        message: 'Invalid or expired verification code. Please check your email inbox or request a new code.' 
      });
    }

    // If verified for signup, record verified email for 15 minutes
    if (purpose === 'signup' || record.purpose === 'signup') {
      await VerifiedEmail.findOneAndUpdate(
        { email: cleanEmail },
        { email: cleanEmail, verifiedAt: new Date() },
        { upsert: true, new: true }
      );
    }

    return res.json({ 
      message: 'Verification confirmed successfully!', 
      verified: true 
    });
  } catch (err) {
    console.error('OTP Verification Error:', err);
    return res.status(500).json({ message: 'Error verifying security code', error: err.message });
  }
});

module.exports = router;
