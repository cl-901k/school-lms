import React, { useState } from 'react';
import { StaffMember } from '../types';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  Key, 
  ArrowRight, 
  Sparkles, 
  AlertCircle, 
  GraduationCap, 
  CheckCircle2,
  Users,
  Building2,
  HelpCircle,
  Sun,
  Moon
} from 'lucide-react';

interface LoginViewProps {
  staffList: StaffMember[];
  onLoginSuccess: (staff: StaffMember) => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  staffList,
  onLoginSuccess,
  theme = 'dark',
  onToggleTheme
}) => {
  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const activeStaff = staffList.filter(s => s.status === 'Active');

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const term = loginInput.trim().toLowerCase();
    const pass = passwordInput.trim();

    if (!term || !pass) {
      setErrorMsg('Please enter both your Email / Staff ID and Password.');
      return;
    }

    const found = staffList.find(s => 
      (s.email.toLowerCase() === term || s.staffId.toLowerCase() === term) &&
      (s.password || 'password123') === pass
    );

    if (!found) {
      setErrorMsg('Invalid login credentials. Please check your Email / Staff ID and Password.');
      return;
    }

    if (found.status !== 'Active') {
      setErrorMsg(`Account status is currently "${found.status}". Please contact Headteacher Dr. Kingsley.`);
      return;
    }

    onLoginSuccess(found);
  };

  const getRoleBadgeColor = (role: StaffMember['role']) => {
    switch (role) {
      case 'Headteacher':
        return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/80 dark:text-purple-300 dark:border-purple-800';
      case 'Teacher':
      case 'Vice Principal':
      case 'Department Head':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800';
      case 'Secretary':
        return 'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-950/80 dark:text-teal-300 dark:border-teal-800';
      case 'Accounts Clerk':
        return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    }
  };

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen flex flex-col justify-between selection:bg-emerald-600 selection:text-white p-4 sm:p-6 md:p-8 font-sans transition-colors duration-200 ${
      isDark ? 'bg-black text-slate-100' : 'bg-white text-slate-900'
    }`}>
      {/* Background Subtle Grid Pattern */}
      <div className={`fixed inset-0 bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-40 ${
        isDark 
          ? 'bg-[linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]'
          : 'bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)]'
      }`} />

      {/* Main Content Container */}
      <div className="relative z-10 max-w-6xl w-full mx-auto my-auto space-y-8">
        
        {/* Top Header */}
        <div className="text-center space-y-3 relative">
          {onToggleTheme && (
            <div className="absolute right-0 top-0">
              <button
                onClick={onToggleTheme}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-800 text-xs font-semibold transition cursor-pointer shadow-xs"
              >
                {isDark ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </div>
          )}

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>LMS - School Portal</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Staff Role Authentication Portal
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl mx-auto">
            Secure multi-role portal for Headteachers, Teachers, Secretaries, and Accounts Clerks.
          </p>
        </div>

        {/* Core Layout: Form & Staff Directory */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Column 1: Login Form (5 cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl dark:shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  Staff Member Login
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Enter your official credentials to access dashboard</p>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3.5 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/80 text-red-800 dark:text-red-200 rounded-xl text-xs flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Authentication Error:</span>
                  <p className="mt-0.5 text-red-700 dark:text-red-300">{errorMsg}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleFormLogin} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5 flex items-center justify-between">
                  <span>Email or Staff ID</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">e.g. s.jenkins@oakridge.edu</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Email Address or Staff EMP ID"
                    value={loginInput}
                    onChange={e => setLoginInput(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-800 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-xs transition placeholder-slate-400 dark:placeholder-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5 flex items-center justify-between">
                  <span>Account Password</span>
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="Enter account password"
                    value={passwordInput}
                    onChange={e => setPasswordInput(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-800 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-xs font-mono transition placeholder-slate-400 dark:placeholder-slate-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2 text-xs cursor-pointer active:scale-95"
              >
                <span>Log In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Security Notice */}
            <div className="bg-slate-50 dark:bg-slate-950/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Headteacher Role Governance</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Staff accounts are provisioned exclusively by the Headteacher (Dr. Arthur Kingsley). Contact administration for credential resets.
              </p>
            </div>
          </div>

          {/* Column 2: Headteacher Provisioned Staff Accounts Quick Select (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl dark:shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    Authorized Staff Accounts ({activeStaff.length})
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Accounts provisioned by Headteacher Dr. Kingsley. Click any card to select its Email or Staff ID.
                  </p>
                </div>

                <span className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[11px] px-2.5 py-1 rounded-md font-semibold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  Headteacher Provisioned
                </span>
              </div>

              {/* Staff Cards List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1">
                {activeStaff.map((staff) => (
                  <div
                    key={staff.id}
                    onClick={() => {
                      setLoginInput(staff.email);
                      setErrorMsg(null);
                    }}
                    className="p-3.5 bg-slate-50 hover:bg-slate-100/80 dark:bg-slate-950/80 dark:hover:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/60 dark:hover:border-emerald-500/50 rounded-xl space-y-2.5 transition group cursor-pointer shadow-xs"
                    title="Click to fill Email or Staff ID into login form"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">{staff.staffId}</span>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{staff.name}</h4>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{staff.email}</div>
                      </div>

                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold border shrink-0 ${getRoleBadgeColor(staff.role)}`}>
                        {staff.role}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] bg-white dark:bg-black/60 p-2 rounded-lg border border-slate-200 dark:border-slate-800/80 text-slate-500 dark:text-slate-400">
                      <span>Department</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{staff.department}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-center text-slate-400 dark:text-slate-500 text-[11px]">
                💡 <em>When the Headteacher adds new staff members in their portal, they immediately appear here with login capabilities.</em>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Footer */}
      <div className="relative z-10 text-center text-xs text-slate-400 dark:text-slate-500 pt-8 border-t border-slate-200 dark:border-slate-800 mt-8">
        LMS • Learning Management &amp; Administrative System
      </div>
    </div>
  );
};
