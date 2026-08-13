import {
  StaffMember,
  Student,
  EnrollmentDocument,
  GradeRecord,
  TeacherReport,
  SchoolEvent,
  StudentInvoice,
  PaymentReceipt
} from '../types';

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'stf-1',
    staffId: 'EMP-2024-001',
    name: 'Dr. Arthur Kingsley',
    role: 'Headteacher',
    email: 'kingsley@oakridge.edu',
    password: 'password123',
    phone: '+1 (555) 234-5678',
    department: 'Administration',
    joinDate: '2018-08-15',
    status: 'Active',
    salary: 85000,
    qualification: 'Ph.D. Educational Leadership'
  },
  {
    id: 'stf-2',
    staffId: 'EMP-2024-002',
    name: 'Mrs. Sarah Jenkins',
    role: 'Teacher',
    email: 's.jenkins@oakridge.edu',
    password: 'password123',
    phone: '+1 (555) 345-6789',
    department: 'Mathematics & STEM',
    joinDate: '2020-01-10',
    status: 'Active',
    salary: 58000,
    qualification: 'M.Sc. Mathematics',
    assignedClasses: ['Grade 9 Math', 'Grade 10 Calculus', 'Grade 11 Algebra']
  },
  {
    id: 'stf-3',
    staffId: 'EMP-2024-003',
    name: 'Mr. David O’Connor',
    role: 'Teacher',
    email: 'd.oconnor@oakridge.edu',
    password: 'password123',
    phone: '+1 (555) 456-7890',
    department: 'Humanities & Literature',
    joinDate: '2021-09-01',
    status: 'Active',
    salary: 55000,
    qualification: 'M.A. English Literature',
    assignedClasses: ['Grade 9 English', 'Grade 10 Literature', 'Grade 12 World History']
  },
  {
    id: 'stf-4',
    staffId: 'EMP-2024-004',
    name: 'Ms. Clara Vance',
    role: 'Secretary',
    email: 'c.vance@oakridge.edu',
    password: 'password123',
    phone: '+1 (555) 567-8901',
    department: 'Front Office & Admissions',
    joinDate: '2022-03-15',
    status: 'Active',
    salary: 46000,
    qualification: 'B.A. Public Administration'
  },
  {
    id: 'stf-5',
    staffId: 'EMP-2024-005',
    name: 'Mr. Marcus Thorne',
    role: 'Accounts Clerk',
    email: 'm.thorne@oakridge.edu',
    password: 'password123',
    phone: '+1 (555) 678-9012',
    department: 'Finance & Accounts',
    joinDate: '2019-11-20',
    status: 'Active',
    salary: 52000,
    qualification: 'B.Sc. Accounting & CPA'
  },
  {
    id: 'stf-6',
    staffId: 'EMP-2024-006',
    name: 'Dr. Rebecca Hastings',
    role: 'Teacher',
    email: 'r.hastings@oakridge.edu',
    password: 'password123',
    phone: '+1 (555) 789-0123',
    department: 'Natural Sciences',
    joinDate: '2023-08-20',
    status: 'Active',
    salary: 59000,
    qualification: 'Ph.D. Molecular Biology',
    assignedClasses: ['Grade 10 Biology', 'Grade 11 Chemistry', 'Grade 12 Physics']
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-1',
    studentId: 'STU-2026-001',
    firstName: 'Liam',
    lastName: 'Walker',
    grade: 'Grade 10',
    section: 'A',
    dateOfBirth: '2010-04-12',
    gender: 'Male',
    guardianName: 'Robert Walker',
    guardianContact: '+1 (555) 901-2345',
    guardianEmail: 'robert.w@gmail.com',
    address: '742 Evergreen Terrace, Springfield',
    status: 'Enrolled',
    admissionDate: '2024-09-01',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
  },
  {
    id: 'std-2',
    studentId: 'STU-2026-002',
    firstName: 'Sophia',
    lastName: 'Chen',
    grade: 'Grade 10',
    section: 'A',
    dateOfBirth: '2010-08-25',
    gender: 'Female',
    guardianName: 'Mei Chen',
    guardianContact: '+1 (555) 912-3456',
    guardianEmail: 'm.chen@techmail.com',
    address: '1088 Innovation Way, San Jose',
    status: 'Enrolled',
    admissionDate: '2024-09-01',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250'
  },
  {
    id: 'std-3',
    studentId: 'STU-2026-003',
    firstName: 'Ethan',
    lastName: 'Patel',
    grade: 'Grade 9',
    section: 'B',
    dateOfBirth: '2011-02-14',
    gender: 'Male',
    guardianName: 'Sanjay Patel',
    guardianContact: '+1 (555) 923-4567',
    guardianEmail: 'spatel@consulting.org',
    address: '452 Oakwood Drive, Austin',
    status: 'Pending Documents',
    admissionDate: '2025-01-15',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250'
  },
  {
    id: 'std-4',
    studentId: 'STU-2026-004',
    firstName: 'Aria',
    lastName: 'Kowalski',
    grade: 'Grade 11',
    section: 'A',
    dateOfBirth: '2009-11-30',
    gender: 'Female',
    guardianName: 'Elena Kowalski',
    guardianContact: '+1 (555) 934-5678',
    guardianEmail: 'elena.k@designco.com',
    address: '320 Highland Park, Chicago',
    status: 'Enrolled',
    admissionDate: '2023-09-01',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250'
  },
  {
    id: 'std-5',
    studentId: 'STU-2026-005',
    firstName: 'Marcus',
    lastName: 'Johnson Jr.',
    grade: 'Grade 9',
    section: 'A',
    dateOfBirth: '2011-06-08',
    gender: 'Male',
    guardianName: 'Marcus Johnson Sr.',
    guardianContact: '+1 (555) 945-6789',
    guardianEmail: 'marcus.sr@logistics.net',
    address: '88 Cedar Crest Blvd, Seattle',
    status: 'Enrolled',
    admissionDate: '2025-09-01',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250'
  },
  {
    id: 'std-6',
    studentId: 'STU-2026-006',
    firstName: 'Isabella',
    lastName: 'Gomez',
    grade: 'Grade 12',
    section: 'A',
    dateOfBirth: '2008-01-19',
    gender: 'Female',
    guardianName: 'Carlos Gomez',
    guardianContact: '+1 (555) 956-7890',
    guardianEmail: 'carlos.gomez@lawfirm.org',
    address: '159 Beacon Hill, Boston',
    status: 'Enrolled',
    admissionDate: '2022-09-01',
    photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=250'
  }
];

