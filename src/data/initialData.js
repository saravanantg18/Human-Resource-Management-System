export const INITIAL_USERS = [
  {
    id: 'EMP-1001',
    name: 'Sarah Jenkins',
    email: 'admin@dayflow.com',
    password: 'Password123!',
    role: 'HR', // 'HR' (Admin) vs 'Employee'
    position: 'HR Director',
    department: 'Human Resources',
    phone: '+1 (555) 234-5678',
    address: '742 Evergreen Terrace, San Francisco, CA',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2021-03-15',
    verified: true
  },
  {
    id: 'EMP-1002',
    name: 'Alex Morgan',
    email: 'alex@dayflow.com',
    password: 'Password123!',
    role: 'Employee',
    position: 'Senior Full Stack Engineer',
    department: 'Engineering',
    phone: '+1 (555) 876-5432',
    address: '456 Tech Boulevard, Suite 300, Austin, TX',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2022-06-01',
    verified: true
  },
  {
    id: 'EMP-1003',
    name: 'Priya Sharma',
    email: 'priya@dayflow.com',
    password: 'Password123!',
    role: 'Employee',
    position: 'Lead UX/UI Designer',
    department: 'Design',
    phone: '+1 (555) 345-6789',
    address: '890 Creative Lane, Seattle, WA',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2023-01-10',
    verified: true
  },
  {
    id: 'EMP-1004',
    name: 'David Miller',
    email: 'david@dayflow.com',
    password: 'Password123!',
    role: 'Employee',
    position: 'DevOps & Cloud Architect',
    department: 'Infrastructure',
    phone: '+1 (555) 901-2345',
    address: '123 Cloud Way, Denver, CO',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2022-11-15',
    verified: true
  }
];

export const INITIAL_ATTENDANCE = [
  {
    id: 'ATT-2026-08-22-1002',
    employeeId: 'EMP-1002',
    date: '2026-08-22',
    checkIn: '09:00 AM',
    checkOut: null,
    totalHours: 'Working',
    status: 'Present'
  },
  {
    id: 'ATT-2026-08-21-1002',
    employeeId: 'EMP-1002',
    date: '2026-08-21',
    checkIn: '08:55 AM',
    checkOut: '05:30 PM',
    totalHours: '8h 35m',
    status: 'Present'
  },
  {
    id: 'ATT-2026-08-20-1002',
    employeeId: 'EMP-1002',
    date: '2026-08-20',
    checkIn: '09:15 AM',
    checkOut: '05:15 PM',
    totalHours: '8h 00m',
    status: 'Present'
  },
  {
    id: 'ATT-2026-08-19-1002',
    employeeId: 'EMP-1002',
    date: '2026-08-19',
    checkIn: '09:00 AM',
    checkOut: '01:30 PM',
    totalHours: '4h 30m',
    status: 'Half-day'
  },
  {
    id: 'ATT-2026-08-18-1002',
    employeeId: 'EMP-1002',
    date: '2026-08-18',
    checkIn: '08:45 AM',
    checkOut: '05:45 PM',
    totalHours: '9h 00m',
    status: 'Present'
  },
  // Priya
  {
    id: 'ATT-2026-08-22-1003',
    employeeId: 'EMP-1003',
    date: '2026-08-22',
    checkIn: '09:10 AM',
    checkOut: null,
    totalHours: 'Working',
    status: 'Present'
  },
  // David
  {
    id: 'ATT-2026-08-22-1004',
    employeeId: 'EMP-1004',
    date: '2026-08-22',
    checkIn: null,
    checkOut: null,
    totalHours: '0h',
    status: 'Leave'
  }
];

