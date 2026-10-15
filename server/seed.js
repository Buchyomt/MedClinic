require('dotenv').config();
const mongoose = require('mongoose');
const Doctor = require('./models/Doctor');

const mockDoctors = [
  {
    name: "Dr. Sarah Okafor",
    specialty: "Cardiologist",
    rating: 4.9,
    reviews: 142,
    experience: "12+ Years",
    patients: "2.8k+",
    about: "Dr. Sarah Okafor is a board-certified cardiologist specializing in coronary artery disease, arrhythmias, hypertension, and advanced cardiovascular diagnostics.",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300",
    availability: [
      { date: "14", slots: ["09:00 AM", "10:30 AM", "01:00 PM", "03:00 PM"] },
      { date: "15", slots: ["11:00 AM", "02:00 PM", "04:30 PM"] },
      { date: "16", slots: ["09:30 AM", "11:30 AM", "02:30 PM"] }
    ]
  },
  {
    name: "Dr. Olivia Martinez",
    specialty: "Dermatologist",
    rating: 4.9,
    reviews: 178,
    experience: "9+ Years",
    patients: "3.2k+",
    about: "Dr. Olivia Martinez is an expert dermatologist providing advanced clinical and cosmetic skin therapies, acne treatments, eczema management, and skin cancer screenings.",
    image: "https://images.unsplash.com/photo-1594824432258-f73cecbdf365?auto=format&fit=crop&q=80&w=300&h=300",
    availability: [
      { date: "14", slots: ["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"] },
      { date: "15", slots: ["10:00 AM", "01:30 PM", "03:30 PM"] },
      { date: "16", slots: ["08:30 AM", "12:00 PM", "03:00 PM"] }
    ]
  },
  {
    name: "Dr. Zainab Al-Hassan",
    specialty: "Allergist & Immunologist",
    rating: 4.9,
    reviews: 156,
    experience: "10+ Years",
    patients: "2.6k+",
    about: "Dr. Zainab Al-Hassan specializes in acute and chronic allergy management, allergic rhinitis, full-body hives, food intolerances, immunotherapy, and asthma care.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300&h=300",
    availability: [
      { date: "14", slots: ["08:30 AM", "10:30 AM", "01:30 PM", "04:00 PM"] },
      { date: "15", slots: ["09:00 AM", "11:30 AM", "03:00 PM"] },
      { date: "16", slots: ["10:00 AM", "02:00 PM", "04:30 PM"] }
    ]
  },
  {
    name: "Dr. Michael Chen",
    specialty: "Neurologist",
    rating: 4.9,
    reviews: 95,
    experience: "15+ Years",
    patients: "3.1k+",
    about: "Dr. Michael Chen specializes in disorders of the central and peripheral nervous system, complex migraine management, neuropathy, and stroke recovery.",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300",
    availability: [
      { date: "14", slots: ["10:00 AM", "01:30 PM", "04:00 PM"] },
      { date: "15", slots: ["09:00 AM", "12:00 PM", "03:30 PM"] }
    ]
  },
  {
    name: "Dr. Emily Rodriguez",
    specialty: "Pediatrician",
    rating: 4.8,
    reviews: 215,
    experience: "8+ Years",
    patients: "4.2k+",
    about: "Dr. Emily Rodriguez is a compassionate pediatrician focused on the developmental, nutritional, and immunologic health of infants, children, and teens.",
    image: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=300&h=300",
    availability: [
      { date: "14", slots: ["08:30 AM", "11:00 AM", "02:00 PM", "04:00 PM"] },
      { date: "16", slots: ["09:00 AM", "01:00 PM"] }
    ]
  },
  {
    name: "Dr. James Wilson",
    specialty: "Dentist",
    rating: 4.9,
    reviews: 164,
    experience: "11+ Years",
    patients: "2.9k+",
    about: "Dr. James Wilson provides state-of-the-art restorative, preventative, and cosmetic dental procedures including root canal therapy, orthodontics, and implants.",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300",
    availability: [
      { date: "14", slots: ["09:30 AM", "11:30 AM", "02:30 PM", "04:30 PM"] },
      { date: "15", slots: ["08:30 AM", "01:00 PM", "03:00 PM"] }
    ]
  },
  {
    name: "Dr. Aisha Patel",
    specialty: "Optometrist",
    rating: 4.8,
    reviews: 110,
    experience: "7+ Years",
    patients: "2.1k+",
    about: "Dr. Aisha Patel is a specialist in ocular diagnostics, visual acuity corrections, glaucoma management, and pediatric vision therapy.",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=300&h=300",
    availability: [
      { date: "14", slots: ["10:30 AM", "01:00 PM", "03:30 PM"] },
      { date: "15", slots: ["09:00 AM", "11:00 AM", "02:00 PM"] }
    ]
  },
  {
    name: "Dr. David Adeleke",
    specialty: "General Practitioner",
    rating: 4.9,
    reviews: 230,
    experience: "14+ Years",
    patients: "5k+",
    about: "Dr. David Adeleke provides comprehensive primary care, infectious disease treatment (malaria, typhoid), routine wellness exams, and preventative health screenings.",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300&h=300",
    availability: [
      { date: "14", slots: ["08:00 AM", "10:00 AM", "01:00 PM", "03:00 PM", "05:00 PM"] },
      { date: "15", slots: ["09:00 AM", "11:30 AM", "02:30 PM", "04:00 PM"] }
    ]
  },
  {
    name: "Dr. Marcus Vance",
    specialty: "Orthopedic Surgeon",
    rating: 4.9,
    reviews: 185,
    experience: "16+ Years",
    patients: "3.7k+",
    about: "Dr. Marcus Vance is an orthopedic surgeon specializing in joint replacement, sports injury rehabilitation, spine & knee diagnostics, and bone fractures.",
    image: "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&q=80&w=300&h=300",
    availability: [
      { date: "14", slots: ["09:00 AM", "11:30 AM", "02:00 PM", "04:30 PM"] },
      { date: "15", slots: ["10:00 AM", "01:00 PM", "03:30 PM"] }
    ]
  },
  {
    name: "Dr. Elena Rostova",
    specialty: "ENT Specialist",
    rating: 4.8,
    reviews: 120,
    experience: "10+ Years",
    patients: "2.4k+",
    about: "Dr. Elena Rostova specializes in ear, nose, and throat pathology, sinus disease treatment, tonsillitis, hearing impairments, and allergy-induced nasal airway issues.",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300",
    availability: [
      { date: "14", slots: ["08:30 AM", "11:00 AM", "01:30 PM", "04:00 PM"] },
      { date: "15", slots: ["09:30 AM", "12:00 PM", "02:30 PM"] }
    ]
  },
  {
    name: "Dr. Chloe Bennett",
    specialty: "Psychiatrist",
    rating: 4.9,
    reviews: 140,
    experience: "11+ Years",
    patients: "2.2k+",
    about: "Dr. Chloe Bennett is an empathetic mental health specialist focusing on anxiety, depression, burnout management, insomnia, and cognitive behavioral therapy.",
    image: "https://images.unsplash.com/photo-1594824432258-f73cecbdf365?auto=format&fit=crop&q=80&w=300&h=300",
    availability: [
      { date: "14", slots: ["10:00 AM", "01:00 PM", "03:00 PM", "05:00 PM"] },
      { date: "16", slots: ["09:00 AM", "11:30 AM", "02:00 PM"] }
    ]
  },
  {
    name: "Dr. Grace Nwosu",
    specialty: "Gynecologist",
    rating: 4.9,
    reviews: 195,
    experience: "13+ Years",
    patients: "3.9k+",
    about: "Dr. Grace Nwosu is a senior obstetrician and gynecologist providing expert prenatal wellness, hormonal health, PCOS management, and comprehensive women's clinical care.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300&h=300",
    availability: [
      { date: "14", slots: ["09:00 AM", "11:00 AM", "01:00 PM", "03:30 PM"] },
      { date: "15", slots: ["08:30 AM", "12:00 PM", "03:00 PM"] }
    ]
  }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Clear existing doctors
    await Doctor.deleteMany({});
    console.log('Cleared existing doctors');
    
    // Insert mock doctors
    await Doctor.insertMany(mockDoctors);
    console.log('Successfully seeded mock doctors!');
    
    process.exit();
  })
  .catch((err) => {
    console.error('Error seeding data:', err);
    process.exit(1);
  });
