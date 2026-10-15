import { API_BASE_URL } from '../../config/api';
import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, Clock, Phone, MessageCircle, CheckCircle2, 
  AlertCircle, Search, RefreshCw, Truck, Video, ShieldCheck, 
  Activity, Eye, Edit3, Save, X, User, ArrowRight, Volume2, 
  Sparkles, MapPin, Mail, Printer, ZoomIn, ZoomOut, RotateCw, FileText, Download, Pill
} from 'lucide-react';
import { useFacility } from '../../context/FacilityContext';
import { useNavigate } from 'react-router-dom';

const DEFAULT_ONITSHA_ORDERS = [
  {
    id: 'ord-101',
    patientName: 'Chief Emeka Okafor',
    phone: '+234 803 112 4490',
    zone: 'GRA Federal Housing Estate, Onitsha',
    urgency: 'Standard Delivery',
    orderType: 'Monthly Refill',
    medications: 'Norvasc (Amlodipine 10mg) - 30 Tabs, Glucophage 1000mg - 60 Tabs',
    date: 'Today, 10:15 AM',
    status: 'Ready for Dispatch',
    amount: '₦18,500'
  },
  {
    id: 'ord-102',
    patientName: 'Mrs. Amaka Nwosu',
    phone: '+234 802 991 3321',
    zone: '3-3 Area / Nkwelle Ezunaka',
    urgency: '⚡ Priority Dispatch (30 mins)',
    orderType: 'Prescription Slip Uploaded',
    medications: 'Augmentin 625mg, Paracetamol 500mg, Vitamin C 1000mg',
    date: 'Today, 11:40 AM',
    status: 'Reviewing Prescription',
    amount: '₦14,200'
  },
  {
    id: 'ord-103',
    patientName: 'Mr. Chidi Kalu',
    phone: '+234 814 550 8812',
    zone: 'Fegge Commercial Zone, Onitsha',
    urgency: 'Standard Delivery',
    orderType: 'OTC First Aid & Chronic',
    medications: 'Ventolin Inhaler, Omeprazole 20mg Capsules',
    date: 'Yesterday, 4:20 PM',
    status: 'Delivered',
    amount: '₦9,500'
  }
];

const INITIAL_VISITOR_LOGS = [
  { time: '5 mins ago', event: 'Patient checked NAFDAC MAS Batch #YHP-2026-B81 (Norvasc 10mg) - Verified 100% Genuine' },
  { time: '18 mins ago', event: 'New consultation slot booked for Comprehensive MTM Review by Mrs. Blessing O.' },
  { time: '42 mins ago', event: 'Refill requested for Rx #RX-748291 from GRA Onitsha' },
  { time: '1 hr ago', event: 'Diaspora Parent Sponsorship inquiry received from London, UK for Elder Nwosu' }
];

