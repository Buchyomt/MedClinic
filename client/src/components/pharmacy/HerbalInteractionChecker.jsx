import React, { useState } from 'react';
import { AlertOctagon, AlertTriangle, CheckCircle, Sparkles, Activity, ShieldAlert } from 'lucide-react';

const ORTHODOX_DRUGS = [
  { id: 'amlodipine', name: 'Amlodipine / Norvasc (10mg)', category: 'Blood Pressure / Hypertension' },
  { id: 'metformin', name: 'Metformin / Glucophage (500mg/1000mg)', category: 'Diabetes / Blood Glucose' },
  { id: 'lisinopril', name: 'Lisinopril / Zestril (10mg)', category: 'ACE Inhibitor / BP & Heart' },
  { id: 'coartem', name: 'Artemether-Lumefantrine (Coartem)', category: 'Antimalarial Therapy' },
  { id: 'warfarin', name: 'Warfarin / Anticoagulants', category: 'Blood Thinner / Clot Prevention' },
  { id: 'paracetamol', name: 'Paracetamol / NSAIDs (Ibuprofen/Diclofenac)', category: 'Pain & Inflammation' }
];

const HERBAL_REMEDIES = [
  { id: 'agbo_jedi', name: 'Agbo Jedi / Bitter Tonic Herbal Concoctions', type: 'Herbal Mixture' },
  { id: 'dongoyaro', name: 'Dongoyaro / Neem Leaf Boiled Water (Dogonyaro)', type: 'Traditional Antimalarial' },
  { id: 'bitter_leaf', name: 'Bitter Leaf Fresh Squeeze (Ofe Onugbu Extract)', type: 'Herbal Extract' },
  { id: 'garlic_ginger', name: 'Concentrated Raw Garlic & Ginger Shots', type: 'Dietary Concoction' },
  { id: 'moringa', name: 'Moringa Leaf Powder / Tea', type: 'Herbal Supplement' }
];

const INTERACTION_RULES = {
  'amlodipine-agbo_jedi': {
    severity: 'high',
    title: 'Severe Hypotensive Shock & Renal Overload Risk',
    details: 'Agbo Jedi concoctions frequently contain unstandardized diuretic plant roots and alcohol bases. When combined with Amlodipine, this can cause a precipitate collapse in blood pressure (dizziness, fainting) and excessive strain on the kidneys.',
    recommendation: 'Discontinue Agbo while on Amlodipine. Schedule a clinical consultation with Pharm. Chinedu for safe blood pressure monitoring.'
  },
  'metformin-bitter_leaf': {
    severity: 'high',
    title: 'Severe Hypoglycemia (Dangerous Low Blood Sugar) Risk',
    details: 'Fresh Bitter leaf extract (Vernonia amygdalina) possesses potent insulin-mimetic properties. Combining it with high-dose Metformin can push blood glucose dangerously below 70 mg/dL, causing hypoglycemic fainting, seizures, or coma.',
    recommendation: 'Do NOT consume concentrated bitter leaf juice within 6 hours of Metformin. Monitor glucose using a digital glucometer daily.'
  },
  'warfarin-garlic_ginger': {
    severity: 'high',
    title: 'Critical Hemorrhage & Internal Bleeding Risk',
    details: 'High-dose raw garlic and ginger contain natural antiplatelet compounds (allicin and gingerols). Co-administration with Warfarin inhibits platelet aggregation synergistically, resulting in severe spontaneous bleeding or gastrointestinal hemorrhage.',
    recommendation: 'Strictly avoid therapeutic ginger/garlic extracts. Report any unusual bruising or bleeding to Pharm. Chinedu immediately.'
  },
  'coartem-dongoyaro': {
    severity: 'medium',
    title: 'Reduced Antimalarial Efficacy & Liver Enzyme Conflict',
    details: 'Boiled Dongoyaro (Neem) alters hepatic Cytochrome P450 3A4 enzymes, which metabolize Lumefantrine. This can lead to sub-therapeutic antimalarial blood levels, resulting in treatment failure or parasite resistance.',
    recommendation: 'Rely solely on WHO-certified Artemether-Lumefantrine for acute malaria. Finish the full 3-day course without neem additives.'
  },
  'lisinopril-moringa': {
    severity: 'medium',
    title: 'Hyperkalemia (Elevated Potassium) Warning',
    details: 'Lisinopril retains potassium in the bloodstream. Moringa leaves are exceptionally high in bioavailable potassium. Combining both can elevate serum potassium levels, triggering cardiac arrhythmias.',
    recommendation: 'Limit daily moringa intake and request an electrolyte panel check at Your Health Pharmacy Onitsha.'
  },
  'paracetamol-agbo_jedi': {
    severity: 'high',
    title: 'Acute Hepatotoxicity (Liver Toxicity Risk)',
    details: 'Both heavy paracetamol consumption and alcohol-steeped herbal root mixtures are metabolized through glutathione pathways in the liver. Simultaneous intake greatly increases toxic metabolite NAPQI accumulation.',
    recommendation: 'Never mix orthodox painkillers with alcohol-based herbal bitters.'
  }
};

