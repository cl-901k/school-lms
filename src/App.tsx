import React, { useState, useEffect } from 'react';
import { UserRole, StaffMember, Student, GradeRecord, TeacherReport, SchoolEvent, StudentInvoice, PaymentReceipt, EnrollmentDocument } from './types';
import { loadLMSStore, saveLMSStore, resetLMSStoreToDefault, LMSDataStore } from './data/mockData';
import { RoleHeader } from './components/RoleHeader';
import { LoginView } from './components/LoginView';
import { HeadteacherView } from './components/HeadteacherView';
import { TeacherView } from './components/TeacherView';
import { SecretaryView } from './components/SecretaryView';
import { AccountsClerkView } from './components/AccountsClerkView';
import { PwaOfflineBar } from './components/PwaOfflineBar';
import { usePWA } from './lib/usePWA';

export default function App() {
  const [lmsStore, setLmsStore] = useState<LMSDataStore>(() => loadLMSStore());
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { isOnline, isInstallable, isInstalled, triggerInstall } = usePWA();

  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const savedTheme = localStorage.getItem('oakridge_theme') as 'light' | 'dark';
      if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    } catch (e) {
      console.error(e);
    }
    return 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('oakridge_theme', theme);
    } catch (e) {
      console.error(e);
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Authentication State
  const [currentUser, setCurrentUser] = useState<StaffMember | null>(() => {
    try {
      const savedId = localStorage.getItem('oakridge_logged_in_user_id');
      if (savedId) {
        const store = loadLMSStore();
        const found = store.staff.find(s => s.id === savedId && s.status === 'Active');
        if (found) return found;
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  // Current Role Dashboard View
  const mapRoleToUserRole = (staffRole: StaffMember['role']): UserRole => {
    switch (staffRole) {
      case 'Headteacher':
        return 'headteacher';
      case 'Teacher':
      case 'Vice Principal':
      case 'Department Head':
        return 'teacher';
      case 'Secretary':
        return 'secretary';
      case 'Accounts Clerk':
        return 'accounts_clerk';
      default:
        return 'teacher';
    }
  };

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    if (currentUser) {
      return mapRoleToUserRole(currentUser.role);
    }
    return 'headteacher';
  });

  // Keep role in sync when logged in user changes
  const handleLoginSuccess = (staff: StaffMember) => {
    setCurrentUser(staff);
    const mapped = mapRoleToUserRole(staff.role);
    setCurrentRole(mapped);
    try {
      localStorage.setItem('oakridge_logged_in_user_id', staff.id);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('oakridge_logged_in_user_id');
    } catch (e) {
      console.error(e);
    }
  };

  // Persist store state whenever updated
  const updateStore = (updater: (prev: LMSDataStore) => LMSDataStore) => {
    setLmsStore(prev => {
      const next = updater(prev);
      saveLMSStore(next);
      return next;
    });
  };

  // Reset demo dataset
  const handleResetData = () => {
    if (window.confirm('Reset all system records to default demo data?')) {
      const fresh = resetLMSStoreToDefault();
      setLmsStore(fresh);
      // Ensure logged in user is still valid or reset
      if (currentUser) {
        const refreshed = fresh.staff.find(s => s.id === currentUser.id);
        setCurrentUser(refreshed || fresh.staff[0]);
      }
    }
  };

  // Headteacher: Add Staff
  const handleAddStaff = (newStaff: Omit<StaffMember, 'id' | 'staffId'>) => {
    updateStore(prev => {
      const newId = `stf-${Date.now()}`;
      const staffId = `EMP-2026-0${prev.staff.length + 1}`;
      const created: StaffMember = { ...newStaff, id: newId, staffId };
      return { ...prev, staff: [created, ...prev.staff] };
    });
  };

  // Headteacher: Remove Staff
  const handleRemoveStaff = (staffId: string) => {
    updateStore(prev => ({
      ...prev,
      staff: prev.staff.filter(s => s.id !== staffId)
    }));
  };

  // Headteacher: Toggle Staff Status
  const handleUpdateStaffStatus = (staffId: string, status: StaffMember['status']) => {
    updateStore(prev => ({
      ...prev,
      staff: prev.staff.map(s => s.id === staffId ? { ...s, status } : s)
    }));
  };

  // Headteacher: Update Staff Member Details & Password
  const handleUpdateStaff = (updatedStaff: StaffMember) => {
    updateStore(prev => ({
      ...prev,
      staff: prev.staff.map(s => s.id === updatedStaff.id ? updatedStaff : s)
    }));
    // If the updated staff member is the currently logged-in user, keep currentUser state synced
    if (currentUser && currentUser.id === updatedStaff.id) {
      setCurrentUser(updatedStaff);
    }
  };

  // Headteacher: Respond to Teacher Report
  const handleRespondToReport = (reportId: string, response: string, status: TeacherReport['status']) => {
    updateStore(prev => ({
      ...prev,
      reports: prev.reports.map(r => r.id === reportId ? { ...r, headteacherResponse: response, status } : r)
    }));
  };

  // Teacher: Add Student
  const handleAddStudent = (newStudent: Omit<Student, 'id' | 'studentId'>) => {
    updateStore(prev => {
      const newId = `std-${Date.now()}`;
      const studentId = `STU-2026-0${prev.students.length + 1}`;
      const created: Student = { ...newStudent, id: newId, studentId };
      return { ...prev, students: [created, ...prev.students] };
    });
  };

  // Teacher / Staff: Remove Student
  const handleRemoveStudent = (studentId: string) => {
    updateStore(prev => ({
      ...prev,
      students: prev.students.filter(s => s.id !== studentId),
      grades: prev.grades.filter(g => g.studentId !== studentId)
    }));
  };

  // Secretary: Update Student Status
  const handleUpdateStudentStatus = (studentId: string, status: Student['status']) => {
    updateStore(prev => ({
      ...prev,
      students: prev.students.map(s => s.id === studentId ? { ...s, status } : s)
    }));
  };

  // Teacher: Add Grade
  const handleAddGrade = (newGrade: Omit<GradeRecord, 'id'>) => {
    updateStore(prev => {
      const created: GradeRecord = { ...newGrade, id: `grd-${Date.now()}` };
      return { ...prev, grades: [created, ...prev.grades] };
    });
  };

  // Teacher: Submit Report to Headteacher
  const handleSubmitReport = (newReport: Omit<TeacherReport, 'id' | 'status'>) => {
    updateStore(prev => {
      const created: TeacherReport = { ...newReport, id: `rep-${Date.now()}`, status: 'Pending Review' };
      return { ...prev, reports: [created, ...prev.reports] };
    });
  };

  // Secretary: Add Event
  const handleAddEvent = (newEvent: Omit<SchoolEvent, 'id' | 'status'>) => {
    updateStore(prev => {
      const created: SchoolEvent = { ...newEvent, id: `evt-${Date.now()}`, status: 'Scheduled' };
      return { ...prev, events: [created, ...prev.events] };
    });
  };

  // Secretary: Document Status
  const handleUpdateDocumentStatus = (docId: string, status: EnrollmentDocument['status'], notes?: string) => {
    updateStore(prev => ({
      ...prev,
      documents: prev.documents.map(d => d.id === docId ? { ...d, status, notes: notes || d.notes } : d)
    }));
  };

  // Secretary: Upload Document
  const handleUploadDocument = (newDoc: Omit<EnrollmentDocument, 'id'>) => {
    updateStore(prev => {
      const created: EnrollmentDocument = { ...newDoc, id: `doc-${Date.now()}` };
      return { ...prev, documents: [created, ...prev.documents] };
    });
  };

  // Accounts Clerk: Record Payment
  const handleRecordPayment = (payment: Omit<PaymentReceipt, 'id' | 'receiptNumber'>) => {
    updateStore(prev => {
      const receiptNumber = `RCP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const newReceipt: PaymentReceipt = { ...payment, id: `rcp-${Date.now()}`, receiptNumber };

      // Update targeted invoice balance and status
      const updatedInvoices = prev.invoices.map(inv => {
        if (inv.id === payment.invoiceId) {
          const newPaid = inv.paidAmount + payment.amountPaid;
          const newBal = Math.max(0, inv.totalAmount - newPaid);
          let newStatus: StudentInvoice['status'] = inv.status;
          if (newBal === 0) newStatus = 'Paid';
          else if (newPaid > 0) newStatus = 'Partial';

          return { ...inv, paidAmount: newPaid, balance: newBal, status: newStatus };
        }
        return inv;
      });

      return {
        ...prev,
        receipts: [newReceipt, ...prev.receipts],
        invoices: updatedInvoices
      };
    });
  };

  // Accounts Clerk: Create Invoice
  const handleCreateInvoice = (invoice: Omit<StudentInvoice, 'id' | 'invoiceNumber'>) => {
    updateStore(prev => {
      const invoiceNumber = `INV-2026-0${prev.invoices.length + 1}`;
      const created: StudentInvoice = { ...invoice, id: `inv-${Date.now()}`, invoiceNumber };
      return { ...prev, invoices: [created, ...prev.invoices] };
    });
  };

  // If no staff user is logged in, show the Login Portal
  if (!currentUser) {
    return (
      <>
        <PwaOfflineBar 
          isOnline={isOnline} 
          isInstallable={isInstallable} 
          isInstalled={isInstalled} 
          onInstall={triggerInstall} 
        />
        <LoginView
          staffList={lmsStore.staff}
          onLoginSuccess={handleLoginSuccess}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />
      </>
    );
  }

  // Active Teacher profile for TeacherView
  const teacherUser = currentUser.role === 'Teacher' || currentUser.role === 'Vice Principal' || currentUser.role === 'Department Head' 
    ? currentUser 
    : (lmsStore.staff.find(s => s.role === 'Teacher') || lmsStore.staff[1]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col antialiased selection:bg-emerald-600 selection:text-white transition-colors duration-200">
      {/* PWA & Offline Status Banner */}
      <PwaOfflineBar 
        isOnline={isOnline} 
        isInstallable={isInstallable} 
        isInstalled={isInstalled} 
        onInstall={triggerInstall} 
      />

      {/* Top Navigation & Role Switcher */}
      <RoleHeader
        currentRole={currentRole}
        currentUser={currentUser}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onLogout={handleLogout}
        onRoleChange={role => setCurrentRole(role)}
        searchTerm={searchTerm}
        onSearchChange={term => setSearchTerm(term)}
        unreadNotificationsCount={lmsStore.reports.filter(r => r.status === 'Pending Review').length}
        isOnline={isOnline}
      />

      {/* Role View Portals */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentRole === 'headteacher' && (
          <HeadteacherView
            staffList={lmsStore.staff}
            onAddStaff={handleAddStaff}
            onRemoveStaff={handleRemoveStaff}
            onUpdateStaffStatus={handleUpdateStaffStatus}
            onUpdateStaff={handleUpdateStaff}
            students={lmsStore.students}
            reports={lmsStore.reports}
            onRespondToReport={handleRespondToReport}
            invoices={lmsStore.invoices}
            receipts={lmsStore.receipts}
            grades={lmsStore.grades}
            events={lmsStore.events}
            searchTerm={searchTerm}
          />
        )}

        {currentRole === 'teacher' && (
          <TeacherView
            students={lmsStore.students}
            onAddStudent={handleAddStudent}
            onRemoveStudent={handleRemoveStudent}
            grades={lmsStore.grades}
            onAddGrade={handleAddGrade}
            reports={lmsStore.reports}
            onSubmitReport={handleSubmitReport}
            currentTeacher={teacherUser}
            searchTerm={searchTerm}
          />
        )}

        {currentRole === 'secretary' && (
          <SecretaryView
            events={lmsStore.events}
            onAddEvent={handleAddEvent}
            students={lmsStore.students}
            documents={lmsStore.documents}
            onUpdateDocumentStatus={handleUpdateDocumentStatus}
            onUploadDocument={handleUploadDocument}
            onUpdateStudentStatus={handleUpdateStudentStatus}
            searchTerm={searchTerm}
          />
        )}

        {currentRole === 'accounts_clerk' && (
          <AccountsClerkView
            invoices={lmsStore.invoices}
            receipts={lmsStore.receipts}
            students={lmsStore.students}
            onRecordPayment={handleRecordPayment}
            onCreateInvoice={handleCreateInvoice}
            searchTerm={searchTerm}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs py-4 mt-8 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">Oakridge International Academy</span>
            <span className="text-slate-400 dark:text-slate-500">• High Density LMS Active v2.5</span>
          </div>

          <p className="text-slate-500 dark:text-slate-400">
            Authenticated User: <strong className="text-slate-800 dark:text-slate-200">{currentUser.name}</strong> ({currentUser.role})
          </p>
        </div>
      </footer>
    </div>
  );
}
