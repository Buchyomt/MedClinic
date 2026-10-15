import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/dashboard/Header';
import StatsBar from '../components/dashboard/StatsBar';
import ScheduleList from '../components/dashboard/ScheduleList';
import OperationsPanel from '../components/dashboard/OperationsPanel';
import PharmacistDashboard from '../components/pharmacist/PharmacistDashboard';
import PatientDashboard from '../components/dashboard/PatientDashboard';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, ChevronRight, ShieldCheck, Stethoscope } from 'lucide-react';

export default function Dashboard() {
  const { role, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Redirect guests to login
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  // Default view based strictly on user role
  const [dashboardView, setDashboardView] = useState(() => {
    if (role === 'pharmacist') return 'pharmacist';
    if (role === 'doctor') return 'clinic';
    return 'patient';
  });

  // Keep view in sync when role updates
  useEffect(() => {
    if (role === 'pharmacist') setDashboardView('pharmacist');
    else if (role === 'doctor') setDashboardView('clinic');
    else setDashboardView('patient');
  }, [role]);

  // PATIENT VIEW: Strictly protected patient health portal
  if (role === 'patient' || dashboardView === 'patient') {
    return (
      <div className="flex-1 flex flex-col gap-6">
        <PatientDashboard />
      </div>
    );
  }

  // CLINICAL / STAFF VIEW (Strictly for Pharm. Chinedu, Doctors, and Reception staff)
  return (
    <div className="flex-1 flex flex-col gap-6">
      
      {/* Workspace Switcher Bar for Clinical Staff Pitching & Testing */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Clinical Staff Workspace:</span>
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setDashboardView('pharmacist')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                dashboardView === 'pharmacist' 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <ShieldCheck size={14} />
              <span>Pharm. Chinedu Workspace (Admin Approvals)</span>
            </button>
            <button
              onClick={() => setDashboardView('clinic')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                dashboardView === 'clinic' 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <Stethoscope size={14} />
              <span>Doctor / Physician Schedule</span>
            </button>
          </div>
        </div>

        <span className="text-[11px] text-slate-400 font-medium">
          Active Provider: <strong className="text-slate-800 dark:text-slate-200 capitalize">{role}</strong>
        </span>
      </div>

      {dashboardView === 'pharmacist' ? (
        <PharmacistDashboard />
      ) : (
        <>
          <Header />
          
          {/* Date Selector */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl py-4 px-6 flex items-center justify-between shadow-sm border border-slate-200 dark:border-slate-800">
            <ChevronLeft size={20} className="text-blue-600 dark:text-blue-400 cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-800 rounded-full transition-colors" />
            <span className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base">
              Hospital Clinical Schedule: Monday, June 14, 2026
            </span>
            <ChevronRight size={20} className="text-blue-600 dark:text-blue-400 cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-800 rounded-full transition-colors" />
          </div>
          
          <StatsBar />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Schedule */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
              <ScheduleList searchTerm={searchTerm} />
            </div>
            
            {/* Right Column: Operations */}
            <div className="lg:col-span-1">
              <OperationsPanel setSearchTerm={setSearchTerm} />
            </div>
          </div>
        </>
      )}

    </div>
  );
}
