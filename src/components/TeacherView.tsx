import React, { useState } from 'react';
import { Student, GradeRecord, TeacherReport, StaffMember } from '../types';
import { 
  Users, 
  UserPlus, 
  Award, 
  FileText, 
  Send, 
  Sparkles, 
  BookOpen, 
  Printer, 
  Plus, 
  Check, 
  X, 
  Search,
  Filter,
  GraduationCap,
  ChevronRight,
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertCircle,
  Trash2
} from 'lucide-react';

interface TeacherViewProps {
  students: Student[];
  onAddStudent: (newStudent: Omit<Student, 'id' | 'studentId'>) => void;
  onRemoveStudent?: (studentId: string) => void;
  grades: GradeRecord[];
  onAddGrade: (newGrade: Omit<GradeRecord, 'id'>) => void;
  reports: TeacherReport[];
  onSubmitReport: (newReport: Omit<TeacherReport, 'id' | 'status'>) => void;
  currentTeacher: StaffMember;
  searchTerm: string;
}

export const TeacherView: React.FC<TeacherViewProps> = ({
  students,
  onAddStudent,
  onRemoveStudent,
  grades,
  onAddGrade,
  reports,
  onSubmitReport,
  currentTeacher,
  searchTerm
}) => {
  const [activeTab, setActiveTab] = useState<'students' | 'gradebook' | 'report_cards' | 'submit_report'>('students');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>('All');

  // Modal: Add Student
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [studentForm, setStudentForm] = useState({
    firstName: '',
    lastName: '',
    grade: 'Grade 10',
    section: 'A',
    dateOfBirth: '2010-05-15',
    gender: 'Male' as Student['gender'],
    guardianName: '',
    guardianContact: '',
    guardianEmail: '',
    address: '123 School Lane, City',
    status: 'Enrolled' as Student['status'],
    admissionDate: new Date().toISOString().split('T')[0]
  });

  // Modal: Log Grade
  const [isAddGradeOpen, setIsAddGradeOpen] = useState(false);
  const [gradeForm, setGradeForm] = useState({
    studentId: '',
    subject: 'Mathematics',
    assessmentType: 'Midterm Exam' as GradeRecord['assessmentType'],
    score: 85,
    maxScore: 100,
    term: 'Term 2',
    year: '2026',
    remarks: 'Demonstrated good understanding of core topics.'
  });

  // Form: Headteacher Report Submission
  const [reportForm, setReportForm] = useState({
    title: '',
    subject: 'Mathematics',
    grade: 'Grade 10',
    reportType: 'Academic Progress' as TeacherReport['reportType'],
    priority: 'Normal' as TeacherReport['priority'],
    content: ''
  });
  const [isPolishingReport, setIsPolishingReport] = useState(false);

  // Modal: View / Print Student Report Card
  const [selectedStudentReportCard, setSelectedStudentReportCard] = useState<Student | null>(null);

  // Student Delete Confirmation State
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  // Filter students
  const filteredStudents = students.filter(s => {
    const matchesSearch = `${s.firstName} ${s.lastName} ${s.studentId}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGradeFilter === 'All' || s.grade === selectedGradeFilter;
    return matchesSearch && matchesGrade;
  });

  // Handle Add Student
  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentForm.firstName || !studentForm.lastName) return;

    onAddStudent({
      firstName: studentForm.firstName,
      lastName: studentForm.lastName,
      grade: studentForm.grade,
      section: studentForm.section,
      dateOfBirth: studentForm.dateOfBirth,
      gender: studentForm.gender,
      guardianName: studentForm.guardianName || 'Parent Guardian',
      guardianContact: studentForm.guardianContact || '+1 (555) 000-0000',
      guardianEmail: studentForm.guardianEmail || 'guardian@email.com',
      address: studentForm.address,
      status: studentForm.status,
      admissionDate: studentForm.admissionDate
    });

    setIsAddStudentOpen(false);
    setStudentForm({
      firstName: '',
      lastName: '',
      grade: 'Grade 10',
      section: 'A',
      dateOfBirth: '2010-05-15',
      gender: 'Male',
      guardianName: '',
      guardianContact: '',
      guardianEmail: '',
      address: '123 School Lane, City',
      status: 'Enrolled',
      admissionDate: new Date().toISOString().split('T')[0]
    });
  };

  // Handle Add Grade
  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradeForm.studentId) return;

    const studentObj = students.find(s => s.id === gradeForm.studentId);
    if (!studentObj) return;

    // Determine letter grade
    const scorePct = Math.round((gradeForm.score / gradeForm.maxScore) * 100);
    let letter = 'F';
    if (scorePct >= 93) letter = 'A+';
    else if (scorePct >= 90) letter = 'A';
    else if (scorePct >= 85) letter = 'A-';
    else if (scorePct >= 80) letter = 'B+';
    else if (scorePct >= 75) letter = 'B';
    else if (scorePct >= 70) letter = 'C+';
    else if (scorePct >= 65) letter = 'C';
    else if (scorePct >= 60) letter = 'D';

    onAddGrade({
      studentId: studentObj.id,
      studentName: `${studentObj.firstName} ${studentObj.lastName}`,
      subject: gradeForm.subject,
      assessmentType: gradeForm.assessmentType,
      score: Number(gradeForm.score),
      maxScore: Number(gradeForm.maxScore),
      gradeLetter: letter,
      term: gradeForm.term,
      year: gradeForm.year,
      date: new Date().toISOString().split('T')[0],
      teacherId: currentTeacher.id,
      remarks: gradeForm.remarks
    });

    setIsAddGradeOpen(false);
  };

  // Handle Submit Report to Headteacher
  const handleSendReportToHeadteacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportForm.title || !reportForm.content) return;

    onSubmitReport({
      teacherId: currentTeacher.id,
      teacherName: currentTeacher.name || 'Mrs. Sarah Jenkins',
      title: reportForm.title,
      subject: reportForm.subject,
      grade: reportForm.grade,
      reportType: reportForm.reportType,
      priority: reportForm.priority,
      content: reportForm.content,
      date: new Date().toISOString().split('T')[0]
    });

    setReportForm({
      title: '',
      subject: 'Mathematics',
      grade: 'Grade 10',
      reportType: 'Academic Progress',
      priority: 'Normal',
      content: ''
    });

    alert('Report submitted successfully to the Headteacher.');
  };

  // AI Polish Report
  const handleAiPolishReport = async () => {
    if (!reportForm.content) return;
    setIsPolishingReport(true);

    try {
      const res = await fetch('/api/ai-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Refine and polish this teacher report to the Headteacher into clear, professional, academic tone: "${reportForm.content}"`,
          context: { title: reportForm.title, teacherName: currentTeacher.name }
        })
      });

      const data = await res.json();
      if (data.text) {
        setReportForm(prev => ({ ...prev, content: data.text }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsPolishingReport(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Teacher Top Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 text-slate-900 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-indigo-50 text-indigo-700 text-xs px-2.5 py-0.5 rounded-md font-semibold border border-indigo-100">
                Academic Portal
              </span>
              <span className="text-xs text-slate-500">{currentTeacher.name} ({currentTeacher.department})</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 mt-1">Teacher Classroom & Gradebook</h2>
            <p className="text-xs text-slate-500">
              Manage student rosters, log assessment grades, generate term report cards, and submit formal reports to the Headteacher.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddStudentOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-bold transition shadow-xs"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add New Student</span>
            </button>

            <button
              onClick={() => setIsAddGradeOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-indigo-700 border border-slate-200 rounded-md text-xs font-bold transition shadow-xs"
            >
              <Award className="w-4 h-4 text-indigo-600" />
              <span>Enter Grade</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-slate-200">
          {[
            { id: 'students', label: 'Student Directory', icon: Users, badge: `${students.length} Enrolled` },
            { id: 'gradebook', label: 'Gradebook Ledger', icon: Award, badge: `${grades.length} Grades` },
            { id: 'report_cards', label: 'Term Report Cards', icon: ClipboardList },
            { id: 'submit_report', label: 'Submit Report to Headteacher', icon: Send, badge: `${reports.length} Sent` }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    isActive ? 'bg-white/20 text-white' : 'bg-white text-indigo-700 border border-slate-200 font-bold'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: STUDENT DIRECTORY */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">Student Class Roster</h3>
                <p className="text-xs text-slate-500">View and manage enrolled students under your academic supervision</p>
              </div>

              {/* Grade Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={selectedGradeFilter}
                  onChange={e => setSelectedGradeFilter(e.target.value)}
                  className="bg-slate-50 text-slate-700 text-xs px-3 py-1.5 rounded-md border border-slate-200 focus:bg-white"
                >
                  <option value="All">All Grade Levels</option>
                  <option value="Grade 9">Grade 9</option>
                  <option value="Grade 10">Grade 10</option>
                  <option value="Grade 11">Grade 11</option>
                  <option value="Grade 12">Grade 12</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStudents.map((s) => {
                const studentGrades = grades.filter(g => g.studentId === s.id);
                const avgScore = studentGrades.length > 0 
                  ? Math.round(studentGrades.reduce((a, b) => a + b.score, 0) / studentGrades.length) 
                  : 'N/A';

                return (
                  <div key={s.id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3 relative">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 overflow-hidden shrink-0 flex items-center justify-center font-bold text-indigo-700 text-xs">
                        {s.photoUrl ? (
                          <img src={s.photoUrl} alt={s.firstName} className="w-full h-full object-cover" />
                        ) : (
                          `${s.firstName[0]}${s.lastName[0]}`
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-mono text-indigo-600 font-bold uppercase">{s.studentId}</span>
                        <h4 className="text-sm font-bold text-slate-900 truncate">{s.firstName} {s.lastName}</h4>
                        <div className="text-xs text-slate-500">{s.grade} (Section {s.section})</div>
                      </div>

                      <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold border border-emerald-200">
                        {s.status}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-slate-600 border-t border-slate-200 pt-3">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Guardian:</span>
                        <span className="font-semibold text-slate-900">{s.guardianName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Contact:</span>
                        <span className="text-slate-600">{s.guardianContact}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Academic Standing:</span>
                        <span className="font-bold text-emerald-600">{avgScore}% Avg</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 border-t border-slate-200 pt-2.5">
                      <button
                        onClick={() => {
                          setGradeForm(prev => ({ ...prev, studentId: s.id }));
                          setIsAddGradeOpen(true);
                        }}
                        className="flex-1 py-1.5 bg-white hover:bg-slate-100 text-indigo-700 border border-slate-200 rounded-md text-xs font-bold text-center transition cursor-pointer"
                      >
                        Log Grade
                      </button>

                      <button
                        onClick={() => setSelectedStudentReportCard(s)}
                        className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-bold text-center transition shadow-xs cursor-pointer"
                      >
                        Report Card
                      </button>

                      {onRemoveStudent && (
                        <button
                          onClick={() => setStudentToDelete(s)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 border border-slate-200 dark:border-slate-800 rounded-md transition cursor-pointer"
                          title="Delete Student"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GRADEBOOK */}
      {activeTab === 'gradebook' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Class Assessment & Grade Logs</h3>
              <p className="text-xs text-slate-500">Recorded scores across homework, midterm, and final term exams</p>
            </div>

            <button
              onClick={() => setIsAddGradeOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-md transition shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Record New Score</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase font-mono font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Student</th>
                  <th className="p-2.5">Subject</th>
                  <th className="p-2.5">Type</th>
                  <th className="p-2.5">Score</th>
                  <th className="p-2.5">Grade</th>
                  <th className="p-2.5">Term</th>
                  <th className="p-2.5">Teacher Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {grades.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-2.5 font-bold text-slate-900">{g.studentName}</td>
                    <td className="p-2.5 font-semibold text-indigo-700">{g.subject}</td>
                    <td className="p-2.5">{g.assessmentType}</td>
                    <td className="p-2.5 font-mono font-bold text-slate-900">{g.score} / {g.maxScore}</td>
                    <td className="p-2.5">
                      <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold border border-indigo-100">
                        {g.gradeLetter}
                      </span>
                    </td>
                    <td className="p-2.5">{g.term} {g.year}</td>
                    <td className="p-2.5 text-slate-500 italic">{g.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: REPORT CARDS */}
      {activeTab === 'report_cards' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Official Student Report Card Generator</h3>
            <p className="text-xs text-slate-500">Select a student to generate and preview their formal term academic transcript</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {students.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedStudentReportCard(s)}
                className="p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left transition flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-slate-900 text-xs">{s.firstName} {s.lastName}</div>
                  <div className="text-xs text-slate-500">{s.grade} • ID: {s.studentId}</div>
                </div>
                <Printer className="w-4 h-4 text-indigo-600" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SUBMIT REPORT TO HEADTEACHER */}
      {activeTab === 'submit_report' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Submission Form */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Send className="w-4 h-4 text-indigo-600" />
                Submit Academic / Class Report to Headteacher
              </h3>
              <p className="text-xs text-slate-500">Send official subject progress notes, student conduct alerts, or lab resource requests directly to Dr. Kingsley.</p>
            </div>

            <form onSubmit={handleSendReportToHeadteacher} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Report Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. End of Term Grade 10 Math Performance Overview"
                  value={reportForm.title}
                  onChange={e => setReportForm({ ...reportForm, title: e.target.value })}
                  className="w-full bg-slate-50 text-slate-900 p-2 rounded-md border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Report Category</label>
                  <select
                    value={reportForm.reportType}
                    onChange={e => setReportForm({ ...reportForm, reportType: e.target.value as any })}
                    className="w-full bg-slate-50 text-slate-900 p-2 rounded-md border border-slate-200"
                  >
                    <option value="Academic Progress">Academic Progress</option>
                    <option value="Class Conduct">Class Conduct</option>
                    <option value="Resource Request">Resource Request</option>
                    <option value="Special Student Report">Special Student Report</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Priority Level</label>
                  <select
                    value={reportForm.priority}
                    onChange={e => setReportForm({ ...reportForm, priority: e.target.value as any })}
                    className="w-full bg-slate-50 text-slate-900 p-2 rounded-md border border-slate-200"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-700 font-semibold">Report Content & Observations *</label>
                  <button
                    type="button"
                    onClick={handleAiPolishReport}
                    disabled={isPolishingReport || !reportForm.content}
                    className="text-indigo-600 hover:underline flex items-center gap-1 font-semibold text-[11px] disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isPolishingReport ? 'Polishing Wording...' : 'AI Refine Text'}</span>
                  </button>
                </div>

                <textarea
                  rows={5}
                  required
                  placeholder="Describe class academic metrics, special student achievements, equipment needs, or behavioral observations..."
                  value={reportForm.content}
                  onChange={e => setReportForm({ ...reportForm, content: e.target.value })}
                  className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-md border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-md shadow-xs transition"
              >
                Send Report to Headteacher
              </button>
            </form>
          </div>

          {/* Submitted Reports History */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Your Submitted Reports History</h3>

            <div className="space-y-3">
              {reports.map((rep) => (
                <div key={rep.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{rep.title}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                      rep.status === 'Reviewed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      rep.status === 'Action Taken' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {rep.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{rep.content}</p>
                  {rep.headteacherResponse && (
                    <div className="mt-2 text-xs bg-amber-50 text-amber-800 p-2 rounded-md border border-amber-200">
                      <span className="font-bold">Headteacher Feedback:</span> {rep.headteacherResponse}
                    </div>
                  )}
                  <div className="text-[10px] text-slate-400 flex justify-between font-medium">
                    <span>Submitted: {rep.date}</span>
                    <span>Priority: {rep.priority}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD STUDENT */}
      {isAddStudentOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-lg p-6 text-slate-900 shadow-2xl relative">
            <button
              onClick={() => setIsAddStudentOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1">Add New Student to Class Roster</h3>
            <p className="text-xs text-slate-500 mb-4">Register new student credentials, guardian contacts, and class assignment</p>

            <form onSubmit={handleCreateStudent} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Liam"
                    value={studentForm.firstName}
                    onChange={e => setStudentForm({ ...studentForm, firstName: e.target.value })}
                    className="w-full bg-slate-50 text-slate-900 p-2 rounded-md border border-slate-200 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Walker"
                    value={studentForm.lastName}
                    onChange={e => setStudentForm({ ...studentForm, lastName: e.target.value })}
                    className="w-full bg-slate-50 text-slate-900 p-2 rounded-md border border-slate-200 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Grade Level</label>
                  <select
                    value={studentForm.grade}
                    onChange={e => setStudentForm({ ...studentForm, grade: e.target.value })}
                    className="w-full bg-slate-50 text-slate-900 p-2 rounded-md border border-slate-200"
                  >
                    <option value="Grade 9">Grade 9</option>
                    <option value="Grade 10">Grade 10</option>
                    <option value="Grade 11">Grade 11</option>
                    <option value="Grade 12">Grade 12</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Section</label>
                  <input
                    type="text"
                    value={studentForm.section}
                    onChange={e => setStudentForm({ ...studentForm, section: e.target.value })}
                    className="w-full bg-slate-50 text-slate-900 p-2 rounded-md border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Gender</label>
                  <select
                    value={studentForm.gender}
                    onChange={e => setStudentForm({ ...studentForm, gender: e.target.value as any })}
                    className="w-full bg-slate-50 text-slate-900 p-2 rounded-md border border-slate-200"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Guardian Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Robert Walker"
                    value={studentForm.guardianName}
                    onChange={e => setStudentForm({ ...studentForm, guardianName: e.target.value })}
                    className="w-full bg-slate-50 text-slate-900 p-2 rounded-md border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Guardian Phone</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 000-0000"
                    value={studentForm.guardianContact}
                    onChange={e => setStudentForm({ ...studentForm, guardianContact: e.target.value })}
                    className="w-full bg-slate-50 text-slate-900 p-2 rounded-md border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Guardian Email</label>
                <input
                  type="email"
                  placeholder="parent@email.com"
                  value={studentForm.guardianEmail}
                  onChange={e => setStudentForm({ ...studentForm, guardianEmail: e.target.value })}
                  className="w-full bg-slate-50 text-slate-900 p-2 rounded-md border border-slate-200"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddStudentOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-md shadow-xs"
                >
                  Save Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: LOG GRADE */}
      {isAddGradeOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-lg p-6 text-slate-900 shadow-2xl relative">
            <button
              onClick={() => setIsAddGradeOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1">Record Assessment Score</h3>
            <p className="text-xs text-slate-500 mb-4">Log student subject grades and academic remarks</p>

            <form onSubmit={handleSaveGrade} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Select Student *</label>
                <select
                  required
                  value={gradeForm.studentId}
                  onChange={e => setGradeForm({ ...gradeForm, studentId: e.target.value })}
                  className="w-full bg-slate-50 text-slate-900 p-2 rounded-md border border-slate-200"
                >
                  <option value="">-- Choose Student --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.grade})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Subject</label>
                  <select
                    value={gradeForm.subject}
                    onChange={e => setGradeForm({ ...gradeForm, subject: e.target.value })}
                    className="w-full bg-slate-50 text-slate-900 p-2 rounded-md border border-slate-200"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="English Literature">English Literature</option>
                    <option value="World History">World History</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Assessment Type</label>
                  <select
                    value={gradeForm.assessmentType}
                    onChange={e => setGradeForm({ ...gradeForm, assessmentType: e.target.value as any })}
                    className="w-full bg-slate-50 text-slate-900 p-2 rounded-md border border-slate-200"
                  >
                    <option value="Homework">Homework</option>
                    <option value="Quiz">Quiz</option>
                    <option value="Midterm Exam">Midterm Exam</option>
                    <option value="Final Exam">Final Exam</option>
                    <option value="Class Project">Class Project</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Score Obtained</label>
                  <input
                    type="number"
                    value={gradeForm.score}
                    onChange={e => setGradeForm({ ...gradeForm, score: Number(e.target.value) })}
                    className="w-full bg-slate-50 text-slate-900 p-2 rounded-md border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Max Score</label>
                  <input
                    type="number"
                    value={gradeForm.maxScore}
                    onChange={e => setGradeForm({ ...gradeForm, maxScore: Number(e.target.value) })}
                    className="w-full bg-slate-50 text-slate-900 p-2 rounded-md border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Teacher Remarks</label>
                <input
                  type="text"
                  placeholder="e.g. Excellent progress in problem solving"
                  value={gradeForm.remarks}
                  onChange={e => setGradeForm({ ...gradeForm, remarks: e.target.value })}
                  className="w-full bg-slate-50 text-slate-900 p-2 rounded-md border border-slate-200"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddGradeOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-md shadow-xs"
                >
                  Save Score
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PRINTABLE STUDENT REPORT CARD */}
      {selectedStudentReportCard && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-2xl w-full max-w-2xl p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto print:p-0">
            <button
              onClick={() => setSelectedStudentReportCard(null)}
              className="absolute right-4 top-4 text-slate-500 hover:text-slate-900 print:hidden"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Official School Header */}
            <div className="text-center border-b border-slate-300 pb-4 mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">Oakridge International Academy</h2>
              <p className="text-xs text-slate-600">Official Student Academic Report Card • Term 2, 2026</p>
            </div>

            {/* Student Info Box */}
            <div className="grid grid-cols-2 gap-4 bg-slate-100 p-4 rounded-xl text-xs mb-6 border border-slate-200">
              <div>
                <p><strong>Student Name:</strong> {selectedStudentReportCard.firstName} {selectedStudentReportCard.lastName}</p>
                <p><strong>Student ID:</strong> {selectedStudentReportCard.studentId}</p>
                <p><strong>Grade & Section:</strong> {selectedStudentReportCard.grade} ({selectedStudentReportCard.section})</p>
              </div>
              <div>
                <p><strong>Guardian:</strong> {selectedStudentReportCard.guardianName}</p>
                <p><strong>Date of Issue:</strong> {new Date().toLocaleDateString()}</p>
                <p><strong>Academic Status:</strong> <span className="text-emerald-700 font-bold">{selectedStudentReportCard.status}</span></p>
              </div>
            </div>

            {/* Grades Table */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Subject Performance Breakdown</h4>
              <table className="w-full text-left text-xs border border-slate-300">
                <thead className="bg-slate-200 font-bold">
                  <tr>
                    <th className="p-2 border-b">Subject</th>
                    <th className="p-2 border-b">Assessment</th>
                    <th className="p-2 border-b">Score</th>
                    <th className="p-2 border-b">Letter</th>
                    <th className="p-2 border-b">Teacher Observations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {grades.filter(g => g.studentId === selectedStudentReportCard.id).map(g => (
                    <tr key={g.id}>
                      <td className="p-2 font-bold">{g.subject}</td>
                      <td className="p-2">{g.assessmentType}</td>
                      <td className="p-2 font-mono font-bold">{g.score} / {g.maxScore}</td>
                      <td className="p-2 font-bold text-emerald-700">{g.gradeLetter}</td>
                      <td className="p-2 text-slate-600 italic">{g.remarks}</td>
                    </tr>
                  ))}
                  {grades.filter(g => g.studentId === selectedStudentReportCard.id).length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-slate-500 italic">No grades logged for this student yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Official Signatures */}
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-300 text-xs">
              <div className="text-center space-y-8">
                <div className="border-b border-slate-400 w-3/4 mx-auto" />
                <p className="font-semibold text-slate-700">Mrs. Sarah Jenkins<br /><span className="text-[10px] text-slate-500">Class Form Teacher</span></p>
              </div>
              <div className="text-center space-y-8">
                <div className="border-b border-slate-400 w-3/4 mx-auto" />
                <p className="font-semibold text-slate-700">Dr. Arthur Kingsley<br /><span className="text-[10px] text-slate-500">Headteacher / Principal</span></p>
              </div>
            </div>

            {/* Print Action */}
            <div className="mt-8 flex justify-end gap-3 print:hidden">
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center gap-2 hover:bg-slate-800"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Report Card</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Student Delete Confirmation Modal */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <div className="p-3 bg-red-50 dark:bg-red-950/50 rounded-xl border border-red-100 dark:border-red-900">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Confirm Student Deletion</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">This action will remove the student permanently.</p>
              </div>
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-300">
              Are you sure you want to delete <strong className="text-slate-900 dark:text-white">{studentToDelete.firstName} {studentToDelete.lastName}</strong> (<span className="text-indigo-600 dark:text-indigo-400 font-semibold">{studentToDelete.studentId}</span> - {studentToDelete.grade}) from the student roster?
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setStudentToDelete(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onRemoveStudent) {
                    onRemoveStudent(studentToDelete.id);
                  }
                  setStudentToDelete(null);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-xs transition cursor-pointer"
              >
                Delete Student
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
