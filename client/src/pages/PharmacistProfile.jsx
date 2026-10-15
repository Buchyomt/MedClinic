import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, ShieldCheck, Clock, 
  Calendar, Star, MapPin, Phone, CheckCircle2, ArrowRight, 
  Sparkles, MessageCircle, Truck, Globe, Edit3, X, Save, Lock,
  Pill, Receipt
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFacility } from '../context/FacilityContext';
import { useBooking } from '../context/BookingContext';
import AuthenticityVerifier from '../components/pharmacy/AuthenticityVerifier';
import OnitshaPrescriptionOrder from '../components/pharmacy/OnitshaPrescriptionOrder';
import DiasporaSponsorship from '../components/pharmacy/DiasporaSponsorship';
import MedicineFinder from '../components/pharmacy/MedicineFinder';
import PrintableReceiptModal from '../components/pharmacy/PrintableReceiptModal';
import FacilityLocationCard from '../components/pharmacy/FacilityLocationCard';

export default function PharmacistProfile() {
  const navigate = useNavigate();
  const { role } = useAuth();
  const { pharmacyProfile, updateServiceFee } = useFacility();
  const { setSelectedDoctor, setSelectedService } = useBooking();

  const isPharmacistAdmin = role === 'pharmacist';

  const [activeTab, setActiveTab] = useState('services'); // 'services' | 'inventory' | 'verifier' | 'herbal' | 'delivery' | 'diaspora' | 'cases'
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [tempFeeValue, setTempFeeValue] = useState('');
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  const profile = pharmacyProfile;

  const treatedCases = [
    {
      patient: 'Chief Emeka O. (Age 62)',
      location: 'GRA Federal Housing, Onitsha',
      condition: 'Severe Hypertension & Type 2 Diabetes Multi-drug Conflict',
      outcome: 'Identified an adverse interaction between two prescribed blood pressure medications and timing conflict with metformin. Adjusted schedule and coordinated with physician; blood pressure stabilized at 124/82 within 14 days.',
      date: 'August 2026',
      rating: 5
    },
    {
      patient: 'Mrs. Amaka N. (Mother of 2)',
      location: 'Fegge Housing Estate, Onitsha',
      condition: 'Chronic Adult Asthma & Inhaler Technique Failure',
      outcome: 'Conducted a 1-on-1 medication therapy session on spacer technique and proper corticosteroid timing. Reduced acute attacks from 4 times/month to 0 in 90 days.',
      date: 'July 2026',
      rating: 5
    },
    {
      patient: 'Mr. Chidi K. (Age 45)',
      location: '3-3 Area / Nkwelle Ezunaka, Onitsha',
      condition: 'Post-Surgery Pain & Antibiotic Adherence Plan',
      outcome: 'Created a customized digital dosage reminder chart and organized same-day delivery of prescribed post-op medication. Patient reported zero complications and full recovery.',
      date: 'June 2026',
      rating: 5
    }
  ];

  const handleBookService = (service) => {
    if (isPharmacistAdmin) {
      navigate('/dashboard');
      return;
    }
    const pharmacistDoctorObject = {
      _id: 'facility-pharmacy-1',
      name: profile.pharmacistName,
      title: profile.pharmacistTitle,
      specialty: 'Clinical Pharmacy & MTM',
      image: profile.pharmacistImage,
      rating: parseFloat(profile.pharmacistRating) || 4.97,
      experience: profile.pharmacistExperience,
      price: service?.fee || profile.consultationFee,
      serviceName: service?.title || 'Clinical Pharmacist Consultation',
      serviceDuration: service?.duration || '30 mins',
      location: profile.address,
      hospital: profile.name,
      about: profile.pharmacistBio
    };

    if (setSelectedDoctor) {
      setSelectedDoctor(pharmacistDoctorObject);
    }
    if (setSelectedService && service) {
      setSelectedService(service);
    }
    navigate('/book');
  };

  const startEditPrice = (service) => {
    if (!isPharmacistAdmin) return;
    setEditingServiceId(service.id);
    setTempFeeValue(service.fee);
  };

  const saveEditedPrice = (serviceId) => {
    if (!isPharmacistAdmin) return;
    if (tempFeeValue.trim()) {
      updateServiceFee(serviceId, tempFeeValue.trim());
    }
    setEditingServiceId(null);
  };

  return (
    <div className="flex-1 flex flex-col gap-6">
      
      {/* Pharmacist Admin Permission Banner */}
      {isPharmacistAdmin ? (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              <strong>Pharmacist Admin Privileges Active:</strong> You are authorized as Pharm. Chinedu Nwankwo to adjust consultation service fees, package rates, and practice data. Updates immediately sync across all patient accounts.
            </span>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-black uppercase whitespace-nowrap shadow-xs">
            Admin Access
          </span>
        </div>
      ) : (
        <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-medium flex items-center gap-2">
          <Lock size={15} className="text-slate-400 shrink-0" />
          <span>
            <strong>Patient & Public View:</strong> You are browsing verified services offered by Pharm. Chinedu Nwankwo at Your Health Pharmacy, Onitsha.
          </span>
        </div>
      )}

      {/* Pharmacist Header Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-emerald-900 via-teal-950 to-slate-950 text-white p-6 sm:p-8 shadow-2xl border border-emerald-500/30">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl -mb-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 lg:gap-8">
          
          {/* Pharmacist Image with Verified PCN Ring */}
          <div className="relative shrink-0">
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden border-4 border-emerald-400/30 shadow-2xl bg-emerald-950">
              <img 
                src={profile.pharmacistImage} 
                alt={profile.pharmacistName} 
                className="w-full h-full object-cover object-top"
                onError={(e) => { e.target.src = '/doctor-1.jpg'; }}
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2.5 rounded-2xl shadow-lg border-2 border-slate-900" title="Verified PCN Pharmacist">
              <ShieldCheck size={22} />
            </div>
          </div>

          {/* Profile Details */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>PCN Certified Lead Pharmacist • Onitsha, Anambra</span>
              </span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                <Star size={12} className="fill-amber-300" /> {profile.pharmacistRating} (480+ Patient Reviews)
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              {profile.pharmacistName}
            </h1>
            
            <p className="text-xs sm:text-sm font-semibold text-emerald-200">
              {profile.pharmacistTitle} &bull; <span className="text-white font-bold">{profile.name}</span>
            </p>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {profile.pharmacistBio}
            </p>

            {/* Location & Contact Bar */}
            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <MapPin size={15} className="text-emerald-400 shrink-0" />
                <span className="truncate max-w-xs">{profile.address}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={15} className="text-emerald-400 shrink-0" />
                <span>{profile.workingHours}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center justify-center md:justify-start gap-3">
              {isPharmacistAdmin ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-6 py-3 rounded-2xl bg-linear-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all cursor-pointer"
                >
                  <ShieldCheck size={16} />
                  <span>Open Command Center & Approvals</span>
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  onClick={() => handleBookService(profile.services?.[0])}
                  className="px-6 py-3 rounded-2xl bg-linear-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/25 hover:shadow-xl transition-all cursor-pointer"
                >
                  <Calendar size={16} />
                  <span>Book Clinical Consultation</span>
                  <ArrowRight size={16} />
                </button>
              )}

              <a
                href={`https://wa.me/2347025051669?text=Hello%20Pharm.%20Chinedu,%20I%20would%20like%20to%20inquire%20about%20a%20clinical%20consultation%20and%20fee%20quote.`}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3 rounded-2xl bg-emerald-600/90 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm border border-emerald-400/40 flex items-center gap-2 transition-all shadow-md"
              >
                <MessageCircle size={15} className="text-emerald-200" />
                <span>WhatsApp Direct Consultation</span>
              </a>

              <a
                href={`tel:${profile.phone}`}
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 flex items-center gap-2 backdrop-blur-md transition-all"
              >
                <Phone size={15} className="text-emerald-300" />
                <span>Direct Call</span>
              </a>

              <button
                type="button"
                onClick={() => setIsReceiptOpen(true)}
                className="px-5 py-3 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-bold text-xs sm:text-sm border border-amber-400/40 flex items-center gap-2 backdrop-blur-md transition-all cursor-pointer"
              >
                <Receipt size={15} className="text-amber-300" />
                <span>Official Stamped Receipt & POS</span>
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Clinical Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">2,000+</p>
          <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mt-1">Patients Counseled</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <p className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">12+ Yrs</p>
          <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mt-1">Clinical Practice</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <p className="text-2xl sm:text-3xl font-black text-amber-500">4.97★</p>
          <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mt-1">Onitsha Rating</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <p className="text-2xl sm:text-3xl font-black text-teal-600 dark:text-teal-400">100%</p>
          <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mt-1">Authentic Drugs Guaranteed</p>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-1 sm:gap-2 overflow-x-auto pb-1">
        
        <button
          onClick={() => setActiveTab('services')}
          className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'services'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <Sparkles size={15} />
          <span>Services & Packages ({profile.services?.length || 6})</span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'inventory'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <Pill size={15} />
          <span>Live Medicine Stock & Prices (12)</span>
        </button>

        <button
          onClick={() => setActiveTab('verifier')}
          className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'verifier'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <ShieldCheck size={15} />
          <span>NAFDAC Drug Verifier</span>
        </button>

        <button
          onClick={() => setActiveTab('delivery')}
          className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'delivery'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <Truck size={15} />
          <span>Onitsha Doorstep Delivery</span>
        </button>

        <button
          onClick={() => setActiveTab('diaspora')}
          className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'diaspora'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <Globe size={15} />
          <span>Sponsor Parent Care</span>
        </button>

        <button
          onClick={() => setActiveTab('cases')}
          className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'cases'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <FileText size={15} />
          <span>Onitsha Clinical Cases ({treatedCases.length})</span>
        </button>

      </div>

      {/* Tab 1: Clinical Services Grid */}
      {activeTab === 'services' && (
        <div className="space-y-4">
          
          <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200">
              <Sparkles size={18} className="text-emerald-600 shrink-0" />
              <span>
                {isPharmacistAdmin ? (
                  <><strong>Pharmacist Fee Control:</strong> Click the edit icon on any card to update fees. Changes reflect immediately on all patient screens.</>
                ) : (
                  <><strong>Verified Clinical Care:</strong> Select any clinical service package to book a direct consultation with Pharm. Chinedu Nwankwo.</>
                )}
              </span>
            </div>

            <a
              href="https://wa.me/2347025051669?text=Hello%20Pharm.%20Chinedu,%20I%20would%20like%20to%20request%20a%20custom%20fee%20quote%20for%20a%20specialized%20medication%20review."
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 font-extrabold whitespace-nowrap self-start sm:self-auto hover:shadow-xs"
            >
              Request Custom Quote on WhatsApp
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profile.services?.map((srv) => (
              <div 
                key={srv.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-xl transition-all flex flex-col justify-between group relative"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {srv.category}
                    </span>

                    {/* Price with Inline Edit Option (Strictly for Pharmacist Admin) */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                        {srv.fee}
                      </span>
                      {isPharmacistAdmin && (
                        <button
                          onClick={() => startEditPrice(srv)}
                          className="p-1 text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer"
                          title="Edit Fee (Pharmacist Only)"
                        >
                          <Edit3 size={13} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Inline Price Editor Form */}
                  {isPharmacistAdmin && editingServiceId === srv.id && (
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2 animate-in fade-in">
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block">
                        Update Pricing Display:
                      </label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={tempFeeValue}
                          onChange={(e) => setTempFeeValue(e.target.value)}
                          placeholder="e.g. ₦12,000 / Session"
                          className="flex-1 px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-xs font-bold text-slate-900 dark:text-white"
                        />
                        <button
                          onClick={() => saveEditedPrice(srv.id)}
                          className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                          title="Save Fee"
                        >
                          <Save size={14} />
                        </button>
                        <button
                          onClick={() => setEditingServiceId(null)}
                          className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer"
                          title="Cancel"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  )}

                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug">
                    {srv.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {srv.desc}
                  </p>

                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 pt-1">
                    <Clock size={14} className="text-emerald-500 shrink-0" />
                    <span>Duration: {srv.duration}</span>
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  {isPharmacistAdmin ? (
                    <button
                      onClick={() => startEditPrice(srv)}
                      className="w-full py-2.5 px-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-extrabold text-xs flex items-center justify-center gap-2 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all shadow-xs cursor-pointer"
                    >
                      <Edit3 size={14} />
                      <span>Manage Service Fee ({srv.fee})</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBookService(srv)}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 font-extrabold text-xs flex items-center justify-center gap-2 group-hover:bg-linear-to-r group-hover:from-emerald-600 group-hover:to-teal-500 group-hover:text-white transition-all shadow-xs cursor-pointer"
                    >
                      <span>Book Service ({srv.fee})</span>
                      <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* Tab: Live Medicine Stock & Prices */}
      {activeTab === 'inventory' && (
        <MedicineFinder />
      )}

      {/* Tab 2: NAFDAC MAS Authenticity Verifier */}
      {activeTab === 'verifier' && <AuthenticityVerifier />}

      {/* Tab 3: Onitsha Doorstep Delivery & WhatsApp Dispatch */}
      {activeTab === 'delivery' && <OnitshaPrescriptionOrder />}

      {/* Tab 5: Sponsor Parent Care from Diaspora */}
      {activeTab === 'diaspora' && <DiasporaSponsorship />}

      {/* Tab 6: Patients Treated & Clinical Cases in Onitsha */}
      {activeTab === 'cases' && (
        <div className="space-y-4">
          <div className="bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 flex items-center gap-3">
            <Sparkles size={20} className="text-emerald-600 shrink-0" />
            <p className="text-xs text-emerald-800 dark:text-emerald-200 font-medium">
              Verified clinical case summaries anonymized for patient confidentiality, documented by Pharm. Chinedu Nwankwo at Your Health Pharmacy, Onitsha.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {treatedCases.map((cs, idx) => (
              <div 
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-slate-400">{cs.date}</span>
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(cs.rating)].map((_, i) => (
                        <Star key={i} size={13} className="fill-amber-400" />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{cs.patient}</h4>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">{cs.location}</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">Clinical Diagnosis / Presentation</span>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{cs.condition}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-emerald-600 dark:text-emerald-400 block">Pharmacist Intervention & Outcome</span>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{cs.outcome}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 size={14} />
                  <span>Successful Therapy Completed</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Onitsha Dispensary Physical Location & Google Maps Card */}
      <FacilityLocationCard />

      {/* Official Printable Stamped Clinical Receipt Modal */}
      <PrintableReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        data={{
          receiptNumber: 'YHP-2026-88421',
          providerName: 'Pharm. Chinedu Nwankwo',
          facility: 'Your Health Pharmacy, Onitsha',
          patientName: 'Chukwuebuka Adeleke',
          patientPhone: '+234 803 555 1234',
          discount: 0
        }}
      />

    </div>
  );
}
