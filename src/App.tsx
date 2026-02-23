import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Settings, Calendar as CalendarIcon, LayoutGrid, Check, Trash2, Plus, Download, Upload, AlertCircle, X, Globe, Pencil, Save } from 'lucide-react';

// --- 多语言字典 ---
const translations = {
  zh: {
    appTitle: 'MatrixTask',
    matrixView: '坐标系视图',
    calendarView: '日历视图',
    taskDetails: '任务详情',
    taskList: '任务列表',
    importance: '重要度',
    urgency: '紧急度',
    markCompleted: '标记为完成',
    markUncompleted: '取消完成',
    clickToView: '点击或悬停画布上的任务查看详情',
    noTasksToday: '当天没有安排任务',
    more: '更多',
    importantNotUrgent: '重要且不紧急 (规划区)',
    importantUrgent: '重要且紧急 (核心区)',
    notImportantNotUrgent: '不重要不紧急 (摸鱼区)',
    urgentNotImportant: '紧急但不重要 (委派区)',
    urgencyAxis: '紧急度 (Urgency) ➔',
    importanceAxis: '重要度 (Importance) ➔',
    preview: '预览',
    weekDays: ['日', '一', '二', '三', '四', '五', '六'],
    newTask: '新建任务',
    taskTitle: '任务标题',
    taskTitlePlaceholder: '例如：准备项目汇报',
    description: '详细内容',
    descPlaceholder: '任务备注信息...',
    taskDate: '任务日期',
    importanceY: '重要程度 (Y轴)',
    urgencyX: '紧急程度 (X轴)',
    addToMatrix: '添加到矩阵',
    settings: '系统设置',
    languageSettings: '语言设置 (Language)',
    dataManagement: '数据管理 (Data)',
    exportData: '导出数据 (Export as JSON)',
    importData: '导入数据 (Import JSON)',
    clearAll: '清空所有数据 (Clear All)',
    generalSettings: '常规 (General)',
    autoStart: '开机自动启动应用',
    minimizeToTray: '关闭窗口时最小化到系统托盘',
    desktopNotice: '* 桌面端功能需配合 Electron/Tauri 打包后生效',
    done: '完成',
    alertNoTitle: '请输入任务标题！',
    alertImportSuccess: '导入成功！',
    alertImportFail: '无效的 JSON 文件！',
    alertClearConfirm: '确定要清空所有任务数据吗？此操作不可恢复！',
    months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    yearSuffix: '年',
    edit: '编辑',
    save: '保存',
    cancel: '取消'
  },
  en: {
    appTitle: 'MatrixTask',
    matrixView: 'Matrix View',
    calendarView: 'Calendar',
    taskDetails: 'Task Details',
    taskList: 'Task List',
    importance: 'Importance',
    urgency: 'Urgency',
    markCompleted: 'Mark Completed',
    markUncompleted: 'Mark Uncompleted',
    clickToView: 'Click or hover on a task in the matrix to view details',
    noTasksToday: 'No tasks scheduled for today',
    more: 'more',
    importantNotUrgent: 'Important & Not Urgent (Schedule)',
    importantUrgent: 'Important & Urgent (Do First)',
    notImportantNotUrgent: 'Not Important & Not Urgent (Eliminate)',
    urgentNotImportant: 'Urgent & Not Important (Delegate)',
    urgencyAxis: 'Urgency ➔',
    importanceAxis: 'Importance ➔',
    preview: 'Preview',
    weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    newTask: 'New Task',
    taskTitle: 'Task Title',
    taskTitlePlaceholder: 'e.g., Prepare project report',
    description: 'Description',
    descPlaceholder: 'Task notes...',
    taskDate: 'Task Date',
    importanceY: 'Importance (Y-axis)',
    urgencyX: 'Urgency (X-axis)',
    addToMatrix: 'Add to Matrix',
    settings: 'Settings',
    languageSettings: 'Language',
    dataManagement: 'Data Management',
    exportData: 'Export Data (JSON)',
    importData: 'Import Data (JSON)',
    clearAll: 'Clear All Data',
    generalSettings: 'General',
    autoStart: 'Auto-start on boot',
    minimizeToTray: 'Minimize to tray on close',
    desktopNotice: '* Desktop features require Electron packaging',
    done: 'Done',
    alertNoTitle: 'Please enter a task title!',
    alertImportSuccess: 'Import successful!',
    alertImportFail: 'Invalid JSON file!',
    alertClearConfirm: 'Are you sure you want to clear all tasks? This action cannot be undone!',
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    yearSuffix: '',
    edit: 'Edit',
    save: 'Save',
    cancel: 'Cancel'
  }
};

