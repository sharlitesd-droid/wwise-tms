import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMapPin,
  FiUser,
  FiFolder,
  FiFlag,
  FiClock,
  FiActivity,
  FiCheckCircle,
} from 'react-icons/fi';
import { TASK_STATUSES, getBranchName, getPriorityLabel } from '../../constants';
import './KanbanBoard.css';

const COLUMN_ICONS = {
  pending: FiClock,
  'in-progress': FiActivity,
  completed: FiCheckCircle,
};

export default function KanbanBoard({ tasks, projects, users, onStatusChange, onEdit }) {
  const [draggingId, setDraggingId] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  const [celebrate, setCelebrate] = useState(false);

  function handleDragStart(e, taskId) {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggingId(taskId);
  }

  function handleDragEnd() {
    setDraggingId(null);
    setDropTarget(null);
  }

  function handleDragOver(e, statusId) {
    e.preventDefault();
    setDropTarget(statusId);
  }

  function handleDragLeave() {
    setDropTarget(null);
  }

  async function handleDrop(e, statusId) {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const task = tasks.find((t) => t.id === taskId);
    if (taskId && task?.status !== statusId) {
      await onStatusChange(taskId, statusId, task);
      if (statusId === 'completed') {
        setCelebrate(true);
        setTimeout(() => setCelebrate(false), 2000);
      }
    }
    setDraggingId(null);
    setDropTarget(null);
  }

  return (
    <div className="kanban-board">
      <AnimatePresence>
        {celebrate && (
          <motion.div
            className="kanban-celebrate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {Array.from({ length: 24 }).map((_, i) => (
              <motion.span
                key={i}
                className="confetti-piece"
                style={{
                  left: `${10 + Math.random() * 80}%`,
                  background: ['#ec4899', '#f472b6', '#10b981', '#f59e0b', '#db2777'][i % 5],
                }}
                initial={{ y: 0, opacity: 1, rotate: 0 }}
                animate={{
                  y: -120 - Math.random() * 80,
                  opacity: 0,
                  rotate: Math.random() * 360,
                  x: (Math.random() - 0.5) * 100,
                }}
                transition={{ duration: 1.2 + Math.random() * 0.5, ease: 'easeOut' }}
              />
            ))}
            <span className="celebrate-text">Task Completed!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="kanban-columns">
        {TASK_STATUSES.map((status) => {
          const columnTasks = tasks.filter((t) => t.status === status.id);
          const isDropTarget = dropTarget === status.id;
          const ColIcon = COLUMN_ICONS[status.id];

          return (
            <div
              key={status.id}
              className={`kanban-column ${isDropTarget ? 'drop-target' : ''}`}
              onDragOver={(e) => handleDragOver(e, status.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, status.id)}
            >
              <div className="kanban-column-header" style={{ borderColor: status.color }}>
                <span
                  className="kanban-column-icon icon-circle icon-circle-sm"
                  style={{ color: status.color, borderColor: status.color, background: `${status.color}12` }}
                >
                  <ColIcon />
                </span>
                <span>{status.label}</span>
                <span className="kanban-column-count">{columnTasks.length}</span>
              </div>

              <div className="kanban-column-body">
                <AnimatePresence mode="popLayout">
                  {columnTasks.map((task) => {
                    const project = projects.find((p) => p.id === task.projectId);
                    const assignee = users.find((u) => u.id === task.assignedTo);
                    const isDragging = draggingId === task.id;
                    const TaskIcon = COLUMN_ICONS[task.status] || FiActivity;

                    return (
                      <motion.div
                        key={task.id}
                        layout
                        layoutId={task.id}
                        className={`kanban-card ${isDragging ? 'dragging' : ''}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        onDragEnd={handleDragEnd}
                        onClick={() => onEdit(task)}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: isDragging ? 0.5 : 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        whileHover={{ y: -2 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      >
                        <div className="kanban-card-top">
                          <span
                            className="kanban-card-icon icon-circle icon-circle-sm"
                            style={{ color: status.color, borderColor: status.color, background: `${status.color}12` }}
                          >
                            <TaskIcon />
                          </span>
                          {task.priority && (
                            <span className={`kanban-priority priority-${task.priority}`}>
                              <FiFlag /> {getPriorityLabel(task.priority)}
                            </span>
                          )}
                        </div>
                        <h4>{task.title}</h4>
                        <div className="kanban-card-meta">
                          <span><FiMapPin /> {getBranchName(task.branchId)}</span>
                          {assignee && <span><FiUser /> {assignee.displayName}</span>}
                        </div>
                        {project && (
                          <span className="kanban-project"><FiFolder /> {project.name}</span>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {columnTasks.length === 0 && (
                  <div className="kanban-empty">
                    Drop tasks here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
