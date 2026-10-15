import React, { useEffect, useState } from 'react'
import { X, Bell, Mail, MessageSquare, Video, FileText, Check } from 'lucide-react'

export default function NotificationSettingsModal({ initialSettings, onSave, onClose }) {
  const [settings, setSettings] = useState(initialSettings || {
    master: true,
    emailAlerts: true,
    smsReminders: true,
    telemedAlerts: true,
    dailyDigest: false
  })

  const toggleKey = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(settings)
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl border border-gray-100 dark:border-slate-700 relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-4 mb-6 border-b border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-950/40 text-orange-500 flex items-center justify-center">
              <Bell size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Notification Preferences</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400">Manage alerts and reminder options</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-500 dark:text-slate-300 flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Master Switch */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30">
            <div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">Master Notifications</h4>
              <p className="text-xs text-gray-500 dark:text-slate-400">Enable or disable all app alerts</p>
            </div>
            <button
              type="button"
              onClick={() => toggleKey('master')}
              className={`w-12 h-6 rounded-full transition-colors relative ${settings.master ? 'bg-orange-500' : 'bg-gray-300 dark:bg-slate-600'}`}
            >
              <div className={`absolute top-1 bottom-1 w-4 bg-white rounded-full transition-all ${settings.master ? 'right-1' : 'left-1'}`}></div>
            </button>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-gray-400" />
                <div>
                  <span className="text-sm font-semibold text-gray-800 dark:text-slate-200 block">Email Confirmations</span>
                  <span className="text-xs text-gray-400">Send receipt to patients upon booking</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.master && settings.emailAlerts}
                disabled={!settings.master}
                onChange={() => toggleKey('emailAlerts')}
                className="w-5 h-5 accent-orange-500 rounded cursor-pointer disabled:opacity-50"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
              <div className="flex items-center gap-3">
                <MessageSquare size={18} className="text-gray-400" />
                <div>
                  <span className="text-sm font-semibold text-gray-800 dark:text-slate-200 block">SMS & WhatsApp Reminders</span>
                  <span className="text-xs text-gray-400">Automated 24-hour appointment alerts</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.master && settings.smsReminders}
                disabled={!settings.master}
                onChange={() => toggleKey('smsReminders')}
                className="w-5 h-5 accent-orange-500 rounded cursor-pointer disabled:opacity-50"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
              <div className="flex items-center gap-3">
                <Video size={18} className="text-gray-400" />
                <div>
                  <span className="text-sm font-semibold text-gray-800 dark:text-slate-200 block">Telemedicine Video Alerts</span>
                  <span className="text-xs text-gray-400">Notify when doctor starts virtual room</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.master && settings.telemedAlerts}
                disabled={!settings.master}
                onChange={() => toggleKey('telemedAlerts')}
                className="w-5 h-5 accent-orange-500 rounded cursor-pointer disabled:opacity-50"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
              <div className="flex items-center gap-3">
                <FileText size={18} className="text-gray-400" />
                <div>
                  <span className="text-sm font-semibold text-gray-800 dark:text-slate-200 block">Daily Reception Summary</span>
                  <span className="text-xs text-gray-400">Morning digest of total appointments</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.master && settings.dailyDigest}
                disabled={!settings.master}
                onChange={() => toggleKey('dailyDigest')}
                className="w-5 h-5 accent-orange-500 rounded cursor-pointer disabled:opacity-50"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-slate-300 font-bold text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <Check size={18} />
              Save Preferences
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}

