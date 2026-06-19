import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiPlus, FiArrowRight, FiList, FiFolder, FiActivity, FiAlertCircle, FiCheckSquare, FiClock, FiCheckCircle, FiCalendar } from 'react-icons/fi';
import StatCard from './StatCard';
import BranchPulse from './BranchPulse';
import ProgressRing from './ProgressRing';
import ActivityFeed from './ActivityFeed';
import CountUp from '../common/CountUp';
import { useTasks, useProjects } from '../../hooks/useFirestore';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useTopBar } from '../../context/TopBarContext';
import { getBranchName, getStatusLabel, getStatusColor } from '../../constants';
import {
  filterTasksByDay,
  filterItemsByCreatedDay,
  isDayFilterActive,
  getDayFilterLabel,
} from '../../utils/dayFilter';
import LoadingSpinner from '../common/LoadingSpinner';
import './Dashboard.css';
import './ProgressRing.css';

export default function Dashboard() {
  const { tasks, loading: tasksLoading } = useTasks();
  const { projects, loading: projectsLoading } = useProjects();
  const { userProfile } = useAuth();
  const { showToast } = useToast();
  const { selectedDay, todayIndex } = useTopBar();

  useEffect(() => {
    if (!userProfile) return;
    const key = `welcomed-${userProfile.id}`;
    if (!sessionStorage.getItem(key)) {
      showToast(`Welcome back, ${userProfile.displayName}!`, 'success', 4500);
      sessionStorage.setItem(key, '1');
    }
  }, [userProfile, showToast]);

  const dayFilterActive = isDayFilterActive(selectedDay, todayIndex);
  const dayLabel = getDayFilterLabel(selectedDay);

  const filteredTasks = useMemo(
    () => filterTasksByDay(tasks, selectedDay, todayIndex),
    [tasks, selectedDay, todayIndex]
  );

  const filteredProjects = useMemo(
    () => filterItemsByCreatedDay(projects, selectedDay, todayIndex),
    [projects, selectedDay, todayIndex]
  );

  if (tasksLoading || projectsLoading) return <LoadingSpinner />;

  const stats = {
    total: filteredTasks.length,
    pending: filteredTasks.filter((t) => t.status === 'pending').length,
    inProgress: filteredTasks.filter((t) => t.status === 'in-progress').length,
    completed: filteredTasks.filter((t) => t.status === 'completed').length,
  };

  const recentTasks = filteredTasks.slice(0, 5);
  const overdue = filteredTasks.filter(
    (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed'
  ).length;

  const taskStatusIcons = {
    pending: FiAlertCircle,
    'in-progress': FiActivity,
    completed: FiCheckCircle,
  };

  return (
    <div className="dashboard">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1>Dashboard</h1>
          <p>
            Welcome back, {userProfile?.displayName} · {getBranchName(userProfile?.branchId)}
          </p>
        </div>
        <Link to="/tasks" className="btn btn-primary">
          <FiPlus />
          New Task
        </Link>
      </motion.div>

      {dayFilterActive && (
        <motion.div
          className="dashboard-day-banner"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <FiCalendar aria-hidden="true" />
          <span>
            Showing data for <strong>{dayLabel}</strong> — tasks due or created on this day
          </span>
        </motion.div>
      )}

      <BranchPulse tasks={filteredTasks} />

      <div className="stats-grid">
        <StatCard icon={FiCheckSquare} label="Total Tasks" value={stats.total} color="#ec4899" delay={0} />
        <StatCard icon={FiClock} label="Pending" value={stats.pending} color="#f59e0b" delay={0.1} />
        <StatCard icon={FiActivity} label="In Progress" value={stats.inProgress} color="#db2777" delay={0.2} />
        <StatCard icon={FiCheckCircle} label="Completed" value={stats.completed} color="#10b981" delay={0.3} />
      </div>

      <motion.div
        className="progress-ring-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <ProgressRing
          value={stats.completed}
          max={stats.total || 1}
          label="Complete"
          color="#ec4899"
        />
        <div className="progress-ring-details">
          <h3>Team Progress</h3>
          <p>
            {stats.total === 0
              ? dayFilterActive
                ? `No tasks scheduled for ${dayLabel}.`
                : 'No tasks yet — create one to start tracking progress across branches.'
              : `${stats.completed} of ${stats.total} tasks completed${dayFilterActive ? ` on ${dayLabel}` : ' company-wide'}.`}
            {overdue > 0 && ` ${overdue} task${overdue > 1 ? 's are' : ' is'} overdue.`}
          </p>
          <div className="progress-ring-stats">
            <div className="progress-ring-stat">
              <div className="progress-ring-stat-row">
                <span className="icon-circle icon-circle-sm progress-ring-stat-icon"><FiActivity /></span>
                <strong>{stats.inProgress}</strong>
              </div>
              <span>In Progress</span>
            </div>
            <div className="progress-ring-stat">
              <div className="progress-ring-stat-row">
                <span className="icon-circle icon-circle-sm progress-ring-stat-icon"><FiClock /></span>
                <strong>{stats.pending}</strong>
              </div>
              <span>Pending</span>
            </div>
            <div className="progress-ring-stat">
              <div className="progress-ring-stat-row">
                <span className="icon-circle icon-circle-sm progress-ring-stat-icon"><FiAlertCircle /></span>
                <strong>{overdue}</strong>
              </div>
              <span>Overdue</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="dashboard-grid">
        <motion.section
          className="dashboard-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="section-header">
            <h2><FiList /> Recent Tasks</h2>
            <Link to="/tasks" className="link-btn">
              View all <FiArrowRight />
            </Link>
          </div>
          {recentTasks.length === 0 ? (
            <p className="empty-text">
              {dayFilterActive
                ? `No tasks for ${dayLabel}. Select another day or create a task.`
                : 'No tasks yet. Create your first task to get started.'}
            </p>
          ) : (
            <div className="recent-list">
              {recentTasks.map((task) => {
                const TaskIcon = taskStatusIcons[task.status] || FiCheckSquare;
                const color = getStatusColor(task.status);
                return (
                  <div key={task.id} className="recent-item">
                    <div className="recent-item-left">
                      <span
                        className="recent-item-icon icon-circle icon-circle-sm"
                        style={{ color, borderColor: color, background: `${color}12` }}
                      >
                        <TaskIcon />
                      </span>
                      <div className="recent-item-info">
                        <span className="recent-title">{task.title}</span>
                        <span className="recent-meta">
                          {getBranchName(task.branchId)} · {getStatusLabel(task.status)}
                        </span>
                      </div>
                    </div>
                    <span className={`status-badge status-${task.status}`}>
                      {getStatusLabel(task.status)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </motion.section>

        <motion.section
          className="dashboard-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="section-header">
            <h2><FiFolder /> Projects</h2>
            <Link to="/projects" className="link-btn">
              View all <FiArrowRight />
            </Link>
          </div>
          <div className="project-summary">
            <span className="project-count"><CountUp value={filteredProjects.length} /></span>
            <span className="project-label">
              {dayFilterActive ? `Projects on ${dayLabel.split(',')[0]}` : 'Active Projects'}
            </span>
          </div>
          {filteredProjects.slice(0, 3).map((project) => (
            <div key={project.id} className="recent-item">
              <div className="recent-item-left">
                <span className="recent-item-icon icon-circle icon-circle-sm">
                  <FiFolder />
                </span>
                <div className="recent-item-info">
                  <span className="recent-title">{project.name}</span>
                  <span className="recent-meta">{getBranchName(project.branchId)}</span>
                </div>
              </div>
            </div>
          ))}
          {filteredProjects.length === 0 && dayFilterActive && (
            <p className="empty-text">No projects created on {dayLabel}.</p>
          )}
        </motion.section>
      </div>

      <ActivityFeed selectedDay={selectedDay} todayIndex={todayIndex} />
    </div>
  );
}
