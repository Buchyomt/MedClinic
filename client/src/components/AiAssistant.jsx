import { API_BASE_URL } from '../config/api';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  MessageSquare, X, Send, Bot, Sparkles, ChevronRight, RotateCcw, 
  GripHorizontal
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';

export default function AiAssistant() {
  const { role, user } = useAuth();
  const { setSelectedDoctor } = useBooking();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const messagesEndRef = useRef(null);

  // ── Drag state for desktop ───────────────────────────────────────────────
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const dragStart = useRef({ mouseX: 0, mouseY: 0, panelX: 0, panelY: 0 });
  const panelRef = useRef(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/doctors`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setDoctors(data);
        }
      })
      .catch(err => console.error('AI Assistant doctors fetch error:', err));
  }, []);

  const getInitialGreeting = useCallback(() => {
    if (role === 'doctor') {
      const docName = user?.name ? `Dr. ${user.name.replace(/^Dr\.\s*/i, '')}` : 'Doctor';
      return `Hello ${docName}! 🩺 I am your Clinical AI Copilot. Ask me about drug dosages, antimicrobial guidelines, ICD-10 diagnostic codes, or patient queue insights.`;
    }
    if (role === 'pharmacist') {
      const pharmName = user?.name || 'Pharm. Chinedu';
      return `Hello ${pharmName}! 💊 I am your Clinical Pharmacy & MTM AI Copilot. Ask me about drug interactions, pediatric dosing, NAFDAC verification, or prescription safety reviews.`;
    }
    if (role === 'receptionist') {
      return `Hello ${user?.name || 'Front Desk Coordinator'}! 🏥 I am your Front-Desk AI Assistant. Need help managing walk-in intake, doctor availability rosters, or appointment queues?`;
    }
    // Patient role or guest
    const patientName = user?.name ? user.name.replace(/^(Dr\.|Pharm\.)\s*/i, '').split(' ')[0] : 'there';
    return `Hello ${patientName}! 👋 I am your MediCare AI Health Assistant.\n\nTell me about your symptoms or medical questions (e.g. body allergies, malaria, skin rashes, chest pain, eye strain), and I'll give you instant clinical insights and direct you to the ideal specialist doctor!`;
  }, [user?.name, role]);

  const [messages, setMessages] = useState([
    { role: 'ai', text: getInitialGreeting() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Always synchronize initial greeting whenever logged-in user, name, or role changes
  useEffect(() => {
    setMessages([
      { role: 'ai', text: getInitialGreeting() }
    ]);
  }, [user?.name, user?.email, role, getInitialGreeting]);

  // When panel is opened, if there's only the welcome message, ensure it matches current user
  useEffect(() => {
    if (isOpen) {
      setMessages(prev => {
        if (prev.length <= 1) {
          return [{ role: 'ai', text: getInitialGreeting() }];
        }
        return prev;
      });
    }
  }, [isOpen, getInitialGreeting]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // ── Body scroll lock when panel is open ─────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      // Reset drag position when closed
      setPos({ x: 0, y: 0 });
      setHasDragged(false);
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // ── Drag handlers ────────────────────────────────────────────────────────
  const handleDragStart = useCallback((e) => {
    // Only drag on desktop (pointer not touch)
    if (e.pointerType === 'touch') return;
    e.preventDefault();
    dragStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      panelX: pos.x,
      panelY: pos.y,
    };
    setIsDragging(true);
  }, [pos]);

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e) => {
      const dx = e.clientX - dragStart.current.mouseX;
      const dy = e.clientY - dragStart.current.mouseY;
      setPos({ x: dragStart.current.panelX + dx, y: dragStart.current.panelY + dy });
      setHasDragged(true);
    };
    const onUp = () => setIsDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [isDragging]);

  // Helper to match specialty from loaded doctors or fallback
  const findDoctor = (specialtyKey) => {
    const term = specialtyKey.toLowerCase();
    const found = doctors.find(doc => {
      const spec = (doc.specialty || '').toLowerCase();
      if (term === 'allergy' || term === 'immunology') return spec.includes('allerg') || spec.includes('immun');
      if (term === 'dermatology') return spec.includes('derma') || spec.includes('skin');
      if (term === 'cardiology') return spec.includes('cardio') || spec.includes('heart');
      if (term === 'neurology') return spec.includes('neuro') || spec.includes('brain');
      if (term === 'pediatrics') return spec.includes('pediat') || spec.includes('child');
      if (term === 'dentistry') return spec.includes('dent') || spec.includes('oral');
      if (term === 'optometry') return spec.includes('optom') || spec.includes('eye');
      if (term === 'orthopedics') return spec.includes('ortho') || spec.includes('bone') || spec.includes('joint');
      if (term === 'ent') return spec.includes('ent') || spec.includes('ear') || spec.includes('throat');
      if (term === 'psychiatry' || term === 'mental') return spec.includes('psych') || spec.includes('mental');
      if (term === 'gynecology' || term === 'women') return spec.includes('gynec') || spec.includes('women');
      if (term === 'general') return spec.includes('general') || spec.includes('practitioner');
      return spec.includes(term);
    });
    return found || doctors[0];
  };

  // Comprehensive Conversational and Symptom Triage Engine
  const generateSmartResponse = (query) => {
    const q = query.toLowerCase().trim();

    // 1. Reset / Start Over Command
    if (q.includes('beginning') || q.includes('start over') || q.includes('restart') || 
        q.includes('reset') || q.includes('clear chat') || q.includes('start again') || q.includes('go back')) {
      return {
        text: '🔄 Let\'s start fresh from the beginning!\n\nI am ready to help. Tell me what symptoms or health questions you have, or tap one of the quick topics below.',
        isReset: true
      };
    }

    // 2. Greetings & Conversational Pleasantries
    if (/^(hi|hello|hey|good\s*(morning|afternoon|evening|day)|greetings|hola|howdy|what's\s*up|yo)\b/i.test(q) && q.length < 35) {
      let displayName = 'there';
      if (role === 'doctor') {
        displayName = user?.name ? `Dr. ${user.name.replace(/^Dr\.\s*/i, '')}` : 'Doctor';
      } else if (role === 'pharmacist') {
        displayName = user?.name || 'Pharm. Chinedu';
      } else if (user?.name) {
        displayName = user.name.replace(/^(Dr\.|Pharm\.)\s*/i, '').split(' ')[0];
      }
      return {
        text: `Hello ${displayName}! 😊 How can I help you today?\n\nTell me what symptoms or health concerns you are experiencing, and I'll give you accurate clinical guidance and match you with the right specialist doctor.`,
        action: { label: 'Explore Specialists', path: '/' }
      };
    }

    if (q.includes('how are you') || q.includes('how do you do') || q.includes('how r u')) {
      return {
        text: 'I\'m doing great and ready to assist with all your health and medical questions! 😊 How are you feeling today? Any symptoms you\'d like to check?'
      };
    }

    if (q.includes('who are you') || q.includes('what can you do') || q.includes('your name') || q.includes('help me')) {
      return {
        text: '🤖 I am MediCare\'s Clinical AI Health Assistant. I am trained to:\n• Accurately triage symptoms (body allergies, malaria, heart palpitations, rashes, dental, nerves, etc.)\n• Recommend the exact specialist doctor for your condition\n• Provide safe preliminary first-aid & pharmacological guidance\n• Seamlessly link you to schedule an appointment with your chosen specialist',
        action: { label: 'Browse Doctors Roster', path: '/' }
      };
    }

    if (q.includes('thank') || q.includes('thx') || q.includes('great thanks') || q.includes('ok thanks') || q.includes('appreciate')) {
      return {
        text: 'You are very welcome! 😊 Wishing you vibrant health and speedy recovery. Feel free to ask anytime if you need more assistance!'
      };
    }

    if (q.includes('bye') || q.includes('goodbye') || q.includes('see you') || q.includes('goodnight')) {
      return {
        text: 'Take good care of yourself! 👋 Remember, our doctors and clinic are always here whenever you need care. Have a wonderful day!'
      };
    }

    // ----------------------------------------------------
    // DOCTOR ROLE INTELLIGENCE
    // ----------------------------------------------------
    if (role === 'doctor') {
      if (q.includes('dosage') || q.includes('drug') || q.includes('prescrib') || q.includes('medication') || q.includes('dose')) {
        return {
          text: '📋 Clinical Practice Dosage Reference:\n• Amoxicillin/Clavulanate: 875/125mg PO BID (mild/mod infections).\n• Artemether/Lumefantrine (Coartem): 20/120mg, 4 tabs at 0h, 8h, 24h, 36h, 48h, 60h.\n• Cetirizine / Loratadine: 10mg PO once daily (allergic rhinitis/urticaria).\n• Ciprofloxacin: 500mg PO q12h (complicated UTI: 7-14 days).\n• Metformin HCl: 500mg PO BID with meals (max 2000mg/day).\n• Lisinopril: Initial 10mg PO daily (titrate up to 40mg for HTN).\n• Paracetamol: 500mg-1000mg PO q4-6h (max 4g in 24h).',
          action: { label: 'Open Queue & Issue Rx', path: '/' }
        };
      }
      if (q.includes('icd') || q.includes('code') || q.includes('diagnostic')) {
        return {
          text: '🩺 Diagnostic ICD-10 Quick Lookup:\n• L50.9 – Urticaria (Allergic body reaction), unspecified\n• T78.40 – Allergy, unspecified\n• B54 – Unspecified malaria (B50.9: P. falciparum)\n• J30.9 – Allergic rhinitis, unspecified\n• I10 – Essential (primary) hypertension\n• E11.9 – Type 2 diabetes mellitus without complications\n• L20.9 – Atopic dermatitis (Eczema), unspecified\n• G43.909 – Migraine, unspecified',
          action: { label: 'Doctor Portal Dashboard', path: '/' }
        };
      }
      if (q.includes('referral') || q.includes('peer') || q.includes('consult')) {
        return {
          text: 'You can transfer or refer patient cases to fellow specialists directly using the Peer Specialists Directory on your home dashboard.',
          action: { label: 'Peer Directory', path: '/' }
        };
      }
      return {
        text: 'I can assist you with clinical guidelines, ICD-10 diagnostic codes, antimicrobial dosages, and patient queue metrics. How may I support your practice today?',
        action: { label: 'Doctor Portal', path: '/' }
      };
    }

    // ----------------------------------------------------
    // RECEPTIONIST ROLE INTELLIGENCE
    // ----------------------------------------------------
    if (role === 'receptionist') {
      if (q.includes('walk in') || q.includes('register') || q.includes('intake') || q.includes('offline')) {
        return {
          text: 'To register an offline walk-in patient, click the "Register Walk-In Patient" button at the top of your dashboard. Enter patient credentials and assign an on-duty specialist.',
          action: { label: 'Register Walk-In', path: '/' }
        };
      }
      if (q.includes('duty') || q.includes('roster') || q.includes('doctor') || q.includes('available')) {
        return {
          text: 'The Doctor On-Duty Roster shows live specialist availability. Doctors marked "Available" can take walk-ins immediately.',
          action: { label: 'View Doctor Roster', path: '/' }
        };
      }
      return {
        text: 'I am your Front-Desk AI Assistant. You can monitor check-in volumes, manage doctor duty statuses, and register walk-in patients from your portal.',
        action: { label: 'Reception Dashboard', path: '/' }
      };
    }

    // ----------------------------------------------------
    // PATIENT ROLE: EMERGENCY RED FLAGS
    // ----------------------------------------------------
    if (q.includes('unconscious') || q.includes('severe chest pain') || q.includes('poison') || 
        q.includes('cannot breathe') || q.includes('throat swelling') || q.includes('anaphylaxis') || 
        q.includes('heavy bleeding') || q.includes('choking') || q.includes('stroke')) {
      return {
        text: '🚨 URGENT MEDICAL EMERGENCY NOTICE:\nIf you are experiencing acute shortness of breath, throat swelling / anaphylaxis, severe chest pressure radiating to the arm/jaw, or profuse bleeding, please call emergency services immediately (e.g. 911, 112) or go to the nearest Emergency Room.',
        action: { label: 'Emergency Guidance', path: '/' }
      };
    }

    // ----------------------------------------------------
    // PATIENT ROLE: COMPREHENSIVE ILLNESS & SYMPTOM TRIAGE
    // ----------------------------------------------------

    // 1. ALLERGIES, BODY ALLERGY, HIVES, IMMUNE REACTIONS (HIGH PRIORITY DETECTOR)
    if (q.includes('allerg') || q.includes('body allergy') || q.includes('allergic') || 
        q.includes('hive') || q.includes('urticaria') || q.includes('swelling') || 
        q.includes('food reaction') || q.includes('itching all over') || q.includes('histamine') || 
        q.includes('pollen') || q.includes('hay fever') || q.includes('body reaction') || 
        q.includes('skin allergy') || q.includes('drug reaction') || q.includes('peanut')) {
      const doc = findDoctor('allergy');
      return {
        text: `🌿 Allergy & Immunology Clinical Assessment:\n\nBody allergies, hives (urticaria), generalized itching, or food/environmental reactions occur when your immune system overreacts to specific allergen triggers.\n\n• Immediate Guidance: Avoid known triggers (certain foods, detergents, dust, pollen). Over-the-counter second-generation antihistamines (e.g., Cetirizine, Loratadine) often provide symptom relief. \n⚠️ Note: If you experience difficulty breathing, lip or throat swelling, seek emergency care immediately.\n\nWe recommend a comprehensive allergy evaluation with our Allergist & Immunologist ${doc ? doc.name : 'Dr. Zainab Al-Hassan'}.`,
        targetDoctor: doc,
        action: {
          label: `Book Allergy Care with ${doc ? doc.name : 'Dr. Zainab Al-Hassan'}`,
          doctor: doc,
          path: doc ? `/doctor/${doc._id}` : '/book'
        }
      };
    }

    // 2. MALARIA, TYPHOID & TROPICAL INFECTIOUS DISEASES
    if (q.includes('malaria') || q.includes('typhoid') || q.includes('mosquito') || 
        q.includes('shivering') || (q.includes('fever') && (q.includes('chill') || q.includes('sweat') || q.includes('bit')))) {
      const doc = findDoctor('general');
      return {
        text: `🦟 Tropical & Infectious Disease Assessment:\n\nMalaria and Typhoid typically present with high fever, intermittent chills, severe body aches, headaches, sweating, and nausea. \n\n• Clinical Guidance: A Rapid Diagnostic Test (mRDT) or blood film microscopy is recommended before starting Artemisinin-based Combination Therapy (ACT). Stay well hydrated with oral electrolytes.\n\nWe recommend booking an evaluation with our General Physician ${doc ? doc.name : 'Dr. David Adeleke'}.`,
        targetDoctor: doc,
        action: {
          label: `Book Consultation with ${doc ? doc.name : 'Dr. David Adeleke'}`,
          doctor: doc,
          path: doc ? `/doctor/${doc._id}` : '/book'
        }
      };
    }

    // 3. DERMATOLOGY / SKIN, HAIR & NAILS
    if (q.includes('skin') || q.includes('rash') || q.includes('acne') || q.includes('pimple') || 
        q.includes('itch') || q.includes('eczema') || q.includes('psoriasis') || 
        q.includes('ringworm') || q.includes('fungal') || q.includes('mole') || q.includes('blister') || 
        q.includes('alopecia') || q.includes('hair loss') || q.includes('derma') || q.includes('peeling') || 
        q.includes('scabies') || q.includes('shingles') || q.includes('burn') || q.includes('wart')) {
      const doc = findDoctor('dermatology');
      return {
        text: `🧴 Dermatology & Skin Assessment:\n\nSkin conditions like eczema, persistent rashes, acne vulgaris, psoriasis, or fungal infections require targeted clinical evaluation by a certified Dermatologist for topical or systemic therapy.\n\nWe recommend scheduling an appointment with our skin specialist ${doc ? doc.name : 'Dr. Olivia Martinez'}.`,
        targetDoctor: doc,
        action: {
          label: `Book Dermatology with ${doc ? doc.name : 'Dr. Olivia Martinez'}`,
          doctor: doc,
          path: doc ? `/doctor/${doc._id}` : '/book'
        }
      };
    }

    // 4. CARDIOLOGY / HEART, HIGH BP & CHEST
    if (q.includes('heart') || q.includes('chest') || q.includes('bp') || q.includes('pressure') || 
        q.includes('hypertension') || q.includes('palpitation') || q.includes('cardio') || 
        q.includes('pulse') || q.includes('angina') || q.includes('breathless') || q.includes('swollen feet')) {
      const doc = findDoctor('cardiology');
      return {
        text: `❤️ Cardiovascular Assessment:\n\n⚠️ Chest discomfort, palpitations, irregular heartbeat, or persistently elevated blood pressure require thorough cardiac evaluation (ECG, Echocardiogram, lipid profiling).\n\nWe recommend booking a consultation with our Cardiologist ${doc ? doc.name : 'Dr. Sarah Okafor'}.`,
        targetDoctor: doc,
        action: {
          label: `Book Cardiology with ${doc ? doc.name : 'Dr. Sarah Okafor'}`,
          doctor: doc,
          path: doc ? `/doctor/${doc._id}` : '/book'
        }
      };
    }

    // 5. NEUROLOGY / HEADACHES, MIGRAINES, NERVES & BRAIN
    if (q.includes('head') || q.includes('headache') || q.includes('migraine') || q.includes('dizzy') || 
        q.includes('dizziness') || q.includes('numb') || q.includes('tingling') || q.includes('nerve') || 
        q.includes('brain') || q.includes('seizure') || q.includes('tremor') || q.includes('vertigo') || 
        q.includes('memory') || q.includes('concussion') || q.includes('neuro') || q.includes('paralysis')) {
      const doc = findDoctor('neurology');
      return {
        text: `🧠 Neurological Assessment:\n\nRecurring migraines, chronic tension headaches, numbness, tingling sensations, or unexplained dizziness may indicate neurological or cervical nerve involvement.\n\nWe recommend booking with our Neurologist ${doc ? doc.name : 'Dr. Michael Chen'}.`,
        targetDoctor: doc,
        action: {
          label: `Book Neurology with ${doc ? doc.name : 'Dr. Michael Chen'}`,
          doctor: doc,
          path: doc ? `/doctor/${doc._id}` : '/book'
        }
      };
    }

    // 6. ORTHOPEDICS, BONES, JOINTS, KNEE, BACK & SPORTS INJURIES
    if (q.includes('joint') || q.includes('knee') || q.includes('back pain') || q.includes('waist') || 
        q.includes('bone') || q.includes('spine') || q.includes('arthritis') || q.includes('rheumatism') || 
        q.includes('fracture') || q.includes('sprain') || q.includes('shoulder') || q.includes('neck pain') || 
        q.includes('sciatica') || q.includes('ortho') || q.includes('ligament') || q.includes('cartilage')) {
      const doc = findDoctor('orthopedics');
      return {
        text: `🦴 Orthopedics & Musculoskeletal Assessment:\n\nJoint stiffness, knee pain, lower back discomfort, bone fractures, or sports sprains can be diagnosed with X-rays/MRIs and treated with physical therapy, joint care, and orthopedic rehabilitation.\n\nWe recommend scheduling an evaluation with our Orthopedic Surgeon ${doc ? doc.name : 'Dr. Marcus Vance'}.`,
        targetDoctor: doc,
        action: {
          label: `Book Orthopedics with ${doc ? doc.name : 'Dr. Marcus Vance'}`,
          doctor: doc,
          path: doc ? `/doctor/${doc._id}` : '/book'
        }
      };
    }

    // 7. ENT / EAR, NOSE, THROAT & SINUSITIS
    if (q.includes('ear') || q.includes('sinus') || q.includes('sinusitis') || q.includes('throat') || 
        q.includes('tonsil') || q.includes('hearing') || q.includes('tinnitus') || q.includes('nasal') || 
        q.includes('congestion') || q.includes('snoring') || q.includes('ent')) {
      const doc = findDoctor('ent');
      return {
        text: `👂 Ear, Nose & Throat (ENT) Assessment:\n\nEar infections, chronic sinus pressure, tonsillitis, nasal polyps, or hearing changes should be evaluated with specialized otoscopic and endoscopic examination.\n\nWe recommend consulting our ENT Specialist ${doc ? doc.name : 'Dr. Elena Rostova'}.`,
        targetDoctor: doc,
        action: {
          label: `Book ENT Consultation with ${doc ? doc.name : 'Dr. Elena Rostova'}`,
          doctor: doc,
          path: doc ? `/doctor/${doc._id}` : '/book'
        }
      };
    }

    // 8. DENTISTRY / TEETH, GUMS & ORAL HEALTH
    if (q.includes('tooth') || q.includes('teeth') || q.includes('gum') || q.includes('cavity') || 
        q.includes('cavities') || q.includes('mouth') || q.includes('dental') || q.includes('jaw') || 
        q.includes('molar') || q.includes('dentist') || q.includes('root canal') || q.includes('bleeding gum') || 
        q.includes('bad breath') || q.includes('toothache')) {
      const doc = findDoctor('dentistry');
      return {
        text: `🦷 Dental & Oral Health Assessment:\n\nTooth sensitivity, aching molars, bleeding gums, or cavity discomfort should be treated promptly to prevent pulp infections or abscesses.\n\nWe recommend booking with our Dental Specialist ${doc ? doc.name : 'Dr. James Wilson'}.`,
        targetDoctor: doc,
        action: {
          label: `Book Dental Care with ${doc ? doc.name : 'Dr. James Wilson'}`,
          doctor: doc,
          path: doc ? `/doctor/${doc._id}` : '/book'
        }
      };
    }

    // 9. OPTOMETRY / EYES & VISION
    if (q.includes('eye') || q.includes('vision') || q.includes('blur') || q.includes('blurred') || 
        q.includes('sight') || q.includes('glasses') || q.includes('cataract') || q.includes('glaucoma') || 
        q.includes('optom') || q.includes('conjunctivitis') || q.includes('pink eye') || q.includes('dry eye') || 
        q.includes('eye pain') || q.includes('stye') || q.includes('floater')) {
      const doc = findDoctor('optometry');
      return {
        text: `👁️ Vision & Ocular Assessment:\n\nBlurry sight, ocular strain, eye redness, irritation, or vision changes should be examined through comprehensive refraction and retinal diagnostics.\n\nWe recommend an eye exam with our Optometrist ${doc ? doc.name : 'Dr. Aisha Patel'}.`,
        targetDoctor: doc,
        action: {
          label: `Book Eye Exam with ${doc ? doc.name : 'Dr. Aisha Patel'}`,
          doctor: doc,
          path: doc ? `/doctor/${doc._id}` : '/book'
        }
      };
    }

    // 10. PEDIATRICS / CHILD HEALTH, INFANT CARE & VACCINES
    if (q.includes('child') || q.includes('baby') || q.includes('infant') || q.includes('toddler') || 
        q.includes('kid') || q.includes('pediat') || q.includes('vaccin') || q.includes('immuniz') || 
        q.includes('teething') || q.includes('colic') || q.includes('measles') || q.includes('chickenpox')) {
      const doc = findDoctor('pediatrics');
      return {
        text: `👶 Pediatric & Infant Health Assessment:\n\nFor childhood fever, newborn checkups, immunizations, growth monitoring, and pediatric nutrition, our specialized pediatric team is here to assist.\n\nWe recommend booking with our Pediatrician ${doc ? doc.name : 'Dr. Emily Rodriguez'}.`,
        targetDoctor: doc,
        action: {
          label: `Book Pediatric Care with ${doc ? doc.name : 'Dr. Emily Rodriguez'}`,
          doctor: doc,
          path: doc ? `/doctor/${doc._id}` : '/book'
        }
      };
    }

    // 11. MENTAL HEALTH, ANXIETY, DEPRESSION & STRESS
    if (q.includes('anxiety') || q.includes('depress') || q.includes('panic') || q.includes('stress') || 
        q.includes('sleep') || q.includes('insomnia') || q.includes('burnout') || q.includes('mental health') || 
        q.includes('psychiatry') || q.includes('therapy')) {
      const doc = findDoctor('psychiatry');
      return {
        text: `🌿 Mental Wellness & Psychiatric Assessment:\n\nPersistent anxiety, overwhelming stress, low mood, sleep disturbances, or panic symptoms can be supported with evidence-based cognitive therapy, counseling, and medical care in a safe environment.\n\nWe recommend booking with our Mental Health Specialist ${doc ? doc.name : 'Dr. Chloe Bennett'}.`,
        targetDoctor: doc,
        action: {
          label: `Book Mental Health Care with ${doc ? doc.name : 'Dr. Chloe Bennett'}`,
          doctor: doc,
          path: doc ? `/doctor/${doc._id}` : '/book'
        }
      };
    }

    // 12. GYNECOLOGY & WOMEN'S HEALTH
    if (q.includes('pregnant') || q.includes('pregnancy') || q.includes('period') || q.includes('menstrual') || 
        q.includes('cramps') || q.includes('pcos') || q.includes('gynec') || q.includes('fertility') || 
        q.includes('ovary') || q.includes('women health')) {
      const doc = findDoctor('gynecology');
      return {
        text: `🌸 Women's Health & Gynecological Assessment:\n\nFor prenatal care, menstrual cramps, irregular cycles, PCOS management, and hormonal wellness, our senior gynecology team provides expert clinical attention.\n\nWe recommend booking with our Gynecologist ${doc ? doc.name : 'Dr. Grace Nwosu'}.`,
        targetDoctor: doc,
        action: {
          label: `Book Women's Health with ${doc ? doc.name : 'Dr. Grace Nwosu'}`,
          doctor: doc,
          path: doc ? `/doctor/${doc._id}` : '/book'
        }
      };
    }

    // 13. GASTROENTEROLOGY & STOMACH, ULCERS, REFLUX, DIGESTION
    if (q.includes('stomach') || q.includes('ulcer') || q.includes('gastritis') || q.includes('acid reflux') || 
        q.includes('heartburn') || q.includes('gerd') || q.includes('constipation') || q.includes('diarrhea') || 
        q.includes('bloating') || q.includes('vomit') || q.includes('nausea') || q.includes('abdomen') || 
        q.includes('belly') || q.includes('food poisoning') || q.includes('indigestion')) {
      const doc = findDoctor('general');
      return {
        text: `🥣 Gastrointestinal & Digestive Assessment:\n\nAbdominal discomfort, acid reflux/GERD, persistent diarrhea, gastritis, or suspected ulcers require clinical review to alleviate symptoms and prevent complications.\n\nWe recommend consulting our Physician ${doc ? doc.name : 'Dr. David Adeleke'}.`,
        targetDoctor: doc,
        action: {
          label: `Book Consultation with ${doc ? doc.name : 'Dr. David Adeleke'}`,
          doctor: doc,
          path: doc ? `/doctor/${doc._id}` : '/book'
        }
      };
    }

    // 14. GENERAL FEVER, LAB TEST, ROUTINE CHECKUP
    if (q.includes('fever') || q.includes('ill') || q.includes('sick') || q.includes('checkup') || 
        q.includes('test') || q.includes('wellness') || q.includes('doctor') || q.includes('general') || 
        q.includes('fatigue') || q.includes('tired') || q.includes('weakness')) {
      const doc = findDoctor('general');
      return {
        text: `🩺 General Medical Assessment:\n\nFor general illness, unexplained fever, routine physical checkups, or comprehensive laboratory screenings, our General Practice clinic is ready to assist you.\n\nWe recommend booking an appointment with ${doc ? doc.name : 'Dr. David Adeleke'}.`,
        targetDoctor: doc,
        action: {
          label: `Book Consultation with ${doc ? doc.name : 'Dr. David Adeleke'}`,
          doctor: doc,
          path: doc ? `/doctor/${doc._id}` : '/book'
        }
      };
    }

    // 15. APPOINTMENTS NAVIGATION
    if (q.includes('appointment') || q.includes('my visit') || q.includes('schedule') || q.includes('history')) {
      return {
        text: '📅 You can view all your active appointments, consultation notes, and doctor details directly in your Appointments Dashboard.',
        action: { label: 'View My Appointments', path: '/appointments' }
      };
    }

    // Default Fallback
    return {
      text: '💬 I understand. To give you the most accurate clinical guidance, could you share more details about your symptoms (e.g., body allergy, fever/malaria, skin rash, knee/joint pain, toothache, or blurred vision)?\n\nYou can also browse all available doctors below.',
      action: { label: 'Explore Specialists', path: '/' }
    };
  };

  const handleSend = (textToSend) => {
    const query = typeof textToSend === 'string' ? textToSend : input;
    if (!query.trim()) return;

    const userMsg = { role: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateSmartResponse(query);
      setIsTyping(false);
      if (response.isReset) {
        setMessages([
          { role: 'ai', text: getInitialGreeting() }
        ]);
      } else {
        setMessages(prev => [...prev, { 
          role: 'ai', 
          text: response.text, 
          action: response.action,
          doctor: response.targetDoctor 
        }]);
      }
    }, 550);
  };

  const handleActionClick = (action) => {
    if (!action) return;
    if (action.doctor) {
      setSelectedDoctor(action.doctor);
    }
    setIsOpen(false);
    navigate(action.path);
  };

  // Quick suggestion chips
  const quickPills = [
    { label: '🌿 Body Allergies', query: 'I have body allergy and hives reaction' },
    { label: '🦟 Malaria & Fever', query: 'I have malaria symptoms and fever' },
    { label: '🧴 Skin & Rashes', query: 'I have a skin rash and irritation' },
    { label: '❤️ Chest & Heart', query: 'I have chest palpitations and high blood pressure' },
    { label: '🧠 Headache & Dizziness', query: 'I have severe headaches and migraines' },
    { label: '🦴 Bones & Joints', query: 'I have joint and knee pain' },
    { label: '👂 Ear, Nose & Throat', query: 'I have sinusitis and earache' },
    { label: '🦷 Toothache', query: 'I have toothache and cavity pain' },
    { label: '👁️ Eye Care', query: 'I have blurry vision and eye strain' },
    { label: '👶 Child Health', query: 'I need a checkup for my child' },
    { label: '🔄 Start Over', query: 'Take me to the beginning' },
  ];

  return (
    <>
      {/* Floating Assistant Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-20 lg:bottom-6 right-4 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 bg-linear-to-r from-primary via-indigo-600 to-cyan-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all z-40 ${isOpen ? 'scale-0' : 'scale-100'}`}
        title="MediCare AI Health Assistant"
      >
        <div className="relative">
          <MessageSquare size={24} />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></span>
        </div>
      </button>

      {/* Chat Window — draggable on desktop */}
      <div
        ref={panelRef}
        className={`fixed bottom-0 left-0 w-full md:bottom-auto md:left-auto md:w-102.5 md:rounded-3xl bg-white dark:bg-slate-800 shadow-2xl transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} z-50 overflow-hidden flex flex-col h-[82vh] md:h-140 border border-slate-100 dark:border-slate-700`}
        style={hasDragged
          ? { transform: `translate(${pos.x}px, ${pos.y}px)`, bottom: 'auto', right: 'auto', top: `calc(50% - 280px + ${pos.y}px)`, left: `calc(50% - 205px + ${pos.x}px)`, transition: isDragging ? 'none' : 'box-shadow 0.2s' }
          : { bottom: isOpen ? (window.innerWidth >= 768 ? '80px' : '0') : '-100%', right: window.innerWidth >= 768 ? '24px' : '0', transition: isDragging ? 'none' : 'all 0.3s ease' }
        }
      >
        {/* Header — drag handle on desktop */}
        <div
          className={`bg-linear-to-r from-primary via-indigo-600 to-cyan-600 text-white p-4 flex justify-between items-center shrink-0 shadow-md ${isDragging ? 'cursor-grabbing' : 'md:cursor-grab cursor-default'}`}
          onMouseDown={handleDragStart}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm shadow-inner">
              <Bot size={20} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm block leading-tight">MediCare AI Assistant</span>
                <GripHorizontal size={13} className="text-white/50 hidden md:block shrink-0" title="Drag to move" />
              </div>
              <span className="text-[10px] text-cyan-100 flex items-center gap-1 font-medium">
                <Sparkles size={10} /> 
                {role === 'doctor' 
                  ? 'Clinical Decision Copilot' 
                  : role === 'pharmacist' 
                  ? 'Clinical Pharmacy & MTM AI' 
                  : role === 'receptionist' 
                  ? 'Front-Desk Operations AI' 
                  : 'Smart Clinical Triage & Health AI'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => handleSend('Take me to the beginning')}
              title="Restart Conversation"
              onMouseDown={(e) => e.stopPropagation()}
              className="text-white/80 hover:text-white transition-colors p-1.5 rounded-xl hover:bg-white/10 text-xs font-bold flex items-center gap-1"
            >
              <RotateCcw size={15} />
            </button>
            <button 
              onClick={() => setIsOpen(false)}
              onMouseDown={(e) => e.stopPropagation()}
              className="text-white/80 hover:text-white transition-colors p-1.5 rounded-xl hover:bg-white/10"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="bg-slate-100/90 dark:bg-slate-900/60 p-2.5 overflow-x-auto flex gap-1.5 hide-scrollbar border-b border-slate-200/60 dark:border-slate-700/60 shrink-0">
          {quickPills.map((pill, i) => (
            <button
              key={i}
              onClick={() => handleSend(pill.query)}
              className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-[11px] font-semibold border border-slate-200 dark:border-slate-700 shadow-2xs hover:bg-primary hover:text-white dark:hover:bg-primary transition-all shrink-0 cursor-pointer"
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3.5 bg-slate-50/60 dark:bg-slate-900/40">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-xs shadow-md' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-xs border border-slate-200/80 dark:border-slate-700 shadow-sm'}`}>
                <p className="whitespace-pre-line">{msg.text}</p>
                {msg.action && (
                  <button
                    onClick={() => handleActionClick(msg.action)}
                    className="mt-3 w-full bg-linear-to-r from-primary to-cyan-600 text-white font-bold py-2.5 px-3.5 rounded-xl shadow-md hover:shadow-lg hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-between gap-1.5 text-[11px] cursor-pointer"
                  >
                    <span className="truncate">{msg.action.label}</span>
                    <ChevronRight size={15} className="shrink-0" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl rounded-tl-xs border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder={role === 'doctor' ? 'Ask dosages, ICD-10 codes...' : role === 'receptionist' ? 'Ask reception queries...' : 'Describe symptoms (e.g. body allergy, malaria, rash)...'}
            className="flex-1 bg-slate-50 dark:bg-slate-700/60 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-600 rounded-2xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button 
            onClick={() => handleSend(input)}
            className="w-10 h-10 bg-primary text-white rounded-2xl flex items-center justify-center hover:bg-primary-dark active:scale-95 transition-all shrink-0 shadow-md cursor-pointer"
          >
            <Send size={16} className="-ml-0.5" />
          </button>
        </div>
      </div>
    </>
  );
}
