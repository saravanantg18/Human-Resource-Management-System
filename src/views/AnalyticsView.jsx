import React from 'react';
import { useHR } from '../context/HRContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  Download,
  CalendarCheck2
} from 'lucide-react';

export default function AnalyticsView() {
  const { employees, leaves, payroll, attendance } = useHR();

  // 1. Attendance Trend Mock Data
  const attendanceTrendData = [
    { day: 'Mon', Present: 98, HalfDay: 2, Absent: 0 },
    { day: 'Tue', Present: 95, HalfDay: 3, Absent: 2 },
    { day: 'Wed', Present: 100, HalfDay: 0, Absent: 0 },
    { day: 'Thu', Present: 92, HalfDay: 5, Absent: 3 },
    { day: 'Fri', Present: 96, HalfDay: 2, Absent: 2 }
  ];

  // 2. Leave Category Pie Data
  const leaveCategories = [
    { name: 'Paid Annual Leave', value: leaves.filter(l => l.leaveType === 'Paid').length + 5, color: '#8B5CF6' },
    { name: 'Sick Medical Leave', value: leaves.filter(l => l.leaveType === 'Sick').length + 3, color: '#10B981' },
    { name: 'Unpaid Personal Leave', value: leaves.filter(l => l.leaveType === 'Unpaid').length + 2, color: '#F59E0B' }
  ];

  // 3. Department Payroll Distribution
  const departmentData = [
    { department: 'Engineering', count: 12, payrollCost: 114000 },
    { department: 'Design', count: 6, payrollCost: 52800 },
    { department: 'HR Management', count: 4, payrollCost: 44000 },
    { department: 'Infrastructure', count: 5, payrollCost: 51000 }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-purple-600" />
            Analytics & Reports Dashboard
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time organizational insights, attendance ratios, leave distribution, and departmental payroll overheads.
          </p>
        </div>

        <button className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2 shadow shrink-0">
          <Download className="w-4 h-4" /> Export Analytics CSV
        </button>
      </div>

      {/* Grid of Interactive Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Attendance Trends Line Chart */}
        <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Weekly Attendance Rate (%)</h3>
              <p className="text-xs text-slate-500">Daily check-in percentages across shifts</p>
            </div>
            <span className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300">
              <TrendingUp className="w-5 h-5" />
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceTrendData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} domain={[80, 100]} />
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="Present" stroke="#10B981" strokeWidth={3} dot={{ r: 5 }} />
                <Line type="monotone" dataKey="HalfDay" stroke="#F59E0B" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leave Category Distribution Pie Chart */}
        <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Leave Distribution by Type</h3>
              <p className="text-xs text-slate-500">Categorization of requested time-off</p>
            </div>
            <span className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300">
              <PieIcon className="w-5 h-5" />
            </span>
          </div>

          <div className="h-64 w-full flex items-center justify-center pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leaveCategories}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {leaveCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Payroll Breakdown Bar Chart */}
        <div className="lg:col-span-2 glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Department Headcount & Payroll Allocation</h3>
              <p className="text-xs text-slate-500">Monthly expense per division ($)</p>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="department" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="payrollCost" name="Payroll Cost ($)" fill="#714B67" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
