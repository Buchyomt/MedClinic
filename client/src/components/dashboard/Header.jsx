import React, { useState } from 'react'
import { Plus, Settings, Bell } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Header() {
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-between bg-slate-50 -mx-6 md:-mx-8 -mt-6 md:-mt-8 p-6 md:p-8 pb-8">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center font-bold">
          <Plus size={20} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Daily Overview</h1>
          <p className="text-sm text-gray-500">Reception dashboard for clinic staff</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="relative">
          <button 
            className="relative text-blue-500 hover:bg-blue-50 p-2 rounded-full transition-colors"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
          >
            <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></div>
            <Bell size={22} />
          </button>
          
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-lg border border-gray-100 p-4 z-50">
              <h4 className="font-bold text-gray-900 mb-3 px-1 text-sm">Notifications</h4>
              <div className="space-y-3">
                <div className="flex gap-3 bg-blue-50/50 p-3 rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                  <div>
                    <p className="text-xs text-gray-800 font-medium leading-tight">New appointment booked by Fatima Bello for Dr. Adeyemi.</p>
                    <p className="text-[10px] text-gray-400 mt-1">10 mins ago</p>
                  </div>
                </div>
                <div className="flex gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-transparent border border-gray-300 mt-1.5 shrink-0"></div>
                  <div>
                    <p className="text-xs text-gray-600 leading-tight">System maintenance scheduled for 2:00 AM on Sunday.</p>
                    <p className="text-[10px] text-gray-400 mt-1">2 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <button 
          onClick={() => navigate('/settings')}
          className="text-blue-500 hover:bg-blue-50 p-2 rounded-full transition-colors"
        >
          <Settings size={22} />
        </button>
      </div>
    </div>
  )
}
