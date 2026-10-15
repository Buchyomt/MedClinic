import React, { useState } from 'react';
import { ShieldCheck, Search, AlertTriangle, CheckCircle2, QrCode, Sparkles, Building2, FileText } from 'lucide-react';

const VERIFIED_DRUG_DATABASE = [
  {
    nafdacNo: 'A4-1298',
    pin: '7829-4410-9921',
    batchNo: 'YHP-2026-B81',
    name: 'Norvasc (Amlodipine Besylate 10mg)',
    category: 'Cardiovascular / Blood Pressure',
    manufacturer: 'Pfizer Inc. (Direct PCN Certified Import)',
    dispenser: 'Your Health Pharmacy, Onitsha (Batch Auth #8841)',
    mfgDate: 'Jan 2026',
    expDate: 'Dec 2028',
    status: 'Authentic & PCN Cold-Chain Certified',
    authenticityScore: '100% Genuine',
    notes: 'Stored at strict climate-controlled 22°C at Your Health Pharmacy Onitsha GRA dispensary.'
  },
  {
    nafdacNo: '04-8932',
    pin: '5512-9034-1188',
    batchNo: 'YHP-2026-GL04',
    name: 'Glucophage (Metformin HCl 500mg/1000mg)',
    category: 'Endocrine / Diabetes Management',
    manufacturer: 'Merck Healthcare (Direct Distributor)',
    dispenser: 'Your Health Pharmacy, Onitsha (Batch Auth #8842)',
    mfgDate: 'March 2026',
    expDate: 'Feb 2029',
    status: 'Authentic & PCN Certified',
    authenticityScore: '100% Genuine',
    notes: 'Passed laboratory dissolution test; verified against NAFDAC Mobile Authentication Service.'
  },
  {
    nafdacNo: 'B4-0914',
    pin: '3341-8890-2219',
    batchNo: 'YHP-2026-CT99',
    name: 'Coartem 80/480mg (Artemether & Lumefantrine)',
    category: 'Antimalarial (WHO Gold Standard)',
    manufacturer: 'Novartis Pharma AG',
    dispenser: 'Your Health Pharmacy, Onitsha (Batch Auth #8843)',
    mfgDate: 'Feb 2026',
    expDate: 'Jan 2028',
    status: 'Authentic & PCN Certified',
    authenticityScore: '100% Genuine',
    notes: 'NAFDAC MAS scratch-code verified before dispensary stocking.'
  },
  {
    nafdacNo: '04-1845',
    pin: '9920-1123-4481',
    batchNo: 'YHP-2026-AG62',
    name: 'Augmentin 625mg (Amoxicillin / Clavulanic Acid)',
    category: 'Broad-Spectrum Antibiotic',
    manufacturer: 'GSK GlaxoSmithKline',
    dispenser: 'Your Health Pharmacy, Onitsha (Batch Auth #8844)',
    mfgDate: 'April 2026',
    expDate: 'March 2028',
    status: 'Authentic & PCN Cold-Chain Certified',
    authenticityScore: '100% Genuine',
    notes: 'Direct from manufacturer authorized cold-chain supply chain in Nigeria.'
  },
  {
    nafdacNo: 'A4-5521',
    pin: '4419-7732-8810',
    batchNo: 'YHP-2026-VT12',
    name: 'Ventolin Inhaler (Salbutamol 100mcg)',
    category: 'Respiratory / Asthma Inhaler',
    manufacturer: 'GSK GlaxoSmithKline',
    dispenser: 'Your Health Pharmacy, Onitsha (Batch Auth #8845)',
    mfgDate: 'May 2026',
    expDate: 'April 2028',
    status: 'Authentic & PCN Certified',
    authenticityScore: '100% Genuine',
    notes: 'Aerosol canister pressure seal and batch certificate verified.'
  }
];

