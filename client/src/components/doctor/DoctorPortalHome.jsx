import React, { useState, useEffect } from 'react'
import { 
  Video, FileText, Star, Users, CheckCircle2, Stethoscope, 
  ArrowRightLeft, Loader2, X, Search, Clock, Award, ShieldCheck, 
  MapPin, Pill, Activity, ChevronRight, PhoneCall 
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { API_BASE_URL } from '../../config/api'
import PrescriptionModal from './PrescriptionModal'

export default function DoctorPortalHome() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)

  const [activePrescription, setActivePrescription] = useState(null)
  const [activeTelemed, setActiveTelemed] = useState(null)
  const [referralModal, setReferralModal] = useState(null)
  const [activeModal, setActiveModal] = useState(null) // 'patients' | 'satisfaction' | 'telemed' | null
  const [patientSearch, setPatientSearch] = useState('')
  const [toastMessage, setToastMessage] = useState('')

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 2500)
  }

  useEffect(() => {
    if (activeTelemed || referralModal || activeModal) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [activeTelemed, referralModal, activeModal])

  useEffect(() => {
    // Fetch doctor's assigned appointments
    fetch(`${API_BASE_URL}/api/appointments`)
      .then(res => res.json())
      .then(data => {
        setAppointments(Array.isArray(data) ? data : [])
      })
      .catch(err => console.error(err))

    // Fetch peer doctors
    fetch(`${API_BASE_URL}/api/doctors`)
      .then(res => res.json())
      .then(data => {
        setDoctors(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  // Peer doctors excluding the logged-in doctor
  const peerDoctors = doctors.filter(doc => 
    !user || !doc.name.toLowerCase().includes(user.name.replace(/^Dr\.\s*/i, '').toLowerCase())
  )

  const doctorName = user?.name || 'Dr. Sarah Jenkins'

  // Realistic sample patient clinical records for the doctor's registry
  const treatedPatientsList = [
    { id: 'PT-101', name: 'Emeka Okafor', age: 46, gender: 'Male', condition: 'Hypertension Stage 2 Management', area: 'GRA Onitsha', lastVisit: 'Yesterday, 3:15 PM', status: 'Prescription Sent to Pharmacy', rx: 'Amlodipine 10mg + Lisinopril 20mg' },
    { id: 'PT-102', name: 'Ngozi Eze', age: 34, gender: 'Female', condition: 'Acute Bronchitis & Chest Congestion', area: '3-3 Area, Nkwelle', lastVisit: 'Oct 13, 2026', status: 'Discharged / Recovered', rx: 'Amoxicillin/Clavulanate 625mg' },
    { id: 'PT-103', name: 'Chidi Obi', age: 29, gender: 'Male', condition: 'Artemether-resistant Malaria / Typhoid', area: 'Awka Road, Onitsha', lastVisit: 'Oct 11, 2026', status: 'Follow-up Complete', rx: 'Coartem 80/480 + Ciprofloxacin' },
    { id: 'PT-104', name: 'Mrs. Amaka Nwosu', age: 52, gender: 'Female', condition: 'Type 2 Diabetes Routine Checkup', area: 'Fegge Housing', lastVisit: 'Oct 09, 2026', status: 'Refill Adherence Monitored', rx: 'Metformin 500mg BID' },
    { id: 'PT-105', name: 'Ifeanyi Okoli', age: 41, gender: 'Male', condition: 'Severe Allergic Rhinitis & Sinusitis', area: 'Inland Town', lastVisit: 'Oct 06, 2026', status: 'Resolved', rx: 'Fluticasone Spray + Cetirizine' },
    { id: 'PT-106', name: 'Blessing Chukwuma', age: 27, gender: 'Female', condition: 'Migraine Cephalea & Tension Headache', area: 'Woliwo Layout', lastVisit: 'Oct 04, 2026', status: 'Discharged', rx: 'Sumatriptan 50mg' },
  ]

  // Filtered patients for search
  const filteredPatients = treatedPatientsList.filter(pt => 
    pt.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
    pt.condition.toLowerCase().includes(patientSearch.toLowerCase()) ||
    pt.area.toLowerCase().includes(patientSearch.toLowerCase())
  )

  // Patient feedback & reviews
  const patientReviews = [
    { id: 1, name: 'Chinyere U.', rating: 5, date: 'Oct 14, 2026', location: 'GRA Onitsha', comment: 'Dr. Sarah explained my lab results and dosage thoroughly during the telemed call. The e-prescription arrived at Your Health Pharmacy and was delivered to my doorstep within 40 minutes!' },
    { id: 2, name: 'Emeka O.', rating: 5, date: 'Oct 12, 2026', location: 'Onitsha', comment: 'Very attentive specialist. She took time to listen to my cardiovascular symptoms and adjusted my medication with great care.' },
    { id: 3, name: 'Obinna K.', rating: 5, date: 'Oct 10, 2026', location: '3-3 Area', comment: 'Seamless video consultation right from my office. Did not have to wait in clinic traffic at all.' },
    { id: 4, name: 'Blessing A.', rating: 4, date: 'Oct 07, 2026', location: 'Fegge', comment: 'Prompt consultation, warm bedside manner, and very clear follow-up instructions on the portal.' },
  ]

  // Telemed call history logs
  const telemedLogs = [
    { id: 'TM-901', patient: 'Somtochukwu Okoye', type: 'HD Video Call', duration: '16 mins 40 secs', time: 'Today, 09:30 AM', status: 'Completed', notes: 'Hypertension check, revised dosage' },
    { id: 'TM-902', patient: 'Mrs. Anayo', type: 'HD Video Call', duration: '12 mins 15 secs', time: 'Yesterday, 04:10 PM', status: 'Completed', notes: 'Pediatric fever consult' },
    { id: 'TM-903', patient: 'Chief Augustine', type: 'Secure Audio Call', duration: '21 mins 50 secs', time: 'Oct 13, 2026', status: 'Completed', notes: 'Cardiology post-op review' },
    { id: 'TM-904', patient: 'Kenechukwu M.', type: 'HD Video Call', duration: '08 mins 20 secs', time: 'Oct 12, 2026', status: 'Completed', notes: 'Prescription refill assessment' },
  ]

  const scrollToQueue = () => {
    const el = document.getElementById('today-queue-section')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      el.classList.add('ring-4', 'ring-purple-400', 'transition-all', 'duration-500')
      setTimeout(() => el.classList.remove('ring-4', 'ring-purple-400'), 2000)
    }
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-5">
          <div className="bg-gray-900 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2 text-sm font-bold border border-slate-700">
            <CheckCircle2 size={18} className="text-green-400" />
            {toastMessage}
          </div>
        </div>
      )}

      {/* Doctor Welcome Banner */}
      <div className="bg-linear-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 skew-x-12 pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-white/20 text-white text-[11px] font-bold px-3 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
              <Stethoscope size={14} />
              Specialist Consultation Portal
            </span>
          </div>
          <h2 className="text-2xl font-bold mb-1">Welcome, {doctorName}</h2>
          <p className="text-purple-100 text-xs max-w-md">
            Review your patient queue, conduct HD virtual telemedicine consultations, issue e-prescriptions, and collaborate with clinic peers.
          </p>
        </div>
      </div>

      {/* Practice Analytics Cards (Interactive) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Card 1: Total Patients Seen */}
        <button
          onClick={() => setActiveModal('patients')}
          className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:border-purple-300 dark:hover:border-purple-500 hover:shadow-md transition-all text-left group cursor-pointer active:scale-98"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users size={20} />
            </div>
            <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-full opacity-80 group-hover:opacity-100 transition-opacity">
              View List →
            </span>
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white block">128</span>
          <span className="text-[11px] text-gray-400">Total Patients Seen</span>
        </button>

        {/* Card 2: Patient Satisfaction */}
        <button
          onClick={() => setActiveModal('satisfaction')}
          className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:border-yellow-300 dark:hover:border-yellow-500 hover:shadow-md transition-all text-left group cursor-pointer active:scale-98"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-yellow-50 dark:bg-yellow-950/50 text-yellow-600 dark:text-yellow-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Star size={20} />
            </div>
            <span className="text-[10px] font-bold text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/60 px-2 py-0.5 rounded-full opacity-80 group-hover:opacity-100 transition-opacity">
              114 Reviews →
            </span>
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white block">4.9 ★</span>
          <span className="text-[11px] text-gray-400">Patient Satisfaction</span>
        </button>

        {/* Card 3: Telemed Calls */}
        <button
          onClick={() => setActiveModal('telemed')}
          className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition-all text-left group cursor-pointer active:scale-98"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Video size={20} />
            </div>
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full opacity-80 group-hover:opacity-100 transition-opacity">
              Call Logs →
            </span>
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white block">42</span>
          <span className="text-[11px] text-gray-400">Telemed Calls</span>
        </button>

        {/* Card 4: Today's Queue */}
        <button
          onClick={scrollToQueue}
          className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:border-emerald-300 dark:hover:border-emerald-500 hover:shadow-md transition-all text-left group cursor-pointer active:scale-98"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 size={20} />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full opacity-80 group-hover:opacity-100 transition-opacity">
              Jump To ↓
            </span>
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white block">{appointments.length}</span>
          <span className="text-[11px] text-gray-400">Today's Queue</span>
        </button>
      </div>

      {/* Today's Assigned Patient Queue */}
      <div id="today-queue-section" className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 transition-all">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Today's Patient Queue</h3>
            <p className="text-xs text-gray-400">Patients waiting for consultation</p>
          </div>
          <span className="text-xs font-bold bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 px-3 py-1 rounded-full">
            {appointments.length} Scheduled
          </span>
        </div>

        <div className="space-y-3">
          {appointments.length === 0 ? (
            <div className="text-center py-6 text-xs text-gray-400">No patients currently in your queue.</div>
          ) : (
            appointments.map((apt) => (
              <div key={apt._id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-gray-100 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">{apt.patientName}</h4>
                    <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-bold">{apt.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Reason: {apt.reason || 'General Medical Consultation'}</p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setActiveTelemed(apt)}
                    className="flex-1 sm:flex-none px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Video size={14} />
                    Start Call
                  </button>

                  <button
                    onClick={() => setActivePrescription(apt)}
                    className="flex-1 sm:flex-none px-3 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <FileText size={14} />
                    Issue Rx
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Hospital Specialist Directory & Peer Referrals */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Peer Specialists & Referral Directory</h3>
            <p className="text-xs text-gray-400">Collaborate with fellow doctors & refer patient cases</p>
          </div>
          <span className="text-xs font-bold text-gray-400">
            {peerDoctors.length} Specialists Available
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center p-6"><Loader2 className="animate-spin text-purple-600" /></div>
        ) : (
          <div className="flex overflow-x-auto gap-4 pb-2 hide-scrollbar">
            {peerDoctors.map(doc => (
              <div 
                key={doc._id}
                className="min-w-50 bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-4 flex flex-col items-center border border-gray-100 dark:border-slate-600 shrink-0"
              >
                <div className="w-16 h-16 rounded-full overflow-hidden mb-2 border-2 border-purple-200">
                  <img src={doc.image} alt={doc.name} className="w-full h-full object-cover" />
                </div>
                <h4 className="text-xs font-bold text-gray-900 dark:text-white text-center mb-0.5">{doc.name}</h4>
                <p className="text-[11px] text-purple-600 dark:text-purple-300 font-medium mb-2">{doc.specialty}</p>

                <div className="mt-auto w-full space-y-1.5">
                  <button
                    onClick={() => setReferralModal(doc)}
                    className="w-full py-1.5 rounded-xl bg-purple-600 text-white text-[11px] font-bold hover:bg-purple-700 transition-colors flex items-center justify-center gap-1 shadow-sm"
                  >
                    <ArrowRightLeft size={13} />
                    Refer Patient
                  </button>
                  <button
                    onClick={() => showToast(`Initiated peer discussion with ${doc.name}`)}
                    className="w-full py-1 rounded-xl bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-600 text-[11px] font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Peer Consult
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Prescription Modal */}
      {activePrescription && (
        <PrescriptionModal
          patient={activePrescription}
          doctorName={doctorName}
          onClose={() => setActivePrescription(null)}
          onIssued={() => showToast(`e-Prescription sent to ${activePrescription.patientName}`)}
        />
      )}

      {/* Telemed Video Modal */}
      {activeTelemed && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex justify-center items-center p-4 z-50 animate-in fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-gray-100 dark:border-slate-700 text-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Video size={30} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">HD Video Consultation Live</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mb-4">
              Patient: <span className="font-bold text-gray-800 dark:text-slate-200">{activeTelemed.patientName}</span>
            </p>
            <div className="bg-slate-900 text-green-400 p-4 rounded-2xl text-xs font-mono mb-6">
              ● Secure Telemed Channel Active<br/>
              Doctor: {doctorName}
            </div>
            <button
              onClick={() => setActiveTelemed(null)}
              className="w-full py-3 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-colors"
            >
              End Call & Write Notes
            </button>
          </div>
        </div>
      )}

      {/* Referral Modal */}
      {referralModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex justify-center items-center p-4 z-50 animate-in fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-gray-100 dark:border-slate-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Refer Patient to {referralModal.name}</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mb-4">Specialty: {referralModal.specialty}</p>

            <div className="space-y-3 mb-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Select Patient Case</label>
                <select className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-xs font-bold">
                  {appointments.map(a => (
                    <option key={a._id} value={a._id}>{a.patientName} ({a.reason || 'General Consultation'})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Referral Reason & Clinical Notes</label>
                <textarea rows="3" placeholder="Describe clinical symptoms for specialist review..." className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-xs resize-none"></textarea>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setReferralModal(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 text-xs font-bold">Cancel</button>
              <button 
                onClick={() => {
                  setReferralModal(null);
                  showToast(`Patient case referred to ${referralModal.name}`);
                }} 
                className="flex-1 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700"
              >
                Send Referral
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. Patient Clinical Registry Modal (Total Patients Seen: 128) */}
      {activeModal === 'patients' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex justify-center items-center p-4 z-50 animate-in fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between bg-purple-50/50 dark:bg-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/20">
                  <Users size={22} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    Patient Clinical Registry
                    <span className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 px-2.5 py-0.5 rounded-full font-extrabold">128 Treated</span>
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Archived patient consults, diagnoses & Rx history</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveModal(null)} 
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:text-slate-300 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Summary Pill Bar */}
            <div className="grid grid-cols-3 gap-2 p-4 bg-gray-50/50 dark:bg-slate-900/30 border-b border-gray-100 dark:border-slate-700 text-center">
              <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
                <span className="text-xs text-gray-400 block font-medium">Follow-ups Active</span>
                <span className="text-sm font-bold text-purple-600 dark:text-purple-400">34 Patients</span>
              </div>
              <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
                <span className="text-xs text-gray-400 block font-medium">Discharged / Stable</span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">94 Patients</span>
              </div>
              <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
                <span className="text-xs text-gray-400 block font-medium">Pharmacy Routed Rx</span>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">89 Sent</span>
              </div>
            </div>

            {/* Search Input */}
            <div className="p-4 border-b border-gray-100 dark:border-slate-700">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by patient name, diagnosis, or Onitsha area (e.g. GRA, 3-3)..."
                  value={patientSearch}
                  onChange={(e) => setPatientSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Patient Cards List */}
            <div className="p-4 overflow-y-auto space-y-3 flex-1">
              {filteredPatients.length === 0 ? (
                <div className="text-center py-10 text-xs text-gray-400">
                  No matching patient records found for "{patientSearch}"
                </div>
              ) : (
                filteredPatients.map((pt) => (
                  <div key={pt.id} className="p-3.5 rounded-2xl bg-gray-50 dark:bg-slate-700/40 border border-gray-100 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:border-purple-200 transition-all">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-gray-900 dark:text-white">{pt.name}</span>
                        <span className="text-[10px] bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 px-2 py-0.5 rounded-full font-bold">
                          {pt.age} yrs • {pt.gender}
                        </span>
                        <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                          <MapPin size={11} className="text-purple-500" />
                          {pt.area}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 mt-0.5">
                        {pt.condition}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Pill size={11} className="text-blue-500" />
                          {pt.rx}
                        </span>
                        <span>•</span>
                        <span>{pt.lastVisit}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/50">
                        {pt.status}
                      </span>
                      <button
                        onClick={() => {
                          showToast(`Opened medical history chart for ${pt.name}`)
                          setActiveModal(null)
                        }}
                        className="px-3 py-1 rounded-xl bg-purple-600 text-white text-[11px] font-bold hover:bg-purple-700 transition-colors shadow-sm cursor-pointer whitespace-nowrap"
                      >
                        Chart →
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/40 flex justify-between items-center text-xs text-gray-400">
              <span>Showing active Electronic Medical Records (EMR)</span>
              <button 
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-white font-bold hover:bg-gray-300 transition-colors cursor-pointer"
              >
                Close Registry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Patient Satisfaction & Clinical Reviews Modal (4.9 ★) */}
      {activeModal === 'satisfaction' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex justify-center items-center p-4 z-50 animate-in fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between bg-yellow-50/50 dark:bg-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-yellow-500 text-white flex items-center justify-center shadow-md shadow-yellow-500/20">
                  <Star size={22} className="fill-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    Patient Satisfaction & Ratings
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Verified feedback from MedClinic & Pharmacy consultations</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveModal(null)} 
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:text-slate-300 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Score Hero Overview */}
            <div className="p-5 bg-linear-to-b from-amber-500/10 to-transparent dark:from-yellow-950/20 border-b border-gray-100 dark:border-slate-700 flex items-center gap-5">
              <div className="text-center px-4 py-2 rounded-2xl bg-white dark:bg-slate-800 border border-yellow-200 dark:border-yellow-700/40 shadow-sm">
                <span className="text-3xl font-black text-gray-900 dark:text-white block">4.9</span>
                <div className="flex text-amber-400 justify-center my-0.5">
                  <Star size={14} className="fill-amber-400" />
                  <Star size={14} className="fill-amber-400" />
                  <Star size={14} className="fill-amber-400" />
                  <Star size={14} className="fill-amber-400" />
                  <Star size={14} className="fill-amber-400" />
                </div>
                <span className="text-[10px] text-gray-400 font-bold block">114 Ratings</span>
              </div>

              <div className="flex-1 space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-12 text-[10px] font-bold text-gray-500">5 Stars</span>
                  <div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-slate-700 overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full w-[91%]"></div>
                  </div>
                  <span className="w-8 text-[10px] font-bold text-right text-gray-600 dark:text-slate-300">91%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-12 text-[10px] font-bold text-gray-500">4 Stars</span>
                  <div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-slate-700 overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full w-[7%]"></div>
                  </div>
                  <span className="w-8 text-[10px] font-bold text-right text-gray-600 dark:text-slate-300">7%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-12 text-[10px] font-bold text-gray-500">3 Stars</span>
                  <div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-slate-700 overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full w-[2%]"></div>
                  </div>
                  <span className="w-8 text-[10px] font-bold text-right text-gray-600 dark:text-slate-300">2%</span>
                </div>
              </div>
            </div>

            {/* Testimonials List */}
            <div className="p-4 overflow-y-auto space-y-3 flex-1">
              {patientReviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-700/40 border border-gray-100 dark:border-slate-700 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 font-bold text-xs flex items-center justify-center">
                        {rev.name.charAt(0)}
                      </div>
                      <span className="font-bold text-xs text-gray-900 dark:text-white">{rev.name}</span>
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <ShieldCheck size={10} /> Verified Patient
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-400">{rev.date}</span>
                  </div>

                  <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed italic">
                    "{rev.comment}"
                  </p>

                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1">
                      <MapPin size={10} /> {rev.location}
                    </span>
                    <div className="flex text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} size={12} className="fill-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/40 flex justify-end">
              <button 
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-white font-bold hover:bg-gray-300 text-xs transition-colors cursor-pointer"
              >
                Close Reviews
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Telemed Consultation Hub & Logs Modal (42 Calls) */}
      {activeModal === 'telemed' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex justify-center items-center p-4 z-50 animate-in fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between bg-blue-50/50 dark:bg-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
                  <Video size={22} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    Telemedicine Hub & Call Logs
                    <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 px-2.5 py-0.5 rounded-full font-extrabold">42 Recorded</span>
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Encrypted virtual video & audio consult history</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveModal(null)} 
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:text-slate-300 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Metrics & Launch Test Call */}
            <div className="p-4 bg-gray-50/50 dark:bg-slate-900/30 border-b border-gray-100 dark:border-slate-700 space-y-3">
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
                  <span className="text-[11px] text-gray-400 block font-medium">Avg Call Length</span>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">14m 20s</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
                  <span className="text-[11px] text-gray-400 block font-medium">HD Video Stream</span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">99.4% Stability</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveModal(null)
                  setActiveTelemed({ patientName: 'On-Demand Telemed Room (Test & Live)' })
                }}
                className="w-full py-2.5 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 cursor-pointer transition-all"
              >
                <Video size={15} />
                Launch Instant Virtual Telemed Room
              </button>
            </div>

            {/* Call History Logs */}
            <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">Recent Consult Sessions</span>
              {telemedLogs.map((call) => (
                <div key={call.id} className="p-3.5 rounded-2xl bg-gray-50 dark:bg-slate-700/40 border border-gray-100 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-gray-900 dark:text-white">{call.patient}</span>
                      <span className="text-[10px] bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 px-2 py-0.5 rounded-full font-bold">
                        {call.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5">
                      {call.notes}
                    </p>
                    <span className="text-[10px] text-gray-400 block mt-1">
                      {call.time} • Duration: {call.duration}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-green-50 text-green-700 dark:bg-green-950/60 dark:text-green-300">
                    {call.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/40 flex justify-end">
              <button 
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-white font-bold hover:bg-gray-300 text-xs transition-colors cursor-pointer"
              >
                Close Logs
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
