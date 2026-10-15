import { API_BASE_URL } from '../config/api';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Star, Clock, MapPin, Award, Calendar, ShieldCheck, Stethoscope } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import BottomNav from '../components/BottomNav';

export default function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setSelectedDoctor } = useBooking();
  const { role } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/doctors`)
      .then(res => res.json())
      .then(doctors => {
        const found = doctors.find(d => d._id === id || d.id === id);
        setDoctor(found || doctors[0]);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch doctor profile:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-primary font-bold animate-pulse">Loading Doctor Profile...</div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
        <p className="text-red-500 font-bold">Doctor not found.</p>
        <Link to="/" className="text-primary underline">Return Home</Link>
      </div>
    );
  }

  const handleBookNow = () => {
    setSelectedDoctor(doctor);
    navigate('/book');
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 min-h-screen relative shadow-lg overflow-y-auto flex flex-col transition-colors">
      {/* Header */}
      <div className="p-5 pb-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center shadow-sm hover:bg-slate-200 transition-colors"
          >
            <ChevronLeft size={22} />
          </button>
          <h1 className="text-base font-bold text-gray-900 dark:text-white">Doctor Profile</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="flex-1 pb-6">
        {/* Main Profile Header */}
        <div className="px-5">
          <div className="bg-linear-to-br from-primary/10 via-cyan-500/10 to-teal-500/10 dark:from-slate-800 dark:to-slate-800 rounded-3xl p-6 border border-primary/10 dark:border-slate-700 flex flex-col sm:flex-row items-center sm:items-start gap-5 shadow-sm">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-4 border-white dark:border-slate-700 shadow-md shrink-0">
              <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 text-center sm:text-left">
              <span className="inline-block bg-primary text-white text-[11px] font-bold px-3 py-1 rounded-full mb-2">
                {doctor.specialty}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {doctor.name}
              </h2>
              <p className="text-xs text-gray-500 dark:text-slate-400 mb-3 flex items-center justify-center sm:justify-start gap-1">
                <MapPin size={14} className="text-primary" />
                MedClinic Central Hospital • Block B, Suite 302
              </p>

              <div className="flex items-center justify-center sm:justify-start gap-3 flex-wrap">
                <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-950/40 px-3 py-1 rounded-full border border-yellow-200 dark:border-yellow-800">
                  <Star size={14} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-bold text-yellow-800 dark:text-yellow-300">{doctor.rating || 4.9}</span>
                  <span className="text-[10px] text-yellow-600 dark:text-yellow-400">({doctor.reviews || 120} reviews)</span>
                </div>

                <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                  <ShieldCheck size={14} /> Verified Specialist
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Experience Badges */}
        <div className="px-5 mt-4 grid grid-cols-3 gap-3">
          <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl border border-slate-100 dark:border-slate-700 text-center">
            <span className="text-xs text-gray-400 block mb-1">Experience</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">{doctor.experience || '8+ Years'}</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl border border-slate-100 dark:border-slate-700 text-center">
            <span className="text-xs text-gray-400 block mb-1">Patients</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">{doctor.patients || '2.5k+'}</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl border border-slate-100 dark:border-slate-700 text-center">
            <span className="text-xs text-gray-400 block mb-1">Consult Fee</span>
            <span className="text-sm font-bold text-primary dark:text-cyan-400">$75</span>
          </div>
        </div>

        {/* Biography & Qualifications */}
        <div className="px-5 mt-6 space-y-5">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Award size={18} className="text-primary" />
              Biography & Clinical Focus
            </h3>
            <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed mb-4">
              {doctor.about || `${doctor.name} is a dedicated medical specialist with over a decade of clinical excellence in healthcare, diagnostics, and patient treatment.`}
            </p>

            {/* Credentials Row */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-primary/10 text-primary text-[11px] font-bold px-3 py-1 rounded-full border border-primary/20">
                ✦ Board Certified Specialist
              </span>
              <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                ✦ Fellow of Medical College
              </span>
              <span className="bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 text-[11px] font-bold px-3 py-1 rounded-full border border-violet-200 dark:border-violet-800">
                ✦ WACP Certified
              </span>
            </div>

            {/* Clinical Focus Tags */}
            {doctor.clinicalFocus && doctor.clinicalFocus.length > 0 && (
              <div>
                <p className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">Clinical Focus Areas</p>
                <div className="flex flex-wrap gap-2">
                  {doctor.clinicalFocus.map((focus, i) => (
                    <span
                      key={i}
                      className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-semibold px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-600"
                    >
                      {focus}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Working Hours */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Clock size={18} className="text-primary" />
              Consultation Hours
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-gray-600 dark:text-slate-300 py-1 border-b border-slate-100 dark:border-slate-700">
                <span className="font-bold">Monday - Friday:</span>
                <span>08:30 AM - 05:00 PM</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-slate-300 py-1">
                <span className="font-bold">Saturday:</span>
                <span>09:00 AM - 02:00 PM</span>
              </div>
            </div>
          </div>

          {/* Book Button CTA Bar (Natural Page Flow above BottomNav) */}
          <div className="pt-2">
            {role === 'doctor' ? (
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/')}
                  className="w-full bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  <Stethoscope size={18} />
                  Go to Doctor Consultation Queue
                </button>
                <p className="text-[11px] text-center text-gray-400">
                  Logged in as Specialist. Patient self-booking is disabled for clinical providers.
                </p>
              </div>
            ) : role === 'pharmacist' ? (
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  <ShieldCheck size={18} />
                  Return to Pharmacist Command Center
                </button>
                <p className="text-[11px] text-center text-gray-400">
                  Logged in as Lead Pharmacist. Provider self-booking is disabled.
                </p>
              </div>
            ) : (
              <button
                onClick={handleBookNow}
                className="w-full bg-linear-to-r from-primary to-cyan-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <Calendar size={18} />
                Book Appointment with {doctor.name.replace(/^Dr\.\s*/i, 'Dr. ')}
              </button>
            )}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
