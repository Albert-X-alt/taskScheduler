import React from 'react';
import { Settings, LayoutGrid, Calendar } from 'lucide-react';
import { ViewMode } from '../types';
import { cn } from '../utils/cn';

interface TopBarProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onOpenSettings: () => void;
}

export default function TopBar({ viewMode, setViewMode, onOpenSettings }: TopBarProps) {
  return (
    <header className="h-14 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center">
        <button 
          onClick={onOpenSettings}
          className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
          title="Settings"
        >
          <Settings size={20} />
        </button>
        <div className="ml-4 font-semibold text-lg tracking-tight">MatrixTask</div>
      </div>

      <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
        <button
          onClick={() => setViewMode('matrix')}
          className={cn(
            "flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-all",
            viewMode === 'matrix' 
              ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm" 
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          )}
        >
          <LayoutGrid size={16} className="mr-2" />
          Matrix
        </button>
        <button
          onClick={() => setViewMode('calendar')}
          className={cn(
            "flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-all",
            viewMode === 'calendar' 
              ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm" 
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          )}
        >
          <Calendar size={16} className="mr-2" />
          Calendar
        </button>
      </div>
      
      <div className="w-10"></div> {/* Spacer for centering */}
    </header>
  );
}
