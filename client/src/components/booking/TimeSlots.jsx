import { API_BASE_URL } from '../../config/api';
import React, { useState, useEffect } from 'react'
import { useBooking } from '../../context/BookingContext'
import { Clock, Sun, Sunset, Moon, Check, AlertCircle, Loader2 } from 'lucide-react'

const ALL_SLOTS = [
  { time: '09:00 AM', period: 'Morning' },
  { time: '09:30 AM', period: 'Morning' },
  { time: '10:00 AM', period: 'Morning' },
  { time: '10:30 AM', period: 'Morning' },
  { time: '11:00 AM', period: 'Morning' },
  { time: '11:30 AM', period: 'Morning' },
  { time: '01:00 PM', period: 'Afternoon' },
  { time: '01:30 PM', period: 'Afternoon' },
  { time: '02:00 PM', period: 'Afternoon' },
  { time: '02:30 PM', period: 'Afternoon' },
  { time: '03:00 PM', period: 'Afternoon' },
  { time: '03:30 PM', period: 'Afternoon' },
  { time: '04:30 PM', period: 'Evening' },
  { time: '05:00 PM', period: 'Evening' },
  { time: '05:30 PM', period: 'Evening' }
]

export default function TimeSlots() {
  const { selectedDoctor, selectedDate, selectedTime, setSelectedTime } = useBooking()
  const [activePeriod, setActivePeriod] = useState('All')
  const [bookedTimes, setBookedTimes] = useState([])
  const [loading, setLoading] = useState(false)

  const formattedDate = selectedDate 
    ? (selectedDate instanceof Date ? selectedDate.toISOString().split('T')[0] : String(selectedDate)) 
    : new Date().toISOString().split('T')[0]

  useEffect(() => {
    if (!formattedDate) return

    setLoading(true)
    let url = `${API_BASE_URL}/api/appointments?date=${formattedDate}`
    if (selectedDoctor?._id && selectedDoctor._id.length === 24) {
      url += `&doctorId=${selectedDoctor._id}`
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const taken = data
            .filter(apt => apt.status !== 'Cancelled')
            .map(apt => apt.time?.trim())
          setBookedTimes(taken)

          // If current selected time is booked, reset it to first available
          if (selectedTime && taken.includes(selectedTime)) {
            const firstFree = ALL_SLOTS.find(s => !taken.includes(s.time))
            if (firstFree) setSelectedTime(firstFree.time)
          } else if (!selectedTime) {
            const firstFree = ALL_SLOTS.find(s => !taken.includes(s.time))
            if (firstFree) setSelectedTime(firstFree.time)
          }
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching booked slots:', err)
        setLoading(false)
      })
  }, [formattedDate, selectedDoctor?._id])

  const filteredSlots = activePeriod === 'All' 
    ? ALL_SLOTS 
    : ALL_SLOTS.filter(s => s.period === activePeriod)

  const freeCount = ALL_SLOTS.filter(s => !bookedTimes.includes(s.time)).length

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm mb-6 border border-slate-100 dark:border-slate-700">
      
      {/* Header with Slot Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Clock size={18} className="text-primary" />
            <span>Select Consultation Time</span>
          </h3>
          <p className="text-xs text-gray-500 dark:text-slate-400">
            Real-time availability for {new Date(formattedDate).toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {loading ? (
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
              <Loader2 size={12} className="animate-spin" /> Checking slots...
            </span>
          ) : (
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              {freeCount} Slots Available
            </span>
          )}
        </div>
      </div>

      {/* Period Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-700/60 rounded-2xl mb-4 overflow-x-auto">
        {['All', 'Morning', 'Afternoon', 'Evening'].map(period => (
          <button
            key={period}
            type="button"
            onClick={() => setActivePeriod(period)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activePeriod === period
                ? 'bg-white dark:bg-slate-800 text-primary dark:text-blue-400 shadow-xs'
                : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {period}
          </button>
        ))}
      </div>

      {/* Time Slots Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-2.5">
        {filteredSlots.map((slot) => {
          const isBooked = bookedTimes.includes(slot.time)
          const isSelected = selectedTime === slot.time

          if (isBooked) {
            return (
              <div
                key={slot.time}
                title="This slot has already been booked by another patient"
                className="py-3 px-3 rounded-2xl bg-slate-100 dark:bg-slate-700/40 border border-slate-200/60 dark:border-slate-700 text-slate-400 dark:text-slate-500 flex items-center justify-between opacity-70 cursor-not-allowed select-none"
              >
                <span className="text-xs font-semibold line-through">{slot.time}</span>
                <span className="text-[9px] uppercase font-extrabold tracking-wider bg-slate-200 dark:bg-slate-600 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">
                  Booked
                </span>
              </div>
            )
          }

          return (
            <button
              key={slot.time}
              type="button"
              onClick={() => setSelectedTime(slot.time)}
              className={`py-3 px-3.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer border ${
                isSelected
                  ? 'bg-primary text-white border-primary shadow-md shadow-primary/25 scale-[1.02]'
                  : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600 hover:border-primary hover:text-primary dark:hover:border-blue-400'
              }`}
            >
              <span>{slot.time}</span>
              {isSelected ? (
                <Check size={14} strokeWidth={3} className="text-white" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-emerald-500" title="Available" />
              )}
            </button>
          )
        })}
      </div>

      {/* Anti-double booking guarantee note */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-gray-400 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" /> Live Synchronized Availability
        </span>
        <span>Standard Consultation: 30 Mins</span>
      </div>

    </div>
  )
}
