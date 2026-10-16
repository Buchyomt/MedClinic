import React, { createContext, useContext, useState, useEffect } from 'react';

export const FacilityContext = createContext();

export const useFacility = () => {
  return useContext(FacilityContext);
};

export const defaultPharmacyProfile = {
  id: 'facility-pharmacy-1',
  type: 'pharmacy', // 'pharmacy' | 'clinic'
  name: 'Your Health Diagnostic Centre Ltd & Pharmacy',
  pharmacistName: 'Pharm. Chinedu Nwankwo',
  pharmacistTitle: 'Lead Clinical Pharmacist & Director',
  pharmacistBio: 'Licensed Clinical Pharmacist and founder of Your Health Diagnostic Centre Ltd & Pharmacy, delivering accessible and trusted pharmaceutical care to the Onitsha community. Specialising in Medication Therapy Management, vaccine advocacy, drug safety, and patient-centered clinical care.',
  pharmacistImage: '/pharmacist-chinedu.jpg',
  pharmacistExperience: '12+ Years Licensed Experience',
  pharmacistRating: '4.97',
  pharmacistPatients: '2,000+ Patients Counseled',
  address: '1 Nwankwo Chinedu Crescent, Off Ogbatuluenyi Street, FHE 3-3, Onitsha, Anambra State',
  phone: '+234 702 505 1669',
  phoneNumbers: ['0803 733 4924', '0702 505 1669', '0806 444 4654'],
  whatsappPhone: '2347025051669',
  email: 'info@yourhealthpharmacy.com',
  workingHours: 'Mon - Sat: 7:00 AM - 9:00 PM | Sunday: 12:00 PM - 9:00 PM',
  consultationFee: 'Starting from ₦10,000',
  badges: [
    'Licensed PCN Registered Pharmacist (Reg # PCN-88421)',
    'Certified Medication Therapy Management Specialist',
    'Clinical Diagnostic Care & Vaccine Advocacy Centre',
    'Same-Day Prescription Dispensing Across FHE 3-3, GRA & Onitsha'
  ],
  services: [
    {
      id: 'med-review',
      title: 'Comprehensive Medication Therapy Management (MTM)',
      desc: 'Complete clinical audit of your prescriptions, OTC drugs & supplements to eliminate harmful drug interactions and optimize dosing for multi-condition patients.',
      duration: '45 mins',
      fee: 'Starting from ₦10,000',
      numericFee: 10000,
      icon: 'Pill',
      category: 'Medication Safety & Dosing'
    },
    {
      id: 'chronic-care',
      title: 'Chronic Disease Care & Vitals Retainer (BP & Diabetes)',
      desc: 'Monthly blood pressure and blood glucose tracking, lifestyle guidance, and personalized compliance counseling with weekly follow-ups.',
      duration: 'Monthly Care Plan',
      fee: '₦15,000 / month',
      numericFee: 15000,
      icon: 'HeartPulse',
      category: 'Preventive Health'
    },
    {
      id: 'herbal-audit',
      title: 'Orthodox Drug vs. Herbal & Agbo Safety Audit',
      desc: 'Specialized pharmacological evaluation to prevent dangerous organ conflicts between prescribed medications and traditional herbal tonics.',
      duration: '30 mins',
      fee: 'Starting from ₦7,500',
      numericFee: 7500,
      icon: 'Sparkles',
      category: 'Herbal Safety'
    },
    {
      id: 'diaspora-care',
      title: 'Diaspora Parent Medication & Vitals Retainer',
      desc: 'Dedicated monthly care for elderly parents in Onitsha with doorstep genuine drug delivery, vitals checks, and WhatsApp status reports to family sponsors abroad.',
      duration: 'Monthly Subscription',
      fee: '₦25,000 / month ($35)',
      numericFee: 25000,
      icon: 'Globe',
      category: 'Diaspora Family Care'
    },
    {
      id: 'rx-dispense',
      title: 'Doctor Prescription Dispense & NAFDAC MAS Verification',
      desc: 'Authenticity-sealed medication dispensing directly from verified cold-chain manufacturers with dosage instructions and express doorstep delivery across Onitsha.',
      duration: 'Same-Day Dispatch',
      fee: 'Free (Medication Cost Only)',
      numericFee: 0,
      icon: 'FileText',
      category: 'Prescription Dispensing'
    },
    {
      id: 'minor-ailment',
      title: 'Urgent Clinical Triage & Minor Ailments',
      desc: 'Immediate clinical evaluation for acute malaria, fever, respiratory allergies, skin conditions, and digestive distress with tailored treatment.',
      duration: '20 mins',
      fee: 'Starting from ₦5,000',
      numericFee: 5000,
      icon: 'Stethoscope',
      category: 'General Wellness'
    }
  ]
};