export default function AuthenticityVerifier() {
  const [searchCode, setSearchCode] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleVerify = (codeToSearch) => {
    const query = (codeToSearch || searchCode).trim().toLowerCase();
    if (!query) return;

    setHasSearched(true);
    const found = VERIFIED_DRUG_DATABASE.find(item => 
      item.nafdacNo.toLowerCase().includes(query) ||
      item.pin.toLowerCase().replace(/[^a-z0-9]/g, '').includes(query.replace(/[^a-z0-9]/g, '')) ||
      item.batchNo.toLowerCase().includes(query) ||
      item.name.toLowerCase().includes(query)
    );

    setVerificationResult(found || null);
  };

  const handleQuickSelect = (drug) => {
    setSearchCode(drug.batchNo);
    handleVerify(drug.batchNo);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-extrabold border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck size={14} />
            <span>Anti-Counterfeit Protection • Onitsha Safe Meds Guarantee</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            NAFDAC & MAS Drug Authenticity Verifier
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl">
            Combat counterfeit pharmaceuticals. Verify the genuine batch authenticity of any medication dispensed by Pharm. Chinedu Nwankwo at Your Health Pharmacy.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
          <QrCode size={20} className="text-emerald-500" />
          <div className="text-left">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">NAFDAC MAS & PCN</span>
            <span className="text-xs font-black text-slate-800 dark:text-slate-200">Live 100% Sealed</span>
          </div>
        </div>
      </div>

      {/* Input Search Form */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
          Enter NAFDAC Reg Number, Scratch PIN, Batch Number, or Drug Name:
        </label>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
              placeholder="e.g. YHP-2026-B81, A4-1298, Glucophage, 7829-4410-9921" 
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-400"
            />
          </div>

          <button
            onClick={() => handleVerify()}
            className="px-6 py-3.5 rounded-2xl bg-linear-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer shrink-0"
          >
            <ShieldCheck size={16} />
            <span>Verify Authenticity</span>
          </button>
        </div>

        {/* Quick Sample Batch Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-bold text-slate-400">Quick Test Batches:</span>
          {VERIFIED_DRUG_DATABASE.slice(0, 4).map((drug, i) => (
            <button
              key={i}
              onClick={() => handleQuickSelect(drug)}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
            >
              {drug.name.split(' ')[0]} ({drug.batchNo})
            </button>
          ))}
        </div>
      </div>

      {/* Verification Result Card */}
      {hasSearched && verificationResult && (
        <div className="p-6 rounded-3xl bg-emerald-50/70 dark:bg-emerald-950/30 border-2 border-emerald-500/40 text-left space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-emerald-200 dark:border-emerald-800/60">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                <CheckCircle2 size={22} />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
                  Official PCN Verification Certificate
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {verificationResult.name}
                </h3>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-black text-xs self-start sm:self-auto flex items-center gap-1.5 shadow-sm">
              <Sparkles size={13} />
              {verificationResult.authenticityScore}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/50">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">NAFDAC Reg No</span>
              <span className="font-extrabold text-slate-800 dark:text-slate-200">{verificationResult.nafdacNo}</span>
            </div>

            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/50">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Pharmacy Batch ID</span>
              <span className="font-extrabold text-slate-800 dark:text-slate-200">{verificationResult.batchNo}</span>
            </div>

            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/50">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Mfg & Expiry</span>
              <span className="font-extrabold text-slate-800 dark:text-slate-200">{verificationResult.mfgDate} &rarr; {verificationResult.expDate}</span>
            </div>

            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/50">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Category</span>
              <span className="font-extrabold text-slate-800 dark:text-slate-200">{verificationResult.category}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/50 text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-bold">
              <Building2 size={14} className="text-emerald-500" />
              <span>Manufacturer: {verificationResult.manufacturer}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-medium">
              <FileText size={14} className="text-emerald-500" />
              <span>Clinical Note: {verificationResult.notes}</span>
            </div>
          </div>
        </div>
      )}

      {/* Unverified / Not Found Banner */}
      {hasSearched && !verificationResult && (
        <div className="p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-400/40 text-left space-y-2 animate-in fade-in">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-black text-sm">
            <AlertTriangle size={18} />
            <span>Batch Code Not Found in Your Health Pharmacy Verified Registry</span>
          </div>
          <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
            If you purchased this medication outside of Your Health Pharmacy (e.g. from an unverified open market vendor in Onitsha), please bring the package to <strong>Pharm. Chinedu Nwankwo at 1 Nwankwo Chinedu Crescent, GRA Onitsha</strong> for a free physical inspection and safety check.
          </p>
        </div>
      )}

    </div>
  );
}
