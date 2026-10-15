import React, { useEffect, useState } from 'react'
import { X, Shield, KeyRound, Smartphone, CheckCircle2, Laptop } from 'lucide-react'

export default function SecuritySettingsModal({ onClose, onShowToast }) {
  const [twoFactor, setTwoFactor] = useState(false)
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' })
  const [passError, setPassError] = useState('')
  const [passSuccess, setPassSuccess] = useState('')

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    setPassError('')
    setPassSuccess('')

    if (!passwords.current) {
      setPassError('Please enter your current password.')
      return
    }
    if (passwords.next.length < 6) {
      setPassError('New password must be at least 6 characters.')
      return
    }
    if (passwords.next !== passwords.confirm) {
      setPassError('New passwords do not match.')
      return
    }

    setPassSuccess('Password updated successfully!')
    setPasswords({ current: '', next: '', confirm: '' })
    if (onShowToast) onShowToast('Password changed successfully!')
  }

  const toggle2FA = () => {
    const nextState = !twoFactor
    setTwoFactor(nextState)
    if (onShowToast) {
      onShowToast(nextState ? '2FA Protection Enabled' : '2FA Protection Disabled')
    }
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
            <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-950/40 text-green-600 flex items-center justify-center">
              <Shield size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Security & Privacy</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400">Password, 2FA, and active sessions</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-500 dark:text-slate-300 flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* 2FA Card */}
        <div className="mb-6 p-4 rounded-2xl bg-green-50/60 dark:bg-green-950/20 border border-green-100 dark:border-green-900/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Smartphone size={22} className="text-green-600 dark:text-green-400" />
            <div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                2-Factor Authentication
                {twoFactor && (
                  <span className="text-[10px] bg-green-600 text-white px-2 py-0.5 rounded-full font-bold">ACTIVE</span>
                )}
              </h4>
              <p className="text-xs text-gray-500 dark:text-slate-400">Secure staff sign-ins with SMS code</p>
            </div>
          </div>
          <button
            onClick={toggle2FA}
            className={`w-12 h-6 rounded-full transition-colors relative ${twoFactor ? 'bg-green-600' : 'bg-gray-300 dark:bg-slate-600'}`}
          >
            <div className={`absolute top-1 bottom-1 w-4 bg-white rounded-full transition-all ${twoFactor ? 'right-1' : 'left-1'}`}></div>
          </button>
        </div>

        {/* Password Change Form */}
        <form onSubmit={handlePasswordSubmit} className="space-y-4 mb-6">
          <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <KeyRound size={16} className="text-primary" />
            Change Staff Password
          </h4>

          {passError && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold">
              {passError}
            </div>
          )}

          {passSuccess && (
            <div className="p-3 bg-green-50 text-green-700 rounded-xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 size={16} />
              {passSuccess}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Current Password</label>
            <input
              type="password"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">New Password</label>
              <input
                type="password"
                value={passwords.next}
                onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Confirm New Password</label>
              <input
                type="password"
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-700 text-white font-bold text-xs hover:bg-slate-800 transition-colors shadow-sm"
          >
            Update Password
          </button>
        </form>

        {/* Active Sessions */}
        <div className="pt-4 border-t border-gray-100 dark:border-slate-700">
          <h4 className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-3">Active Login Sessions</h4>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
              <div className="flex items-center gap-3">
                <Laptop size={18} className="text-primary" />
                <div>
                  <span className="font-bold text-gray-800 dark:text-slate-200 block">Chrome on Windows (Current)</span>
                  <span className="text-gray-400 text-[11px]">IP: 192.168.1.45 • Active Now</span>
                </div>
              </div>
              <span className="text-[10px] bg-blue-100 text-primary px-2 py-0.5 rounded-full font-bold">THIS DEVICE</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
              <div className="flex items-center gap-3">
                <Smartphone size={18} className="text-gray-400" />
                <div>
                  <span className="font-bold text-gray-800 dark:text-slate-200 block">Safari on iPhone 15</span>
                  <span className="text-gray-400 text-[11px]">IP: 10.0.0.12 • 2 hours ago</span>
                </div>
              </div>
              <button 
                onClick={() => onShowToast && onShowToast('Logged out session on Safari')}
                className="text-red-600 font-bold hover:underline"
              >
                Revoke
              </button>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="pt-6">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-xl border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-slate-300 font-bold text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  )
}

