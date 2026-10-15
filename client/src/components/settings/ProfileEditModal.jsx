import React, { useEffect, useState } from 'react'
import { X, User, Mail, Phone, Building, Check } from 'lucide-react'

export default function ProfileEditModal({ profile, onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: profile.name || 'Staff Coordinator',
    title: profile.title || 'Reception & Management',
    email: profile.email || 'staff@medclinic.com',
    phone: profile.phone && !profile.phone.includes('+1 (555)') ? profile.phone : '+234 803 456 7890',
    department: profile.department || 'Administration',
    initials: profile.initials || 'SC'
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => {
      const updated = { ...prev, [name]: value }
      if (name === 'name' && value.trim()) {
        const parts = value.trim().split(' ')
        const initials = parts.length > 1 
          ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
          : value.substring(0, 2).toUpperCase()
        updated.initials = initials
      }
      return updated
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl border border-gray-100 dark:border-slate-700 relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-4 mb-6 border-b border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/40 text-primary flex items-center justify-center">
              <User size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Edit User Profile</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400">Update staff coordinator details</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-500 dark:text-slate-300 flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Avatar Preview */}
        <div className="flex items-center gap-4 mb-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700">
          <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold shadow-md shrink-0">
            {formData.initials}
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">{formData.name}</h4>
            <p className="text-xs text-gray-500 dark:text-slate-400">{formData.title}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">
              Role / Job Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">
                Phone Number
              </label>
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
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">
              Department
            </label>
            <div className="relative">
              <Building size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
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
              Save Profile
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}

