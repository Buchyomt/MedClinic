import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useBooking } from '../../context/BookingContext'
import { useFacility } from '../../context/FacilityContext'
import { Calendar, Clock, Video, Building2, ShieldCheck, ArrowRight, UserCheck, Star } from 'lucide-react'

export default function BookingSummaryCard() {
  const navigate = useNavigate()
  const { selectedDoctor, selectedDate, selectedTime, consultationType, selectedService } = useBooking()
  const { isPharmacyMode, pharmacyProfile } = useFacility()

  const formattedDate = selectedDate 
    ? (selectedDate instanceof Date 
        ? selectedDate.toLocaleDateString('default', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) 
        : String(selectedDate))
    : 'Select a Date'

  const doctorName = selectedDoctor?.name || (isPharmacyMode ? pharmacyProfile?.pharmacistName : 'Specialist Doctor')
  const doctorSpecialty = selectedDoctor?.specialty || (isPharmacyMode ? 'Clinical Pharmacist' : 'General Physician')
  const doctorImage = selectedDoctor?.image || '/doctor-1.jpg'
  const consultationPrice = selectedDoctor?.price || (isPharmacyMode ? pharmacyProfile?.consultationFee : '₦15,000')

  const handleProceed = () => {
    navigate('/confirm')
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-slate-200/80 dark:border-slate-700 sticky top-6">
      
      {/* Title */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-700">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-primary dark:text-blue-400">
            Booking Overview
          </span>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            Appointment Dossier
          </h3>
        </div>
        <span className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 text-primary flex items-center justify-center">
          <ShieldCheck size={18} />
        </span>
      </div>

      {/* Doctor Summary */}
      <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/50 mb-5">
        <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-600 shrink-0">
          <img src={doctorImage} alt={doctorName} className="w-full h-full object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-black text-slate-900 dark:text-white truncate">{doctorName}</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{doctorSpecialty}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
              {selectedDoctor?.rating || '4.9'}
            </span>
          </div>
        </div>
      </div>

      {/* Selected Attributes */}
      <div className="space-y-3 mb-6 text-xs">
        {/* Date */}
        <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700/60">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <Calendar size={15} className="text-primary" />
            <span>Consultation Date</span>
          </span>
          <span className="font-bold text-slate-900 dark:text-white text-right">
            {formattedDate}
          </span>
        </div>

        {/* Time */}
        <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700/60">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <Clock size={15} className="text-emerald-500" />
            <span>Time Slot</span>
          </span>
          <span className="font-bold text-slate-900 dark:text-white text-right">
            {selectedTime || '10:00 AM'}
          </span>
        </div>

        {/* Format */}
        <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700/60">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
            {consultationType === 'telehealth' ? (
              <Video size={15} className="text-indigo-600" />
            ) : (
              <Building2 size={15} className="text-primary" />
            )}
            <span>Format</span>
          </span>
          <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
            consultationType === 'telehealth'
              ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300'
              : 'bg-blue-50 dark:bg-blue-900/40 text-primary dark:text-blue-300'
          }`}>
            {consultationType === 'telehealth' ? 'Video Telehealth' : 'In-Person Clinic'}
          </span>
        </div>

        {/* Service */}
        <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700/60">
          <span className="text-slate-500 dark:text-slate-400">Service</span>
          <span className="font-bold text-slate-900 dark:text-white text-right truncate max-w-[150px]">
            {selectedService?.title || 'Clinical Consultation'}
          </span>
        </div>

        {/* Total Fee */}
        <div className="flex items-center justify-between pt-2">
          <span className="font-bold text-slate-700 dark:text-slate-300">Consultation Fee</span>
          <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
            {consultationPrice}
          </span>
        </div>
      </div>

      {/* CTA Button */}
      <button
        type="button"
        onClick={handleProceed}
        className="w-full py-4 px-4 bg-primary hover:bg-blue-700 active:scale-98 text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <span>Proceed to Patient Details</span>
        <ArrowRight size={18} />
      </button>

      {/* Trust note */}
      <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center mt-4 flex items-center justify-center gap-1.5">
        <ShieldCheck size={13} className="text-emerald-500" />
        <span>Free cancellation & rescheduling before appointment</span>
      </p>

    </div>
  )
}
