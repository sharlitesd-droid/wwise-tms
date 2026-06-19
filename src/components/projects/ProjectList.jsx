import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiFolder, FiMapPin, FiCalendar } from 'react-icons/fi';
import { useProjects } from '../../hooks/useFirestore';
import { useAuth } from '../../context/AuthContext';
import { getBranchName } from '../../constants';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import Modal from '../common/Modal';
import { createProject } from '../../hooks/useFirestore';
import { BRANCHES } from '../../constants';
import './Projects.css';

export default function ProjectList() {
  const { projects, loading } = useProjects();
  const { user, canManageAllBranches, userProfile } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    branchId: userProfile?.branchId || BRANCHES[0].id,
  });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await createProject(form, user);
      setShowForm(false);
      setForm({ name: '', description: '', branchId: userProfile?.branchId || BRANCHES[0].id });
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  const availableBranches = canManageAllBranches
    ? BRANCHES
    : BRANCHES.filter((b) => b.id === userProfile?.branchId);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="projects-page">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1>Projects</h1>
          <p>Organize tasks into projects across branches</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setShowForm(true)}>
          <FiPlus />
          New Project
        </button>
      </motion.div>

      {projects.length === 0 ? (
        <EmptyState
          icon={FiFolder}
          title="No projects yet"
          description="Create a project to group related tasks together."
          action={
            <button type="button" className="btn btn-primary" onClick={() => setShowForm(true)}>
              <FiPlus /> Create Project
            </button>
          }
        />
      ) : (
        <div className="project-grid">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              className="project-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="project-icon">
                <FiFolder />
              </div>
              <h3>{project.name}</h3>
              {project.description && <p>{project.description}</p>}
              <div className="project-footer">
                <span><FiMapPin /> {getBranchName(project.branchId)}</span>
                <span className="project-date">
                  <FiCalendar /> {new Date(project.createdAt).toLocaleDateString()}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Create New Project">
        <form onSubmit={handleSubmit} className="project-form">
          <div className="form-group">
            <label htmlFor="projectName">Project Name *</label>
            <input
              id="projectName"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Enter project name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="projectDesc">Description</label>
            <textarea
              id="projectDesc"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Project description..."
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="projectBranch">Branch *</label>
            <select
              id="projectBranch"
              value={form.branchId}
              onChange={(e) => setForm({ ...form, branchId: e.target.value })}
              required
            >
              {availableBranches.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
