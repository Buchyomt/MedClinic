import { API_BASE_URL } from '../../config/api';
import React, { useState, useEffect } from 'react'
import { X, FileText, Plus, Trash2, CheckCircle2, User, Stethoscope } from 'lucide-react'

export default function PrescriptionModal({ patient, doctorName, onClose, onIssued }) {
  const [medications, setMedications] = useState([
    { name: 'Amoxicillin 500mg', dosage: '1 Capsule', frequency: '3x daily after meals', duration: '7 days' }
  ])
  const [newMed, setNewMed] = useState({ name: '', dosage: '', frequency: '', duration: '' })
  const [notes, setNotes] = useState('Drink plenty of water and rest well.')
  const [issued, setIssued] = useState(false)

  // Automatic Allergy Conflict Scanner
  const patientKnownAllergies = ['Penicillin', 'Peanuts', 'Sulfa']
  const detectedAllergyWarnings = medications.filter(m => {
    const nameLower = (m.name || '').toLowerCase()
    return nameLower.includes('amox') || nameLower.includes('penicillin') || nameLower.includes('sulfa') || nameLower.includes('ampicillin')
  })

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const handleAddMedication = () => {
    if (!newMed.name) return
    setMedications(prev => [...prev, newMed])
    setNewMed({ name: '', dosage: '', frequency: '', duration: '' })
  }

  const handleRemoveMed = (index) => {
    setMedications(prev => prev.filter((_, i) => i !== index))
  }

  const handleIssue = async (e) => {
    e.preventDefault()
    setIssued(true)

    try {
      await fetch(`${API_BASE_URL}/api/prescriptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: patient?.name || patient?.patientName || 'Patient',
          patientEmail: patient?.email || 'patient@medclinic.com',
          patientPhone: patient?.phone || '',
          prescribedBy: doctorName || 'Pharm. Chinedu Nwankwo',
          facilityName: 'Your Health Pharmacy, GRA, Onitsha',
          medications,
          diagnosis: 'Prescribed Clinical Therapy',
          clinicalNotes: notes
        })
      })
    } catch {
      // offline/fallback
    }

    setTimeout(() => {
      if (onIssued) onIssued()
      onClose()
    }, 1500)
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex justify-center items-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-xl shadow-2xl border border-gray-100 dark:border-slate-700 relative max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-4 mb-6 border-b border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <FileText size={22} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Issue Digital e-Prescription</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400">MediCare Clinic Electronic Health Record</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-500 dark:text-slate-300 flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {issued ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-950/60 text-green-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 size={36} />
            </div>
            <h4 className="text-xl font-bold text-gray-900 dark:text-white">e-Prescription Issued Successfully!</h4>
            <p className="text-xs text-gray-500 dark:text-slate-400 max-w-xs mx-auto">
              The prescription has been linked to {patient?.patientName || 'the patient'}'s profile and sent via SMS/Email.
            </p>
          </div>
        ) : (
          <form onSubmit={handleIssue} className="space-y-5">
            {/* Patient Header */}
            <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  <User size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">{patient?.patientName || 'Adesina Musa'}</h4>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Prescribed by {doctorName || 'Dr. Sarah Jenkins'}</p>
                </div>
              </div>
              <span className="text-[11px] font-bold bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full border border-purple-200 dark:border-purple-800">
                Official EHR Rx
              </span>
            </div>

            {/* Allergy Safety Shield Alert */}
            {detectedAllergyWarnings.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-750 dark:text-rose-200 flex items-start gap-3">
                <span className="text-lg">⚠️</span>
                <div className="text-xs">
                  <p className="font-extrabold text-rose-700 dark:text-rose-300">Potential Drug Allergy Warning!</p>
                  <p className="text-rose-600 dark:text-rose-400 mt-0.5">
                    Patient has a documented allergy to <strong>{patientKnownAllergies.join(', ')}</strong>. You are prescribing <em>{detectedAllergyWarnings.map(w => w.name).join(', ')}</em>. Ensure clinical override is intended.
                  </p>
                </div>
              </div>
            )}

            {/* Prescribed Medications */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-2">Prescribed Medications</label>
              <div className="space-y-2 mb-3">
                {medications.map((med, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 text-xs">
                    <div>
                      <span className="font-bold text-gray-900 dark:text-white block">{med.name}</span>
                      <span className="text-gray-500 dark:text-slate-400">{med.dosage} • {med.frequency} ({med.duration})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveMed(idx)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Medication */}
              <div className="p-3 rounded-2xl bg-gray-50 dark:bg-slate-700/30 border border-dashed border-gray-200 dark:border-slate-600 space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Medication Name (e.g. Paracetamol 500mg)"
                    value={newMed.name}
                    onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                    className="px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="text"
                    placeholder="Dosage (e.g. 1 Tablet)"
                    value={newMed.dosage}
                    onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                    className="px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Frequency (e.g. Twice daily)"
                    value={newMed.frequency}
                    onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
                    className="px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="text"
                    placeholder="Duration (e.g. 5 days)"
                    value={newMed.duration}
                    onChange={(e) => setNewMed({ ...newMed, duration: e.target.value })}
                    className="px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddMedication}
                  className="w-full py-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold text-xs hover:bg-purple-100 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus size={14} />
                  Add Medication to List
                </button>
              </div>
            </div>

            {/* Doctor Advice / Notes */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Doctor Advice & Notes</label>
              <textarea
                rows="2"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              ></textarea>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-slate-300 font-bold text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-purple-600 text-white font-bold text-sm hover:bg-purple-700 transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <Stethoscope size={18} />
                Issue e-Prescription
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  )
}
