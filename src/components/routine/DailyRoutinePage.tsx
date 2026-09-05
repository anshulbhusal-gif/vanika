import React, { useState, useEffect } from 'react';
import { Plus, Check, Edit3, Trash2, Sun, Cloud, Moon, Clock, X, Save } from 'lucide-react';
import { RoutineTask } from '../../types';
import { DEFAULT_ROUTINE_TASKS } from '../../data/mockData';
import { apiClient } from '../../services/api/apiClient';

export const DailyRoutinePage: React.FC = () => {
  const [tasks, setTasks] = useState<RoutineTask[]>(() => {
    const saved = localStorage.getItem('vanika_routine');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* fallback */ }
    }
    return DEFAULT_ROUTINE_TASKS;
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState<RoutineTask | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newPeriod, setNewPeriod] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  const [newIcon, setNewIcon] = useState('📋');

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const data = await apiClient.get<any[]>('/routines');
        if (Array.isArray(data) && data.length > 0) {
          const mapped: RoutineTask[] = data.map((r: any) => ({
            id: r.id,
            title: r.title,
            time: r.time || '12:00 PM',
            period: (r.period || 'morning').toLowerCase() as 'morning' | 'afternoon' | 'evening',
            icon: r.icon || '📋',
            completed: r.isCompleted ?? r.completed ?? false,
          }));
          setTasks(mapped);
          localStorage.setItem('vanika_routine', JSON.stringify(mapped));
        }
      } catch (err) {
        // Fall back to stored state
      }
    };
    fetchRoutines();
  }, []);

  const saveTasks = (updated: RoutineTask[]) => {
    setTasks(updated);
    localStorage.setItem('vanika_routine', JSON.stringify(updated));
  };

  const toggleCompleted = async (id: string) => {
    const target = tasks.find(t => t.id === id);
    const updated = tasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    saveTasks(updated);

    try {
      if (target) {
        await apiClient.post(`/routines/${id}/complete`, { completed: !target.completed });
      }
    } catch (err) {
      // Optimistic update retained locally
    }
  };

  const deleteTask = async (id: string) => {
    saveTasks(tasks.filter(t => t.id !== id));
    try {
      await apiClient.delete(`/routines/${id}`);
    } catch (err) {
      // Retained locally
    }
  };

  const handleAddTask = async () => {
    if (!newTitle.trim()) return;
    const newTask: RoutineTask = {
      id: `r-${Date.now()}`,
      time: newTime || '12:00 PM',
      title: newTitle,
      icon: newIcon,
      period: newPeriod,
      completed: false,
    };
    const updated = [...tasks, newTask];
    saveTasks(updated);
    resetForm();

    try {
      const created = await apiClient.post<any>('/routines', {
        title: newTitle,
        time: newTime || '12:00 PM',
        period: newPeriod.toUpperCase(),
        icon: newIcon,
      });
      if (created && created.id) {
        setTasks(prev => prev.map(t => t.id === newTask.id ? { ...t, id: created.id } : t));
      }
    } catch (err) {
      // Kept with local id
    }
  };

  const handleEditSave = async () => {
    if (!editingTask || !newTitle.trim()) return;
    const updated = tasks.map(t =>
      t.id === editingTask.id
        ? { ...t, title: newTitle, time: newTime, period: newPeriod, icon: newIcon }
        : t
    );
    saveTasks(updated);

    try {
      await apiClient.patch(`/routines/${editingTask.id}`, {
        title: newTitle,
        time: newTime,
        period: newPeriod.toUpperCase(),
        icon: newIcon,
      });
    } catch (err) {
      // Kept locally
    }

    setEditingTask(null);
    resetForm();
  };

  const startEdit = (task: RoutineTask) => {
    setEditingTask(task);
    setNewTitle(task.title);
    setNewTime(task.time);
    setNewPeriod(task.period);
    setNewIcon(task.icon);
    setShowAddModal(true);
  };

  const resetForm = () => {
    setShowAddModal(false);
    setEditingTask(null);
    setNewTitle('');
    setNewTime('');
    setNewPeriod('morning');
    setNewIcon('📋');
  };

  const morningTasks = tasks.filter(t => t.period === 'morning');
  const afternoonTasks = tasks.filter(t => t.period === 'afternoon');
  const eveningTasks = tasks.filter(t => t.period === 'evening');
  const completedCount = tasks.filter(t => t.completed).length;

  const ICON_OPTIONS = ['📋', '💊', '🍵', '🚶', '🧩', '🍛', '😴', '🎯', '☕', '📞', '🍽️', '🎶', '🌙', '🌅', '🧘', '📖'];

  const renderPeriod = (
    label: string,
    icon: React.ReactNode,
    periodTasks: RoutineTask[],
  ) => (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#1E3A2F] text-[#D4AF37] flex items-center justify-center">
            {icon}
          </div>
          <h2 className="font-display text-2xl font-bold text-[#1A2F24] dark:text-[#F2EDE3]">{label}</h2>
        </div>
        <span className="font-mono-label text-xs text-[#7B9E87]">
          {periodTasks.filter(t => t.completed).length}/{periodTasks.length} COMPLETED
        </span>
      </div>

      <div className="space-y-4">
        {periodTasks.map((task) => (
          <div
            key={task.id}
            className={`card-story p-5 flex items-center gap-4 transition-all ${
              task.completed
                ? 'bg-[#7B9E87]/10 border-[#7B9E87]'
                : 'bg-white dark:bg-[#162A1F] border-[#2D4739]/15 dark:border-[#D4AF37]/20 hover:border-[#D4AF37]'
            }`}
          >
            {/* Completion Button — Large Touch Target (min 52px) */}
            <button
              onClick={() => toggleCompleted(task.id)}
              className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center shrink-0 cursor-pointer transition-all ${
                task.completed
                  ? 'bg-[#1E3A2F] border-[#D4AF37] text-[#D4AF37] shadow-md'
                  : 'bg-[#FDFBF7] dark:bg-[#0F2219] border-[#2D4739]/20 dark:border-[#D4AF37]/30 text-transparent hover:border-[#D4AF37]'
              }`}
              aria-label={task.completed ? 'Mark as incomplete' : 'Mark as completed'}
            >
              <Check className="w-7 h-7 stroke-[3]" />
            </button>

            {/* Icon */}
            <span className="text-3xl shrink-0">{task.icon}</span>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <span className={`block font-display text-lg font-bold ${
                task.completed ? 'text-[#5A7265] dark:text-[#9DBFB0] line-through' : 'text-[#1A2F24] dark:text-[#F2EDE3]'
              }`}>
                {task.title}
              </span>
              <span className="flex items-center gap-1.5 font-mono-label text-xs text-[#7B9E87] mt-1">
                <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                {task.time}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => startEdit(task)}
                className="w-9 h-9 rounded-xl hover:bg-[#F5EEE2] dark:hover:bg-[#1A3328] text-[#5A7265] dark:text-[#9DBFB0] flex items-center justify-center cursor-pointer transition-colors"
                aria-label="Edit task"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="w-9 h-9 rounded-xl hover:bg-[#C06A44]/15 text-[#C06A44] flex items-center justify-center cursor-pointer transition-colors"
                aria-label="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {periodTasks.length === 0 && (
          <div className="card-story bg-white dark:bg-[#162A1F] p-6 text-center border border-[#2D4739]/10">
            <p className="text-xs text-[#5A7265] dark:text-[#9DBFB0]">
              No tasks scheduled for this period. Tap "+ Add Task" above.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0C1A11] py-8 sm:py-12" id="view-daily-routine">
      <div className="section-max max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center text-xl">
              📋
            </div>
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1A2F24] dark:text-[#F2EDE3] tracking-tight">
                Daily Routine
              </h1>
              <p className="text-sm text-[#5A7265] dark:text-[#9DBFB0] mt-0.5">
                {completedCount} of {tasks.length} routine moments completed today
              </p>
            </div>
          </div>

          <button
            onClick={() => { resetForm(); setShowAddModal(true); }}
            className="btn-primary py-3 px-5 text-xs"
            id="btn-add-routine"
          >
            <Plus className="w-4 h-4 text-[#D4AF37]" />
            <span>Add Task</span>
          </button>
        </div>

        {/* Routine Progress Bar */}
        <div className="card-story bg-white dark:bg-[#162A1F] p-6 border border-[#2D4739]/15 dark:border-[#D4AF37]/20">
          <div className="w-full h-3 rounded-full bg-[#F5EEE2] dark:bg-[#1A3328] overflow-hidden mb-3">
            <div
              className="h-full rounded-full bg-[#D4AF37] transition-all duration-500"
              style={{ width: `${tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0}%` }}
            />
          </div>
          <p className="text-xs font-semibold text-[#7B9E87] text-center">
            {completedCount === tasks.length && tasks.length > 0
              ? '🎉 All routine moments completed! Wonderful job today!'
              : `${tasks.length - completedCount} tasks remaining — taking one gentle step at a time!`}
          </p>
        </div>

        {/* Periods */}
        {renderPeriod('Morning Routine', <Sun className="w-5 h-5 text-[#D4AF37]" />, morningTasks)}
        {renderPeriod('Afternoon Routine', <Cloud className="w-5 h-5 text-[#7B9E87]" />, afternoonTasks)}
        {renderPeriod('Evening Routine', <Moon className="w-5 h-5 text-[#D4AF37]" />, eveningTasks)}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-slide-up">
          <div className="card-story w-full max-w-md bg-white dark:bg-[#162A1F] p-8 border border-[#D4AF37]/30 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-2xl font-bold text-[#1A2F24] dark:text-[#F2EDE3]">
                {editingTask ? 'Edit Routine Task' : 'Add Routine Task'}
              </h3>
              <button
                onClick={resetForm}
                className="w-8 h-8 rounded-full bg-[#F5EEE2] dark:bg-[#1A3328] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4 text-[#5A7265]" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1A2F24] dark:text-[#F2EDE3] mb-2 uppercase tracking-wider">Task Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Morning Red Tea (Lal Saah)"
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#FDFBF7] dark:bg-[#0F2219] border border-[#2D4739]/20 dark:border-[#D4AF37]/30 text-[#1A2F24] dark:text-[#F2EDE3] focus:outline-none focus:border-[#D4AF37]"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A2F24] dark:text-[#F2EDE3] mb-2 uppercase tracking-wider">Time</label>
                <input
                  type="text"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  placeholder="e.g., 7:30 AM"
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#FDFBF7] dark:bg-[#0F2219] border border-[#2D4739]/20 dark:border-[#D4AF37]/30 text-[#1A2F24] dark:text-[#F2EDE3] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A2F24] dark:text-[#F2EDE3] mb-2 uppercase tracking-wider">Time of Day</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['morning', 'afternoon', 'evening'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setNewPeriod(p)}
                      className={`py-3 px-2 rounded-xl text-xs font-bold capitalize cursor-pointer border transition-all ${
                        newPeriod === p
                          ? 'bg-[#1E3A2F] text-[#D4AF37] border-[#D4AF37]'
                          : 'bg-[#FDFBF7] dark:bg-[#0F2219] text-[#5A7265] border-[#2D4739]/15'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A2F24] dark:text-[#F2EDE3] mb-2 uppercase tracking-wider">Icon</label>
                <div className="flex flex-wrap gap-2">
                  {ICON_OPTIONS.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setNewIcon(icon)}
                      className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center cursor-pointer border transition-all ${
                        newIcon === icon
                          ? 'bg-[#D4AF37]/20 border-[#D4AF37]'
                          : 'bg-[#FDFBF7] dark:bg-[#0F2219] border-[#2D4739]/15'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={resetForm}
                className="btn-ghost flex-1 py-3 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={editingTask ? handleEditSave : handleAddTask}
                className="btn-primary flex-1 py-3 text-xs"
              >
                <Save className="w-4 h-4 text-[#D4AF37]" />
                <span>{editingTask ? 'Save Changes' : 'Add Task'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
