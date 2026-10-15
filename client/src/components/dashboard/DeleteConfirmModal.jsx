import React, { useEffect } from 'react'
import { Trash2, Calendar, User, Stethoscope, X, Loader2 } from 'lucide-react'

export default function DeleteConfirmModal({ isOpen, appointment, onConfirm, onClose, loading = false }) {
  useEffect(() => {
    if (isOpen && appointment) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [isOpen, appointment])

  if (!isOpen || !appointment) return null

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-7 w-full max-w-md shadow-2xl border border-gray-100 dark:border-slate-700 animate-in zoom-in-95 duration-200 flex flex-col">
        
        {/* Top Header with Icon & Close */}
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shadow-inner">
            <Trash2 size={24} />
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Title & Info */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1.5">
          Delete Appointment?
        </h3>
        <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed mb-5">
          Are you sure you want to remove this booking? This will cancel the consultation and remove it from the patient and doctor schedules.
        </p>

        {/* Appointment Mini-Card */}
        <div className="bg-slate-50 dark:bg-slate-750/70 dark:bg-slate-900/40 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 mb-6 space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 font-semibold flex items-center gap-1.5">
              <User size={14} className="text-primary" /> Patient:
            </span>
            <span className="font-bold text-gray-800 dark:text-slate-200">
              {appointment.patientName || 'Patient'}
            </span>
          </div>

          {appointment.doctorId?.name && (
            <div className="flex items-center justify-between">
              <span className="text-gray-400 font-semibold flex items-center gap-1.5">
                <Stethoscope size={14} className="text-primary" /> Doctor:
              </span>
              <span className="font-bold text-gray-800 dark:text-slate-200">
                {appointment.doctorId.name}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-gray-400 font-semibold flex items-center gap-1.5">
              <Calendar size={14} className="text-primary" /> Date & Time:
            </span>
            <span className="font-bold text-primary dark:text-cyan-400">
              {appointment.date || 'Today'} • {appointment.time || '10:00 AM'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-auto">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-3 px-4 rounded-xl border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-slate-300 font-bold text-xs hover:bg-gray-50 dark:hover:bg-slate-700 active:scale-95 transition-all cursor-pointer"
          >
            Keep Appointment
          </button>
          
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={15} />
                Delete
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  )
}
