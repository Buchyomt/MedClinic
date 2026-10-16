import { API_BASE_URL } from '../config/api';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, CheckCheck, X, Calendar, Stethoscope, 
  UserPlus, CheckCircle2, User, ShieldCheck, 
  MessageCircle, ArrowRight, Clock 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function NotificationPanel() {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedModalNotification, setSelectedModalNotification] = useState(null);

  const getInitialNotifications = () => {
    if (role === 'pharmacist') {
      return [
        {
          id: 'ph-init-1',
          title: 'Pharmacist Command Active',
          message: 'Monitoring Onitsha appointments, visitor logins & prescription dispatch.',
          time: 'Active now',
          icon: <ShieldCheck className="text-emerald-500" size={16} />,
          unread: false
        }
      ];
    }

    if (role === 'doctor') {
      return [
        {
          id: 1,
          title: 'New Assigned Patient',
          message: 'John Smith booked a consultation for 10:30 AM today.',
          time: '10 mins ago',
          icon: <Stethoscope className="text-purple-600" size={16} />,
          unread: true
        },
        {
          id: 2,
          title: 'Lab Results Ready',
          message: 'EHR Lab panel results uploaded for Patient Sarah Jenkins.',
          time: '1 hour ago',
          icon: <CheckCircle2 className="text-emerald-600" size={16} />,
          unread: true
        },
        {
          id: 3,
          title: 'Peer Consultation Request',
          message: 'Dr. Michael Chen requested a case review for Patient Alex.',
          time: '3 hours ago',
          icon: <UserPlus className="text-blue-600" size={16} />,
          unread: false
        }
      ];
    }

    if (role === 'receptionist') {
      return [
        {
          id: 1,
          title: 'Walk-In Registered',
          message: 'Patient Samuel Okafor registered and assigned to Dr. Sarah.',
          time: '5 mins ago',
          icon: <UserPlus className="text-emerald-600" size={16} />,
          unread: true
        },
        {
          id: 2,
          title: 'Consultation Fee Cleared',
          message: 'POS payment verified for Token #MC-103 (Ade Johnson).',
          time: '25 mins ago',
          icon: <CheckCircle2 className="text-emerald-600" size={16} />,
          unread: false
        }
      ];
    }

    return [
      {
        id: 1,
        title: 'Appointment Reminder',
        message: 'Your consultation with Dr. Sarah Jenkins is scheduled for tomorrow at 10:00 AM.',
        time: '30 mins ago',
        icon: <Calendar className="text-primary" size={16} />,
        unread: true
      },
      {
        id: 2,
        title: 'Prescription Issued',
        message: 'Dr. Sarah issued an e-Prescription (Amoxicillin 500mg). View in Medical Records.',
        time: '2 hours ago',
        icon: <CheckCircle2 className="text-emerald-600" size={16} />,
        unread: true
      },
      {
        id: 3,
        title: 'Payment Confirmed',
        message: 'Consultation fee receipt #MC-9482 verified successfully.',
        time: '1 day ago',
        icon: <CheckCircle2 className="text-blue-600" size={16} />,
        unread: false
      }
    ];
  };

  const [notifications, setNotifications] = useState(getInitialNotifications);

  useEffect(() => {
    if (role === 'pharmacist') {
      const fetchPharmacistAlerts = async () => {
        try {
          const [aptsRes, actRes] = await Promise.all([
            fetch(`${API_BASE_URL}/api/appointments`),
            fetch(`${API_BASE_URL}/api/activity`)
          ]);

          const apts = aptsRes.ok ? await aptsRes.json() : [];
          const logs = actRes.ok ? await actRes.json() : [];

          const pendingList = (Array.isArray(apts) ? apts : [])
            .filter(a => a.status === 'Pending')
            .map(a => ({
              id: `pending-${a._id}`,
              aptId: a._id,
              title: '⚠️ Appointment Awaiting Approval',
              message: `${a.patientName} booked ${a.serviceName || a.reason || 'Clinical Consultation'} for ${a.date} at ${a.time}`,
              time: 'Pending Review',
              icon: <Calendar className="text-amber-500" size={16} />,
              unread: true,
              isPending: true,
              rawAppointment: a
            }));

          const loginList = (Array.isArray(logs) ? logs : [])
            .filter(l => l.type === 'user_login')
            .slice(0, 5)
            .map(l => ({
              id: `act-${l._id}`,
              title: '👤 Patient / Visitor Login',
              message: l.message,
              time: l.createdAt ? new Date(l.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
              icon: <User className="text-blue-500" size={16} />,
              unread: false,
              rawLog: l
            }));

          setNotifications([...pendingList, ...loginList]);
        } catch (err) {
          console.error('Failed to load pharmacist notifications:', err);
        }
      };

      fetchPharmacistAlerts();
      const interval = setInterval(fetchPharmacistAlerts, 10000);
      return () => clearInterval(interval);
    } else if (role === 'patient') {
      // STRICT PATIENT NOTIFICATIONS: Only show updates for this patient's own bookings
      const fetchPatientAlerts = async () => {
        try {
          const aptsRes = await fetch(`${API_BASE_URL}/api/appointments`);
          const apts = aptsRes.ok ? await aptsRes.json() : [];

          const myApts = (Array.isArray(apts) ? apts : []).filter(a => {
            const matchesEmail = a.email && user?.email && a.email.toLowerCase() === user.email.toLowerCase();
            const matchesName = a.patientName && user?.name && a.patientName.toLowerCase().includes(user.name.split(' ')[0].toLowerCase());
            return matchesEmail || matchesName;
          });

          const patientNotifications = myApts.map(a => {
            if (a.status === 'Pending') {
              return {
                id: `patient-apt-${a._id}`,
                aptId: a._id,
                title: '⏳ Consultation Submitted (Under Review)',
                message: `Your booking for ${a.serviceName || 'Consultation'} with ${a.providerName || 'Pharm. Chinedu'} on ${a.date} at ${a.time} is awaiting approval.`,
                time: 'Awaiting Pharmacy Approval',
                icon: <Clock className="text-amber-500" size={16} />,
                unread: true,
                isPending: false,
                rawAppointment: a
              };
            }
            if (a.status === 'Confirmed') {
              return {
                id: `patient-apt-${a._id}`,
                aptId: a._id,
                title: '✅ Consultation Confirmed & Approved',
                message: `Pharm. Chinedu confirmed your visit on ${a.date} at ${a.time}. Join via Telehealth or visit the dispensary.`,
                time: 'Confirmed',
                icon: <CheckCircle2 className="text-emerald-500" size={16} />,
                unread: false,
                isPending: false,
                rawAppointment: a
              };
            }
            return {
              id: `patient-apt-${a._id}`,
              aptId: a._id,
              title: 'Clinical Consultation Record',
              message: `Visit on ${a.date} at ${a.time} (${a.status}).`,
              time: a.status,
              icon: <Calendar className="text-blue-500" size={16} />,
              unread: false,
              isPending: false,
              rawAppointment: a
            };
          });

          const welcomeNotif = {
            id: 'welcome-patient',
            title: '🏥 Welcome to MedClinic Healthcare',
            message: `Hello ${user?.name ? user.name.split(' ')[0] : 'there'}! Your account is active. Book specialist consultations or order genuine medications from Your Health Pharmacy, Onitsha.`,
            time: 'Account Active',
            icon: <ShieldCheck className="text-blue-500" size={16} />,
            unread: false
          };

          setNotifications(patientNotifications.length > 0 ? [...patientNotifications, welcomeNotif] : [
            welcomeNotif,
            {
              id: 'med-delivery-tip',
              title: '💊 Authentic Medicines & Refills',
              message: 'Check live medicine stock and request doorstep delivery across Onitsha directly via WhatsApp.',
              time: 'Dispensary Tip',
              icon: <CheckCircle2 className="text-emerald-500" size={16} />,
              unread: false
            }
          ]);
        } catch (err) {
          console.error('Failed to load patient notifications:', err);
        }
      };

      fetchPatientAlerts();
      const interval = setInterval(fetchPatientAlerts, 10000);
      return () => clearInterval(interval);
    } else {
      setNotifications(getInitialNotifications());
    }
  }, [role, user?.email, user?.name]);

  const handleApproveInline = async (e, aptId) => {
    if (e && e.stopPropagation) e.stopPropagation();
    try {
      await fetch(`${API_BASE_URL}/api/appointments/${aptId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Confirmed' })
      });
      setNotifications(prev => prev.filter(n => n.aptId !== aptId));
    } catch {
      // ignore
    }
  };

  const handleDeclineInline = async (e, aptId) => {
    if (e && e.stopPropagation) e.stopPropagation();
    try {
      await fetch(`${API_BASE_URL}/api/appointments/${aptId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Cancelled' })
      });
      setNotifications(prev => prev.filter(n => n.aptId !== aptId));
    } catch {
      // ignore
    }
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const toggleRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: !n.unread } : n));
  };

  const handleNotificationClick = (n) => {
    toggleRead(n.id);
    setSelectedModalNotification(n);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 w-10 h-10 rounded-full flex items-center justify-center shadow-sm hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
        title="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800 animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="fixed inset-x-3 top-16 sm:inset-x-auto sm:right-0 sm:top-auto sm:mt-3 w-auto sm:w-96 max-w-md sm:max-w-none mx-auto sm:mx-0 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell size={18} className="text-primary dark:text-cyan-400" />
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-bold bg-primary/10 text-primary dark:text-cyan-400 px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[11px] font-bold text-primary dark:text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <CheckCheck size={14} />
                    Read all
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-200"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/50">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors cursor-pointer flex gap-3 ${
                    n.unread ? 'bg-blue-50/40 dark:bg-slate-700/30' : ''
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
                    {n.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-0.5">
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                        {n.title}
                        {n.unread && (
                          <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
                        )}
                      </h4>
                      <span className="text-[10px] text-gray-400">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-gray-600 dark:text-slate-300 leading-snug">
                      {n.message}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      {role === 'pharmacist' && n.isPending && (
                        <button
                          onClick={(e) => handleApproveInline(e, n.aptId)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCircle2 size={12} />
                          Approve
                        </button>
                      )}
                      <span className="text-[10px] text-primary dark:text-cyan-400 font-bold hover:underline flex items-center gap-0.5">
                        <span>Details & Actions</span>
                        <ArrowRight size={10} />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 text-center bg-slate-50 dark:bg-slate-700/30 border-t border-slate-100 dark:border-slate-700">
              <span className="text-[11px] text-gray-400 font-medium">
                Clinic Notification Center • MediCare EHR
              </span>
            </div>
          </div>
        </>
      )}

      {selectedModalNotification && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedModalNotification(null)}
        >
          <div 
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner">
                  {selectedModalNotification.icon}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    {selectedModalNotification.title}
                  </h3>
                  <span className="text-xs text-slate-400 font-medium">
                    {selectedModalNotification.time} &bull; Clinical Notification
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedModalNotification(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-700 dark:text-slate-200 leading-relaxed space-y-2">
              <p className="font-semibold text-slate-900 dark:text-white text-sm">
                {selectedModalNotification.message}
              </p>
              {selectedModalNotification.rawAppointment && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Patient Name:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{selectedModalNotification.rawAppointment.patientName}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Phone:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{selectedModalNotification.rawAppointment.phone || 'N/A'}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Date & Time:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{selectedModalNotification.rawAppointment.date} at {selectedModalNotification.rawAppointment.time}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Current Status:</span>
                    <span className="font-extrabold text-amber-600 dark:text-amber-400">{selectedModalNotification.rawAppointment.status}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              {role === 'pharmacist' && selectedModalNotification.isPending && selectedModalNotification.aptId ? (
                <>
                  <button
                    onClick={async () => {
                      await handleApproveInline({ stopPropagation: () => {} }, selectedModalNotification.aptId);
                      setSelectedModalNotification(null);
                      setIsOpen(false);
                    }}
                    className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
                  >
                    <CheckCircle2 size={16} />
                    <span>Approve Consultation</span>
                  </button>

                  <button
                    onClick={async () => {
                      await handleDeclineInline({ stopPropagation: () => {} }, selectedModalNotification.aptId);
                      setSelectedModalNotification(null);
                      setIsOpen(false);
                    }}
                    className="py-3 px-4 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Decline
                  </button>

                  {selectedModalNotification.rawAppointment?.phone && (
                    <a
                      href={`https://wa.me/${selectedModalNotification.rawAppointment.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(selectedModalNotification.rawAppointment.patientName)},%20this%20is%20Pharm.%20Chinedu%20Nwankwo%20from%20Your%20Health%20Pharmacy,%20Onitsha.`}
                      target="_blank"
                      rel="noreferrer"
                      className="py-3 px-3.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      title="WhatsApp Patient"
                    >
                      <MessageCircle size={16} />
                      <span>WhatsApp</span>
                    </a>
                  )}
                </>
              ) : (
                <button
                  onClick={() => {
                    setSelectedModalNotification(null);
                    setIsOpen(false);
                    if (role === 'pharmacist') navigate('/dashboard');
                    else navigate('/appointments');
                  }}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-blue-600/20"
                >
                  <Calendar size={15} />
                  <span>View in My Appointments</span>
                </button>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
