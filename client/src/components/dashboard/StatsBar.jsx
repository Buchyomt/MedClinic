import React from 'react'

export default function StatsBar() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Today's Appointments</h2>
        <p className="text-xs text-gray-500">Scannable schedule with live status controls</p>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="bg-white rounded-full px-4 py-1.5 shadow-sm text-[13px] font-bold text-gray-800 border border-gray-100">
          Total: 12
        </div>
        <div className="bg-green-50 rounded-full px-4 py-1.5 shadow-sm text-[13px] font-bold text-green-700 border border-green-100">
          Confirmed: 7
        </div>
        <div className="bg-orange-50 rounded-full px-4 py-1.5 shadow-sm text-[13px] font-bold text-orange-600 border border-orange-100">
          Pending: 3
        </div>
      </div>
    </div>
  )
}
