import { API_BASE_URL } from '../../config/api';
import React, { useEffect } from 'react'
import { useBooking } from '../../context/BookingContext'
import { useFacility } from '../../context/FacilityContext'
import { Star, Sparkles, Clock } from 'lucide-react'

export default function DoctorProfileCard() {
  const { selectedDoctor, setSelectedDoctor, selectedService } = useBooking();
  const { isPharmacyMode, pharmacyProfile } = useFacility();

  useEffect(() => {
    if (!selectedDoctor) {
      if (isPharmacyMode && pharmacyProfile) {
        setSelectedDoctor({
          _id: pharmacyProfile.id || 'pharmacist-1',
          name: pharmacyProfile.pharmacistName,
          title: pharmacyProfile.pharmacistTitle,
          specialty: 'Clinical Pharmacy & MTM',
          image: pharmacyProfile.pharmacistImage,
          rating: parseFloat(pharmacyProfile.pharmacistRating) || 4.98,
          experience: pharmacyProfile.pharmacistExperience,
          price: pharmacyProfile.consultationFee,
          location: pharmacyProfile.address,
          hospital: pharmacyProfile.name
        });
      } else {
        fetch(`${API_BASE_URL}/api/doctors`)
          .then(res => res.json())
          .then(docs => {
            if (Array.isArray(docs) && docs.length > 0) {
              setSelectedDoctor(docs[0]);
            }
          })
          .catch(err => console.error(err));
      }
    }
  }, [selectedDoctor, setSelectedDoctor, isPharmacyMode, pharmacyProfile]);
  
  if (!selectedDoctor) return null;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm mb-6 border border-slate-100 dark:border-slate-700">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-emerald-500/20 shadow-sm shrink-0">
          <img src={selectedDoctor.image} alt={selectedDoctor.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate">{selectedDoctor.name}</h2>
            {isPharmacyMode && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                Lead Pharmacist
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-slate-400 mb-2 truncate">{selectedDoctor.specialty}</p>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Star size={15} className="fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-gray-700 dark:text-slate-200">{selectedDoctor.rating}</span>
            </div>
            <span className="text-gray-300 dark:text-slate-600">•</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {selectedService?.fee || selectedDoctor.price || '₦5,000'}
            </span>
          </div>
        </div>
      </div>

      {selectedService && (
        <div className="mt-4 flex items-center justify-between text-xs bg-emerald-50/60 dark:bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-100/80 dark:border-emerald-900/40">
          <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 font-semibold truncate">
            <Sparkles size={14} className="text-emerald-600 shrink-0" />
            <span className="truncate">{selectedService.title}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-300 font-bold shrink-0">
            <Clock size={12} />
            <span>{selectedService.duration}</span>
          </div>
        </div>
      )}
    </div>
  )
}
