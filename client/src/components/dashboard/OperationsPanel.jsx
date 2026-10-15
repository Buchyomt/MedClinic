import { API_BASE_URL } from '../../config/api';
import React, { useState } from 'react'
import { CalendarPlus, Search, FileText, ShieldCheck } from 'lucide-react'
import MedicalRecordsModal from './MedicalRecordsModal'
import AddAppointmentModal from './AddAppointmentModal'

export default function OperationsPanel({ setSearchTerm }) {
  const [isRecordsOpen, setIsRecordsOpen] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)

  const handleExport = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/appointments`)
      const data = await res.json()
      
      // Convert to simple CSV
      const headers = ['Date', 'Time', 'Patient', 'Status']
      const rows = data.map(apt => [
        apt.date, 
        apt.time, 
        apt.patientName, 
        apt.status
      ])
      
      let csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(",") + "\n"
        + rows.map(e => e.join(",")).join("\n")
        
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement("a")
      link.setAttribute("href", encodedUri)
      link.setAttribute("download", "daily_appointments.csv")
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch(err) {
      console.error(err)
      // Error already logged above — no browser alert needed
    }
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900">Operations</h3>
        <span className="bg-blue-100 text-primary text-[10px] font-bold px-3 py-1 rounded-full">
          Staff view
        </span>
      </div>
      
      {/* Quick actions */}
      <div className="bg-gray-50 rounded-2xl p-5 mb-6">
        <h4 className="text-[11px] font-bold text-gray-800 mb-3">Quick actions</h4>
        <div className="space-y-2">
          <button 
            onClick={() => setIsAddOpen(true)}
            className="w-full bg-primary text-white flex items-center gap-3 py-3 px-4 rounded-xl shadow-sm hover:bg-primary-dark transition-colors"
          >
            <CalendarPlus size={16} />
            <span className="text-[13px] font-bold">Add appointment</span>
          </button>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input 
              type="text" 
              className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-[13px] text-gray-900 focus:outline-none focus:border-primary"
              placeholder="Find patient..."
              onChange={(e) => {
                 if (setSearchTerm) setSearchTerm(e.target.value)
              }}
            />
          </div>
          
          <button 
            onClick={handleExport}
            className="w-full bg-white border border-gray-200 text-gray-700 flex items-center gap-3 py-3 px-4 rounded-xl shadow-sm hover:bg-gray-50 transition-colors"
          >
            <FileText size={16} className="text-gray-500" />
            <span className="text-[13px] font-bold">Export daily list</span>
          </button>
          
          <button className="w-full bg-blue-50 border border-blue-100 text-blue-700 flex items-center gap-3 py-3 px-4 rounded-xl shadow-sm hover:bg-blue-100 transition-colors" onClick={() => setIsRecordsOpen(true)}>
            <FileText size={16} className="text-blue-500" />
            <span className="text-[13px] font-bold">View Medical Records</span>
          </button>
        </div>
      </div>
      
      {/* Status legend */}
      <div className="bg-gray-50 rounded-2xl p-5 mb-6">
        <h4 className="text-[11px] font-bold text-gray-800 mb-3">Status legend</h4>
        <div className="space-y-2.5">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-600"></div>
            <span className="text-[13px] text-gray-700">Confirmed</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
            <span className="text-[13px] text-gray-700">Pending</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-red-600"></div>
            <span className="text-[13px] text-gray-700">Cancelled</span>
          </div>
        </div>
      </div>
      
      {/* Trust signal */}
      <div className="bg-gray-50 rounded-2xl p-5 mt-auto">
        <h4 className="text-[11px] font-bold text-gray-800 mb-3">Trust signal</h4>
        <div className="bg-white rounded-xl p-4 border border-gray-100 flex gap-3 shadow-sm">
          <div className="shrink-0">
            <ShieldCheck size={20} className="text-green-600" />
          </div>
          <div>
            <h5 className="text-[11px] font-bold text-gray-900 mb-1">Encrypted patient data</h5>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Used only for appointment management and secure communication.
            </p>
          </div>
        </div>
      </div>
      
      <MedicalRecordsModal isOpen={isRecordsOpen} onClose={() => setIsRecordsOpen(false)} />
      <AddAppointmentModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onAdded={() => window.location.reload()} />
    </div>
  )
}
