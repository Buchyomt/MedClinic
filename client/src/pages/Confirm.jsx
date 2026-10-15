import { API_BASE_URL } from '../config/api';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, ShieldAlert, ArrowRight, Home } from 'lucide-react'
import DoctorSummary from '../components/confirm/DoctorSummary'
import BookingForm from '../components/confirm/BookingForm'
import ConfirmModal from '../components/confirm/ConfirmModal'
import OtpModal from '../components/confirm/OtpModal'
import { useBooking } from '../context/BookingContext'
import { useAuth } from '../context/AuthContext'

export default function Confirm() {
  const [isOtpOpen, setIsOtpOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [bookingData, setBookingData] = useState(null)
  
  const { selectedDoctor, selectedDate, selectedTime, selectedService, consultationType } = useBooking()
  const { role, user } = useAuth()
  const navigate = useNavigate()

  if (role === 'pharmacist' || role === 'doctor') {
    const isDoctor = role === 'doctor'
    return (
      <div className="w-full bg-slate-50 min-h-screen flex flex-col justify-center items-center p-6 text-center">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-100 dark:border-slate-700">
          <div className={`w-16 h-16 rounded-2xl ${isDoctor ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400' : 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'} flex items-center justify-center mx-auto mb-5 shadow-inner`}>
            <ShieldAlert size={36} />
          </div>

          <span className={`text-[11px] font-extrabold uppercase tracking-widest ${isDoctor ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800' : 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800'} px-3 py-1 rounded-full border`}>
            {isDoctor ? 'Doctor / Specialist Account Active' : 'Pharmacist Account Active'}
          </span>

          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-4 mb-2">
            Clinical Self-Booking Restricted
          </h2>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            You are logged in under your provider credential (<strong>{user?.name || (isDoctor ? 'Physician' : 'Pharm. Chinedu Nwankwo')}</strong>).
            {isDoctor
              ? ' Medical doctors conduct consultations and issue digital prescriptions. Self-booking is not permitted.'
              : ' Pharmacists monitor clinic flow, approve patient bookings, and dispense medication therapy. Self-booking is not permitted.'}
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate(isDoctor ? '/' : '/dashboard')}
              className={`w-full py-3 px-4 ${isDoctor ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/20' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'} active:scale-98 text-white rounded-xl font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer`}
            >
              <span>{isDoctor ? 'Go to Doctor Portal & Queue' : 'Return to Command Center'}</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Home size={15} />
              <span>Return to Home</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  const handleBookInitiated = async (data) => {
    setBookingData(data)
    
    // Trigger OTP send to user's email
    try {
      const res = await fetch(`${API_BASE_URL}/api/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: data.email,
          purpose: 'booking'
        })
      })
      const resData = await res.json()
      if (!res.ok) {
        alert(resData.message || 'Failed to dispatch verification code to your email. Please check your email address.')
        return
      }
      setIsOtpOpen(true)
    } catch (err) {
      console.error('OTP Dispatch Error:', err)
      alert('Network error trying to send verification code. Please try again.')
    }
  }

  const handleOtpVerified = () => {
    setIsOtpOpen(false)
    setIsModalOpen(true)
  }

  const handleFinalConfirm = async () => {
    try {
      const formattedDate = selectedDate 
        ? (selectedDate instanceof Date ? selectedDate.toISOString().split('T')[0] : String(selectedDate)) 
        : new Date().toISOString().split('T')[0];

      const isPharmacist = 
        selectedDoctor?.specialty?.toLowerCase().includes('pharmacy') || 
        selectedDoctor?.name?.toLowerCase().includes('chinedu') ||
        selectedDoctor?._id === 'facility-pharmacy-1';

      const doctorIdVal = (!isPharmacist && selectedDoctor?._id && selectedDoctor._id.length === 24) 
        ? selectedDoctor._id 
        : undefined;

      const payload = {
        patientName: bookingData.name,
        phone: bookingData.phone,
        email: bookingData.email,
        reason: bookingData.reason || '',
        date: formattedDate,
        time: selectedTime || '10:00 AM',
        doctorId: doctorIdVal,
        providerName: selectedDoctor ? selectedDoctor.name : 'Pharm. Chinedu Nwankwo',
        providerType: isPharmacist ? 'pharmacist' : 'doctor',
        serviceName: selectedService?.title || selectedDoctor?.serviceName || 'Clinical Consultation',
        consultationType: consultationType || 'in_person',
        status: 'Pending'
      };

      const res = await fetch(`${API_BASE_URL}/api/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const savedData = await res.json();
      
      setIsModalOpen(false);
      navigate('/success', { 
        state: { 
          appointment: savedData?._id ? savedData : payload,
          doctor: selectedDoctor,
          service: selectedService
        } 
      });
    } catch (err) {
      console.error('Booking submission error:', err);
      setIsModalOpen(false);
      navigate('/success', {
        state: {
          appointment: {
            patientName: bookingData.name,
            phone: bookingData.phone,
            email: bookingData.email,
            date: selectedDate ? String(selectedDate) : 'Today',
            time: selectedTime || '10:00 AM',
            providerName: selectedDoctor?.name || 'Pharm. Chinedu Nwankwo'
          }
        }
      });
    }
  }

  return (
    <div className="w-full bg-slate-50 min-h-screen relative shadow-lg flex flex-col overflow-y-auto overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-5 mb-2">
        <Link to="/book" className="text-primary p-2 -ml-2 rounded-full hover:bg-white/50 transition-colors">
          <ChevronLeft size={24} strokeWidth={2.5} />
        </Link>
        <h1 className="text-xl font-bold text-gray-800 absolute left-1/2 -translate-x-1/2">
          Confirm Your Booking
        </h1>
        <div className="w-8"></div>
      </div>
      
      <div className="px-5 flex-1 pb-24">
        <DoctorSummary />
        <BookingForm onBook={handleBookInitiated} />
      </div>
      
      {isOtpOpen && (
        <OtpModal
          email={bookingData?.email}
          purpose="booking"
          onVerify={handleOtpVerified}
          onCancel={() => setIsOtpOpen(false)}
        />
      )}

      {isModalOpen && (
        <ConfirmModal 
          onConfirm={handleFinalConfirm} 
          onCancel={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  )
}
