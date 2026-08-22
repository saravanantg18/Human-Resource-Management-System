# 🚀 Dayflow - Human Resource Management System (HRMS)

> *Every workday, perfectly aligned.*

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.1.6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge&logo=github-actions)](.github/workflows/ci.yml)

Dayflow is a modern, full-featured **Human Resource Management System (HRMS)** built to streamline employee onboarding, attendance tracking with live worktimers, leave approval workflows, payroll breakdown with printable payslips, and interactive analytics reporting.

---

## 👥 Project Team & Contributors (4 Members)

This project was developed collaboratively by a 4-member team. Each team member contributed to distinct functional modules and features:

| Contributor Name | Project Role | Primary Focus & Modules | GitHub Profile |
| :--- | :--- | :--- | :---: |
|**Member 1 (Team Lead)** | Full Stack Architect | Auth Portals, System Architecture & State Management (`AuthContext`, `HRContext`) | [@contributor1](https://github.com/saravanantg18) |
| **Member 2** | Frontend & UI Developer | Dashboard UI & Attendance Terminal Stopwatch (`DashboardView`, `AttendanceView`) | [@contributor2](https://github.com/Jegan111) |
| **Member 3** | HR Workflows Engineer | Profile Management & Leave Approval System (`ProfileView`, `LeaveView`) | [@contributor3](https://github.com/prathik-b678) |
| **Member 4** | Payroll & Data Analytics Lead | Salary Payslips, Payroll Controls & Recharts Analytics (`PayrollView`, `AnalyticsView`) | [@contributor4](https://github.com/naveenselvan-s) |

---

## ✨ Key Features

- **🔐 Dual Portal Authentication (`AuthView.jsx`)**:
  - Dedicated **Employee Portal** and **Admin / HR Portal** login interfaces.
  - Password security validation rules ($\ge 8$ characters, uppercase, number, special char).
  - Simulated 6-digit email verification workflow (`123456`).
  - 1-Click Instant Demo Login for Admin (Sarah Jenkins) & Employee (Alex Morgan).

- **📊 Role-Based Dashboards (`DashboardView.jsx`)**:
  - **Employee View**: Quick access cards, live workday stopwatch ticker, leave balance tracking, activity feed.
  - **Admin View**: High-level KPIs (Total Staff, On Duty, Pending Approvals, Monthly Payroll), leave request review queue, and quick staff creation modal.

- **👤 Profile Management (`ProfileView.jsx`)**:
  - Personal Details, Employment Information, Salary Structure, and Documents Repository.
  - Scoped editing permissions (Employees edit address/phone/avatar; Admin edits job titles, roles, salary, employee IDs).

- **⏱️ Attendance Tracking (`AttendanceView.jsx`)**:
  - Interactive shift Check-In / Check-Out terminal with real-time timer.
  - Daily history log with status badges (`Present`, `Half-day`, `Absent`, `Leave`) and 5-day weekly grid.
  - Admin filtering by individual employee.

- **🌴 Leave & Time-Off Management (`LeaveView.jsx`)**:
  - Employee leave application modal (`Paid`, `Sick`, `Unpaid`) with automatic day count calculation.
  - Admin Approval Hub with status filter tabs and custom HR manager feedback comments.

- **💳 Payroll & Salary Statements (`PayrollView.jsx`)**:
  - Official formatted Payslip Card with Gross Earnings, Deductions (Tax & PF), Net Salary, and Printable format.
  - Admin Payroll registry for real-time base salary and allowance adjustments.

- **📈 Analytics & Reports (`AnalyticsView.jsx`)**:
  - Recharts visual graphs for Attendance trends, Leave type breakdown, and Departmental payroll allocation.

---

## 📁 Repository Structure

```text
Human Resource Management System/
├── .github/
│   ├── workflows/
│   │   └── ci.yml               # Automated CI Workflow
│   └── pull_request_template.md # Team PR Review Template
├── src/
│   ├── components/
│   │   ├── Navbar.jsx           # Navigation Header with Notifications & Profile Menu
│   │   └── Sidebar.jsx          # Sidebar with Quick Role Switcher
│   ├── context/
│   │   ├── AuthContext.jsx      # Authentication & User Management State
│   │   └── HRContext.jsx        # HR Data Store (Attendance, Leaves, Payroll, Staff)
│   ├── data/
│   │   └── initialData.js       # Pre-seeded Mock HR Data
│   ├── views/
│   │   ├── AnalyticsView.jsx    # Visual Reports & Analytics
│   │   ├── AttendanceView.jsx   # Check-in Terminal & Logs
│   │   ├── AuthView.jsx         # Employee & Admin Login Portals
│   │   ├── DashboardView.jsx    # Role-based Dashboards & Staff Creation
│   │   ├── LeaveView.jsx        # Leave Applications & Approval Queue
│   │   ├── PayrollView.jsx      # Payslip Statements & Payroll Registry
│   │   └── ProfileView.jsx      # Profile Editing & Documents Repository
│   ├── App.jsx                  # Main Application Component
│   ├── index.css                # Global Styles & Glassmorphism Utilities
│   └── main.jsx                 # Application Entry Point
├── index.html                   # HTML Template with Google Fonts
├── package.json                 # Project Dependencies & Scripts
├── tailwind.config.js           # Tailwind Palette & Theme Configuration
├── vite.config.js               # Vite Development Server Configuration
├── CONTRIBUTING.md              # Team Branching & PR Guidelines
├── LICENSE                      # MIT Open Source License
└── README.md                    # Project Documentation
```

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### Setup & Run Locally

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/dayflow-hrms.git
   cd dayflow-hrms
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000/` in your browser.

4. **Production Build**:
   ```bash
   npm run build
   ```

---

## 🤝 Branching & Contribution Strategy

For the 4 team members working on this GitHub repository:
- **`main` branch**: Production-ready code.
- **Feature Branches**: Format as `feature/member-name-feature-title` (e.g. `feature/member1-auth-portal`).
- **Pull Requests**: All code changes must be submitted via Pull Request and reviewed before merging to `main`. See [CONTRIBUTING.md](CONTRIBUTING.md) for complete team guidelines.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
