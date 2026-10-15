import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, Plus, Moon, Sun, Pill, Stethoscope, Video, User, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFacility } from '../../context/FacilityContext';
import { useTheme } from '../../context/ThemeContext';
import NotificationPanel from '../NotificationPanel';
import AuthModal from '../auth/AuthModal';
import ProfileModal from '../profile/ProfileModal';

export default function TopNavbar({ onMenuClick }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role, isLoggedIn } = useAuth();
  const { isPharmacyMode, toggleFacility } = useFacility();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Page title mapping
  const getPageMeta = () => {
    switch (location.pathname) {
      case '/':
        return { title: isPharmacyMode ? 'Pharmacy Dispensary & MTM Hub' : 'Doctor Discovery & Consultations', subtitle: 'Find verified specialists or order prescriptions' };
      case '/pharmacist':
        return { title: 'Pharm. Chinedu Nwankwo • Onitsha', subtitle: 'Lead Clinical Pharmacist Profile, Services & Consultation Hub' };
      case '/appointments':
        return { title: 'Appointments & Booking Queue', subtitle: 'Manage upcoming clinical visits and history' };
      case '/telehealth':
        return { title: 'Virtual Telehealth Consultation', subtitle: 'Encrypted HD Video & Live Clinical Notes' };
      case '/records':
        return { title: 'Digital Medical Records & Rx', subtitle: 'Prescription history, lab diagnostics and doctor notes' };
      case '/queue':
        return { title: 'Live Patient Waiting Board', subtitle: 'Real-time hospital token queue and estimated wait times' };
      case '/dashboard':
        return { 
          title: role === 'pharmacist' ? 'Pharmacist Command & Operations Center' : role === 'doctor' ? 'Physician Clinical Workspace' : role === 'receptionist' ? 'Front-Desk Operations Center' : 'Patient Health Dashboard', 
          subtitle: role === 'pharmacist' ? 'Live visitor monitoring, appointment approvals & dispensary tracking' : 'Overview of scheduled consultations and daily workflows' 
        };
      case '/settings':
        return { title: 'Account & Security Settings', subtitle: 'Manage credentials, clinical permissions, and preferences' };
      default:
        return { title: 'MedClinic Healthcare', subtitle: 'Connected Medical & Pharmacy Management' };
    }
  };

  const pageMeta = getPageMeta();

  return (
    <>
      <header className="sticky top-0 z-30 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 lg:px-8 py-3.5 transition-colors">
        <div className="flex items-center justify-between gap-4">
          
          {/* Left: Mobile Menu Button + Page Info */}
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Open sidebar menu"
            >
              <Menu size={22} />
            </button>

            <div className="hidden sm:block">
              <h1 className="text-lg lg:text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight flex items-center gap-2">
                {pageMeta.title}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {pageMeta.subtitle}
              </p>
            </div>
          </div>

          {/* Right: Actions, Facility Badge, Notifications, Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Facility Mode Quick Indicator */}
            <button
              onClick={toggleFacility}
              className={`
                hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm
                ${isPharmacyMode 
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100' 
                  : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100'}
              `}
              title="Click to toggle between Clinic and Pharmacy modes"
            >
              {isPharmacyMode ? <Pill size={14} className="text-emerald-500" /> : <Stethoscope size={14} className="text-blue-500" />}
              <span>{isPharmacyMode ? 'PharmaCare (Onitsha)' : 'MediCare Clinic'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75"></span>
            </button>

            {/* Quick Action Button: Book / Command Center */}
            {role === 'pharmacist' ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-md shadow-indigo-500/20 hover:shadow-lg transition-all cursor-pointer active:scale-95"
                title="Open Pharmacist Command Center"
              >
                <ShieldCheck size={16} />
                <span className="hidden sm:inline">Command Center</span>
              </button>
            ) : (
              <button
                onClick={() => navigate('/book')}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md shadow-emerald-500/20 hover:shadow-lg transition-all cursor-pointer active:scale-95"
              >
                <Plus size={16} />
                <span className="hidden sm:inline">Book Visit</span>
              </button>
            )}

            <button
              onClick={() => navigate('/telehealth')}
              className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 transition-all cursor-pointer"
            >
              <Video size={15} />
              <span>Virtual Call</span>
            </button>

            {/* Notification Bell Panel */}
            <NotificationPanel />

            {/* Dark Mode Quick Switcher */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl text-slate-500 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
            </button>

            {/* Auth / Avatar Quick Trigger */}
            {!isLoggedIn ? (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
              >
                <User size={15} />
                <span>Sign In</span>
              </button>
            ) : (
              <div 
                onClick={() => setIsProfileModalOpen(true)}
                className="w-9 h-9 rounded-xl overflow-hidden ring-2 ring-primary/30 flex items-center justify-center text-xs shadow-md cursor-pointer hover:scale-105 transition-transform bg-slate-100 dark:bg-slate-800"
                title={`${user?.name} — Click to view profile / change photo`}
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-bold text-white bg-linear-to-br from-indigo-500 to-purple-600 w-full h-full flex items-center justify-center">
                    {user?.initials || 'AJ'}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Auth Modal if clicked Sign In */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* Profile & Photo Upload Modal */}
      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
    </>
  );
}
