import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';
import { useTasks } from '../store/TaskContext';

interface RightSidebarProps {
  selectedDate: Date;
}

export default function RightSidebar({ selectedDate }: RightSidebarProps) {
  const { addTask } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [importance, setImportance] = useState(50);
  const [urgency, setUrgency] = useState(50);
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    setStartDate(format(selectedDate, 'yyyy-MM-dd'));
  }, [selectedDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      description: description.trim(),
      importance,
      urgency,
      start_date: startDate ? new Date(startDate).toISOString() : null,
      end_date: endDate ? new Date(endDate).toISOString() : null,
      is_completed: false,
    });

    setTitle('');
    setDescription('');
    setImportance(50);
    setUrgency(50);
    setEndDate('');
  };

  return (
    <aside className="w-80 bg-white dark:bg-slate-950 shrink-0 overflow-y-auto border-l border-slate-200 dark:border-slate-800 p-6">
      <h2 className="text-lg font-semibold mb-6 flex items-center">
        <Plus size={20} className="mr-2 text-indigo-500" />
        Add New Task
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
            placeholder="What needs to be done?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white resize-none"
            placeholder="Add details..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-sm"
            />
          </div>
        </div>

        <div className="pt-2">
          <div className="flex justify-between text-sm mb-1">
            <label className="font-medium text-slate-700 dark:text-slate-300">Importance</label>
            <span className="text-slate-500">{importance}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={importance}
            onChange={(e) => setImportance(Number(e.target.value))}
            className="w-full accent-indigo-500"
          />
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <label className="font-medium text-slate-700 dark:text-slate-300">Urgency</label>
            <span className="text-slate-500">{urgency}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={urgency}
            onChange={(e) => setUrgency(Number(e.target.value))}
            className="w-full accent-rose-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors mt-4"
        >
          Add Task
        </button>
      </form>
    </aside>
  );
}
