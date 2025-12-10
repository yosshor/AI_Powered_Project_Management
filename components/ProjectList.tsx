import React from 'react';
import { Project } from '../types';
import { Folder, Plus, Trash2 } from 'lucide-react';

interface ProjectListProps {
  projects: Project[];
  activeProjectId: string | null;
  onSelectProject: (id: string) => void;
  onAddProject: () => void;
  onDeleteProject: (id: string, e: React.MouseEvent) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({ 
  projects, 
  activeProjectId, 
  onSelectProject, 
  onAddProject,
  onDeleteProject
}) => {
  return (
    <div className="flex flex-col h-full bg-white border-e border-gray-200 w-64 flex-shrink-0 transition-all duration-300">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <h2 className="font-bold text-lg text-gray-800 flex items-center gap-2">
          <Folder className="w-5 h-5 text-indigo-600" />
          הפרויקטים שלי
        </h2>
        <button 
          onClick={onAddProject}
          className="p-1.5 rounded-full hover:bg-gray-100 text-indigo-600 transition-colors"
          title="פרויקט חדש"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
      
      <div className="overflow-y-auto flex-1 p-3 space-y-2">
        {projects.length === 0 && (
          <div className="text-center text-gray-400 text-sm py-8">
            אין פרויקטים עדיין.<br/>צור אחד חדש!
          </div>
        )}
        
        {projects.map((project) => (
          <div 
            key={project._id}
            onClick={() => onSelectProject(project._id)}
            className={`
              group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 border
              ${activeProjectId === project._id 
                ? 'bg-indigo-50 border-indigo-200 shadow-sm' 
                : 'hover:bg-gray-50 border-transparent text-gray-600 hover:text-gray-900'}
            `}
          >
            <div className="flex flex-col min-w-0">
              <span className={`font-medium truncate ${activeProjectId === project._id ? 'text-indigo-900' : ''}`}>
                {project.name}
              </span>
              <span className="text-xs text-gray-400 truncate">
                {new Date(project._creationTime).toLocaleDateString('he-IL')}
              </span>
            </div>
            
            <button
              onClick={(e) => onDeleteProject(project._id, e)}
              className={`
                p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity
                ${activeProjectId === project._id ? 'text-indigo-400 hover:text-red-500 hover:bg-white' : 'text-gray-400 hover:text-red-500 hover:bg-gray-200'}
              `}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
