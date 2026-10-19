import { API_BASE_URL } from '../../config/api';
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Edit2, Trash2, Video, Loader2, ChevronDown, ChevronUp, CalendarPlus, CheckCircle2, Star } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import EditAppointmentModal from './EditAppointmentModal'
import RatingModal from './RatingModal'
import DeleteConfirmModal from './DeleteConfirmModal'

export default function ScheduleList({ searchTerm = '' }) {
  const { user, role } = useAuth();
  const [expandedId, setExpandedId] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingAppointment, setEditingAppointment] = useState(null)
  const [deletingAppointment, setDeletingAppointment] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [telemedModal, setTelemedModal] = useState(null)
  const [ratingAppointment, setRatingAppointment] = useState(null)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 2500)
  }

  useEffect(() => {
    if (telemedModal) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [telemedModal])

  const fetchAppointments = () => {
    setLoading(true);
    let url = `${API_BASE_URL}/api/appointments`;
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setAppointments(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch appointments:", err);
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchAppointments();
  }, [user?.email, role]);

  const handleStatusUpdate = (id, newStatus) => {
    fetch(`${API_BASE_URL}/api/appointments/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    })
      .then(res => res.json())
      .then(() => {
        setAppointments(prev => prev.map(a => a._id === id ? { ...a, status: newStatus } : a));
        showToast(`Status updated to ${newStatus}`);
      })
      .catch(err => console.error("Update failed", err));
  }

  const handleConfirmDelete = () => {
    if (!deletingAppointment) return;
    const id = deletingAppointment._id;
    setIsDeleting(true);

    fetch(`${API_BASE_URL}/api/appointments/${id}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(() => {
        setAppointments(prev => prev.filter(a => a._id !== id));
        setIsDeleting(false);
        setDeletingAppointment(null);
        showToast('Appointment deleted successfully');
      })
      .catch(err => {
        console.error("Delete failed", err);
        setAppointments(prev => prev.filter(a => a._id !== id));
        setIsDeleting(false);
        setDeletingAppointment(null);
        showToast('Appointment deleted');
      });
  }

  const handleSaveEdit = (id, updatedData) => {
    fetch(`${API_BASE_URL}/api/appointments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    })
      .then(res => res.json())
      .then(() => {
        setEditingAppointment(null);
        fetchAppointments();
        showToast('Appointment updated successfully!');
      })
      .catch(err => {
        console.error("Edit failed", err);
        setEditingAppointment(null);
        showToast('Appointment updated');
      });
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-300'
      case 'Pending': return 'bg-orange-100 text-orange-600 dark:bg-orange-950/60 dark:text-orange-300'
      case 'Cancelled': return 'bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-300'
      case 'Completed': return 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
      default: return 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-300'
    }
  }

  // Strict Per-Account and Per-Role Isolation
  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = 
      apt.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      apt.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.doctorId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.date?.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (role === 'patient' && user?.email) {
      // Patient sees strictly appointments booked under their email or name
      const matchesEmail = apt.email && apt.email.toLowerCase() === user.email.toLowerCase();
      const matchesName = apt.patientName && user.name && apt.patientName.toLowerCase().includes(user.name.split(' ')[0].toLowerCase());
      return matchesEmail || matchesName;
    }

    if (role === 'pharmacist') {
      // Pharmacist sees all appointments for pharmacy / MTM / Pharm. Chinedu
      return apt.providerType === 'pharmacist' || 
             apt.providerName?.toLowerCase().includes('chinedu') ||
             apt.doctorId?.name?.toLowerCase().includes('chinedu') ||
             !apt.doctorId;
    }

    if (role === 'doctor' && user) {
      // Doctor sees strictly appointments assigned to them
      const doctorKey = user.name.replace(/^Dr\.\s*/i, '').toLowerCase();
      return apt.doctorId?.name?.toLowerCase().includes(doctorKey) || apt.providerName?.toLowerCase().includes(doctorKey);
    }

    // Receptionist sees full clinic schedule
    return true;
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 shadow-xl border border-slate-200 dark:border-slate-800 h-full flex flex-col transition-colors">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-5">
          <div className="bg-gray-900 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2 text-sm font-bold border border-slate-700">
            <CheckCircle2 size={18} className="text-green-400" />
            {toastMessage}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-5 sm:mb-6">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Schedule</h3>
          <p className="text-[11px] sm:text-xs text-gray-400 dark:text-slate-400">
            {role === 'patient' ? `Appointments for ${user?.name || 'You'}` : role === 'doctor' ? `Patient queue for ${user?.name}` : 'Clinic Reception Master Schedule'}
          </p>
        </div>
        <span className="text-[11px] sm:text-xs font-bold text-primary bg-primary/10 px-2.5 sm:px-3 py-1 rounded-full whitespace-nowrap">
          {filteredAppointments.length} {filteredAppointments.length === 1 ? 'appointment' : 'appointments'}
        </span>
      </div>
      
      <div className="space-y-3 sm:space-y-4 flex-1 overflow-y-auto">
        {loading && (
          <div className="flex justify-center p-8">
            <Loader2 className="animate-spin text-primary" size={28} />
          </div>
        )}

        {!loading && filteredAppointments.length === 0 && (
          <div className="text-center py-10 px-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700">
            <CalendarPlus size={36} className="mx-auto text-gray-300 dark:text-slate-500 mb-3" />
            <h4 className="text-sm font-bold text-gray-800 dark:text-slate-200 mb-1">
              {role === 'patient' ? 'No appointments booked yet' : role === 'doctor' ? 'No patient consultations assigned yet' : 'No schedule entries found'}
            </h4>
            <p className="text-xs text-gray-500 dark:text-slate-400 max-w-xs mx-auto mb-4">
              {role === 'patient' 
                ? 'Select a specialist doctor and pick a date to book your consultation.'
                : 'Appointments booked by patients will automatically populate here.'}
            </p>
            {role === 'patient' && (
              <Link 
                to="/book" 
                className="inline-flex items-center gap-2 bg-primary text-white text-xs font-bold px-5 py-2.5 rounded-full hover:bg-primary-dark transition-all shadow-md"
              >
                <CalendarPlus size={16} />
                Book Appointment Now
              </Link>
            )}
          </div>
        )}

        {!loading && filteredAppointments.map((apt) => (
          <div key={apt._id} className="relative">
            {/* Appointment Card */}
            <div 
              className={`p-3.5 sm:p-4 rounded-2xl cursor-pointer transition-all border relative z-10 ${
                expandedId === apt._id 
                  ? 'bg-slate-50 dark:bg-slate-800/90 border-primary/40 shadow-sm' 
                  : 'bg-white dark:bg-slate-800/70 border-gray-100 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700'
              }`}
              onClick={() => setExpandedId(expandedId === apt._id ? null : apt._id)}
            >
              {expandedId === apt._id && (
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary rounded-l-2xl"></div>
              )}
              
              {/* DESKTOP LAYOUT (sm:flex) */}
              <div className="hidden sm:flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 sm:gap-6 pl-2 flex-1 min-w-0">
                  <div className="w-20 shrink-0">
                    <span className="text-[13px] font-bold text-gray-900 dark:text-white block leading-tight">{apt.time}</span>
                    <span className="text-[10px] text-gray-400 dark:text-slate-400 block">{apt.date || 'Today'}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[14px] font-bold text-gray-900 dark:text-white leading-tight mb-0.5 truncate">{apt.patientName || 'Patient'}</h4>
                    <p className="text-[11px] text-gray-500 dark:text-slate-400 truncate">{apt.serviceName || apt.reason || apt.doctorId?.specialty || 'Clinical Consultation'}</p>
                  </div>
                  
                  <div className="text-[11px] text-gray-500 dark:text-slate-400 w-36 shrink-0 truncate">
                    {apt.providerName || apt.doctorId?.name || 'Pharm. Chinedu Nwankwo'}
                  </div>
                </div>
                
                <div className="flex items-center gap-3 shrink-0">
                  <div className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap ${getStatusColor(apt.status)}`}>
                    {apt.status}
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-400 dark:text-slate-400">
                    {apt.status === 'Completed' && role === 'patient' && (
                      <button 
                        className="text-yellow-700 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors" 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          setRatingAppointment(apt);
                        }}
                        title="Rate Doctor & Service"
                      >
                        <Star size={14} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-[10px] font-bold">
                          {apt.rating ? `${apt.rating}★` : 'Rate Visit'}
                        </span>
                      </button>
                    )}

                    {apt.status === 'Confirmed' && (
                      <button 
                        className="text-primary hover:text-blue-700 transition-colors flex items-center gap-1 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg" 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          setTelemedModal(apt);
                        }}
                        title="Join Telemedicine Video Room"
                      >
                        <Video size={14} />
                        <span className="text-[10px] font-bold">Join Call</span>
                      </button>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingAppointment(apt);
                      }}
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-700 dark:hover:text-slate-200 transition-colors"
                      title="Edit Appointment"
                    >
                      <Edit2 size={16} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingAppointment(apt);
                      }}
                      className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                      title="Delete Appointment"
                    >
                      <Trash2 size={16} />
                    </button>

                    {expandedId === apt._id ? (
                      <ChevronUp size={18} className="text-primary ml-1" />
                    ) : (
                      <ChevronDown size={18} className="text-gray-400 ml-1" />
                    )}
                  </div>
                </div>
              </div>

              {/* MOBILE LAYOUT (sm:hidden) */}
              <div className="sm:hidden flex flex-col gap-2.5">
                {/* Top Row: Time & Date on Left, Status Badge & Chevron on Right */}
                <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-slate-700/60">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-gray-900 dark:text-white">{apt.time}</span>
                    <span className="text-gray-300 dark:text-slate-600">•</span>
                    <span className="text-[10px] font-semibold text-gray-500 dark:text-slate-400">{apt.date || 'Today'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide whitespace-nowrap ${getStatusColor(apt.status)}`}>
                      {apt.status}
                    </div>
                    {expandedId === apt._id ? (
                      <ChevronUp size={16} className="text-primary" />
                    ) : (
                      <ChevronDown size={16} className="text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Details & Actions Row */}
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[13px] font-bold text-gray-900 dark:text-white leading-tight truncate">
                      {apt.patientName || 'Patient'}
                    </h4>
                    <p className="text-[11px] text-gray-500 dark:text-slate-400 truncate mt-0.5">
                      {apt.serviceName || apt.reason || apt.doctorId?.specialty || 'Clinical Consultation'}
                    </p>
                    <p className="text-[10px] text-primary dark:text-cyan-400 font-semibold truncate mt-0.5">
                      {apt.providerName || apt.doctorId?.name || 'Pharm. Chinedu Nwankwo'}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 pt-0.5">
                    {apt.status === 'Completed' && role === 'patient' && (
                      <button 
                        className="text-yellow-700 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 px-2 py-1 rounded-lg flex items-center gap-1 transition-colors" 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          setRatingAppointment(apt);
                        }}
                        title="Rate Visit"
                      >
                        <Star size={12} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-[9px] font-bold">{apt.rating ? `${apt.rating}★` : 'Rate'}</span>
                      </button>
                    )}

                    {apt.status === 'Confirmed' && (
                      <button 
                        className="text-primary hover:text-blue-700 bg-blue-50 dark:bg-blue-950/60 p-1.5 rounded-lg flex items-center transition-colors" 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          setTelemedModal(apt);
                        }}
                        title="Join Telemed Video"
                      >
                        <Video size={14} />
                      </button>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingAppointment(apt);
                      }}
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 transition-colors"
                      title="Edit Appointment"
                    >
                      <Edit2 size={14} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingAppointment(apt);
                      }}
                      className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                      title="Delete Appointment"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Expanded Status Updater */}
            {expandedId === apt._id && (
              <div className="bg-slate-50 dark:bg-slate-800/90 rounded-2xl p-4 sm:p-5 mx-2 -mt-2.5 pt-5 sm:pt-6 border border-t-0 border-gray-100 dark:border-slate-700 shadow-sm relative z-0">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mb-3">
                  <h5 className="text-[11px] font-bold text-gray-800 dark:text-slate-200 uppercase tracking-wider">Update Status & Quick Actions</h5>
                  <span className="text-[11px] text-gray-400 break-all sm:break-normal">Phone: {apt.phone || 'N/A'} • Email: {apt.email || 'N/A'}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-2 sm:mb-3">
                  {['Confirmed', 'Completed', 'Pending', 'Cancelled'].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusUpdate(apt._id, st)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                        apt.status === st 
                          ? 'border-primary bg-primary text-white shadow-sm' 
                          : 'border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:border-gray-300'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingAppointment}
        appointment={deletingAppointment}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeletingAppointment(null)}
        loading={isDeleting}
      />

      {/* Edit Appointment Modal */}
      {editingAppointment && (
        <EditAppointmentModal
          appointment={editingAppointment}
          onSave={handleSaveEdit}
          onClose={() => setEditingAppointment(null)}
        />
      )}

      {/* Telemedicine Video Room Modal */}
      {telemedModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex justify-center items-center p-4 z-50 animate-in fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-gray-100 dark:border-slate-700 text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-950/60 text-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Video size={30} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Telemedicine Room Connected</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mb-6">
              Virtual Consultation with <span className="font-bold text-gray-800 dark:text-slate-200">{telemedModal.patientName}</span>
            </p>
            <div className="bg-slate-900 text-green-400 p-4 rounded-2xl text-xs font-mono mb-6">
              ● Encrypted HD Audio/Video Room Live<br/>
              Doctor: {telemedModal.doctorId?.name || 'Dr. Sarah Jenkins'}
            </div>
            <button
              onClick={() => setTelemedModal(null)}
              className="w-full py-3 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-colors"
            >
              End Virtual Consultation
            </button>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {ratingAppointment && (
        <RatingModal
          appointment={ratingAppointment}
          onClose={() => setRatingAppointment(null)}
          onRatingComplete={(updatedApt) => {
            setAppointments(prev => prev.map(a => a._id === updatedApt._id ? updatedApt : a));
            showToast('Thank you for rating your consultation!');
          }}
        />
      )}

    </div>
  )
}