export const INITIAL_DOCUMENTS: EnrollmentDocument[] = [
  {
    id: 'doc-1',
    studentId: 'std-1',
    documentType: 'Birth Certificate',
    fileName: 'Liam_Walker_BirthCert_Verified.pdf',
    fileSize: '1.4 MB',
    uploadDate: '2024-08-20',
    status: 'Verified',
    verifiedBy: 'Ms. Clara Vance',
    notes: 'Official state seal confirmed.'
  },
  {
    id: 'doc-2',
    studentId: 'std-1',
    documentType: 'Immunization Record',
    fileName: 'Liam_Walker_Health_Record.pdf',
    fileSize: '890 KB',
    uploadDate: '2024-08-21',
    status: 'Verified',
    verifiedBy: 'Ms. Clara Vance'
  },
  {
    id: 'doc-3',
    studentId: 'std-2',
    documentType: 'Birth Certificate',
    fileName: 'Sophia_Chen_BirthCert.pdf',
    fileSize: '2.1 MB',
    uploadDate: '2024-08-22',
    status: 'Verified',
    verifiedBy: 'Ms. Clara Vance'
  },
  {
    id: 'doc-4',
    studentId: 'std-3',
    documentType: 'Birth Certificate',
    fileName: 'Ethan_Patel_BirthCert_Draft.pdf',
    fileSize: '1.1 MB',
    uploadDate: '2025-01-10',
    status: 'Pending Verification',
    notes: 'Awaiting certified translated copy.'
  },
  {
    id: 'doc-5',
    studentId: 'std-3',
    documentType: 'Previous School Transcript',
    fileName: 'Missing',
    fileSize: '0 KB',
    uploadDate: 'N/A',
    status: 'Missing',
    notes: 'Urgent: Previous middle school transcripts required for course placement.'
  },
  {
    id: 'doc-6',
    studentId: 'std-4',
    documentType: 'National ID / Passport',
    fileName: 'Aria_Kowalski_Passport.pdf',
    fileSize: '3.2 MB',
    uploadDate: '2023-08-15',
    status: 'Verified',
    verifiedBy: 'Ms. Clara Vance'
  }
];

