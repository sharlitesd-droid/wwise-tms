import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar, { LiveActivityListener } from './TopBar';
import MobileNav from './MobileNav';
import PageTransition from './PageTransition';
import CommandPalette, { useCommandPalette } from '../common/CommandPalette';
import { TopBarProvider } from '../../context/TopBarContext';
import { LayoutProvider } from '../../context/LayoutContext';
import './Layout.css';

export default function Layout() {
  const { isOpen, open, close } = useCommandPalette();

  return (
    <LayoutProvider>
      <TopBarProvider>
        <div className="layout">
          <Sidebar />
          <main className="main-content">
            <TopBar onOpenCommand={open} />
            <LiveActivityListener />
            <CommandPalette isOpen={isOpen} onClose={close} />
            <PageTransition>
              <Outlet />
            </PageTransition>
          </main>
          <MobileNav />
        </div>
      </TopBarProvider>
    </LayoutProvider>
  );
}
