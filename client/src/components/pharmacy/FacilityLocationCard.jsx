import React, { useState } from 'react';
import { 
  MapPin, Phone, MessageCircle, Clock, Navigation, 
  Copy, Check, ShieldCheck, ExternalLink, Sparkles 
} from 'lucide-react';

export default function FacilityLocationCard() {
  const [copied, setCopied] = useState(false);

  const address = '1 Nwankwo Chinedu Crescent, Off Ogbatuluenyi Street, FHE 3-3, Onitsha, Anambra State';
  const phone = '+234 702 505 1669';
  const whatsappNumber = '2347025051669';
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('1 Nwankwo Chinedu Crescent FHE 3-3 Onitsha Anambra State')}`;

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-linear-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-2xl space-y-6 relative overflow-hidden">
      
      {/* Background ambient glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider mb-2 border border-emerald-400/30">
            <Sparkles size={12} />
            <span>Diagnostic Centre & Clinical Pharmacy Hub</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Your Health Diagnostic Centre Ltd & Pharmacy
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Superintended by <strong>Pharm. Chinedu Nwankwo</strong> &bull; PCN Reg # PCN-88421
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 active:scale-98 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
          >
            <Navigation size={15} />
            <span>Open in Google Maps</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {/* Grid: Address, Contact, and Hours */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        
        {/* Address */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-emerald-400 font-bold">
            <span className="flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
              <MapPin size={14} />
              <span>Location / Landmark</span>
            </span>
            <button 
              onClick={copyAddress}
              className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
              title="Copy Address"
            >
              {copied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <p className="font-semibold text-slate-200 leading-relaxed">
            1 Nwankwo Chinedu Crescent, Off Ogbatuluenyi Street, FHE 3-3, Onitsha
          </p>
          <span className="text-[10px] text-slate-400 block">Fast courier coverage: FHE 3-3, GRA, Fegge, Woliwo, & Awka Road</span>
        </div>

        {/* Working Hours */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase text-[10px] tracking-wider">
            <Clock size={14} />
            <span>Dispensary Hours</span>
          </div>
          <p className="font-semibold text-slate-200">
            Mon &ndash; Sat: 7:00 AM &ndash; 9:00 PM<br />
            Sunday: 12:00 PM &ndash; 9:00 PM
          </p>
          <div className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Open for Walk-Ins & Prescriptions</span>
          </div>
        </div>

        {/* Direct Contacts */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase text-[10px] tracking-wider">
            <Phone size={14} />
            <span>Official Phone & WhatsApp</span>
          </div>
          <div className="space-y-1">
            <a 
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-slate-200 hover:text-white font-bold"
            >
              <MessageCircle size={13} className="text-emerald-400 shrink-0" />
              <span>WhatsApp: 0702 505 1669</span>
            </a>
            <a 
              href="tel:08037334924"
              className="flex items-center gap-2 text-slate-300 hover:text-white font-medium"
            >
              <Phone size={12} className="text-blue-400 shrink-0" />
              <span>Line 1: 0803 733 4924</span>
            </a>
            <a 
              href="tel:08064444654"
              className="flex items-center gap-2 text-slate-300 hover:text-white font-medium"
            >
              <Phone size={12} className="text-cyan-400 shrink-0" />
              <span>Line 2: 0806 444 4654</span>
            </a>
          </div>
          <span className="text-[10px] text-slate-400 block pt-0.5">Direct lines to Diagnostic Centre & Pharmacy Desk</span>
        </div>

      </div>

      {/* Assurance Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-white/10 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-emerald-400" />
          <span>Cold-chain storage & 100% NAFDAC-certified pharmaceutical dispensing guaranteed.</span>
        </div>
        <span className="text-[11px] font-mono text-emerald-300/80">Reg PCN-88421 &bull; Onitsha South</span>
      </div>

    </div>
  );
}
