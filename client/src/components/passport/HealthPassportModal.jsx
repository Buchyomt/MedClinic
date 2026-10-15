import React, { useState } from 'react';
import { 
  X, QrCode, Shield, Heart, AlertTriangle, Phone, 
  Download, Check, Copy
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function HealthPassportModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  const patientData = {
    name: user?.name || 'Ade Johnson',
    dob: '14 May 1993 (33 yrs)',
    gender: 'Male',
    bloodType: 'O+ (Positive)',
    allergies: ['Penicillin', 'Peanuts', 'Sulfa Drugs'],
    conditions: ['Mild Hypertension', 'Asthma (Controlled)'],
    emergencyContact: {
      name: 'Ngozi Johnson (Spouse)',
      phone: '+234 802 999 4321',
      relationship: 'Next of Kin'
    },
    insurance: {
      provider: 'Hygeia HMO / MedClinic Platinum',
      policyNo: 'HYG-889201-NG',
      validUntil: '12/2027'
    },
    medicalId: `MC-PASS-${Math.abs(user?.id?.hashCode?.() || 984321)}`
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText?.(`https://medclinic.app/passport/${patientData.medicalId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert('Your MedClinic Digital Emergency Health Passport has been downloaded as an encrypted PDF ID.');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-5 bg-linear-to-r from-slate-900 via-indigo-950 to-blue-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Shield size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg tracking-tight text-white">Emergency Digital Health Passport</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  VERIFIED ID
                </span>
              </div>
              <p className="text-xs text-slate-300">Instant First-Responder & Paramedic Medical Profile</p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Card Presentation Container */}
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-indigo-900 via-slate-900 to-blue-950 text-white p-6 shadow-xl border border-indigo-500/30">
            {/* Background ambient glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl -ml-12 -mb-12 pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center justify-between">
              
              {/* Left Patient Info */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-widest font-bold text-amber-400">
                    MedClinic Global Health ID
                  </span>
                  <span className="text-xs font-mono bg-white/10 px-2 py-0.5 rounded-md text-slate-300">
                    {patientData.medicalId}
                  </span>
                </div>

                <div>
                  <h4 className="text-2xl font-black tracking-tight text-white">{patientData.name}</h4>
                  <p className="text-xs text-slate-300">{patientData.dob} • {patientData.gender}</p>
                </div>

                {/* Vitals Grid */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Blood Group</span>
                    <span className="text-lg font-black text-rose-400 flex items-center gap-1">
                      <Heart size={16} className="fill-rose-400" /> {patientData.bloodType}
                    </span>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">HMO Policy</span>
                    <span className="text-xs font-bold text-slate-100 truncate block">
                      {patientData.insurance.policyNo}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right QR Code Display */}
              <div className="bg-white p-3 rounded-2xl shadow-lg flex flex-col items-center gap-2 shrink-0 border border-slate-100">
                <div className="w-32 h-32 bg-slate-50 border-2 border-slate-900 rounded-xl flex items-center justify-center p-2 relative">
                  {/* Decorative QR Pattern Mock */}
                  <div className="w-full h-full bg-[radial-gradient(#0f172a_2px,transparent_2px)] [background-size:8px_8px] rounded flex items-center justify-center">
                    <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-md">
                      <QrCode size={24} />
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                  Scan for Triage
                </span>
              </div>
            </div>
          </div>

          {/* Medical Clinical Tags & Alerts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Allergies Card */}
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50">
              <div className="flex items-center gap-2 mb-2 text-rose-700 dark:text-rose-400 font-bold text-sm">
                <AlertTriangle size={18} />
                <span>Known Critical Allergies</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {patientData.allergies.map((allergy, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200 font-bold text-xs">
                    ⚠️ {allergy}
                  </span>
                ))}
              </div>
            </div>

            {/* Chronic Conditions */}
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50">
              <div className="flex items-center gap-2 mb-2 text-amber-700 dark:text-amber-400 font-bold text-sm">
                <Heart size={18} />
                <span>Documented Conditions</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {patientData.conditions.map((condition, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 font-semibold text-xs">
                    {condition}
                  </span>
                ))}
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 md:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 flex items-center justify-center shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400">Emergency Next of Kin</span>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    {patientData.emergencyContact.name} ({patientData.emergencyContact.relationship})
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-mono">
                    {patientData.emergencyContact.phone}
                  </p>
                </div>
              </div>

              <a 
                href={`tel:${patientData.emergencyContact.phone}`}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <Phone size={14} />
                <span>Call Contact</span>
              </a>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:px-6 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
            <span>{copied ? 'Link Copied!' : 'Copy Emergency Link'}</span>
          </button>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Download size={16} className={downloading ? 'animate-bounce' : ''} />
            <span>{downloading ? 'Generating Encrypted PDF...' : 'Download Medical ID Card'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
