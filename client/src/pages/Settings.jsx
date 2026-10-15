import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, User, Bell, Shield, Moon, LogOut, CheckCircle2, UserCheck } from 'lucide-react'
import { ThemeContext } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import ProfileEditModal from '../components/settings/ProfileEditModal'
import NotificationSettingsModal from '../components/settings/NotificationSettingsModal'
import SecuritySettingsModal from '../components/settings/SecuritySettingsModal'
import DemoRoleModal from '../components/settings/DemoRoleModal'

export default function Settings() {
  const navigate = useNavigate()
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext)
  const { user, role, logout, updateProfile, login, isLoggedIn } = useAuth()

  // Redirect guests to login
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login')
    }
  }, [isLoggedIn, navigate])

  // Profile State derived from auth user
  const profile = user || {
    name: 'Guest User',
    title: 'Not signed in',
    email: '-',
    phone: '-',
    department: '-',
    initials: '??'
  }

  const currentRole = role || 'receptionist'

  // Notification Preferences State
  const [notifSettings, setNotifSettings] = useState(() => {
    const saved = localStorage.getItem('medclinic_notifs')
    return saved ? JSON.parse(saved) : {
      master: true,
      emailAlerts: true,
      smsReminders: true,
      telemedAlerts: true,
      dailyDigest: false
    }
  })

  // Modal States
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false)
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false)
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false)

  // Toast
  const [toastMessage, setToastMessage] = useState('')

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 2500)
  }

  const handleSaveProfile = (updatedProfile) => {
    updateProfile(updatedProfile)
    setIsProfileModalOpen(false)
    showToast('Profile updated successfully!')
  }

  const handleSaveNotifs = (updatedNotifs) => {
    setNotifSettings(updatedNotifs)
    localStorage.setItem('medclinic_notifs', JSON.stringify(updatedNotifs))
    setIsNotifModalOpen(false)
    showToast('Notification settings saved!')
  }

  const handleSelectRole = async (roleId) => {
    const demoEmail = `${roleId === 'receptionist' ? 'reception' : roleId}@medclinic.com`
    await login(demoEmail, 'password123', roleId)
    setIsRoleModalOpen(false)
    showToast(`Switched account to ${roleId.toUpperCase()}`)
  }

  const handleLogout = () => {
    logout()
    showToast('Logged out successfully')
    setTimeout(() => navigate('/login'), 500)
  }

  const getRoleBadge = () => {
    if (currentRole === 'pharmacist') return { label: 'Lead Clinical Pharmacist (Onitsha)', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' }
    if (currentRole === 'doctor') return { label: 'Specialist Doctor', color: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' }
    if (currentRole === 'patient') return { label: 'Patient View', color: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' }
    return { label: 'Reception & Management', color: 'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300' }
  }

  const roleInfo = getRoleBadge()

  return (
    <div className="flex-1 flex flex-col gap-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-5">
          <div className="bg-slate-900 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2 text-sm font-bold border border-slate-700">
            <CheckCircle2 size={18} className="text-green-400" />
            {toastMessage}
          </div>
        </div>
      )}

      {/* Header Info Bar */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-800/80 p-5 rounded-3xl border border-slate-200 dark:border-slate-700">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Account & System Preferences</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Configure notifications, security credentials, and clinical roles</p>
        </div>

        <button
          onClick={() => setIsRoleModalOpen(true)}
          className={`px-3 py-1 rounded-full text-xs font-bold transition-all hover:scale-105 ${roleInfo.color}`}
        >
          {roleInfo.label}
        </button>
      </div>
      
      <div className="space-y-6 flex-1">
        
        {/* Profile Card Header */}
        <div 
          onClick={() => setIsProfileModalOpen(true)}
          className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 mb-6 flex items-center justify-between cursor-pointer hover:border-primary/40 dark:hover:border-primary/50 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center text-primary dark:text-blue-300 text-xl font-bold shadow-inner shrink-0">
              {profile.initials}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{profile.name}</h2>
              <p className="text-sm text-gray-500 dark:text-slate-400">{profile.title}</p>
              <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{profile.email}</p>
            </div>
          </div>
          <div className="text-xs font-bold text-primary bg-blue-50 dark:bg-blue-950/50 px-3 py-1.5 rounded-full">
            Edit Profile
          </div>
        </div>

        {/* Settings Options List */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden mb-6">
          
          {/* Account Profile */}
          <button 
            onClick={() => setIsProfileModalOpen(true)}
            className="w-full px-6 py-4 flex items-center justify-between border-b border-gray-100 dark:border-slate-700/60 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
                <User size={20} className="text-gray-600 dark:text-slate-300" />
              </div>
              <div className="text-left">
                <span className="text-[15px] font-bold text-gray-800 dark:text-slate-100 block">Account Profile for users</span>
                <span className="text-xs text-gray-400 dark:text-slate-400">View & edit staff profile details</span>
              </div>
            </div>
            <ChevronLeft size={20} className="text-gray-400 rotate-180" />
          </button>

          {/* Notifications */}
          <div className="w-full px-6 py-4 flex items-center justify-between border-b border-gray-100 dark:border-slate-700/60 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
            <div 
              onClick={() => setIsNotifModalOpen(true)}
              className="flex items-center gap-4 flex-1 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-950/40 flex items-center justify-center">
                <Bell size={20} className="text-orange-500" />
              </div>
              <div className="text-left">
                <span className="text-[15px] font-bold text-gray-800 dark:text-slate-100 block">Notifications</span>
                <span className="text-xs text-gray-400 dark:text-slate-400">Configure email, SMS & video alerts</span>
              </div>
            </div>
            <button 
              onClick={() => {
                const nextState = !notifSettings.master
                const updated = { ...notifSettings, master: nextState }
                setNotifSettings(updated)
                localStorage.setItem('medclinic_notifs', JSON.stringify(updated))
                showToast(nextState ? 'Notifications enabled' : 'Notifications disabled')
              }}
              className={`w-12 h-6 rounded-full transition-colors relative ${notifSettings.master ? 'bg-primary' : 'bg-gray-300 dark:bg-slate-600'}`}
            >
              <div className={`absolute top-1 bottom-1 w-4 bg-white rounded-full transition-all ${notifSettings.master ? 'right-1' : 'left-1'}`}></div>
            </button>
          </div>

          {/* Security & Privacy */}
          <button 
            onClick={() => setIsSecurityModalOpen(true)}
            className="w-full px-6 py-4 flex items-center justify-between border-b border-gray-100 dark:border-slate-700/60 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-950/40 flex items-center justify-center">
                <Shield size={20} className="text-green-600 dark:text-green-400" />
              </div>
              <div className="text-left">
                <span className="text-[15px] font-bold text-gray-800 dark:text-slate-100 block">Security & Privacy</span>
                <span className="text-xs text-gray-400 dark:text-slate-400">Manage password, 2FA & sessions</span>
              </div>
            </div>
            <ChevronLeft size={20} className="text-gray-400 rotate-180" />
          </button>

          {/* Dark Mode */}
          <div className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
            <div 
              onClick={() => {
                toggleDarkMode()
                showToast(isDarkMode ? 'Light mode enabled' : 'Dark mode enabled')
              }}
              className="flex items-center gap-4 flex-1 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-950/40 flex items-center justify-center">
                <Moon size={20} className="text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-left">
                <span className="text-[15px] font-bold text-gray-800 dark:text-slate-100 block">Dark Mode</span>
                <span className="text-xs text-gray-400 dark:text-slate-400">Toggle dark / light theme</span>
              </div>
            </div>
            <button 
              onClick={() => {
                toggleDarkMode()
                showToast(isDarkMode ? 'Light mode enabled' : 'Dark mode enabled')
              }}
              className={`w-12 h-6 rounded-full transition-colors relative ${isDarkMode ? 'bg-primary' : 'bg-gray-300 dark:bg-slate-600'}`}
            >
              <div className={`absolute top-1 bottom-1 w-4 bg-white rounded-full transition-all ${isDarkMode ? 'right-1' : 'left-1'}`}></div>
            </button>
          </div>

        </div>

        {/* Demo Switch Role Section */}
        <div className="bg-linear-to-r from-blue-500/10 to-indigo-500/10 rounded-3xl p-5 border border-blue-200/50 dark:border-blue-900/30 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserCheck className="text-primary" size={24} />
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Clinic Demo Mode</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400">Switch role view (Patient / Staff / Doctor)</p>
            </div>
          </div>
          <button
            onClick={() => setIsRoleModalOpen(true)}
            className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-primary-dark transition-all shadow-sm"
          >
            Switch Role
          </button>
        </div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="w-full bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors shadow-sm"
        >
          <LogOut size={20} />
          Log Out
        </button>

      </div>

      {/* Modals */}
      {isProfileModalOpen && (
        <ProfileEditModal
          profile={profile}
          onSave={handleSaveProfile}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}

      {isNotifModalOpen && (
        <NotificationSettingsModal
          initialSettings={notifSettings}
          onSave={handleSaveNotifs}
          onClose={() => setIsNotifModalOpen(false)}
        />
      )}

      {isSecurityModalOpen && (
        <SecuritySettingsModal
          onClose={() => setIsSecurityModalOpen(false)}
          onShowToast={showToast}
        />
      )}

      {isRoleModalOpen && (
        <DemoRoleModal
          currentRole={currentRole}
          onSelectRole={handleSelectRole}
          onClose={() => setIsRoleModalOpen(false)}
        />
      )}
    </div>
  )
}
