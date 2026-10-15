import { API_BASE_URL } from '../../config/api';
import React, { useState, useEffect } from 'react'
import { CalendarPlus, User, Calendar, Clock, Loader2, FileText, CheckCircle2 } from 'lucide-react'

export default function AddAppointmentModal({ isOpen, onClose, onAdded }) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    patientName: '',
    phone: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    reason: ''
  })

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await fetch(`${API_BASE_URL}/api/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: formData.patientName,
          phone: formData.phone,
          email: 'walk-in@medclinic.com', // placeholder for staff-added
          reason: formData.reason,
          date: formData.date,
          time: formData.time,
          doctorId: '6691c2cd174fb24e6018ba13', // default doc
          status: 'Confirmed'
        })
      })
      
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        setLoading(false)
        onAdded() // Callback to refresh list
        onClose()
      }, 1500)
    } catch (err) {
      console.error(err)
      setLoading(false)
      // Error already logged above — no browser alert needed
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center px-6 z-50 rounded-b-3xl">
      <div className="bg-white rounded-4xl p-8 w-full max-w-85 shadow-2xl flex flex-col relative animate-in zoom-in-95 duration-200">
        
        {success ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-5 animate-bounce">
              <CheckCircle2 size={32} className="text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Added!</h2>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <CalendarPlus size={20} className="text-primary" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Add Appointment</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <div className="absolute top-3.5 left-3.5 text-gray-400">
                  <User size={16} />
                </div>
                <input 
                  required
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  type="text" 
                  placeholder="Patient Name" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-[13px] text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="relative">
                <div className="absolute top-3.5 left-3.5 text-gray-400">
                  <Calendar size={16} />
                </div>
                <input 
                  required
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  type="date" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-[13px] text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="relative">
                <div className="absolute top-3.5 left-3.5 text-gray-400">
                  <Clock size={16} />
                </div>
                <select 
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-[13px] text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option>09:00 AM</option>
                  <option>10:00 AM</option>
                  <option>11:00 AM</option>
                  <option>02:00 PM</option>
                  <option>04:00 PM</option>
                </select>
              </div>

              <div className="relative">
                <div className="absolute top-3.5 left-3.5 text-gray-400">
                  <FileText size={16} />
                </div>
                <textarea 
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Reason for visit" 
                  rows="2"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                ></textarea>
              </div>

              <div className="pt-2 space-y-3">
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white font-bold py-3.5 rounded-2xl hover:bg-primary-dark transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  Save Appointment
                </button>
                <button 
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="w-full bg-white text-gray-700 font-bold py-3.5 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors shadow-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
