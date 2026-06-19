import { useEffect, useRef, useState } from 'react';
import { FiSearch, FiRefreshCw } from 'react-icons/fi';
import { useActivityFeed } from '../../hooks/useFirestore';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useTopBar } from '../../context/TopBarContext';
import { getBranchName } from '../../constants';
import { getWeekDate, DAY_NAMES } from '../../utils/dayFilter';
import './TopBar.css';

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function isMac() {
  return typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);
}

export default function TopBar({ onOpenCommand }) {
  const { userProfile } = useAuth();
  const { showToast } = useToast();
  const { selectedDay, setSelectedDay, todayIndex, hasLiveUpdate, setHasLiveUpdate } = useTopBar();
  const [refreshing, setRefreshing] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const initial = userProfile?.displayName?.charAt(0)?.toUpperCase() || 'U';
  const firstName = userProfile?.displayName?.split(' ')[0] || 'User';
  const selectedDate = getWeekDate(selectedDay);
  const dateLabel = selectedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  const modKey = isMac() ? '⌘' : 'Ctrl';

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function handleRefresh() {
    setRefreshing(true);
    setHasLiveUpdate(false);
    showToast('Data synced', 'success', 2000);
    setTimeout(() => setRefreshing(false), 800);
  }

  return (
    <header className={`top-bar ${scrolled ? 'top-bar-scrolled' : ''}`}>
      <div className="top-bar-left">
        <button
          type="button"
          className="top-bar-pill top-bar-search"
          onClick={onOpenCommand}
          aria-label="Open command palette"
        >
          <FiSearch aria-hidden="true" />
          <span>Search tasks, pages...</span>
          <kbd>{modKey} K</kbd>
        </button>
      </div>

      <div className="top-bar-center">
        <div className="top-bar-pill top-bar-days-wrap">
          <div className="top-bar-days" role="group" aria-label="Select day of the week">
            {DAYS.map((label, i) => {
              const isToday = i === todayIndex;
              const isSelected = i === selectedDay;
              return (
                <button
                  key={DAY_NAMES[i]}
                  type="button"
                  className={`top-bar-day ${isSelected ? 'active' : ''} ${isToday && !isSelected ? 'today' : ''}`}
                  onClick={() => setSelectedDay(i)}
                  title={`${DAY_NAMES[i]}${isToday ? ' (Today)' : ''}`}
                  aria-label={DAY_NAMES[i]}
                  aria-pressed={isSelected}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <span className="top-bar-date-label">{dateLabel}</span>
        </div>
      </div>

      <div className="top-bar-right">
        <div className="top-bar-pill top-bar-user-wrap">
          <span
            className="top-bar-user-avatar"
            title={`${userProfile?.displayName} · ${getBranchName(userProfile?.branchId)}`}
          >
            {initial}
          </span>
          <span className="top-bar-user-name">{firstName}</span>
          <span className="top-bar-user-divider" aria-hidden="true" />
          <button
            type="button"
            className="top-bar-refresh-btn"
            onClick={handleRefresh}
            title="Sync latest data"
            aria-label="Sync latest data"
            disabled={refreshing}
          >
            <FiRefreshCw className={refreshing ? 'top-bar-refresh-spin' : ''} />
            {hasLiveUpdate && <span className="top-bar-live-dot" aria-label="New activity" />}
          </button>
        </div>
      </div>
    </header>
  );
}

export function LiveActivityListener() {
  const { activity } = useActivityFeed(10);
  const { userProfile } = useAuth();
  const { showToast } = useToast();
  const { setHasLiveUpdate } = useTopBar();
  const seenIds = useRef(new Set());
  const initialized = useRef(false);

  useEffect(() => {
    if (!activity.length) return;

    if (!initialized.current) {
      activity.forEach((a) => seenIds.current.add(a.id));
      initialized.current = true;
      return;
    }

    activity.forEach((item) => {
      if (!seenIds.current.has(item.id)) {
        seenIds.current.add(item.id);
        if (item.changedBy !== userProfile?.id) {
          setHasLiveUpdate(true);
          showToast(`${item.changedByName}: ${item.description}`, 'live', 5000);
        }
      }
    });
  }, [activity, userProfile?.id, showToast, setHasLiveUpdate]);

  return null;
}

export { getWeekDate, DAY_NAMES } from '../../utils/dayFilter';