export const INITIAL_GRADES: GradeRecord[] = [
  {
    id: 'grd-1',
    studentId: 'std-1',
    studentName: 'Liam Walker',
    subject: 'Mathematics',
    assessmentType: 'Midterm Exam',
    score: 88,
    maxScore: 100,
    gradeLetter: 'A-',
    term: 'Term 2',
    year: '2026',
    date: '2026-03-14',
    teacherId: 'stf-2',
    remarks: 'Demonstrated strong analytical problem solving in quadratic functions.'
  },
  {
    id: 'grd-2',
    studentId: 'std-1',
    studentName: 'Liam Walker',
    subject: 'Physics',
    assessmentType: 'Midterm Exam',
    score: 92,
    maxScore: 100,
    gradeLetter: 'A',
    term: 'Term 2',
    year: '2026',
    date: '2026-03-18',
    teacherId: 'stf-6',
    remarks: 'Top score in mechanics lab experiment.'
  },
  {
    id: 'grd-3',
    studentId: 'std-2',
    studentName: 'Sophia Chen',
    subject: 'Mathematics',
    assessmentType: 'Midterm Exam',
    score: 98,
    maxScore: 100,
    gradeLetter: 'A+',
    term: 'Term 2',
    year: '2026',
    date: '2026-03-14',
    teacherId: 'stf-2',
    remarks: 'Flawless performance in advanced calculus modules.'
  },
  {
    id: 'grd-4',
    studentId: 'std-2',
    studentName: 'Sophia Chen',
    subject: 'English Literature',
    assessmentType: 'Class Project',
    score: 91,
    maxScore: 100,
    gradeLetter: 'A',
    term: 'Term 2',
    year: '2026',
    date: '2026-03-20',
    teacherId: 'stf-3',
    remarks: 'Exceptional essay on Shakespearean themes.'
  },
  {
    id: 'grd-5',
    studentId: 'std-3',
    studentName: 'Ethan Patel',
    subject: 'Mathematics',
    assessmentType: 'Quiz',
    score: 74,
    maxScore: 100,
    gradeLetter: 'C+',
    term: 'Term 2',
    year: '2026',
    date: '2026-03-10',
    teacherId: 'stf-2',
    remarks: 'Needs extra practice in algebraic equations.'
  },
  {
    id: 'grd-6',
    studentId: 'std-4',
    studentName: 'Aria Kowalski',
    subject: 'Chemistry',
    assessmentType: 'Midterm Exam',
    score: 85,
    maxScore: 100,
    gradeLetter: 'B+',
    term: 'Term 2',
    year: '2026',
    date: '2026-03-15',
    teacherId: 'stf-6',
    remarks: 'Solid understanding of stoichiometry.'
  }
];

