import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHR } from '../context/HRContext';
import {
  CalendarDays,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquare,
  Filter,
  Check,
  X,
  AlertCircle,
  Sparkles,
  Calendar
} from 'lucide-react';

export default function LeaveView() {
  const { user, isAdmin } = useAuth();
  const { leaves, applyLeave, updateLeaveStatus } = useHR();

  // Apply Leave Modal State
  const [showModal, setShowModal] = useState(false);
  const [leaveType, setLeaveType] = useState('Paid');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [remarks, setRemarks] = useState('');
  const [formError, setFormError] = useState('');

  // Admin Approval Modal State
  const [approvalTarget, setApprovalTarget] = useState(null);
  const [adminComment, setAdminComment] = useState('');

  // Admin Filter state
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Employee's leaves or all leaves
  let displayLeaves = isAdmin ? leaves : leaves.filter(l => l.employeeId === user?.id);
  if (statusFilter !== 'ALL') {
    displayLeaves = displayLeaves.filter(l => l.status === statusFilter);
  }

  const handleApplySubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!startDate || !endDate) {
      setFormError('Please select both start and end dates.');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setFormError('End date cannot be earlier than start date.');
      return;
    }

    applyLeave({
      employeeId: user.id,
      employeeName: user.name,
      leaveType,
      startDate,
      endDate,
      remarks: remarks || 'No additional remarks provided.'
    });

    setShowModal(false);
    setStartDate('');
    setEndDate('');
    setRemarks('');
  };

  const handleAction = (status) => {
    if (approvalTarget) {
      updateLeaveStatus(approvalTarget.id, status, adminComment);
      setApprovalTarget(null);
      setAdminComment('');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-purple-600" />
            Leave & Time-Off Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isAdmin
              ? "Review employee time-off requests, provide feedback comments, and manage company leave balances."
              : "Submit leave applications, track approval progress, and view your remaining balance."}
          </p>
        </div>

        {/* Apply Leave Button (Employee) */}
        {!isAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all transform hover:scale-105 shrink-0"
          >
            <Plus className="w-4 h-4" /> Apply for Leave
          </button>
        )}
      </div>

      {/* Filter Tabs for Admin */}
      <div className="flex items-center justify-between flex-wrap gap-4 glass-card p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl gap-1">
          {['ALL', 'Pending', 'Approved', 'Rejected'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                statusFilter === st
                  ? 'bg-white dark:bg-slate-900 text-purple-600 shadow'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="text-xs font-bold text-slate-500">
          Showing <span className="text-purple-600">{displayLeaves.length}</span> record(s)
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold uppercase tracking-wider">
            <tr>
              <th className="p-3.5">Application ID</th>
              <th className="p-3.5">Employee</th>
              <th className="p-3.5">Leave Category</th>
              <th className="p-3.5">Duration</th>
              <th className="p-3.5">Days</th>
              <th className="p-3.5">Remarks / Reason</th>
              <th className="p-3.5">Status</th>
              {isAdmin && <th className="p-3.5 text-right">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {displayLeaves.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 8 : 7} className="p-8 text-center text-slate-400">
                  No leave requests found for current selection.
                </td>
              </tr>
            ) : (
              displayLeaves.map(leave => (
                <tr key={leave.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-3.5 font-mono text-purple-600 dark:text-purple-400 font-bold">
                    {leave.id}
                  </td>
                  <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100">
                    {leave.employeeName}
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      leave.leaveType === 'Paid' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' :
                      leave.leaveType === 'Sick' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                      'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {leave.leaveType}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-400 font-medium">
                    {leave.startDate} to {leave.endDate}
                  </td>
                  <td className="p-3.5 font-bold text-slate-800 dark:text-slate-200">
                    {leave.totalDays} day(s)
                  </td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                    {leave.remarks}
                    {leave.adminComment && (
                      <span className="block text-[11px] text-purple-600 dark:text-purple-400 italic mt-0.5">
                        Admin comment: "{leave.adminComment}"
                      </span>
                    )}
                  </td>
                  <td className="p-3.5">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                      leave.status === 'Approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                      leave.status === 'Rejected' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' :
                      'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 animate-pulse'
                    }`}>
                      {leave.status === 'Approved' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {leave.status === 'Rejected' && <XCircle className="w-3.5 h-3.5" />}
                      {leave.status === 'Pending' && <Clock className="w-3.5 h-3.5" />}
                      {leave.status}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="p-3.5 text-right">
                      {leave.status === 'Pending' ? (
                        <button
                          onClick={() => {
                            setApprovalTarget(leave);
                            setAdminComment('');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow"
                        >
                          Review Request
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Decided</span>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Employee Apply Leave Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">Apply for Leave</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-100 text-rose-800 text-xs font-bold rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {formError}
              </div>
            )}

            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Leave Type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none"
                >
                  <option value="Paid">Paid Leave (Annual)</option>
                  <option value="Sick">Sick Leave</option>
                  <option value="Unpaid">Unpaid Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Remarks / Justification</label>
                <textarea
                  rows={3}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Provide reason or context for your leave request..."
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-lg"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Approval Review Modal */}
      {approvalTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">Review Leave Application</h3>
              <button onClick={() => setApprovalTarget(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-950/40 rounded-2xl space-y-1.5 text-xs">
              <p><strong className="text-slate-900 dark:text-white">Applicant:</strong> {approvalTarget.employeeName}</p>
              <p><strong className="text-slate-900 dark:text-white">Leave Type:</strong> {approvalTarget.leaveType}</p>
              <p><strong className="text-slate-900 dark:text-white">Duration:</strong> {approvalTarget.startDate} to {approvalTarget.endDate} ({approvalTarget.totalDays} day(s))</p>
              <p><strong className="text-slate-900 dark:text-white">Reason:</strong> "{approvalTarget.remarks}"</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">HR Manager Comment (Optional)</label>
              <textarea
                rows={3}
                value={adminComment}
                onChange={(e) => setAdminComment(e.target.value)}
                placeholder="e.g. Approved. Enjoy your time off! / Rejected due to sprint release deadlines."
                className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => handleAction('Rejected')}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg"
              >
                Reject Request
              </button>
              <button
                onClick={() => handleAction('Approved')}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg"
              >
                Approve Request
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
