import React, { useState } from 'react';
import { StudentInvoice, PaymentReceipt, Student, InvoiceLineItem } from '../types';
import { 
  CreditCard, 
  DollarSign, 
  Plus, 
  Printer, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Send, 
  X, 
  FileText, 
  Receipt, 
  TrendingUp, 
  ShieldAlert,
  ChevronRight
} from 'lucide-react';

interface AccountsClerkViewProps {
  invoices: StudentInvoice[];
  receipts: PaymentReceipt[];
  students: Student[];
  onRecordPayment: (payment: Omit<PaymentReceipt, 'id' | 'receiptNumber'>) => void;
  onCreateInvoice: (invoice: Omit<StudentInvoice, 'id' | 'invoiceNumber'>) => void;
  searchTerm: string;
}

export const AccountsClerkView: React.FC<AccountsClerkViewProps> = ({
  invoices,
  receipts,
  students,
  onRecordPayment,
  onCreateInvoice,
  searchTerm
}) => {
  const [activeTab, setActiveTab] = useState<'accounts' | 'record_payment' | 'generate_invoice' | 'receipts'>('accounts');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');

  // Modal: Record Payment
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    invoiceId: '',
    amountPaid: 500,
    paymentMethod: 'Bank Transfer' as PaymentReceipt['paymentMethod'],
    transactionRef: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
    notes: 'Tuition installment received.'
  });

  // Modal: New Invoice
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({
    studentId: '',
    term: 'Term 2',
    dueDate: '2026-04-15',
    tuitionFee: 2200,
    labFee: 350,
    activitiesFee: 250
  });

  // Printable Invoice & Receipt State
  const [printableInvoice, setPrintableInvoice] = useState<StudentInvoice | null>(null);
  const [printableReceipt, setPrintableReceipt] = useState<PaymentReceipt | null>(null);

  // Financial Metrics
  const totalBilled = invoices.reduce((a, b) => a + b.totalAmount, 0);
  const totalCollected = invoices.reduce((a, b) => a + b.paidAmount, 0);
  const totalOutstanding = invoices.reduce((a, b) => a + b.balance, 0);
  const overdueCount = invoices.filter(i => i.status === 'Overdue').length;

  // Filtered Invoices
  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = `${inv.studentName} ${inv.invoiceNumber} ${inv.grade}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatusFilter === 'All' || inv.status === selectedStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle Save Payment
  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentForm.invoiceId) return;

    const targetInv = invoices.find(i => i.id === paymentForm.invoiceId);
    if (!targetInv) return;

    onRecordPayment({
      invoiceId: targetInv.id,
      studentId: targetInv.studentId,
      studentName: targetInv.studentName,
      amountPaid: Number(paymentForm.amountPaid),
      paymentMethod: paymentForm.paymentMethod,
      transactionRef: paymentForm.transactionRef,
      date: new Date().toISOString().split('T')[0],
      term: targetInv.term,
      recordedByClerk: 'Mr. Marcus Thorne (Accounts Clerk)',
      notes: paymentForm.notes
    });

    setIsRecordPaymentOpen(false);
    alert('Payment recorded successfully! Balance updated.');
  };

  // Handle Save Invoice
  const handleSaveInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceForm.studentId) return;

    const studentObj = students.find(s => s.id === invoiceForm.studentId);
    if (!studentObj) return;

    const lineItems: InvoiceLineItem[] = [
      { id: 'li-1', description: `Tuition Fee - ${studentObj.grade} (${invoiceForm.term})`, amount: Number(invoiceForm.tuitionFee) },
      { id: 'li-2', description: 'Science Lab & Technology Levy', amount: Number(invoiceForm.labFee) },
      { id: 'li-3', description: 'Extracurricular & Sports Access', amount: Number(invoiceForm.activitiesFee) }
    ];

    const total = lineItems.reduce((acc, item) => acc + item.amount, 0);

    onCreateInvoice({
      studentId: studentObj.id,
      studentName: `${studentObj.firstName} ${studentObj.lastName}`,
      grade: studentObj.grade,
      term: invoiceForm.term,
      totalAmount: total,
      paidAmount: 0,
      balance: total,
      status: 'Unpaid',
      dueDate: invoiceForm.dueDate,
      issueDate: new Date().toISOString().split('T')[0],
      lineItems
    });

    setIsCreateInvoiceOpen(false);
    alert('Invoice generated and billed to student account.');
  };

  return (
    <div className="space-y-6">
      {/* Accounts Clerk Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 text-slate-900 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-indigo-50 text-indigo-700 text-xs px-2.5 py-0.5 rounded-md font-semibold border border-indigo-100">
                Financial Operations Portal
              </span>
              <span className="text-xs text-slate-500">Mr. Marcus Thorne (Accounts Clerk)</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 mt-1">Student Accounts & Tuition Billing</h2>
            <p className="text-xs text-slate-500">
              Track student tuition standing, record fee payments, generate official invoices and receipts, and audit balances.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRecordPaymentOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-bold transition shadow-xs"
            >
              <DollarSign className="w-4 h-4" />
              <span>Record Fee Payment</span>
            </button>

            <button
              onClick={() => setIsCreateInvoiceOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-indigo-700 border border-slate-200 rounded-md text-xs font-bold transition shadow-xs"
            >
              <Plus className="w-4 h-4 text-indigo-600" />
              <span>Generate Invoice</span>
            </button>
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-slate-200">
          {[
            { id: 'accounts', label: 'Student Financial Standing', icon: CreditCard, badge: `$${totalOutstanding.toLocaleString()} Due` },
            { id: 'receipts', label: 'Payment Receipts Log', icon: Receipt, badge: `${receipts.length} Paid` }
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Fees Billed</span>
          <div className="text-xl font-bold text-slate-900 mt-1">${totalBilled.toLocaleString()}</div>
          <p className="text-xs text-slate-500 mt-1">Across all registered student accounts</p>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Fees Collected</span>
          <div className="text-xl font-bold text-emerald-600 mt-1">${totalCollected.toLocaleString()}</div>
          <p className="text-xs text-slate-500 mt-1">Bank transfers, card & cash receipts</p>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Outstanding Debt</span>
          <div className="text-xl font-bold text-rose-600 mt-1">${totalOutstanding.toLocaleString()}</div>
          <p className="text-xs text-slate-500 mt-1">Remaining balances due for Term 2</p>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Overdue Accounts</span>
          <div className="text-xl font-bold text-amber-600 mt-1">{overdueCount} Accounts</div>
          <p className="text-xs text-slate-500 mt-1">Passed official payment deadline</p>
        </div>
      </div>

      {/* TAB 1: STUDENT FINANCIAL STANDING */}
      {activeTab === 'accounts' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Student Account Master Ledger</h3>
              <p className="text-xs text-slate-500">Monitor fee balances, payment status, and due dates</p>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={selectedStatusFilter}
                onChange={e => setSelectedStatusFilter(e.target.value)}
                className="bg-slate-50 text-slate-700 text-xs px-3 py-1.5 rounded-md border border-slate-200 focus:bg-white"
              >
                <option value="All">All Payment Statuses</option>
                <option value="Paid">Fully Paid</option>
                <option value="Partial">Partial Payment</option>
                <option value="Overdue">Overdue</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase font-mono font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Invoice #</th>
                  <th className="p-2.5">Student Name</th>
                  <th className="p-2.5">Grade</th>
                  <th className="p-2.5">Total Fee</th>
                  <th className="p-2.5">Paid</th>
                  <th className="p-2.5">Balance</th>
                  <th className="p-2.5">Due Date</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-2.5 font-mono font-bold text-indigo-600">{inv.invoiceNumber}</td>
                    <td className="p-2.5 font-bold text-slate-900">{inv.studentName}</td>
                    <td className="p-2.5">{inv.grade}</td>
                    <td className="p-2.5 font-bold text-slate-900">${inv.totalAmount.toLocaleString()}</td>
                    <td className="p-2.5 text-emerald-600 font-bold">${inv.paidAmount.toLocaleString()}</td>
                    <td className="p-2.5 font-bold text-rose-600">${inv.balance.toLocaleString()}</td>
                    <td className="p-2.5">{inv.dueDate}</td>
                    <td className="p-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        inv.status === 'Partial' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        inv.status === 'Overdue' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-2.5 flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setPaymentForm(prev => ({ ...prev, invoiceId: inv.id }));
                          setIsRecordPaymentOpen(true);
                        }}
                        className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-md text-xs shadow-xs"
                      >
                        Pay
                      </button>

                      <button
                        onClick={() => setPrintableInvoice(inv)}
                        className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold rounded-md text-xs flex items-center gap-1 transition"
                      >
                        <Printer className="w-3 h-3 text-slate-500" />
                        <span>Invoice</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PAYMENT RECEIPTS LOG */}
      {activeTab === 'receipts' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Payment Receipt Transaction Audit</h3>
            <p className="text-xs text-slate-500">Official log of all processed payment receipts</p>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase font-mono font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Receipt #</th>
                  <th className="p-2.5">Student Name</th>
                  <th className="p-2.5">Amount</th>
                  <th className="p-2.5">Channel</th>
                  <th className="p-2.5">Transaction Ref</th>
                  <th className="p-2.5">Date</th>
                  <th className="p-2.5">Clerk</th>
                  <th className="p-2.5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {receipts.map((rcp) => (
                  <tr key={rcp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-2.5 font-mono font-bold text-amber-700">{rcp.receiptNumber}</td>
                    <td className="p-2.5 font-bold text-slate-900">{rcp.studentName}</td>
                    <td className="p-2.5 text-emerald-600 font-bold">${rcp.amountPaid.toLocaleString()}</td>
                    <td className="p-2.5">{rcp.paymentMethod}</td>
                    <td className="p-2.5 font-mono text-slate-500">{rcp.transactionRef}</td>
                    <td className="p-2.5">{rcp.date}</td>
                    <td className="p-2.5 text-slate-500">{rcp.recordedByClerk}</td>
                    <td className="p-2.5">
                      <button
                        onClick={() => setPrintableReceipt(rcp)}
                        className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-md text-xs flex items-center gap-1 shadow-xs transition"
                      >
                        <Printer className="w-3 h-3" />
                        <span>Receipt</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: RECORD PAYMENT */}
      {isRecordPaymentOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-lg p-6 text-slate-900 shadow-2xl relative">
            <button
              onClick={() => setIsRecordPaymentOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1">Record Tuition / Fee Payment</h3>
            <p className="text-xs text-slate-500 mb-4">Post payment transaction to student invoice</p>

            <form onSubmit={handleSavePayment} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Select Student Invoice *</label>
                <select
                  required
                  value={paymentForm.invoiceId}
                  onChange={e => setPaymentForm({ ...paymentForm, invoiceId: e.target.value })}
                  className="w-full bg-slate-50 text-slate-900 p-2 rounded-md border border-slate-200"
                >
                  <option value="">-- Select Invoice --</option>
                  {invoices.filter(i => i.balance > 0).map(i => (
                    <option key={i.id} value={i.id}>
                      {i.studentName} ({i.invoiceNumber}) • Due Balance: ${i.balance}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Amount Paid ($) *</label>
                  <input
                    type="number"
                    required
                    value={paymentForm.amountPaid}
                    onChange={e => setPaymentForm({ ...paymentForm, amountPaid: Number(e.target.value) })}
                    className="w-full bg-slate-50 text-slate-900 p-2 rounded-md border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Payment Method</label>
                  <select
                    value={paymentForm.paymentMethod}
                    onChange={e => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value as any })}
                    className="w-full bg-slate-50 text-slate-900 p-2 rounded-md border border-slate-200"
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Mobile Money">Mobile Money</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Transaction Ref / Receipt No.</label>
                <input
                  type="text"
                  value={paymentForm.transactionRef}
                  onChange={e => setPaymentForm({ ...paymentForm, transactionRef: e.target.value })}
                  className="w-full bg-slate-50 text-slate-900 p-2 rounded-md border border-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Notes / Internal Reference</label>
                <input
                  type="text"
                  value={paymentForm.notes}
                  onChange={e => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                  className="w-full bg-slate-50 text-slate-900 p-2 rounded-md border border-slate-200"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsRecordPaymentOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-md shadow-xs"
                >
                  Process & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: GENERATE INVOICE */}
      {isCreateInvoiceOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-lg p-6 text-slate-900 shadow-2xl relative">
            <button
              onClick={() => setIsCreateInvoiceOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1">Generate Tuition Fee Invoice</h3>
            <p className="text-xs text-slate-500 mb-4">Create official fee statement for student account</p>

            <form onSubmit={handleSaveInvoice} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Select Student *</label>
                <select
                  required
                  value={invoiceForm.studentId}
                  onChange={e => setInvoiceForm({ ...invoiceForm, studentId: e.target.value })}
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
                  <label className="block text-slate-700 font-semibold mb-1">Term</label>
                  <input
                    type="text"
                    value={invoiceForm.term}
                    onChange={e => setInvoiceForm({ ...invoiceForm, term: e.target.value })}
                    className="w-full bg-slate-50 text-slate-900 p-2 rounded-md border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Payment Due Date</label>
                  <input
                    type="date"
                    value={invoiceForm.dueDate}
                    onChange={e => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
                    className="w-full bg-slate-50 text-slate-900 p-2 rounded-md border border-slate-200"
                  />
                </div>
              </div>

              <div className="space-y-2 border-t border-slate-200 pt-3">
                <label className="block text-slate-700 font-semibold">Fee Line Items Breakdown ($)</label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-500">Tuition</span>
                    <input
                      type="number"
                      value={invoiceForm.tuitionFee}
                      onChange={e => setInvoiceForm({ ...invoiceForm, tuitionFee: Number(e.target.value) })}
                      className="w-full bg-slate-50 text-slate-900 p-2 rounded-md border border-slate-200"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500">Lab & Tech</span>
                    <input
                      type="number"
                      value={invoiceForm.labFee}
                      onChange={e => setInvoiceForm({ ...invoiceForm, labFee: Number(e.target.value) })}
                      className="w-full bg-slate-50 text-slate-900 p-2 rounded-md border border-slate-200"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500">Activities</span>
                    <input
                      type="number"
                      value={invoiceForm.activitiesFee}
                      onChange={e => setInvoiceForm({ ...invoiceForm, activitiesFee: Number(e.target.value) })}
                      className="w-full bg-slate-50 text-slate-900 p-2 rounded-md border border-slate-200"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCreateInvoiceOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-md shadow-xs"
                >
                  Generate Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE INVOICE MODAL */}
      {printableInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-xl w-full max-w-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto border border-slate-200 print:p-0">
            <button
              onClick={() => setPrintableInvoice(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 print:hidden"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-200 pb-4 mb-5 flex justify-between items-start">
              <div>
                <h2 className="text-lg font-bold uppercase tracking-tight text-slate-900">Oakridge International Academy</h2>
                <p className="text-xs text-slate-500">Official Tuition Fee Statement & Invoice</p>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-bold text-indigo-700">{printableInvoice.invoiceNumber}</span>
                <div className="text-[11px] text-slate-500">Date: {printableInvoice.issueDate}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-lg text-xs mb-5 border border-slate-200">
              <div>
                <p><strong>Billed To:</strong> {printableInvoice.studentName}</p>
                <p><strong>Grade Level:</strong> {printableInvoice.grade}</p>
                <p><strong>Term:</strong> {printableInvoice.term}</p>
              </div>
              <div className="text-right">
                <p><strong>Due Date:</strong> {printableInvoice.dueDate}</p>
                <p><strong>Payment Status:</strong> <span className="font-bold text-indigo-700 uppercase">{printableInvoice.status}</span></p>
              </div>
            </div>

            <table className="w-full text-left text-xs border border-slate-200 rounded-lg mb-5">
              <thead className="bg-slate-50 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Item Description</th>
                  <th className="p-2.5 text-right">Amount ($)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {printableInvoice.lineItems.map(li => (
                  <tr key={li.id}>
                    <td className="p-2.5">{li.description}</td>
                    <td className="p-2.5 text-right font-mono font-bold">${li.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                <tr>
                  <td className="p-2.5">Total Amount Billed</td>
                  <td className="p-2.5 text-right font-mono">${printableInvoice.totalAmount.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="p-2.5 text-emerald-700">Amount Paid</td>
                  <td className="p-2.5 text-right font-mono text-emerald-700">${printableInvoice.paidAmount.toLocaleString()}</td>
                </tr>
                <tr className="text-xs text-indigo-800">
                  <td className="p-2.5">Balance Remaining Due</td>
                  <td className="p-2.5 text-right font-mono">${printableInvoice.balance.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>

            <div className="flex justify-end gap-2 print:hidden">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-md flex items-center gap-2 shadow-xs transition"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRINTABLE RECEIPT MODAL */}
      {printableReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-xl w-full max-w-lg p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto border border-slate-200 print:p-0">
            <button
              onClick={() => setPrintableReceipt(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 print:hidden"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center border-b border-slate-200 pb-4 mb-5">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-base">
                ✓
              </div>
              <h2 className="text-base font-bold uppercase tracking-tight text-slate-900">Oakridge International Academy</h2>
              <p className="text-xs text-slate-500">Official Payment Receipt • {printableReceipt.receiptNumber}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg text-xs space-y-2 mb-5 border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">Student Name:</span>
                <span className="font-bold text-slate-900">{printableReceipt.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount Paid:</span>
                <span className="font-bold text-emerald-700 text-sm">${printableReceipt.amountPaid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Channel:</span>
                <span>{printableReceipt.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Transaction Reference:</span>
                <span className="font-mono">{printableReceipt.transactionRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date Received:</span>
                <span>{printableReceipt.date}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2">
                <span className="text-slate-500">Processed By:</span>
                <span className="font-medium text-slate-800">{printableReceipt.recordedByClerk}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 print:hidden">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-md flex items-center gap-2 shadow-xs transition"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
