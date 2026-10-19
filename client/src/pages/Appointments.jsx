import React from 'react';
import ScheduleList from '../components/dashboard/ScheduleList';
import { Calendar, Plus, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Appointments() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 flex items-center justify-center shrink-0">
            <Calendar size={22} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-tight">Scheduled Appointments & Bookings</h2>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">View upcoming clinical visits, reschedule, or launch virtual calls</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
          <button
            onClick={() => navigate('/telehealth')}
            className="flex-1 sm:flex-initial justify-center px-3.5 sm:px-4 py-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center gap-2 border border-indigo-200 dark:border-indigo-800 transition-colors"
          >
            <Video size={15} />
            <span>Join Room</span>
          </button>
          
          <button
            onClick={() => navigate('/book')}
            className="flex-1 sm:flex-initial justify-center px-3.5 sm:px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all"
          >
            <Plus size={15} />
            <span>Book Visit</span>
          </button>
        </div>
      </div>

      {/* Schedule List */}
      <ScheduleList />
    </div>
  );
}
