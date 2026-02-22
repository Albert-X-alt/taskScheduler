import React from 'react';
import { format, isSameDay } from 'date-fns';
import { CheckCircle2, Circle, Trash2, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { ViewMode, Task } from '../types';
import { useTasks } from '../store/TaskContext';
import { cn } from '../utils/cn';

interface LeftSidebarProps {
  viewMode: ViewMode;
  selectedTask: Task | null;
  selectedDate: Date;
  onTaskSelect: (task: Task | null) => void;
}

export default function LeftSidebar({ viewMode, selectedTask, selectedDate, onTaskSelect }: LeftSidebarProps) {
  const { tasks, updateTask, deleteTask } = useTasks();

  const renderMatrixSidebar = () => {
    if (!selectedTask) {
      const todayTasks = tasks.filter(t => {
        if (!t.start_date) return false;
        return isSameDay(new Date(t.start_date), new Date());
      });

      return (
        <div className="p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
            Today's Overview
          </h2>
          {todayTasks.length === 0 ? (
            <p className="text-sm text-slate-400 dark:text-slate-500">No tasks scheduled for today.</p>
          ) : (
            <ul className="space-y-3">
              {todayTasks.map(task => (
                <li 
                  key={task.id} 
                  className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm cursor-pointer hover:border-indigo-300 transition-colors"
                  onClick={() => onTaskSelect(task)}
                >
                  <div className="font-medium text-sm truncate">{task.title}</div>
                  <div className="flex items-center mt-2 text-xs text-slate-500">
                    <span className="flex items-center mr-3"><Clock size={12} className="mr-1" /> {Math.round(task.urgency)}%</span>
                    <span className="flex items-center"><CalendarIcon size={12} className="mr-1" /> {Math.round(task.importance)}%</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    }

    return (
      <div className="p-4 flex flex-col h-full">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-lg font-semibold leading-tight">{selectedTask.title}</h2>
          <button 
            onClick={() => onTaskSelect(null)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            &times;
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {selectedTask.description && (
            <div className="mb-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Description</h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{selectedTask.description}</p>
            </div>
          )}

          <div className="space-y-4 mb-6">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-600 dark:text-slate-400">Importance</span>
                <span>{Math.round(selectedTask.importance)}%</span>
              </div>
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 rounded-full" 
                  style={{ width: `${selectedTask.importance}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-600 dark:text-slate-400">Urgency</span>
                <span>{Math.round(selectedTask.urgency)}%</span>
              </div>
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-rose-500 rounded-full" 
                  style={{ width: `${selectedTask.urgency}%` }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2 mb-6 text-sm">
            {selectedTask.start_date && (
              <div className="flex items-center text-slate-600 dark:text-slate-400">
                <CalendarIcon size={14} className="mr-2" />
                <span>Start: {format(new Date(selectedTask.start_date), 'MMM d, yyyy')}</span>
              </div>
            )}
            {selectedTask.end_date && (
              <div className="flex items-center text-slate-600 dark:text-slate-400">
                <Clock size={14} className="mr-2" />
                <span>Due: {format(new Date(selectedTask.end_date), 'MMM d, yyyy')}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800 flex space-x-2">
          <button
            onClick={() => updateTask(selectedTask.id, { is_completed: !selectedTask.is_completed })}
            className={cn(
              "flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-colors",
              selectedTask.is_completed
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-200"
                : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            )}
          >
            {selectedTask.is_completed ? (
              <><CheckCircle2 size={16} className="mr-2" /> Completed</>
            ) : (
              <><Circle size={16} className="mr-2" /> Mark Complete</>
            )}
          </button>
          
          <button
            onClick={() => {
              deleteTask(selectedTask.id);
              onTaskSelect(null);
            }}
            className="p-2 text-rose-600 bg-rose-50 dark:bg-rose-900/20 rounded-md hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
            title="Delete Task"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    );
  };

  const renderCalendarSidebar = () => {
    const dayTasks = tasks
      .filter(t => {
        if (!t.start_date) return false;
        return isSameDay(new Date(t.start_date), selectedDate);
      })
      .sort((a, b) => (b.importance + b.urgency) - (a.importance + a.urgency));

    return (
      <div className="p-4 h-full flex flex-col">
        <h2 className="text-lg font-semibold mb-6">
          {format(selectedDate, 'EEEE, MMMM d')}
        </h2>
        
        <div className="flex-1 overflow-y-auto">
          {dayTasks.length === 0 ? (
            <p className="text-sm text-slate-400 dark:text-slate-500 text-center mt-10">No tasks for this date.</p>
          ) : (
            <ul className="space-y-3">
              {dayTasks.map(task => (
                <li 
                  key={task.id} 
                  className={cn(
                    "p-3 rounded-lg border shadow-sm transition-colors",
                    task.is_completed 
                      ? "bg-slate-50 border-slate-200 opacity-60 dark:bg-slate-800/50 dark:border-slate-700" 
                      : "bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className={cn("font-medium text-sm", task.is_completed && "line-through text-slate-500")}>
                      {task.title}
                    </div>
                    <button 
                      onClick={() => updateTask(task.id, { is_completed: !task.is_completed })}
                      className="text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      {task.is_completed ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Circle size={16} />}
                    </button>
                  </div>
                  
                  <div className="flex items-center mt-3 gap-2">
                    <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden flex">
                      <div className="bg-indigo-500 h-full" style={{ width: `${task.importance}%` }} title="Importance" />
                    </div>
                    <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden flex">
                      <div className="bg-rose-500 h-full" style={{ width: `${task.urgency}%` }} title="Urgency" />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  };

  return (
    <aside className="w-72 bg-slate-50/50 dark:bg-slate-900/50 shrink-0 overflow-hidden flex flex-col">
      {viewMode === 'matrix' ? renderMatrixSidebar() : renderCalendarSidebar()}
    </aside>
  );
}
