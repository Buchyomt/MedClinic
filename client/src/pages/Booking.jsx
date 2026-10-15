import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldAlert, ArrowRight, Home, Calendar as CalendarIcon, Sparkles } from 'lucide-react'
import Header from '../components/booking/Header'
import Calendar from '../components/booking/Calendar'
import TimeSlots from '../components/booking/TimeSlots'
import ConsultationModeSelector from '../components/booking/ConsultationModeSelector'
import BookingSummaryCard from '../components/booking/BookingSummaryCard'
import ProceedButton from '../components/booking/ProceedButton'
import BottomNav from '../components/BottomNav'
import DoctorProfileCard from '../components/booking/DoctorProfileCard'
import { useAuth } from '../context/AuthContext'
import { useBooking } from '../context/BookingContext'

export default function Booking() {
  const { role, user } = useAuth()
  const { selectedTime, selectedDate, consultationType } = useBooking()
  const navigate = useNavigate()

  if (role === 'pharmacist') {
    return (
      <div className="w-full bg-slate-50 dark:bg-slate-900 min-h-screen flex flex-col justify-center items-center p-6 text-center">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-100 dark:border-slate-700">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-5 shadow-inner">
            <ShieldAlert size={36} />
          </div>

          <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800">
            Pharmacist Account Active
          </span>

          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-4 mb-2">
            Self-Booking Restricted
          </h2>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            You are currently logged in as <strong>{user?.name || 'Pharm. Chinedu Nwankwo'}</strong> (Clinical Pharmacist).
            The pharmacist account is reserved for reviewing visitor logs, managing consultation fees, and approving incoming patient bookings. Clinical providers cannot book consultations for themselves.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Go to Pharmacist Command Center</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Home size={15} />
              <span>Return to Home</span>
            </button>
          </div>
        </div>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900 min-h-screen relative flex flex-col">
      {/* Top Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700/80 px-4 sm:px-8 py-4 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Header />
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/40 text-primary dark:text-blue-300 border border-blue-200/60 dark:border-blue-800">
              Step 1 of 2: Schedule & Format
            </span>
          </div>
        </div>
      </div>
      
      {/* 2-Column Responsive Layout */}
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 pb-28 lg:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Column: Doctor + Mode + Calendar + Dynamic Slots */}
          <div className="lg:col-span-7 space-y-6">
            <DoctorProfileCard />
            <ConsultationModeSelector />

            {/* Calendar */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
              <div className="mb-4">
                <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <CalendarIcon size={18} className="text-primary" />
                  <span>Choose Date</span>
                </h3>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  Select your preferred appointment day
                </p>
              </div>
              <Calendar />
            </div>
            
            {/* Dynamic Time Slots */}
            <TimeSlots />
          </div>

          {/* Right Column: Live Sticky Summary Dossier */}
          <div className="lg:col-span-5 hidden lg:block">
            <BookingSummaryCard />
          </div>

        </div>
      </div>
      
      {/* Mobile Sticky Proceed Bar (Shown only on small screens) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-700 z-40 shadow-2xl">
        <div className="max-w-md mx-auto flex items-center justify-between gap-4">
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Selected Slot</span>
            <div className="text-xs font-black text-slate-900 dark:text-white truncate">
              {selectedTime || '10:00 AM'} &bull; {consultationType === 'telehealth' ? 'Virtual' : 'In-Person'}
            </div>
          </div>
          <button
            onClick={() => navigate('/confirm')}
            className="py-3 px-5 bg-primary hover:bg-blue-700 active:scale-98 text-white rounded-xl font-bold text-xs shadow-md shadow-primary/20 flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <span>Continue</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
      
      <BottomNav />
    </div>
  )
}
