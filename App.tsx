import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from './convex/api';
import { Project, Task, TaskStatus } from './types';
import { ProjectList } from './components/ProjectList';
import { TaskBoard } from './components/TaskBoard';
import { AIChat } from './components/AIChat';
import { generateProjectTasks, chatWithProject } from './services/gemini';
import { Sparkles, Plus, Layout } from 'lucide-react';

const App: React.FC = () => {
  // --- Convex State Management ---
  const projects = useQuery(api.projects.list) || [];
  
  // Local UI state
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  
  // Set initial active project
  React.useEffect(() => {
    if (!activeProjectId && projects.length > 0) {
      setActiveProjectId(projects[0]._id);
    }
  }, [projects, activeProjectId]);

  // Dependent queries
  const tasks = useQuery(api.tasks.list, activeProjectId ? { projectId: activeProjectId as any } : "skip") || [];
  const chatMessages = useQuery(api.messages.list, activeProjectId ? { projectId: activeProjectId as any } : "skip") || [];

  const activeProject = projects.find((p: Project) => p._id === activeProjectId);

  // Mutations
  const createProject = useMutation(api.projects.create);
  const deleteProject = useMutation(api.projects.remove);
  const createTask = useMutation(api.tasks.create);
  const updateTaskStatus = useMutation(api.tasks.updateStatus);
  const deleteTask = useMutation(api.tasks.remove);
  const sendMessage = useMutation(api.messages.send);

  // UI Local State
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isGeneratingTasks, setIsGeneratingTasks] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // --- Handlers ---

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;
    
    const projectId = await createProject({
      name: newProjectName,
      description: newProjectDesc,
    });

    setActiveProjectId(projectId);
    setShowNewProjectModal(false);
    setNewProjectName('');
    setNewProjectDesc('');

    // AI Generation Logic
    if (newProjectDesc.trim()) {
      setIsGeneratingTasks(true);
      try {
        const generatedTitles = await generateProjectTasks(newProjectName, newProjectDesc);
        for (const title of generatedTitles) {
          await createTask({ projectId, title, status: 'TODO' });
        }
      } catch (e) {
        console.error("Failed to generate tasks", e);
      } finally {
        setIsGeneratingTasks(false);
      }
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !activeProjectId) return;
    
    createTask({
      projectId: activeProjectId,
      title: newTaskTitle,
      status: 'TODO'
    });
    
    setNewTaskTitle('');
  };

  const handleDeleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('האם אתה בטוח שברצונך למחוק פרויקט זה?')) {
      deleteProject({ id });
      if (activeProjectId === id) setActiveProjectId(null);
    }
  };

  const handleGenerateAI = async () => {
    if (!activeProject) return;
    setIsGeneratingTasks(true);
    try {
      const generatedTitles = await generateProjectTasks(activeProject.name, activeProject.description);
      for (const title of generatedTitles) {
        await createTask({ projectId: activeProject._id, title, status: 'TODO' });
      }
    } catch (e) {
      alert("שגיאה ביצירת משימות. וודא שיש לך מפתח API תקין.");
    } finally {
      setIsGeneratingTasks(false);
    }
  };

  const handleChatMessage = async (text: string) => {
    if (!activeProjectId || !activeProject) return;

    // 1. Save user message to DB
    await sendMessage({ projectId: activeProjectId, role: 'user', text });
    setIsChatLoading(true);

    // Prepare history
    const history = chatMessages.map((m: any) => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));
    // Add the current message which is already in DB conceptually for the user, but needed for context
    // Actually `chatMessages` from useQuery will update instantly in our sim, so history is up to date usually.
    // But safely we rely on what we just sent.

    try {
      const responseText = await chatWithProject(history, text, activeProject, tasks);
      await sendMessage({ projectId: activeProjectId, role: 'model', text: responseText });
    } catch (e) {
      await sendMessage({ projectId: activeProjectId, role: 'model', text: 'שגיאה', isError: true });
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-900 font-sans overflow-hidden">
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 flex-shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg shadow-md shadow-indigo-200">
            <Layout className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-l from-indigo-600 to-purple-600">
            ניהול פרויקטים (Convex Style)
          </h1>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-500">
           {!process.env.API_KEY && (
             <span className="text-red-500 bg-red-50 px-2 py-1 rounded text-xs border border-red-200">
               חסר מפתח API
             </span>
           )}
           <div className="flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
             Convex Connected
           </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Sidebar: Projects */}
        <ProjectList 
          projects={projects}
          activeProjectId={activeProjectId}
          onSelectProject={setActiveProjectId}
          onAddProject={() => setShowNewProjectModal(true)}
          onDeleteProject={handleDeleteProject}
        />

        {/* Center: Tasks */}
        <main className="flex-1 flex flex-col min-w-0 bg-gray-50/50">
          {activeProject ? (
            <>
              {/* Project Header */}
              <div className="p-6 pb-2">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{activeProject.name}</h2>
                    <p className="text-gray-500 max-w-2xl">{activeProject.description || "אין תיאור לפרויקט זה"}</p>
                  </div>
                  <button 
                    onClick={handleGenerateAI}
                    disabled={isGeneratingTasks}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-indigo-200 text-indigo-700 rounded-xl hover:bg-indigo-50 hover:shadow-md transition-all text-sm font-medium"
                  >
                    <Sparkles className={`w-4 h-4 ${isGeneratingTasks ? 'animate-spin' : ''}`} />
                    {isGeneratingTasks ? 'חושב...' : 'פרק משימות עם AI'}
                  </button>
                </div>

                {/* Add Task Input */}
                <form onSubmit={handleAddTask} className="mt-4">
                  <div className="relative group">
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                      <Plus className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      placeholder="הוסף משימה חדשה..."
                      className="w-full bg-white border border-gray-200 rounded-xl py-3 pr-10 pl-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>
                </form>
              </div>

              {/* Task List */}
              <TaskBoard 
                tasks={tasks}
                onStatusChange={(id, status) => updateTaskStatus({ id, status })}
                onDeleteTask={(id) => deleteTask({ id })}
                isLoadingAI={isGeneratingTasks}
              />
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <Layout className="w-16 h-16 mb-4 text-gray-200" />
              <p>בחר פרויקט מהתפריט או צור חדש</p>
            </div>
          )}
        </main>

        {/* Right Sidebar: Chat */}
        {activeProject && (
          <AIChat 
            messages={chatMessages}
            onSendMessage={handleChatMessage}
            isLoading={isChatLoading}
          />
        )}
      </div>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">פרויקט חדש</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">שם הפרויקט</label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="לדוגמה: השקת מוצר"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">תיאור (עוזר ל-AI)</label>
                <textarea
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none h-24 resize-none"
                  placeholder="תאר את מטרות הפרויקט כדי שה-AI יוכל להציע משימות..."
                />
              </div>
            </div>
            <div className="p-4 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={() => setShowNewProjectModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors font-medium"
              >
                ביטול
              </button>
              <button 
                onClick={handleCreateProject}
                disabled={!newProjectName.trim()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors font-medium shadow-md shadow-indigo-200"
              >
                צור פרויקט
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
