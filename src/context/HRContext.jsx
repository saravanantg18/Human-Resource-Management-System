import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_USERS,
  INITIAL_ATTENDANCE,
  INITIAL_LEAVES,
  INITIAL_PAYROLL,
  INITIAL_DOCUMENTS,
  INITIAL_NOTIFICATIONS
} from '../data/initialData';

const HRContext = createContext(null);

export const HRProvider = ({ children }) => {
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('dayflow_employees');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [attendance, setAttendance] = useState(() => {
    const saved = localStorage.getItem('dayflow_attendance');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [leaves, setLeaves] = useState(() => {
    const saved = localStorage.getItem('dayflow_leaves');
    return saved ? JSON.parse(saved) : INITIAL_LEAVES;
  });

  const [payroll, setPayroll] = useState(() => {
    const saved = localStorage.getItem('dayflow_payroll');
    return saved ? JSON.parse(saved) : INITIAL_PAYROLL;
  });

  const [documents, setDocuments] = useState(() => {
    const saved = localStorage.getItem('dayflow_documents');
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('dayflow_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Local storage persistence
  useEffect(() => {
    localStorage.setItem('dayflow_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('dayflow_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('dayflow_leaves', JSON.stringify(leaves));
  }, [leaves]);

  useEffect(() => {
    localStorage.setItem('dayflow_payroll', JSON.stringify(payroll));
  }, [payroll]);

  useEffect(() => {
    localStorage.setItem('dayflow_documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('dayflow_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Actions
  const clockIn = (employeeId) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const timeNowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Check existing record for today
    const existing = attendance.find(a => a.employeeId === employeeId && a.date === todayStr);

    if (existing) {
      setAttendance(prev => prev.map(a => {
        if (a.id === existing.id) {
          return { ...a, checkIn: timeNowStr, status: 'Present', totalHours: 'Working' };
        }
        return a;
      }));
    } else {
      const newRecord = {
        id: `ATT-${todayStr}-${employeeId}`,
        employeeId,
        date: todayStr,
        checkIn: timeNowStr,
        checkOut: null,
        totalHours: 'Working',
        status: 'Present'
      };
      setAttendance(prev => [newRecord, ...prev]);
    }

    addNotification({
      recipientId: employeeId,
      title: 'Checked In',
      message: `You clocked in at ${timeNowStr} today.`,
      type: 'info'
    });
  };

  const clockOut = (employeeId) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const timeNowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setAttendance(prev => prev.map(a => {
      if (a.employeeId === employeeId && a.date === todayStr) {
        return {
          ...a,
          checkOut: timeNowStr,
          totalHours: '8h 15m'
        };
      }
      return a;
    }));

    addNotification({
      recipientId: employeeId,
      title: 'Checked Out',
      message: `You clocked out at ${timeNowStr}. Have a great evening!`,
      type: 'success'
    });
  };

  const applyLeave = ({ employeeId, employeeName, leaveType, startDate, endDate, remarks }) => {
    // Calculate total days (inclusive)
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const newLeave = {
      id: `LR-${Math.floor(100 + Math.random() * 900)}`,
      employeeId,
      employeeName,
      leaveType,
      startDate,
      endDate,
      totalDays: isNaN(diffDays) ? 1 : diffDays,
      remarks,
      status: 'Pending',
      appliedDate: new Date().toISOString().split('T')[0],
      adminComment: ''
    };

    setLeaves(prev => [newLeave, ...prev]);

    // Notify Admins
    const admins = employees.filter(e => e.role === 'HR');
    admins.forEach(admin => {
      addNotification({
        recipientId: admin.id,
        title: 'New Leave Application',
        message: `${employeeName} requested ${newLeave.totalDays} day(s) of ${leaveType} leave.`,
        type: 'warning'
      });
    });

    addNotification({
      recipientId: employeeId,
      title: 'Leave Request Submitted',
      message: `Your ${leaveType} leave application has been submitted for review.`,
      type: 'info'
    });
  };

  const updateLeaveStatus = (leaveId, status, adminComment) => {
    let targetLeave = null;

    setLeaves(prev => prev.map(l => {
      if (l.id === leaveId) {
        targetLeave = { ...l, status, adminComment };
        return targetLeave;
      }
      return l;
    }));

    if (targetLeave) {
      addNotification({
        recipientId: targetLeave.employeeId,
        title: `Leave Request ${status}`,
        message: `Your ${targetLeave.leaveType} leave request has been ${status.toLowerCase()}.${adminComment ? ` Remark: "${adminComment}"` : ''}`,
        type: status === 'Approved' ? 'success' : 'error'
      });
    }
  };

  const updateEmployee = (employeeId, updatedData) => {
    setEmployees(prev => prev.map(emp => emp.id === employeeId ? { ...emp, ...updatedData } : emp));
  };

  const updatePayroll = (employeeId, newPayrollData) => {
    setPayroll(prev => prev.map(p => p.employeeId === employeeId ? { ...p, ...newPayrollData } : p));
  };

  const addNotification = ({ recipientId, title, message, type = 'info' }) => {
    const notif = {
      id: `NOTIF-${Date.now()}`,
      recipientId,
      title,
      message,
      timestamp: 'Just now',
      read: false,
      type
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = (recipientId) => {
    setNotifications(prev => prev.map(n => n.recipientId === recipientId ? { ...n, read: true } : n));
  };

  const addEmployee = (newEmpData) => {
    const newEmp = {
      id: newEmpData.id || `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newEmpData.name,
      email: newEmpData.email,
      password: newEmpData.password || 'Password123!',
      role: newEmpData.role || 'Employee',
      position: newEmpData.position || (newEmpData.role === 'HR' ? 'HR Specialist' : 'Software Engineer'),
      department: newEmpData.department || (newEmpData.role === 'HR' ? 'Human Resources' : 'Engineering'),
      phone: newEmpData.phone || '+1 (555) 000-1122',
      address: newEmpData.address || '100 Main Street, Innovation City',
      avatar: newEmpData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(newEmpData.name)}`,
      joinedDate: new Date().toISOString().split('T')[0],
      verified: true
    };

    setEmployees(prev => [...prev, newEmp]);

    // Initialize payroll record for new employee
    const newPay = {
      employeeId: newEmp.id,
      baseSalary: newEmp.role === 'HR' ? 11000 : 8500,
      hra: 2500,
      allowances: 1000,
      taxDeduction: 1200,
      pfDeduction: 500,
      payPeriod: 'August 2026',
      status: 'Processed'
    };
    setPayroll(prev => [...prev, newPay]);

    return newEmp;
  };

  return (
    <HRContext.Provider value={{
      employees,
      attendance,
      leaves,
      payroll,
      documents,
      notifications,
      clockIn,
      clockOut,
      applyLeave,
      updateLeaveStatus,
      updateEmployee,
      addEmployee,
      updatePayroll,
      addNotification,
      markNotificationAsRead,
      markAllNotificationsAsRead
    }}>
      {children}
    </HRContext.Provider>
  );
};

export const useHR = () => useContext(HRContext);
