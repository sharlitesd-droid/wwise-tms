import { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch,
  FiHome,
  FiCheckSquare,
  FiFolder,
  FiBarChart2,
  FiUsers,
  FiPlus,
  FiCommand,
} from 'react-icons/fi';
import { useTasks } from '../../hooks/useFirestore';
import { useAuth } from '../../context/AuthContext';
import { getBranchName, getStatusLabel } from '../../constants';
import './CommandPalette.css';

const PAGES = [
  { id: 'home', label: 'Dashboard', icon: FiHome, path: '/' },
  { id: 'tasks', label: 'Tasks', icon: FiCheckSquare, path: '/tasks' },
  { id: 'projects', label: 'Projects', icon: FiFolder, path: '/projects' },
  { id: 'reports', label: 'Reports', icon: FiBarChart2, path: '/reports' },
  { id: 'users', label: 'User Management', icon: FiUsers, path: '/users', adminOnly: true },
  { id: 'new-task', label: 'Create New Task', icon: FiPlus, path: '/tasks', action: 'new' },
];

export default function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const navigate = useNavigate();
  const { tasks } = useTasks();
  const { canManageUsers } = useAuth();

  const pages = PAGES.filter((p) => !p.adminOnly || canManageUsers);

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) {
      return [
        ...pages.map((p) => ({ type: 'page', ...p })),
        ...tasks.slice(0, 5).map((t) => ({ type: 'task', task: t })),
      ];
    }

    const matchedPages = pages
      .filter((p) => p.label.toLowerCase().includes(q))
      .map((p) => ({ type: 'page', ...p }));

    const matchedTasks = tasks
      .filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q) ||
          getBranchName(t.branchId).toLowerCase().includes(q)
      )
      .slice(0, 8)
      .map((t) => ({ type: 'task', task: t }));

    return [...matchedPages, ...matchedTasks];
  }, [query, pages, tasks]);

  const execute = useCallback(
    (item) => {
      if (item.type === 'page') {
        navigate(item.path, item.action === 'new' ? { state: { openForm: true } } : undefined);
      } else if (item.type === 'task') {
        navigate('/tasks', { state: { editTaskId: item.task.id } });
      }
      onClose();
      setQuery('');
      setSelected(0);
    },
    [navigate, onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    setSelected(0);
  }, [query, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelected((s) => Math.min(s + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelected((s) => Math.max(s - 1, 0));
      } else if (e.key === 'Enter' && results[selected]) {
        e.preventDefault();
        execute(results[selected]);
      } else if (e.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selected, execute, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="cmd-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="cmd-palette"
            initial={{ opacity: 0, scale: 0.96, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cmd-search">
              <FiSearch />
              <input
                autoFocus
                type="text"
                placeholder="Search tasks, pages, actions..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <kbd className="cmd-kbd">ESC</kbd>
            </div>

            <div className="cmd-results">
              {results.length === 0 ? (
                <p className="cmd-empty">No results found</p>
              ) : (
                results.map((item, i) => {
                  const isSelected = i === selected;
                  if (item.type === 'page') {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={`cmd-item ${isSelected ? 'selected' : ''}`}
                        onMouseEnter={() => setSelected(i)}
                        onClick={() => execute(item)}
                      >
                        <span className="cmd-item-icon"><Icon /></span>
                        <span className="cmd-item-label">{item.label}</span>
                        <span className="cmd-item-hint">Page</span>
                      </button>
                    );
                  }
                  const { task } = item;
                  return (
                    <button
                      key={task.id}
                      type="button"
                      className={`cmd-item ${isSelected ? 'selected' : ''}`}
                      onMouseEnter={() => setSelected(i)}
                      onClick={() => execute(item)}
                    >
                      <span className="cmd-item-icon"><FiCheckSquare /></span>
                      <div className="cmd-item-text">
                        <span className="cmd-item-label">{task.title}</span>
                        <span className="cmd-item-sub">
                          {getBranchName(task.branchId)} · {getStatusLabel(task.status)}
                        </span>
                      </div>
                      <span className="cmd-item-hint">Task</span>
                    </button>
                  );
                })
              )}
            </div>

            <div className="cmd-footer">
              <span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
              <span><kbd>↵</kbd> Open</span>
              <span><FiCommand /> Quick Actions</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) };
}
