import { API_BASE_URL } from '../config/api';
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useBooking } from '../context/BookingContext'
import { useAuth } from '../context/AuthContext'
import { Star, Loader2 } from 'lucide-react'

export default function DoctorList({ searchQuery, selectedSpecialty }) {
  const { setSelectedDoctor } = useBooking();
  const { role } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/doctors`)
      .then(res => res.json())
      .then(data => {
        setDoctors(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch doctors:", err);
        setLoading(false);
      });
  }, []);

  const filteredDoctors = doctors.filter(doc => {
    const query = (searchQuery || '').toLowerCase();
    const matchesSearch = !query || 
      doc.name.toLowerCase().includes(query) || 
      (doc.specialty || '').toLowerCase().includes(query);

    if (!selectedSpecialty || selectedSpecialty === 'All') {
      return matchesSearch;
    }

    const sel = selectedSpecialty.toLowerCase();
    const docSpec = (doc.specialty || '').toLowerCase();

    const matchesSpecialty = 
      docSpec === sel ||
      docSpec.includes(sel) ||
      (sel.includes('allerg') && (docSpec.includes('allerg') || docSpec.includes('immun'))) ||
      (sel.includes('derma') && (docSpec.includes('derma') || docSpec.includes('skin'))) ||
      (sel.includes('cardio') && (docSpec.includes('cardio') || docSpec.includes('heart'))) ||
      (sel.includes('neuro') && (docSpec.includes('neuro') || docSpec.includes('brain'))) ||
      (sel.includes('pediat') && (docSpec.includes('pediat') || docSpec.includes('child'))) ||
      (sel.includes('dent') && (docSpec.includes('dent') || docSpec.includes('oral') || docSpec.includes('teeth'))) ||
      (sel.includes('optom') && (docSpec.includes('optom') || docSpec.includes('eye') || docSpec.includes('vision'))) ||
      (sel.includes('ortho') && (docSpec.includes('ortho') || docSpec.includes('bone') || docSpec.includes('joint'))) ||
      (sel.includes('ent') && (docSpec.includes('ent') || docSpec.includes('ear') || docSpec.includes('throat'))) ||
      (sel.includes('psych') && (docSpec.includes('psych') || docSpec.includes('mental'))) ||
      (sel.includes('gynec') && (docSpec.includes('gynec') || docSpec.includes('women'))) ||
      (sel.includes('general') && docSpec.includes('general'));

    return matchesSearch && matchesSpecialty;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4 px-1">
        <h2 className="text-[17px] font-bold text-gray-800 dark:text-gray-100 transition-colors">Available Doctors</h2>
        <span className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold px-2.5 py-0.5 rounded-full">
          {filteredDoctors.length} {filteredDoctors.length === 1 ? 'Specialist' : 'Specialists'}
        </span>
      </div>
      
      {/* Responsive Grid / Scroll Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
        {loading && <div className="p-8 col-span-full flex justify-center"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>}
        {!loading && filteredDoctors.length === 0 && <div className="p-8 col-span-full text-center text-gray-500 bg-white dark:bg-slate-800 rounded-3xl">No doctors found matching your criteria.</div>}
        {!loading && filteredDoctors.map(doc => (
          <Link 
            to={`/doctor/${doc._id}`} 
            onClick={() => setSelectedDoctor(doc)} 
            key={doc._id} 
            className="cursor-pointer bg-white dark:bg-slate-800/90 rounded-3xl p-5 flex flex-col items-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none border border-slate-100 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-xl hover:scale-[1.02] transition-all relative z-10 group"
          >
            <div className="w-20 h-20 rounded-2xl overflow-hidden mb-3 border-2 border-slate-100 dark:border-slate-700 shadow-sm transition-transform group-hover:scale-105 duration-200">
              <img src={doc.image} alt={doc.name} className="w-full h-full object-cover" />
            </div>
            
            <h3 className="text-sm font-extrabold text-gray-900 dark:text-gray-100 mb-0.5 transition-colors text-center">{doc.name}</h3>
            <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-2 transition-colors">{doc.specialty}</p>
            
            <div className="flex items-center gap-1 mb-3 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-full">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={13} className={i < Math.floor(doc.rating) ? "fill-amber-400 text-amber-400" : "text-gray-300 dark:text-gray-600"} />
              ))}
              <span className="text-xs font-bold text-amber-700 dark:text-amber-300 ml-1">{doc.rating}</span>
            </div>
            
            <div className="w-full bg-slate-50 dark:bg-slate-700/60 text-primary dark:text-blue-300 text-xs font-extrabold py-2 px-4 rounded-xl mt-auto text-center group-hover:bg-linear-to-r group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white transition-all shadow-sm">
              {role === 'doctor' || role === 'pharmacist' ? 'View Specialist Profile' : 'View Profile & Book'}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
