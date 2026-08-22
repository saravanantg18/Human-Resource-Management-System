import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHR } from '../context/HRContext';
import {
  CalendarCheck2,
  Clock,
  Play,
  Square,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Calendar,
  Search,
  Filter,
  UserCheck
} from 'lucide-react';

export default function AttendanceView() {
  const { user, isAdmin } = useAuth();
  const { employees, attendance, clockIn, clockOut } = useHR();

  const [selectedFilterEmpId, setSelectedFilterEmpId] = useState('ALL');
  const [viewMode, setViewMode] = useState('daily'); // 'daily' vs 'weekly'

  const todayStr = new Date().toISOString().split('T')[0];

  // User's clock-in status for today
  const myTodayRecord = attendance.find(a => a.employeeId === user?.id && a.date === todayStr);
  const isClockedIn = myTodayRecord && !myTodayRecord.checkOut;

  // Filtered attendance list
  let displayAttendance = attendance;
  if (!isAdmin) {
    displayAttendance = attendance.filter(a => a.employeeId === user?.id);
  } else if (selectedFilterEmpId !== 'ALL') {
    displayAttendance = attendance.filter(a => a.employeeId === selectedFilterEmpId);
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Present':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" /> Present
          </span>
        );
      case 'Half-day':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
            <AlertTriangle className="w-3.5 h-3.5" /> Half-day
          </span>
        );
      case 'Absent':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
            <XCircle className="w-3.5 h-3.5" /> Absent
          </span>
        );
      case 'Leave':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
            <Calendar className="w-3.5 h-3.5" /> Leave
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Attendance Check-in Action Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Daily Attendance Terminal
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Today is <strong className="text-purple-600 dark:text-purple-400">{todayStr}</strong>. Click below to register shift start or end times.
          </p>

          <div className="flex items-center gap-4 mt-4">
            <div className="text-xs">
              <span className="text-slate-400 block font-medium">Check In:</span>
              <strong className="text-slate-800 dark:text-slate-200 text-sm font-mono">
                {myTodayRecord?.checkIn || '--:--'}
              </strong>
            </div>
            <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-700"></div>
            <div className="text-xs">
              <span className="text-slate-400 block font-medium">Check Out:</span>
              <strong className="text-slate-800 dark:text-slate-200 text-sm font-mono">
                {myTodayRecord?.checkOut || '--:--'}
              </strong>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div>
          {isClockedIn ? (
            <button
              onClick={() => clockOut(user?.id)}
              className="px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-lg shadow-rose-600/30 flex items-center gap-2 transition-all transform hover:scale-105"
            >
              <Square className="w-4 h-4 fill-white" /> Clock Out for the Day
            </button>
          ) : (
            <button
              onClick={() => clockIn(user?.id)}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all transform hover:scale-105"
            >
              <Play className="w-4 h-4 fill-white" /> Check In Now
            </button>
          )}
        </div>
      </div>

      {/* Controls Bar: Views & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-card p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        
        {/* Daily / Weekly View Switcher */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('daily')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'daily' ? 'bg-white dark:bg-slate-900 text-purple-600 shadow' : 'text-slate-500'
            }`}
          >
            Daily History Log
          </button>
          <button
            onClick={() => setViewMode('weekly')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'weekly' ? 'bg-white dark:bg-slate-900 text-purple-600 shadow' : 'text-slate-500'
            }`}
          >
            Weekly Grid View
          </button>
        </div>

        {/* Admin Filter by Employee */}
        {isAdmin ? (
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedFilterEmpId}
              onChange={(e) => setSelectedFilterEmpId(e.target.value)}
              className="bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 outline-none"
            >
              <option value="ALL">All Employees ({employees.length})</option>
              {employees.map(e => (
                <option key={e.id} value={e.id}>{e.name} ({e.id})</option>
              ))}
            </select>
          </div>
        ) : (
          <div className="text-xs font-bold text-slate-500">
            Showing records for <span className="text-purple-600">{user?.name}</span>
          </div>
        )}

      </div>

      {/* Daily History Table View */}
      {viewMode === 'daily' ? (
        <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Employee Name</th>
                <th className="p-3.5">Check In</th>
                <th className="p-3.5">Check Out</th>
                <th className="p-3.5">Working Duration</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {displayAttendance.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No attendance records found for selected filter.
                  </td>
                </tr>
              ) : (
                displayAttendance.map(record => {
                  const emp = employees.find(e => e.id === record.employeeId);
                  return (
                    <tr key={record.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-3.5 font-bold text-slate-800 dark:text-slate-200 font-mono">
                        {record.date}
                      </td>
                      <td className="p-3.5 font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        {emp?.avatar && (
                          <img src={emp.avatar} alt={emp.name} className="w-6 h-6 rounded-full object-cover" />
                        )}
                        {emp?.name || record.employeeId}
                      </td>
                      <td className="p-3.5 font-mono text-slate-600 dark:text-slate-400">
                        {record.checkIn || '--:--'}
                      </td>
                      <td className="p-3.5 font-mono text-slate-600 dark:text-slate-400">
                        {record.checkOut || '--:--'}
                      </td>
                      <td className="p-3.5 font-semibold text-purple-600 dark:text-purple-400">
                        {record.totalHours}
                      </td>
                      <td className="p-3.5">
                        {getStatusBadge(record.status)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* Weekly Grid Summary View */
        <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            Weekly Attendance Grid
          </h3>
          <div className="grid grid-cols-5 gap-3">
            {['Mon (Aug 18)', 'Tue (Aug 19)', 'Wed (Aug 20)', 'Thu (Aug 21)', 'Fri (Aug 22)'].map((day, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center space-y-2">
                <span className="text-xs font-bold text-slate-500">{day}</span>
                <div className="pt-2">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    Present (8h)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
