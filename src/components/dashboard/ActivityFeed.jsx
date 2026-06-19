import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiZap } from 'react-icons/fi';
import { useActivityFeed } from '../../hooks/useFirestore';
import { filterByTimestampDay, isDayFilterActive, getDayFilterLabel } from '../../utils/dayFilter';
import LoadingSpinner from '../common/LoadingSpinner';
import './ActivityFeed.css';

const ACTION_ICONS = {
  created: FiPlus,
  updated: FiEdit2,
  deleted: FiTrash2,
};

const ACTION_COLORS = {
  created: '#10b981',
  updated: '#ec4899',
  deleted: '#dc2626',
};

function timeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function ActivityFeed({ selectedDay, todayIndex }) {
  const { activity, loading } = useActivityFeed(15);

  const filteredActivity = useMemo(() => {
    if (selectedDay === undefined || todayIndex === undefined) return activity;
    return filterByTimestampDay(activity, selectedDay, todayIndex);
  }, [activity, selectedDay, todayIndex]);

  const dayFilterActive =
    selectedDay !== undefined &&
    todayIndex !== undefined &&
    isDayFilterActive(selectedDay, todayIndex);

  if (loading) return <LoadingSpinner message="Loading activity..." />;

  return (
    <motion.section
      className="activity-feed"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
    >
      <div className="activity-feed-header">
        <h2>
          <FiZap /> Live Activity
        </h2>
        <span className="live-indicator">
          <span className="live-dot" />
          Real-time
        </span>
      </div>

      {filteredActivity.length === 0 ? (
        <p className="activity-empty">
          {dayFilterActive
            ? `No activity on ${getDayFilterLabel(selectedDay)}.`
            : 'No activity yet. Create a task to get started.'}
        </p>
      ) : (
        <div className="activity-list">
          {filteredActivity.map((item, i) => {
            const Icon = ACTION_ICONS[item.action] || FiEdit2;
            const color = ACTION_COLORS[item.action] || '#ec4899';

            return (
              <motion.div
                key={item.id}
                className="activity-item"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <div
                  className="activity-icon"
                  style={{ background: `${color}15`, color, borderColor: `${color}40` }}
                >
                  <Icon />
                </div>
                <div className="activity-body">
                  <p className="activity-desc">{item.description}</p>
                  <span className="activity-meta">
                    {item.changedByName} · {timeAgo(item.timestamp)}
                  </span>
                </div>
                <span className={`activity-badge activity-${item.action}`}>
                  {item.action}
                </span>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.section>
  );
}
