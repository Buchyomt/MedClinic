import React, { useEffect } from 'react'
import { X, UserCheck, Stethoscope, User, ShieldCheck, Pill } from 'lucide-react'

export default function DemoRoleModal({ currentRole, onSelectRole, onClose }) {
  const roles = [
    {
      id: 'pharmacist',
      title: 'Pharm. Chinedu Nwankwo (Onitsha)',
      desc: 'Lead clinical pharmacist command center, dispensary dispatch, MTM reviews & local Onitsha orders',
      icon: Pill,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200'
    },
    {
      id: 'patient',
      title: 'Patient Portal',
      desc: 'Book appointments, consult MediCare AI assistant, view doctors & prescription history',
      icon: User,
      color: 'bg-blue-50 text-blue-600 border-blue-200'
    },
    {
      id: 'receptionist',
      title: 'Staff Coordinator / Receptionist',
      desc: 'Full reception dashboard, manage daily patient queue, check-in patients & update status',
      icon: UserCheck,
      color: 'bg-teal-50 text-teal-600 border-teal-200'
    },
    {
      id: 'doctor',
      title: 'Specialist Doctor Portal',
      desc: 'Telemedicine virtual room, view assigned consultation list, review medical records',
      icon: Stethoscope,
      color: 'bg-purple-50 text-purple-600 border-purple-200'
    }
  ]

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl border border-gray-100 dark:border-slate-700 relative">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-4 mb-6 border-b border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Switch Demo User Role</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400">Experience Medclinic from any perspective</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-500 dark:text-slate-300 flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Roles List */}
        <div className="space-y-3 mb-6">
          {roles.map(r => {
            const Icon = r.icon
            const isSelected = currentRole === r.id
            return (
              <div
                key={r.id}
                onClick={() => onSelectRole(r.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-4 ${
                  isSelected 
                    ? 'border-primary ring-2 ring-primary/20 bg-primary/5 dark:bg-primary/10' 
                    : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 bg-white dark:bg-slate-700/40'
                }`}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${r.color}`}>
                  <Icon size={22} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">{r.title}</h4>
                    {isSelected && (
                      <span className="text-[10px] font-bold bg-primary text-white px-2 py-0.5 rounded-full">ACTIVE</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 leading-relaxed">{r.desc}</p>
                </div>
              </div>
            )
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-slate-200 font-bold text-sm hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
        >
          Close
        </button>

      </div>
    </div>
  )
}