// --- 数据模型 ---
const generateUUID = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
const getTodayStr = () => new Date().toISOString().split('T')[0];

const getTaskColor = (importance, urgency) => {
  if (importance >= 50 && urgency >= 50) return 'bg-red-500 border-red-600 text-white';
  if (importance >= 50 && urgency < 50) return 'bg-yellow-400 border-yellow-500 text-slate-800';
  if (importance < 50 && urgency >= 50) return 'bg-orange-400 border-orange-500 text-white';
  return 'bg-green-400 border-green-500 text-slate-800';
};

export default function App() {
  // --- 状态管理 ---
  const [tasks, setTasks] = useState([]);
  const [view, setView] = useState('matrix');
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedDate, setSelectedDate] = useState(getTodayStr());
  const [showSettings, setShowSettings] = useState(false);
  const [language, setLanguage] = useState('zh'); // 'zh' or 'en'

  // 编辑状态管理
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState(null);

  const t = translations[language]; // 当前语言字典

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    importance: 50,
    urgency: 50,
    date: getTodayStr(),
  });

  // --- 初始化与数据持久化 ---
  useEffect(() => {
    const savedTasks = localStorage.getItem('matrix_tasks');
    const savedLang = localStorage.getItem('matrix_lang');

    if (savedLang) setLanguage(savedLang);
    if (savedTasks) {
      try { setTasks(JSON.parse(savedTasks)); }
      catch (e) { console.error('Failed to load tasks', e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('matrix_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('matrix_lang', language);
  }, [language]);

  // 当切换选中任务时，退出编辑模式
  useEffect(() => {
    setIsEditing(false);
  }, [selectedTask?.id]);

  // --- 业务逻辑 ---
  const handleAddTask = () => {
    if (!formData.title.trim()) {
      alert(t.alertNoTitle);
      return;
    }
    const newTask = {
      id: generateUUID(),
      ...formData,
      is_completed: false,
    };
    setTasks([...tasks, newTask]);
    setFormData({ ...formData, title: '', description: '', importance: 50, urgency: 50 });
  };

  const handleUpdateTask = (id, updates) => {
    setTasks(tasks.map(t => (t.id === id ? { ...t, ...updates } : t)));
    if (selectedTask?.id === id) {
      setSelectedTask({ ...selectedTask, ...updates });
    }
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
    if (selectedTask?.id === id) setSelectedTask(null);
  };

  const toggleTaskCompletion = (id) => {
    const task = tasks.find(t => t.id === id);
    if (task) handleUpdateTask(id, { is_completed: !task.is_completed });
  };

  // 编辑逻辑
  const handleStartEdit = () => {
    setEditFormData({ ...selectedTask });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (!editFormData.title.trim()) {
      alert(t.alertNoTitle);
      return;
    }
    handleUpdateTask(selectedTask.id, {
      title: editFormData.title,
      description: editFormData.description,
      date: editFormData.date,
      importance: editFormData.importance,
      urgency: editFormData.urgency
    });
    setIsEditing(false);
  };

  // --- 拖拽逻辑 ---
  const matrixRef = useRef(null);
  const [draggingTask, setDraggingTask] = useState(null);

  const handlePointerDown = (e, task) => {
    if (task.is_completed) return;
    e.stopPropagation();
    e.target.setPointerCapture(e.pointerId);
    setDraggingTask(task);
    setSelectedTask(task);
  };

  const handlePointerMove = (e) => {
    if (!draggingTask || !matrixRef.current) return;

    const rect = matrixRef.current.getBoundingClientRect();
    let x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    let y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));

    let newUrgency = Math.round((x / rect.width) * 100);
    let newImportance = Math.round(((rect.height - y) / rect.height) * 100);

    handleUpdateTask(draggingTask.id, {
      urgency: newUrgency,
      importance: newImportance
    });
  };

  const handlePointerUp = (e) => {
    if (draggingTask) {
      e.target.releasePointerCapture(e.pointerId);
      setDraggingTask(null);
    }
  };

  // --- 日历生成逻辑 ---
  const calendarDays = useMemo(() => {
    const [year, month] = selectedDate.split('-').map(Number);
    const date = new Date(year, month - 1, 1);
    const days = [];
    const firstDay = date.getDay();
    const lastDay = new Date(year, month, 0).getDate();

    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= lastDay; i++) {
      const dayStr = `${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push(dayStr);
    }
    return days;
  }, [selectedDate]);

  return (
    <div className="h-screen w-full flex flex-col bg-slate-100 text-slate-800 font-sans overflow-hidden">
      {/* 顶部工具栏 */}
      <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
            title={t.settings}
          >
            <Settings size={20} />
          </button>
          <span className="font-bold text-lg text-slate-700 tracking-tight">Matrix<span className="text-blue-600">Task</span></span>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setView('matrix')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${view === 'matrix' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <LayoutGrid size={16} />
            {t.matrixView}
          </button>
          <button
            onClick={() => setView('calendar')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${view === 'calendar' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <CalendarIcon size={16} />
            {t.calendarView}
          </button>
        </div>
        <div className="w-20"></div>
      </header>

      {/* 主体布局 */}
      <div className="flex-1 flex overflow-hidden">

        {/* 左侧侧边栏 */}
        <aside className="w-80 bg-white border-r border-slate-200 flex flex-col shadow-[2px_0_8px_-4px_rgba(0,0,0,0.1)] z-10">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="font-semibold text-slate-700 flex items-center gap-2">
              {view === 'matrix' ? t.taskDetails : `${selectedDate} ${t.taskList}`}
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {view === 'matrix' ? (
              selectedTask ? (
                isEditing ? (
                  // ----- 编辑模式视图 -----
                  <div className="space-y-4 animate-in fade-in slide-in-from-left-2 duration-200">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">{t.taskTitle}</label>
                      <input
                        type="text"
                        value={editFormData.title}
                        onChange={e => setEditFormData({...editFormData, title: e.target.value})}
                        className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">{t.taskDate}</label>
                      <input
                        type="date"
                        value={editFormData.date}
                        onChange={e => setEditFormData({...editFormData, date: e.target.value})}
                        className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">{t.description}</label>
                      <textarea
                        rows={3}
                        value={editFormData.description}
                        onChange={e => setEditFormData({...editFormData, description: e.target.value})}
                        className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                      />
                    </div>

                    <div className="pt-2">
                      <label className="flex justify-between text-xs font-medium text-slate-500 mb-1">
                        <span>{t.importanceY}</span>
                        <span className="text-red-500">{editFormData.importance}%</span>
                      </label>
                      <input
                        type="range" min="0" max="100"
                        value={editFormData.importance}
                        onChange={e => setEditFormData({...editFormData, importance: Number(e.target.value)})}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-500"
                      />
                    </div>
                    <div>
                      <label className="flex justify-between text-xs font-medium text-slate-500 mb-1">
                        <span>{t.urgencyX}</span>
                        <span className="text-orange-500">{editFormData.urgency}%</span>
                      </label>
                      <input
                        type="range" min="0" max="100"
                        value={editFormData.urgency}
                        onChange={e => setEditFormData({...editFormData, urgency: Number(e.target.value)})}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                      />
                    </div>

                    <div className="pt-4 flex gap-2">
                      <button
                        onClick={handleSaveEdit}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
                      >
                        <Save size={16} /> {t.save}
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        <X size={16} /> {t.cancel}
                      </button>
                    </div>
                  </div>
                ) : (
                  // ----- 默认查看模式视图 -----
                  <div className="space-y-4 animate-in fade-in slide-in-from-left-2 duration-200">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <h3 className={`text-xl font-bold break-words ${selectedTask.is_completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                          {selectedTask.title}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">{selectedTask.date}</p>
                      </div>
                      <button
                        onClick={handleStartEdit}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title={t.edit}
                      >
                        <Pencil size={16} />
                      </button>
                    </div>

                    {selectedTask.description && (
                      <div className="bg-slate-50 p-3 rounded-md text-sm text-slate-600 whitespace-pre-wrap">
                        {selectedTask.description}
                      </div>
                    )}

                    <div className="space-y-3 pt-2">
                      <div>
                        <div className="flex justify-between text-xs mb-1 font-medium">
                          <span className="text-red-600">{t.importance}</span>
                          <span>{selectedTask.importance}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-red-500 transition-all" style={{ width: `${selectedTask.importance}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1 font-medium">
                          <span className="text-orange-500">{t.urgency}</span>
                          <span>{selectedTask.urgency}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-400 transition-all" style={{ width: `${selectedTask.urgency}%` }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 flex gap-2">
                      <button
                        onClick={() => toggleTaskCompletion(selectedTask.id)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md font-medium text-sm transition-colors ${selectedTask.is_completed ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                      >
                        <Check size={16} />
                        {selectedTask.is_completed ? t.markUncompleted : t.markCompleted}
                      </button>
                      <button
                        onClick={() => handleDeleteTask(selectedTask.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                )
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <AlertCircle size={32} className="mb-2 opacity-50" />
                  <p className="text-sm text-center px-4">{t.clickToView}</p>
                </div>
              )
            ) : (
              <div className="space-y-3">
                {tasks
                  .filter(tk => tk.date === selectedDate)
                  .sort((a, b) => (b.importance + b.urgency) - (a.importance + a.urgency))
                  .map(task => (
                    <div
                      key={task.id}
                      className={`p-3 rounded-lg border-l-4 shadow-sm bg-white cursor-pointer hover:shadow-md transition-all ${task.is_completed ? 'opacity-60 border-slate-300' : getTaskColor(task.importance, task.urgency).split(' ')[1]}`}
                      onClick={() => { setView('matrix'); setSelectedTask(task); }}
                    >
                      <h4 className={`font-medium ${task.is_completed ? 'line-through text-slate-500' : 'text-slate-800'}`}>{task.title}</h4>
                      <div className="flex gap-2 mt-2 text-xs">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">{t.importance}: {task.importance}</span>
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">{t.urgency}: {task.urgency}</span>
                      </div>
                    </div>
                  ))}
                {tasks.filter(tk => tk.date === selectedDate).length === 0 && (
                  <p className="text-center text-slate-400 text-sm mt-10">{t.noTasksToday}</p>
                )}
              </div>
            )}
          </div>
        </aside>

        {/* 中间主区域 */}
        <main className="flex-1 relative bg-slate-50/50 flex flex-col">
          {view === 'matrix' ? (
            <div className="flex-1 p-6 flex flex-col">
              <div className="mb-4 flex justify-between items-center text-sm font-medium text-slate-500 px-2">
                <span>{t.importantNotUrgent}</span>
                <span className="text-red-500">{t.importantUrgent}</span>
              </div>
              <div
                ref={matrixRef}
                className="flex-1 relative bg-white rounded-xl shadow-inner border-2 border-slate-200 overflow-hidden touch-none"
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
              >
                <div className="absolute top-0 bottom-0 left-1/2 w-px bg-slate-200 border-l border-dashed border-slate-300"></div>
                <div className="absolute left-0 right-0 top-1/2 h-px bg-slate-200 border-t border-dashed border-slate-300"></div>
                <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-red-50/30 pointer-events-none"></div>

                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-slate-400 pointer-events-none">{t.urgencyAxis}</div>
                <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 origin-left text-xs text-slate-400 pointer-events-none">{t.importanceAxis}</div>

                {/* 过滤掉已完成的任务，使其在坐标系中隐藏 */}
                {tasks.filter(task => !task.is_completed).map(task => {
                  const isSelected = selectedTask?.id === task.id;
                  const isDragging = draggingTask?.id === task.id;
                  return (
                    <div
                      key={task.id}
                      onPointerDown={(e) => handlePointerDown(e, task)}
                      onClick={() => setSelectedTask(task)}
                      className={`absolute w-12 h-12 -ml-6 -mb-6 rounded-full flex items-center justify-center text-xs font-bold shadow-sm cursor-grab border-2 transition-transform duration-100 select-none
                        ${getTaskColor(task.importance, task.urgency)}
                        ${isSelected ? 'ring-4 ring-blue-300/50 scale-110 z-20' : 'hover:scale-105 z-10'}
                        ${isDragging ? 'cursor-grabbing scale-110 shadow-lg' : ''}
                      `}
                      style={{ left: `${task.urgency}%`, bottom: `${task.importance}%` }}
                      title={task.title}
                    >
                      {task.title.substring(0, 2)}
                    </div>
                  );
                })}

                {formData.title && !selectedTask && (
                   <div className="absolute w-10 h-10 -ml-5 -mb-5 rounded-full bg-blue-400/50 border-2 border-blue-500 border-dashed flex items-center justify-center text-xs text-white pointer-events-none z-0 animate-pulse"
                   style={{ left: `${formData.urgency}%`, bottom: `${formData.importance}%` }}>
                     {t.preview}
                   </div>
                )}
              </div>
              <div className="mt-4 flex justify-between items-center text-sm font-medium text-slate-500 px-2">
                <span>{t.notImportantNotUrgent}</span>
                <span className="text-orange-500">{t.urgentNotImportant}</span>
              </div>
            </div>
          ) : (
            <div className="flex-1 p-8 flex flex-col items-center">
              <div className="max-w-4xl w-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-slate-700">
                    {language === 'zh'
                      ? `${selectedDate.split('-')[0]}${t.yearSuffix} ${t.months[parseInt(selectedDate.split('-')[1]) - 1]}`
                      : `${t.months[parseInt(selectedDate.split('-')[1]) - 1]} ${selectedDate.split('-')[0]}`
                    }
                  </h2>
                  <input
                    type="month"
                    value={selectedDate.substring(0, 7)}
                    onChange={(e) => setSelectedDate(e.target.value + '-01')}
                    className="p-1 border rounded text-sm outline-none"
                  />
                </div>

                <div className="grid grid-cols-7 gap-px bg-slate-200">
                  {t.weekDays.map(day => (
                    <div key={day} className="bg-slate-100 p-2 text-center text-sm font-semibold text-slate-600">
                      {day}
                    </div>
                  ))}

                  {calendarDays.map((dateStr, idx) => {
                    if (!dateStr) return <div key={`empty-${idx}`} className="bg-slate-50/50 min-h-[100px]"></div>;

                    const dayTasks = tasks.filter(tk => tk.date === dateStr);
                    const isSelected = dateStr === selectedDate;
                    const isToday = dateStr === getTodayStr();

                    return (
                      <div
                        key={dateStr}
                        onClick={() => setSelectedDate(dateStr)}
                        className={`min-h-[100px] bg-white p-2 cursor-pointer transition-colors border-2 ${isSelected ? 'border-blue-500' : 'border-transparent hover:bg-slate-50'}`}
                      >
                        <div className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-blue-600 text-white' : 'text-slate-700'}`}>
                          {dateStr.split('-')[2]}
                        </div>
                        <div className="mt-1 space-y-1">
                          {/* 日历中的任务加上了 line-through */}
                          {dayTasks.slice(0, 3).map(task => (
                            <div key={task.id} className={`text-xs p-1 rounded truncate text-white ${getTaskColor(task.importance, task.urgency).split(' ')[0]} ${task.is_completed ? 'opacity-50 line-through' : ''}`}>
                              {task.title}
                            </div>
                          ))}
                          {dayTasks.length > 3 && (
                            <div className="text-xs text-slate-400 font-medium pl-1">+{dayTasks.length - 3} {t.more}</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </main>

        {/* 右侧侧边栏 */}
        <aside className="w-80 bg-white border-l border-slate-200 flex flex-col shadow-[-2px_0_8px_-4px_rgba(0,0,0,0.1)] z-10">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="font-semibold text-slate-700 flex items-center gap-2">
              <Plus size={18} /> {t.newTask}
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.taskTitle}</label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder={t.taskTitlePlaceholder}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.description}</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder={t.descPlaceholder}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.taskDate}</label>
              <input
                type="date"
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            <div className="pt-2 border-t border-slate-100">
              <label className="flex justify-between text-sm font-medium text-slate-700 mb-2">
                <span>{t.importanceY}</span>
                <span className="text-red-500">{formData.importance}%</span>
              </label>
              <input
                type="range" min="0" max="100"
                value={formData.importance}
                onChange={e => setFormData({...formData, importance: Number(e.target.value)})}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
            </div>

            <div>
              <label className="flex justify-between text-sm font-medium text-slate-700 mb-2">
                <span>{t.urgencyX}</span>
                <span className="text-orange-500">{formData.urgency}%</span>
              </label>
              <input
                type="range" min="0" max="100"
                value={formData.urgency}
                onChange={e => setFormData({...formData, urgency: Number(e.target.value)})}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>

            <div className="pt-4">
              <button
                onClick={handleAddTask}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-md font-medium shadow-sm transition-colors"
              >
                <Plus size={18} /> {t.addToMatrix}
              </button>
            </div>
          </div>
        </aside>

      </div>

      {/* 设置模态框 */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-lg text-slate-700 flex items-center gap-2">
                <Settings size={20} /> {t.settings}
              </h3>
              <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">

              {/* Language Section */}
              <section>
                <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Globe size={16} /> {t.languageSettings}
                </h4>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                  <button
                    onClick={() => setLanguage('zh')}
                    className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-all ${language === 'zh' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    简体中文
                  </button>
                  <button
                    onClick={() => setLanguage('en')}
                    className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-all ${language === 'en' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    English
                  </button>
                </div>
              </section>

              {/* Data Section */}
              <section>
                <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-3">{t.dataManagement}</h4>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks));
                      const anchor = document.createElement('a');
                      anchor.setAttribute("href", dataStr);
                      anchor.setAttribute("download", "matrixtask_backup.json");
                      anchor.click();
                    }}
                    className="w-full flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 transition-colors"
                  >
                    <Download size={16} className="text-blue-500"/> {t.exportData}
                  </button>

                  <label className="w-full flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 transition-colors cursor-pointer">
                    <Upload size={16} className="text-green-500"/> {t.importData}
                    <input
                      type="file"
                      accept=".json"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          try {
                            const importedTasks = JSON.parse(event.target.result);
                            setTasks(importedTasks);
                            alert(t.alertImportSuccess);
                          } catch(err) {
                            alert(t.alertImportFail);
                          }
                        };
                        reader.readAsText(file);
                      }}
                    />
                  </label>

                  <button
                    onClick={() => {
                      if(window.confirm(t.alertClearConfirm)) {
                        setTasks([]);
                        setSelectedTask(null);
                      }
                    }}
                    className="w-full flex items-center gap-3 p-3 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg text-sm font-medium text-red-600 transition-colors"
                  >
                    <Trash2 size={16} /> {t.clearAll}
                  </button>
                </div>
              </section>

              {/* General Section */}
              <section>
                <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-3">{t.generalSettings}</h4>
                <div className="space-y-2">
                  <label className="flex items-center justify-between p-2 rounded hover:bg-slate-50">
                    <span className="text-sm text-slate-700">{t.autoStart}</span>
                    <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" disabled />
                  </label>
                  <label className="flex items-center justify-between p-2 rounded hover:bg-slate-50">
                    <span className="text-sm text-slate-700">{t.minimizeToTray}</span>
                    <input type="checkbox" defaultChecked className="rounded text-blue-600 focus:ring-blue-500" disabled />
                  </label>
                  <p className="text-xs text-slate-400 px-2 mt-1">{t.desktopNotice}</p>
                </div>
              </section>
            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-md hover:bg-slate-700 transition-colors"
              >
                {t.done}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}