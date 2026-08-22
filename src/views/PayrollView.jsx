import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHR } from '../context/HRContext';
import {
  CreditCard,
  Printer,
  Download,
  DollarSign,
  ShieldCheck,
  Building2,
  CheckCircle2,
  FileSpreadsheet,
  Edit3,
  Check,
  X
} from 'lucide-react';

export default function PayrollView() {
  const { user, isAdmin } = useAuth();
  const { employees, payroll, updatePayroll } = useHR();

  const [selectedEmpId, setSelectedEmpId] = useState(user?.id);
  const currentEmp = employees.find(e => e.id === selectedEmpId) || user;
  const currentPay = payroll.find(p => p.employeeId === currentEmp.id) || {
    baseSalary: 9500,
    hra: 2800,
    allowances: 1200,
    taxDeduction: 1400,
    pfDeduction: 600,
    payPeriod: 'August 2026',
    status: 'Processed'
  };

  // Admin Payroll Edit State
  const [editingEmpId, setEditingEmpId] = useState(null);
  const [editFields, setEditFields] = useState({
    baseSalary: 0,
    hra: 0,
    allowances: 0,
    taxDeduction: 0,
    pfDeduction: 0
  });

  const grossSalary = currentPay.baseSalary + currentPay.hra + currentPay.allowances;
  const totalDeductions = currentPay.taxDeduction + currentPay.pfDeduction;
  const netSalary = grossSalary - totalDeductions;

  const startEdit = (payRecord) => {
    setEditingEmpId(payRecord.employeeId);
    setEditFields({
      baseSalary: payRecord.baseSalary,
      hra: payRecord.hra,
      allowances: payRecord.allowances,
      taxDeduction: payRecord.taxDeduction,
      pfDeduction: payRecord.pfDeduction
    });
  };

  const saveEdit = (empId) => {
    updatePayroll(empId, {
      baseSalary: Number(editFields.baseSalary),
      hra: Number(editFields.hra),
      allowances: Number(editFields.allowances),
      taxDeduction: Number(editFields.taxDeduction),
      pfDeduction: Number(editFields.pfDeduction)
    });
    setEditingEmpId(null);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-purple-600" />
            Payroll & Salary Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isAdmin
              ? "Admin Control: View & update salary structures, statutory tax deductions, and company payroll totals."
              : "Read-only access to your official monthly salary statements and downloadable payslips."}
          </p>
        </div>

        {/* Print / Download Button */}
        {!isAdmin && (
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2 shadow shrink-0"
          >
            <Printer className="w-4 h-4" /> Print Salary Slip
          </button>
        )}
      </div>

      {/* ADMIN PAYROLL CONTROL TABLE */}
      {isAdmin ? (
        <div className="space-y-6">
          <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 overflow-x-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Company Payroll Registry ({payroll.length} Employees)
              </h3>
            </div>

            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Employee</th>
                  <th className="p-3.5">Base Salary</th>
                  <th className="p-3.5">HRA & Allowances</th>
                  <th className="p-3.5">Gross Pay</th>
                  <th className="p-3.5">Tax & Deductions</th>
                  <th className="p-3.5">Net Pay</th>
                  <th className="p-3.5 text-right">Payroll Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {employees.map(emp => {
                  const pay = payroll.find(p => p.employeeId === emp.id) || {
                    baseSalary: 8000,
                    hra: 2000,
                    allowances: 1000,
                    taxDeduction: 1000,
                    pfDeduction: 500
                  };
                  const isEditingThis = editingEmpId === emp.id;
                  const gPay = pay.baseSalary + pay.hra + pay.allowances;
                  const dPay = pay.taxDeduction + pay.pfDeduction;
                  const nPay = gPay - dPay;

                  return (
                    <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <img src={emp.avatar} alt={emp.name} className="w-7 h-7 rounded-full object-cover" />
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white">{emp.name}</span>
                            <span className="block text-[10px] text-slate-400">{emp.id} • {emp.position}</span>
                          </div>
                        </div>
                      </td>

                      {isEditingThis ? (
                        <>
                          <td className="p-3.5">
                            <input
                              type="number"
                              value={editFields.baseSalary}
                              onChange={(e) => setEditFields({ ...editFields, baseSalary: e.target.value })}
                              className="w-24 px-2 py-1 bg-white dark:bg-slate-900 border rounded text-xs font-mono font-bold"
                            />
                          </td>
                          <td className="p-3.5">
                            <input
                              type="number"
                              value={editFields.hra}
                              onChange={(e) => setEditFields({ ...editFields, hra: e.target.value })}
                              className="w-20 px-2 py-1 bg-white dark:bg-slate-900 border rounded text-xs font-mono font-bold"
                            />
                          </td>
                          <td className="p-3.5 font-bold font-mono">
                            ${(Number(editFields.baseSalary) + Number(editFields.hra) + Number(editFields.allowances)).toLocaleString()}
                          </td>
                          <td className="p-3.5">
                            <input
                              type="number"
                              value={editFields.taxDeduction}
                              onChange={(e) => setEditFields({ ...editFields, taxDeduction: e.target.value })}
                              className="w-20 px-2 py-1 bg-white dark:bg-slate-900 border rounded text-xs font-mono font-bold"
                            />
                          </td>
                          <td className="p-3.5 font-bold font-mono text-emerald-600">
                            ${((Number(editFields.baseSalary) + Number(editFields.hra) + Number(editFields.allowances)) - (Number(editFields.taxDeduction) + Number(editFields.pfDeduction))).toLocaleString()}
                          </td>
                          <td className="p-3.5 text-right space-x-1">
                            <button
                              onClick={() => saveEdit(emp.id)}
                              className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingEmpId(null)}
                              className="p-1.5 rounded-lg bg-slate-300 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="p-3.5 font-mono font-semibold text-slate-800 dark:text-slate-200">
                            ${pay.baseSalary.toLocaleString()}
                          </td>
                          <td className="p-3.5 font-mono text-slate-600 dark:text-slate-400">
                            ${(pay.hra + pay.allowances).toLocaleString()}
                          </td>
                          <td className="p-3.5 font-mono font-bold text-purple-600 dark:text-purple-400">
                            ${gPay.toLocaleString()}
                          </td>
                          <td className="p-3.5 font-mono text-rose-600 dark:text-rose-400">
                            -${dPay.toLocaleString()}
                          </td>
                          <td className="p-3.5 font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                            ${nPay.toLocaleString()}
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => startEdit(pay)}
                              className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1 ml-auto"
                            >
                              <Edit3 className="w-3.5 h-3.5" /> Adjust Salary
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* EMPLOYEE PAYSLIP CARD VIEW */
        <div className="max-w-3xl mx-auto glass-card rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
          
          {/* Dayflow Payslip Header */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-600 flex items-center justify-center text-white font-black text-2xl">
                D
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Dayflow HRMS</h1>
                <p className="text-xs text-slate-500">Official Payslip Statement • {currentPay.payPeriod}</p>
              </div>
            </div>

            <div className="text-right">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                Status: {currentPay.status}
              </span>
              <p className="text-[11px] text-slate-400 mt-1 font-mono">ID: {currentEmp.id}</p>
            </div>
          </div>

          {/* Employee Metadata */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
            <div>
              <span className="text-slate-400 font-medium block">Employee Name</span>
              <strong className="text-slate-800 dark:text-slate-100 font-bold">{currentEmp.name}</strong>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Designation</span>
              <strong className="text-slate-800 dark:text-slate-100 font-bold">{currentEmp.position}</strong>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Department</span>
              <strong className="text-slate-800 dark:text-slate-100 font-bold">{currentEmp.department}</strong>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Pay Date</span>
              <strong className="text-slate-800 dark:text-slate-100 font-bold">Aug 31, 2026</strong>
            </div>
          </div>

          {/* Earnings vs Deductions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Earnings Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider border-b border-purple-200 dark:border-purple-800 pb-2">
                Earnings Component
              </h3>
              <div className="flex justify-between text-xs py-1">
                <span className="text-slate-600 dark:text-slate-400">Basic Salary</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">${currentPay.baseSalary.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs py-1">
                <span className="text-slate-600 dark:text-slate-400">House Rent Allowance (HRA)</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">${currentPay.hra.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs py-1">
                <span className="text-slate-600 dark:text-slate-400">Special Allowances</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">${currentPay.allowances.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs font-extrabold pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-slate-800 dark:text-slate-200">Gross Earnings</span>
                <span className="font-mono text-purple-600 dark:text-purple-400">${grossSalary.toLocaleString()}</span>
              </div>
            </div>

            {/* Deductions Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-rose-700 dark:text-rose-300 uppercase tracking-wider border-b border-rose-200 dark:border-rose-800 pb-2">
                Deductions Component
              </h3>
              <div className="flex justify-between text-xs py-1">
                <span className="text-slate-600 dark:text-slate-400">Income Tax Deduction</span>
                <span className="font-mono font-bold text-rose-600">-${currentPay.taxDeduction.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs py-1">
                <span className="text-slate-600 dark:text-slate-400">Provident Fund (PF)</span>
                <span className="font-mono font-bold text-rose-600">-${currentPay.pfDeduction.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs font-extrabold pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-slate-800 dark:text-slate-200">Total Deductions</span>
                <span className="font-mono text-rose-600">-${totalDeductions.toLocaleString()}</span>
              </div>
            </div>

          </div>

          {/* Net Payable Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-700 text-white flex items-center justify-between shadow-xl">
            <div>
              <span className="text-xs font-semibold text-purple-200 uppercase">Net Salary Payable</span>
              <p className="text-3xl font-extrabold font-mono tracking-tight mt-0.5">${netSalary.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-purple-200 block">Bank Account Transfer</span>
              <strong className="text-xs font-mono">Direct Deposit Verified ✓</strong>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
