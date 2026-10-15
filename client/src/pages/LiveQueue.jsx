import React, { useState } from 'react';
import { Volume2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const INITIAL_QUEUE = [
  { token: 'MC-102', patient: 'Chioma Obi', doctor: 'Dr. Sarah Jenkins', dept: 'Cardiology', room: 'Suite 3', status: 'Now Serving', wait: 'In Consultation' },
  { token: 'MC-103', patient: 'Emeka Nwosu', doctor: 'Dr. Michael Chen', dept: 'Neurology', room: 'Suite 1', status: 'Now Serving', wait: 'In Consultation' },
  { token: 'MC-104', patient: 'Ade Johnson (You)', doctor: 'Dr. Sarah Jenkins', dept: 'Cardiology', room: 'Suite 3', status: 'Next In Line', wait: '~4 mins' },
  { token: 'MC-105', patient: 'Fatima Aliyu', doctor: 'Pharm. Chinedu Nwankwo', dept: 'Pharmacy MTM', room: 'Counter 2', status: 'Waiting', wait: '~12 mins' },
  { token: 'MC-106', patient: 'Tunde Bakare', doctor: 'Dr. Michael Chen', dept: 'General OPD', room: 'Suite 2', status: 'Waiting', wait: '~19 mins' },
  { token: 'MC-107', patient: 'Grace Eze', doctor: 'Dr. Sarah Jenkins', dept: 'Cardiology', room: 'Suite 3', status: 'Waiting', wait: '~26 mins' }
];

export default function LiveQueue() {
  const { user } = useAuth();
  const [queue] = useState(INITIAL_QUEUE);
  const [lastChimed, setLastChimed] = useState(null);
  const [selectedDept, setSelectedDept] = useState('All');

  // Simulated live queue audio bell
  const playQueueChime = (token = 'MC-104') => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch (e) {
      console.log('Audio chime simulated:', e);
    }
    setLastChimed(`Now Calling: Token ${token} to Consultation Suite 3`);
    setTimeout(() => setLastChimed(null), 4000);
  };

  const filteredQueue = selectedDept === 'All' 
    ? queue 
    : queue.filter(q => q.dept.toLowerCase().includes(selectedDept.toLowerCase()));

  return (
    <div className="flex-1 flex flex-col gap-6">
      
      {/* Top Header & Announcement Alert */}
      <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-3xl p-6 shadow-2xl border border-indigo-500/20 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Live Hospital Waiting Room & Token Board
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ACTIVE QUEUE
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Electronic patient call board synced with clinic suites & pharmacy dispensary
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => playQueueChime('MC-104')}
              className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
            >
              <Volume2 size={16} />
              <span>Simulate Token Chime</span>
            </button>
          </div>
        </div>

        {/* Live Audio Chime Banner Pop */}
        {lastChimed && (
          <div className="mt-4 p-3 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-200 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <Sparkles size={16} className="text-amber-400 animate-spin" />
            <span>🔔 {lastChimed}</span>
          </div>
        )}
      </div>

      {/* Patient Active Token Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Your Active Token Status */}
        <div className="md:col-span-1 bg-linear-to-br from-blue-600 to-indigo-700 text-white rounded-3xl p-6 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-2">
            <span className="text-[11px] font-extrabold tracking-widest uppercase text-blue-200">Your Clinical Token</span>
            <h3 className="text-4xl font-black tracking-tight text-white">MC-104</h3>
            <p className="text-xs text-blue-100 font-medium">Assigned to {user?.name || 'Ade Johnson'}</p>
          </div>

          <div className="pt-6 space-y-3">
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex items-center justify-between">
              <span className="text-xs text-blue-100 font-semibold">Position in Queue:</span>
              <span className="text-sm font-black text-amber-300">1 Patient Ahead</span>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex items-center justify-between">
              <span className="text-xs text-blue-100 font-semibold">Estimated Call Time:</span>
              <span className="text-sm font-black text-emerald-300">~4 minutes</span>
            </div>
          </div>
        </div>

        {/* Currently Serving Suites (2 Columns) */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Suite 3 (Cardiology)</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                IN PROGRESS
              </span>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900 dark:text-white">MC-102</p>
              <p className="text-xs font-bold text-blue-600 dark:text-blue-400">Dr. Sarah Jenkins</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Patient: Chioma Obi</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Suite 1 (Neurology)</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                IN PROGRESS
              </span>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900 dark:text-white">MC-103</p>
              <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Dr. Michael Chen</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Patient: Emeka Nwosu</p>
            </div>
          </div>
        </div>

      </div>

      {/* Main Waiting List Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        
        {/* Table Filter Tabs */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">All Queue Entries</h3>
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
            {['All', 'Cardiology', 'Neurology', 'Pharmacy'].map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${selectedDept === dept ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filteredQueue.map((item) => {
            const isUserToken = item.token === 'MC-104';
            return (
              <div 
                key={item.token}
                className={`p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${isUserToken ? 'bg-blue-50/60 dark:bg-blue-950/30 font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shadow-sm ${isUserToken ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'}`}>
                    {item.token}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-extrabold text-slate-900 dark:text-white">{item.patient}</p>
                      {isUserToken && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                          YOU
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {item.doctor} &bull; <span className="font-semibold text-slate-700 dark:text-slate-300">{item.dept}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:text-right">
                  <div className="hidden sm:block">
                    <p className="text-xs font-mono text-slate-500 dark:text-slate-400">Room</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.room}</p>
                  </div>

                  <div className="min-w-[100px]">
                    <p className="text-xs font-mono text-slate-500 dark:text-slate-400">Wait Est.</p>
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{item.wait}</p>
                  </div>

                  <span className={`px-3 py-1 rounded-xl text-xs font-extrabold ${item.status === 'Now Serving' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' : item.status === 'Next In Line' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>
                    {item.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
