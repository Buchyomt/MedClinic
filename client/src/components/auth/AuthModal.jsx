import { API_BASE_URL } from '../../config/api';
import React, { useEffect, useState } from 'react'
import { 
  X, User, Mail, Lock, Phone, Stethoscope, UserCheck, ShieldCheck, 
  Sparkles, AlertCircle, Eye, EyeOff, Pill, Loader2 
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import OtpModal from '../confirm/OtpModal'
import GoogleAuthButton from './GoogleAuthButton'

export default function AuthModal({ isOpen, onClose, initialMode = 'login', onAuthSuccess }) {
  const { login, register } = useAuth()
  const [mode, setMode] = useState(initialMode) // 'login' | 'signup'
  const [selectedRole, setSelectedRole] = useState('patient') // 'patient' | 'pharmacist' | 'doctor' | 'receptionist'

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    specialty: 'General Medicine'
  })
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isOtpOpen, setIsOtpOpen] = useState(false)
  const [pendingAuthAction, setPendingAuthAction] = useState(null) // 'signup' | 'login'

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = '' }
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.email || !formData.password) {
      setError('Please enter both your email address and password.')
      return
    }

    setLoading(true)

    try {
      // Security OTP Dispatch for real logins
      const otpRes = await fetch(`${API_BASE_URL}/api/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email.trim(), 
          purpose: 'login' 
        })
      })
      const otpData = await otpRes.json()

      if (!otpRes.ok) {
        setLoading(false)
        setError(otpData.message || 'Failed to dispatch verification code to your email.')
        return
      }

      setLoading(false)
      setPendingAuthAction('login')
      setIsOtpOpen(true)
    } catch (err) {
      setLoading(false)
      setError('Connection failed. Please ensure the backend server is active.')
    }
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setError('Please fill in all required fields.')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    if (formData.password !== confirmPassword) {
      setError('Passwords do not match. Please re-type your confirm password.')
      return
    }

    setLoading(true)

    try {
      // 1. Check if email already exists in MongoDB
      const checkRes = await fetch(`${API_BASE_URL}/api/auth/check-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email.trim() })
      })
      const checkData = await checkRes.json()

      if (!checkRes.ok) {
        setLoading(false)
        setError(checkData.message || 'An account with this email already exists. Please sign in instead.')
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
        setError(otpData.message || 'Failed to send verification code to this email address.')
        return
      }

      // Open OTP Modal - User cannot sign up completely without entering the email code!
      setLoading(false)
      setPendingAuthAction('signup')
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
      if (pendingAuthAction === 'signup') {
        await register({
          name: formData.name,
          email: formData.email.trim(),
          password: formData.password,
          phone: formData.phone,
          role: selectedRole,
          specialty: selectedRole === 'doctor' ? formData.specialty : (selectedRole === 'pharmacist' ? 'Clinical Pharmacy & MTM' : '')
        })
      } else {
        await login(formData.email.trim(), formData.password, selectedRole)
      }

      setLoading(false)
      if (onAuthSuccess) onAuthSuccess()
      onClose()
    } catch (err) {
      setLoading(false)
      setError(err.message || 'Authentication error after verification.')
    }
  }

  const handleQuickDemo = async (demoRole) => {
    setError('')
    setLoading(true)
    let demoEmail = 'patient@medclinic.com'
    if (demoRole === 'pharmacist') demoEmail = 'pharmacist@medclinic.com'
    else if (demoRole === 'doctor') demoEmail = 'doctor@medclinic.com'
    else if (demoRole === 'receptionist') demoEmail = 'reception@medclinic.com'

    try {
      await login(demoEmail, 'password123', demoRole)
      setLoading(false)
      if (onAuthSuccess) onAuthSuccess()
      onClose()
    } catch (err) {
      setLoading(false)
      setError(err.message || 'Demo login failed')
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex justify-center items-center p-4 z-50 animate-in fade-in duration-200">
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-gray-100 dark:border-slate-700 relative max-h-[92vh] overflow-y-auto">
          
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-500 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>

          {/* Brand Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-3">
              <ShieldCheck size={26} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {mode === 'login' ? 'Welcome Back to MedClinic' : 'Create Your MedClinic Account'}
            </h2>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
              Access healthcare services, appointments & medical records
            </p>
          </div>

          {/* Tab Switcher: Login / Signup */}
          <div className="flex bg-slate-100 dark:bg-slate-700/60 p-1 rounded-2xl mb-5">
            <button
              onClick={() => { setMode('login'); setError('') }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${mode === 'login' ? 'bg-white dark:bg-slate-800 text-primary shadow-sm' : 'text-gray-500 dark:text-slate-400 hover:text-gray-800'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('signup'); setError('') }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${mode === 'signup' ? 'bg-white dark:bg-slate-800 text-primary shadow-sm' : 'text-gray-500 dark:text-slate-400 hover:text-gray-800'}`}
            >
              Create Account
            </button>
          </div>

          {/* Role Selector */}
          <div className="mb-5">
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-2">Select Your Role</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setSelectedRole('patient')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${selectedRole === 'patient' ? 'border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-900/30 font-bold' : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:border-gray-300'}`}
              >
                <User size={18} className="mx-auto mb-1 text-blue-500" />
                <span className="text-[11px] block">Patient</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('pharmacist')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${selectedRole === 'pharmacist' ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 font-bold' : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:border-gray-300'}`}
              >
                <Pill size={18} className="mx-auto mb-1 text-emerald-500" />
                <span className="text-[11px] block">Pharmacist</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('doctor')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${selectedRole === 'doctor' ? 'border-purple-500 bg-purple-50 text-purple-600 dark:bg-purple-900/30 font-bold' : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:border-gray-300'}`}
              >
                <Stethoscope size={18} className="mx-auto mb-1 text-purple-500" />
                <span className="text-[11px] block">Doctor</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('receptionist')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${selectedRole === 'receptionist' ? 'border-amber-500 bg-amber-50 text-amber-600 dark:bg-amber-900/30 font-bold' : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:border-gray-300'}`}
              >
                <UserCheck size={18} className="mx-auto mb-1 text-amber-500" />
                <span className="text-[11px] block">Reception</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 mb-4 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-xl text-xs font-semibold flex items-center gap-2 border border-red-200/50">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Forms */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={selectedRole === 'doctor' ? 'doctor@medclinic.com' : selectedRole === 'receptionist' ? 'reception@medclinic.com' : selectedRole === 'pharmacist' ? 'pharmacist@medclinic.com' : 'patient@medclinic.com'}
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                <span>{loading ? 'Verifying...' : `Sign In as ${selectedRole.toUpperCase()}`}</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Obi"
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
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your_real_email@gmail.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">
                  A real 4-digit code will be sent to this email for mandatory verification.
                </span>
              </div>

              {/* Password with Visible Option */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
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
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+234 803 123 4567"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {selectedRole === 'doctor' && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Medical Specialty</label>
                  <input
                    type="text"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleChange}
                    placeholder="Cardiology, General Physician, Pediatrics"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-50 mt-2 cursor-pointer"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                <span>{loading ? 'Dispatching Verification Code...' : 'Register & Verify Email'}</span>
              </button>
            </form>
          )}

          {/* Social Google Auth */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-white dark:bg-slate-800 px-3 text-slate-400 font-extrabold tracking-wider">Or {mode === 'login' ? 'continue' : 'register'} with</span>
            </div>
          </div>

          <GoogleAuthButton 
            role={selectedRole} 
            text={mode === 'login' ? 'signin_with' : 'signup_with'} 
            onSuccess={() => {
              if (onAuthSuccess) onAuthSuccess();
              onClose();
            }} 
          />

          {/* Quick Demo Sign In Options */}
          <div className="mt-6 pt-5 border-t border-gray-100 dark:border-slate-700">
            <div className="flex items-center gap-1.5 justify-center text-xs font-bold text-gray-500 dark:text-slate-400 mb-3">
              <Sparkles size={14} className="text-amber-500" />
              <span>1-Click Demo Accounts (Pitch Ready)</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => handleQuickDemo('patient')}
                className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[11px] font-bold hover:bg-blue-100 transition-colors cursor-pointer"
              >
                Patient
              </button>
              <button
                onClick={() => handleQuickDemo('pharmacist')}
                className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                Pharm. Chinedu
              </button>
              <button
                onClick={() => handleQuickDemo('doctor')}
                className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-[11px] font-bold hover:bg-purple-100 transition-colors cursor-pointer"
              >
                Doctor
              </button>
              <button
                onClick={() => handleQuickDemo('receptionist')}
                className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-[11px] font-bold hover:bg-amber-100 transition-colors cursor-pointer"
              >
                Reception
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Mandatory OTP Verification Modal */}
      {isOtpOpen && (
        <OtpModal
          email={formData.email.trim()}
          purpose={pendingAuthAction || 'signup'}
          onVerify={handleOtpVerified}
          onCancel={() => setIsOtpOpen(false)}
        />
      )}
    </>
  )
}
