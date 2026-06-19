import { motion } from 'framer-motion';
import { FiMapPin } from 'react-icons/fi';
import { BRANCHES } from '../../constants';
import './BranchPulse.css';

const POSITIONS = {
  upington: { top: '50%', left: '8%', transform: 'translateY(-50%)' },
  centurion: { top: '12%', left: '50%', transform: 'translateX(-50%)' },
  'cape-town': { top: '50%', right: '8%', transform: 'translateY(-50%)' },
  dubai: { bottom: '8%', left: '50%', transform: 'translateX(-50%)' },
};

export default function BranchPulse({ tasks }) {
  const branchData = BRANCHES.map((branch) => {
    const branchTasks = tasks.filter((t) => t.branchId === branch.id);
    const active = branchTasks.filter((t) => t.status !== 'completed').length;
    return { ...branch, total: branchTasks.length, active };
  });

  const maxActive = Math.max(...branchData.map((b) => b.active), 1);

  return (
    <motion.section
      className="branch-pulse"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
    >
      <div className="branch-pulse-header">
        <h2>Branch Network</h2>
        <span className="live-indicator">
          <span className="live-dot" />
          Live
        </span>
      </div>

      <div className="branch-pulse-map">
        <svg className="branch-lines" viewBox="0 0 400 280" preserveAspectRatio="xMidYMid meet">
          {branchData.map((branch, i) => {
            const coords = {
              upington: { x: 40, y: 140 },
              centurion: { x: 200, y: 40 },
              'cape-town': { x: 360, y: 140 },
              dubai: { x: 200, y: 240 },
            }[branch.id];
            return (
              <motion.line
                key={branch.id}
                x1={200}
                y1={140}
                x2={coords.x}
                y2={coords.y}
                stroke="var(--primary)"
                strokeWidth="1.5"
                strokeOpacity={0.2 + (branch.active / maxActive) * 0.4}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
              />
            );
          })}
        </svg>

        <motion.div
          className="branch-hub"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        >
          <span className="hub-ring hub-ring-1" />
          <span className="hub-ring hub-ring-2" />
          <span className="hub-core">HQ</span>
        </motion.div>

        {branchData.map((branch, i) => {
          const intensity = branch.active / maxActive;
          return (
            <motion.div
              key={branch.id}
              className="branch-node"
              style={POSITIONS[branch.id]}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.1 }}
            >
              {branch.active > 0 && (
                <motion.span
                  className="node-pulse"
                  style={{ borderColor: `rgba(236, 72, 153, ${0.3 + intensity * 0.5})` }}
                  animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ repeat: Infinity, duration: 2 + i * 0.3 }}
                />
              )}
              <div
                className="node-card"
                style={{
                  borderColor: branch.active > 0 ? 'var(--primary)' : 'var(--border)',
                  boxShadow: branch.active > 0 ? `0 0 20px rgba(236, 72, 153, ${intensity * 0.25})` : 'none',
                }}
              >
                <span className="node-icon icon-circle icon-circle-sm">
                  <FiMapPin />
                </span>
                <span className="node-name">{branch.name}</span>
                <span className="node-count">{branch.total}</span>
                <span className="node-active">{branch.active} active</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
