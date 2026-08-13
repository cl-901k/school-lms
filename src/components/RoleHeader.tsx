import React, { useState, useRef, useEffect } from 'react';
import { UserRole, StaffMember } from '../types';
import { 
  Search, 
  Bell, 
  School,
  LogOut,
  Sun,
  Moon,
  CheckCheck,
  Trash2,
  X,
  AlertCircle,
  FileText,
  DollarSign,
  Calendar,
  CheckCircle2,
  Info,
  Clock,
  Download,
  Wifi,
  WifiOff
} from 'lucide-react';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'urgent' | 'report' | 'invoice' | 'document' | 'event' | 'info';
  read: boolean;
}

interface RoleHeaderProps {
  currentRole?: UserRole;
  currentUser: StaffMember | null;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onLogout: () => void;
  onRoleChange?: (role: UserRole) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  unreadNotificationsCount?: number;
  isOnline?: boolean;
  isInstallable?: boolean;
  onInstallApp?: () => void;
}

const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Urgent Teacher Report Submitted',
    message: 'Teacher David Okonjo submitted an Academic Progress report requiring Headteacher review.',
    time: '12 mins ago',
    type: 'report',
    read: false
  },
  {
    id: 'notif-2',
    title: 'Overdue Tuition Fee Alert',
    message: 'Invoice #INV-2026-003 for student Michael Chang has an overdue balance of $1,200.',
    time: '45 mins ago',
    type: 'invoice',
    read: false
  },
  {
    id: 'notif-3',
    title: 'Enrollment Document Uploaded',
    message: 'New Birth Certificate uploaded for Grade 9 student Sarah Jenkins needing verification.',
    time: '2 hours ago',
    type: 'document',
    read: false
  },
  {
    id: 'notif-4',
    title: 'Upcoming Parent-Teacher Conference',
    message: 'Term 2 Parent-Teacher Consultation scheduled for Friday, May 15 at 3:00 PM.',
    time: '1 day ago',
    type: 'event',
    read: true
  },
  {
    id: 'notif-5',
    title: 'Gradebook Portal Opened',
    message: 'Term 2 Midterm grade submission portal is now open for all faculty members.',
    time: '2 days ago',
    type: 'info',
    read: true
  }
];

