import React, { useState } from 'react';
import { Truck, MessageCircle, Upload, CheckCircle2, Phone, MapPin } from 'lucide-react';

const ONITSHA_ZONES = [
  { id: 'gra', name: 'GRA Federal Housing Estate (Immediate Delivery / 15 mins)', deliveryFee: '₦500 / Free on orders > ₦10k' },
  { id: '3-3', name: '3-3 Area / Nkwelle Ezunaka (Same-Day Courier)', deliveryFee: '₦1,000' },
  { id: 'fegge', name: 'Fegge Housing & Commercial Zone', deliveryFee: '₦1,000' },
  { id: 'awka_rd', name: 'Awka Road / Inland Town / Ose Axis', deliveryFee: '₦1,000' },
  { id: 'woliwo', name: 'Woliwo / Niger Bridgehead / Port Harcourt Rd', deliveryFee: '₦1,200' },
  { id: 'upper_iweka', name: 'Upper Iweka / Ochanja Market Axis', deliveryFee: '₦1,200' },
  { id: 'obosi', name: 'Obosi / Nkpor / Ogidi Environs', deliveryFee: '₦1,500' }
];

export default function OnitshaPrescriptionOrder() {
  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');
  const [zone, setZone] = useState('gra');
  const [addressDetails, setAddressDetails] = useState('');
  const [urgency, setUrgency] = useState('standard');
  const [orderType, setOrderType] = useState('prescription'); // 'prescription' | 'refill' | 'otc'
  const [medicationNotes, setMedicationNotes] = useState('');
  const [fileName, setFileName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const selectedZoneInfo = ONITSHA_ZONES.find(z => z.id === zone) || ONITSHA_ZONES[0];

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSendWhatsAppOrder = (e) => {
    e.preventDefault();
    if (!patientName || !phone) {
      alert('Please provide your name and phone number for delivery coordination.');
      return;
    }

    const message = `*New Medication Order / Prescription Request*%0A` +
      `*Patient:* ${encodeURIComponent(patientName)}%0A` +
      `*Phone:* ${encodeURIComponent(phone)}%0A` +
      `*Order Type:* ${encodeURIComponent(orderType.toUpperCase())}%0A` +
      `*Onitsha Delivery Zone:* ${encodeURIComponent(selectedZoneInfo.name)}%0A` +
      `*Delivery Address:* ${encodeURIComponent(addressDetails || 'GRA Pickup / To be confirmed')}%0A` +
      `*Urgency:* ${encodeURIComponent(urgency === 'emergency' ? 'EMERGENCY IMMEDIATE (Within 30 mins)' : 'Standard Same-Day')}%0A` +
      `*Medications / Doctor Notes:* ${encodeURIComponent(medicationNotes || 'Prescription image ready for review')}%0A` +
      (fileName ? `*Attached File:* ${encodeURIComponent(fileName)}%0A` : '') +
      `%0APlease confirm total invoice and delivery dispatch with Pharm. Chinedu Nwankwo at Your Health Pharmacy, Onitsha.`;

    const pharmacistWhatsAppNumber = '2347025051669';
    window.open(`https://wa.me/${pharmacistWhatsAppNumber}?text=${message}`, '_blank');
    setSubmitted(true);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
      
      {/* Header */}
      <div className="space-y-1 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-extrabold border border-emerald-200 dark:border-emerald-800">
          <Truck size={14} />
          <span>Express Doorstep Delivery Across Onitsha & Anambra State</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          Onitsha Doorstep Pharmacy Delivery & WhatsApp Dispatch
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
          Order genuine medications or send your physical doctor's prescription directly to Your Health Pharmacy dispensary. Enjoy swift delivery across GRA, 3-3, Fegge, and all Onitsha zones.
        </p>
      </div>

      <form onSubmit={handleSendWhatsAppOrder} className="space-y-4">
        
        {/* Order Type Toggle */}
        <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-extrabold">
          <button
            type="button"
            onClick={() => setOrderType('prescription')}
            className={`py-2 px-3 rounded-xl transition-all ${
              orderType === 'prescription' ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Upload Prescription
          </button>
          <button
            type="button"
            onClick={() => setOrderType('refill')}
            className={`py-2 px-3 rounded-xl transition-all ${
              orderType === 'refill' ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Monthly Refill
          </button>
          <button
            type="button"
            onClick={() => setOrderType('otc')}
            className={`py-2 px-3 rounded-xl transition-all ${
              orderType === 'otc' ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            OTC Meds & First Aid
          </button>
        </div>

        {/* Patient Name & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Patient Full Name *
            </label>
            <input 
              type="text" 
              required
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="e.g. Chief Emeka Okafor" 
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              WhatsApp / Phone Number *
            </label>
            <input 
              type="tel" 
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 0803 888 1234" 
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Onitsha Zone Selector */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <MapPin size={14} className="text-emerald-500" />
            <span>Select Delivery Zone in Onitsha:</span>
          </label>
          <select
            value={zone}
            onChange={(e) => setZone(e.target.value)}
            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {ONITSHA_ZONES.map((z) => (
              <option key={z.id} value={z.id}>
                {z.name} — Fee: {z.deliveryFee}
              </option>
            ))}
          </select>
        </div>

        {/* Street Address */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Street Landmark / Residential Address in Onitsha:
          </label>
          <input 
            type="text" 
            value={addressDetails}
            onChange={(e) => setAddressDetails(e.target.value)}
            placeholder="e.g. Plot 14, Ogbatuluenyi Drive near Federal Housing, GRA Onitsha" 
            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Medication List or Prescription Notes */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            List Medications, Dosages, or Special Instructions:
          </label>
          <textarea 
            rows={3}
            value={medicationNotes}
            onChange={(e) => setMedicationNotes(e.target.value)}
            placeholder="e.g. Amlodipine 10mg (1 month supply), Metformin 1000mg, Omeprazole 20mg..."
            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* File / Prescription Image Upload */}
        <div className="p-4 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border-2 border-dashed border-emerald-300 dark:border-emerald-800 text-center">
          <label className="cursor-pointer flex flex-col items-center gap-1.5">
            <Upload size={22} className="text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {fileName ? `File Attached: ${fileName}` : 'Snap / Upload Doctor Prescription Slip (Optional)'}
            </span>
            <span className="text-[10px] text-slate-400">Pharm. Chinedu will decipher handwritten notes and quote total cost</span>
            <input type="file" accept="image/*,application/pdf" className="hidden" onChange={handleFileChange} />
          </label>
        </div>

        {/* Urgency Radio */}
        <div className="flex items-center gap-6 pt-1 text-xs font-bold text-slate-700 dark:text-slate-300">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              name="urgency" 
              value="standard" 
              checked={urgency === 'standard'} 
              onChange={() => setUrgency('standard')}
              className="text-emerald-600 focus:ring-emerald-500"
            />
            <span>Standard Delivery Today</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-red-600 dark:text-red-400">
            <input 
              type="radio" 
              name="urgency" 
              value="emergency" 
              checked={urgency === 'emergency'} 
              onChange={() => setUrgency('emergency')}
              className="text-red-600 focus:ring-red-500"
            />
            <span>⚡ Urgent / Priority Dispatch (30 mins)</span>
          </label>
        </div>

        {/* Submit Action */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            className="flex-1 py-3.5 px-6 rounded-2xl bg-linear-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
          >
            <MessageCircle size={18} />
            <span>Send Order Directly to Pharmacist WhatsApp</span>
          </button>

          <a
            href="tel:+2347025051669"
            className="py-3.5 px-5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
          >
            <Phone size={16} className="text-emerald-500" />
            <span>Call Dispensary</span>
          </a>
        </div>

        {submitted && (
          <div className="p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 size={16} />
            <span>Order dispatched to Pharm. Chinedu on WhatsApp! The pharmacy team will confirm availability in minutes.</span>
          </div>
        )}

      </form>

    </div>
  );
}
