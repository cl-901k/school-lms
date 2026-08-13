export type UserRole = 'headteacher' | 'teacher' | 'secretary' | 'accounts_clerk';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  title: string;
  email: string;
  avatar: string;
  department?: string;
}

export interface StaffMember {
  id: string;
  staffId: string;
  name: string;
  role: 'Headteacher' | 'Teacher' | 'Secretary' | 'Accounts Clerk' | 'Vice Principal' | 'Department Head' | 'Librarian';
  email: string;
  password?: string;
  phone: string;
  department: string;
  joinDate: string;
  status: 'Active' | 'On Leave' | 'Terminated';
  salary: number;
  qualification: string;
  assignedClasses?: string[];
}

export interface Student {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  grade: string; // e.g. "Grade 9", "Grade 10"
  section: string; // "A", "B"
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  guardianName: string;
  guardianContact: string;
  guardianEmail: string;
  address: string;
  status: 'Enrolled' | 'Pending Documents' | 'Graduated' | 'Suspended' | 'Withdrawn';
  admissionDate: string;
  photoUrl?: string;
}

export type DocumentType = 
  | 'Birth Certificate' 
  | 'Immunization Record' 
  | 'National ID / Passport' 
  | 'Previous School Transcript' 
  | 'Guardian Proof of Address';

export interface EnrollmentDocument {
  id: string;
  studentId: string;
  documentType: DocumentType;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  status: 'Verified' | 'Pending Verification' | 'Missing' | 'Action Required';
  verifiedBy?: string;
  notes?: string;
}

export interface GradeRecord {
  id: string;
  studentId: string;
  studentName: string;
  subject: string;
  assessmentType: 'Homework' | 'Quiz' | 'Midterm Exam' | 'Final Exam' | 'Class Project';
  score: number;
  maxScore: number;
  gradeLetter: string;
  term: string; // e.g., "Term 1", "Term 2"
  year: string; // "2026"
  date: string;
  teacherId: string;
  remarks: string;
}

export interface TeacherReport {
  id: string;
  teacherId: string;
  teacherName: string;
  title: string;
  subject: string;
  grade: string;
  reportType: 'Academic Progress' | 'Class Conduct' | 'Resource Request' | 'Special Student Report';
  priority: 'Normal' | 'High' | 'Urgent';
  content: string;
  date: string;
  status: 'Pending Review' | 'Reviewed' | 'Action Taken';
  headteacherResponse?: string;
}

export interface SchoolEvent {
  id: string;
  title: string;
  category: 'School Event' | 'Staff Meeting' | 'Parent-Teacher Conference' | 'Academic Calendar' | 'Exam Period' | 'Sports & Clubs';
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
  location: string;
  targetAudience: 'All Staff' | 'Teachers Only' | 'All Parents & Students' | 'Grade 9-12 Parents' | 'Accounts & Admin';
  description: string;
  organizer: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Postponed';
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  amount: number;
}

export interface StudentInvoice {
  id: string;
  invoiceNumber: string;
  studentId: string;
  studentName: string;
  grade: string;
  term: string;
  totalAmount: number;
  paidAmount: number;
  balance: number;
  status: 'Paid' | 'Partial' | 'Overdue' | 'Unpaid';
  dueDate: string;
  issueDate: string;
  lineItems: InvoiceLineItem[];
}

export interface PaymentReceipt {
  id: string;
  receiptNumber: string;
  invoiceId: string;
  studentId: string;
  studentName: string;
  amountPaid: number;
  paymentMethod: 'Cash' | 'Bank Transfer' | 'Credit Card' | 'Mobile Money' | 'Cheque';
  transactionRef: string;
  date: string;
  term: string;
  recordedByClerk: string;
  notes?: string;
}