export const INITIAL_REPORTS: TeacherReport[] = [
  {
    id: 'rep-1',
    teacherId: 'stf-2',
    teacherName: 'Mrs. Sarah Jenkins',
    title: 'Grade 10 STEM Curriculum Mid-Term Overview',
    subject: 'Mathematics',
    grade: 'Grade 10',
    reportType: 'Academic Progress',
    priority: 'Normal',
    content: 'Overall class average for Grade 10 Math stands at 86.4%. Students have adapted remarkably well to the new interactive graphing software. Special recognition to Sophia Chen for peer tutoring efforts.',
    date: '2026-03-25',
    status: 'Reviewed',
    headteacherResponse: 'Excellent update, Sarah. Thank you for driving peer mentorship in STEM.'
  },
  {
    id: 'rep-2',
    teacherId: 'stf-6',
    teacherName: 'Dr. Rebecca Hastings',
    title: 'Urgent Science Lab Equipment Replacement Request',
    subject: 'Chemistry & Physics',
    grade: 'Grade 11 & 12',
    reportType: 'Resource Request',
    priority: 'High',
    content: 'Two digital spectrophotometers in Lab 3 are malfunctioning. We require immediate recalibration or replacement before the upcoming Advanced AP Science practical exams next month.',
    date: '2026-03-28',
    status: 'Pending Review'
  },
  {
    id: 'rep-3',
    teacherId: 'stf-3',
    teacherName: 'Mr. David O’Connor',
    title: 'Grade 9 English Reading Intervention Program',
    subject: 'English Literature',
    grade: 'Grade 9',
    reportType: 'Special Student Report',
    priority: 'Normal',
    content: 'Initiated targeted 1-on-1 reading comprehension sessions for 4 students including Ethan Patel. Early metrics show a 15% increase in reading speed and vocabulary retention.',
    date: '2026-03-30',
    status: 'Action Taken',
    headteacherResponse: 'Approved budget for additional reading materials. Keep up the good work.'
  }
];

export const INITIAL_EVENTS: SchoolEvent[] = [
  {
    id: 'evt-1',
    title: 'All-Staff Term 2 Strategic Planning Assembly',
    category: 'Staff Meeting',
    date: '2026-04-05',
    startTime: '08:30',
    endTime: '10:30',
    location: 'Main Auditorium / Hall A',
    targetAudience: 'All Staff',
    description: 'Reviewing academic progress, budget allocations for Term 3, and upcoming accreditation inspection.',
    organizer: 'Dr. Arthur Kingsley (Headteacher)',
    status: 'Scheduled'
  },
  {
    id: 'evt-2',
    title: 'Grade 10 & 11 Parent-Teacher Conference',
    category: 'Parent-Teacher Conference',
    date: '2026-04-12',
    startTime: '13:00',
    endTime: '17:00',
    location: 'School Gymnasium & Classrooms',
    targetAudience: 'Grade 9-12 Parents',
    description: 'Individual 10-minute consultations regarding Term 2 report cards, college prep pathways, and extracurriculars.',
    organizer: 'Ms. Clara Vance (Secretary)',
    status: 'Scheduled'
  },
  {
    id: 'evt-3',
    title: 'Annual STEM & Science Innovation Fair',
    category: 'School Event',
    date: '2026-04-20',
    startTime: '09:00',
    endTime: '15:00',
    location: 'Science Complex & Quadrangle',
    targetAudience: 'All Parents & Students',
    description: 'Student project displays, robotics competition, and guest lectures from university researchers.',
    organizer: 'Dr. Rebecca Hastings',
    status: 'Scheduled'
  },
  {
    id: 'evt-4',
    title: 'Tuition Fee Payment Grace Period Deadline',
    category: 'Academic Calendar',
    date: '2026-04-15',
    startTime: '17:00',
    endTime: '17:00',
    location: 'Accounts Office',
    targetAudience: 'Accounts & Admin',
    description: 'Final day for Term 2 tuition fee installments before late surcharge applied.',
    organizer: 'Mr. Marcus Thorne (Accounts Clerk)',
    status: 'Scheduled'
  }
];

