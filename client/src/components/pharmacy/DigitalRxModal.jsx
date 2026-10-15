import React, { useEffect } from 'react';
import { X, Printer, ShieldCheck, Pill, Calendar, User, QrCode } from 'lucide-react';

export default function DigitalRxModal({ prescription, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!prescription) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex justify-center items-center p-4 z-50 animate-in zoom-in-95 duration-200">
      <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-xl shadow-2xl border border-gray-100 relative max-h-[92vh] overflow-y-auto text-gray-900 print:m-0 print:p-6 print:max-w-none print:shadow-none">
        
        {/* Close Button (Hidden on print) */}
        <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-100 print:hidden">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            <ShieldCheck size={15} />
            <span>Verified Official Digital e-Prescription (Rx)</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Printer size={14} />
              <span>Print / Save PDF</span>
            </button>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Prescription Header / Letterhead */}
        <div className="border-b-2 border-emerald-600 pb-5 mb-5">
          <div className="flex justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-2 text-emerald-700 font-extrabold text-lg">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <Pill size={18} />
                </div>
                <span>{prescription.facilityName || 'Your Health Pharmacy'}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Licensed PCN Registered Pharmacy • GRA, Federal Housing Estate, Onitsha, Anambra State
              </p>
              <p className="text-[11px] text-gray-400">
                Tel: +234 702 505 1669 • Email: info@yourhealthpharmacy.com
              </p>
            </div>

            <div className="text-right">
              <span className="text-2xl font-black text-emerald-700 tracking-wider">℞</span>
              <div className="text-xs font-mono font-bold text-gray-800 bg-slate-100 px-2.5 py-1 rounded-lg mt-0.5">
                {prescription.rxCode || 'RX-748291'}
              </div>
            </div>
          </div>
        </div>

        {/* Patient & Prescriber Meta Details */}
        <div className="bg-slate-50 rounded-2xl p-4 mb-5 grid grid-cols-2 gap-4 text-xs border border-slate-100">
          <div>
            <span className="text-gray-400 font-semibold block mb-0.5">Patient Information</span>
            <div className="font-bold text-gray-900 flex items-center gap-1">
              <User size={13} className="text-emerald-600" />
              {prescription.patientName}
            </div>
            <div className="text-[11px] text-gray-500 mt-0.5">{prescription.patientEmail}</div>
            {prescription.patientPhone && (
              <div className="text-[11px] text-gray-500">{prescription.patientPhone}</div>
            )}
          </div>

          <div className="text-right sm:text-left">
            <span className="text-gray-400 font-semibold block mb-0.5">Prescribed By & Date</span>
            <div className="font-bold text-emerald-800">{prescription.prescribedBy || 'Pharm. Michael Obi, B.Pharm, RPh'}</div>
            <div className="text-[11px] text-gray-500 flex items-center gap-1 justify-end sm:justify-start mt-0.5">
              <Calendar size={12} className="text-gray-400" />
              Date: {new Date(prescription.issueDate || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
            <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Status: {prescription.status || 'Active'}</div>
          </div>
        </div>

        {/* Diagnosis / Indication */}
        {prescription.diagnosis && (
          <div className="mb-4 px-1 text-xs">
            <span className="font-bold text-gray-700">Diagnosis / Indication: </span>
            <span className="text-gray-600">{prescription.diagnosis}</span>
          </div>
        )}

        {/* Prescribed Medications Table */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden mb-5 shadow-2xs">
          <div className="bg-emerald-700 text-white text-[11px] font-bold px-4 py-2.5 grid grid-cols-12">
            <span className="col-span-5">Medication & Dosage</span>
            <span className="col-span-4">Frequency & Timing</span>
            <span className="col-span-3 text-right">Duration / Refill</span>
          </div>

          <div className="divide-y divide-slate-100 bg-white">
            {prescription.medications && prescription.medications.map((med, idx) => (
              <div key={idx} className="px-4 py-3 grid grid-cols-12 text-xs items-center">
                <div className="col-span-5">
                  <span className="font-bold text-gray-900 block">{med.name}</span>
                  <span className="text-[11px] text-gray-500">{med.dosage}</span>
                  {med.instructions && (
                    <span className="text-[10px] text-emerald-700 block italic mt-0.5">Note: {med.instructions}</span>
                  )}
                </div>
                <div className="col-span-4 text-gray-700 font-medium text-[11px]">
                  {med.frequency}
                </div>
                <div className="col-span-3 text-right">
                  <span className="font-bold text-gray-800 block">{med.duration}</span>
                  <span className="text-[10px] text-gray-400">
                    Refills: {med.refillsRemaining ?? 1} left
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Clinical Directions & Footer Stamp */}
        <div className="border-t border-gray-200 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 text-xs">
          <div className="max-w-xs">
            <span className="font-bold text-gray-700 block mb-1">Prescriber's Directions:</span>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              {prescription.clinicalNotes || 'Follow prescribed timing. Report any adverse effects to your clinical pharmacist immediately.'}
            </p>
            <div className="mt-3 flex items-center gap-2 text-[10px] text-gray-400">
              <QrCode size={24} className="text-gray-700" />
              <span>Scan QR at dispensary for tamper-proof digital verification</span>
            </div>
          </div>

          <div className="text-center sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 w-full sm:w-auto">
            <div className="font-serif italic text-emerald-800 text-sm font-bold border-b border-gray-300 pb-1 mb-1">
              {prescription.prescribedBy || 'Pharm. Chinedu Nwankwo'}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
              Authorized Clinical Sign-off
            </span>
            <span className="text-[9px] text-gray-400">PCN Reg. No: Your Health Pharmacy, Onitsha</span>
          </div>
        </div>

      </div>
    </div>
  );
}
