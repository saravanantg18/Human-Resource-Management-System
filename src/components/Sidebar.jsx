import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  UserCircle2,
  CalendarCheck2,
  CalendarDays,
  CreditCard,
  BarChart3,
  Users,
  ShieldCheck,
  UserCheck,
  Zap
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const { user, loginAsRole, isAdmin } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'My Profile', icon: UserCircle2 },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck2 },
    { id: 'leave', label: 'Leave & Time-Off', icon: CalendarDays },
    { id: 'payroll', label: 'Payroll & Salary', icon: CreditCard },
    { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-[calc(100vh-65px)] flex flex-col justify-between p-4 border-r border-slate-800 shrink-0">
      
      <div className="space-y-6">
        
        {/* User Card Summary */}
        <div className="bg-slate-800/80 rounded-2xl p-3.5 border border-slate-700/60 flex items-center gap-3">
          <div className="relative">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-11 h-11 rounded-xl object-cover ring-2 ring-purple-500/40"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-slate-900"></span>
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold text-white truncate">{user?.name}</h4>
            <span className="inline-block text-[11px] text-purple-300 font-medium px-2 py-0.5 bg-purple-950/80 rounded-full border border-purple-800/50 mt-0.5">
              {user?.role === 'HR' ? 'Admin / HR' : 'Employee'}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Main Menu
          </div>

          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Role Switcher Widget for Instant Testing */}
      <div className="pt-4 border-t border-slate-800">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-3.5 border border-purple-900/40 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
            <Zap className="w-4 h-4 text-amber-400 animate-bounce" />
            <span>Quick Role Switcher</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            Switch views instantly to test both Admin & Employee features.
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => loginAsRole('HR')}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[11px] font-bold border transition-all ${
                isAdmin
                  ? 'bg-purple-600 text-white border-purple-500 shadow-md ring-2 ring-purple-400/40'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              HR Admin
            </button>

            <button
              onClick={() => loginAsRole('Employee')}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[11px] font-bold border transition-all ${
                !isAdmin
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md ring-2 ring-indigo-400/40'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              Employee
            </button>
          </div>
        </div>
      </div>

    </aside>
  );
}
