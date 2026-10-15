import { API_BASE_URL } from '../config/api';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  ShieldCheck, Mail, Lock, User, Phone, UserCheck, Stethoscope, 
  ChevronLeft, AlertCircle, Pill, Loader2, Eye, EyeOff 
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import OtpModal from '../components/confirm/OtpModal'
import GoogleAuthButton from '../components/auth/GoogleAuthButton'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'patient',
    specialty: 'General Medicine'
  })
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isOtpOpen, setIsOtpOpen] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setError('Please complete all required fields.')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    if (formData.password !== confirmPassword) {
      setError('Passwords do not match. Please re-type your password.')
      return
    }

    setLoading(true)

    try {
      // 1. Pre-check if email already exists in MongoDB
      const checkRes = await fetch(`${API_BASE_URL}/api/auth/check-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email.trim() })
      })
      const checkData = await checkRes.json()

      if (!checkRes.ok) {
        setLoading(false)
        setError(checkData.message || 'This email address is already in use. Please sign in instead.')
        return
      }

      // 2. Dispatch real OTP code to the email address
      const otpRes = await fetch(`${API_BASE_URL}/api/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email.trim(), 
          purpose: 'signup' 
        })
      })
      const otpData = await otpRes.json()

      if (!otpRes.ok) {
        setLoading(false)
        setError(otpData.message || 'Failed to dispatch verification code. Please verify your email.')
        return
      }

      // Open OTP Modal - User CANNOT sign up without entering the code received in their email
      setLoading(false)
      setIsOtpOpen(true)
    } catch (err) {
      setLoading(false)
      setError('Server connection error. Please ensure the backend server is active.')
    }
  }

  const handleOtpVerified = async () => {
    setIsOtpOpen(false)
    setLoading(true)
    try {
      await register(formData)
      setLoading(false)
      navigate('/dashboard')
    } catch (err) {
      setLoading(false)
      setError(err.message || 'Registration failed after verification.')
    }
  }

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900 min-h-screen relative shadow-lg flex flex-col justify-between overflow-y-auto">
      <div className="p-6">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white text-sm font-bold mb-6">
          <ChevronLeft size={20} />
          Back to Home
        </Link>

        <div className="max-w-md mx-auto bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 dark:border-slate-700">
          
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-3">
              <ShieldCheck size={30} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Your Account</h1>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Join Medclinic to manage appointments & healthcare</p>
          </div>

          {/* Role selector (Patient, Pharmacist, Doctor, Receptionist) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'patient', specialty: '' })}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                formData.role === 'patient' 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold shadow-xs' 
                  : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
              }`}
            >
              <User size={18} className="mx-auto mb-1 text-blue-500" />
              <span className="text-xs block">Patient</span>
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'pharmacist', specialty: 'Clinical Pharmacy & MTM' })}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                formData.role === 'pharmacist' 
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold shadow-xs' 
                  : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
              }`}
            >
              <Pill size={18} className="mx-auto mb-1 text-emerald-500" />
              <span className="text-xs block">Pharmacist</span>
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'doctor', specialty: 'Cardiology' })}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                formData.role === 'doctor' 
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-bold shadow-xs' 
                  : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
              }`}
            >
              <Stethoscope size={18} className="mx-auto mb-1 text-purple-500" />
              <span className="text-xs block">Doctor</span>
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'receptionist', specialty: '' })}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                formData.role === 'receptionist' 
                  ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 font-bold shadow-xs' 
                  : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
              }`}
            >
              <UserCheck size={18} className="mx-auto mb-1 text-amber-500" />
              <span className="text-xs block">Reception</span>
            </button>
          </div>

          {error && (
            <div className="p-3 mb-4 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-xl text-xs font-semibold flex items-center gap-2 border border-red-100 dark:border-red-900/50">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. John Obi or Dr. Sarah"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your_real_email@gmail.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">
                We will dispatch a 4-digit verification code to this email.
              </span>
            </div>

            {/* Password with Visible Option */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="At least 6 characters"
                  required
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Confirm Password with Visible Option */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Confirm Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type your password"
                  required
                  className={`w-full pl-10 pr-11 py-2.5 rounded-xl border dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                    confirmPassword && confirmPassword !== formData.password
                      ? 'border-rose-300 dark:border-rose-700'
                      : 'border-gray-200 dark:border-slate-600'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {confirmPassword && confirmPassword !== formData.password && (
                <span className="text-[11px] text-rose-500 font-semibold mt-1 block">
                  Passwords do not match
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Phone Number</label>
              <div className="relative">
                <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+234 803 123 4567"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {formData.role === 'doctor' && (
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Medical Specialty</label>
                <input
                  type="text"
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  placeholder="Cardiology, Pediatrics, Neurology"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-primary hover:bg-blue-700 active:scale-98 text-white font-bold text-sm transition-all shadow-md shadow-primary/20 disabled:opacity-50 mt-2 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              <span>{loading ? 'Sending Code...' : 'Register & Verify Email'}</span>
            </button>
          </form>

          {/* Social Google Sign-Up */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-white dark:bg-slate-800 px-3 text-slate-400 font-extrabold tracking-wider">Or register with</span>
            </div>
          </div>

          <GoogleAuthButton role={formData.role} text="signup_with" />

          <div className="mt-6 text-center text-xs text-gray-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline">
              Sign In
            </Link>
          </div>

        </div>
      </div>

      {/* OTP Modal - Triggered on signup, code must be verified */}
      {isOtpOpen && (
        <OtpModal
          email={formData.email.trim()}
          purpose="signup"
          onVerify={handleOtpVerified}
          onCancel={() => setIsOtpOpen(false)}
        />
      )}
    </div>
  )
}
