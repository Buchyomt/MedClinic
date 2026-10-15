import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { 
  CheckCircle2, Check, MapPin, CalendarPlus, X, AlertTriangle, 
  Calendar, ArrowRight, QrCode, Video, Printer, Download, Sparkles, ShieldCheck 
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useBooking } from '../context/BookingContext'

// ── In-app Cancel Confirmation Modal ──────────────────────────────────────────
function CancelConfirmModal({ onConfirm, onCancel }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-end sm:items-center z-50 px-4">
      <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-700 animate-in zoom-in-95 duration-200">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-500 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={28} />
        </div>

        <h2 className="text-lg font-bold text-gray-900 dark:text-white text-center mb-2">
          Cancel Consultation?
        </h2>
        <p className="text-gray-500 dark:text-slate-400 text-xs text-center mb-6 leading-relaxed">
          This will cancel your reserved time slot. You can reschedule anytime from your dashboard.
        </p>

        <div className="space-y-2.5">
          <button
            onClick={onConfirm}
            className="w-full bg-rose-500 hover:bg-rose-600 active:scale-98 text-white font-bold py-3.5 rounded-xl transition-all shadow-sm text-xs cursor-pointer"
          >
            Yes, Cancel Appointment
          </button>
          <button
            onClick={onCancel}
            className="w-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold py-3 rounded-xl transition-all text-xs cursor-pointer"
          >
            Keep My Appointment
          </button>
        </div>
      </div>
    </div>
  )
}

// ── QR Code SVG Generator Helper ──────────────────────────────────────────────
function AppointmentQrCode({ value }) {
  return (
    <div className="p-3 bg-white rounded-2xl shadow-xs border border-slate-200 flex flex-col items-center justify-center">
      <svg className="w-28 h-28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Corner Finders */}
        <rect x="5" y="5" width="26" height="26" rx="4" stroke="#0f172a" strokeWidth="6" fill="white" />
        <rect x="12" y="12" width="12" height="12" rx="2" fill="#0f172a" />
        
        <rect x="69" y="5" width="26" height="26" rx="4" stroke="#0f172a" strokeWidth="6" fill="white" />
        <rect x="76" y="12" width="12" height="12" rx="2" fill="#0f172a" />
        
        <rect x="5" y="69" width="26" height="26" rx="4" stroke="#0f172a" strokeWidth="6" fill="white" />
        <rect x="12" y="76" width="12" height="12" rx="2" fill="#0f172a" />

        {/* Data Matrix Dots Pattern */}
        <rect x="38" y="8" width="6" height="6" rx="1.5" fill="#0f172a" />
        <rect x="50" y="8" width="6" height="6" rx="1.5" fill="#0f172a" />
        <rect x="38" y="20" width="6" height="6" rx="1.5" fill="#0f172a" />
        <rect x="50" y="20" width="6" height="6" rx="1.5" fill="#0f172a" />
        
        <rect x="8" y="38" width="6" height="6" rx="1.5" fill="#0f172a" />
        <rect x="20" y="38" width="6" height="6" rx="1.5" fill="#0f172a" />
        <rect x="8" y="50" width="6" height="6" rx="1.5" fill="#0f172a" />
        <rect x="20" y="50" width="6" height="6" rx="1.5" fill="#0f172a" />

        <rect x="38" y="38" width="8" height="8" rx="2" fill="#0284c7" />
        <rect x="52" y="38" width="6" height="6" rx="1.5" fill="#0f172a" />
        <rect x="64" y="38" width="6" height="6" rx="1.5" fill="#0f172a" />
        <rect x="76" y="38" width="6" height="6" rx="1.5" fill="#0f172a" />
        <rect x="88" y="38" width="6" height="6" rx="1.5" fill="#0f172a" />

        <rect x="38" y="52" width="6" height="6" rx="1.5" fill="#0f172a" />
        <rect x="50" y="52" width="8" height="8" rx="2" fill="#0f172a" />
        <rect x="64" y="52" width="6" height="6" rx="1.5" fill="#0284c7" />
        <rect x="76" y="52" width="6" height="6" rx="1.5" fill="#0f172a" />

        <rect x="38" y="66" width="6" height="6" rx="1.5" fill="#0f172a" />
        <rect x="50" y="66" width="6" height="6" rx="1.5" fill="#0f172a" />
        <rect x="64" y="66" width="8" height="8" rx="2" fill="#0f172a" />
        <rect x="76" y="66" width="6" height="6" rx="1.5" fill="#0f172a" />
        <rect x="88" y="66" width="6" height="6" rx="1.5" fill="#0f172a" />

        <rect x="38" y="80" width="6" height="6" rx="1.5" fill="#0f172a" />
        <rect x="50" y="80" width="6" height="6" rx="1.5" fill="#0284c7" />
        <rect x="64" y="80" width="6" height="6" rx="1.5" fill="#0f172a" />
        <rect x="76" y="80" width="8" height="8" rx="2" fill="#0f172a" />
        <rect x="88" y="80" width="6" height="6" rx="1.5" fill="#0f172a" />
      </svg>
      <span className="text-[10px] font-mono font-bold text-slate-500 mt-1.5 uppercase tracking-wider">{value}</span>
    </div>
  )
}