export default function HerbalInteractionChecker() {
  const [selectedDrug, setSelectedDrug] = useState('amlodipine');
  const [selectedHerb, setSelectedHerb] = useState('agbo_jedi');

  const interactionKey = `${selectedDrug}-${selectedHerb}`;
  const interaction = INTERACTION_RULES[interactionKey] || {
    severity: 'low',
    title: 'No Severe Known Direct Contraindication',
    details: 'While no catastrophic acute interaction is indexed between this specific pair, herbal preparations vary greatly in purity and batch strength.',
    recommendation: 'Space consumption by at least 3-4 hours and consult Pharm. Chinedu Nwankwo if you experience any unusual symptoms.'
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
      
      {/* Header */}
      <div className="space-y-1 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-extrabold border border-amber-200 dark:border-amber-800">
          <ShieldAlert size={14} />
          <span>Clinical Safety Engine • Nigerian Herbal & Orthodox Medicine Audit</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          Drug vs. Herbal & Agbo Interaction Checker
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
          Taking orthodox prescriptions with local herbal remedies (Agbo, Bitter leaf, Dongoyaro) can trigger acute kidney or liver complications. Check your combination instantly.
        </p>
      </div>

      {/* Selectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Orthodox Drug Selector */}
        <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-slate-800/60 border border-blue-100 dark:border-slate-700 space-y-2">
          <label className="text-xs font-extrabold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
            <Activity size={15} />
            <span>1. Select Prescribed Orthodox Medication:</span>
          </label>
          <select
            value={selectedDrug}
            onChange={(e) => setSelectedDrug(e.target.value)}
            className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-slate-600 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            {ORTHODOX_DRUGS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} — ({d.category})
              </option>
            ))}
          </select>
        </div>

        {/* Herbal Selector */}
        <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-slate-800/60 border border-amber-100 dark:border-slate-700 space-y-2">
          <label className="text-xs font-extrabold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
            <Sparkles size={15} />
            <span>2. Select Herbal Preparation / Concoction:</span>
          </label>
          <select
            value={selectedHerb}
            onChange={(e) => setSelectedHerb(e.target.value)}
            className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-slate-600 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
          >
            {HERBAL_REMEDIES.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name} — ({h.type})
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Result Card */}
      <div 
        className={`p-6 rounded-3xl border-2 text-left space-y-3 transition-all ${
          interaction.severity === 'high'
            ? 'bg-red-50/80 dark:bg-red-950/30 border-red-400 dark:border-red-800'
            : interaction.severity === 'medium'
            ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-400 dark:border-amber-800'
            : 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-400 dark:border-emerald-800'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-black/10 dark:border-white/10">
          <div className="flex items-center gap-2">
            {interaction.severity === 'high' ? (
              <AlertOctagon size={24} className="text-red-600 shrink-0 animate-bounce" />
            ) : interaction.severity === 'medium' ? (
              <AlertTriangle size={24} className="text-amber-600 shrink-0" />
            ) : (
              <CheckCircle size={24} className="text-emerald-600 shrink-0" />
            )}
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              {interaction.title}
            </h3>
          </div>

          <span 
            className={`text-[11px] font-black uppercase px-3 py-1 rounded-full self-start sm:self-auto ${
              interaction.severity === 'high'
                ? 'bg-red-600 text-white shadow-sm'
                : interaction.severity === 'medium'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-emerald-600 text-white shadow-sm'
            }`}
          >
            {interaction.severity === 'high' ? 'High Risk Interaction' : interaction.severity === 'medium' ? 'Moderate Risk Caution' : 'Low Known Risk'}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {interaction.details}
        </p>

        <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-black/5 dark:border-white/10 text-xs space-y-1">
          <strong className="text-emerald-700 dark:text-emerald-400 block uppercase tracking-wider text-[10px] font-black">
            Pharm. Chinedu Nwankwo's Clinical Directive:
          </strong>
          <p className="text-slate-800 dark:text-slate-200 font-semibold leading-relaxed">
            {interaction.recommendation}
          </p>
        </div>
      </div>

    </div>
  );
}
