import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutGrid, MessageSquare, Package, Heart, User, Plus,
} from 'lucide-react';
import Logo from './ui/Logo';
import { getWishlist } from '../utils/storage';

const NAV_ITEMS = [
  { to: '/', icon: LayoutGrid, label: 'Browse', end: true },
  { to: '/messages', icon: MessageSquare, label: 'Messages' },
  { to: '/my-listings', icon: Package, label: 'My Listings' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function Sidebar({ mobileOpen, onClose }) {
  const location = useLocation();
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    const update = () => setWishlistCount(getWishlist().length);
    update();
    window.addEventListener('dd-wishlist-change', update);
    return () => window.removeEventListener('dd-wishlist-change', update);
  }, []);

  const isActive = (path, end) => {
    if (end) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <div
        className={`dd-sidebar-backdrop ${mobileOpen ? 'is-visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className={`dd-sidebar ${mobileOpen ? 'is-open' : ''}`}>
        <div className="dd-sidebar__head">
          <Logo />
        </div>

        <nav className="dd-sidebar__nav">
          {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
            <Link
              key={to}
              to={to}
              onClick={onClose}
              className={`dd-sidebar__link ${isActive(to, end) ? 'is-active' : ''}`}
            >
              <Icon size={18} strokeWidth={1.75} />
              <span>{label}</span>
            </Link>
          ))}
          <button
            type="button"
            className="dd-sidebar__link dd-sidebar__link--wishlist"
            onClick={() => {
              onClose?.();
              window.dispatchEvent(new CustomEvent('dd-open-wishlist'));
            }}
          >
            <Heart size={18} strokeWidth={1.75} />
            <span>Wishlist</span>
            {wishlistCount > 0 && (
              <span className="dd-sidebar__count">{wishlistCount}</span>
            )}
          </button>
        </nav>

        <div className="dd-sidebar__promo">
          <div className="dd-sidebar__promo-art" aria-hidden="true">
            <svg viewBox="0 0 80 60" fill="none">
              <circle cx="40" cy="30" r="24" fill="var(--primary-light)" />
              <rect x="28" y="22" width="24" height="18" rx="3" fill="var(--primary)" opacity="0.25" />
              <circle cx="32" cy="18" r="6" fill="var(--accent)" opacity="0.5" />
              <circle cx="52" cy="16" r="4" fill="var(--success)" opacity="0.4" />
            </svg>
          </div>
          <p className="dd-sidebar__promo-title">Sell in 60 seconds</p>
          <p className="dd-sidebar__promo-desc">List items to students on your campus.</p>
          <Link to="/sell" className="dd-btn dd-btn--primary dd-btn--sm" onClick={onClose}>
            <Plus size={15} />
            Sell Now
          </Link>
        </div>

        <div className="dd-sidebar__foot">
          <span>© 2026 DormDeal</span>
        </div>
      </aside>
    </>
  );
}
