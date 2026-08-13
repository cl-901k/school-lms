import React, { useState } from 'react';
import { 
  StaffMember, 
  Student, 
  TeacherReport, 
  StudentInvoice, 
  GradeRecord, 
  SchoolEvent, 
  PaymentReceipt 
} from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { 
  Users, 
  UserPlus, 
  TrendingUp, 
  DollarSign, 
  Award, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Download, 
  Filter, 
  Search, 
  Briefcase, 
  GraduationCap, 
  MessageSquare,
  X,
  Mail,
  Phone,
  Building,
  ShieldCheck,
  Check,
  Clock,
  Trash2,
  Printer,
  BookOpen,
  ChevronRight,
  Key,
  KeyRound,
  Eye,
  EyeOff,
  UserCog,
  Pencil,
  Save
} from 'lucide-react';

interface HeadteacherViewProps {
  staffList: StaffMember[];
  onAddStaff: (newStaff: Omit<StaffMember, 'id' | 'staffId'>) => void;
  onRemoveStaff?: (staffId: string) => void;
  onUpdateStaffStatus: (staffId: string, status: StaffMember['status']) => void;
  onUpdateStaff?: (updatedStaff: StaffMember) => void;
  students: Student[];
  reports: TeacherReport[];
  onRespondToReport: (reportId: string, response: string, newStatus: TeacherReport['status']) => void;
  invoices: StudentInvoice[];
  receipts: PaymentReceipt[];
  grades: GradeRecord[];
  events: SchoolEvent[];
  searchTerm: string;
}

