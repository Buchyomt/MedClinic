import React from 'react'
import { useBooking } from '../../context/BookingContext'
import { Building2, Video, Sparkles, Check } from 'lucide-react'

export default function ConsultationModeSelector() {
  const { consultationType, setConsultationType } = useBooking()

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm mb-6 border border-slate-100 dark:border-slate-700">
      <div className="mb-4">
        <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Sparkles size={18} className="text-primary" />
          <span>Choose Consultation Format</span>
        </h3>
        <p className="text-xs text-gray-500 dark:text-slate-400">
          Select whether you prefer meeting at the facility or joining online
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* In-Person Option */}
        <button
          type="button"
          onClick={() => setConsultationType('in_person')}
          className={`p-4 rounded-2xl text-left border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
            consultationType === 'in_person'
              ? 'border-primary bg-blue-50/50 dark:bg-blue-950/30 shadow-sm'
              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
          }`}
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              consultationType === 'in_person'
                ? 'bg-primary text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}>
              <Building2 size={20} />
            </div>
            {consultationType === 'in_person' && (
              <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center">
                <Check size={12} strokeWidth={3} />
              </span>
            )}
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">In-Person Clinic Visit</div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
              Physical exam & in-facility triage at MedClinic / Your Health Pharmacy
            </p>
          </div>
        </button>

        {/* Video Telehealth Option */}
        <button
          type="button"
          onClick={() => setConsultationType('telehealth')}
          className={`p-4 rounded-2xl text-left border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
            consultationType === 'telehealth'
              ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 shadow-sm'
              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
          }`}
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              consultationType === 'telehealth'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}>
              <Video size={20} />
            </div>
            {consultationType === 'telehealth' && (
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                <Check size={12} strokeWidth={3} />
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-slate-900 dark:text-white">Video Telehealth</span>
              <span className="text-[9px] uppercase font-black bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300 px-1.5 py-0.5 rounded">
                Virtual Room
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
              Encrypted HD video consultation from any phone, laptop, or Diaspora location
            </p>
          </div>
        </button>
      </div>
    </div>
  )
}
