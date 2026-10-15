import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, Calendar, FileText, LayoutDashboard, Video, 
  Users, Settings, Pill, Stethoscope, Moon, Sun, 
  LogOut, ChevronRight, ChevronLeft, X, Activity, 
  QrCode, ShieldCheck, Smartphone
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFacility } from '../../context/FacilityContext';
import { useTheme } from '../../context/ThemeContext';
import HealthPassportModal from '../passport/HealthPassportModal';

export default function Sidebar({ isOpen, setIsOpen, isCollapsed, setIsCollapsed }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, logout, updateProfile } = useAuth();
  const { isPharmacyMode, toggleFacilityMode } = useFacility();
  const { isDarkMode, toggleDarkMode } = useTheme();
  
  const [showPassport, setShowPassport] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  // Prevent background scroll bleed when mobile sidebar drawer is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalTouchAction = document.body.style.touchAction;
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.touchAction = originalTouchAction;
      };
    }
  }, [isOpen]);

  const handleLogout = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    logout();
    if (setIsOpen) setIsOpen(false);
    navigate('/login');
  };

  const handleRoleSwitch = (newRole) => {
    let mockData = {};
    if (newRole === 'pharmacist') {
      mockData = {
        name: 'Pharm. Chinedu Nwankwo',
        role: 'pharmacist',
        title: 'Lead Clinical Pharmacist & Director',
        department: 'Your Health Pharmacy (Onitsha)',
        specialty: 'Clinical Pharmacy & MTM',
        initials: 'CN'
      };
    } else if (newRole === 'doctor') {
      mockData = {
        name: 'Dr. Sarah Jenkins',
        role: 'doctor',
        title: 'Senior Cardiologist & Consultant',
        department: 'Cardiology Clinic',
        specialty: 'Cardiovascular Medicine',
        initials: 'SJ'
      };
    } else if (newRole === 'receptionist') {
      mockData = {
        name: 'Amara Kalu',
        role: 'receptionist',
        title: 'Front-Desk & Dispensary Admin',
        department: 'Patient Administration',
        specialty: 'Dispensary Logistics',
        initials: 'AK'
      };
    } else {
      mockData = {
        name: 'Ade Johnson',
        role: 'patient',
        title: 'Verified Patient',
        department: 'General Outpatient',
        specialty: '',
        initials: 'AJ'
      };
    }
    updateProfile(mockData);
    setShowRoleMenu(false);
  };

  const navItems = [
    {
      label: 'Home & Explore',
      path: '/',
      icon: Home,
      badge: isPharmacyMode ? 'Pharmacy' : null,
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
    },
    {
      label: 'Pharm. Chinedu (Onitsha)',
      path: '/pharmacist',
      icon: ShieldCheck,
      badge: 'Lead Rx',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
    },
    {
      label: 'Appointments',
      path: '/appointments',
      icon: Calendar,
      badge: 'Live',
      badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
    },
    {
      label: 'Telehealth Room',
      path: '/telehealth',
      icon: Video,
      badge: 'HD Video',
      badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
    },
    {
      label: 'Medical Records & Rx',
      path: '/records',
      icon: FileText
    },
    {
      label: 'Dispensary Queue Board',
      path: '/queue',
      icon: Activity,
      badge: 'Live',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
    },
    {
      label: role === 'pharmacist' 
        ? 'Pharmacist Command Center' 
        : role === 'doctor' 
        ? 'Doctor Clinical Schedule' 
        : role === 'receptionist' 
        ? 'Front-Desk Operations' 
        : 'Patient Health Portal',
      path: '/dashboard',
      icon: LayoutDashboard,
      badge: role === 'pharmacist' ? 'Main Rx' : null,
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
    },
    {
      label: 'Settings & Security',
      path: '/settings',
      icon: Settings
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          onTouchMove={(e) => e.preventDefault()}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 touch-none select-none"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`
          fixed top-0 bottom-0 left-0 z-50 
          bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800/80
          flex flex-col justify-between transition-all duration-300 ease-in-out
          shadow-xl lg:shadow-none overscroll-contain
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'lg:w-20' : 'w-72 lg:w-72'}
        `}
      >
        {/* Top Branding Section */}
        <div className="p-4 lg:p-5 flex flex-col gap-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div 
              onClick={() => navigate('/')} 
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className={`
                w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-105
                ${isPharmacyMode 
                  ? 'bg-linear-to-tr from-emerald-600 to-teal-400 text-white shadow-emerald-500/25' 
                  : 'bg-linear-to-tr from-blue-600 to-indigo-500 text-white shadow-blue-500/25'}
              `}>
                {isPharmacyMode ? <Pill size={22} className="animate-pulse" /> : <Activity size={22} />}
              </div>

              {!isCollapsed && (
                <div className="flex flex-col overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-xl tracking-tight bg-linear-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                      MedClinic
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 uppercase tracking-wide">
                      RX ONITSHA
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                    {isPharmacyMode ? 'Your Health Pharmacy (GRA)' : 'Healthcare Hub'}
                  </span>
                </div>
              )}
            </div>

            {/* Mobile Close or Desktop Collapse button */}
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setIsOpen(false)}
                className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={20} />
              </button>
              <button 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden lg:flex p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              >
                {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              </button>
            </div>
          </div>

          {/* Quick Interactive Role Switcher Banner — only for clinical staff/demo */}
          {!isCollapsed && user && (
            role === 'patient' ? (
              <div className="w-full flex items-center justify-between p-2.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-800/50 text-left">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                  <div className="truncate">
                    <p className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 tracking-wider">Patient Account</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                      {user.name}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                  Patient Portal
                </span>
              </div>
            ) : (
              <div className="relative">
                <button 
                  onClick={() => setShowRoleMenu(!showRoleMenu)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-left hover:border-emerald-400 dark:hover:border-emerald-500 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                    <div className="truncate">
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Clinical Workspace</p>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-100 capitalize truncate">
                        {role === 'pharmacist' 
                          ? 'Pharm. Chinedu (Admin)' 
                          : role === 'doctor' 
                          ? 'Doctor / Physician' 
                          : 'Receptionist / Admin'}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={14} className={`text-slate-400 transition-transform ${showRoleMenu ? 'rotate-90' : ''}`} />
                </button>

                {/* Role Dropdown — Staff / Clinical Demo Only */}
                {showRoleMenu && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 p-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-50 animate-in fade-in">
                    <p className="text-[10px] font-bold text-slate-400 px-3 py-1 uppercase">Clinical Role (Demo)</p>
                    
                    <button 
                      onClick={() => handleRoleSwitch('pharmacist')}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${role === 'pharmacist' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300 font-bold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'}`}
                    >
                      <ShieldCheck size={16} className="text-emerald-500" />
                      <span>Pharm. Chinedu (Can Edit & Manage)</span>
                    </button>

                    <button 
                      onClick={() => handleRoleSwitch('doctor')}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${role === 'doctor' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'}`}
                    >
                      <Stethoscope size={16} className="text-indigo-500" />
                      <span>Doctor / Physician (Referral)</span>
                    </button>

                    <button 
                      onClick={() => handleRoleSwitch('receptionist')}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${role === 'receptionist' ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'}`}
                    >
                      <Users size={16} className="text-amber-500" />
                      <span>Reception & Front-Desk</span>
                    </button>
                  </div>
                )}
              </div>
            )
          )}
          {/* Guest/Not-Logged-In Banner */}
          {!isCollapsed && !user && (
            <div
              className="flex items-center gap-2.5 p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/50 cursor-pointer hover:bg-blue-100 transition-all"
              onClick={() => { navigate('/login'); setIsOpen(false); }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-slate-300 shrink-0" />
              <div className="truncate">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Not Signed In</p>
                <p className="text-xs font-bold text-blue-700 dark:text-blue-300">Click to Sign In / Register</p>
              </div>
            </div>
          )}
        </div>

        {/* Middle Navigation Section */}
        <div className="flex-1 overflow-y-auto overscroll-contain touch-pan-y px-3 lg:px-4 py-4 space-y-1.5 hide-scrollbar">
          <div className="px-3 pb-1">
            {!isCollapsed && (
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Clinical Menu
              </span>
            )}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`
                  group flex items-center gap-3.5 px-3.5 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 relative
                  ${isActive 
                    ? 'bg-linear-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25 font-bold' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'}
                  ${isCollapsed ? 'justify-center px-0' : ''}
                `}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon size={20} className={`shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                
                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between overflow-hidden">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}

                {isActive && (
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-white rounded-l-full hidden lg:block" />
                )}
              </NavLink>
            );
          })}

          {/* Quick Action Feature Buttons */}
          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 px-1 space-y-2">
            {!isCollapsed && (
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block px-2 pb-1">
                Medical Tools
              </span>
            )}

            {/* Health Passport QR Trigger */}
            <button
              onClick={() => setShowPassport(true)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer
                bg-linear-to-r from-amber-500/10 to-orange-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 hover:border-amber-500/40 hover:scale-[1.02]
                ${isCollapsed ? 'justify-center' : ''}
              `}
              title="Health Passport & QR ID"
            >
              <QrCode size={18} className="text-amber-500 shrink-0" />
              {!isCollapsed && <span className="truncate">Digital Health Passport</span>}
            </button>

            {/* Facility Hub Switcher Trigger */}
            <button
              onClick={() => toggleFacilityMode()}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer
                ${isPharmacyMode 
                  ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 hover:border-blue-500/40' 
                  : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 hover:border-emerald-500/40'}
                hover:scale-[1.02]
                ${isCollapsed ? 'justify-center' : ''}
              `}
              title={isPharmacyMode ? 'Switch to MediCare Clinic' : 'Switch to Your Health Pharmacy'}
            >
              <Pill size={18} className={`${isPharmacyMode ? 'text-blue-500' : 'text-emerald-500'} shrink-0`} />
              {!isCollapsed && (
                <span className="truncate">
                  {isPharmacyMode ? 'Clinic Services Mode' : 'Pharmacy Dispensary'}
                </span>
              )}
            </button>

            {/* Install App Trigger */}
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent('open-install-modal'));
                if (window.innerWidth < 1024) setIsOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer mt-2
                bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60
                hover:scale-[1.02]
                ${isCollapsed ? 'justify-center' : ''}
              `}
              title="Install MedClinic on your mobile device or computer"
            >
              <Smartphone size={17} className="text-emerald-500 shrink-0" />
              {!isCollapsed && (
                <span className="truncate flex items-center justify-between w-full">
                  <span>Install Mobile App</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded-md font-black uppercase">PWA</span>
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Bottom User Card & Theme Switcher */}
        <div className="p-3 lg:p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className={`flex items-center ${isCollapsed ? 'justify-center flex-col gap-3' : 'justify-between gap-3'}`}>
            {user ? (
              <div className="flex items-center gap-3 overflow-hidden cursor-pointer" onClick={() => navigate('/settings')}>
                <div className="w-10 h-10 rounded-2xl overflow-hidden bg-linear-to-br from-emerald-600 to-teal-600 text-white font-bold flex items-center justify-center text-sm shadow-md shrink-0 ring-2 ring-emerald-500/20">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user.initials || user.name?.charAt(0) || '?'
                  )}
                </div>
                {!isCollapsed && (
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                      {user.name}
                    </p>
                    <p className="text-[11px] text-slate-400 capitalize truncate">
                      {user.title || role}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div
                className="flex items-center gap-3 overflow-hidden cursor-pointer"
                onClick={() => { navigate('/login'); setIsOpen(false); }}
              >
                <div className="w-10 h-10 rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-500 font-bold flex items-center justify-center text-sm shadow-md shrink-0">
                  ??
                </div>
                {!isCollapsed && (
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">Guest Visitor</p>
                    <p className="text-[11px] text-blue-500 font-semibold truncate">Sign in to your account →</p>
                  </div>
                )}
              </div>
            )}

            <div className={`flex items-center gap-1 ${isCollapsed ? 'flex-col mt-1' : ''}`}>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-xl text-slate-500 hover:text-amber-500 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} />}
              </button>
              {user && (
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut size={17} />
                </button>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Health Passport QR Modal */}
      {showPassport && (
        <HealthPassportModal isOpen={showPassport} onClose={() => setShowPassport(false)} />
      )}
    </>
  );
}
