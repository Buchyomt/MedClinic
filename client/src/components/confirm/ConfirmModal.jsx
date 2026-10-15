import React, { useEffect } from 'react'
import { CalendarCheck } from 'lucide-react'

export default function ConfirmModal({ onConfirm, onCancel }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex justify-center items-center px-6 z-50 rounded-b-3xl">
      <div className="bg-white rounded-4xl p-8 w-full max-w-85 shadow-2xl flex flex-col items-center">
        
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-5">
          <CalendarCheck size={28} className="text-primary" />
        </div>
        
        <h2 className="text-[19px] font-bold text-gray-900 mb-2">Confirm Appointment?</h2>
        <p className="text-gray-500 text-[13px] mb-8 text-center px-2">
          You will be sent an email confirmation.
        </p>
        
        <div className="w-full space-y-3">
          <button 
            onClick={onConfirm}
            className="w-full bg-primary text-white font-bold py-3.5 rounded-2xl hover:bg-primary-dark transition-colors shadow-sm"
          >
            Confirm
          </button>
          
          <button 
            onClick={onCancel}
            className="w-full bg-white text-gray-700 font-bold py-3.5 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors shadow-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
