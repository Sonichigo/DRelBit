
import React, { useState, useEffect } from 'react';
import { NavSection, User } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import YouTubeAnalytics from './components/YouTubeAnalytics';
import BrightEdgeAnalytics from './components/BrightEdgeAnalytics';
import CompetitorTracking from './components/CompetitorTracking';
import CustomReports from './components/CustomReports';
import DataImport from './components/DataImport';
import UserManagement from './components/UserManagement';
import Login from './components/Login';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<NavSection>(NavSection.DASHBOARD);
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Simple authentication persistence
  useEffect(() => {
    const savedUser = localStorage.getItem('omni_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('omni_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('omni_user');
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeSection) {
      case NavSection.DASHBOARD:
        return <Dashboard />;
      case NavSection.YOUTUBE:
        return <YouTubeAnalytics />;
      case NavSection.BRIGHTEDGE:
        return <BrightEdgeAnalytics />;
      case NavSection.COMPETITORS:
        return <CompetitorTracking />;
      case NavSection.REPORTS:
        return <CustomReports />;
      case NavSection.IMPORT:
        return <DataImport />;
      case NavSection.USERS:
        return <UserManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-100 overflow-hidden">
      <Sidebar 
        activeSection={activeSection} 
        onSelectSection={setActiveSection} 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        user={user}
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header activeSection={activeSection} />
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="max-w-[1600px] mx-auto space-y-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
