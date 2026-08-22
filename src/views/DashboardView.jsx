import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHR } from '../context/HRContext';
import {
  Users,
  CalendarCheck2,
  CalendarDays,
  CreditCard,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  Play,
  Square,
  User,
  ShieldCheck,
  Building2,
  FileText,
  ChevronRight,
  TrendingUp,
  Briefcase,
  UserPlus,
  X,
  Check
} from 'lucide-react';

export default function DashboardView({ setActiveTab }) {
  const { user, isAdmin } = useAuth();
  const { employees, attendance, leaves, payroll, clockIn, clockOut, updateLeaveStatus, addEmployee } = useHR();

  // Add Employee Modal State
  const [showAddEmpModal, setShowAddEmpModal] = useState(false);
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpEmail, setNewEmpEmail] = useState('');
  const [newEmpRole, setNewEmpRole] = useState('Employee');
  const [newEmpDepartment, setNewEmpDepartment] = useState('Engineering');
  const [newEmpPosition, setNewEmpPosition] = useState('');
  const [newEmpId, setNewEmpId] = useState('');
  const [addEmpSuccessMsg, setAddEmpSuccessMsg] = useState('');

  // Live Timer for clocked-in employee
  const todayStr = new Date().toISOString().split('T')[0];
  const userTodayAttendance = attendance.find(a => a.employeeId === user?.id && a.date === todayStr);
  const isClockedIn = userTodayAttendance && !userTodayAttendance.checkOut;

  const [timerSeconds, setTimerSeconds] = useState(0);

  useEffect(() => {
    let interval = null;
    if (isClockedIn) {
      interval = setInterval(() => {
        setTimerSeconds(sec => sec + 1);
      }, 1000);
    } else {
      setTimerSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isClockedIn]);

  const formatTimer = (totalSec) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Metrics for Admin Dashboard
  const totalEmployees = employees.length;
  const onDutyCount = attendance.filter(a => a.date === todayStr && a.status === 'Present').length;
  const pendingLeaves = leaves.filter(l => l.status === 'Pending');
  const totalPayrollCost = payroll.reduce((acc, p) => acc + p.baseSalary + p.hra + p.allowances, 0);

  // User's own leaves
  const myLeaves = leaves.filter(l => l.employeeId === user?.id);
  const myApprovedLeaves = myLeaves.filter(l => l.status === 'Approved').length;
  const myPendingLeaves = myLeaves.filter(l => l.status === 'Pending').length;

  const handleCreateEmployeeSubmit = (e) => {
    e.preventDefault();
    if (!newEmpName || !newEmpEmail) return;

    addEmployee({
      name: newEmpName,
      email: newEmpEmail,
      role: newEmpRole,
      department: newEmpDepartment,
      position: newEmpPosition || (newEmpRole === 'HR' ? 'HR Officer' : 'Software Associate'),
      id: newEmpId || `EMP-${Math.floor(1000 + Math.random() * 9000)}`
    });

    setAddEmpSuccessMsg(`Added new ${newEmpRole === 'HR' ? 'Admin' : 'Employee'} (${newEmpName}) successfully!`);
    setShowAddEmpModal(false);
    setNewEmpName('');
    setNewEmpEmail('');
    setNewEmpPosition('');
    setNewEmpId('');

    setTimeout(() => setAddEmpSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-700 via-purple-800 to-indigo-800 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold mb-3">
              <SparklesIcon /> Dayflow HR Overview
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Good day, {user?.name.split(' ')[0]}! 👋
            </h1>
            <p className="text-purple-200 text-xs sm:text-sm mt-1 max-w-xl">
              {isAdmin
                ? "Here is your organization's daily HR operations summary, employee attendance, and leave queue."
                : "Manage your workday, track attendance hours, review leave requests, and view salary statements."}
            </p>
          </div>

          {/* Quick Clock-In Widget on Banner */}
          {!isAdmin && (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 min-w-[240px] text-center">
              <p className="text-xs font-medium text-purple-200 mb-1">Today's Work Stopwatch</p>
              <div className="text-2xl font-mono font-bold tracking-wider mb-3">
                {isClockedIn ? formatTimer(timerSeconds) : '00:00:00'}
              </div>
              {isClockedIn ? (
                <button
                  onClick={() => clockOut(user?.id)}
                  className="w-full py-2 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Square className="w-4 h-4 fill-white" /> Clock Out
                </button>
              ) : (
                <button
                  onClick={() => clockIn(user?.id)}
                  className="w-full py-2 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-white" /> Clock In Now
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {addEmpSuccessMsg && (
        <div className="p-4 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-200 text-xs font-bold rounded-2xl flex items-center gap-2 border border-emerald-300 dark:border-emerald-800">
          <Check className="w-4 h-4" /> {addEmpSuccessMsg}
        </div>
      )}

      {/* ADMIN DASHBOARD VIEW */}
      {isAdmin ? (
        <div className="space-y-6">
          
          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Staff</span>
                <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{totalEmployees}</div>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> 100% active workforce
              </p>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">On Duty Today</span>
                <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300">
                  <CalendarCheck2 className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{onDutyCount}</div>
              <p className="text-[11px] text-slate-500 mt-1">
                Checked in for current shift
              </p>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Leaves</span>
                <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-300">
                  <CalendarDays className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{pendingLeaves.length}</div>
              <p className="text-[11px] text-amber-600 font-semibold mt-1">
                Requires HR approval action
              </p>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Monthly Payroll</span>
                <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300">
                  <CreditCard className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                ${totalPayrollCost.toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Gross monthly allocation
              </p>
            </div>

          </div>

          {/* Pending Leave Approvals Action Queue */}
          <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Pending Leave Requests
                </h3>
                <p className="text-xs text-slate-500">Review employee time-off applications</p>
              </div>
              <button
                onClick={() => setActiveTab('leave')}
                className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1"
              >
                View Leave Management <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {pendingLeaves.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">All leave applications cleared!</p>
                <p className="text-xs text-slate-400">There are currently no pending leave requests waiting for review.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold uppercase">
                    <tr>
                      <th className="p-3">Employee</th>
                      <th className="p-3">Leave Type</th>
                      <th className="p-3">Dates</th>
                      <th className="p-3">Days</th>
                      <th className="p-3">Remarks</th>
                      <th className="p-3 text-right">Quick Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {pendingLeaves.map(leave => (
                      <tr key={leave.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-3 font-bold text-slate-800 dark:text-slate-200">
                          {leave.employeeName}
                        </td>
                        <td className="p-3">
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                            {leave.leaveType}
                          </span>
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-400">
                          {leave.startDate} to {leave.endDate}
                        </td>
                        <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">
                          {leave.totalDays} day(s)
                        </td>
                        <td className="p-3 text-slate-500 max-w-xs truncate">
                          {leave.remarks}
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => updateLeaveStatus(leave.id, 'Approved', 'Approved by HR Admin')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateLeaveStatus(leave.id, 'Rejected', 'Rejected by HR Admin')}
                            className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Quick Employee Roster List & Add Employee Button */}
          <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Employee Directory Overview ({employees.length})
                </h3>
                <p className="text-xs text-slate-500">Manage, view, or recruit team members</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddEmpModal(true)}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  <UserPlus className="w-4 h-4" /> Add New Staff Member
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1 pl-2"
                >
                  View All <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {employees.map(emp => (
                <div key={emp.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center gap-3">
                  <img src={emp.avatar} alt={emp.name} className="w-11 h-11 rounded-full object-cover ring-2 ring-purple-500/20" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{emp.name}</h4>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        emp.role === 'HR' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                      }`}>
                        {emp.role}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{emp.position}</p>
                    <span className="inline-block text-[10px] font-semibold text-purple-600 dark:text-purple-400 mt-0.5">
                      {emp.department}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : (
        /* EMPLOYEE DASHBOARD VIEW */
        <div className="space-y-6">
          
          {/* Quick-Access Cards */}
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
              Quick Access Operations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div
                onClick={() => setActiveTab('profile')}
                className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-lg hover:border-purple-500/50 cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300 group-hover:scale-110 transition-transform">
                    <User className="w-6 h-6" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600" />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-base">My Profile</h4>
                <p className="text-xs text-slate-500 mt-1">View & update personal details, contract & credentials.</p>
              </div>

              <div
                onClick={() => setActiveTab('attendance')}
                className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-lg hover:border-emerald-500/50 cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 group-hover:scale-110 transition-transform">
                    <CalendarCheck2 className="w-6 h-6" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-base">Attendance Hub</h4>
                <p className="text-xs text-slate-500 mt-1">Clock in/out, view daily timeline & weekly logs.</p>
              </div>

              <div
                onClick={() => setActiveTab('leave')}
                className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-lg hover:border-amber-500/50 cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-300 group-hover:scale-110 transition-transform">
                    <CalendarDays className="w-6 h-6" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600" />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-base">Time-Off & Leave</h4>
                <p className="text-xs text-slate-500 mt-1">Apply for paid/sick leave & track approvals.</p>
              </div>

              <div
                onClick={() => setActiveTab('payroll')}
                className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-lg hover:border-indigo-500/50 cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 group-hover:scale-110 transition-transform">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-base">Salary & Payslips</h4>
                <p className="text-xs text-slate-500 mt-1">View breakdown, allowances, tax & printable slips.</p>
              </div>

            </div>
          </div>

          {/* Personal Leave Summary & Activity Log */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Leave Balance Stats */}
            <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-purple-600" /> My Leave Balances
              </h3>
              
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-purple-800 dark:text-purple-300">Paid Leave</span>
                    <p className="text-[11px] text-slate-500">18 days annual allocation</p>
                  </div>
                  <span className="text-lg font-bold text-purple-700 dark:text-purple-200">14 Remaining</span>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">Sick Leave</span>
                    <p className="text-[11px] text-slate-500">10 days medical allowance</p>
                  </div>
                  <span className="text-lg font-bold text-emerald-700 dark:text-emerald-200">8 Remaining</span>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">Pending Requests</span>
                    <p className="text-[11px] text-slate-500">Awaiting HR decision</p>
                  </div>
                  <span className="text-lg font-bold text-amber-700 dark:text-amber-200">{myPendingLeaves}</span>
                </div>
              </div>
            </div>

            {/* My Recent Leave Requests History */}
            <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  My Recent Leave Applications
                </h3>
                <button
                  onClick={() => setActiveTab('leave')}
                  className="text-xs font-bold text-purple-600 hover:text-purple-800"
                >
                  Apply for Leave +
                </button>
              </div>

              {myLeaves.length === 0 ? (
                <p className="text-xs text-slate-400 p-4 text-center">No leave applications submitted yet.</p>
              ) : (
                <div className="space-y-3">
                  {myLeaves.map(leave => (
                    <div key={leave.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white text-xs">{leave.leaveType} Leave</span>
                          <span className="text-[11px] text-slate-500">({leave.totalDays} day(s))</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {leave.startDate} to {leave.endDate}
                        </p>
                        {leave.adminComment && (
                          <p className="text-[11px] text-purple-600 dark:text-purple-400 mt-1 italic">
                            HR Note: "{leave.adminComment}"
                          </p>
                        )}
                      </div>

                      <span className={`px-3 py-1 rounded-full text-xs font-bold text-center self-start sm:self-auto ${
                        leave.status === 'Approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                        leave.status === 'Rejected' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' :
                        'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {leave.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* Admin Modal to Add New Employee or Admin */}
      {showAddEmpModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">Add New Staff Member</h3>
              <button onClick={() => setShowAddEmpModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEmployeeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Role Type</label>
                <select
                  value={newEmpRole}
                  onChange={(e) => setNewEmpRole(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none"
                >
                  <option value="Employee">Regular Employee</option>
                  <option value="HR">Admin / HR Officer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Marcus Vance"
                  value={newEmpName}
                  onChange={(e) => setNewEmpName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  placeholder="marcus@dayflow.com"
                  value={newEmpEmail}
                  onChange={(e) => setNewEmpEmail(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Department</label>
                  <select
                    value={newEmpDepartment}
                    onChange={(e) => setNewEmpDepartment(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Design">Design</option>
                    <option value="Infrastructure">Infrastructure</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Job Position</label>
                  <input
                    type="text"
                    placeholder="e.g. Lead Developer"
                    value={newEmpPosition}
                    onChange={(e) => setNewEmpPosition(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Employee ID (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. EMP-1010"
                  value={newEmpId}
                  onChange={(e) => setNewEmpId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddEmpModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-lg"
                >
                  Add Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

function SparklesIcon() {
  return (
    <svg className="w-3.5 h-3.5 fill-current text-amber-300" viewBox="0 0 24 24">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
    </svg>
  );
}