export const defaultClinicProfile = {
  id: 'facility-clinic-1',
  type: 'clinic',
  name: 'MediCare Specialist Hospital & Clinics',
  tagline: 'Multi-Specialty Medical Care & Diagnostics',
  address: '22 Medical Center Road, Ikeja, Lagos',
  phone: '+234 800 633 4254',
  email: 'info@medicarehospital.com'
};

export const FacilityProvider = ({ children }) => {
  const [facilityMode, setFacilityMode] = useState(() => {
    return localStorage.getItem('medclinic_facility_mode') || 'pharmacy'; // default to pharmacy
  });

  const [pharmacyProfile, setPharmacyProfile] = useState(() => {
    const saved = localStorage.getItem('medclinic_pharmacy_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Reset if still using outdated low pricing or legacy profiles
        if (!parsed.services || parsed.services.length < 5 || parsed.services[0].fee === '₦4,000') {
          localStorage.setItem('medclinic_pharmacy_profile', JSON.stringify(defaultPharmacyProfile));
          return defaultPharmacyProfile;
        }
        // Ensure working hours are always strictly up to date
        parsed.workingHours = defaultPharmacyProfile.workingHours;
        localStorage.setItem('medclinic_pharmacy_profile', JSON.stringify(parsed));
        return parsed;
      } catch {
        return defaultPharmacyProfile;
      }
    }
    return defaultPharmacyProfile;
  });

  const [clinicProfile, setClinicProfile] = useState(() => {
    const saved = localStorage.getItem('medclinic_clinic_profile');
    return saved ? JSON.parse(saved) : defaultClinicProfile;
  });

  useEffect(() => {
    localStorage.setItem('medclinic_facility_mode', facilityMode);
  }, [facilityMode]);

  const toggleFacilityMode = (mode) => {
    const nextMode = mode || (facilityMode === 'pharmacy' ? 'clinic' : 'pharmacy');
    setFacilityMode(nextMode);
    return nextMode;
  };

  const updatePharmacyProfile = (updated) => {
    setPharmacyProfile(prev => {
      const next = { ...prev, ...updated };
      localStorage.setItem('medclinic_pharmacy_profile', JSON.stringify(next));
      return next;
    });
  };

  const updateServiceFee = (serviceId, newFeeText) => {
    setPharmacyProfile(prev => {
      const updatedServices = (prev.services || []).map(s => {
        if (s.id === serviceId) {
          return { ...s, fee: newFeeText };
        }
        return s;
      });
      const next = { ...prev, services: updatedServices };
      localStorage.setItem('medclinic_pharmacy_profile', JSON.stringify(next));
      return next;
    });
  };

  const updateClinicProfile = (updated) => {
    setClinicProfile(prev => {
      const next = { ...prev, ...updated };
      localStorage.setItem('medclinic_clinic_profile', JSON.stringify(next));
      return next;
    });
  };

  return (
    <FacilityContext.Provider
      value={{
        facilityMode,
        setFacilityMode,
        toggleFacilityMode,
        isPharmacyMode: facilityMode === 'pharmacy',
        isClinicMode: facilityMode === 'clinic',
        pharmacyProfile,
        clinicProfile,
        updatePharmacyProfile,
        updateServiceFee,
        updateClinicProfile
      }}
    >
      {children}
    </FacilityContext.Provider>
  );
};