export const HeadteacherView: React.FC<HeadteacherViewProps> = ({
  staffList,
  onAddStaff,
  onRemoveStaff,
  onUpdateStaffStatus,
  onUpdateStaff,
  students,
  reports,
  onRespondToReport,
  invoices,
  receipts,
  grades,
  events,
  searchTerm
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'finance' | 'education' | 'events' | 'staff' | 'ai_summary'>('overview');
  
  // Modal state for adding staff
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [staffForm, setStaffForm] = useState({
    name: '',
    role: 'Teacher' as StaffMember['role'],
    email: '',
    password: 'password123',
    phone: '',
    department: 'Mathematics & STEM',
    qualification: '',
    salary: 55000,
    status: 'Active' as StaffMember['status'],
    joinDate: new Date().toISOString().split('T')[0]
  });

  // Academic Reports Class selection & Student Report Card state
  const [selectedAcademicClass, setSelectedAcademicClass] = useState<string>('Grade 10');
  const [selectedReportCardStudent, setSelectedReportCardStudent] = useState<Student | null>(null);

  // Modal state for responding to teacher report
  const [selectedReport, setSelectedReport] = useState<TeacherReport | null>(null);
  const [headteacherResponseText, setHeadteacherResponseText] = useState('');

  // Delete confirmation state
  const [staffToDelete, setStaffToDelete] = useState<StaffMember | null>(null);

  // Edit Staff Modal State & Handlers
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [showPasswordInEdit, setShowPasswordInEdit] = useState<boolean>(false);
  const [editForm, setEditForm] = useState<{
    name: string;
    role: StaffMember['role'];
    email: string;
    password: string;
    phone: string;
    department: string;
    qualification: string;
    salary: number;
    status: StaffMember['status'];
    assignedClasses: string;
  }>({
    name: '',
    role: 'Teacher',
    email: '',
    password: '',
    phone: '',
    department: 'Mathematics & STEM',
    qualification: '',
    salary: 55000,
    status: 'Active',
    assignedClasses: ''
  });
  const [staffUpdateNotification, setStaffUpdateNotification] = useState<string | null>(null);

  const openEditStaffModal = (staff: StaffMember) => {
    setEditingStaff(staff);
    setShowPasswordInEdit(false);
    setEditForm({
      name: staff.name,
      role: staff.role,
      email: staff.email,
      password: staff.password || 'password123',
      phone: staff.phone || '',
      department: staff.department || 'Administration',
      qualification: staff.qualification || '',
      salary: staff.salary || 55000,
      status: staff.status,
      assignedClasses: staff.assignedClasses ? staff.assignedClasses.join(', ') : ''
    });
  };

  const handleSaveStaffEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;
    if (!editForm.name.trim() || !editForm.email.trim() || !editForm.password.trim()) {
      alert('Please fill in Name, Email, and Password.');
      return;
    }

    const updated: StaffMember = {
      ...editingStaff,
      name: editForm.name.trim(),
      role: editForm.role,
      email: editForm.email.trim(),
      password: editForm.password.trim(),
      phone: editForm.phone.trim(),
      department: editForm.department,
      qualification: editForm.qualification.trim(),
      salary: Number(editForm.salary) || 50000,
      status: editForm.status,
      assignedClasses: editForm.assignedClasses
        ? editForm.assignedClasses.split(',').map(c => c.trim()).filter(Boolean)
        : []
    };

    if (onUpdateStaff) {
      onUpdateStaff(updated);
    }

    setStaffUpdateNotification(`Account details & login password for "${updated.name}" updated successfully!`);
    setTimeout(() => setStaffUpdateNotification(null), 5000);

    setEditingStaff(null);
  };

  // AI Briefing State
  const [aiBriefing, setAiBriefing] = useState<string>('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Department options
  const departments = [
    'Administration',
    'Mathematics & STEM',
    'Natural Sciences',
    'Humanities & Literature',
    'Languages & Social Studies',
    'Front Office & Admissions',
    'Finance & Accounts',
    'Arts & Athletics'
  ];

  // Financial Calculations
  const totalBilled = invoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
  const totalCollected = invoices.reduce((acc, inv) => acc + inv.paidAmount, 0);
  const totalOutstanding = invoices.reduce((acc, inv) => acc + inv.balance, 0);
  const collectionPercentage = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0;

  // Grade Calculations
  const averageGradeScore = grades.length > 0 
    ? Math.round(grades.reduce((acc, g) => acc + g.score, 0) / grades.length) 
    : 0;

  // Search Filter for Staff
  const filteredStaff = staffList.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Financial Breakdown Data for Recharts
  const gradeRevenueData = [
    { grade: 'Grade 9', collected: 3650, outstanding: 1650 },
    { grade: 'Grade 10', collected: 5600, outstanding: 0 },
    { grade: 'Grade 11', collected: 0, outstanding: 3100 },
    { grade: 'Grade 12', collected: 1700, outstanding: 1700 },
  ];

  const paymentStatusData = [
    { name: 'Fully Paid', value: invoices.filter(i => i.status === 'Paid').length, color: '#10b981' },
    { name: 'Partial', value: invoices.filter(i => i.status === 'Partial').length, color: '#f59e0b' },
    { name: 'Overdue', value: invoices.filter(i => i.status === 'Overdue').length, color: '#ef4444' },
  ];

  // Handle submit new staff
  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffForm.name || !staffForm.email) return;

    onAddStaff({
      name: staffForm.name,
      role: staffForm.role,
      email: staffForm.email,
      password: staffForm.password || 'password123',
      phone: staffForm.phone || '+1 (555) 000-0000',
      department: staffForm.department,
      joinDate: staffForm.joinDate,
      status: staffForm.status,
      salary: Number(staffForm.salary) || 50000,
      qualification: staffForm.qualification || 'Bachelor Degree'
    });

    setIsAddStaffOpen(false);
    setStaffForm({
      name: '',
      role: 'Teacher',
      email: '',
      password: 'password123',
      phone: '',
      department: 'Mathematics & STEM',
      qualification: '',
      salary: 55000,
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0]
    });
  };

  // Generate Executive Summary with Gemini API
  const handleGenerateAiBriefing = async () => {
    setIsGeneratingAi(true);
    try {
      const summaryContext = {
        totalStudents: students.length,
        totalStaff: staffList.length,
        financials: { totalBilled, totalCollected, totalOutstanding, collectionPercentage },
        academic: { averageScore: averageGradeScore, totalGradesLogged: grades.length },
        pendingTeacherReports: reports.filter(r => r.status === 'Pending Review').length,
        upcomingEvents: events.length
      };

      const res = await fetch('/api/ai-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'Generate an executive 1-page Headteacher School Performance & Action Plan Report summarizing financial standing, academic highlights, pending teacher requests, and key upcoming events for the Board of Governors.',
          context: summaryContext
        })
      });

      const data = await res.json();
      if (data.text) {
        setAiBriefing(data.text);
      } else {
        setAiBriefing('Failed to generate summary: ' + (data.error || 'Unknown server response.'));
      }
    } catch (err: any) {
      setAiBriefing('Error generating AI report: ' + err?.message);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Headteacher Top Control Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 text-slate-900 dark:text-slate-100 shadow-xs relative overflow-hidden transition-colors">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs px-2.5 py-1 rounded-md font-bold border border-indigo-100 dark:border-indigo-800">
                Executive Portal
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Dr. Arthur Kingsley (Headteacher)</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">Headteacher Command & Reports Hub</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Oversee school financial standing, academic performance, staff allocation, and operational reports.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                const headteacherStaff = staffList.find(s => s.role === 'Headteacher') || staffList[0];
                openEditStaffModal(headteacherStaff);
              }}
              className="flex items-center gap-2 px-3.5 py-2 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded-md text-xs font-bold transition active:scale-95 cursor-pointer"
            >
              <KeyRound className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Edit My Password & Profile</span>
            </button>

            <button
              onClick={() => setIsAddStaffOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-bold shadow-xs transition active:scale-95 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Staff Member</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('ai_summary');
                if (!aiBriefing) handleGenerateAiBriefing();
              }}
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-indigo-700 dark:text-indigo-300 border border-slate-200 dark:border-slate-700 rounded-md text-xs font-bold transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>AI Executive Summary</span>
            </button>
          </div>
        </div>

        {/* Success Notification Banner */}
        {staffUpdateNotification && (
          <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-200 animate-fade-in">
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{staffUpdateNotification}</span>
            </div>
            <button 
              onClick={() => setStaffUpdateNotification(null)}
              className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-100 font-bold cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Sub-navigation Tabs */}
        <div className="flex flex-wrap gap-1.5 mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-1.5 rounded-lg">
          {[
            { id: 'overview', label: 'Executive Overview', icon: TrendingUp },
            { id: 'finance', label: 'Financial Reports', icon: DollarSign, badge: `$${totalCollected.toLocaleString()}` },
            { id: 'education', label: 'Education & Academic Reports', icon: Award, badge: `${averageGradeScore}% Avg` },
            { id: 'events', label: 'Events & Ops Reports', icon: Calendar, badge: `${events.length} Events` },
            { id: 'staff', label: 'Staff Directory', icon: Users, badge: `${staffList.length} Active` },
            { id: 'ai_summary', label: 'AI Executive Briefing', icon: Sparkles }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
                  isActive
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 shadow-xs border border-slate-200 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    isActive ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-100 dark:border-indigo-800' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: EXECUTIVE OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Revenue Collected</span>
                <div className="p-1.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-md border border-emerald-100 dark:border-emerald-800">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">${totalCollected.toLocaleString()}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{collectionPercentage}%</span> of total billed (${totalBilled.toLocaleString()})
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 mt-3 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${collectionPercentage}%` }} />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Teaching & Staff</span>
                <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-md border border-indigo-100 dark:border-indigo-800">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{staffList.length} Staff</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Across 6 Academic & Admin departments</div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 mt-3 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: '85%' }} />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Academic Pass Rate</span>
                <div className="p-1.5 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-md border border-amber-100 dark:border-amber-800">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{averageGradeScore}% Avg</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Based on {grades.length} term assessment logs</div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 mt-3 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${averageGradeScore}%` }} />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Teacher Reports</span>
                <div className="p-1.5 bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 rounded-md border border-purple-100 dark:border-purple-800">
                  <MessageSquare className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{reports.length} Reports</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                <span className="text-amber-600 dark:text-amber-400 font-bold">{reports.filter(r => r.status === 'Pending Review').length} Pending</span> review
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 mt-3 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: '60%' }} />
              </div>
            </div>
          </div>

          {/* Teacher Submissions Awaiting Headteacher Review */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Teacher Submitted Reports & Resource Requests
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Formal reports submitted by teachers to Headteacher</p>
              </div>

              <span className="text-xs bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 px-2.5 py-1 rounded-md border border-amber-200 dark:border-amber-800 font-bold">
                {reports.filter(r => r.status === 'Pending Review').length} Pending Action
              </span>
            </div>

            <div className="space-y-3">
              {reports.map((rep) => (
                <div key={rep.id} className="p-4 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{rep.title}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        rep.priority === 'Urgent' ? 'bg-red-50 text-red-700 border border-red-200' :
                        rep.priority === 'High' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      }`}>
                        {rep.priority} Priority
                      </span>
                      <span className="text-xs text-slate-500">By {rep.teacherName} ({rep.subject}, {rep.grade})</span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2">{rep.content}</p>
                    {rep.headteacherResponse && (
                      <div className="mt-2 text-xs text-indigo-900 bg-indigo-50 p-2 rounded-md border border-indigo-100">
                        <span className="font-bold text-indigo-700">Your Response:</span> {rep.headteacherResponse}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setSelectedReport(rep);
                        setHeadteacherResponseText(rep.headteacherResponse || '');
                      }}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-md transition shadow-xs"
                    >
                      {rep.status === 'Pending Review' ? 'Review & Respond' : 'Edit Response'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FINANCIAL REPORTS */}
      {activeTab === 'finance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Bar Chart */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-1">Tuition Fee Collection by Grade Level</h3>
              <p className="text-xs text-slate-500 mb-6">Comparison of collected fees versus outstanding balances</p>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={gradeRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="grade" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', color: '#0f172a', borderRadius: '8px' }} />
                    <Bar dataKey="collected" name="Collected ($)" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="outstanding" name="Outstanding ($)" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Payment Status Breakdown */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">Student Account Status</h3>
                <p className="text-xs text-slate-500 mb-4">Proportion of student tuition standing</p>

                <div className="h-52 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {paymentStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', color: '#0f172a', borderRadius: '8px' }} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Total Tuition Billed:</span>
                  <span className="font-bold text-slate-900">${totalBilled.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Total Collected:</span>
                  <span className="font-bold text-emerald-600">${totalCollected.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Outstanding Debt:</span>
                  <span className="font-bold text-red-600">${totalOutstanding.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Ledger Audit */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-4">Official Payment Receipts Audit</h3>
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 uppercase font-mono font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Receipt #</th>
                    <th className="p-2.5">Student Name</th>
                    <th className="p-2.5">Amount Paid</th>
                    <th className="p-2.5">Method</th>
                    <th className="p-2.5">Date</th>
                    <th className="p-2.5">Recorded By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {receipts.map((rcp) => (
                    <tr key={rcp.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-2.5 font-mono text-indigo-600 font-bold">{rcp.receiptNumber}</td>
                      <td className="p-2.5 font-semibold text-slate-900">{rcp.studentName}</td>
                      <td className="p-2.5 text-emerald-600 font-bold">${rcp.amountPaid.toLocaleString()}</td>
                      <td className="p-2.5">{rcp.paymentMethod}</td>
                      <td className="p-2.5">{rcp.date}</td>
                      <td className="p-2.5 text-slate-500">{rcp.recordedByClerk}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EDUCATION & CLASS ACADEMIC REPORTS */}
      {activeTab === 'education' && (() => {
        // Build list of classes dynamically from student roster & default list
        const defaultClassesList = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
        const studentGradesInRoster = Array.from(new Set(students.map(s => s.grade)));
        const allClassesList = Array.from(new Set([...studentGradesInRoster, ...defaultClassesList]));

        // Filter students belonging to the currently selected class
        const selectedClassStudents = selectedAcademicClass === 'All' 
          ? students 
          : students.filter(s => s.grade === selectedAcademicClass);

        // Gather all grade records for students in this class
        const classGrades = grades.filter(g => {
          if (selectedAcademicClass === 'All') return true;
          const matchingStudent = students.find(s => s.id === g.studentId || `${s.firstName} ${s.lastName}`.toLowerCase() === g.studentName.toLowerCase());
          return matchingStudent ? matchingStudent.grade === selectedAcademicClass : false;
        });

        // Calculate Class Average
        const classAvgScore = classGrades.length > 0
          ? Math.round(classGrades.reduce((acc, g) => acc + (g.score / g.maxScore) * 100, 0) / classGrades.length)
          : null;

        // Top performer in selected class
        const initialTop: { student: Student | null; avg: number } = { student: null, avg: -1 };
        const topPerformer = selectedClassStudents.reduce((best, current) => {
          const sGrades = grades.filter(g => g.studentId === current.id || g.studentName.toLowerCase() === `${current.firstName} ${current.lastName}`.toLowerCase());
          if (sGrades.length === 0) return best;
          const avg = sGrades.reduce((a, g) => a + (g.score / g.maxScore) * 100, 0) / sGrades.length;
          return avg > best.avg ? { student: current, avg } : best;
        }, initialTop);

        return (
          <div className="space-y-6">
            {/* Header & Class Selector Bar */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs px-2.5 py-0.5 rounded-md font-bold border border-indigo-100 dark:border-indigo-800">
                      Class Academic Directory
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Live Student Transcripts & Assessment Records
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                    Class-by-Class Student Academic Reports
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Select any class level below to view all enrolled students, subject assessment logs, GPAs, and report cards.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedAcademicClass}
                    onChange={(e) => setSelectedAcademicClass(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-xs rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="All">All Classes Combined ({students.length} Students)</option>
                    {allClassesList.map(cls => {
                      const count = students.filter(s => s.grade === cls).length;
                      return (
                        <option key={cls} value={cls}>
                          {cls} ({count} student{count === 1 ? '' : 's'})
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* Class Pills Switcher */}
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedAcademicClass('All')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    selectedAcademicClass === 'All'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>All Classes</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    selectedAcademicClass === 'All' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}>
                    {students.length}
                  </span>
                </button>

                {allClassesList.map(cls => {
                  const studentCount = students.filter(s => s.grade === cls).length;
                  const isActive = selectedAcademicClass === cls;
                  return (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => setSelectedAcademicClass(cls)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span>{cls}</span>
                      {studentCount > 0 && (
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                          isActive ? 'bg-white/20 text-white' : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                        }`}>
                          {studentCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Class Performance Overview Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Class Roster</span>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {selectedClassStudents.length} Student{selectedClassStudents.length === 1 ? '' : 's'}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Enrolled in {selectedAcademicClass}
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Class Average GPA</span>
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                  {classAvgScore !== null ? `${classAvgScore}%` : 'N/A'}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Across {classGrades.length} assessment entries
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Assessment Records</span>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  {classGrades.length} Logs
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Recorded by subject teachers
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Top Performer</span>
                <div className="text-base font-bold text-slate-900 dark:text-white mt-1 truncate">
                  {topPerformer.student ? `${topPerformer.student.firstName} ${topPerformer.student.lastName}` : 'No grades yet'}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {topPerformer.student ? `Avg Score: ${Math.round(topPerformer.avg)}%` : 'Awaiting teacher entries'}
                </p>
              </div>
            </div>

            {/* Students List for the Selected Class */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Student Academic Reports for {selectedAcademicClass} ({selectedClassStudents.length})</span>
                </h4>
              </div>

              {selectedClassStudents.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center space-y-3">
                  <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto">
                    <Users className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">No Students Enrolled in {selectedAcademicClass}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                    There are currently no students assigned to {selectedAcademicClass}. Teaching staff can add new students or update existing class rosters in the Teacher Portal.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedClassStudents.map((student) => {
                    // Get all grades for this specific student
                    const sGrades = grades.filter(g => 
                      g.studentId === student.id || 
                      g.studentName.toLowerCase() === `${student.firstName} ${student.lastName}`.toLowerCase()
                    );

                    const sAvgScore = sGrades.length > 0
                      ? Math.round(sGrades.reduce((acc, g) => acc + (g.score / g.maxScore) * 100, 0) / sGrades.length)
                      : null;

                    let standingBadge = { label: 'No Grades Logged', bg: 'bg-slate-100 text-slate-600 border-slate-200' };
                    if (sAvgScore !== null) {
                      if (sAvgScore >= 85) standingBadge = { label: 'Distinction (A)', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
                      else if (sAvgScore >= 70) standingBadge = { label: 'Good Standing (B/C)', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
                      else if (sAvgScore >= 50) standingBadge = { label: 'Satisfactory (D)', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
                      else standingBadge = { label: 'Academic Support Needed (F)', bg: 'bg-red-50 text-red-700 border-red-200' };
                    }

                    return (
                      <div key={student.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
                        {/* Student Header */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={student.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.firstName + ' ' + student.lastName)}&background=6366f1&color=fff`}
                              alt={`${student.firstName} ${student.lastName}`}
                              className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500/20"
                            />
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h5 className="text-base font-bold text-slate-900 dark:text-white">
                                  {student.firstName} {student.lastName}
                                </h5>
                                <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono px-2 py-0.5 rounded font-semibold border border-slate-200 dark:border-slate-700">
                                  {student.studentId}
                                </span>
                                <span className="text-xs bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded font-bold border border-indigo-200 dark:border-indigo-800">
                                  {student.grade} - Section {student.section}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Guardian: <strong className="text-slate-700 dark:text-slate-300">{student.guardianName}</strong> ({student.guardianContact})
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0 flex-wrap">
                            <div className="text-right">
                              <div className="text-xs text-slate-500 dark:text-slate-400">Cumulative Average</div>
                              <div className="text-lg font-bold text-slate-900 dark:text-white">
                                {sAvgScore !== null ? `${sAvgScore}%` : 'N/A'}
                              </div>
                            </div>

                            <span className={`text-xs px-2.5 py-1 rounded-md font-bold border ${standingBadge.bg}`}>
                              {standingBadge.label}
                            </span>

                            <button
                              type="button"
                              onClick={() => setSelectedReportCardStudent(student)}
                              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition shadow-xs cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>View Report Card</span>
                            </button>
                          </div>
                        </div>

                        {/* Subject Grades Table for this student */}
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center justify-between">
                            <span>Subject Assessment Breakdown ({sGrades.length} Subjects Recorded)</span>
                            {sGrades.length > 0 && <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono">Verified by Subject Teachers</span>}
                          </div>

                          {sGrades.length === 0 ? (
                            <div className="bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-xs text-slate-500 dark:text-slate-400 italic">
                              No subject assessment logs recorded yet for {student.firstName}. Subject teachers can add grades via the Teacher Portal.
                            </div>
                          ) : (
                            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">
                              <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                                <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 uppercase font-mono font-bold border-b border-slate-200 dark:border-slate-800">
                                  <tr>
                                    <th className="p-2.5">Subject</th>
                                    <th className="p-2.5">Assessment Type</th>
                                    <th className="p-2.5">Score</th>
                                    <th className="p-2.5">Letter Grade</th>
                                    <th className="p-2.5">Term & Year</th>
                                    <th className="p-2.5">Teacher Remarks</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                  {sGrades.map((g) => (
                                    <tr key={g.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                      <td className="p-2.5 font-bold text-slate-900 dark:text-white">{g.subject}</td>
                                      <td className="p-2.5">{g.assessmentType}</td>
                                      <td className="p-2.5 font-mono font-bold text-indigo-600 dark:text-indigo-400">{g.score} / {g.maxScore} ({Math.round((g.score/g.maxScore)*100)}%)</td>
                                      <td className="p-2.5">
                                        <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold rounded border border-indigo-200 dark:border-indigo-800 text-[11px]">
                                          {g.gradeLetter}
                                        </span>
                                      </td>
                                      <td className="p-2.5 font-mono text-slate-500">{g.term} {g.year}</td>
                                      <td className="p-2.5 italic text-slate-600 dark:text-slate-400 max-w-xs">{g.remarks || 'Satisfactory academic progress.'}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* TAB 4: EVENTS & OPS REPORTS */}
      {activeTab === 'events' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-4">School Calendar & Events Operational Status</h3>
            <div className="space-y-3">
              {events.map((evt) => (
                <div key={evt.id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{evt.title}</span>
                      <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-semibold">
                        {evt.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{evt.description}</p>
                    <div className="text-xs text-slate-500 flex items-center gap-4">
                      <span>📅 {evt.date} ({evt.startTime} - {evt.endTime})</span>
                      <span>📍 {evt.location}</span>
                      <span>👥 Target: {evt.targetAudience}</span>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200">
                    {evt.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: STAFF MANAGEMENT */}
      {activeTab === 'staff' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">School Personnel & Staff Directory</h3>
                <p className="text-xs text-slate-500">Manage teaching staff, administrators, secretaries, and finance personnel</p>
              </div>

              <button
                onClick={() => setIsAddStaffOpen(true)}
                className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-md transition shadow-xs"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add Staff Member</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStaff.map((staff) => (
                <div key={staff.id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3 relative group">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-indigo-600 font-bold uppercase tracking-widest">{staff.staffId}</span>
                      <h4 className="text-sm font-bold text-slate-900">{staff.name}</h4>
                      <div className="text-xs text-indigo-700 font-semibold">{staff.role} • {staff.department}</div>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                      staff.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {staff.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-200 pt-3">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{staff.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{staff.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                      <span>{staff.qualification}</span>
                    </div>
                    <div className="mt-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 rounded text-[11px] font-mono flex items-center justify-between">
                      <span>Key: <strong>••••••••</strong></span>
                      <button
                        type="button"
                        onClick={() => openEditStaffModal(staff)}
                        className="text-[10px] text-indigo-600 dark:text-indigo-400 font-sans font-bold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <KeyRound className="w-3 h-3" />
                        <span>Edit Pass</span>
                      </button>
                    </div>
                    {staff.assignedClasses && staff.assignedClasses.length > 0 && (
                      <div className="mt-2 text-[11px] text-indigo-800 bg-indigo-50 p-1.5 rounded border border-indigo-100">
                        <span className="font-bold">Classes:</span> {staff.assignedClasses.join(', ')}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 dark:border-slate-800 pt-2.5 text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Salary: <strong className="text-slate-900 dark:text-white">${staff.salary.toLocaleString()}/yr</strong></span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditStaffModal(staff)}
                        className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-bold hover:underline cursor-pointer"
                        title="Edit Staff Details & Password"
                      >
                        <UserCog className="w-3.5 h-3.5" />
                        <span>Edit Details</span>
                      </button>
                      <button
                        onClick={() => onUpdateStaffStatus(staff.id, staff.status === 'Active' ? 'On Leave' : 'Active')}
                        className="text-slate-600 dark:text-slate-400 hover:underline font-bold cursor-pointer"
                      >
                        Toggle Status
                      </button>
                      {onRemoveStaff && (
                        <button
                          onClick={() => {
                            if (staff.role === 'Headteacher') {
                              alert('The Headteacher account cannot be removed.');
                              return;
                            }
                            setStaffToDelete(staff);
                          }}
                          className="flex items-center gap-1 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-bold hover:underline cursor-pointer ml-1"
                          title="Remove Staff Member"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: AI EXECUTIVE SUMMARY */}
      {activeTab === 'ai_summary' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900">Gemini Headteacher Executive Briefing</h3>
            </div>

            <button
              onClick={handleGenerateAiBriefing}
              disabled={isGeneratingAi}
              className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-md transition disabled:opacity-50 shadow-xs"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGeneratingAi ? 'Analyzing Data...' : 'Regenerate AI Report'}</span>
            </button>
          </div>

          {isGeneratingAi ? (
            <div className="p-12 text-center text-slate-500 space-y-3">
              <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-medium">Synthesizing school financials, student grades, teacher reports, and calendar milestones...</p>
            </div>
          ) : aiBriefing ? (
            <div className="p-5 bg-slate-50 rounded-lg border border-slate-200 text-slate-800 text-xs whitespace-pre-wrap leading-relaxed">
              {aiBriefing}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 space-y-3 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-xs">Click "Regenerate AI Report" to synthesize current school operations into a high-level briefing.</p>
            </div>
          )}
        </div>
      )}

      {/* MODAL: ADD STAFF MEMBER */}
      {isAddStaffOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-lg p-6 text-slate-900 shadow-2xl relative">
            <button
              onClick={() => setIsAddStaffOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-indigo-600" />
              Add New Staff Member
            </h3>
            <p className="text-xs text-slate-500 mb-4">Enroll new academic or administrative staff to the system</p>

            <form onSubmit={handleCreateStaff} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Eleanor Vance"
                  value={staffForm.name}
                  onChange={e => setStaffForm({ ...staffForm, name: e.target.value })}
                  className="w-full bg-slate-50 text-slate-900 p-2 rounded-md border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">System Role *</label>
                  <select
                    value={staffForm.role}
                    onChange={e => setStaffForm({ ...staffForm, role: e.target.value as any })}
                    className="w-full bg-slate-50 text-slate-900 p-2 rounded-md border border-slate-200"
                  >
                    <option value="Teacher">Teacher</option>
                    <option value="Secretary">Secretary</option>
                    <option value="Accounts Clerk">Accounts Clerk</option>
                    <option value="Vice Principal">Vice Principal</option>
                    <option value="Department Head">Department Head</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Department *</label>
                  <select
                    value={staffForm.department}
                    onChange={e => setStaffForm({ ...staffForm, department: e.target.value })}
                    className="w-full bg-slate-50 text-slate-900 p-2 rounded-md border border-slate-200"
                  >
                    {departments.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Email Address (Login ID) *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@oakridge.edu"
                    value={staffForm.email}
                    onChange={e => setStaffForm({ ...staffForm, email: e.target.value })}
                    className="w-full bg-slate-50 text-slate-900 p-2 rounded-md border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Account Password *</label>
                  <input
                    type="text"
                    required
                    placeholder="password123"
                    value={staffForm.password}
                    onChange={e => setStaffForm({ ...staffForm, password: e.target.value })}
                    className="w-full bg-slate-50 text-slate-900 p-2 rounded-md border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 123-4567"
                    value={staffForm.phone}
                    onChange={e => setStaffForm({ ...staffForm, phone: e.target.value })}
                    className="w-full bg-slate-50 text-slate-900 p-2 rounded-md border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Highest Qualification</label>
                  <input
                    type="text"
                    placeholder="e.g. M.Sc. Mathematics"
                    value={staffForm.qualification}
                    onChange={e => setStaffForm({ ...staffForm, qualification: e.target.value })}
                    className="w-full bg-slate-50 text-slate-900 p-2 rounded-md border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Annual Salary ($)</label>
                <input
                  type="number"
                  value={staffForm.salary}
                  onChange={e => setStaffForm({ ...staffForm, salary: Number(e.target.value) })}
                  className="w-full bg-slate-50 text-slate-900 p-2 rounded-md border border-slate-200"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddStaffOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-md shadow-xs"
                >
                  Save & Assign Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RESPOND TO TEACHER REPORT */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-lg p-6 text-slate-900 shadow-2xl relative">
            <button
              onClick={() => setSelectedReport(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1">Headteacher Response to Teacher Report</h3>
            <p className="text-xs text-slate-500 mb-4">Re: {selectedReport.title} ({selectedReport.teacherName})</p>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-700 mb-4">
              <span className="font-bold text-slate-900">Report Content:</span> {selectedReport.content}
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Official Executive Response / Feedback</label>
                <textarea
                  rows={4}
                  placeholder="Enter response or action directives for the teacher..."
                  value={headteacherResponseText}
                  onChange={e => setHeadteacherResponseText(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-md border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => {
                    onRespondToReport(selectedReport.id, headteacherResponseText, 'Reviewed');
                    setSelectedReport(null);
                  }}
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-md text-xs shadow-xs"
                >
                  Mark as Reviewed
                </button>

                <button
                  onClick={() => {
                    onRespondToReport(selectedReport.id, headteacherResponseText, 'Action Taken');
                    setSelectedReport(null);
                  }}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-md text-xs shadow-xs"
                >
                  Mark as Action Taken
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Staff Delete Confirmation Modal */}
      {staffToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <div className="p-3 bg-red-50 dark:bg-red-950/50 rounded-xl border border-red-100 dark:border-red-900">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Confirm Staff Deletion</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">This action will remove the account immediately.</p>
              </div>
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-300">
              Are you sure you want to remove <strong className="text-slate-900 dark:text-white">{staffToDelete.name}</strong> (<span className="text-indigo-600 dark:text-indigo-400 font-semibold">{staffToDelete.role}</span> - {staffToDelete.department}) from the school personnel directory?
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setStaffToDelete(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onRemoveStaff) {
                    onRemoveStaff(staffToDelete.id);
                  }
                  setStaffToDelete(null);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-xs transition cursor-pointer"
              >
                Delete Staff Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Terminal Academic Report Card Modal */}
      {selectedReportCardStudent && (() => {
        const student = selectedReportCardStudent;
        const studentGrades = grades.filter(g => 
          g.studentId === student.id || 
          g.studentName.toLowerCase() === `${student.firstName} ${student.lastName}`.toLowerCase()
        );

        const avgPct = studentGrades.length > 0 
          ? Math.round(studentGrades.reduce((acc, g) => acc + (g.score / g.maxScore) * 100, 0) / studentGrades.length) 
          : null;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden my-8 space-y-0">
              {/* Report Header */}
              <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-600 rounded-xl">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Oakridge International School</h3>
                    <p className="text-xs text-slate-400">Official Terminal Academic Performance Report</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Report</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedReportCardStudent(null)}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Report Card Content */}
              <div className="p-6 space-y-6 text-slate-900 dark:text-slate-100">
                {/* Student Info Box */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block font-semibold">Student Name</span>
                    <strong className="text-sm font-bold text-slate-900 dark:text-white">{student.firstName} {student.lastName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block font-semibold">Student ID</span>
                    <strong className="font-mono text-indigo-600 dark:text-indigo-400">{student.studentId}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block font-semibold">Class / Section</span>
                    <strong className="text-slate-900 dark:text-white">{student.grade} - {student.section}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block font-semibold">Cumulative Average</span>
                    <strong className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{avgPct !== null ? `${avgPct}%` : 'N/A'}</strong>
                  </div>
                </div>

                {/* Grade Table */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Terminal Subject Assessment Scores
                  </h4>

                  {studentGrades.length === 0 ? (
                    <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-500 italic text-center">
                      No assessment scores logged for this student yet.
                    </div>
                  ) : (
                    <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 uppercase font-mono font-bold border-b border-slate-200 dark:border-slate-800">
                          <tr>
                            <th className="p-3">Subject</th>
                            <th className="p-3">Assessment Type</th>
                            <th className="p-3">Score</th>
                            <th className="p-3">Grade</th>
                            <th className="p-3">Teacher Remarks</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {studentGrades.map(g => (
                            <tr key={g.id}>
                              <td className="p-3 font-bold">{g.subject}</td>
                              <td className="p-3">{g.assessmentType}</td>
                              <td className="p-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">{g.score} / {g.maxScore} ({Math.round((g.score/g.maxScore)*100)}%)</td>
                              <td className="p-3 font-bold text-slate-900 dark:text-white">{g.gradeLetter}</td>
                              <td className="p-3 italic text-slate-600 dark:text-slate-400">{g.remarks || 'Satisfactory progress.'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Headteacher Executive Comments & Sign-off */}
                <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider">
                      Headteacher Executive Remarks & Standing
                    </span>
                    <span className="text-[10px] font-bold bg-indigo-600 text-white px-2 py-0.5 rounded font-mono">
                      Approved
                    </span>
                  </div>
                  <p className="text-xs text-indigo-950 dark:text-indigo-200 leading-relaxed">
                    {avgPct !== null && avgPct >= 80 
                      ? `${student.firstName} has demonstrated outstanding academic performance this term. Recommended for academic honors.`
                      : `${student.firstName} shows consistent commitment to learning. Continued focus in key subjects will further elevate academic achievement.`}
                  </p>
                  <div className="pt-4 border-t border-indigo-200 dark:border-indigo-800 flex items-end justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">Dr. Arthur Kingsley</div>
                      <div className="text-[11px] text-slate-500">Headteacher & Principal, Oakridge Academy</div>
                    </div>
                    <div className="font-mono text-[10px] text-slate-400">Date: {new Date().toLocaleDateString()}</div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedReportCardStudent(null)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 transition cursor-pointer"
                >
                  Close Report
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Edit Staff Details & Password Modal */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden my-8 space-y-0">
            {/* Modal Header */}
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-600 rounded-xl text-white">
                  <UserCog className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">Edit Staff Account & Password</h3>
                    <span className="text-[10px] font-mono bg-indigo-900/80 text-indigo-200 px-2 py-0.5 rounded border border-indigo-700 font-bold">
                      {editingStaff.staffId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Update account credentials, login password, role, and personnel records</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditingStaff(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveStaffEdit} className="p-6 space-y-4 text-xs text-slate-700 dark:text-slate-200 max-h-[80vh] overflow-y-auto">
              
              {/* Account Password Section (Highlighted) */}
              <div className="p-4 bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                    <Key className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Login Password / Security Key</span>
                  </label>
                  <span className="text-[10px] font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/60 px-2 py-0.5 rounded font-mono">
                    Portal Credentials
                  </span>
                </div>

                <div className="relative">
                  <input
                    type={showPasswordInEdit ? 'text' : 'password'}
                    value={editForm.password}
                    onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                    required
                    placeholder="Enter new login password"
                    className="w-full bg-white dark:bg-slate-900 border border-indigo-300 dark:border-indigo-700 rounded-lg px-3 py-2 pr-10 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordInEdit(!showPasswordInEdit)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition cursor-pointer"
                    title={showPasswordInEdit ? 'Hide Password' : 'Show Password'}
                  >
                    {showPasswordInEdit ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-indigo-800/80 dark:text-indigo-300/80">
                  Updating this field changes the password required to log into this staff member's portal account.
                </p>
              </div>

              {/* General Staff Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">System Role</label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value as StaffMember['role'] })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="Headteacher">Headteacher</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Secretary">Secretary</option>
                    <option value="Accounts Clerk">Accounts Clerk</option>
                    <option value="Vice Principal">Vice Principal</option>
                    <option value="Department Head">Department Head</option>
                    <option value="Librarian">Librarian</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Department</label>
                  <select
                    value={editForm.department}
                    onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Qualification</label>
                  <input
                    type="text"
                    value={editForm.qualification}
                    onChange={(e) => setEditForm({ ...editForm, qualification: e.target.value })}
                    placeholder="e.g. Master in Education"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Annual Salary ($)</label>
                  <input
                    type="number"
                    value={editForm.salary}
                    onChange={(e) => setEditForm({ ...editForm, salary: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Employment Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as StaffMember['status'] })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Terminated">Terminated</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Assigned Classes (Comma separated)
                </label>
                <input
                  type="text"
                  value={editForm.assignedClasses}
                  onChange={(e) => setEditForm({ ...editForm, assignedClasses: e.target.value })}
                  placeholder="e.g. Grade 9, Grade 10"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Modal Footer Buttons */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingStaff(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-xs transition active:scale-95 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes & Password</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