export const INITIAL_INVOICES: StudentInvoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-2026-001',
    studentId: 'std-1',
    studentName: 'Liam Walker',
    grade: 'Grade 10',
    term: 'Term 2',
    totalAmount: 2800,
    paidAmount: 2800,
    balance: 0,
    status: 'Paid',
    dueDate: '2026-03-15',
    issueDate: '2026-01-10',
    lineItems: [
      { id: 'li-1', description: 'Tuition Fee - Grade 10 (Term 2)', amount: 2200 },
      { id: 'li-2', description: 'Science Lab & Technology Fee', amount: 350 },
      { id: 'li-3', description: 'Extracurricular & Athletics Pass', amount: 250 }
    ]
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV-2026-002',
    studentId: 'std-2',
    studentName: 'Sophia Chen',
    grade: 'Grade 10',
    term: 'Term 2',
    totalAmount: 2800,
    paidAmount: 2800,
    balance: 0,
    status: 'Paid',
    dueDate: '2026-03-15',
    issueDate: '2026-01-10',
    lineItems: [
      { id: 'li-4', description: 'Tuition Fee - Grade 10 (Term 2)', amount: 2200 },
      { id: 'li-5', description: 'Science Lab & Technology Fee', amount: 350 },
      { id: 'li-6', description: 'Extracurricular & Athletics Pass', amount: 250 }
    ]
  },
  {
    id: 'inv-3',
    invoiceNumber: 'INV-2026-003',
    studentId: 'std-3',
    studentName: 'Ethan Patel',
    grade: 'Grade 9',
    term: 'Term 2',
    totalAmount: 2650,
    paidAmount: 1000,
    balance: 1650,
    status: 'Partial',
    dueDate: '2026-03-15',
    issueDate: '2026-01-15',
    lineItems: [
      { id: 'li-7', description: 'Tuition Fee - Grade 9 (Term 2)', amount: 2100 },
      { id: 'li-8', description: 'Enrollment Registration Fee', amount: 300 },
      { id: 'li-9', description: 'Library & Online Resource Access', amount: 250 }
    ]
  },
  {
    id: 'inv-4',
    invoiceNumber: 'INV-2026-004',
    studentId: 'std-4',
    studentName: 'Aria Kowalski',
    grade: 'Grade 11',
    term: 'Term 2',
    totalAmount: 3100,
    paidAmount: 0,
    balance: 3100,
    status: 'Overdue',
    dueDate: '2026-02-28',
    issueDate: '2026-01-10',
    lineItems: [
      { id: 'li-10', description: 'Tuition Fee - Grade 11 AP Track', amount: 2500 },
      { id: 'li-11', description: 'Advanced Chemistry Lab Fee', amount: 400 },
      { id: 'li-12', description: 'Annual Field Trip Levy', amount: 200 }
    ]
  },
  {
    id: 'inv-5',
    invoiceNumber: 'INV-2026-005',
    studentId: 'std-5',
    studentName: 'Marcus Johnson Jr.',
    grade: 'Grade 9',
    term: 'Term 2',
    totalAmount: 2650,
    paidAmount: 2650,
    balance: 0,
    status: 'Paid',
    dueDate: '2026-03-15',
    issueDate: '2026-01-15',
    lineItems: [
      { id: 'li-13', description: 'Tuition Fee - Grade 9 (Term 2)', amount: 2100 },
      { id: 'li-14', description: 'Enrollment Registration Fee', amount: 300 },
      { id: 'li-15', description: 'Library & Online Resource Access', amount: 250 }
    ]
  },
  {
    id: 'inv-6',
    invoiceNumber: 'INV-2026-006',
    studentId: 'std-6',
    studentName: 'Isabella Gomez',
    grade: 'Grade 12',
    term: 'Term 2',
    totalAmount: 3400,
    paidAmount: 1700,
    balance: 1700,
    status: 'Partial',
    dueDate: '2026-03-15',
    issueDate: '2026-01-10',
    lineItems: [
      { id: 'li-16', description: 'Tuition Fee - Grade 12 Senior Year', amount: 2700 },
      { id: 'li-17', description: 'Graduation & Diploma Fee', amount: 450 },
      { id: 'li-18', description: 'Yearbook & College Placement Pass', amount: 250 }
    ]
  }
];

