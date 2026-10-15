import React, { useState, useMemo } from 'react';
import { 
  Search, Pill, ShieldCheck, ShoppingCart, MessageCircle, 
  AlertCircle, CheckCircle2, Filter, Sparkles, Phone, ArrowUpRight 
} from 'lucide-react';

export const MEDICINE_INVENTORY = [
  {
    id: 'med-1',
    name: 'Coartem 80/480mg (Dispersible)',
    generic: 'Artemether + Lumefantrine',
    category: 'Antimalarial',
    price: 3200,
    inStock: true,
    stockCount: 48,
    prescriptionRequired: false,
    dosage: '1 tablet twice daily for 3 days with food',
    manufacturer: 'Novartis Pharma',
    nafdacNumber: 'NAFDAC Reg: 04-7211'
  },
  {
    id: 'med-2',
    name: 'Lonart DS (Double Strength)',
    generic: 'Artemether + Lumefantrine 80/480mg',
    category: 'Antimalarial',
    price: 2800,
    inStock: true,
    stockCount: 65,
    prescriptionRequired: false,
    dosage: '1 tablet twice daily for 3 days',
    manufacturer: 'Bliss GVS',
    nafdacNumber: 'NAFDAC Reg: 04-9844'
  },
  {
    id: 'med-3',
    name: 'Amlodipine 10mg (Amlong)',
    generic: 'Amlodipine Besylate',
    category: 'Hypertension & Heart',
    price: 4500,
    inStock: true,
    stockCount: 30,
    prescriptionRequired: true,
    dosage: '1 tablet once daily morning (Requires BP monitoring)',
    manufacturer: 'Pfizer / Micro Labs',
    nafdacNumber: 'NAFDAC Reg: A4-1102'
  },
  {
    id: 'med-4',
    name: 'Amlodipine 5mg',
    generic: 'Amlodipine Besylate 5mg',
    category: 'Hypertension & Heart',
    price: 2600,
    inStock: true,
    stockCount: 52,
    prescriptionRequired: true,
    dosage: '1 tablet daily at the same time',
    manufacturer: 'Emzor Pharmaceuticals',
    nafdacNumber: 'NAFDAC Reg: 04-3321'
  },
  {
    id: 'med-5',
    name: 'Metformin 500mg (Glucophage)',
    generic: 'Metformin Hydrochloride',
    category: 'Diabetes Care',
    price: 3800,
    inStock: true,
    stockCount: 42,
    prescriptionRequired: true,
    dosage: '1 tablet twice daily with meals',
    manufacturer: 'Merck Healthcare',
    nafdacNumber: 'NAFDAC Reg: 04-1899'
  },
  {
    id: 'med-6',
    name: 'Augmentin 1000mg (1g)',
    generic: 'Amoxicillin + Clavulanate Potassium',
    category: 'Antibiotics',
    price: 12500,
    inStock: true,
    stockCount: 24,
    prescriptionRequired: true,
    dosage: '1 tablet twice daily after meals for 7 days',
    manufacturer: 'GSK (GlaxoSmithKline)',
    nafdacNumber: 'NAFDAC Reg: 04-0312'
  },
  {
    id: 'med-7',
    name: 'Ventolin Inhaler 100mcg',
    generic: 'Salbutamol Sulfate',
    category: 'Respiratory & Asthma',
    price: 8900,
    inStock: true,
    stockCount: 18,
    prescriptionRequired: true,
    dosage: '1-2 puffs as needed for acute shortness of breath',
    manufacturer: 'GSK UK',
    nafdacNumber: 'NAFDAC Reg: 04-1290'
  },
  {
    id: 'med-8',
    name: 'Ciprofloxacin 500mg (Cifran)',
    generic: 'Ciprofloxacin USP',
    category: 'Antibiotics',
    price: 2400,
    inStock: true,
    stockCount: 38,
    prescriptionRequired: true,
    dosage: '1 tablet every 12 hours for 5 days',
    manufacturer: 'Ranbaxy / Sun Pharma',
    nafdacNumber: 'NAFDAC Reg: 04-5412'
  },
  {
    id: 'med-9',
    name: 'Omeprazole 20mg Capsules',
    generic: 'Omeprazole Delayed-Release',
    category: 'Digestive & Ulcer',
    price: 1800,
    inStock: true,
    stockCount: 75,
    prescriptionRequired: false,
    dosage: '1 capsule daily 30 minutes before breakfast',
    manufacturer: 'Fidson Healthcare',
    nafdacNumber: 'NAFDAC Reg: 04-6101'
  },
  {
    id: 'med-10',
    name: 'Losartan Potassium 50mg',
    generic: 'Losartan Potassium',
    category: 'Hypertension & Heart',
    price: 3500,
    inStock: true,
    stockCount: 29,
    prescriptionRequired: true,
    dosage: '1 tablet daily as prescribed by doctor',
    manufacturer: 'Torrent Pharma',
    nafdacNumber: 'NAFDAC Reg: 04-4553'
  },
  {
    id: 'med-11',
    name: 'Vitamin C 1000mg Effervescent',
    generic: 'Ascorbic Acid + Zinc',
    category: 'Vitamins & Immunity',
    price: 2200,
    inStock: true,
    stockCount: 88,
    prescriptionRequired: false,
    dosage: 'Dissolve 1 tablet in a glass of water daily',
    manufacturer: 'Bayer / Redoxon',
    nafdacNumber: 'NAFDAC Reg: 04-8114'
  },
  {
    id: 'med-12',
    name: 'Panadol Extra (Paracetamol + Caffeine)',
    generic: 'Paracetamol 500mg + Caffeine 65mg',
    category: 'Pain Relief & Fever',
    price: 1200,
    inStock: true,
    stockCount: 110,
    prescriptionRequired: false,
    dosage: '2 caplets every 6 hours as needed (Max 8 in 24 hours)',
    manufacturer: 'GSK Consumer Nigeria',
    nafdacNumber: 'NAFDAC Reg: 04-0012'
  }
];

