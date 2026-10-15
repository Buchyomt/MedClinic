import { API_BASE_URL } from '../config/api';
import React, { useState, useEffect } from 'react';
import { ShieldCheck, HeartPulse, Pill, Activity, Edit3, Save, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import DigitalRxModal from '../components/pharmacy/DigitalRxModal';

export default function MedicalRecords() {
  const { user } = useAuth();

  const [healthProfile, setHealthProfile] = useState({
    bloodGroup: 'O+',
    genotype: 'AA',
    allergies: 'Penicillin, Dust',
    conditions: 'None',
    emergencyContact: '+234 802 345 6789 (Spouse)'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedRx, setSelectedRx] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  useEffect(() => {
    if (user?.email) {
      fetch(`${API_BASE_URL}/api/appointments?email=${encodeURIComponent(user.email)}`)
        .then(res => res.json())
        .then(data => setAppointments(Array.isArray(data) ? data : []))
        .catch(err => console.error(err));

      fetch(`${API_BASE_URL}/api/prescriptions?email=${encodeURIComponent(user.email)}`)
        .then(res => res.json())
        .then(data => setPrescriptions(Array.isArray(data) ? data : []))
        .catch(err => console.error(err));
    }
  }, [user]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsEditing(false);
    showToast('Health profile updated successfully!');
  };

  const handleRequestRefill = async (rx) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/prescriptions/refill`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rxCode: rx.rxCode })
      });
      const data = await res.json();
      showToast(data.message || `Refill requested for #${rx.rxCode}!`);
      
      // Update local state
      setPrescriptions(prev => prev.map(p => p.rxCode === rx.rxCode ? { ...p, status: 'Refill Requested' } : p));
    } catch {
      showToast(`Refill requested for #${rx.rxCode}!`);
    }
  };

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

      <div className="p-5 space-y-6">
        {/* Patient Identity Banner */}
        <div className="bg-linear-to-r from-primary via-cyan-600 to-teal-600 rounded-3xl p-6 text-white shadow-xl flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck size={18} className="text-cyan-200" />
              <span className="text-xs font-bold text-cyan-100 uppercase tracking-wider">Verified Patient EHR Profile</span>
            </div>
            <h2 className="text-xl font-bold">{user?.name || 'Patient User'}</h2>
            <p className="text-xs text-cyan-100">{user?.email || 'patient@medclinic.com'} • ID: MC-EHR-8829</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl font-bold">
            {user?.initials || 'P'}
          </div>
        </div>

        {/* Health Profile Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <HeartPulse size={20} className="text-red-500" />
              Core Vitals & Medical Information
            </h3>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs font-bold text-primary dark:text-cyan-400 bg-primary/10 dark:bg-cyan-950/50 px-3 py-1.5 rounded-full flex items-center gap-1 hover:bg-primary/20"
            >
              <Edit3 size={14} />
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Blood Group</label>
                  <input
                    type="text"
                    value={healthProfile.bloodGroup}
                    onChange={(e) => setHealthProfile({ ...healthProfile, bloodGroup: e.target.value })}
                    className="w-full p-2.5 rounded-xl border text-xs dark:bg-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Genotype</label>
                  <input
                    type="text"
                    value={healthProfile.genotype}
                    onChange={(e) => setHealthProfile({ ...healthProfile, genotype: e.target.value })}
                    className="w-full p-2.5 rounded-xl border text-xs dark:bg-slate-700 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Known Allergies</label>
                <input
                  type="text"
                  value={healthProfile.allergies}
                  onChange={(e) => setHealthProfile({ ...healthProfile, allergies: e.target.value })}
                  className="w-full p-2.5 rounded-xl border text-xs dark:bg-slate-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Emergency Contact</label>
                <input
                  type="text"
                  value={healthProfile.emergencyContact}
                  onChange={(e) => setHealthProfile({ ...healthProfile, emergencyContact: e.target.value })}
                  className="w-full p-2.5 rounded-xl border text-xs dark:bg-slate-700 dark:text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-primary text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md"
              >
                <Save size={16} /> Save Changes
              </button>
            </form>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-700/50 rounded-2xl">
                <span className="text-[11px] text-gray-400 block mb-1">Blood Group</span>
                <span className="text-lg font-bold text-red-600 dark:text-red-400">{healthProfile.bloodGroup}</span>
              </div>
              <div className="p-3.5 bg-slate-50 dark:bg-slate-700/50 rounded-2xl">
                <span className="text-[11px] text-gray-400 block mb-1">Genotype</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">{healthProfile.genotype}</span>
              </div>
              <div className="p-3.5 bg-slate-50 dark:bg-slate-700/50 rounded-2xl col-span-2 sm:col-span-2">
                <span className="text-[11px] text-gray-400 block mb-1">Known Allergies</span>
                <span className="text-xs font-bold text-gray-800 dark:text-slate-200">{healthProfile.allergies}</span>
              </div>
            </div>
          )}
        </div>

        {/* e-Prescriptions Vault */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Pill size={20} className="text-emerald-600" />
              Digital e-Prescriptions & Refill Vault ({prescriptions.length})
            </h3>
          </div>

          {prescriptions.length === 0 ? (
            <p className="text-xs text-gray-400">No active digital prescriptions found.</p>
          ) : (
            <div className="space-y-3">
              {prescriptions.map((rx) => (
                <div 
                  key={rx._id || rx.rxCode} 
                  className="p-4 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        rx.status === 'Active' ? 'bg-emerald-600 text-white' :
                        rx.status === 'Refill Requested' ? 'bg-amber-500 text-white animate-pulse' :
                        'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}>
                        {rx.status || 'Active'}
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100/60 dark:bg-emerald-900/40 px-2 py-0.5 rounded-md">
                        {rx.rxCode}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                      {rx.medications && rx.medications.length > 0 ? rx.medications.map(m => m.name).join(', ') : 'Clinical Prescription'}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                      {rx.diagnosis || 'Prescription therapy'} • Issued: {new Date(rx.issueDate || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-1 font-medium">
                      Prescribed by: {rx.prescribedBy || 'Pharm. Michael Obi, B.Pharm, RPh'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {rx.status !== 'Refill Requested' && (
                      <button
                        onClick={() => handleRequestRefill(rx)}
                        className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-2 rounded-xl text-xs shadow-sm transition-colors"
                      >
                        Request Refill
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedRx(rx)}
                      className="flex-1 sm:flex-none bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-600 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                    >
                      View & Print Rx
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Consultation Logs */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Activity size={20} className="text-teal-600" />
            Clinical Consultation Logs ({appointments.length})
          </h3>

          {appointments.length === 0 ? (
            <p className="text-xs text-gray-400">No past clinical logs found.</p>
          ) : (
            <div className="space-y-3">
              {appointments.map(apt => (
                <div key={apt._id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700 flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">{apt.doctorId?.name || 'Specialist'}</h4>
                    <p className="text-[11px] text-gray-500 dark:text-slate-400">{apt.reason || 'General Consultation'} • {apt.date}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    apt.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {apt.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedRx && (
        <DigitalRxModal
          prescription={selectedRx}
          onClose={() => setSelectedRx(null)}
        />
      )}
    </div>
  );
}
