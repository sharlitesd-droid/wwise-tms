import { useState } from 'react';
import { motion } from 'framer-motion';
import Modal from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { BRANCHES, TASK_STATUSES, PRIORITIES } from '../../constants';
import { createTask, updateTask, useTaskHistory } from '../../hooks/useFirestore';
import './TaskForm.css';

export default function TaskForm({ task, projects, users, defaultBranch, onClose }) {
  const { user, canManageAllBranches, userProfile } = useAuth();
  const isEditing = !!task;
  const { history } = useTaskHistory(task?.id);

  const [form, setForm] = useState({
    title: task?.title || '',
    description: task?.description || '',
    projectId: task?.projectId || '',
    branchId: task?.branchId || defaultBranch || BRANCHES[0].id,
    assignedTo: task?.assignedTo || '',
    status: task?.status || 'pending',
    priority: task?.priority || 'medium',
    dueDate: task?.dueDate || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = {
        ...form,
        projectId: form.projectId || null,
        assignedTo: form.assignedTo || null,
        dueDate: form.dueDate || null,
      };

      if (isEditing) {
        await updateTask(task.id, data, user, task);
      } else {
        await createTask(data, user);
      }
      onClose();
    } catch (err) {
      setError('Failed to save task. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const branchUsers = users.filter((u) => u.branchId === form.branchId);
  const availableBranches = canManageAllBranches
    ? BRANCHES
    : BRANCHES.filter((b) => b.id === userProfile?.branchId);

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={isEditing ? 'Edit Task' : 'Create New Task'}
      size="lg"
    >
      {error && <div className="form-error">{error}</div>}

      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label htmlFor="title">Task Title *</label>
          <input
            id="title"
            type="text"
            value={form.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Enter task title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Describe the task..."
            rows={3}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="branch">Branch *</label>
            <select
              id="branch"
              value={form.branchId}
              onChange={(e) => updateField('branchId', e.target.value)}
              required
              disabled={!canManageAllBranches && !isEditing}
            >
              {availableBranches.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="project">Project</label>
            <select
              id="project"
              value={form.projectId}
              onChange={(e) => updateField('projectId', e.target.value)}
            >
              <option value="">No project</option>
              {projects
                .filter((p) => p.branchId === form.branchId)
                .map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="assignedTo">Assign To</label>
            <select
              id="assignedTo"
              value={form.assignedTo}
              onChange={(e) => updateField('assignedTo', e.target.value)}
            >
              <option value="">Unassigned</option>
              {branchUsers.map((u) => (
                <option key={u.id} value={u.id}>{u.displayName}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">Due Date</label>
            <input
              id="dueDate"
              type="date"
              value={form.dueDate}
              onChange={(e) => updateField('dueDate', e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={form.status}
              onChange={(e) => updateField('status', e.target.value)}
            >
              {TASK_STATUSES.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              value={form.priority}
              onChange={(e) => updateField('priority', e.target.value)}
            >
              {PRIORITIES.map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : isEditing ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </form>

      {isEditing && history.length > 0 && (
        <div className="task-history">
          <h3>Change History</h3>
          <div className="history-list">
            {history.map((entry) => (
              <motion.div
                key={entry.id}
                className="history-item"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <span className="history-action">{entry.action}</span>
                <span className="history-desc">{entry.description}</span>
                <span className="history-meta">
                  {entry.changedByName} · {new Date(entry.timestamp).toLocaleString()}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
}