export default function PharmacistDashboard() {
  const navigate = useNavigate();
  const { pharmacyProfile, updateServiceFee } = useFacility();

  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' | 'deliveries' | 'activity' | 'pricing'
  const [appointments, setAppointments] = useState([]);
  const [loadingApts, setLoadingApts] = useState(true);
  const [activityLogs, setActivityLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [orders, setOrders] = useState(DEFAULT_ONITSHA_ORDERS);
  const [toastMessage, setToastMessage] = useState('');
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [tempFee, setTempFee] = useState('');

  // Interactive Modals State
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedActivityLog, setSelectedActivityLog] = useState(null);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [activePrescriptionSlip, setActivePrescriptionSlip] = useState(null);
  const [slipZoom, setSlipZoom] = useState(1);
  const [slipRotation, setSlipRotation] = useState(0);
  const [showWaitingQueueModal, setShowWaitingQueueModal] = useState(false);
  const [calledPatient, setCalledPatient] = useState(null);
  const prevAppointmentsCountRef = useRef(0);

  const [waitingQueue] = useState([
    { token: 'MC-105', patient: 'Fatima Aliyu', service: 'Medication Therapy Management (MTM)', room: 'Dispensary Counter 2', wait: '~4 mins', status: 'Next Up' },
    { token: 'MC-108', patient: 'Nnamdi Okeke', service: 'Norvasc Chronic Refill & Vitals Check', room: 'Dispensary Counter 2', wait: '~10 mins', status: 'Waiting' },
    { token: 'MC-110', patient: 'Sister Ngozi Umeh', service: 'Prescription Verification & Dosage Audit', room: 'Dispensary Counter 2', wait: '~18 mins', status: 'Waiting' },
    { token: 'MC-112', patient: 'Elder Lawrence Nwosu', service: 'Diaspora Family Package Pickup', room: 'Dispensary Counter 2', wait: '~25 mins', status: 'Waiting' }
  ]);

  const playQueueChime = (token, patient) => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch (e) {
      console.log('Audio chime simulated:', e);
    }
    setCalledPatient(`🔔 Token ${token} (${patient}) called to Dispensary Counter 2!`);
    showToast(`Calling Token ${token}: ${patient} to Counter 2`);
    setTimeout(() => setCalledPatient(null), 5000);
  };

  const playNewBookingChime = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.15); // E5
      gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
    } catch {
      // Audio autoplay restrictions
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Fetch real appointments from backend
  const fetchAppointments = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/appointments`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          if (prevAppointmentsCountRef.current > 0 && data.length > prevAppointmentsCountRef.current) {
            playNewBookingChime();
            showToast(`🔔 New patient consultation booked by ${data[0]?.patientName || 'a patient'}!`);
          }
          prevAppointmentsCountRef.current = data.length;
          setAppointments(data);
        }
      } else {
        throw new Error('Failed to load');
      }
    } catch {
      // Fallback sample appointments for demonstration
      setAppointments([
        {
          _id: 'apt-chinedu-1',
          patientName: 'Mrs. Blessing Okonkwo',
          email: 'blessing@gmail.com',
          phone: '+234 803 771 9922',
          date: '2026-09-06',
          time: '10:30 AM',
          reason: 'Comprehensive Medication Therapy Management (MTM)',
          status: 'Confirmed',
          fee: '₦10,000'
        },
        {
          _id: 'apt-chinedu-2',
          patientName: 'Chief Emeka Okafor',
          email: 'emeka@gmail.com',
          phone: '+234 803 112 4490',
          date: '2026-09-06',
          time: '02:00 PM',
          reason: 'Chronic Disease Care & Vitals Retainer (BP & Glucose)',
          status: 'Pending',
          fee: '₦15,000'
        },
        {
          _id: 'apt-chinedu-3',
          patientName: 'Mr. Jude Anayo',
          email: 'jude@gmail.com',
          phone: '+234 802 884 1109',
          date: '2026-09-07',
          time: '11:00 AM',
          reason: 'Doctor Prescription Dispense & Dosage Review',
          status: 'Confirmed',
          fee: 'Free (Medication Cost Only)'
        }
      ]);
    } finally {
      setLoadingApts(false);
    }
  };

  // Fetch live activity and visitor logins
  const fetchActivityLogs = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/activity`);
      if (res.ok) {
        const data = await res.json();
        setActivityLogs(data);
      }
    } catch {
      // fallback
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchActivityLogs();
    const interval = setInterval(() => {
      fetchAppointments();
      fetchActivityLogs();
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await fetch(`${API_BASE_URL}/api/appointments/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      fetchActivityLogs();
    } catch {
      // ignore
    }
    setAppointments(prev => prev.map(a => a._id === id ? { ...a, status: newStatus } : a));
    if (selectedAppointment && (selectedAppointment._id === id || selectedAppointment.id === id)) {
      setSelectedAppointment(prev => prev ? { ...prev, status: newStatus } : null);
    }
    showToast(newStatus === 'Confirmed' ? 'Consultation approved! Patient schedule confirmed.' : `Appointment status updated to ${newStatus}`);
  };

  const pendingAppointments = appointments.filter(a => a.status === 'Pending');

  const handleOrderStatusUpdate = (orderId, nextStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: nextStatus } : o));
    showToast(`Order #${orderId} marked as ${nextStatus}`);
  };

  const handleSaveFee = (serviceId) => {
    if (tempFee.trim()) {
      updateServiceFee(serviceId, tempFee.trim());
      showToast('Service fee updated successfully across all patient views');
    }
    setEditingServiceId(null);
  };

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = (apt.patientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (apt.phone || '').includes(searchTerm) ||
      (apt.reason || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || apt.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex-1 flex flex-col gap-6 pb-24">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Welcome & Dispensary Command Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-emerald-900 via-teal-950 to-slate-950 text-white p-6 sm:p-8 shadow-2xl border border-emerald-500/30">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>Lead Pharmacist Command Center</span>
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" title="Dispensary Active" />
              <span className="text-xs font-bold text-emerald-300">Live & Open for Onitsha Consultations</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {pharmacyProfile.pharmacistName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              {pharmacyProfile.name} &bull; {pharmacyProfile.address}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/pharmacist')}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 border border-white/20 transition-all cursor-pointer"
            >
              <Eye size={15} className="text-emerald-300" />
              <span>Preview Public Profile</span>
            </button>

            <button
              onClick={() => navigate('/telehealth')}
              className="px-4 py-2.5 rounded-2xl bg-linear-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
            >
              <Video size={15} />
              <span>Launch Virtual Telehealth Room</span>
            </button>
          </div>
        </div>
      </div>

      {/* Priority Pharmacist Approval Banner */}
      {pendingAppointments.length > 0 && (
        <div className="p-5 rounded-3xl bg-linear-to-r from-amber-500/15 via-emerald-500/10 to-teal-500/15 border-2 border-amber-400/60 dark:border-amber-500/40 shadow-xl space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black text-sm shadow-md animate-bounce">
                {pendingAppointments.length}
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Patient Consultation Requests Awaiting Your Approval</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Review and approve these appointments to confirm the patient's consultation slot
                </p>
              </div>
            </div>
            <span className="text-[11px] font-black uppercase px-3 py-1 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300 w-fit">
              Action Required
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingAppointments.map(apt => (
              <div 
                key={apt._id} 
                onClick={() => setSelectedAppointment(apt)}
                className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700/60 shadow-md space-y-3 cursor-pointer hover:border-amber-500 hover:shadow-lg transition-all group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">{apt.patientName}</h4>
                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{apt.serviceName || apt.reason || 'Clinical Consultation'}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Requested: <strong>{apt.date}</strong> at <strong>{apt.time}</strong> &bull; {apt.phone || 'No phone'}
                    </p>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setSelectedAppointment(apt); }}
                    className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 hover:bg-amber-100 text-[10px] font-extrabold flex items-center gap-1 cursor-pointer"
                    title="Inspect Full Consultation Dossier"
                  >
                    <Eye size={12} />
                    <span>Dossier</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-700" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleUpdateStatus(apt._id, 'Confirmed')}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all"
                  >
                    <CheckCircle2 size={15} />
                    <span>Approve Consultation</span>
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(apt._id, 'Cancelled')}
                    className="py-2 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 font-bold text-xs cursor-pointer transition-colors"
                  >
                    Decline
                  </button>
                  {apt.phone && (
                    <a
                      href={`https://wa.me/${apt.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(apt.patientName)},%20this%20is%20Pharm.%20Chinedu%20Nwankwo%20from%20Your%20Health%20Pharmacy,%20Onitsha%20regarding%20your%20consultation%20booking.`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition-colors"
                      title="Chat with Patient on WhatsApp"
                    >
                      <MessageCircle size={15} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metric Counters (Interactive & Clickable) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4" id="metrics-bar">
        <div 
          onClick={() => {
            setActiveTab('bookings');
            setFilterStatus('All');
            setTimeout(() => {
              const el = document.getElementById('consultations-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 50);
          }}
          className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-lg transition-all cursor-pointer group active:scale-98"
          title="Click to view Booked Consultations"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold group-hover:text-emerald-600 transition-colors">Booked Consultations</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar size={18} />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">{appointments.length}</p>
          <span className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
            <span>View Active Pipeline</span>
            <ArrowRight size={12} />
          </span>
        </div>

        <div 
          onClick={() => {
            setActiveTab('deliveries');
            setTimeout(() => {
              const el = document.getElementById('orders-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 50);
          }}
          className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer group active:scale-98"
          title="Click to view Onitsha Doorstep Orders"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold group-hover:text-blue-600 transition-colors">Doorstep Orders (Onitsha)</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Truck size={18} />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">{orders.length}</p>
          <span className="text-[11px] text-blue-600 font-bold mt-1 flex items-center gap-1">
            <span>Across GRA, 3-3 & Fegge</span>
            <ArrowRight size={12} />
          </span>
        </div>

        <div 
          onClick={() => setShowWaitingQueueModal(true)}
          className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-lg transition-all cursor-pointer group active:scale-98"
          title="Click to open Dispensary Waiting Room Queue"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold group-hover:text-amber-600 transition-colors">Waiting Room Queue</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Activity size={18} />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">{waitingQueue.length} In Waiting</p>
          <span className="text-[11px] text-amber-600 font-bold mt-1 flex items-center gap-1">
            <span>Dispensary Counter 2 Active</span>
            <ArrowRight size={12} />
          </span>
        </div>

        <div 
          onClick={() => navigate('/pharmacist')}
          className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-lg transition-all cursor-pointer group active:scale-98"
          title="Click to view NAFDAC MAS Authenticity Verifier"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold group-hover:text-teal-600 transition-colors">PCN Verified Drugs</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldCheck size={18} />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">100% Sealed</p>
          <span className="text-[11px] text-teal-600 font-bold mt-1 flex items-center gap-1">
            <span>NAFDAC MAS Protected</span>
            <ArrowRight size={12} />
          </span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`pb-3 px-4 text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'bookings'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <Calendar size={16} />
          <span>Patient Consultations ({appointments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('deliveries')}
          className={`pb-3 px-4 text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'deliveries'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <Truck size={16} />
          <span>Onitsha Doorstep Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('activity')}
          className={`pb-3 px-4 text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'activity'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <Activity size={16} />
          <span>Live Visitor & Scanner Stream</span>
        </button>

        <button
          onClick={() => setActiveTab('pricing')}
          className={`pb-3 px-4 text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'pricing'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <Edit3 size={16} />
          <span>Manage Clinical Pricing Tiers</span>
        </button>
      </div>

      {/* Tab 1: Booked Patient Consultations */}
      {activeTab === 'bookings' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
          
          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search patient name, phone, or service..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              {['All', 'Confirmed', 'Pending', 'Completed'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    filterStatus === st
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
              <button
                onClick={fetchAppointments}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-emerald-600 transition-colors"
                title="Refresh Bookings"
              >
                <RefreshCw size={15} className={loadingApts ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>

          {/* Bookings Table / Cards */}
          {filteredAppointments.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs space-y-2">
              <AlertCircle size={28} className="mx-auto text-slate-300" />
              <p>No booked consultations match your filter.</p>
            </div>
          ) : (
            <div className="space-y-3" id="consultations-section">
              {filteredAppointments.map((apt) => (
                <div
                  key={apt._id}
                  onClick={() => setSelectedAppointment(apt)}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500/60 bg-slate-50/50 dark:bg-slate-800/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:shadow-md group"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {apt.patientName}
                      </h4>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        apt.status === 'Confirmed' 
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : apt.status === 'Completed'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}>
                        {apt.status}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                      {apt.serviceName || apt.reason || 'Clinical Pharmacist Consultation'}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock size={13} className="text-emerald-500" />
                        {apt.date} &bull; {apt.time}
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <Phone size={13} className="text-emerald-500" />
                        {apt.phone || 'No phone provided'}
                      </span>
                      {apt.fee && (
                        <>
                          <span>&bull;</span>
                          <span className="font-extrabold text-slate-800 dark:text-slate-200">{apt.fee}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Pharmacist Actions */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setSelectedAppointment(apt)}
                      className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                      title="Inspect Full Patient Dossier & Notes"
                    >
                      <Eye size={13} />
                      <span>Dossier</span>
                    </button>

                    {apt.status !== 'Confirmed' && (
                      <button
                        onClick={() => handleUpdateStatus(apt._id, 'Confirmed')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                      >
                        <CheckCircle2 size={13} />
                        <span>Confirm</span>
                      </button>
                    )}

                    {apt.status !== 'Completed' && (
                      <button
                        onClick={() => handleUpdateStatus(apt._id, 'Completed')}
                        className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-300 cursor-pointer transition-colors"
                      >
                        Mark Completed
                      </button>
                    )}

                    {apt.phone && (
                      <a
                        href={`https://wa.me/${apt.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(apt.patientName)},%20this%20is%20Pharm.%20Chinedu%20Nwankwo%20from%20Your%20Health%20Pharmacy,%20Onitsha%20regarding%20your%20upcoming%20consultation.`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 font-bold text-xs flex items-center gap-1 hover:bg-emerald-100"
                      >
                        <MessageCircle size={13} />
                        <span>WhatsApp</span>
                      </a>
                    )}

                    <button
                      onClick={() => setSelectedReceipt(apt)}
                      className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-700 font-bold text-xs flex items-center gap-1 cursor-pointer hover:bg-purple-100 transition-colors"
                      title="Generate & Print Clinical Dispensary Slip"
                    >
                      <Printer size={13} />
                      <span>Print Rx</span>
                    </button>

                    <button
                      onClick={() => navigate('/telehealth')}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700 font-bold text-xs flex items-center gap-1 cursor-pointer hover:bg-blue-100"
                    >
                      <Video size={13} />
                      <span>Telehealth</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* Tab 2: Onitsha Doorstep Orders */}
      {activeTab === 'deliveries' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Truck size={18} className="text-blue-500" />
                <span>Active Prescription Dispatches & Onitsha Doorstep Courier</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track prescriptions uploaded by residents in GRA, 3-3, Fegge, and Awka Road
              </p>
            </div>
          </div>

          <div className="space-y-4" id="orders-section">
            {orders.map((ord) => (
              <div
                key={ord.id}
                onClick={() => setSelectedOrder(ord)}
                className="p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-blue-400 dark:hover:border-blue-500/60 hover:shadow-xl transition-all flex flex-col gap-3.5 cursor-pointer group"
              >
                {/* Top Row: Patient Name, Type, Urgency, Date & Amount */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-200/60 dark:border-slate-800/80">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {ord.patientName}
                    </h4>
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                      {ord.orderType}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50">
                      {ord.urgency}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 self-start sm:self-auto">
                    <span className="text-xs text-slate-400 font-semibold">{ord.date}</span>
                    <span className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 font-black text-xs sm:text-sm">
                      {ord.amount}
                    </span>
                  </div>
                </div>

                {/* Middle Info Details: Neighborhood, Medications, Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <MapPin size={15} className="text-emerald-500 shrink-0" />
                    <span className="truncate">
                      Zone: <strong className="text-slate-800 dark:text-slate-200 font-bold">{ord.zone}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 md:col-span-1 lg:col-span-2">
                    <Pill size={15} className="text-blue-500 shrink-0" />
                    <span className="truncate">
                      Items: <span className="font-medium text-slate-700 dark:text-slate-300">{ord.medications}</span>
                    </span>
                  </div>
                </div>

                {/* Bottom Action Toolbar: Clean 2-Tier Responsive Grouping */}
                <div 
                  className="pt-3 mt-1 border-t border-slate-200/60 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2.5" 
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Left Group: Clinical & Document Inspection */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                      title="View full prescription order details"
                    >
                      <Eye size={13} />
                      <span>Order Details</span>
                    </button>

                    {ord.orderType?.includes('Prescription') && (
                      <button
                        onClick={() => {
                          setActivePrescriptionSlip(ord);
                          setSlipZoom(1);
                          setSlipRotation(0);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                        title="Inspect Doctor Prescription Slip with Zoom"
                      >
                        <FileText size={13} />
                        <span>View Rx Slip</span>
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedReceipt(ord)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                      title="Print Delivery Dispatch Receipt"
                    >
                      <Printer size={13} />
                      <span>Print Receipt</span>
                    </button>
                  </div>

                  {/* Right Group: Status, Courier Fulfillment & Patient WhatsApp */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-3 py-1 rounded-xl text-xs font-black flex items-center gap-1.5 ${
                      ord.status === 'Delivered' 
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700' 
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${ord.status === 'Delivered' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                      <span>{ord.status}</span>
                    </span>

                    {ord.status !== 'Delivered' && (
                      <button
                        onClick={() => handleOrderStatusUpdate(ord.id, 'Delivered')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
                      >
                        <CheckCircle2 size={13} />
                        <span>Confirm Delivery</span>
                      </button>
                    )}

                    <a
                      href={`https://wa.me/${ord.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(ord.patientName)},%20this%20is%20Pharm.%20Chinedu%20from%20Your%20Health%20Pharmacy%20Onitsha%20regarding%20your%20medication%20delivery%20order.`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                      title="Open WhatsApp chat with patient"
                    >
                      <MessageCircle size={13} />
                      <span>WhatsApp</span>
                    </a>

                    <a
                      href={`https://wa.me/${ord.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(ord.patientName)},%20this%20is%20Pharm.%20Chinedu%20Nwankwo%20from%20Your%20Health%20Pharmacy,%20GRA%20Onitsha.%20Your%20medication%20supply%20(${encodeURIComponent(ord.medications)})%20is%20due%20for%20refill.%20Would%20you%20like%20us%20to%20package%20your%20refill%20for%20same-day%20doorstep%20delivery%20in%20Onitsha%20today?`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                      title="Send 30-Day WhatsApp Refill Due Alert"
                    >
                      <Calendar size={13} className="text-amber-600" />
                      <span>Send Refill Alert</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Live Visitor & Activity Stream */}
      {activeTab === 'activity' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Activity size={18} className="text-emerald-500" />
              <span>Real-Time Website Activity & Scanner Audit Log</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live audit stream of patient visits, drug authenticity verifications, and prescription refills
            </p>
          </div>

          <div className="space-y-3" id="activity-section">
            {activityLogs.length > 0 ? (
              activityLogs.map((log) => (
                <div 
                  key={log._id || log.id}
                  onClick={() => {
                    if (log.type === 'appointment_booked' || log.appointmentId) {
                      const match = appointments.find(a => 
                        (log.appointmentId && (a._id === log.appointmentId._id || a._id === log.appointmentId)) ||
                        (a.patientName && log.userName && a.patientName.toLowerCase() === log.userName.toLowerCase())
                      ) || log.appointmentId || log.metadata || {
                        patientName: log.userName,
                        phone: log.details?.match(/Phone:\s*([^\s•]+)/)?.[1] || '',
                        email: log.userEmail || '',
                        date: log.details?.match(/Date:\s*([^\s•]+)/)?.[1] || 'Today',
                        time: log.details?.match(/at\s*([^\s•]+(?:\s*[AP]M)?)/i)?.[1] || 'Scheduled',
                        serviceName: log.message || 'Clinical Consultation',
                        reason: log.message,
                        status: 'Pending'
                      };
                      setSelectedAppointment(match);
                    } else {
                      setSelectedActivityLog(log);
                    }
                  }}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex items-start gap-3.5 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    log.type === 'user_login' 
                      ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300' 
                      : log.type === 'appointment_booked'
                      ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-300'
                      : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300'
                  }`}>
                    {log.type === 'user_login' ? <User size={15} /> : log.type === 'appointment_booked' ? <Calendar size={15} /> : <CheckCircle2 size={15} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 transition-colors">
                        {log.message}
                      </p>
                      <span className="text-[10px] text-slate-400 font-medium shrink-0">
                        {log.createdAt ? new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                      </span>
                    </div>
                    {log.details && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">{log.details}</p>
                    )}
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <span>{log.type === 'appointment_booked' ? 'View consultation request & approve' : 'View event details'}</span>
                      <ArrowRight size={10} />
                    </span>
                  </div>
                </div>
              ))
            ) : (
              INITIAL_VISITOR_LOGS.map((log, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-3.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{log.event}</p>
                    <span className="text-[10px] text-slate-400 font-medium">{log.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Manage Clinical Pricing Tiers */}
      {activeTab === 'pricing' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Edit3 size={18} className="text-emerald-500" />
              <span>Consultation Services & Fee Administration</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Adjust consultation fees and pricing packages on the fly. Changes are saved immediately and update on all public screens.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pharmacyProfile.services?.map((srv) => (
              <div key={srv.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                    {srv.category}
                  </span>
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                    {srv.fee}
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{srv.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{srv.desc}</p>
                </div>

                {editingServiceId === srv.id ? (
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="text"
                      value={tempFee}
                      onChange={(e) => setTempFee(e.target.value)}
                      placeholder="e.g. ₦12,000 / Session"
                      className="flex-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-xs font-bold text-slate-900 dark:text-white"
                    />
                    <button
                      onClick={() => handleSaveFee(srv.id)}
                      className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 cursor-pointer flex items-center gap-1"
                    >
                      <Save size={13} />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={() => setEditingServiceId(null)}
                      className="p-1.5 text-slate-400 hover:text-slate-600"
                    >
                      <X size={15} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setEditingServiceId(srv.id);
                      setTempFee(srv.fee);
                    }}
                    className="pt-2 text-xs font-extrabold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 size={13} />
                    <span>Change Consultation Fee</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 1. Consultation Details & Pharmacist Approval Modal ── */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-black text-base flex items-center justify-center shadow-inner">
                  {selectedAppointment.patientName ? selectedAppointment.patientName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'PT'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                      {selectedAppointment.patientName}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      selectedAppointment.status === 'Confirmed' 
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : selectedAppointment.status === 'Completed'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                    }`}>
                      {selectedAppointment.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">
                    Clinical Patient Consultation Record &bull; Your Health Pharmacy, Onitsha
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Dossier Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Service Requested:</span>
                <p className="font-extrabold text-slate-900 dark:text-white text-sm">
                  {selectedAppointment.serviceName || selectedAppointment.reason || 'Clinical Consultation'}
                </p>
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  {selectedAppointment.fee || 'Standard MTM Tier (₦10,000)'}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Scheduled Appointment:</span>
                <p className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                  <Calendar size={14} className="text-emerald-500" />
                  <span>{selectedAppointment.date}</span>
                </p>
                <p className="text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1.5">
                  <Clock size={14} className="text-emerald-500" />
                  <span>{selectedAppointment.time}</span>
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Contact Phone:</span>
                <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Phone size={14} className="text-emerald-500" />
                  <span>{selectedAppointment.phone || 'No phone recorded'}</span>
                </p>
                {selectedAppointment.phone && (
                  <div className="pt-1 flex items-center gap-2">
                    <a
                      href={`tel:${selectedAppointment.phone}`}
                      className="text-[11px] text-emerald-600 font-bold hover:underline"
                    >
                      Call Patient
                    </a>
                    <span>&bull;</span>
                    <a
                      href={`https://wa.me/${selectedAppointment.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(selectedAppointment.patientName)},%20this%20is%20Pharm.%20Chinedu%20Nwankwo%20from%20Your%20Health%20Pharmacy,%20Onitsha%20regarding%20your%20consultation.`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-emerald-600 font-bold hover:underline flex items-center gap-1"
                    >
                      <MessageCircle size={11} />
                      <span>WhatsApp Direct</span>
                    </a>
                  </div>
                )}
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Email Address:</span>
                <p className="font-bold text-slate-900 dark:text-white truncate flex items-center gap-1.5">
                  <Mail size={14} className="text-blue-500" />
                  <span>{selectedAppointment.email || 'patient@medclinic.com'}</span>
                </p>
                <span className="text-[11px] text-slate-400 block">Account Status: Verified Patient</span>
              </div>
            </div>

            {/* Clinical Notes / Patient Complaint */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px]">
                <MapPin size={13} className="text-emerald-500" />
                <span>Consultation Location:</span>
              </div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Your Health Pharmacy (Consultation Room 1), 1 Nwankwo Chinedu Crescent, off Ogbatuluenyi Drive, GRA Federal Housing Estate, Onitsha
              </p>
              {selectedAppointment.reason && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Patient Notes / Reason:</span>
                  <p className="text-slate-700 dark:text-slate-300 italic mt-0.5">
                    "{selectedAppointment.reason}"
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              {selectedAppointment.status === 'Pending' ? (
                <>
                  <button
                    onClick={() => handleUpdateStatus(selectedAppointment._id, 'Confirmed')}
                    className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
                  >
                    <CheckCircle2 size={16} />
                    <span>Approve Consultation Now</span>
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(selectedAppointment._id, 'Cancelled')}
                    className="py-3 px-4 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Decline
                  </button>
                </>
              ) : selectedAppointment.status === 'Confirmed' ? (
                <>
                  <button
                    onClick={() => {
                      setSelectedAppointment(null);
                      navigate('/telehealth');
                    }}
                    className="flex-1 py-3 px-4 bg-linear-to-r from-emerald-600 to-teal-600 text-white font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <Video size={16} />
                    <span>Launch Telehealth Room</span>
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(selectedAppointment._id, 'Completed')}
                    className="py-3 px-4 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Mark as Completed
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="flex-1 py-3 px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs hover:bg-slate-200 transition-colors"
                >
                  Close Dossier
                </button>
              )}

              {selectedAppointment.phone && (
                <a
                  href={`https://wa.me/${selectedAppointment.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(selectedAppointment.patientName)},%20this%20is%20Pharm.%20Chinedu%20Nwankwo%20from%20Your%20Health%20Pharmacy,%20Onitsha%20regarding%20your%20consultation.`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-3 px-4 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageCircle size={15} />
                  <span>WhatsApp</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── 2. Onitsha Doorstep Order & Dispatch Modal ── */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-inner">
                  <Truck size={22} />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Order #{selectedOrder.id}</span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{selectedOrder.amount}</span>
                  </h3>
                  <span className="text-xs text-slate-400 font-medium">
                    {selectedOrder.patientName} &bull; {selectedOrder.zone}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Medications to Pack & Dispense:</span>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedOrder.medications}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Delivery Speed:</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">{selectedOrder.urgency}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Phone:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedOrder.phone}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Update Dispatch Lifecycle:</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {['Reviewing Prescription', 'Ready for Dispatch', 'Delivered'].map(st => (
                    <button
                      key={st}
                      onClick={() => {
                        handleOrderStatusUpdate(selectedOrder.id, st);
                        setSelectedOrder(prev => ({ ...prev, status: st }));
                      }}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-bold text-center transition-all cursor-pointer ${
                        selectedOrder.status === st
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-emerald-400'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <a
                href={`https://wa.me/${selectedOrder.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(selectedOrder.patientName)},%20this%20is%20Pharm.%20Chinedu%20from%20Your%20Health%20Pharmacy,%20Onitsha%20regarding%20your%20medication%20order%20%23${selectedOrder.id}.`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
              >
                <MessageCircle size={15} />
                <span>Send WhatsApp Dispatch Update</span>
              </a>
              <button
                onClick={() => setSelectedOrder(null)}
                className="py-3 px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs hover:bg-slate-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 3. Dispensary Waiting Room Queue Modal ── */}
      {showWaitingQueueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-inner">
                  <Activity size={22} />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Dispensary Waiting Room Queue</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  </h3>
                  <span className="text-xs text-slate-400 font-medium">
                    Counter 2 (Pharm. Chinedu MTM & Refills) &bull; {waitingQueue.length} Patients Waiting
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowWaitingQueueModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {calledPatient && (
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700/60 text-xs font-bold text-amber-800 dark:text-amber-200 flex items-center gap-2 animate-in fade-in">
                <Sparkles size={16} className="text-amber-500 animate-spin" />
                <span>{calledPatient}</span>
              </div>
            )}

            <div className="space-y-2.5">
              {waitingQueue.map((item, idx) => (
                <div 
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-3 hover:border-emerald-400 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-slate-900 text-white dark:bg-slate-700">
                      {item.token}
                    </span>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white">{item.patient}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{item.service}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-semibold">{item.wait}</span>
                    <button
                      onClick={() => playQueueChime(item.token, item.patient)}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                      title="Play electronic call bell chime"
                    >
                      <Volume2 size={13} />
                      <span>Call Now</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={() => {
                  setShowWaitingQueueModal(false);
                  navigate('/queue');
                }}
                className="flex-1 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Open Full Hospital Waiting Board</span>
                <ArrowRight size={15} />
              </button>
              <button
                onClick={() => setShowWaitingQueueModal(false)}
                className="py-3 px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs hover:bg-slate-200 transition-colors"
              >
                Close Queue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 4. Real-Time Activity & Visitor Event Modal ── */}
      {selectedActivityLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {selectedActivityLog.userName} ({selectedActivityLog.role})
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    {selectedActivityLog.createdAt ? new Date(selectedActivityLog.createdAt).toLocaleString() : 'Recent Activity'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedActivityLog(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-700 dark:text-slate-200 leading-relaxed space-y-2">
              <p className="font-bold text-slate-900 dark:text-white">{selectedActivityLog.message}</p>
              {selectedActivityLog.details && (
                <p className="text-slate-500 dark:text-slate-400">{selectedActivityLog.details}</p>
              )}
              {selectedActivityLog.userEmail && (
                <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-700">
                  Email: <strong>{selectedActivityLog.userEmail}</strong>
                </p>
              )}
            </div>

            <button
              onClick={() => setSelectedActivityLog(null)}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ── 5. Printable Dispensary Receipt & Prescription Slip Modal ── */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors print:hidden cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Printable Content Container with id for targeted printing */}
            <div id="printable-dispensary-receipt" className="space-y-5">
              
              {/* Receipt Header */}
              <div className="text-center border-b border-dashed border-slate-300 pb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full text-emerald-800 text-[10px] font-black uppercase tracking-wider mb-2">
                  <ShieldCheck size={13} className="text-emerald-600" />
                  <span>Your Health Pharmacy & MedClinic Onitsha</span>
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  OFFICIAL DISPENSARY RECEIPT & CLINICAL SLIP
                </h2>
                <p className="text-[11px] text-slate-500 mt-1">
                  No. 4 Oguta Road / Court Road Commercial Area, Onitsha, Anambra State<br />
                  Phone: +234 702 505 1669 &bull; PCN Premise Reg #PH-ONIT-2026-991
                </p>
                <div className="mt-2 inline-block px-3 py-0.5 rounded-md bg-slate-100 text-[10px] font-mono font-bold text-slate-700">
                  NAFDAC MAS Verified Dispensary &bull; 100% Genuine Medication Guarantee
                </div>
              </div>

              {/* Patient & Voucher Metadata */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Patient Name</span>
                  <strong className="text-slate-900 font-bold text-sm">
                    {selectedReceipt.patientName}
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Token / Receipt ID</span>
                  <strong className="font-mono text-emerald-700 font-black text-sm">
                    {selectedReceipt.token || selectedReceipt._id ? `MC-${String(selectedReceipt._id || selectedReceipt.id).substring(0, 6).toUpperCase()}` : 'MC-DISP-2026'}
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Phone Contact</span>
                  <span className="font-semibold text-slate-700">{selectedReceipt.phone || '+234 803 ...'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Date & Time</span>
                  <span className="font-semibold text-slate-700">
                    {selectedReceipt.date || new Date().toLocaleDateString()} {selectedReceipt.time || ''}
                  </span>
                </div>
              </div>

              {/* Clinical Service or Prescribed Medications */}
              <div className="border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-700">Item / Prescription Details</span>
                  <span className="text-[11px] font-bold text-slate-500">Status: Dispensed / Validated</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>
                      {selectedReceipt.medications || selectedReceipt.serviceName || selectedReceipt.reason || 'Clinical Medication Therapy & Dispensing'}
                    </span>
                    <span className="font-mono text-emerald-700 font-extrabold">
                      {selectedReceipt.amount || selectedReceipt.fee || '₦10,000'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed">
                    <strong>Dosage & Patient Safety Instructions:</strong><br />
                    Take medications exactly as scheduled with clean water. Complete the entire course even if symptoms improve. Store below 25°C away from direct sunlight. Keep out of reach of children.
                  </div>
                </div>
              </div>

              {/* Pharmacist Endorsement */}
              <div className="pt-2 flex items-end justify-between text-xs border-t border-dashed border-slate-300">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Dispensing Pharmacist</span>
                  <p className="font-extrabold text-slate-900 text-sm">Pharm. Chinedu Nwankwo, B.Pharm</p>
                  <p className="text-[10px] text-slate-500">Superintendent Pharmacist & Director</p>
                </div>
                <div className="text-right">
                  <div className="w-24 h-8 border-b-2 border-slate-800 font-cursive text-sm text-slate-800 flex items-center justify-center">
                    C. Nwankwo
                  </div>
                  <span className="text-[9px] text-slate-400 block mt-1">Official Clinical Signature</span>
                </div>
              </div>

              <div className="text-center text-[10px] text-slate-400 pt-1">
                Thank you for choosing Your Health Pharmacy & MedClinic. For clinical emergencies or adverse drug reaction reports, call: +234 702 505 1669.
              </div>

            </div>

            {/* Print & Action Controls (Hidden during physical printing) */}
            <div className="pt-5 mt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-2.5 print:hidden">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <Printer size={16} />
                <span>Print Official Slip (POS / A4)</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── 6. Prescription Slip High-Resolution Zoom & Rotate Viewer Modal ── */}
      {activePrescriptionSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm">
                    Prescription Slip Review: {activePrescriptionSlip.patientName}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Uploaded Order #{activePrescriptionSlip.id} &bull; Zone: {activePrescriptionSlip.zone}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setActivePrescriptionSlip(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Toolbar for Zoom & Rotation */}
            <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800/80 p-2 rounded-2xl mb-4 text-xs font-bold text-slate-700 dark:text-slate-200">
              <span className="text-[11px] text-slate-400">Controls:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSlipZoom(prev => Math.min(prev + 0.25, 2.5))}
                  className="p-1.5 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center gap-1 cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn size={14} />
                  <span>Zoom In</span>
                </button>
                <button
                  onClick={() => setSlipZoom(prev => Math.max(prev - 0.25, 0.75))}
                  className="p-1.5 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center gap-1 cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut size={14} />
                  <span>Zoom Out</span>
                </button>
                <button
                  onClick={() => setSlipRotation(prev => (prev + 90) % 360)}
                  className="p-1.5 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center gap-1 cursor-pointer"
                  title="Rotate 90°"
                >
                  <RotateCw size={14} />
                  <span>Rotate</span>
                </button>
                <button
                  onClick={() => { setSlipZoom(1); setSlipRotation(0); }}
                  className="p-1.5 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-[11px] cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Inspection Canvas Area */}
            <div className="flex-1 overflow-auto bg-slate-950 rounded-2xl p-4 flex items-center justify-center min-h-[300px] border border-slate-800">
              <div
                style={{
                  transform: `scale(${slipZoom}) rotate(${slipRotation}deg)`,
                  transition: 'transform 0.2s ease-in-out'
                }}
                className="max-w-md w-full bg-white text-slate-950 p-6 rounded-xl shadow-2xl border border-slate-300 font-serif"
              >
                {/* Simulated Authentic Doctor Prescription Paper */}
                <div className="border-b-2 border-slate-900 pb-3 mb-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm tracking-wide">ANAMBRA SPECIALIST CLINIC</h4>
                    <p className="text-[10px] text-slate-600">Department of Internal Medicine & Cardiometabolic Care</p>
                    <p className="text-[9px] text-slate-500">Dr. K. C. Okeke, MBBS, FWACP (Reg #MDCN-64910)</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold font-serif text-blue-900">℞</span>
                    <p className="text-[10px] text-slate-500 font-mono">Date: 22-09-2026</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <p><strong>Patient:</strong> {activePrescriptionSlip.patientName} &bull; <strong>Age:</strong> 48 &bull; <strong>BP:</strong> 138/88 mmHg</p>
                  
                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <p className="font-bold text-sm text-slate-900">
                      1. Tab. Augmentin 625mg &mdash; 1 tab 12 hourly x 7 days
                    </p>
                    <p className="text-[11px] text-slate-600 italic">
                      (Dispense with food & adequate water)
                    </p>
                    <p className="font-bold text-sm text-slate-900">
                      2. Tab. Paracetamol 500mg &mdash; 2 tabs 8 hourly PRN x 3 days
                    </p>
                    <p className="font-bold text-sm text-slate-900">
                      3. Tab. Vitamin C 1000mg Effervescent &mdash; 1 tab daily x 10 days
                    </p>
                  </div>

                  <div className="pt-6 flex items-end justify-between border-t border-slate-200 mt-4">
                    <div className="w-28 h-6 border-b border-slate-800 text-[10px] italic">
                      K. C. Okeke
                    </div>
                    <span className="text-[9px] text-slate-400">Doctor Signature & Stamp Verified</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Approval & Dispatch Action */}
            <div className="pt-4 flex flex-col sm:flex-row gap-2.5 border-t border-slate-100 dark:border-slate-800 mt-4">
              <button
                type="button"
                onClick={() => {
                  handleOrderStatusUpdate(activePrescriptionSlip.id, 'Ready for Dispatch');
                  setActivePrescriptionSlip(null);
                  showToast(`Prescription approved! Order #${activePrescriptionSlip.id} marked as Ready for Dispatch.`);
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <CheckCircle2 size={16} />
                <span>Approve Prescription & Mark Ready for Dispatch</span>
              </button>

              <button
                type="button"
                onClick={() => setActivePrescriptionSlip(null)}
                className="py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer"
              >
                Close Viewer
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
