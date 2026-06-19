import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlus, FiSearch, FiGrid, FiColumns } from 'react-icons/fi';
import { useTasks, useProjects, useUsers, updateTask } from '../../hooks/useFirestore';
import { useAuth } from '../../context/AuthContext';
import { useTopBar } from '../../context/TopBarContext';
import { filterTasksByDay } from '../../utils/dayFilter';
import { BRANCHES, TASK_STATUSES } from '../../constants';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import KanbanBoard from './KanbanBoard';
import './TaskList.css';
import './KanbanBoard.css';

export default function TaskList() {
  const { tasks, loading } = useTasks();
  const { projects } = useProjects();
  const { users } = useUsers();
  const { user, canManageAllBranches, userProfile } = useAuth();
  const { selectedDay, todayIndex } = useTopBar();
  const location = useLocation();

  const [view, setView] = useState('grid');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [search, setSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const dayFilteredTasks = useMemo(
    () => filterTasksByDay(tasks, selectedDay, todayIndex),
    [tasks, selectedDay, todayIndex]
  );

  const filteredTasks = useMemo(() => {
    return dayFilteredTasks.filter((task) => {
      const matchesSearch =
        !search ||
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description?.toLowerCase().includes(search.toLowerCase());

      const matchesBranch = branchFilter === 'all' || task.branchId === branchFilter;
      const matchesStatus = view === 'kanban' || statusFilter === 'all' || task.status === statusFilter;

      let matchesDate = true;
      if (dateFilter !== 'all' && task.createdAt) {
        const taskDate = new Date(task.createdAt);
        const now = new Date();
        if (dateFilter === 'today') {
          matchesDate = taskDate.toDateString() === now.toDateString();
        } else if (dateFilter === 'week') {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = taskDate >= weekAgo;
        } else if (dateFilter === 'month') {
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = taskDate >= monthAgo;
        }
      }

      return matchesSearch && matchesBranch && matchesStatus && matchesDate;
    });
  }, [dayFilteredTasks, search, branchFilter, statusFilter, dateFilter, view]);

  function handleEdit(task) {
    setEditingTask(task);
    setShowForm(true);
  }

  function handleCloseForm() {
    setShowForm(false);
    setEditingTask(null);
  }

  async function handleStatusChange(taskId, newStatus, task) {
    await updateTask(taskId, { status: newStatus }, user, task);
  }

  useEffect(() => {
    if (location.state?.openForm) {
      setShowForm(true);
      window.history.replaceState({}, document.title);
    }
    if (location.state?.editTaskId && tasks.length) {
      const task = tasks.find((t) => t.id === location.state.editTaskId);
      if (task) {
        setEditingTask(task);
        setShowForm(true);
      }
      window.history.replaceState({}, document.title);
    }
  }, [location.state, tasks]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="task-list-page">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1>Tasks</h1>
          <p>Manage and track tasks across all branches</p>
        </div>
        <div className="page-header-actions">
          <div className="view-toggle">
            <button
              type="button"
              className={view === 'grid' ? 'active' : ''}
              onClick={() => setView('grid')}
            >
              <FiGrid /> Grid
            </button>
            <button
              type="button"
              className={view === 'kanban' ? 'active' : ''}
              onClick={() => setView('kanban')}
            >
              <FiColumns /> Kanban
            </button>
          </div>
          <button type="button" className="btn btn-primary" onClick={() => setShowForm(true)}>
            <FiPlus />
            New Task
          </button>
        </div>
      </motion.div>

      <div className="filters-bar">
        <div className="search-input">
          <FiSearch />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {canManageAllBranches && (
          <select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)}>
            <option value="all">All Branches</option>
            {BRANCHES.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        )}

        {view === 'grid' && (
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Statuses</option>
            {TASK_STATUSES.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        )}

        <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
          <option value="all">All Dates</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      <p className="results-count">
        Showing {filteredTasks.length} of {tasks.length} tasks
        {view === 'kanban' && ' · Drag cards between columns to update status'}
      </p>

      {filteredTasks.length === 0 ? (
        <EmptyState
          icon={FiPlus}
          title="No tasks found"
          description={
            tasks.length === 0
              ? 'Create your first task to get started.'
              : 'Try adjusting your search or filters.'
          }
          action={
            tasks.length === 0 && (
              <button type="button" className="btn btn-primary" onClick={() => setShowForm(true)}>
                <FiPlus /> Create Task
              </button>
            )
          }
        />
      ) : view === 'kanban' ? (
        <KanbanBoard
          tasks={filteredTasks}
          projects={projects}
          users={users}
          onStatusChange={handleStatusChange}
          onEdit={handleEdit}
        />
      ) : (
        <div className="task-grid">
          {filteredTasks.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              projects={projects}
              users={users}
              onEdit={handleEdit}
              delay={index * 0.05}
            />
          ))}
        </div>
      )}

      {showForm && (
        <TaskForm
          task={editingTask}
          projects={projects}
          users={users}
          defaultBranch={userProfile?.branchId}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}
