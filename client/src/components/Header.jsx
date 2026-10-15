import React, { useState, useContext } from 'react'
import { Plus, Pill, Moon, Sun, LogIn } from 'lucide-react'
import { ThemeContext } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { useFacility } from '../context/FacilityContext'
import AuthModal from './auth/AuthModal'

import NotificationPanel from './NotificationPanel'

export default function Header() {
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const { user, role, isLoggedIn } = useAuth();
  const { isPharmacyMode, pharmacyProfile, clinicProfile } = useFacility();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const facilityName = isPharmacyMode ? (pharmacyProfile?.name || 'PharmaCare Pharmacy') : (clinicProfile?.name || 'MediCare Clinic');

  const getGreeting = () => {
    if (!user) return `Welcome to ${facilityName} 👋`;
    if (role === 'doctor') return isPharmacyMode ? `Pharm. ${user.name.replace(/^Dr\.\s*|^Pharm\.\s*/i, '')} 💊` : `Dr. ${user.name.replace(/^Dr\.\s*/i, '')} 🩺`;
    if (role === 'receptionist') return `Reception Portal • ${user.name}`;
    return `Good morning, ${user.name.split(' ')[0]} 👋`;
  };

  const getRoleTag = () => {
    if (role === 'doctor') return isPharmacyMode ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300';
    if (role === 'receptionist') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300';
    return isPharmacyMode ? 'bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300';
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className={`${isPharmacyMode ? 'bg-emerald-600' : 'bg-primary'} text-white w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-colors`}>
            {isPharmacyMode ? <Pill size={24} /> : <Plus size={24} />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`text-[22px] font-bold ${isPharmacyMode ? 'text-emerald-700 dark:text-emerald-400' : 'text-primary dark:text-blue-400'} leading-tight transition-colors`}>
                {facilityName}
              </h1>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${getRoleTag()}`}>
                {role === 'doctor' && isPharmacyMode ? 'Pharmacist' : role}
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-[14px] font-medium transition-colors">
              {getGreeting()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <NotificationPanel />

          <button 
            onClick={toggleDarkMode} 
            className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-colors"
            title="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {isLoggedIn ? (
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-slate-100 dark:bg-slate-800 text-primary dark:text-blue-400 px-3 py-2 rounded-full flex items-center gap-2 shadow-sm transition-all hover:bg-slate-200 dark:hover:bg-slate-700"
              title="Manage Account"
            >
              <div className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                {user.initials || 'U'}
              </div>
              <span className="text-xs font-bold hidden sm:inline text-gray-800 dark:text-slate-200">{user.name.split(' ')[0]}</span>
            </button>
          ) : (
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-primary text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md hover:bg-primary-dark transition-all"
            >
              <LogIn size={15} />
              Sign In
            </button>
          )}
        </div>
      </div>

      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}
    </>
  )
}
