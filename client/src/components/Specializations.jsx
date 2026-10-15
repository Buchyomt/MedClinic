import React from 'react'
import { Stethoscope, Baby, Smile, Eye, HeartPulse, Droplet, ShieldAlert, Bone, Ear } from 'lucide-react'

const specializations = [
  { id: 1, name: 'All', icon: Stethoscope },
  { id: 2, name: 'Allergy', icon: ShieldAlert },
  { id: 3, name: 'Dermatology', icon: Droplet },
  { id: 4, name: 'Cardiology', icon: HeartPulse },
  { id: 5, name: 'Pediatrics', icon: Baby },
  { id: 6, name: 'Orthopedics', icon: Bone },
  { id: 7, name: 'ENT', icon: Ear },
  { id: 8, name: 'Dentistry', icon: Smile },
  { id: 9, name: 'Optometry', icon: Eye },
]

export default function Specializations({ selectedSpecialty, setSelectedSpecialty }) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4 px-1">
        <h2 className="text-[17px] font-bold text-gray-800 dark:text-gray-100 transition-colors">Choose Specialization</h2>
        <span className="text-xs text-primary font-semibold">{selectedSpecialty || 'All'}</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {specializations.map((spec) => {
          const Icon = spec.icon
          const isActive = selectedSpecialty === spec.name || (!selectedSpecialty && spec.name === 'All') || (selectedSpecialty === 'General Medicine' && spec.name === 'All');
          return (
            <div
              key={spec.id}
              onClick={() => setSelectedSpecialty(spec.name)}
              className={`flex flex-col items-center justify-center p-3.5 rounded-2xl cursor-pointer transition-all active:scale-95 ${
                isActive
                  ? 'bg-primary text-white shadow-md shadow-primary/25 scale-[1.02]'
                  : 'bg-white dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none'
              }`}
            >
              <div className="mb-1.5">
                <Icon size={26} className={isActive ? 'text-white' : 'text-primary dark:text-blue-400'} />
              </div>
              <span className={`text-[11px] font-bold text-center truncate w-full ${isActive ? 'text-white' : 'text-gray-700 dark:text-gray-200'}`}>
                {spec.name}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
