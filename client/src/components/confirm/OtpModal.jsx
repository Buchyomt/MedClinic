import { API_BASE_URL } from '../../config/api';
import React, { useState, useEffect, useRef } from 'react'
import { ShieldCheck, Loader2, RefreshCw, Mail, CheckCircle2, ArrowLeft } from 'lucide-react'

export default function OtpModal({ email, purpose = 'booking', onVerify, onCancel, onChangeEmail }) {
  const [otp, setOtp] = useState(['', '', '', ''])
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(15)
  const inputRefs = useRef([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const handleChange = (index, value) => {
    // Auto-fill all inputs if user pastes multiple digits
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').slice(0, 4).split('')
      if (digits.length > 0) {
        const nextOtp = [...otp]
        digits.forEach((d, i) => {
          if (i < 4) nextOtp[i] = d
        })
        setOtp(nextOtp)
        const focusIdx = Math.min(digits.length, 3)
        inputRefs.current[focusIdx]?.focus()
        return
      }
    }

    // Only allow digits or empty string
    if (!/^\d*$/.test(value)) return
    
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value !== '' && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4)
    if (pasted) {
      const nextOtp = ['', '', '', '']
      pasted.split('').forEach((d, idx) => {
        if (idx < 4) nextOtp[idx] = d
      })
      setOtp(nextOtp)
      const targetIdx = Math.min(pasted.length, 3)
      inputRefs.current[targetIdx]?.focus()
    }
  }

  const handleVerify = async () => {
    const code = otp.join('')
    if (code.length < 4) {
      setError('Please enter the complete 4-digit code sent to your email')
      return
    }

    setLoading(true)
    setError('')
    setSuccessMessage('')
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email.toLowerCase().trim(), 
          otp: code,
          purpose
        })
      })
      const data = await res.json()
      
      if (res.ok) {
        onVerify()
      } else {
        setError(data.message || 'Invalid or expired code. Please check your email inbox.')
        setLoading(false)
      }
    } catch {
      setError('Network connection error. Please try again.')
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (resendCooldown > 0 || resending) return
    setResending(true)
    setError('')
    setSuccessMessage('')

    try {
      const res = await fetch(`${API_BASE_URL}/api/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email.toLowerCase().trim(), 
          purpose 
        })
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || 'Could not send verification code.')
      } else {
        setSuccessMessage('New verification code sent! Please check your email inbox & spam folder.')
        setResendCooldown(25)
        setOtp(['', '', '', ''])
        inputRefs.current[0]?.focus()
      }
    } catch {
      setError('Failed to resend code. Please check your network connection.')
    } finally {
      setResending(false)
    }
  }

  const modalTitle = purpose === 'login' 
    ? 'Sign In Security Verification' 
    : purpose === 'signup' 
      ? 'Verify Your Email Address' 
      : 'Verify Appointment Booking'

  return (
    <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-md flex justify-center items-center px-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-sm shadow-2xl flex flex-col items-center border border-slate-100 dark:border-slate-700 animate-in zoom-in-95 duration-200">
        
        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-4 text-primary dark:text-blue-400 shadow-inner">
          <ShieldCheck size={32} />
        </div>
        
        <h2 className="text-xl font-black text-gray-900 dark:text-white mb-1.5 text-center">
          {modalTitle}
        </h2>
        
        <p className="text-gray-500 dark:text-slate-400 text-xs mb-5 text-center leading-relaxed">
          We sent a real 4-digit verification code to: <br/>
          <strong className="text-gray-900 dark:text-slate-200 text-sm font-bold flex items-center justify-center gap-1.5 mt-1 bg-slate-50 dark:bg-slate-700/60 py-1 px-3 rounded-lg border border-slate-200/60 dark:border-slate-600">
            <Mail size={14} className="text-primary shrink-0" />
            <span className="truncate max-w-[220px]">{email}</span>
          </strong>
          <span className="block text-[11px] text-slate-400 dark:text-slate-500 mt-1.5">
            (Check inbox & spam folder. Code expires in 5 mins)
          </span>
        </p>

        {/* 4 Digit Inputs */}
        <div className="flex gap-2.5 sm:gap-3 mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength="4"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-12 h-14 sm:w-13 sm:h-15 text-center text-2xl font-black bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-2xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-slate-900 dark:text-white"
            />
          ))}
        </div>

        {error && (
          <div className="p-2.5 mb-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl text-xs text-rose-600 dark:text-rose-400 font-bold text-center w-full">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="p-2.5 mb-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-xl text-xs text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center gap-1.5 w-full">
            <CheckCircle2 size={15} className="shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Resend Verification Code Section */}
        <div className="mb-5 w-full bg-slate-50 dark:bg-slate-700/40 rounded-2xl p-3 border border-slate-100 dark:border-slate-700 text-center">
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-1.5 font-medium">
            Didn't get the code in your email?
          </p>
          {resendCooldown > 0 ? (
            <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1">
              <RefreshCw size={12} className="animate-spin text-slate-400" />
              <span>You can resend in <strong className="text-primary font-bold">{resendCooldown}s</strong></span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="w-full py-2 px-3 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {resending ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
              <span>Resend Verification Code Now</span>
            </button>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="w-full space-y-2">
          <button 
            onClick={handleVerify}
            disabled={loading}
            className="w-full bg-primary hover:bg-blue-700 active:scale-98 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-50"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            <span>Verify & Continue</span>
          </button>
          
          <button 
            onClick={onCancel}
            disabled={loading}
            className="w-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold py-2.5 rounded-xl transition-colors text-xs cursor-pointer flex items-center justify-center gap-1.5"
          >
            <ArrowLeft size={14} />
            <span>Cancel & Change Details</span>
          </button>
        </div>
      </div>
    </div>
  )
}
