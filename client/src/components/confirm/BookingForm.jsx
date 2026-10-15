import React, { useState, useEffect } from 'react'
import { Lock, AlertTriangle, User, Phone, Mail, FileText } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function BookingForm({ onBook }) {
  const { user } = useAuth();
  
  const sanitizePhone = (ph) => {
    if (!ph || ph.includes('+1 (555)')) return '+234 803 456 7890';
    return ph;
  };

  const [name, setName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone ? sanitizePhone(user.phone) : '')
  const [email, setEmail] = useState(user?.email || '')
  const [reason, setReason] = useState('')
  
  const [emailError, setEmailError] = useState('')
  const [phoneError, setPhoneError] = useState('')

  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.email) setEmail(user.email);
      if (user.phone) setPhone(sanitizePhone(user.phone));
    }
  }, [user]);

  const validateEmail = (val) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!val) return 'Email is required'
    if (!re.test(val)) return 'Enter a valid email address'
    return ''
  }

  const validatePhone = (val) => {
    const re = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/
    if (!val) return 'Phone number is required'
    if (!re.test(val) || val.length < 8) return 'Enter a valid phone number'
    return ''
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
    setEmailError(validateEmail(e.target.value))
  }

  const handlePhoneChange = (e) => {
    setPhone(e.target.value)
    setPhoneError(validatePhone(e.target.value))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const eError = validateEmail(email)
    const pError = validatePhone(phone)
    
    setEmailError(eError)
    setPhoneError(pError)
    
    if (!eError && !pError && name) {
      onBook({ name, phone, email, reason })
    }
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm mb-6">
      <h3 className="text-base font-bold text-gray-900 mb-5">Patient Information</h3>
      
      <div className="mb-4 relative">
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1 flex items-center gap-1">
          Full Name <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <User className="h-4 w-4 text-gray-400" />
          </div>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3.5 text-[13px] text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      </div>
      
      <div className="mb-4 relative">
        <label className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 ml-1 flex items-center gap-1 ${phoneError ? 'text-red-500' : 'text-gray-500'}`}>
          Phone Number <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Phone className={`h-4 w-4 ${phoneError ? 'text-red-400' : 'text-gray-400'}`} />
          </div>
          <input 
            type="text" 
            value={phone}
            onChange={handlePhoneChange}
            className={`w-full rounded-xl pl-10 pr-10 py-3.5 text-[13px] text-gray-900 font-bold focus:outline-none focus:ring-2 transition-all ${
              phoneError 
                ? 'bg-red-50 border border-red-300 focus:ring-red-500/20 focus:border-red-500' 
                : 'bg-gray-50 border border-gray-200 focus:ring-primary/20 focus:border-primary'
            }`}
          />
          {phoneError && (
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </div>
          )}
        </div>
        {phoneError && <p className="text-[10px] font-bold text-red-500 mt-1.5 ml-1">{phoneError}</p>}
      </div>

      <div className="mb-4 relative">
        <label className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 ml-1 flex items-center gap-1 ${emailError ? 'text-red-500' : 'text-gray-500'}`}>
          Email Address <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Mail className={`h-4 w-4 ${emailError ? 'text-red-400' : 'text-gray-400'}`} />
          </div>
          <input 
            type="email" 
            value={email}
            onChange={handleEmailChange}
            className={`w-full rounded-xl pl-10 pr-10 py-3.5 text-[13px] text-gray-900 font-bold focus:outline-none focus:ring-2 transition-all ${
              emailError 
                ? 'bg-red-50 border border-red-300 focus:ring-red-500/20 focus:border-red-500' 
                : 'bg-gray-50 border border-gray-200 focus:ring-primary/20 focus:border-primary'
            }`}
            placeholder="example@mail.com"
          />
          {emailError && (
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </div>
          )}
        </div>
        {emailError && <p className="text-[10px] font-bold text-red-500 mt-1.5 ml-1">{emailError}</p>}
      </div>

      <div className="mb-6 relative">
        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Reason for Visit (Optional)</label>
        <div className="relative">
          <div className="absolute top-4 left-0 pl-3.5 pointer-events-none">
            <FileText className="h-4 w-4 text-gray-400" />
          </div>
          <textarea 
            rows="3"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3.5 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
            placeholder="Briefly describe your symptoms..."
          ></textarea>
        </div>
      </div>
      
      <div className="flex items-start gap-3 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
        <div className="w-5 h-5 mt-0.5 rounded-md bg-primary flex items-center justify-center shrink-0 cursor-pointer shadow-sm">
          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-700 leading-relaxed font-medium">
            I agree to the clinic's <span className="text-primary underline decoration-primary/30 underline-offset-2 cursor-pointer hover:decoration-primary">privacy terms</span> and consent to data processing.
          </p>
        </div>
      </div>
      
      <button 
        onClick={handleSubmit}
        className="w-full relative overflow-hidden group bg-primary text-white font-bold py-4 rounded-xl shadow-[0_8px_20px_rgba(29,78,216,0.25)] hover:shadow-[0_8px_25px_rgba(29,78,216,0.35)] hover:-translate-y-0.5 transition-all duration-200"
      >
        <div className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
        Book Appointment
      </button>

      <div className="flex justify-center items-center gap-1.5 mt-5">
        <Lock size={10} className="text-gray-400" />
        <p className="text-[10px] text-gray-400 font-bold tracking-wide uppercase">
          End-to-End Encrypted
        </p>
      </div>
    </div>
  )
}
