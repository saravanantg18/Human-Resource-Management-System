import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HRProvider } from './context/HRContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AuthView from './views/AuthView';
import DashboardView from './views/DashboardView';
import ProfileView from './views/ProfileView';
import AttendanceView from './views/AttendanceView';
import LeaveView from './views/LeaveView';
import PayrollView from './views/PayrollView';
import AnalyticsView from './views/AnalyticsView';

function MainApp() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!user) {
    return <AuthView />;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView setActiveTab={setActiveTab} />;
      case 'profile':
        return <ProfileView />;
      case 'attendance':
        return <AttendanceView />;
      case 'leave':
        return <LeaveView />;
      case 'payroll':
        return <PayrollView />;
      case 'analytics':
        return <AnalyticsView />;
      default:
        return <DashboardView setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex flex-1">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <HRProvider>
        <MainApp />
      </HRProvider>
    </AuthProvider>
  );
}
