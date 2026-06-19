import { motion } from 'framer-motion';
import { FiCheckSquare, FiClock, FiActivity, FiCheckCircle } from 'react-icons/fi';
import CountUp from '../common/CountUp';
import './StatCard.css';

export default function StatCard({ icon: Icon, label, value, color, delay = 0 }) {
  return (
    <motion.div
      className="stat-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      <div className="stat-icon" style={{ background: `${color}15`, color }}>
        <Icon />
      </div>
      <div className="stat-info">
        <span className="stat-value"><CountUp value={value} /></span>
        <span className="stat-label">{label}</span>
      </div>
    </motion.div>
  );
}

export { FiCheckSquare, FiClock, FiActivity, FiCheckCircle };
