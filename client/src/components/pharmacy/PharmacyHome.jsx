import { API_BASE_URL } from '../../config/api';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Pill, HeartPulse, FileText, ShieldCheck, Stethoscope, Clock, 
  Calendar, Star, MapPin, Phone, CheckCircle2, ArrowRight, 
  Sparkles, RefreshCw, AlertCircle, Truck, Globe
} from 'lucide-react';
import { useFacility } from '../../context/FacilityContext';
import { useBooking } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';

export default function PharmacyHome() {
  const navigate = useNavigate();
  const { pharmacyProfile } = useFacility();
  const { setSelectedDoctor, setSelectedService } = useBooking();
  const { role } = useAuth();
  
  const isPharmacist = role === 'pharmacist';
  const [activeTab, setActiveTab] = useState('all');
  const [refillPrescriptionCode, setRefillPrescriptionCode] = useState('');
  const [refillToast, setRefillToast] = useState('');

  // Map icons
  const getServiceIcon = (iconName) => {
    switch (iconName) {
      case 'Pill':
        return <Pill size={22} className="text-emerald-500" />;
      case 'HeartPulse':
        return <HeartPulse size={22} className="text-rose-500" />;
      case 'FileText':
        return <FileText size={22} className="text-blue-500" />;
      case 'ShieldCheck':
        return <ShieldCheck size={22} className="text-indigo-500" />;
      case 'Globe':
        return <Globe size={22} className="text-purple-500" />;
      case 'Sparkles':
        return <Sparkles size={22} className="text-amber-500" />;
      default:
        return <Stethoscope size={22} className="text-teal-500" />;
    }
  };

  const handleBookService = (service) => {
    if (isPharmacist) {
      navigate('/dashboard');
      return;
    }
    const pharmacistDoctorObject = {
      _id: pharmacyProfile.id || 'facility-pharmacy-1',
      name: pharmacyProfile.pharmacistName,
      title: pharmacyProfile.pharmacistTitle,
      specialty: 'Clinical Pharmacy & MTM',
      image: pharmacyProfile.pharmacistImage,
      rating: parseFloat(pharmacyProfile.pharmacistRating) || 4.97,
      experience: pharmacyProfile.pharmacistExperience,
      price: service.fee || pharmacyProfile.consultationFee,
      serviceName: service.title,
      serviceDuration: service.duration,
      location: pharmacyProfile.address,
      hospital: pharmacyProfile.name,
      about: pharmacyProfile.pharmacistBio
    };

    if (setSelectedDoctor) {
      setSelectedDoctor(pharmacistDoctorObject);
    }
    if (setSelectedService) {
      setSelectedService(service);
    }

    navigate('/book');
  };

  const handleRefillSubmit = async (e) => {
    e.preventDefault();
    const code = refillPrescriptionCode.trim().toUpperCase();
    if (!code) return;
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/prescriptions/refill`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rxCode: code, notes: 'Patient requested refill from pharmacy homepage' })
      });
      const data = await res.json();
      setRefillToast(data.message || `Rx #${code} refill requested successfully!`);
    } catch {
      setRefillToast(`Rx #${code} submitted for pharmacy refill review!`);
    }

    setRefillPrescriptionCode('');
    setTimeout(() => setRefillToast(''), 4500);
  };

  const servicesList = pharmacyProfile.services || [];
  const filteredServices = activeTab === 'all' 
    ? servicesList 
    : servicesList.filter(s => s.category?.toLowerCase().includes(activeTab.toLowerCase()) || s.title.toLowerCase().includes(activeTab.toLowerCase()));

  return (
    <div className="space-y-6">
      
      {/* ── Pharmacist Profile & Facility Banner ──────────────────────── */}
      <div className="bg-linear-to-br from-emerald-800 via-teal-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-emerald-500/20">
        <div className="absolute -right-12 -top-12 w-56 h-56 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-16 w-48 h-48 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          
          <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
            <div className="relative shrink-0">
              <img 
                src={pharmacyProfile.pharmacistImage} 
                alt={pharmacyProfile.pharmacistName}
                onError={(e) => { e.target.src = '/doctor-1.jpg'; }}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-3 border-emerald-400/30 shadow-lg"
              />
              <span className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-xl shadow-md" title="PCN Licensed Pharmacist">
                <CheckCircle2 size={16} />
              </span>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold mb-2">
                <Pill size={13} />
                <span>PCN Certified Lead Clinical Pharmacist</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                {pharmacyProfile.pharmacistName}
              </h2>
              <p className="text-emerald-200 text-xs sm:text-sm font-medium mt-0.5 max-w-md">
                {pharmacyProfile.pharmacistTitle} • <span className="text-white">{pharmacyProfile.name}</span>
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-300 font-medium">
                <span className="flex items-center gap-1">
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  <strong className="text-white">{pharmacyProfile.pharmacistRating}</strong> (480+ reviews)
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock size={14} className="text-emerald-400" />
                  {pharmacyProfile.pharmacistExperience}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin size={14} className="text-emerald-400" />
                  GRA, Onitsha, Anambra
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto">
            {isPharmacist ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3.5 bg-linear-to-r from-indigo-500 to-blue-500 text-white font-black rounded-2xl hover:from-indigo-600 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer"
              >
                <ShieldCheck size={16} />
                <span>Command Center & Approvals</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={() => navigate('/pharmacist')}
                className="px-6 py-3.5 bg-linear-to-r from-emerald-500 to-teal-400 text-slate-950 font-black rounded-2xl hover:from-emerald-600 hover:to-teal-500 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer"
              >
                <Calendar size={16} />
                <span>View Full Pharmacist Hub</span>
                <ArrowRight size={16} />
              </button>
            )}
            
            <a 
              href="https://wa.me/2347025051669?text=Hello%20Pharm.%20Chinedu,%20I%20would%20like%20to%20inquire%20about%20a%20medication%20prescription."
              target="_blank"
              rel="noreferrer"
              className="text-center text-[11px] text-emerald-200 hover:text-white font-bold flex items-center justify-center gap-1"
            >
              <Phone size={12} /> WhatsApp: +234 702 505 1669
            </a>
          </div>

        </div>

        {/* Pharmacy Badges */}
        <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {pharmacyProfile.badges.map((badge, idx) => (
            <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-200 bg-white/5 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/10">
              <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
              <span className="truncate">{badge}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Problem-Solving Quick Action Tiles ─────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div 
          onClick={() => navigate('/pharmacist')}
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer space-y-2 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <ShieldCheck size={22} />
          </div>
          <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">NAFDAC MAS Drug Verifier</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
            Verify genuine batch registration codes & anti-counterfeit seals.
          </p>
        </div>

        <div 
          onClick={() => navigate('/pharmacist')}
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer space-y-2 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Pill size={22} />
          </div>
          <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">Clinical MTM Review</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
            Audit polypharmacy, dosage timing & eliminate drug-to-drug conflicts.
          </p>
        </div>

        <div 
          onClick={() => navigate('/pharmacist')}
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all cursor-pointer space-y-2 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Truck size={22} />
          </div>
          <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">Onitsha Doorstep Delivery</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
            Express courier dispatch across GRA, 3-3, Fegge & Awka Road.
          </p>
        </div>

        <div 
          onClick={() => navigate('/pharmacist')}
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer space-y-2 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Globe size={22} />
          </div>
          <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">Diaspora Parent Sponsorship</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
            Fund and track chronic meds & vitals for parents in Onitsha.
          </p>
        </div>

      </div>

      {/* ── Quick Prescription Refill Bar ────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <RefreshCw size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Need an Urgent Prescription Refill in Onitsha?</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Enter Rx Code or medication name to dispatch for immediate dispensing</p>
            </div>
          </div>

          <form onSubmit={handleRefillSubmit} className="flex w-full md:w-auto gap-2">
            <input 
              type="text"
              value={refillPrescriptionCode}
              onChange={(e) => setRefillPrescriptionCode(e.target.value)}
              placeholder="e.g. RX-8942 or Amlodipine 10mg"
              className="flex-1 md:w-64 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shrink-0 shadow-sm cursor-pointer"
            >
              Request Refill
            </button>
          </form>
        </div>

        {refillToast && (
          <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-2 border border-emerald-200/60 animate-in fade-in">
            <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
            <span>{refillToast}</span>
          </div>
        )}
      </div>

      {/* ── Pharmacy Clinical Services ───────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles size={18} className="text-emerald-500" />
              <span>Clinical Services & Medication Care Packages</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              One-on-one clinical consultations and chronic therapy management with Pharm. Chinedu Nwankwo
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full">
            {['all', 'safety', 'preventive', 'diaspora', 'general'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all shrink-0 cursor-pointer ${
                  activeTab === tab 
                    ? 'bg-emerald-600 text-white shadow-sm' 
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-emerald-300'
                }`}
              >
                {tab === 'all' ? 'All Services' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500 transition-all hover:shadow-md flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    {getServiceIcon(service.icon)}
                  </div>
                  
                  <div className="text-right">
                    <span className="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400">
                      {service.fee}
                    </span>
                    <span className="block text-[10px] text-slate-400 font-medium">
                      {service.duration}
                    </span>
                  </div>
                </div>

                <h4 className="text-sm font-black text-slate-900 dark:text-white mb-1.5 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {service.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                  {service.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200/60 dark:border-emerald-800">
                  {service.category}
                </span>

                {isPharmacist ? (
                  <button
                    onClick={() => navigate('/pharmacist')}
                    className="px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-extrabold text-xs hover:bg-indigo-100 transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <span>Manage Tier</span>
                    <ArrowRight size={13} />
                  </button>
                ) : (
                  <button
                    onClick={() => handleBookService(service)}
                    className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-emerald-600 text-white font-extrabold text-xs hover:bg-emerald-600 dark:hover:bg-emerald-500 transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <span>Book Service</span>
                    <ArrowRight size={13} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Working Hours & Pharmacy Location Card ────────────────────── */}
      <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-sm border border-slate-200 dark:border-slate-700">
            <Clock size={18} />
          </div>
          <div>
            <div className="font-extrabold text-slate-900 dark:text-white">Dispensary & Clinical Operating Schedule</div>
            <div className="text-slate-500 dark:text-slate-400">{pharmacyProfile.workingHours}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-semibold">
          <AlertCircle size={15} className="text-emerald-600" />
          <span>Walk-ins at GRA Onitsha & online appointments welcomed</span>
        </div>
      </div>

    </div>
  );
}
