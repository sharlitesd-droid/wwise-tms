import { motion } from 'framer-motion';
import { FiCheckCircle, FiInfo, FiAlertCircle, FiZap, FiX } from 'react-icons/fi';
import './Toast.css';

const ICONS = {
  success: FiCheckCircle,
  info: FiInfo,
  warning: FiAlertCircle,
  live: FiZap,
};

export default function Toast({ message, type = 'info', onDismiss }) {
  const Icon = ICONS[type] || FiInfo;

  return (
    <motion.div
      className={`toast toast-${type}`}
      initial={{ opacity: 0, x: 80, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      layout
    >
      <Icon className="toast-icon" />
      <span className="toast-message">{message}</span>
      <button type="button" className="toast-close" onClick={onDismiss} aria-label="Dismiss">
        <FiX />
      </button>
    </motion.div>
  );
}
