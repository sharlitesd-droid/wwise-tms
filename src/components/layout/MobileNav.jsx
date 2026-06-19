import { NavLink } from 'react-router-dom';
import { FiHome, FiCheckSquare, FiFolder, FiBarChart2, FiMenu } from 'react-icons/fi';
import { useLayout } from '../../context/LayoutContext';
import './MobileNav.css';

const tabs = [
  { to: '/', icon: FiHome, label: 'Home', end: true },
  { to: '/tasks', icon: FiCheckSquare, label: 'Tasks' },
  { to: '/projects', icon: FiFolder, label: 'Projects' },
  { to: '/reports', icon: FiBarChart2, label: 'Reports' },
];

export default function MobileNav() {
  const { sidebarOpen, openSidebar, closeSidebar } = useLayout();

  return (
    <nav className="mobile-nav" aria-label="Main navigation">
      {tabs.map(({ to, icon: Icon, label, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
          onClick={closeSidebar}
        >
          <Icon aria-hidden="true" />
          <span>{label}</span>
        </NavLink>
      ))}
      <button
        type="button"
        className={`mobile-nav-item mobile-nav-menu ${sidebarOpen ? 'active' : ''}`}
        onClick={sidebarOpen ? closeSidebar : openSidebar}
        aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={sidebarOpen}
      >
        <FiMenu aria-hidden="true" />
        <span>Menu</span>
      </button>
    </nav>
  );
}
