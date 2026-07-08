import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Search, MessageSquare, Heart, Menu, X, Building2, ChevronDown, Plus, LogOut, LayoutGrid,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from './ui/Logo';
import Avatar from './ui/Avatar';
import { getWishlist } from '../utils/storage';

export default function Navbar({ onMenuToggle, menuOpen }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const update = () => setWishlistCount(getWishlist().length);
    update();
    window.addEventListener('dd-wishlist-change', update);
    return () => window.removeEventListener('dd-wishlist-change', update);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    setProfileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const focusSearch = () => {
    window.dispatchEvent(new CustomEvent('dd-focus-search'));
    if (location.pathname !== '/') navigate('/');
  };

  const openWishlist = () => {
    window.dispatchEvent(new CustomEvent('dd-open-wishlist'));
    if (location.pathname !== '/') navigate('/');
  };

  if (!user) {
    return (
      <header className="dd-navbar dd-navbar--auth">
        <Logo />
        <div className="dd-navbar__actions">
          <Link to="/login" className="dd-btn dd-btn--ghost">Sign in</Link>
          <Link to="/register" className="dd-btn dd-btn--primary">Get started</Link>
        </div>
      </header>
    );
  }

  const firstName = user.name?.split(' ')[0] || 'Profile';

  return (
    <header className="dd-navbar">
      <div className="dd-navbar__left">
        <button
          type="button"
          className="dd-icon-btn dd-navbar__menu"
          onClick={onMenuToggle}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="dd-campus-badge">
          <Building2 size={15} />
          <span>{user.college}</span>
          <ChevronDown size={14} className="dd-campus-badge__chevron" />
        </div>
      </div>

      <button type="button" className="dd-search-trigger" onClick={focusSearch}>
        <Search size={17} />
        <span>Search books, furniture, electronics…</span>
        <kbd className="dd-kbd">⌘K</kbd>
      </button>

      <div className="dd-navbar__actions">
        <Link
          to="/"
          className={`dd-icon-btn dd-navbar__browse ${location.pathname === '/' ? 'is-active' : ''}`}
          aria-label="Browse"
        >
          <LayoutGrid size={18} />
        </Link>
        <Link
          to="/messages"
          className={`dd-icon-btn ${location.pathname.startsWith('/messages') ? 'is-active' : ''}`}
          aria-label="Messages"
        >
          <MessageSquare size={18} />
        </Link>
        <button
          type="button"
          className="dd-icon-btn"
          onClick={openWishlist}
          aria-label="Wishlist"
        >
          <Heart size={18} />
          {wishlistCount > 0 && <span className="dd-dot-badge">{wishlistCount}</span>}
        </button>

        <div className="dd-profile-menu" ref={profileRef}>
          <button
            type="button"
            className="dd-profile-trigger"
            onClick={() => setProfileOpen(v => !v)}
            aria-expanded={profileOpen}
          >
            <Avatar name={user.name} size="sm" />
            <span className="dd-profile-trigger__name">{firstName}</span>
            <ChevronDown size={14} />
          </button>
          {profileOpen && (
            <div className="dd-dropdown">
              <Link to="/profile" className="dd-dropdown__item">Profile</Link>
              <Link to="/my-listings" className="dd-dropdown__item">My listings</Link>
              <button type="button" className="dd-dropdown__item dd-dropdown__item--danger" onClick={handleLogout}>
                <LogOut size={15} />
                Log out
              </button>
            </div>
          )}
        </div>

        <Link to="/sell" className="dd-btn dd-btn--primary dd-navbar__sell">
          <Plus size={16} />
          <span>Sell</span>
        </Link>
      </div>
    </header>
  );
}
