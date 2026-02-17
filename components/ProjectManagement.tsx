
import React, { useState } from 'react';
import { Project } from '../types';
import { Plus, FolderKanban, Calendar, Trash2, Edit2, Loader2, Check, X, ShieldAlert } from 'lucide-react';
import { api } from '../services/apiService';

interface ProjectManagementProps {
  projects: Project[];
  onAddProject: (p: Project) => void;
  onRefresh?: () => void;
}

const ProjectManagement: React.FC<ProjectManagementProps> = ({ projects, onAddProject, onRefresh }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (editingProject) {
        await api.updateProject(editingProject.id, { name, description });
        if (onRefresh) onRefresh();
      } else {
        const newProject: Project = {
          id: `proj-${Math.random().toString(36).substr(2, 9)}`,
          name,
          description,
          createdAt: new Date().toISOString().split('T')[0]
        };
        // The parent onAddProject handles the api.saveProject call and refreshing state.
        // We do NOT call api.saveProject here to avoid double-insertion.
        onAddProject(newProject);
      }
      resetForm();
    } catch (err) {
      console.error("Project operation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingProject(null);
    setName('');
    setDescription('');
  };

  const handleEdit = (p: Project) => {
    setEditingProject(p);
    setName(p.name);
    setDescription(p.description);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This will delete all associated content and reports for this project.")) return;
    setLoading(true);
    try {
      await api.deleteProject(id);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <FolderKanban className="text-blue-500" size={32} />
            Project Architecture
          </h2>
          <p className="text-slate-400 mt-1">Isolate metrics and teams across multiple workspace environments.</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-900/30 flex items-center gap-2 transition-all active:scale-95"
          >
            <Plus size={18} />
            New Workspace
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isAdding && (
          <div className="bg-[#1e293b] border-2 border-blue-500/50 rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in duration-300">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                  {editingProject ? 'Updating Project' : 'Constructing Project'}
                </span>
                <button type="button" onClick={resetForm} className="text-slate-500 hover:text-white transition-colors">
                  <X size={18} />
                </button>
              </div>
              <input 
                type="text" 
                placeholder="Workspace Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-blue-500 outline-none text-white"
                required
                autoFocus
              />
              <textarea 
                placeholder="Description / Purpose"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-blue-500 outline-none h-24 resize-none text-white"
              />
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl py-3 font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                {editingProject ? 'Save Changes' : 'Deploy Workspace'}
              </button>
            </form>
          </div>
        )}

        {projects.map(project => (
          <div key={project.id} className="bg-[#1e293b]/50 border border-slate-800 rounded-3xl p-6 group hover:border-slate-700 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <FolderKanban size={24} />
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleEdit(project)}
                  className="p-1.5 bg-slate-800 rounded-lg text-slate-400 hover:text-white border border-slate-700"
                >
                  <Edit2 size={14} />
                </button>
                <button 
                  onClick={() => handleDelete(project.id)}
                  className="p-1.5 bg-slate-800 rounded-lg text-slate-400 hover:text-rose-500 border border-slate-700"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <h3 className="text-xl font-bold mb-1">{project.name}</h3>
            <p className="text-slate-400 text-sm line-clamp-2 min-h-[40px]">{project.description}</p>
            
            <div className="mt-6 pt-6 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase">
                <Calendar size={12} />
                Launched: {project.createdAt}
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-500 px-2 py-0.5 rounded border border-slate-700">ID: {project.id.split('-')[1]}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-blue-600/5 border border-blue-500/20 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6">
        <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center shrink-0 border border-blue-500/20">
          <ShieldAlert size={32} />
        </div>
        <div>
          <h4 className="text-lg font-bold text-blue-400">Environment Isolation Protocol</h4>
          <p className="text-slate-400 text-sm max-w-2xl mt-1">
            Data separation ensures that different clients, business units, or campaigns maintain strictly isolated data silos. Permissions are enforced at the API gateway level for all relational and document stores.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectManagement;
