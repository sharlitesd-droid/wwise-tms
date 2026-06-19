import { NavLink, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiHome,
  FiCheckSquare,
  FiFolder,
  FiBarChart2,
  FiUsers,
  FiLogOut,
  FiMenu,
  FiX,
  FiPlus,
  FiMapPin,
  FiShield,
} from 'react-icons/fi';
import { useLayout } from '../../context/LayoutContext';
import { useAuth } from '../../context/AuthContext';
import { getBranchName, ROLE_LABELS } from '../../constants';
import WwiseLogo from '../common/WwiseLogo';
import './Sidebar.css';

const navItems = [
  { to: '/', icon: FiHome, label: 'Dashboard', end: true },
  { to: '/tasks', icon: FiCheckSquare, label: 'Tasks' },
  { to: '/projects', icon: FiFolder, label: 'Projects' },
  { to: '/reports', icon: FiBarChart2, label: 'Reports' },
];

function NavItem({ to, icon: Icon, label, end, onNavigate }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
      onClick={onNavigate}
    >
      {({ isActive }) => (
        <>
          <span className={`nav-link-icon icon-circle icon-circle-sm ${isActive ? 'active' : ''}`}>
            <Icon aria-hidden="true" />
          </span>
          <span className="nav-link-label">{label}</span>
          {isActive && (
            <motion.span
              className="nav-link-indicator"
              layoutId="sidebar-active"
              transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            />
          )}
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar() {
  const { userProfile, logout, canManageUsers } = useAuth();
  const navigate = useNavigate();
  const { sidebarOpen, closeSidebar, toggleSidebar } = useLayout();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  function closeMobile() {
    closeSidebar();
  }

  const adminItems = canManageUsers
    ? [{ to: '/users', icon: FiUsers, label: 'Users' }]
    : [];

  const roleLabel = ROLE_LABELS[userProfile?.role] || 'Employee';
  const initial = userProfile?.displayName?.charAt(0)?.toUpperCase() || 'U';

  return (
    <>
      <button
        type="button"
        className="sidebar-toggle"
        onClick={toggleSidebar}
        aria-label="Toggle menu"
        aria-expanded={sidebarOpen}
      >
        {sidebarOpen ? <FiX /> : <FiMenu />}
      </button>

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <WwiseLogo variant="sidebar" />
        </div>

        <div className="sidebar-body">
          <Link
            to="/tasks"
            state={{ openForm: true }}
            className="sidebar-cta"
            onClick={closeMobile}
          >
            <span className="sidebar-cta-icon icon-circle icon-circle-sm">
              <FiPlus aria-hidden="true" />
            </span>
            New Task
          </Link>

          <p className="sidebar-section-label">Menu</p>
          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <NavItem key={item.to} {...item} onNavigate={closeMobile} />
            ))}
          </nav>

          {adminItems.length > 0 && (
            <>
              <p className="sidebar-section-label">Admin</p>
              <nav className="sidebar-nav">
                {adminItems.map((item) => (
                  <NavItem key={item.to} {...item} onNavigate={closeMobile} />
                ))}
              </nav>
            </>
          )}
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-user-card">
            <span className="sidebar-user-avatar">{initial}</span>
            <div className="sidebar-user-details">
              <span className="sidebar-user-name">{userProfile?.displayName}</span>
              <span className="sidebar-user-branch">
                <FiMapPin aria-hidden="true" />
                {getBranchName(userProfile?.branchId)}
              </span>
              <span className="sidebar-user-role">
                <FiShield aria-hidden="true" />
                {roleLabel}
              </span>
            </div>
          </div>

          <button type="button" className="sidebar-logout-btn" onClick={handleLogout}>
            <span className="sidebar-logout-icon icon-circle icon-circle-sm">
              <FiLogOut aria-hidden="true" />
            </span>
            Sign Out
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="sidebar-backdrop" onClick={closeMobile} aria-hidden="true" />
      )}
    </>
  );
}
