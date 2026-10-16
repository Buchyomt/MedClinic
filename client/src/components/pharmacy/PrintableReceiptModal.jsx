import React, { useState } from 'react';
import { 
  X, Printer, Download, CheckCircle2, QrCode, ShieldCheck, 
  FileText, Receipt, Copy, Check 
} from 'lucide-react';

export default function PrintableReceiptModal({ isOpen, onClose, data }) {
  const [receiptType, setReceiptType] = useState('a4'); // 'a4' | 'pos'
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const receiptNumber = data?.receiptNumber || `YHP-2026-${Math.floor(10000 + Math.random() * 90000)}`;
  const dateFormatted = data?.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeFormatted = data?.time || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const patientName = data?.patientName || 'Chukwuebuka Adeleke';
  const patientPhone = data?.patientPhone || '+234 803 555 1234';
  const doctorOrPharmacist = data?.providerName || 'Pharm. Chinedu Nwankwo';
  const facility = 'Your Health Pharmacy, GRA Onitsha';

  const items = data?.items || [
    { name: 'Comprehensive Medication Therapy Management (MTM)', qty: 1, price: 10000 },
    { name: 'Coartem 80/480mg (Dispersible) - 6 Tabs', qty: 1, price: 3200 },
    { name: 'Vitamin C 1000mg Effervescent (20 Tabs)', qty: 1, price: 2200 }
  ];

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const consultationDiscount = data?.discount || 0;
  const total = subtotal - consultationDiscount;

  const handlePrint = () => {
    window.print();
  };

  const copyReceiptId = () => {
    navigator.clipboard.writeText(receiptNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white print:static">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:border-none print:shadow-none print:rounded-none">
        
        {/* Top Controls Bar (Hidden during print) */}
        <div className="p-4 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Format:</span>
            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setReceiptType('a4')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  receiptType === 'a4' 
                    ? 'bg-emerald-600 text-white shadow-xs' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <FileText size={13} />
                <span>A4 Clinical Invoice</span>
              </button>
              <button
                onClick={() => setReceiptType('pos')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  receiptType === 'pos' 
                    ? 'bg-emerald-600 text-white shadow-xs' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Receipt size={13} />
                <span>80mm Thermal POS</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <Printer size={15} />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 transition-colors cursor-pointer"
              title="Close receipt preview"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document Area */}
        <div className="p-6 sm:p-10 overflow-y-auto flex-1 bg-white text-slate-900 print:overflow-visible print:p-8">
          
          {receiptType === 'a4' ? (
            /* ───────────────────────────────────────────────────────────── */
            /* A4 CLINICAL INVOICE FORMAT                                    */
            /* ───────────────────────────────────────────────────────────── */
            <div className="space-y-6 max-w-xl mx-auto">
              
              {/* Header */}
              <div className="flex items-start justify-between border-b-2 border-emerald-600 pb-5">
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider mb-1">
                    Licensed PCN Facility &bull; Reg # PCN-88421
                  </div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">YOUR HEALTH DIAGNOSTIC CENTRE & PHARMACY</h1>
                  <p className="text-xs font-extrabold text-emerald-700 mt-0.5">Clinical Outpatient Pharmacy & Diagnostic Center</p>
                  <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                    1 Nwankwo Chinedu Crescent, Off Ogbatuluenyi Street<br />
                    FHE 3-3, Onitsha, Anambra State
                  </p>
                  <p className="text-[11px] text-slate-600 font-semibold mt-0.5">
                    Tel: 0803 733 4924 &bull; WhatsApp: 0702 505 1669 &bull; 0806 444 4654
                  </p>
                </div>

                <div className="text-right">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col items-center justify-center text-emerald-700 mx-auto mb-2">
                    <ShieldCheck size={32} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 block">OFFICIAL RECEIPT</span>
                  <div className="font-mono text-xs font-black text-slate-800 mt-0.5">{receiptNumber}</div>
                </div>
              </div>

              {/* Patient & Practitioner Details */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-extrabold text-slate-400 block mb-1">PATIENT INFORMATION</span>
                  <p className="font-black text-slate-900 text-sm">{patientName}</p>
                  <p className="text-slate-600 mt-0.5">{patientPhone}</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">Payment Status: <strong className="text-emerald-700">PAID &bull; VERIFIED</strong></p>
                </div>
                <div className="text-right sm:text-left">
                  <span className="text-[10px] uppercase font-extrabold text-slate-400 block mb-1">PRACTICE & SUPERVISION</span>
                  <p className="font-black text-slate-900 text-sm">{doctorOrPharmacist}</p>
                  <p className="text-slate-600 text-[11px] mt-0.5">Superintendent Clinical Pharmacist</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">Date: {dateFormatted} at {timeFormatted}</p>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 text-[11px] uppercase font-black">
                    <tr>
                      <th className="py-2.5 px-4">Description / Medication Item</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">Unit Price</th>
                      <th className="py-2.5 px-4 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-semibold text-slate-800">{item.name}</td>
                        <td className="py-3 px-3 text-center text-slate-600">{item.qty}</td>
                        <td className="py-3 px-3 text-right font-mono text-slate-600">₦{item.price.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right font-bold text-slate-900 font-mono">₦{(item.price * item.qty).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total Calculation Breakdown */}
              <div className="flex justify-end pt-2">
                <div className="w-64 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-mono font-semibold">₦{subtotal.toLocaleString()}</span>
                  </div>
                  {consultationDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Clinical Waiver / Discount:</span>
                      <span className="font-mono">-₦{consultationDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>VAT / Dispensary Fee (0%):</span>
                    <span className="font-mono">₦0.00</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-slate-900 border-t-2 border-slate-900 pt-2">
                    <span>TOTAL PAID:</span>
                    <span className="text-emerald-700 font-mono">₦{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Official Stamp & Sign Off */}
              <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
                
                {/* Visual Official Stamp */}
                <div className="w-48 h-24 border-2 border-emerald-700 rounded-2xl flex flex-col items-center justify-center p-2 text-center text-emerald-800 rotate-[-2deg] bg-emerald-50/40 select-none shadow-xs">
                  <div className="text-[9px] font-black uppercase tracking-widest text-emerald-900">YOUR HEALTH PHARMACY</div>
                  <div className="text-[13px] font-black my-0.5 tracking-tight">★ CLINICAL DISPENSARY ★</div>
                  <div className="text-[8px] font-bold text-emerald-700">VERIFIED & DISPENSED &bull; ONITSHA</div>
                  <div className="text-[8px] font-mono mt-0.5 text-emerald-800">{dateFormatted} &bull; LIC. #88421</div>
                </div>

                {/* QR Code Verification */}
                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="w-14 h-14 bg-white p-1 rounded-lg border border-slate-300 flex items-center justify-center">
                    <QrCode size={48} className="text-slate-800" />
                  </div>
                  <div className="text-[10px] text-slate-500">
                    <p className="font-bold text-slate-800">Tamper-Proof Verification</p>
                    <p>Scan to verify authentic dispensing record in MedClinic Digital Registry.</p>
                  </div>
                </div>

              </div>

              <div className="text-center text-[10px] text-slate-400 pt-3 border-t border-dashed border-slate-200">
                Medicines dispensed are non-returnable in compliance with PCN Good Pharmacy Practice guidelines.
                Thank you for choosing Your Health Pharmacy, Onitsha!
              </div>

            </div>
          ) : (
            /* ───────────────────────────────────────────────────────────── */
            /* 80mm THERMAL POS RECEIPT FORMAT                               */
            /* ───────────────────────────────────────────────────────────── */
            <div className="w-72 mx-auto font-mono text-xs text-slate-900 space-y-3 p-4 border border-dashed border-slate-300 rounded-xl bg-slate-50/50 print:border-none print:bg-white">
              <div className="text-center pb-2 border-b border-dashed border-slate-400">
                <h3 className="font-black text-sm">YOUR HEALTH PHARMACY</h3>
                <p className="text-[10px]">GRA FED HOUSING, ONITSHA</p>
                <p className="text-[10px]">TEL: +234 702 505 1669</p>
                <p className="text-[9px] mt-1 font-bold">PCN REG: #88421</p>
              </div>

              <div className="text-[10px] space-y-0.5">
                <div className="flex justify-between"><span>RECEIPT:</span><span className="font-bold">{receiptNumber}</span></div>
                <div className="flex justify-between"><span>DATE:</span><span>{dateFormatted} {timeFormatted}</span></div>
                <div className="flex justify-between"><span>PATIENT:</span><span>{patientName}</span></div>
                <div className="flex justify-between"><span>PHARM:</span><span>Chinedu N.</span></div>
              </div>

              <div className="border-t border-b border-dashed border-slate-400 py-2 space-y-1 text-[11px]">
                {items.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span className="truncate max-w-[170px]">{item.qty}x {item.name}</span>
                    <span className="font-bold">₦{(item.price * item.qty).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="text-xs space-y-1 pt-1 font-bold">
                <div className="flex justify-between"><span>SUBTOTAL:</span><span>₦{subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between text-sm font-black border-t border-slate-900 pt-1">
                  <span>TOTAL:</span>
                  <span>₦{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-600"><span>METHOD:</span><span>CASH / TRANSFER</span></div>
              </div>

              <div className="pt-3 text-center border-t border-dashed border-slate-400 text-[10px] space-y-1">
                <QrCode size={36} className="mx-auto text-slate-800" />
                <p className="font-bold">GENUINE NAFDAC DRUGS GUARANTEED</p>
                <p className="text-[9px]">GET WELL SOON &bull; GOD HEALS</p>
              </div>
            </div>
          )}

        </div>

        {/* Footer info bar */}
        <div className="p-3 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 print:hidden">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-emerald-500" />
            <span>Digital Certificate Registered in MongoDB Cloud</span>
          </div>
          <button 
            onClick={copyReceiptId}
            className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            <span>{copied ? 'Copied Receipt #' : `Copy #${receiptNumber}`}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