export const INITIAL_RECEIPTS: PaymentReceipt[] = [
  {
    id: 'rcp-1',
    receiptNumber: 'RCP-2026-8801',
    invoiceId: 'inv-1',
    studentId: 'std-1',
    studentName: 'Liam Walker',
    amountPaid: 2800,
    paymentMethod: 'Bank Transfer',
    transactionRef: 'WIRE-992014-CHASE',
    date: '2026-02-14',
    term: 'Term 2',
    recordedByClerk: 'Mr. Marcus Thorne',
    notes: 'Full payment received. Verified via Chase Bank statement.'
  },
  {
    id: 'rcp-2',
    receiptNumber: 'RCP-2026-8802',
    invoiceId: 'inv-2',
    studentId: 'std-2',
    studentName: 'Sophia Chen',
    amountPaid: 2800,
    paymentMethod: 'Credit Card',
    transactionRef: 'STRIPE-TXN-40192',
    date: '2026-02-10',
    term: 'Term 2',
    recordedByClerk: 'Mr. Marcus Thorne'
  },
  {
    id: 'rcp-3',
    receiptNumber: 'RCP-2026-8803',
    invoiceId: 'inv-3',
    studentId: 'std-3',
    studentName: 'Ethan Patel',
    amountPaid: 1000,
    paymentMethod: 'Cash',
    transactionRef: 'CASH-REC-0012',
    date: '2026-02-20',
    term: 'Term 2',
    recordedByClerk: 'Mr. Marcus Thorne',
    notes: 'Deposit paid by parent Sanjay Patel in person. Balance due April 15.'
  },
  {
    id: 'rcp-4',
    receiptNumber: 'RCP-2026-8804',
    invoiceId: 'inv-6',
    studentId: 'std-6',
    studentName: 'Isabella Gomez',
    amountPaid: 1700,
    paymentMethod: 'Bank Transfer',
    transactionRef: 'BOA-REF-77310',
    date: '2026-03-01',
    term: 'Term 2',
    recordedByClerk: 'Mr. Marcus Thorne'
  }
];

// Helper to load or seed storage
const STORAGE_KEY = 'oakridge_lms_db_v1';

export interface LMSDataStore {
  staff: StaffMember[];
  students: Student[];
  documents: EnrollmentDocument[];
  grades: GradeRecord[];
  reports: TeacherReport[];
  events: SchoolEvent[];
  invoices: StudentInvoice[];
  receipts: PaymentReceipt[];
}

export function loadLMSStore(): LMSDataStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to parse LMS store from localStorage', e);
  }

  // Fallback / Initial Seed
  const initialStore: LMSDataStore = {
    staff: INITIAL_STAFF,
    students: INITIAL_STUDENTS,
    documents: INITIAL_DOCUMENTS,
    grades: INITIAL_GRADES,
    reports: INITIAL_REPORTS,
    events: INITIAL_EVENTS,
    invoices: INITIAL_INVOICES,
    receipts: INITIAL_RECEIPTS
  };
  saveLMSStore(initialStore);
  return initialStore;
}

export function saveLMSStore(store: LMSDataStore): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (e) {
    console.error('Failed to save LMS store to localStorage', e);
  }
}

export function resetLMSStoreToDefault(): LMSDataStore {
  const initialStore: LMSDataStore = {
    staff: INITIAL_STAFF,
    students: INITIAL_STUDENTS,
    documents: INITIAL_DOCUMENTS,
    grades: INITIAL_GRADES,
    reports: INITIAL_REPORTS,
    events: INITIAL_EVENTS,
    invoices: INITIAL_INVOICES,
    receipts: INITIAL_RECEIPTS
  };
  saveLMSStore(initialStore);
  return initialStore;
}
