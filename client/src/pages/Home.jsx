import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Video, Activity, QrCode, Sparkles, ShieldCheck
} from 'lucide-react';
import SearchBar from '../components/SearchBar';
import Specializations from '../components/Specializations';
import DoctorList from '../components/DoctorList';
import PharmacyHome from '../components/pharmacy/PharmacyHome';
import BodySymptomPicker from '../components/symptoms/BodySymptomPicker';
import HealthPassportModal from '../components/passport/HealthPassportModal';
import { useAuth } from '../context/AuthContext';
import { useFacility } from '../context/FacilityContext';
import DoctorPortalHome from '../components/doctor/DoctorPortalHome';
import ReceptionPortalHome from '../components/reception/ReceptionPortalHome';

import PharmacistDashboard from '../components/pharmacist/PharmacistDashboard';

export default function Home() {
  const navigate = useNavigate();
  const { role } = useAuth();
  const { isPharmacyMode } = useFacility();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [showPassport, setShowPassport] = useState(false);

  return (
    <div className="flex-1 flex flex-col gap-6">
      {/* Role-Specific Portal Views */}
      {role === 'pharmacist' ? (
        <PharmacistDashboard />
      ) : role === 'doctor' ? (
        <DoctorPortalHome />
      ) : role === 'receptionist' ? (
        <ReceptionPortalHome />
      ) : isPharmacyMode ? (
        <PharmacyHome />
      ) : (
        /* Patient Health Ecosystem View */
        <div className="space-y-7">
          
          {/* Hero Welcome & Quick Feature Action Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-700 via-indigo-700 to-slate-900 text-white p-6 sm:p-8 shadow-2xl border border-blue-500/20">
            {/* Ambient Background Circles */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-purple-500/15 rounded-full blur-3xl -mb-20 pointer-events-none" />

            <div className="relative z-10 max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-200 text-xs font-bold">
                <Sparkles size={14} className="text-amber-300" />
                <span>Next-Gen Smart Clinical Healthcare & Pharmacy Hub</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                Healthcare & Pharmacy Care in Onitsha & Beyond.
              </h2>
              
              <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed max-w-xl">
                Consult with verified medical specialists online, book medication therapy with Pharm. Chinedu Nwankwo, track clinic queues, and order digital prescriptions.
              </p>

              {/* Quick Jump Buttons */}
              <div className="pt-3 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => navigate('/pharmacist')}
                  className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
                >
                  <ShieldCheck size={16} />
                  <span>Pharm. Chinedu Profile (Onitsha)</span>
                </button>

                <button
                  onClick={() => navigate('/telehealth')}
                  className="px-5 py-3 rounded-2xl bg-white hover:bg-blue-50 text-blue-800 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer"
                >
                  <Video size={16} className="text-indigo-600" />
                  <span>Start Virtual Telehealth</span>
                </button>

                <button
                  onClick={() => navigate('/queue')}
                  className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 flex items-center gap-2 backdrop-blur-md transition-all cursor-pointer"
                >
                  <Activity size={16} className="text-emerald-300" />
                  <span>Live Queue Board</span>
                </button>

                <button
                  onClick={() => setShowPassport(true)}
                  className="px-5 py-3 rounded-2xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 font-bold text-xs sm:text-sm border border-amber-400/30 flex items-center gap-2 backdrop-blur-md transition-all cursor-pointer"
                >
                  <QrCode size={16} className="text-amber-300" />
                  <span>Emergency Health QR</span>
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Visual AI Symptom Checker */}
          <BodySymptomPicker />

          {/* Specialty Filters & Search */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Find a Medical Specialist</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Filter by clinical specialty or doctor name</p>
              </div>

              <div className="w-full sm:w-80">
                <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
              </div>
            </div>

            <Specializations selectedSpecialty={selectedSpecialty} setSelectedSpecialty={setSelectedSpecialty} />
          </div>

          {/* Doctors Directory Grid */}
          <div className="space-y-3">
            <DoctorList searchQuery={searchQuery} selectedSpecialty={selectedSpecialty} />
          </div>

        </div>
      )}

      {/* Health Passport QR Modal */}
      {showPassport && (
        <HealthPassportModal isOpen={showPassport} onClose={() => setShowPassport(false)} />
      )}
    </div>
  );
}
