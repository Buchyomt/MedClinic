import { API_BASE_URL } from '../config/api';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, User, UserCheck, Stethoscope, ChevronLeft, AlertCircle, Pill, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import OtpModal from '../components/confirm/OtpModal';
import GoogleAuthButton from '../components/auth/GoogleAuthButton';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('patient');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOtpOpen, setIsOtpOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      // Dispatch real email OTP for sign in security verification
      const otpRes = await fetch(`${API_BASE_URL}/api/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email.trim(), 
          purpose: 'login' 
        })
      });
      const otpData = await otpRes.json();

      if (!otpRes.ok) {
        setLoading(false);
        setError(otpData.message || 'Failed to dispatch verification code to this email.');
        return;
      }

      setLoading(false);
      setIsOtpOpen(true);
    } catch (err) {
      setLoading(false);
      setError('Connection failed. Please ensure the backend server is running.');
    }
  };

  const handleOtpVerified = async () => {
    setIsOtpOpen(false);
    setLoading(true);
    try {
      await login(email, password, role);
      setLoading(false);
      navigate('/dashboard');
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Login failed. Please verify credentials.');
    }
  };

  const handleQuickDemo = async (demoRole) => {
    setError('');
    setLoading(true);
    let demoEmail = 'patient@medclinic.com';
    if (demoRole === 'pharmacist') demoEmail = 'pharmacist@medclinic.com';
    else if (demoRole === 'doctor') demoEmail = 'doctor@medclinic.com';
    else if (demoRole === 'receptionist') demoEmail = 'reception@medclinic.com';

    try {
      await login(demoEmail, 'password123', demoRole);
      setLoading(false);
      navigate('/dashboard');
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Demo login failed');
    }
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900 min-h-screen relative shadow-lg flex flex-col justify-center items-center p-4 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white text-sm font-bold mb-4">
          <ChevronLeft size={20} />
          Back to Home
        </Link>

        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 dark:border-slate-700">
          
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Sign In to MedClinic</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Select your account role to continue</p>
          </div>

          {/* Role selector (Patient, Pharmacist, Doctor, Receptionist) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
            <button
              type="button"
              onClick={() => setRole('patient')}
              className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                role === 'patient' 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-extrabold shadow-xs' 
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
              }`}
            >
              <User size={18} className="mx-auto mb-1 text-blue-500" />
              <span className="text-xs block">Patient</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('pharmacist')}
              className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                role === 'pharmacist' 
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-extrabold shadow-xs' 
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
              }`}
            >
              <Pill size={18} className="mx-auto mb-1 text-emerald-500" />
              <span className="text-xs block">Pharmacist</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('doctor')}
              className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                role === 'doctor' 
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-extrabold shadow-xs' 
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
              }`}
            >
              <Stethoscope size={18} className="mx-auto mb-1 text-purple-500" />
              <span className="text-xs block">Doctor</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('receptionist')}
              className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                role === 'receptionist' 
                  ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 font-extrabold shadow-xs' 
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
              }`}
            >
              <UserCheck size={18} className="mx-auto mb-1 text-amber-500" />
              <span className="text-xs block">Reception</span>
            </button>
          </div>

          {error && (
            <div className="p-3.5 mb-5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 rounded-2xl text-xs font-bold flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle size={17} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === 'pharmacist' ? 'pharmacist@medclinic.com' : `${role}@medclinic.com`}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 dark:text-white text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-11 py-3 rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 dark:text-white text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm transition-all shadow-md disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Verifying Credentials...' : `Log In as ${role.toUpperCase()}`}
            </button>
          </form>

          {/* Social Google Sign-in */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-white dark:bg-slate-800 px-3 text-slate-400 font-extrabold tracking-wider">Or continue with</span>
            </div>
          </div>

          <GoogleAuthButton role={role} text="signin_with" />

          {/* Quick Demos */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-700 text-center">
            <p className="text-xs text-slate-400 mb-3 font-bold uppercase tracking-wider">Instant 1-Click Demo Accounts</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              <button onClick={() => handleQuickDemo('patient')} className="py-2 px-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-xl text-[11px] font-bold cursor-pointer hover:bg-blue-100">Patient</button>
              <button onClick={() => handleQuickDemo('pharmacist')} className="py-2 px-1 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 rounded-xl text-[11px] font-bold cursor-pointer hover:bg-emerald-100">Pharm. Chinedu</button>
              <button onClick={() => handleQuickDemo('doctor')} className="py-2 px-1 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-xl text-[11px] font-bold cursor-pointer hover:bg-purple-100">Doctor</button>
              <button onClick={() => handleQuickDemo('receptionist')} className="py-2 px-1 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-xl text-[11px] font-bold cursor-pointer hover:bg-amber-100">Reception</button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-emerald-600 dark:text-emerald-400 font-extrabold hover:underline">
              Create New Account
            </Link>
          </div>

        </div>
      </div>

      {isOtpOpen && (
        <OtpModal
          email={email}
          purpose="login"
          onVerify={handleOtpVerified}
          onCancel={() => setIsOtpOpen(false)}
        />
      )}
    </div>
  );
}
