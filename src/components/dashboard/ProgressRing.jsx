import { motion } from 'framer-motion';
import './ProgressRing.css';

export default function ProgressRing({ value, max, label, color = 'var(--primary)' }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <motion.div
      className="progress-ring"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
    >
      <svg viewBox="0 0 120 120" className="progress-ring-svg">
        <circle cx="60" cy="60" r="54" className="progress-ring-bg" />
        <motion.circle
          cx="60"
          cy="60"
          r="54"
          className="progress-ring-fill"
          stroke={color}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: 'easeOut', delay: 0.3 }}
        />
      </svg>
      <div className="progress-ring-content">
        <motion.span
          className="progress-ring-value"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {pct}%
        </motion.span>
        <span className="progress-ring-label">{label}</span>
      </div>
    </motion.div>
  );
}