// ── Main Success Page ──────────────────────────────────────────────────────────
export default function Success() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const { selectedDoctor, selectedDate, selectedTime, selectedService, consultationType } = useBooking()

  const [showCancelModal, setShowCancelModal] = useState(false)

  const apt = location.state?.appointment
  const doc = location.state?.doctor || selectedDoctor
  const srv = location.state?.service || selectedService

  const patientName = apt?.patientName || user?.name || 'Valued Patient'
  const patientFirstName = patientName.split(' ')[0]
  const patientEmail = apt?.email || user?.email || 'your registered email'
  const isTelehealth = apt?.consultationType === 'telehealth' || consultationType === 'telehealth'
  const tokenNumber = apt?.tokenNumber || 'MC-104'
  
  const providerName = apt?.providerName || apt?.doctorId?.name || doc?.name || 'Pharm. Chinedu Nwankwo'
  const isPharmacist = 
    providerName.toLowerCase().includes('pharm') || 
    providerName.toLowerCase().includes('chinedu') ||
    doc?.specialty?.toLowerCase().includes('pharmacy') ||
    apt?.providerType === 'pharmacist'

  const serviceName = apt?.serviceName || srv?.title || doc?.serviceName || (isPharmacist ? 'Clinical Pharmacist Consultation & MTM' : 'Specialist Clinical Consultation')
  
  const formattedDate = apt?.date || (selectedDate instanceof Date ? selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : String(selectedDate || 'Upcoming Date'))
  const appointmentTime = apt?.time || selectedTime || '10:00 AM'
  const facilityAddress = isPharmacist 
    ? 'Your Health Pharmacy, 1 Nwankwo Chinedu Crescent, GRA Federal Housing Estate, Onitsha' 
    : 'MedClinic Specialist Suite, 12 Clinic Road, Lagos'

  // Build Real Google Calendar Link
  const buildGoogleCalendarUrl = () => {
    const title = encodeURIComponent(`${serviceName} - ${providerName}`);
    const details = encodeURIComponent(`MedClinic Appointment\nPatient: ${patientName}\nProvider: ${providerName}\nFormat: ${isTelehealth ? 'Online Video Telehealth' : 'In-Person Clinic Visit'}\nToken: ${tokenNumber}`);
    const locationStr = encodeURIComponent(isTelehealth ? 'MedClinic Video Telehealth Suite' : facilityAddress);
    
    // Parse date for calendar
    const cleanDate = (apt?.date || new Date().toISOString().split('T')[0]).replace(/-/g, '');
    const dates = `${cleanDate}T090000Z/${cleanDate}T100000Z`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${locationStr}`;
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900 min-h-screen relative flex flex-col justify-between overflow-y-auto">

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <CancelConfirmModal
          onConfirm={() => {
            setShowCancelModal(false)
            navigate('/')
          }}
          onCancel={() => setShowCancelModal(false)}
        />
      )}

      {/* Top Bar */}
      <div className="bg-white dark:bg-slate-800 py-4 px-6 border-b border-slate-200 dark:border-slate-700/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
          <h1 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">Booking Confirmed & Dossier Generated</h1>
        </div>
        <button
          onClick={() => window.print()}
          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Printer size={14} />
          <span className="hidden sm:inline">Print Pass</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 flex-1">
        
        {/* Celebration Banner */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/60 rounded-3xl flex items-center justify-center mx-auto mb-4 text-emerald-600 dark:text-emerald-400 shadow-inner">
            <CheckCircle2 size={44} strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            You're All Set, {patientFirstName}!
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            Your clinical consultation has been booked. A confirmation email has been dispatched to <strong>{patientEmail}</strong>.
          </p>
        </div>

        {/* ── DIGITAL CLINIC BOARDING PASS ───────────────────────────────────── */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200/90 dark:border-slate-700 overflow-hidden mb-8">
          
          {/* Top Pass Header Banner */}
          <div className="bg-linear-to-r from-blue-700 via-indigo-700 to-teal-700 p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2.5 py-1 rounded-full">
                Digital Clinic Pass
              </span>
              <h3 className="text-xl font-black">{serviceName}</h3>
              <p className="text-xs text-blue-100">{providerName}</p>
            </div>

            <div className="sm:text-right">
              <span className="text-[10px] uppercase font-bold text-blue-200 block">Queue Token Number</span>
              <span className="text-2xl sm:text-3xl font-black font-mono tracking-wider text-white">
                #{tokenNumber}
              </span>
            </div>
          </div>

          {/* Pass Details Grid */}
          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Left Col: Details */}
            <div className="md:col-span-8 space-y-4">
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100 dark:border-slate-700">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Patient</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">{patientName}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Format</span>
                  <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-md mt-0.5 ${
                    isTelehealth 
                      ? 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300' 
                      : 'bg-blue-100 dark:bg-blue-900/60 text-primary dark:text-blue-300'
                  }`}>
                    {isTelehealth ? <Video size={12} /> : <MapPin size={12} />}
                    <span>{isTelehealth ? 'Video Telehealth' : 'In-Person Clinic'}</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100 dark:border-slate-700">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Date</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">{formattedDate}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Scheduled Time</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">{appointmentTime}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Facility Location</span>
                <p className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                  <MapPin size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>{facilityAddress}</span>
                </p>
              </div>
            </div>

            {/* Right Col: QR Check-in Box */}
            <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-200/80 dark:border-slate-600 text-center">
              <AppointmentQrCode value={tokenNumber} />
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-2">
                Scan at Hospital Kiosk or Front Desk
              </span>
            </div>

          </div>

          {/* Bottom Pass Bar */}
          <div className="bg-slate-50 dark:bg-slate-700/40 px-6 py-3 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>Verified MedClinic Healthcare Dossier</span>
            </span>
            <span>Check-in Status: Ready</span>
          </div>

        </div>

        {/* ── Action Buttons ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          
          {/* Telehealth direct launcher if virtual */}
          {isTelehealth ? (
            <button
              onClick={() => navigate('/telehealth')}
              className="w-full bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-3.5 px-4 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
            >
              <Video size={16} />
              <span>Enter Virtual Telehealth Room</span>
            </button>
          ) : (
            <button
              onClick={() => navigate('/queue')}
              className="w-full bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-3.5 px-4 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
            >
              <span>Track Live Waiting Room Queue</span>
              <ArrowRight size={16} />
            </button>
          )}

          {/* Real Google Calendar Link */}
          <a
            href={buildGoogleCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-3.5 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center gap-2 text-xs cursor-pointer shadow-xs text-center"
          >
            <CalendarPlus size={16} className="text-primary" />
            <span>Add to Google Calendar</span>
          </a>

          {/* View in Appointments */}
          <button
            onClick={() => navigate('/appointments')}
            className="w-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold py-3.5 px-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-xs cursor-pointer sm:col-span-2 md:col-span-1"
          >
            <Calendar size={16} />
            <span>View in My Appointments</span>
          </button>

        </div>

        {/* Back link */}
        <div className="text-center">
          <Link
            to="/"
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-semibold transition-colors"
          >
            &larr; Return to MedClinic Home
          </Link>
        </div>

      </div>

    </div>
  )
}
