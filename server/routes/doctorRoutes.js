const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');

const mockDoctorsFallback = [
  {
    _id: "660000000000000000000001",
    name: "Dr. Sarah Okafor",
    specialty: "Cardiologist",
    rating: 4.9,
    reviews: 142,
    experience: "12+ Years",
    patients: "2.8k+",
    about: "Dr. Sarah Okafor is a board-certified Cardiologist with over 12 years of clinical expertise in diagnosing and managing complex cardiovascular conditions. She trained at Lagos University Teaching Hospital and completed advanced cardiology fellowships in both the UK and Nigeria. She is renowned for her patient-centered approach, integrating lifestyle counselling with evidence-based pharmacotherapy to achieve optimal heart health outcomes for her patients.",
    clinicalFocus: ["Coronary Artery Disease", "Hypertension Management", "Arrhythmia & ECG Interpretation", "Heart Failure", "Echocardiography", "Lipid Disorders", "Chest Pain Evaluation", "Preventive Cardiology"],
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300",
    availability: [
      { date: "14", slots: ["09:00 AM", "10:30 AM", "01:00 PM", "03:00 PM"] },
      { date: "15", slots: ["11:00 AM", "02:00 PM", "04:30 PM"] },
      { date: "16", slots: ["09:30 AM", "11:30 AM", "02:30 PM"] }
    ]
  },
  {
    _id: "660000000000000000000002",
    name: "Dr. Olivia Martinez",
    specialty: "Dermatologist",
    rating: 4.9,
    reviews: 178,
    experience: "9+ Years",
    patients: "3.2k+",
    about: "Dr. Olivia Martinez is a Harvard-trained Dermatologist with 9 years of specialized experience in clinical and cosmetic skin medicine. She is a Fellow of the Nigerian Dermatology Society and has published peer-reviewed research on tropical skin diseases. She combines advanced dermoscopic diagnostics with modern therapies to treat a wide spectrum of skin, hair, and nail conditions with precision.",
    clinicalFocus: ["Acne Vulgaris & Rosacea", "Eczema & Atopic Dermatitis", "Psoriasis Treatment", "Skin Cancer Screening", "Fungal & Parasitic Infections", "Cosmetic Dermatology", "Alopecia & Hair Loss", "Chemical Peels & Laser Therapy"],
    image: "https://images.unsplash.com/photo-1594824432258-f73cecbdf365?auto=format&fit=crop&q=80&w=300&h=300",
    availability: [
      { date: "14", slots: ["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"] },
      { date: "15", slots: ["10:00 AM", "01:30 PM", "03:30 PM"] },
      { date: "16", slots: ["08:30 AM", "12:00 PM", "03:00 PM"] }
    ]
  },
  {
    _id: "660000000000000000000003",
    name: "Dr. Zainab Al-Hassan",
    specialty: "Allergist & Immunologist",
    rating: 4.9,
    reviews: 156,
    experience: "10+ Years",
    patients: "2.6k+",
    about: "Dr. Zainab Al-Hassan is a distinguished Allergist and Clinical Immunologist with a decade of practice in allergy evaluation, immunotherapy, and immune-mediated disease management. Trained at Ahmadu Bello University and certified in allergy/immunology by the West African College of Physicians, she specializes in identifying complex allergic triggers and crafting long-term management strategies for patients of all ages.",
    clinicalFocus: ["Allergic Rhinitis & Hay Fever", "Food & Drug Allergy", "Urticaria & Angioedema", "Atopic & Contact Dermatitis", "Asthma & Bronchial Reactivity", "Immunotherapy (Allergy Shots)", "Insect Sting Allergy", "Anaphylaxis Management"],
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300&h=300",
    availability: [
      { date: "14", slots: ["08:30 AM", "10:30 AM", "01:30 PM", "04:00 PM"] },
      { date: "15", slots: ["09:00 AM", "11:30 AM", "03:00 PM"] },
      { date: "16", slots: ["10:00 AM", "02:00 PM", "04:30 PM"] }
    ]
  },
  {
    _id: "660000000000000000000004",
    name: "Dr. Michael Chen",
    specialty: "Neurologist",
    rating: 4.9,
    reviews: 95,
    experience: "15+ Years",
    patients: "3.1k+",
    about: "Dr. Michael Chen is a senior Neurologist with 15 years of distinguished clinical practice at the intersection of complex neurodiagnostics, cerebrovascular medicine, and neuromuscular disease. A Fellow of the American Academy of Neurology, he has pioneered advanced stroke protocols and migraine management programs within West Africa, and is recognized for his precision in treating disorders of the brain and peripheral nervous system.",
    clinicalFocus: ["Migraine & Tension Headaches", "Stroke Prevention & Rehabilitation", "Epilepsy & Seizure Disorders", "Peripheral Neuropathy", "Multiple Sclerosis", "Parkinson's Disease", "Memory & Cognitive Disorders", "Vertigo & Balance Disorders"],
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300",
    availability: [
      { date: "14", slots: ["10:00 AM", "01:30 PM", "04:00 PM"] },
      { date: "15", slots: ["09:00 AM", "12:00 PM", "03:30 PM"] }
    ]
  },
  {
    _id: "660000000000000000000005",
    name: "Dr. Emily Rodriguez",
    specialty: "Pediatrician",
    rating: 4.8,
    reviews: 215,
    experience: "8+ Years",
    patients: "4.2k+",
    about: "Dr. Emily Rodriguez is an award-winning Pediatrician dedicated to providing holistic, compassionate healthcare for children from birth through adolescence. Trained at the University of Ibadan College of Medicine, she is known for her gentle approach and evidence-based practice in childhood illness management, growth monitoring, and preventive health. She is a certified Neonatal Resuscitation Provider and a passionate advocate for children's wellness.",
    clinicalFocus: ["Newborn & Neonatal Care", "Childhood Vaccinations", "Growth & Developmental Assessment", "Pediatric Infectious Diseases", "Childhood Asthma & Allergy", "Nutritional Counselling", "Adolescent Health", "Pediatric Emergency Care"],
    image: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=300&h=300",
    availability: [
      { date: "14", slots: ["08:30 AM", "11:00 AM", "02:00 PM", "04:00 PM"] },
      { date: "16", slots: ["09:00 AM", "01:00 PM"] }
    ]
  },
  {
    _id: "660000000000000000000006",
    name: "Dr. James Wilson",
    specialty: "Dentist",
    rating: 4.9,
    reviews: 164,
    experience: "11+ Years",
    patients: "2.9k+",
    about: "Dr. James Wilson is a highly accomplished Dental Surgeon with over 11 years of experience delivering excellence in restorative, preventative, and cosmetic dentistry. A Fellow of the West African College of Surgeons (Dental), he is trained in digital dentistry and minimally invasive techniques that prioritize patient comfort and long-term oral health. He has treated thousands of patients across Nigeria with a hallmark zero-pain dental experience.",
    clinicalFocus: ["Root Canal Therapy", "Teeth Whitening & Veneers", "Dental Implants", "Orthodontics & Braces", "Cavity Fillings & Crowns", "Gum Disease Treatment", "Wisdom Tooth Extraction", "Oral Cancer Screening"],
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300",
    availability: [
      { date: "14", slots: ["09:30 AM", "11:30 AM", "02:30 PM", "04:30 PM"] },
      { date: "15", slots: ["08:30 AM", "01:00 PM", "03:00 PM"] }
    ]
  },
  {
    _id: "660000000000000000000007",
    name: "Dr. Aisha Patel",
    specialty: "Optometrist",
    rating: 4.8,
    reviews: 110,
    experience: "7+ Years",
    patients: "2.1k+",
    about: "Dr. Aisha Patel is a specialist Optometrist with expertise in advanced ocular diagnostics, vision therapy, and low-vision rehabilitation. With over 7 years of clinical practice, she employs state-of-the-art retinal imaging, corneal topography, and computerized refraction technology to accurately diagnose and correct all visual disorders. She is also certified in pediatric vision assessment and is a passionate advocate for early eye care.",
    clinicalFocus: ["Comprehensive Eye Exams", "Glaucoma Detection & Management", "Cataract Pre/Post-Op Care", "Myopia & Astigmatism Correction", "Dry Eye Syndrome", "Diabetic Retinopathy Screening", "Pediatric Vision Therapy", "Contact Lens Fitting"],
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=300&h=300",
    availability: [
      { date: "14", slots: ["10:30 AM", "01:00 PM", "03:30 PM"] },
      { date: "15", slots: ["09:00 AM", "11:00 AM", "02:00 PM"] }
    ]
  },
  {
    _id: "660000000000000000000008",
    name: "Dr. David Adeleke",
    specialty: "General Practitioner",
    rating: 4.9,
    reviews: 230,
    experience: "14+ Years",
    patients: "5k+",
    about: "Dr. David Adeleke is one of MedClinic's most experienced General Practitioners, with 14 years of frontline primary care practice across Lagos State. He serves as the clinical backbone of the clinic, providing holistic family health assessments, infectious disease management, and comprehensive wellness screenings. His extensive knowledge of tropical diseases — including malaria and typhoid — combined with his approachable bedside manner makes him the first point of call for thousands of families.",
    clinicalFocus: ["Malaria & Typhoid Diagnosis", "Routine Physical Exams", "Diabetes & Hypertension Monitoring", "Infectious Disease Management", "Laboratory Test Interpretation", "Preventive Health Screenings", "Wound Care & Minor Surgery", "Chronic Disease Management"],
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300&h=300",
    availability: [
      { date: "14", slots: ["08:00 AM", "10:00 AM", "01:00 PM", "03:00 PM", "05:00 PM"] },
      { date: "15", slots: ["09:00 AM", "11:30 AM", "02:30 PM", "04:00 PM"] }
    ]
  },
  {
    _id: "660000000000000000000009",
    name: "Dr. Marcus Vance",
    specialty: "Orthopedic Surgeon",
    rating: 4.9,
    reviews: 185,
    experience: "16+ Years",
    patients: "3.7k+",
    about: "Dr. Marcus Vance is a highly acclaimed Orthopedic and Trauma Surgeon with 16 years of surgical excellence in musculoskeletal medicine. Trained at Johns Hopkins School of Medicine and the College of Surgeons of Nigeria, he has performed over 3,000 orthopedic procedures, specializing in joint reconstruction, sports injury repair, and spine surgery. He is a Fellow of the National Postgraduate Medical College of Nigeria and a member of the Nigerian Orthopedic Association.",
    clinicalFocus: ["Total Knee & Hip Replacement", "Sports Injury Rehabilitation", "Spinal Disc & Sciatica Care", "Bone Fracture & Trauma Surgery", "Arthritis & Rheumatism Management", "Anterior Cruciate Ligament (ACL) Repair", "Shoulder & Rotator Cuff Surgery", "Pediatric Orthopedics"],
    image: "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&q=80&w=300&h=300",
    availability: [
      { date: "14", slots: ["09:00 AM", "11:30 AM", "02:00 PM", "04:30 PM"] },
      { date: "15", slots: ["10:00 AM", "01:00 PM", "03:30 PM"] }
    ]
  },
  {
    _id: "660000000000000000000010",
    name: "Dr. Elena Rostova",
    specialty: "ENT Specialist",
    rating: 4.8,
    reviews: 120,
    experience: "10+ Years",
    patients: "2.4k+",
    about: "Dr. Elena Rostova is a specialist Ear, Nose & Throat (ENT) Surgeon with over 10 years of dedicated clinical and surgical experience in otolaryngology. Trained in the UK and certified by the Royal College of Surgeons, she brings world-class ENT care to MedClinic. Dr. Rostova is expert in managing both surgical and medical ENT conditions with minimally invasive endoscopic techniques, prioritizing functional recovery and quality of life.",
    clinicalFocus: ["Sinusitis & Nasal Polyps", "Ear Infections & Otitis Media", "Tonsillectomy & Adenoidectomy", "Hearing Loss & Audiometry", "Tinnitus Management", "Snoring & Sleep Apnea", "Allergy-Induced Nasal Obstruction", "Voice & Throat Disorders"],
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300",
    availability: [
      { date: "14", slots: ["08:30 AM", "11:00 AM", "01:30 PM", "04:00 PM"] },
      { date: "15", slots: ["09:30 AM", "12:00 PM", "02:30 PM"] }
    ]
  },
  {
    _id: "660000000000000000000011",
    name: "Dr. Chloe Bennett",
    specialty: "Psychiatrist",
    rating: 4.9,
    reviews: 140,
    experience: "11+ Years",
    patients: "2.2k+",
    about: "Dr. Chloe Bennett is a compassionate and highly experienced Consultant Psychiatrist with 11 years of practice in adult and adolescent mental health. She is a Fellow of the Association of Psychiatrists in Nigeria and a certified Cognitive Behavioral Therapist (CBT). She creates a non-judgmental, safe therapeutic environment where patients can openly address their mental health challenges and work toward recovery with evidence-based interventions.",
    clinicalFocus: ["Anxiety & Panic Disorders", "Clinical Depression & Mood Disorders", "Burnout & Work-Related Stress", "Insomnia & Sleep Disorders", "Post-Traumatic Stress (PTSD)", "Cognitive Behavioral Therapy (CBT)", "Substance Abuse Counselling", "Schizophrenia & Bipolar Disorder"],
    image: "https://images.unsplash.com/photo-1594824432258-f73cecbdf365?auto=format&fit=crop&q=80&w=300&h=300",
    availability: [
      { date: "14", slots: ["10:00 AM", "01:00 PM", "03:00 PM", "05:00 PM"] },
      { date: "16", slots: ["09:00 AM", "11:30 AM", "02:00 PM"] }
    ]
  },
  {
    _id: "660000000000000000000012",
    name: "Dr. Grace Nwosu",
    specialty: "Gynecologist",
    rating: 4.9,
    reviews: 195,
    experience: "13+ Years",
    patients: "3.9k+",
    about: "Dr. Grace Nwosu is a senior Consultant Obstetrician and Gynecologist with 13 years of dedicated women's healthcare experience. A Fellow of the West African College of Surgeons (Obs & Gynae), she is recognized across Lagos for her expertise in high-risk obstetrics, minimally invasive gynecologic surgery, and hormonal health management. She is a warm, culturally sensitive clinician who puts every woman's dignity and comfort at the center of her practice.",
    clinicalFocus: ["Prenatal & Antenatal Care", "PCOS & Ovarian Cyst Management", "Hormonal Imbalance & Menopause", "Infertility Evaluation & Support", "Menstrual & Cycle Disorders", "Cervical Cancer Screening (Pap Smear)", "Laparoscopic Gynecologic Surgery", "Family Planning & Contraception"],
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300&h=300",
    availability: [
      { date: "14", slots: ["09:00 AM", "11:00 AM", "01:00 PM", "03:30 PM"] },
      { date: "15", slots: ["08:30 AM", "12:00 PM", "03:00 PM"] }
    ]
  }
];

// Get all doctors
router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find({});
    if (doctors && doctors.length > 0) {
      return res.json(doctors);
    }
    return res.json(mockDoctorsFallback);
  } catch (error) {
    return res.json(mockDoctorsFallback);
  }
});

// Get a single doctor
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (doctor) {
      return res.json(doctor);
    }
    const fallback = mockDoctorsFallback.find(d => d._id === req.params.id || d.name.toLowerCase().includes(req.params.id.toLowerCase()));
    if (fallback) {
      return res.json(fallback);
    }
    res.status(404).json({ message: 'Doctor not found' });
  } catch (error) {
    const fallback = mockDoctorsFallback.find(d => d._id === req.params.id);
    if (fallback) return res.json(fallback);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
