import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, Activity, CheckCircle2, 
  ArrowRight, ChevronRight
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

const BODY_REGIONS = [
  {
    id: 'head',
    name: 'Head & Brain',
    icon: '🧠',
    symptoms: ['Migraine / Severe Headache', 'Dizziness & Vertigo', 'Vision Blurring', 'Sinus Pressure'],
    recommendedSpecialty: 'Neurology',
    specialistName: 'Dr. Michael Chen',
    urgency: 'Moderate',
    urgencyColor: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800',
    advice: 'Stay in a dim quiet room, avoid screen glare, stay hydrated, and monitor blood pressure.'
  },
  {
    id: 'chest',
    name: 'Chest & Heart',
    icon: '🫀',
    symptoms: ['Chest Tightness', 'Heart Palpitations', 'Shortness of Breath', 'Rapid Pulse'],
    recommendedSpecialty: 'Cardiology',
    specialistName: 'Dr. Sarah Jenkins',
    urgency: 'High / Priority',
    urgencyColor: 'text-rose-600 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800',
    advice: 'Sit upright, avoid physical exertion. If pain radiates to your left arm or jaw, seek emergency ER immediately.'
  },
  {
    id: 'abdomen',
    name: 'Abdomen & Gut',
    icon: '🩺',
    symptoms: ['Acid Reflux / Heartburn', 'Sharp Stomach Cramps', 'Bloating & Nausea', 'Persistent Indigestion'],
    recommendedSpecialty: 'Gastroenterology',
    specialistName: 'Dr. Michael Chen',
    urgency: 'Moderate',
    urgencyColor: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800',
    advice: 'Sip warm water, avoid spicy or acidic foods, do not take NSAID painkillers without food.'
  },
  {
    id: 'joints',
    name: 'Bones & Joints',
    icon: '🦴',
    symptoms: ['Lower Back Pain', 'Knee Joint Stiffness', 'Muscle Soreness', 'Sprain / Swelling'],
    recommendedSpecialty: 'Orthopedics',
    specialistName: 'Dr. Sarah Jenkins',
    urgency: 'Low / Standard',
    urgencyColor: 'text-blue-600 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800',
    advice: 'Apply ice for acute swelling or warm compress for stiffness. Rest affected limb.'
  },
  {
    id: 'skin',
    name: 'Skin & Allergy',
    icon: '🌿',
    symptoms: ['Itchy Rash / Hives', 'Dry Flaking Patches', 'Sudden Swelling', 'Acne Flare-up'],
    recommendedSpecialty: 'Dermatology',
    specialistName: 'Dr. Sarah Jenkins',
    urgency: 'Standard',
    urgencyColor: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800',
    advice: 'Avoid scratching, use mild fragrance-free moisturizers, take antihistamine if approved by physician.'
  }
];

export default function BodySymptomPicker() {
  const navigate = useNavigate();
  const { setSelectedDoctor } = useBooking();

  const [selectedRegion, setSelectedRegion] = useState(BODY_REGIONS[1]); // Default Chest & Heart
  const [selectedSymptoms, setSelectedSymptoms] = useState(['Chest Tightness']);

  const handleToggleSymptom = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleSelectRegion = (region) => {
    setSelectedRegion(region);
    setSelectedSymptoms([region.symptoms[0]]);
  };

  const handleProceedBooking = () => {
    if (setSelectedDoctor) {
      setSelectedDoctor({
        _id: 'doc-auto-triage',
        name: selectedRegion.specialistName,
        specialty: selectedRegion.recommendedSpecialty,
        image: '/doctor-1.jpg',
        rating: 4.9,
        price: '₦15,000',
        hospital: 'MediCare Clinical Hospital'
      });
    }
    navigate('/book');
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Sparkles size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white tracking-tight">
                Interactive Clinical AI Symptom Checker
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                AI TRIAGE
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select body area to receive instant triage recommendations & specialist matching
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Body Anatomy Region Selector Pills */}
        <div className="lg:col-span-5 space-y-2.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block px-1">
            1. Select Affected Anatomical Area
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
            {BODY_REGIONS.map((region) => {
              const isSelected = selectedRegion.id === region.id;
              return (
                <button
                  key={region.id}
                  onClick={() => handleSelectRegion(region)}
                  className={`
                    w-full flex items-center justify-between p-3.5 rounded-2xl text-left font-bold text-sm transition-all
                    ${isSelected 
                      ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 scale-[1.01]' 
                      : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{region.icon}</span>
                    <div>
                      <p className="font-extrabold">{region.name}</p>
                      <p className={`text-[11px] font-medium ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                        {region.recommendedSpecialty}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={16} className={`transition-transform ${isSelected ? 'rotate-90 text-white' : 'text-slate-400'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Dynamic Symptoms Checklist & AI Assessment Card */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-5 bg-slate-50/80 dark:bg-slate-800/50 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800">
          
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
              2. Specific Symptoms Experienced ({selectedRegion.name})
            </span>

            {/* Symptoms Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedRegion.symptoms.map((symptom, idx) => {
                const isChecked = selectedSymptoms.includes(symptom);
                return (
                  <button
                    key={idx}
                    onClick={() => handleToggleSymptom(symptom)}
                    className={`
                      px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer
                      ${isChecked 
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-105' 
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-400'}
                    `}
                  >
                    <CheckCircle2 size={14} className={isChecked ? 'text-white' : 'text-slate-300 dark:text-slate-600'} />
                    <span>{symptom}</span>
                  </button>
                );
              })}
            </div>

            {/* AI Triage Card Box */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-750 shadow-sm space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Activity size={18} className="text-blue-500" />
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-200">AI Clinical Triage Rating:</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${selectedRegion.urgencyColor}`}>
                  {selectedRegion.urgency}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong className="text-slate-800 dark:text-white">Guidance:</strong> {selectedRegion.advice}
              </p>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Matched Physician</span>
                  <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400">
                    {selectedRegion.specialistName} ({selectedRegion.recommendedSpecialty})
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                  Rating 4.9★
                </span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleProceedBooking}
            className="w-full py-3.5 px-6 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 transition-all cursor-pointer"
          >
            <span>Book Consultation with {selectedRegion.recommendedSpecialty} Specialist</span>
            <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </div>
  );
}
