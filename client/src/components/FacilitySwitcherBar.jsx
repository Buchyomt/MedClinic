import React from 'react';
import { Pill, Building2, Sparkles, SlidersHorizontal } from 'lucide-react';
import { useFacility } from '../context/FacilityContext';

export default function FacilitySwitcherBar() {
  const { facilityMode, setFacilityMode } = useFacility();

  return (
    <div className="bg-slate-900 text-white px-4 py-2.5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg border border-slate-800 mb-4 animate-in fade-in">
      <div className="flex items-center gap-2 text-xs">
        <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
          <SlidersHorizontal size={14} />
        </div>
        <span className="font-bold text-slate-300 flex items-center gap-1.5">
          <Sparkles size={13} className="text-amber-400" />
          <span>Demo Pitch Switcher:</span>
        </span>
        <span className="text-slate-400 text-[11px] hidden md:inline">
          Toggle between Solo Pharmacist Practice and Multi-Doctor Clinic
        </span>
      </div>

      <div className="flex bg-slate-800 p-1 rounded-xl w-full sm:w-auto">
        <button
          onClick={() => setFacilityMode('pharmacy')}
          className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            facilityMode === 'pharmacy'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Pill size={14} />
          <span>Pharmacy Mode</span>
        </button>

        <button
          onClick={() => setFacilityMode('clinic')}
          className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            facilityMode === 'clinic'
              ? 'bg-primary text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building2 size={14} />
          <span>Multi-Doctor Clinic</span>
        </button>
      </div>
    </div>
  );
}
