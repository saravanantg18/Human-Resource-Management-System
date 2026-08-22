import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHR } from '../context/HRContext';
import {
  User,
  Briefcase,
  DollarSign,
  FileText,
  ShieldCheck,
  Edit3,
  Check,
  X,
  Phone,
  MapPin,
  Mail,
  Calendar,
  Building,
  Upload,
  Lock,
  BadgeCheck,
  FileCheck2,
  ChevronRight
} from 'lucide-react';

export default function ProfileView() {
  const { user, isAdmin, updateUserProfile } = useAuth();
  const { employees, updateEmployee, documents } = useHR();

  // Selected employee to view/edit (Admin can switch target employee)
  const [selectedEmpId, setSelectedEmpId] = useState(user?.id);
  const currentEmp = employees.find(e => e.id === selectedEmpId) || user;

  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [editSuccessMsg, setEditSuccessMsg] = useState('');

  // Editable state
  const [formData, setFormData] = useState({
    name: currentEmp.name || '',
    phone: currentEmp.phone || '',
    address: currentEmp.address || '',
    avatar: currentEmp.avatar || '',
    position: currentEmp.position || '',
    department: currentEmp.department || '',
    role: currentEmp.role || 'Employee'
  });

  const handleSelectEmployee = (id) => {
    setSelectedEmpId(id);
    const target = employees.find(e => e.id === id);
    if (target) {
      setFormData({
        name: target.name,
        phone: target.phone,
        address: target.address,
        avatar: target.avatar,
        position: target.position,
        department: target.department,
        role: target.role
      });
    }
    setIsEditing(false);
    setEditSuccessMsg('');
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    // Employee can edit limited fields (address, phone, avatar)
    // Admin can edit all fields
    const updated = isAdmin ? {
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      avatar: formData.avatar,
      position: formData.position,
      department: formData.department,
      role: formData.role
    } : {
      phone: formData.phone,
      address: formData.address,
      avatar: formData.avatar
    };

    updateEmployee(currentEmp.id, updated);
    if (currentEmp.id === user.id) {
      updateUserProfile(updated);
    }

    setIsEditing(false);
    setEditSuccessMsg('Profile updated successfully!');
    setTimeout(() => setEditSuccessMsg(''), 4000);
  };

  const empDocs = documents.filter(d => d.employeeId === currentEmp.id);

  return (
    <div className="space-y-6">
      
      {/* Header & Admin Employee Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={currentEmp.avatar}
              alt={currentEmp.name}
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-purple-500/20 shadow-md"
            />
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{currentEmp.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                {currentEmp.id}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">{currentEmp.position} • {currentEmp.department}</p>
          </div>
        </div>

        {/* Admin Employee Switcher Selector */}
        {isAdmin && (
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-2 rounded-2xl border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-semibold text-slate-500 pl-2">View Employee:</span>
            <select
              value={selectedEmpId}
              onChange={(e) => handleSelectEmployee(e.target.value)}
              className="bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 outline-none"
            >
              {employees.map(e => (
                <option key={e.id} value={e.id}>
                  {e.name} ({e.role})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {editSuccessMsg && (
        <div className="p-4 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-200 text-xs font-bold rounded-2xl flex items-center gap-2 border border-emerald-300 dark:border-emerald-800">
          <Check className="w-4 h-4" /> {editSuccessMsg}
        </div>
      )}

      {/* Tabs */}
      <div className="flex bg-slate-200/60 dark:bg-slate-800/60 p-1.5 rounded-2xl gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('personal')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'personal' ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <User className="w-4 h-4" /> Personal Details
        </button>
        <button
          onClick={() => setActiveTab('job')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'job' ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Briefcase className="w-4 h-4" /> Job Info
        </button>
        <button
          onClick={() => setActiveTab('salary')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'salary' ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <DollarSign className="w-4 h-4" /> Salary Structure
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'documents' ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <FileText className="w-4 h-4" /> Documents ({empDocs.length})
        </button>
      </div>

      {/* Tab Content Cards */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800">
        
        {/* PERSONAL DETAILS TAB */}
        {activeTab === 'personal' && (
          <form onSubmit={handleSave} className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Personal Information</h3>
                <p className="text-xs text-slate-500">
                  {isAdmin
                    ? "As HR Admin, you have full edit permission for all fields."
                    : "Employees can edit address, phone, and profile picture avatar URL."}
                </p>
              </div>

              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  <Edit3 className="w-4 h-4" /> Edit Details
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                  >
                    <Check className="w-4 h-4" /> Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5"
                  >
                    <X className="w-4 h-4" /> Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Full Name {isAdmin && <span className="text-purple-600">(Admin Editable)</span>}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    disabled={!isEditing || !isAdmin}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 disabled:opacity-75 outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Work Email (Read Only)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    disabled
                    value={currentEmp.email}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-500 cursor-not-allowed outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Phone Number (Editable)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 disabled:opacity-75 outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Avatar Image URL (Editable)
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 disabled:opacity-75 outline-none focus:border-purple-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Residential Address (Editable)
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <textarea
                    disabled={!isEditing}
                    rows={3}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 disabled:opacity-75 outline-none focus:border-purple-500"
                  />
                </div>
              </div>

            </div>
          </form>
        )}

        {/* JOB DETAILS TAB */}
        {activeTab === 'job' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Job & Employment Details</h3>
              <p className="text-xs text-slate-500">Official company record and organizational placement.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Employee ID</span>
                <p className="text-sm font-extrabold text-purple-600 dark:text-purple-400 mt-1">{currentEmp.id}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Job Title</span>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">{currentEmp.position}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Department</span>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">{currentEmp.department}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Joining Date</span>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">{currentEmp.joinedDate}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Employment Status</span>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 mt-1">
                  Full-Time Permanent
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] font-bold text-slate-400 uppercase">System Authorization</span>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">{currentEmp.role}</p>
              </div>

            </div>
          </div>
        )}

        {/* SALARY STRUCTURE TAB */}
        {activeTab === 'salary' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Compensation & Benefits</h3>
              <p className="text-xs text-slate-500">
                {isAdmin ? "Admin view: Salary adjustments reflect in payroll control." : "Read-only summary of your fixed monthly earnings and deductions."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div className="p-5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60">
                <span className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase">Base Monthly Salary</span>
                <div className="text-3xl font-extrabold text-purple-900 dark:text-purple-100 mt-2">$9,500.00</div>
                <p className="text-[11px] text-purple-600 dark:text-purple-300 mt-1">Subject to standard payroll taxation</p>
              </div>

              <div className="p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60">
                <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase">Total Allowances</span>
                <div className="text-3xl font-extrabold text-indigo-900 dark:text-indigo-100 mt-2">$4,000.00</div>
                <p className="text-[11px] text-indigo-600 dark:text-indigo-300 mt-1">Includes HRA & Special Medical Benefit</p>
              </div>

            </div>
          </div>
        )}

        {/* DOCUMENTS TAB */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Uploaded Documents Repository</h3>
                <p className="text-xs text-slate-500">Official employment agreements, IDs, and tax documents.</p>
              </div>
              <button className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow">
                <Upload className="w-4 h-4" /> Upload Document
              </button>
            </div>

            {empDocs.length === 0 ? (
              <p className="text-xs text-slate-400 text-center p-6">No documents currently uploaded.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {empDocs.map(doc => (
                  <div key={doc.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-300">
                        <FileCheck2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{doc.title}</h4>
                        <p className="text-[10px] text-slate-500">{doc.category} • {doc.size} • {doc.date}</p>
                      </div>
                    </div>
                    <button className="text-xs font-bold text-purple-600 hover:text-purple-800">
                      Download
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
