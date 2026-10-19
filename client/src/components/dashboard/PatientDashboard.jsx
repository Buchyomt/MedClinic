import { API_BASE_URL } from '../../config/api';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, Pill, FileText, Video, Clock, ShieldCheck, 
  ArrowRight, Sparkles, CheckCircle2, AlertCircle, Plus, 
  Activity, Heart, MessageCircle 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ScheduleList from './ScheduleList';

export default function PatientDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [appointmentCount, setAppointmentCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const firstName = user?.name ? user.name.split(' ')[0] : 'Patient';
  const patientId = user?._id ? `#MED-PT-${user._id.slice(-5).toUpperCase()}` : '#MED-PT-88241';

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/appointments`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Count only appointments belonging to this patient
          const myApts = data.filter(apt => {
            const matchesEmail = apt.email && user?.email && apt.email.toLowerCase() === user.email.toLowerCase();
            const matchesName = apt.patientName && user?.name && apt.patientName.toLowerCase().includes(user.name.split(' ')[0].toLowerCase());
            return matchesEmail || matchesName;
          });
          setAppointmentCount(myApts.length);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching patient appointments:', err);
        setLoading(false);
      });
  }, [user?.email, user?.name]);

  return (
    <div className="space-y-6">
      
      {/* Patient Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-600 via-indigo-600 to-teal-500 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-black uppercase tracking-wider">
              <ShieldCheck size={14} className="text-emerald-300" />
              <span>Verified Patient Portal &bull; {patientId}</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome back, {firstName}! 👋
            </h1>
            
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl leading-relaxed">
              Track your upcoming clinical appointments, review digital prescriptions from Pharm. Chinedu, access telehealth rooms, and download medical records.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => navigate('/book')}
              className="px-5 py-3 rounded-2xl bg-white hover:bg-slate-100 text-blue-900 font-black text-xs sm:text-sm shadow-lg active:scale-98 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Calendar size={16} className="text-blue-600" />
              <span>Book Appointment</span>
              <ArrowRight size={15} />
            </button>

            <button
              onClick={() => navigate('/pharmacist')}
              className="px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/30 text-white font-bold text-xs sm:text-sm backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Pill size={16} className="text-emerald-300" />
              <span>Pharmacy & Refills</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      </div>

      {/* Patient Health Overview Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        
        <div 
          onClick={() => navigate('/appointments')}
          className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-400 dark:hover:border-blue-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Your Bookings</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar size={18} />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {loading ? '...' : appointmentCount}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Scheduled Consultations</p>
        </div>

        <div 
          onClick={() => navigate('/pharmacist')}
          className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-400 dark:hover:border-emerald-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Prescriptions</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Pill size={18} />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            Active
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Your Health Pharmacy, Onitsha</p>
        </div>

        <div 
          onClick={() => navigate('/queue')}
          className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-purple-400 dark:hover:border-purple-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Clinic Queue</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock size={18} />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            Live
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Token Waiting Board</p>
        </div>

        <div 
          onClick={() => navigate('/records')}
          className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-teal-400 dark:hover:border-teal-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Health Vault</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText size={18} />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            Secured
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Lab Diagnostics & Vitals</p>
        </div>

      </div>

      {/* Main Section: Patient Consultation Schedule */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar size={20} className="text-blue-600" />
              <span>Your Scheduled Appointments</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Consultation requests are reviewed and approved by <strong>Pharm. Chinedu Nwankwo</strong> at Your Health Pharmacy, Onitsha.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/telehealth')}
              className="px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center gap-1.5 hover:bg-indigo-100 transition-colors"
            >
              <Video size={14} />
              <span>Virtual Call Room</span>
            </button>
            <button
              onClick={() => navigate('/book')}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus size={14} />
              <span>New Booking</span>
            </button>
          </div>
        </div>

        {/* Schedule list isolated strictly to this patient */}
        <ScheduleList />
      </div>

      {/* Quick Services & Pharmacy Hub Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div 
          onClick={() => navigate('/pharmacist')}
          className="p-5 rounded-3xl bg-linear-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 hover:border-emerald-500/40 transition-all cursor-pointer space-y-2.5"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
            <Pill size={20} />
          </div>
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Your Health Pharmacy (Onitsha)</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Order authentic medications, calculate MTM reviews, and chat directly with Pharm. Chinedu Nwankwo on WhatsApp (+234 702 505 1669).
          </p>
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 pt-1">
            <span>Browse Pharmacy Catalog</span>
            <ArrowRight size={13} />
          </div>
        </div>

        <div 
          onClick={() => navigate('/records')}
          className="p-5 rounded-3xl bg-linear-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 hover:border-blue-500/40 transition-all cursor-pointer space-y-2.5"
        >
          <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
            <FileText size={20} />
          </div>
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Electronic Health Records</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Access confidential laboratory test results, blood pressure and glucose charts, immunization records, and physician notes.
          </p>
          <div className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 pt-1">
            <span>Open Health Vault</span>
            <ArrowRight size={13} />
          </div>
        </div>

        <div 
          onClick={() => navigate('/queue')}
          className="p-5 rounded-3xl bg-linear-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 hover:border-purple-500/40 transition-all cursor-pointer space-y-2.5"
        >
          <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/20">
            <Clock size={20} />
          </div>
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Live Clinic Waiting Board</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Monitor real-time patient queue tokens, estimated wait times, and get notified immediately when your consultation room is ready.
          </p>
          <div className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1 pt-1">
            <span>View Queue Status</span>
            <ArrowRight size={13} />
          </div>
        </div>

      </div>

    </div>
  );
}
