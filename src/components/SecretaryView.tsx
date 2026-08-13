import React, { useState } from 'react';
import { SchoolEvent, Student, EnrollmentDocument, DocumentType } from '../types';
import { 
  Calendar, 
  Plus, 
  FileText, 
  ShieldCheck, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Upload, 
  Printer, 
  Search, 
  Filter, 
  X, 
  UserCheck, 
  Eye, 
  Download, 
  FolderOpen,
  MapPin,
  Users
} from 'lucide-react';

interface SecretaryViewProps {
  events: SchoolEvent[];
  onAddEvent: (newEvent: Omit<SchoolEvent, 'id' | 'status'>) => void;
  students: Student[];
  documents: EnrollmentDocument[];
  onUpdateDocumentStatus: (docId: string, status: EnrollmentDocument['status'], notes?: string) => void;
  onUploadDocument: (newDoc: Omit<EnrollmentDocument, 'id'>) => void;
  onUpdateStudentStatus: (studentId: string, status: Student['status']) => void;
  searchTerm: string;
}

export const SecretaryView: React.FC<SecretaryViewProps> = ({
  events,
  onAddEvent,
  students,
  documents,
  onUpdateDocumentStatus,
  onUploadDocument,
  onUpdateStudentStatus,
  searchTerm
}) => {
  const [activeTab, setActiveTab] = useState<'events' | 'student_records' | 'enrollment_docs'>('events');

  // Modal: Add Event
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: '',
    category: 'School Event' as SchoolEvent['category'],
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '11:00',
    location: 'Main Auditorium',
    targetAudience: 'All Staff' as SchoolEvent['targetAudience'],
    description: '',
    organizer: 'Ms. Clara Vance (Secretary)'
  });

  // Modal: Document Verification Detail
  const [selectedStudentForDocs, setSelectedStudentForDocs] = useState<Student | null>(null);
  const [uploadDocType, setUploadDocType] = useState<DocumentType>('Birth Certificate');

  // Search Filter for Students
  const filteredStudents = students.filter(s => 
    `${s.firstName} ${s.lastName} ${s.studentId}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle Create Event
  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title || !eventForm.date) return;

    onAddEvent({
      title: eventForm.title,
      category: eventForm.category,
      date: eventForm.date,
      startTime: eventForm.startTime,
      endTime: eventForm.endTime,
      location: eventForm.location,
      targetAudience: eventForm.targetAudience,
      description: eventForm.description,
      organizer: eventForm.organizer
    });

    setIsAddEventOpen(false);
    setEventForm({
      title: '',
      category: 'School Event',
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '11:00',
      location: 'Main Auditorium',
      targetAudience: 'All Staff',
      description: '',
      organizer: 'Ms. Clara Vance (Secretary)'
    });
  };

  // Handle Mock Upload Document
  const handleMockUpload = (studentId: string) => {
    onUploadDocument({
      studentId,
      documentType: uploadDocType,
      fileName: `${uploadDocType.replace(/\s+/g, '_')}_Uploaded.pdf`,
      fileSize: '1.8 MB',
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'Verified',
      verifiedBy: 'Ms. Clara Vance',
      notes: 'Verified by Secretary upon submission.'
    });

    alert(`${uploadDocType} uploaded & verified!`);
  };

  return (
    <div className="space-y-6">
      {/* Secretary Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 text-slate-900 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-indigo-50 text-indigo-700 text-xs px-2.5 py-0.5 rounded-md font-semibold border border-indigo-100">
                Front Office & Operations
              </span>
              <span className="text-xs text-slate-500">Ms. Clara Vance (Secretary)</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 mt-1">Secretary Events & Student Documentation Desk</h2>
            <p className="text-xs text-slate-500">
              Schedule school events & staff meetings, manage student enrollment files, and verify admission paperwork.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddEventOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-bold transition shadow-xs"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule Event / Meeting</span>
            </button>
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-slate-200">
          {[
            { id: 'events', label: 'Events & Meeting Calendar', icon: Calendar, badge: `${events.length} Events` },
            { id: 'student_records', label: 'Student Records Directory', icon: UserCheck, badge: `${students.length} Students` },
            { id: 'enrollment_docs', label: 'Enrollment Documentation Desk', icon: ShieldCheck, badge: `${documents.length} Files` }
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

      {/* TAB 1: EVENTS & MEETING CALENDAR */}
      {activeTab === 'events' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">Scheduled School Events & Calendar Meetings</h3>
                <p className="text-xs text-slate-500">All planned academic assemblies, parent-teacher conferences, and staff meetings</p>
              </div>

              <button
                onClick={() => setIsAddEventOpen(true)}
                className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-md transition shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>New Calendar Item</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.map((evt) => (
                <div key={evt.id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3 relative group">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold uppercase font-mono border border-indigo-100">
                        {evt.category}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-1.5">{evt.title}</h4>
                    </div>
                    <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-bold border border-emerald-200">
                      {evt.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{evt.description}</p>

                  <div className="space-y-1.5 text-xs text-slate-500 border-t border-slate-200 pt-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{evt.date} ({evt.startTime} - {evt.endTime})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{evt.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Audience: {evt.targetAudience}</span>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400 border-t border-slate-200 pt-2 flex justify-between font-medium">
                    <span>Organizer: {evt.organizer}</span>
                    <button 
                      onClick={() => window.print()}
                      className="text-indigo-600 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <Printer className="w-3 h-3" />
                      <span>Print Notice</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STUDENT RECORDS DIRECTORY */}
      {activeTab === 'student_records' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Student Enrollment Master Directory</h3>
            <p className="text-xs text-slate-500">Complete list of registered students and their documentation status</p>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase font-mono font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Student ID</th>
                  <th className="p-2.5">Full Name</th>
                  <th className="p-2.5">Grade</th>
                  <th className="p-2.5">Guardian Contact</th>
                  <th className="p-2.5">Enrollment Status</th>
                  <th className="p-2.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-2.5 font-mono font-bold text-indigo-600">{s.studentId}</td>
                    <td className="p-2.5 font-bold text-slate-900">{s.firstName} {s.lastName}</td>
                    <td className="p-2.5">{s.grade} ({s.section})</td>
                    <td className="p-2.5 text-slate-600">{s.guardianName} ({s.guardianContact})</td>
                    <td className="p-2.5">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                        s.status === 'Enrolled' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        s.status === 'Pending Documents' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="p-2.5">
                      <button
                        onClick={() => setSelectedStudentForDocs(s)}
                        className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-md text-xs flex items-center gap-1 shadow-xs transition"
                      >
                        <FolderOpen className="w-3.5 h-3.5" />
                        <span>Manage File</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ENROLLMENT DOCUMENTATION DESK */}
      {activeTab === 'enrollment_docs' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Enrollment Documentation & Paperwork Audit</h3>
            <p className="text-xs text-slate-500">Verify uploaded birth certificates, immunization records, national IDs, and transcripts</p>
          </div>

          <div className="space-y-3">
            {documents.map((doc) => {
              const studentObj = students.find(s => s.id === doc.studentId);
              return (
                <div key={doc.id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs">{doc.documentType}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        doc.status === 'Verified' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        doc.status === 'Pending Verification' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {doc.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      File: <strong className="text-slate-800">{doc.fileName}</strong> ({doc.fileSize}) • Student: {studentObj ? `${studentObj.firstName} ${studentObj.lastName}` : 'N/A'}
                    </p>
                    {doc.notes && <p className="text-xs text-amber-700 italic">Note: {doc.notes}</p>}
                  </div>

                  <div className="flex items-center gap-2">
                    {doc.status !== 'Verified' && (
                      <button
                        onClick={() => onUpdateDocumentStatus(doc.id, 'Verified', 'Verified by Secretary')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-md transition shadow-xs"
                      >
                        Verify Doc
                      </button>
                    )}

                    <button
                      onClick={() => onUpdateDocumentStatus(doc.id, 'Action Required', 'Missing official stamp')}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-md transition shadow-xs"
                    >
                      Flag Issue
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL: ADD EVENT */}
      {isAddEventOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-lg p-6 text-slate-900 shadow-2xl relative">
            <button
              onClick={() => setIsAddEventOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1">Schedule School Event or Staff Meeting</h3>
            <p className="text-xs text-slate-500 mb-4">Publish item to school master calendar</p>

            <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Event / Meeting Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. All-Staff Strategic Planning Session"
                  value={eventForm.title}
                  onChange={e => setEventForm({ ...eventForm, title: e.target.value })}
                  className="w-full bg-slate-50 text-slate-900 p-2 rounded-md border border-slate-200 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category</label>
                  <select
                    value={eventForm.category}
                    onChange={e => setEventForm({ ...eventForm, category: e.target.value as any })}
                    className="w-full bg-slate-50 text-slate-900 p-2 rounded-md border border-slate-200"
                  >
                    <option value="School Event">School Event</option>
                    <option value="Staff Meeting">Staff Meeting</option>
                    <option value="Parent-Teacher Conference">Parent-Teacher Conference</option>
                    <option value="Academic Calendar">Academic Calendar</option>
                    <option value="Exam Period">Exam Period</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Target Audience</label>
                  <select
                    value={eventForm.targetAudience}
                    onChange={e => setEventForm({ ...eventForm, targetAudience: e.target.value as any })}
                    className="w-full bg-slate-50 text-slate-900 p-2 rounded-md border border-slate-200"
                  >
                    <option value="All Staff">All Staff</option>
                    <option value="Teachers Only">Teachers Only</option>
                    <option value="All Parents & Students">All Parents & Students</option>
                    <option value="Grade 9-12 Parents">Grade 9-12 Parents</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={eventForm.date}
                    onChange={e => setEventForm({ ...eventForm, date: e.target.value })}
                    className="w-full bg-slate-50 text-slate-900 p-2 rounded-md border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Start Time</label>
                  <input
                    type="time"
                    value={eventForm.startTime}
                    onChange={e => setEventForm({ ...eventForm, startTime: e.target.value })}
                    className="w-full bg-slate-50 text-slate-900 p-2 rounded-md border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">End Time</label>
                  <input
                    type="time"
                    value={eventForm.endTime}
                    onChange={e => setEventForm({ ...eventForm, endTime: e.target.value })}
                    className="w-full bg-slate-50 text-slate-900 p-2 rounded-md border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Location / Venue</label>
                <input
                  type="text"
                  placeholder="e.g. Main Auditorium / Room 102"
                  value={eventForm.location}
                  onChange={e => setEventForm({ ...eventForm, location: e.target.value })}
                  className="w-full bg-slate-50 text-slate-900 p-2 rounded-md border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Event Agenda / Description</label>
                <textarea
                  rows={3}
                  placeholder="Details regarding agenda items or required preparation..."
                  value={eventForm.description}
                  onChange={e => setEventForm({ ...eventForm, description: e.target.value })}
                  className="w-full bg-slate-50 text-slate-900 p-2 rounded-md border border-slate-200"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddEventOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-md shadow-xs"
                >
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: STUDENT FILE MANAGEMENT */}
      {selectedStudentForDocs && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-xl p-6 text-slate-900 shadow-2xl relative">
            <button
              onClick={() => setSelectedStudentForDocs(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1">
              Student Enrollment File: {selectedStudentForDocs.firstName} {selectedStudentForDocs.lastName}
            </h3>
            <p className="text-xs text-slate-500 mb-4">ID: {selectedStudentForDocs.studentId} • {selectedStudentForDocs.grade}</p>

            <div className="space-y-4">
              {/* Status Updater */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                <span>Enrollment Status: <strong className="text-emerald-600">{selectedStudentForDocs.status}</strong></span>
                <button
                  onClick={() => {
                    const next = selectedStudentForDocs.status === 'Enrolled' ? 'Pending Documents' : 'Enrolled';
                    onUpdateStudentStatus(selectedStudentForDocs.id, next);
                    setSelectedStudentForDocs({ ...selectedStudentForDocs, status: next });
                  }}
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-md text-xs shadow-xs"
                >
                  Toggle Enrolled Status
                </button>
              </div>

              {/* Upload Document Box */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase font-mono">Upload / Attach Paperwork</h4>
                <div className="flex gap-2">
                  <select
                    value={uploadDocType}
                    onChange={e => setUploadDocType(e.target.value as any)}
                    className="bg-white text-slate-900 text-xs p-2 rounded-md border border-slate-200 flex-1"
                  >
                    <option value="Birth Certificate">Birth Certificate</option>
                    <option value="Immunization Record">Immunization Record</option>
                    <option value="National ID / Passport">National ID / Passport</option>
                    <option value="Previous School Transcript">Previous School Transcript</option>
                  </select>

                  <button
                    onClick={() => handleMockUpload(selectedStudentForDocs.id)}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-md flex items-center gap-1 shadow-xs transition"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload & Verify</span>
                  </button>
                </div>
              </div>

              {/* Document List */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700">Attached Documents</h4>
                {documents.filter(d => d.studentId === selectedStudentForDocs.id).map(d => (
                  <div key={d.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs flex justify-between items-center">
                    <div>
                      <div className="font-bold text-slate-900">{d.documentType}</div>
                      <div className="text-[10px] text-slate-500">{d.fileName} ({d.fileSize})</div>
                    </div>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold border border-emerald-200">
                      {d.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
