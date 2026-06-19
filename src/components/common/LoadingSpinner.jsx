import { motion } from 'framer-motion';
import { FiLoader } from 'react-icons/fi';
import './LoadingSpinner.css';

export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <motion.div
      className="loading-spinner"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <FiLoader className="spinner-icon" />
      <p>{message}</p>
    </motion.div>
  );
}