export const INITIAL_LEAVES = [
  {
    id: 'LR-101',
    employeeId: 'EMP-1002',
    employeeName: 'Alex Morgan',
    leaveType: 'Paid', // 'Paid', 'Sick', 'Unpaid'
    startDate: '2026-08-28',
    endDate: '2026-08-30',
    totalDays: 3,
    remarks: 'Attending Developer Summit 2026 & vacation block.',
    status: 'Pending', // 'Pending', 'Approved', 'Rejected'
    appliedDate: '2026-08-20',
    adminComment: ''
  },
  {
    id: 'LR-102',
    employeeId: 'EMP-1003',
    employeeName: 'Priya Sharma',
    leaveType: 'Sick',
    startDate: '2026-08-15',
    endDate: '2026-08-16',
    totalDays: 2,
    remarks: 'Severe migraine rest days.',
    status: 'Approved',
    appliedDate: '2026-08-14',
    adminComment: 'Get well soon, Priya. Approved.'
  },
  {
    id: 'LR-103',
    employeeId: 'EMP-1004',
    employeeName: 'David Miller',
    leaveType: 'Unpaid',
    startDate: '2026-08-22',
    endDate: '2026-08-25',
    totalDays: 4,
    remarks: 'Personal urgent family work.',
    status: 'Approved',
    appliedDate: '2026-08-18',
    adminComment: 'Approved as per protocol.'
  }
];

export const INITIAL_PAYROLL = [
  {
    employeeId: 'EMP-1001',
    baseSalary: 11000,
    hra: 3500,
    allowances: 1500,
    taxDeduction: 1800,
    pfDeduction: 800,
    payPeriod: 'August 2026',
    status: 'Processed'
  },
  {
    employeeId: 'EMP-1002',
    baseSalary: 9500,
    hra: 2800,
    allowances: 1200,
    taxDeduction: 1400,
    pfDeduction: 600,
    payPeriod: 'August 2026',
    status: 'Processed'
  },
  {
    employeeId: 'EMP-1003',
    baseSalary: 8800,
    hra: 2600,
    allowances: 1100,
    taxDeduction: 1300,
    pfDeduction: 550,
    payPeriod: 'August 2026',
    status: 'Processed'
  },
  {
    employeeId: 'EMP-1004',
    baseSalary: 10200,
    hra: 3000,
    allowances: 1300,
    taxDeduction: 1500,
    pfDeduction: 700,
    payPeriod: 'August 2026',
    status: 'Processed'
  }
];

export const INITIAL_DOCUMENTS = [
  { id: 'DOC-1', employeeId: 'EMP-1002', title: 'Employment_Agreement_2022.pdf', category: 'Contract', size: '2.4 MB', date: '2022-06-01' },
  { id: 'DOC-2', employeeId: 'EMP-1002', title: 'Government_ID_Verification.pdf', category: 'Identification', size: '1.1 MB', date: '2022-06-01' },
  { id: 'DOC-3', employeeId: 'EMP-1002', title: 'Tax_Declaration_2026.pdf', category: 'Tax', size: '850 KB', date: '2026-01-15' },
  { id: 'DOC-4', employeeId: 'EMP-1001', title: 'HR_Executive_Contract.pdf', category: 'Contract', size: '3.1 MB', date: '2021-03-15' }
];

export const INITIAL_NOTIFICATIONS = [
  { id: 'NOTIF-1', recipientId: 'EMP-1002', title: 'Attendance Logged', message: 'You checked in successfully at 09:00 AM today.', timestamp: '10 mins ago', read: false, type: 'info' },
  { id: 'NOTIF-2', recipientId: 'EMP-1002', title: 'Leave Request Received', message: 'Your Paid leave request for Aug 28 - Aug 30 is under HR review.', timestamp: '2 hours ago', read: false, type: 'warning' },
  { id: 'NOTIF-3', recipientId: 'EMP-1001', title: 'New Leave Request', message: 'Alex Morgan submitted a new leave request (3 days).', timestamp: '2 hours ago', read: false, type: 'action' },
  { id: 'NOTIF-4', recipientId: 'EMP-1003', title: 'Leave Request Approved', message: 'Your Sick leave request for Aug 15 - Aug 16 has been approved by Sarah Jenkins.', timestamp: '1 day ago', read: true, type: 'success' }
];
