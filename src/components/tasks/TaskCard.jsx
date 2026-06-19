import { motion } from 'framer-motion';
import {
  FiEdit2,
  FiTrash2,
  FiMapPin,
  FiUser,
  FiCalendar,
  FiFolder,
  FiClock,
  FiActivity,
  FiCheckCircle,
  FiFlag,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { getBranchName, getStatusLabel, getPriorityLabel, getStatusColor } from '../../constants';
import { deleteTask } from '../../hooks/useFirestore';
import './TaskCard.css';

const STATUS_ICONS = {
  pending: FiClock,
  'in-progress': FiActivity,
  completed: FiCheckCircle,
};

export default function TaskCard({ task, projects, users, onEdit, delay = 0 }) {
  const { user, isAdmin, isBranchAdmin } = useAuth();
  const project = projects.find((p) => p.id === task.projectId);
  const assignee = users.find((u) => u.id === task.assignedTo);
  const StatusIcon = STATUS_ICONS[task.status] || FiActivity;
  const statusColor = getStatusColor(task.status);

  async function handleDelete() {
    if (window.confirm(`Delete task "${task.title}"?`)) {
      await deleteTask(task.id, user, task.title);
    }
  }

  const canEdit = isAdmin || isBranchAdmin || task.createdBy === user?.uid;

  return (
    <motion.div
      className="task-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ y: -2 }}
    >
      <div className="task-card-top">
        <div
          className="task-card-icon icon-circle icon-circle-lg"
          style={{ color: statusColor, borderColor: statusColor, background: `${statusColor}12` }}
        >
          <StatusIcon />
        </div>
        <div className="task-card-badges">
          <span className={`status-badge status-${task.status}`}>
            {getStatusLabel(task.status)}
          </span>
          {task.priority && (
            <span className={`priority-badge priority-${task.priority}`}>
              <FiFlag /> {getPriorityLabel(task.priority)}
            </span>
          )}
        </div>
      </div>

      <h3 className="task-title">{task.title}</h3>
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-meta">
        <span><FiMapPin /> {getBranchName(task.branchId)}</span>
        {project && <span><FiFolder /> {project.name}</span>}
        {assignee && <span><FiUser /> {assignee.displayName}</span>}
        {task.dueDate && (
          <span><FiCalendar /> {new Date(task.dueDate).toLocaleDateString()}</span>
        )}
      </div>

      {canEdit && (
        <div className="task-actions">
          <button type="button" className="btn-icon" onClick={() => onEdit(task)} title="Edit">
            <FiEdit2 />
          </button>
          <button type="button" className="btn-icon btn-icon-danger" onClick={handleDelete} title="Delete">
            <FiTrash2 />
          </button>
        </div>
      )}
    </motion.div>
  );
}
