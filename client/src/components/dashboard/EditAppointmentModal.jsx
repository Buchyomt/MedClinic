import React, { useState, useEffect } from 'react'
import { X, User, Calendar, Clock, Phone, Mail, FileText, Check } from 'lucide-react'

export default function EditAppointmentModal({ appointment, onSave, onClose }) {
  const [formData, setFormData] = useState({
    patientName: appointment.patientName || '',
    phone: appointment.phone || '',
    email: appointment.email || '',
    date: appointment.date || '',
    time: appointment.time || '',
    reason: appointment.reason || '',
    status: appointment.status || 'Pending'
  })

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(appointment._id, formData)
  }

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl border border-gray-100 dark:border-slate-700 relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-4 mb-6 border-b border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/40 text-primary flex items-center justify-center">
              <Calendar size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Edit Appointment</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400">Update schedule details & status</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-500 dark:text-slate-300 flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Patient Name</label>
            <div className="relative">
              <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Date</label>
              <div className="relative">
                <Calendar size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Time Slot</label>
              <div className="relative">
                <Clock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  placeholder="09:00 AM"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Phone</label>
              <div className="relative">
                <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Reason / Symptoms</label>
            <div className="relative">
              <FileText size={18} className="absolute left-3.5 top-3 text-gray-400" />
              <textarea
                name="reason"
                rows="2"
                value={formData.reason}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              ></textarea>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-slate-300 font-bold text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <Check size={18} />
              Save Changes
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}