export const CATEGORIES = [
  'All',
  'Antimalarial',
  'Hypertension & Heart',
  'Diabetes Care',
  'Antibiotics',
  'Respiratory & Asthma',
  'Digestive & Ulcer',
  'Pain Relief & Fever',
  'Vitamins & Immunity'
];

export default function MedicineFinder({ onSelectMedicine }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filterPrescription, setFilterPrescription] = useState('all'); // 'all' | 'otc' | 'rx'

  const pharmacistNumber = '2347025051669';

  const filteredMedicines = useMemo(() => {
    return MEDICINE_INVENTORY.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.generic.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());

      const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;

      const matchesRx = 
        filterPrescription === 'all' ||
        (filterPrescription === 'otc' && !item.prescriptionRequired) ||
        (filterPrescription === 'rx' && item.prescriptionRequired);

      return matchesSearch && matchesCat && matchesRx;
    });
  }, [search, selectedCategory, filterPrescription]);

  const handleOrderWhatsApp = (med) => {
    const msg = `*Medication Order Request - Your Health Pharmacy, Onitsha*%0A` +
      `*Item:* ${encodeURIComponent(med.name)}%0A` +
      `*Generic:* ${encodeURIComponent(med.generic)}%0A` +
      `*Price:* ₦${med.price.toLocaleString()}%0A` +
      `*Type:* ${med.prescriptionRequired ? 'Prescription Required (I have my doctor script ready)' : 'Over-The-Counter (OTC)'}%0A` +
      `*Dispensary Location:* GRA Federal Housing Estate, Onitsha%0A%0A` +
      `Hello Pharm. Chinedu, please confirm availability and doorstep dispatch for this medication.`;

    window.open(`https://wa.me/${pharmacistNumber}?text=${msg}`, '_blank');
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[11px] font-extrabold uppercase tracking-wider mb-1.5 border border-emerald-200 dark:border-emerald-800">
            <Sparkles size={13} />
            <span>Onitsha Live Pharmacy Inventory & Price List</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Medication Stock & Price Finder
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Check live drug availability, current retail prices in ₦aira, and order directly to Pharm. Chinedu on WhatsApp with guaranteed batch authenticity.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto bg-slate-50 dark:bg-slate-800/80 p-2 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
          <ShieldCheck size={18} className="text-emerald-500 shrink-0" />
          <div>
            <p className="font-extrabold text-slate-800 dark:text-slate-200">100% NAFDAC Certified</p>
            <p className="text-[10px] text-slate-500">Superintended by Pharm. Chinedu</p>
          </div>
        </div>
      </div>

      {/* Search Bar + Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search medication name (e.g. Coartem, Amlodipine, Augmentin, Ventolin)..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-400"
          />
          {search && (
            <button 
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Chips Scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Prescription status toggle */}
        <div className="flex items-center justify-between text-xs pt-1">
          <span className="text-slate-500 dark:text-slate-400 font-semibold">
            Showing <strong className="text-slate-900 dark:text-white">{filteredMedicines.length}</strong> items in GRA Dispensary:
          </span>
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setFilterPrescription('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                filterPrescription === 'all' 
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' 
                  : 'text-slate-500'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterPrescription('otc')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                filterPrescription === 'otc' 
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs' 
                  : 'text-slate-500'
              }`}
            >
              OTC (No Rx)
            </button>
            <button
              onClick={() => setFilterPrescription('rx')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                filterPrescription === 'rx' 
                  ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-xs' 
                  : 'text-slate-500'
              }`}
            >
              Prescription Only
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Medicines */}
      {filteredMedicines.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
          <Pill size={36} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
          <h4 className="text-sm font-black text-slate-800 dark:text-white">Medication not listed in standard stock?</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto mb-4">
            Pharm. Chinedu sources specialized, imported, or rare pharmaceutical compounds directly through verified international distributors in Lagos and Onitsha.
          </p>
          <a
            href={`https://wa.me/${pharmacistNumber}?text=Hello%20Pharm.%20Chinedu,%20I%20am%20looking%20for%20a%20specific%20medication:%20${encodeURIComponent(search || 'Specialized Medication')}.%20Can%20you%20confirm%20availability%20or%20procure%20it%20for%20me?`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <MessageCircle size={15} />
            <span>Inquire Directly with Pharm. Chinedu on WhatsApp</span>
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredMedicines.map((med) => (
            <div 
              key={med.id}
              className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 hover:border-emerald-500/50 hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                    {med.category}
                  </span>
                  
                  {med.prescriptionRequired ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300">
                      Rx Required
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      OTC
                    </span>
                  )}
                </div>

                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {med.name}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                  {med.generic}
                </p>

                <div className="mt-2.5 p-2 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-[11px] space-y-1">
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Dosage note:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 text-right truncate max-w-[170px]" title={med.dosage}>
                      {med.dosage}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span>{med.manufacturer}</span>
                    <span className="font-mono">{med.nafdacNumber}</span>
                  </div>
                </div>
              </div>

              {/* Price & Action */}
              <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between gap-2">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Dispensary Retail</div>
                  <div className="text-base font-black text-emerald-600 dark:text-emerald-400">
                    ₦{med.price.toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {onSelectMedicine && (
                    <button
                      onClick={() => onSelectMedicine(med)}
                      className="p-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
                      title="Include in Receipt / Consultation Quote"
                    >
                      <ShoppingCart size={15} />
                    </button>
                  )}

                  <button
                    onClick={() => handleOrderWhatsApp(med)}
                    className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-emerald-600/30 transition-all cursor-pointer"
                  >
                    <MessageCircle size={14} />
                    <span>Order via WhatsApp</span>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Footer Assurance Banner */}
      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 text-emerald-950 dark:text-emerald-200">
          <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>
            <strong>Onitsha Same-Day Dispatch Guarantee:</strong> Orders placed before 4:00 PM are packaged and delivered to GRA, Fegge, Woliwo, 3-3, and Inland Town within 60 minutes.
          </span>
        </div>
        <a 
          href={`https://wa.me/${pharmacistNumber}?text=Hello%20Pharm.%20Chinedu,%20I%20have%20an%20urgent%20prescription%20I%20need%20dispensed%20today.`}
          target="_blank"
          rel="noreferrer"
          className="text-emerald-700 dark:text-emerald-300 font-extrabold whitespace-nowrap hover:underline flex items-center gap-1 self-start sm:self-auto"
        >
          <span>Urgent Delivery Helpline</span>
          <ArrowUpRight size={14} />
        </a>
      </div>

    </div>
  );
}
