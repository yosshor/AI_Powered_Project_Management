import React from 'react';
import { Task, TaskStatus } from '../types';
import { CheckCircle2, Circle, Clock, MoreVertical, Sparkles } from 'lucide-react';

interface TaskBoardProps {
  tasks: Task[];
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onDeleteTask: (taskId: string) => void;
  isLoadingAI: boolean;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({ 
  tasks, 
  onStatusChange, 
  onDeleteTask,
  isLoadingAI
}) => {
  
  const getStatusIcon = (status: TaskStatus) => {
    switch(status) {
      case TaskStatus.DONE: return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case TaskStatus.IN_PROGRESS: return <Clock className="w-5 h-5 text-amber-500" />;
      default: return <Circle className="w-5 h-5 text-gray-300" />;
    }
  };

  const getStatusText = (status: TaskStatus) => {
     switch(status) {
      case TaskStatus.DONE: return 'הושלם';
      case TaskStatus.IN_PROGRESS: return 'בביצוע';
      default: return 'לביצוע';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-800">משימות</h3>
        <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
          {tasks.filter(t => t.status === TaskStatus.DONE).length} / {tasks.length} הושלמו
        </span>
      </div>

      {isLoadingAI && (
        <div className="mb-6 p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center gap-3 animate-pulse">
          <Sparkles className="w-5 h-5 text-indigo-500 animate-spin" />
          <span className="text-indigo-700 font-medium">ה-AI מייצר משימות חדשות...</span>
        </div>
      )}

      {tasks.length === 0 && !isLoadingAI ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
          <p>אין משימות בפרויקט זה.</p>
          <p className="text-sm">הוסף משימה ידנית או בקש מה-AI עזרה.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {tasks.map(task => (
            <div 
              key={task._id} 
              className={`
                group bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between
                ${task.status === TaskStatus.DONE ? 'bg-gray-50' : ''}
              `}
            >
              <div className="flex items-center gap-4 flex-1">
                <button 
                  onClick={() => {
                    const next = task.status === TaskStatus.TODO ? TaskStatus.IN_PROGRESS 
                      : task.status === TaskStatus.IN_PROGRESS ? TaskStatus.DONE 
                      : TaskStatus.TODO;
                    onStatusChange(task._id, next);
                  }}
                  className="hover:scale-110 transition-transform"
                >
                  {getStatusIcon(task.status)}
                </button>
                <div className="flex flex-col">
                  <span className={`font-medium text-gray-800 ${task.status === TaskStatus.DONE ? 'line-through text-gray-400' : ''}`}>
                    {task.title}
                  </span>
                  <span className={`text-xs w-fit px-2 py-0.5 rounded-full mt-1 ${
                    task.status === TaskStatus.DONE ? 'bg-green-100 text-green-700' 
                    : task.status === TaskStatus.IN_PROGRESS ? 'bg-amber-100 text-amber-700' 
                    : 'bg-gray-100 text-gray-600'
                  }`}>
                    {getStatusText(task.status)}
                  </span>
                </div>
              </div>

              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => onDeleteTask(task._id)}
                  className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
