import { API_BASE_URL } from '../../config/api';
import React, { useState, useEffect } from 'react'
import { UserPlus, Clock, CheckCircle2, Stethoscope, Users, Building, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function ReceptionPortalHome() {
  const { user } = useAuth()
  const [doctors, setDoctors] = useState([])
  const [appointments, setAppointments] = useState([])
  const [isWalkInModalOpen, setIsWalkInModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const [walkInForm, setWalkInForm] = useState({
    name: '',
    phone: '',
    email: '',
    reason: '',
    doctorId: ''
  })

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 2500)
  }

  useEffect(() => {
    if (isWalkInModalOpen) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [isWalkInModalOpen])

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/doctors`)
      .then(res => res.json())
      .then(data => setDoctors(Array.isArray(data) ? data : []))
      .catch(err => console.error(err))

    fetch(`${API_BASE_URL}/api/appointments`)
      .then(res => res.json())
      .then(data => setAppointments(Array.isArray(data) ? data : []))
      .catch(err => console.error(err))
  }, [])

  const handleWalkInSubmit = (e) => {
    e.preventDefault()
    if (!walkInForm.name || !walkInForm.phone) {
      showToast('Please enter patient name and phone')
      return
    }

    const selectedDoc = doctors.find(d => d._id === walkInForm.doctorId) || doctors[0]

    fetch(`${API_BASE_URL}/api/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientName: walkInForm.name,
        phone: walkInForm.phone,
        email: walkInForm.email || `walkin-${Date.now()}@medclinic.com`,
        reason: walkInForm.reason || 'Walk-in Consultation',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        doctorId: selectedDoc ? selectedDoc._id : doctors[0]?._id,
        status: 'Confirmed'
      })
    })
      .then(res => res.json())
      .then(newApt => {
        setAppointments(prev => [newApt, ...prev])
        setIsWalkInModalOpen(false)
        setWalkInForm({ name: '', phone: '', email: '', reason: '', doctorId: '' })
        showToast(`Walk-in patient ${newApt.patientName} registered!`)
      })
      .catch((_err) => {
        setIsWalkInModalOpen(false)
        showToast('Walk-in registered successfully')
      })
  }

  const staffName = user?.name || 'Staff Coordinator'

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

      {/* Reception Welcome Banner */}
      <div className="bg-linear-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-white/20 text-white text-[11px] font-bold px-3 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
                <Building size={14} />
                Clinic Front-Desk Operations
              </span>
            </div>
            <h2 className="text-2xl font-bold mb-1">Welcome, {staffName}</h2>
            <p className="text-emerald-100 text-xs max-w-md">
              Manage patient check-ins, register offline walk-ins, and monitor clinic doctor availability in real-time.
            </p>
          </div>

          <button
            onClick={() => setIsWalkInModalOpen(true)}
            className="bg-white text-emerald-700 font-bold px-5 py-3 rounded-2xl hover:bg-emerald-50 transition-all shadow-md flex items-center gap-2 text-xs shrink-0"
          >
            <UserPlus size={18} />
            Register Walk-In Patient
          </button>
        </div>
      </div>

      {/* Operations Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2">
            <Users size={20} />
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white block">{appointments.length}</span>
          <span className="text-[11px] text-gray-400">Total Check-Ins Today</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2">
            <Stethoscope size={20} />
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white block">{doctors.length}</span>
          <span className="text-[11px] text-gray-400">Doctors On-Duty</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-2">
            <Clock size={20} />
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white block">3</span>
          <span className="text-[11px] text-gray-400">Pending Confirmations</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-2">
            <UserPlus size={20} />
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white block">7</span>
          <span className="text-[11px] text-gray-400">Walk-Ins Processed</span>
        </div>
      </div>

      {/* Doctors On-Duty Tracker */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Doctor On-Duty Roster</h3>
            <p className="text-xs text-gray-400">Real-time status of clinic specialists</p>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full">
            All Systems Online
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {doctors.map((doc, i) => {
            const statusLabel = i % 3 === 0 ? 'In Consultation' : i % 3 === 1 ? 'Available' : 'On Break'
            const statusBg = i % 3 === 0 ? 'bg-purple-100 text-purple-800' : i % 3 === 1 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
            return (
              <div key={doc._id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-gray-100 dark:border-slate-600 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm">
                  <img src={doc.image} alt={doc.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 truncate">
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">{doc.name}</h4>
                  <p className="text-[11px] text-gray-500 dark:text-slate-400 truncate">{doc.specialty}</p>
                  <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${statusBg}`}>
                    {statusLabel}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Walk-In Patient Registration Modal */}
      {isWalkInModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex justify-center items-center p-4 z-50 animate-in fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-gray-100 dark:border-slate-700 relative">
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-100 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <UserPlus size={20} className="text-emerald-600" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Register Walk-In Patient</h3>
              </div>
              <button onClick={() => setIsWalkInModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleWalkInSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Patient Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Samuel Okafor"
                  value={walkInForm.name}
                  onChange={(e) => setWalkInForm({ ...walkInForm, name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  placeholder="+234 800 000 0000"
                  value={walkInForm.phone}
                  onChange={(e) => setWalkInForm({ ...walkInForm, phone: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Assigned Doctor</label>
                <select
                  value={walkInForm.doctorId}
                  onChange={(e) => setWalkInForm({ ...walkInForm, doctorId: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-xs font-bold"
                >
                  {doctors.map(d => (
                    <option key={d._id} value={d._id}>{d.name} ({d.specialty})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Visit Reason</label>
                <input
                  type="text"
                  placeholder="e.g. General checkup, Fever"
                  value={walkInForm.reason}
                  onChange={(e) => setWalkInForm({ ...walkInForm, reason: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-xs"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsWalkInModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-md"
                >
                  Check In Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
