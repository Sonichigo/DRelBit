
"use client";

import React, { useState, useEffect, useCallback, Component, ErrorInfo, ReactNode } from 'react';
import { NavSection, User, Project } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import YouTubeAnalytics from './components/YouTubeAnalytics';
import BrightEdgeAnalytics from './components/BrightEdgeAnalytics';
import CompetitorTracking from './components/CompetitorTracking';
import CustomReports from './components/CustomReports';
import DataImport from './components/DataImport';
import UserManagement from './components/UserManagement';
import ProjectManagement from './components/ProjectManagement';
import SystemHealth from './components/SystemHealth';
import Login from './components/Login';
import Signup from './components/Signup';
import { api } from './services/apiService';
import { DatabaseZap, AlertTriangle, RefreshCw } from 'lucide-react';

// --- Error Boundary Component ---
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Dashboard Crash:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen bg-[#0f172a] flex flex-col items-center justify-center p-8 text-center">
          <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-3xl flex items-center justify-center mb-6">
            <AlertTriangle size={40} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Workspace Failure</h1>
          <p className="text-slate-400 max-w-md mb-8">The dashboard encountered a critical rendering error. Your data in the local vault remains safe.</p>
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all"
          >
            <RefreshCw size={18} /> Reload Dashboard
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function Home() {
  const [activeSection, setActiveSection] = useState<NavSection>(NavSection.DASHBOARD);
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline' | 'checking'>('checking');

  const initializeApp = useCallback(async () => {
    setInitLoading(true);
    
    const savedUser = localStorage.getItem('omni_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    try {
      const isOnline = await api.ping();
      setConnectionStatus(isOnline ? 'online' : 'offline');
      
      const data = await api.getProjects();
      setProjects(data || []);
      if (data && data.length > 0) {
        setActiveProject(data[0]);
      }
    } catch (err) {
      setConnectionStatus('offline');
      const localData = await api.getProjects();
      setProjects(localData || []);
      if (localData && localData.length > 0) setActiveProject(localData[0]);
    } finally {
      setInitLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('omni_user', JSON.stringify(userData));
    initializeApp();
  };

  const handleSignup = (userData: User) => {
    setUser(userData);
    localStorage.setItem('omni_user', JSON.stringify(userData));
    setIsSigningUp(false);
    initializeApp();
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('omni_user');
    setProjects([]);
    setActiveProject(null);
  };

  const handleAddProject = async (newProject: Project) => {
    await api.saveProject(newProject);
    const updated = await api.getProjects();
    setProjects(updated || []);
    setActiveProject(newProject);
  };

  if (initLoading) {
    return (
      <div className="h-screen bg-[#0f172a] flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-900/40 animate-bounce">
          <span className="text-white font-black text-2xl">O</span>
        </div>
        <div className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] animate-pulse">
          Initializing Omni Vault...
        </div>
      </div>
    );
  }

  if (!user) {
    return isSigningUp 
      ? <Signup onSignup={handleSignup} onToggle={() => setIsSigningUp(false)} />
      : <Login onLogin={handleLogin} onToggle={() => setIsSigningUp(true)} />;
  }

  const renderContent = () => {
    switch (activeSection) {
      case NavSection.DASHBOARD: return <Dashboard project={activeProject} />;
      case NavSection.YOUTUBE: return <YouTubeAnalytics project={activeProject} />;
      case NavSection.BRIGHTEDGE: return <BrightEdgeAnalytics project={activeProject} />;
      case NavSection.COMPETITORS: return <CompetitorTracking />;
      case NavSection.REPORTS: return <CustomReports project={activeProject} />;
      case NavSection.IMPORT: return <DataImport project={activeProject} />;
      case NavSection.USERS: return <UserManagement />;
      case NavSection.PROJECTS: return <ProjectManagement projects={projects} onAddProject={handleAddProject} />;
      case NavSection.SYSTEM_HEALTH: return <SystemHealth />;
      default: return <Dashboard project={activeProject} />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="flex h-screen bg-[#0f172a] text-slate-100 overflow-hidden">
        <Sidebar 
          activeSection={activeSection} 
          onSelectSection={setActiveSection} 
          isOpen={isSidebarOpen} 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          user={user}
          onLogout={handleLogout}
          projects={projects}
          activeProject={activeProject}
          onSelectProject={setActiveProject}
        />
        <div className="flex-1 flex flex-col min-w-0">
          <Header activeSection={activeSection} activeProject={activeProject} />
          <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
            <div className="max-w-[1600px] mx-auto space-y-8">
              {connectionStatus === 'offline' && (
                <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex items-center justify-between animate-in slide-in-from-top-4">
                  <div className="flex items-center gap-3 text-amber-500">
                    <DatabaseZap size={20} />
                    <span className="text-sm font-medium">Server Offline: Using Secured Local Workspace (IndexedDB)</span>
                  </div>
                  <button onClick={initializeApp} className="text-xs font-bold text-amber-500 hover:underline uppercase tracking-widest">Retry Cloud Sync</button>
                </div>
              )}
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}
