import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function AppShell({ children }) {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!user) {
    return (
      <div className="dd-app dd-app--guest">
        <Navbar />
        <main className="dd-page dd-page--guest">{children}</main>
      </div>
    );
  }

  return (
    <div className="dd-app">
      <Sidebar mobileOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="dd-app__main">
        <Navbar onMenuToggle={() => setMenuOpen(v => !v)} menuOpen={menuOpen} />
        <main className="dd-page">{children}</main>
      </div>
    </div>
  );
}
