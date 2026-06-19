import { motion } from 'framer-motion';
import './EmptyState.css';

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div
      className="empty-state"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {Icon && (
        <div className="empty-state-icon">
          <Icon />
        </div>
      )}
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action && <div className="empty-state-action">{action}</div>}
    </motion.div>
  );
}