export const RoleHeader: React.FC<RoleHeaderProps> = ({
  currentUser,
  theme,
  onToggleTheme,
  onLogout,
  searchTerm,
  onSearchChange,
  unreadNotificationsCount,
  isOnline = true,
  isInstallable = false,
  onInstallApp
}) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync external unreadNotificationsCount if provided
  useEffect(() => {
    if (unreadNotificationsCount !== undefined && unreadNotificationsCount > 0) {
      // Ensure we have at least that many unread reports represented
    }
  }, [unreadNotificationsCount]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    if (isNotificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationsOpen]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleToggleRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: !n.read } : n)
    );
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleDismiss = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const getNotificationIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'urgent':
      case 'report':
        return <FileText className="w-4 h-4 text-amber-500" />;
      case 'invoice':
        return <DollarSign className="w-4 h-4 text-emerald-500" />;
      case 'document':
        return <AlertCircle className="w-4 h-4 text-emerald-600" />;
      case 'event':
        return <Calendar className="w-4 h-4 text-purple-500" />;
      case 'info':
      default:
        return <Info className="w-4 h-4 text-emerald-500" />;
    }
  };

  return (
    <header className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-xs transition-colors">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-emerald-600 flex items-center justify-center text-white shadow-sm shrink-0">
            <School className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                LMS
              </h1>
              <span className="bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] px-2 py-0.5 rounded font-bold border border-emerald-100 dark:border-emerald-800">
                Term 2, 2026
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">High-Density Multi-Role School Management System</p>
          </div>
        </div>

        {/* Search, Theme Toggle, User Profile Badge & Actions */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search student, staff, invoice..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs pl-8 pr-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>

          {/* Network Status Indicator Badge */}
          <div 
            title={isOnline ? "Online & Connected to Server" : "Offline Mode Active (Data Saved Locally)"}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-[11px] font-bold border transition ${
              isOnline 
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700 animate-pulse'
            }`}
          >
            {isOnline ? (
              <>
                <Wifi className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden lg:inline">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                <span>Offline</span>
              </>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition cursor-pointer"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Dark</span>
              </>
            )}
          </button>

          {/* Notifications Dropdown Container */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              title="Notifications"
              className={`p-1.5 rounded-md text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition relative cursor-pointer ${
                isNotificationsOpen 
                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700' 
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Popover Menu */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                {/* Popover Header */}
                <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-xs font-bold text-white">System Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.2 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        title="Mark all as read"
                        className="p-1 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded flex items-center gap-1 transition cursor-pointer"
                      >
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[10px] hidden sm:inline">Read All</span>
                      </button>
                    )}
                    <button
                      onClick={() => setIsNotificationsOpen(false)}
                      className="p-1 text-slate-400 hover:text-white rounded transition cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Filter Tabs & Quick Actions */}
                <div className="px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-800 p-0.5 rounded-md">
                    <button
                      onClick={() => setFilter('all')}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold transition cursor-pointer ${
                        filter === 'all'
                          ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      All ({notifications.length})
                    </button>
                    <button
                      onClick={() => setFilter('unread')}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold transition cursor-pointer ${
                        filter === 'unread'
                          ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Unread ({unreadCount})
                    </button>
                  </div>

                  {notifications.length > 0 && (
                    <button
                      onClick={handleClearAll}
                      className="text-[10px] text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1 transition cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear All</span>
                    </button>
                  )}
                </div>

                {/* Notifications List */}
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredNotifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 dark:text-slate-500 space-y-2">
                      <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500/60" />
                      <p className="text-xs font-semibold">No {filter === 'unread' ? 'unread ' : ''}notifications</p>
                      <p className="text-[10px] text-slate-400">You are all caught up with school portal alerts.</p>
                    </div>
                  ) : (
                    filteredNotifications.map(item => (
                      <div
                        key={item.id}
                        onClick={() => handleToggleRead(item.id)}
                        className={`p-3.5 flex items-start gap-3 transition cursor-pointer relative group ${
                          !item.read
                            ? 'bg-emerald-50/50 dark:bg-emerald-950/30 hover:bg-emerald-50 dark:hover:bg-emerald-950/50'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 opacity-80'
                        }`}
                      >
                        {/* Unread Indicator Bar */}
                        {!item.read && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-600 rounded-r" />
                        )}

                        <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0 mt-0.5">
                          {getNotificationIcon(item.type)}
                        </div>

                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className={`text-xs font-bold truncate ${!item.read ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                              {item.title}
                            </h4>
                            <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1 shrink-0">
                              <Clock className="w-2.5 h-2.5" />
                              {item.time}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug line-clamp-2">
                            {item.message}
                          </p>

                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                              {!item.read ? 'Click to mark read' : 'Read'}
                            </span>

                            <button
                              type="button"
                              onClick={(e) => handleDismiss(item.id, e)}
                              className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded transition cursor-pointer"
                              title="Dismiss notification"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Popover Footer */}
                <div className="p-2.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                    Oakridge LMS Real-Time System Dispatch
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Logged in User Profile Info & Logout */}
          {currentUser && (
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md p-1 pl-2.5">
              <div className="text-right">
                <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight truncate max-w-[140px]">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center justify-end gap-1">
                  <span>{currentUser.role}</span>
                  <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500">({currentUser.staffId})</span>
                </div>
              </div>

              <button
                onClick={onLogout}
                title="Log out of staff session"
                className="flex items-center gap-1 bg-red-50 dark:bg-red-950/50 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 px-2 py-1 rounded text-xs font-bold transition ml-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

