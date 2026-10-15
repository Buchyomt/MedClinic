import React, { useState, useEffect } from 'react'
import { X, Search, FileText, Download, Activity, Pill } from 'lucide-react'

export default function MedicalRecordsModal({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  const records = [
    { id: 1, date: '12 Jun 2026', patient: 'Adesina Musa', type: 'Prescription', details: 'Lisinopril 10mg daily', doctor: 'Dr. Okafor' },
    { id: 2, date: '10 Jun 2026', patient: 'Fatima Bello', type: 'Lab Result', details: 'Complete Blood Count (Normal)', doctor: 'Dr. Adeyemi' },
    { id: 3, date: '05 Jun 2026', patient: 'Chukwu Eze', type: 'Diagnosis', details: 'Hypertension - Stage 1', doctor: 'Dr. Nwosu' },
    { id: 4, date: '01 Jun 2026', patient: 'Ngozi Eze', type: 'Prescription', details: 'Amoxicillin 500mg, 3x daily', doctor: 'Dr. Balogun' },
  ]

  const filteredRecords = records.filter(r => 
    r.patient.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.details.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-tight">Medical Records Vault</h2>
              <p className="text-xs text-gray-500">Secure access to patient history & prescriptions</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search & Filters */}
        <div className="p-6 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by patient name or diagnosis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        {/* Records List */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          <div className="space-y-4">
            {filteredRecords.length === 0 ? (
              <div className="text-center py-10 text-gray-500">No records found matching your search.</div>
            ) : (
              filteredRecords.map((record) => (
                <div key={record.id} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-1 sm:mt-0 ${
                      record.type === 'Prescription' ? 'bg-purple-100 text-purple-600' : 
                      record.type === 'Lab Result' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                    }`}>
                      {record.type === 'Prescription' ? <Pill size={18} /> : <Activity size={18} />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{record.patient}</h4>
                      <p className="text-sm text-gray-600 mt-0.5">{record.details}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 font-medium">
                        <span>{record.date}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span>{record.doctor}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span className={
                          record.type === 'Prescription' ? 'text-purple-600' : 
                          record.type === 'Lab Result' ? 'text-orange-600' : 'text-green-600'
                        }>{record.type}</span>
                      </div>
                    </div>
                  </div>
                  <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-xl transition-colors sm:w-auto w-full border border-gray-200">
                    <Download size={14} />
                    Download PDF
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
