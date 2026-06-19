import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiBarChart2, FiFolder, FiTrendingUp, FiMapPin, FiPieChart } from 'react-icons/fi';
import { useTasks, useProjects } from '../../hooks/useFirestore';
import { BRANCHES, TASK_STATUSES, getBranchName, getStatusLabel } from '../../constants';
import LoadingSpinner from '../common/LoadingSpinner';
import './Reports.css';

export default function Reports() {
  const { tasks, loading: tasksLoading } = useTasks();
  const { projects, loading: projectsLoading } = useProjects();

  const reportData = useMemo(() => {
    const byBranch = BRANCHES.map((branch) => ({
      branch: branch.name,
      total: tasks.filter((t) => t.branchId === branch.id).length,
      pending: tasks.filter((t) => t.branchId === branch.id && t.status === 'pending').length,
      inProgress: tasks.filter((t) => t.branchId === branch.id && t.status === 'in-progress').length,
      completed: tasks.filter((t) => t.branchId === branch.id && t.status === 'completed').length,
    }));

    const byStatus = TASK_STATUSES.map((status) => ({
      status: status.label,
      count: tasks.filter((t) => t.status === status.id).length,
      color: status.color,
    }));

    const completionRate = tasks.length > 0
      ? Math.round((tasks.filter((t) => t.status === 'completed').length / tasks.length) * 100)
      : 0;

    return { byBranch, byStatus, completionRate, totalTasks: tasks.length, totalProjects: projects.length };
  }, [tasks, projects]);

  function exportCSV() {
    const headers = ['Title', 'Branch', 'Status', 'Priority', 'Created', 'Due Date'];
    const rows = tasks.map((t) => [
      t.title,
      getBranchName(t.branchId),
      getStatusLabel(t.status),
      t.priority || '',
      t.createdAt ? new Date(t.createdAt).toLocaleDateString() : '',
      t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '',
    ]);

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wwise-tasks-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (tasksLoading || projectsLoading) return <LoadingSpinner />;

  return (
    <div className="reports-page">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1>Reports</h1>
          <p>Task analytics and export across all branches</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={exportCSV}>
          <FiDownload />
          Export CSV
        </button>
      </motion.div>

      <div className="report-summary">
        <motion.div className="summary-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="icon-circle icon-circle-md summary-icon-wrap"><FiBarChart2 /></span>
          <span className="summary-value">{reportData.totalTasks}</span>
          <span className="summary-label">Total Tasks</span>
        </motion.div>
        <motion.div className="summary-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <span className="icon-circle icon-circle-md summary-icon-wrap"><FiFolder /></span>
          <span className="summary-value">{reportData.totalProjects}</span>
          <span className="summary-label">Total Projects</span>
        </motion.div>
        <motion.div className="summary-card highlight" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <span className="icon-circle icon-circle-md summary-icon-wrap summary-icon-light"><FiTrendingUp /></span>
          <span className="summary-value">{reportData.completionRate}%</span>
          <span className="summary-label">Completion Rate</span>
        </motion.div>
      </div>

      <div className="report-grid">
        <motion.section
          className="report-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2><FiMapPin /> Tasks by Branch</h2>
          <div className="report-table-wrap">
            <table className="report-table">
              <thead>
                <tr>
                  <th>Branch</th>
                  <th>Total</th>
                  <th>Pending</th>
                  <th>In Progress</th>
                  <th>Completed</th>
                </tr>
              </thead>
              <tbody>
                {reportData.byBranch.map((row) => (
                  <tr key={row.branch}>
                    <td>{row.branch}</td>
                    <td>{row.total}</td>
                    <td>{row.pending}</td>
                    <td>{row.inProgress}</td>
                    <td>{row.completed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>

        <motion.section
          className="report-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2><FiPieChart /> Tasks by Status</h2>
          <div className="status-bars">
            {reportData.byStatus.map((item) => (
              <div key={item.status} className="status-bar-item">
                <div className="status-bar-header">
                  <span>{item.status}</span>
                  <span>{item.count}</span>
                </div>
                <div className="status-bar-track">
                  <motion.div
                    className="status-bar-fill"
                    style={{ background: item.color }}
                    initial={{ width: 0 }}
                    animate={{
                      width: reportData.totalTasks > 0
                        ? `${(item.count / reportData.totalTasks) * 100}%`
                        : '0%',
                    }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
