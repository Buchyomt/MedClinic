import React from 'react'
import { useBooking } from '../../context/BookingContext'

export default function DoctorSummary() {
  const { selectedDoctor, selectedDate, selectedTime } = useBooking();

  // Fallbacks if accessed directly
  const doctor = selectedDoctor || {
    name: 'Dr. Sarah Okafor',
    specialty: 'Cardiologist',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=faces&q=80'
  };
  const dateStr = selectedDate ? `June ${selectedDate}, 2026` : 'Mon, June 14, 2026';
  const timeStr = selectedTime || '10:00 AM';

  return (
    <div className="bg-blue-100 bg-opacity-50 p-4 rounded-3xl flex justify-between items-center mb-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
          <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-sm">{doctor.name}</h3>
          <p className="text-xs text-gray-600 font-medium">{doctor.specialty}</p>
        </div>
      </div>
      <div className="text-right pl-2">
        <p className="text-primary font-bold text-[13px] mb-1 leading-tight">{dateStr}</p>
        <p className="text-primary font-bold text-[13px] leading-tight">{timeStr}</p>
      </div>
    </div>
  )
}
