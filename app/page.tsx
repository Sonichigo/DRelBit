
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { NavSection, User, Project } from '../types';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Dashboard from '../components/Dashboard';
import YouTubeAnalytics from '../components/YouTubeAnalytics';
import BrightEdgeAnalytics from '../components/BrightEdgeAnalytics';
import CompetitorTracking from '../components/CompetitorTracking';
import CustomReports from '../components/CustomReports';
import DataImport from '../components/DataImport';
import UserManagement from '../components/UserManagement';
import ProjectManagement from '../components/ProjectManagement';
import SystemHealth from '../components/SystemHealth';
import Login from '../components/Login';
import Signup from '../components/Signup';
import { api } from '../services/apiService';
import { DatabaseZap, Wifi, WifiOff } from 'lucide-react';

export default function Home() {
  const [activeSection, setActiveSection] = useState<NavSection>(NavSection.DASHBOARD);
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  
  // Added state to synchronize between Header and Dashboard components
  const [isWidgetGalleryOpen, setIsWidgetGalleryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const initializeApp = useCallback(async () => {
    setInitLoading(true);
    
    const savedUser = localStorage.getItem('omni_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    try {
      const isOnline = await api.ping();
      setConnectionStatus(isOnline ? 'online' : 'offline');

      if (isOnline) {
        // Attempt background sync of local changes
        try {
          const syncResult = await api.syncUnsyncedData();
          if (syncResult.processedCount > 0) {
            setSyncMessage(`Synced ${syncResult.processedCount} items to cloud.`);
            setTimeout(() => setSyncMessage(null), 5000);
          }
        } catch (err) {
          console.warn("Background sync failed, will retry later.");
        }
      }
      
      const data = await api.getProjects();
      setProjects(data || []);
      if (data && data.length > 0) {
        if (!activeProject || !data.find(p => p.id === activeProject.id)) {
          setActiveProject(data[0]);
        }
      } else {
        setActiveProject(null);
      }
    } catch (err) {
      console.warn("Operating in Local Vault mode.");
      setConnectionStatus('offline');
      const localData = await api.getProjects();
      setProjects(localData || []);
      if (localData && localData.length > 0) setActiveProject(localData[0]);
    } finally {
      setInitLoading(false);
    }
  }, [activeProject]);

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
      // Fixed: Passed required props to Dashboard component
      case NavSection.DASHBOARD: return <Dashboard 
        project={activeProject} 
        isWidgetGalleryOpen={isWidgetGalleryOpen} 
        setIsWidgetGalleryOpen={setIsWidgetGalleryOpen}
        searchQuery={searchQuery}
      />;
      case NavSection.YOUTUBE: return <YouTubeAnalytics project={activeProject} />;
      case NavSection.BRIGHTEDGE: return <BrightEdgeAnalytics project={activeProject} />;
      case NavSection.COMPETITORS: return <CompetitorTracking />;
      case NavSection.REPORTS: return <CustomReports project={activeProject} />;
      case NavSection.IMPORT: return <DataImport project={activeProject} />;
      case NavSection.USERS: return <UserManagement />;
      case NavSection.PROJECTS: return <ProjectManagement projects={projects} onAddProject={handleAddProject} onRefresh={initializeApp} />;
      case NavSection.SYSTEM_HEALTH: return <SystemHealth />;
      // Fixed: Passed required props to Dashboard component in default case
      default: return <Dashboard 
        project={activeProject} 
        isWidgetGalleryOpen={isWidgetGalleryOpen} 
        setIsWidgetGalleryOpen={setIsWidgetGalleryOpen}
        searchQuery={searchQuery}
      />;
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
        projects={projects}
        activeProject={activeProject}
        onSelectProject={setActiveProject}
      />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Fixed: Passed required props to Header component */}
        <Header 
          activeSection={activeSection} 
          activeProject={activeProject} 
          onOpenWidgets={() => setIsWidgetGalleryOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onRefresh={initializeApp}
        />
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="max-w-[1600px] mx-auto space-y-8">
            {(connectionStatus === 'offline' || syncMessage) && (
              <div className={`p-4 rounded-2xl flex items-center justify-between animate-in slide-in-from-top-4 ${syncMessage ? 'bg-blue-600/10 border border-blue-500/20' : 'bg-amber-500/10 border border-amber-500/20'}`}>
                <div className="flex items-center gap-3">
                  {syncMessage ? <Wifi size={20} className="text-blue-500" /> : <WifiOff size={20} className="text-amber-500" />}
                  <span className={`text-sm font-medium ${syncMessage ? 'text-blue-500' : 'text-amber-500'}`}>
                    {syncMessage || "Server Offline: Data will be synced automatically when connection returns."}
                  </span>
                </div>
                <button onClick={initializeApp} className={`text-xs font-bold uppercase tracking-widest hover:underline ${syncMessage ? 'text-blue-500' : 'text-amber-500'}`}>
                  {syncMessage ? "Dismiss" : "Check Connection"}
                </button>
              </div>
            )}
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
