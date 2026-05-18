import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CATEGORY_EMOJI = { textbooks:'📚', furniture:'🛋️', electronics:'💻', clothes:'👕', food:'🍕', other:'📦' };

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };
  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  if (!user) return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">Dorm<span>Deal</span></Link>
      <div className="navbar-links">
        <Link to="/login"    className="nav-link">Sign in</Link>
        <Link to="/register" className="btn-sell">Sign up</Link>
      </div>
    </nav>
  );

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">Dorm<span>Deal</span></Link>
      <span className="nav-badge">🎓 {user.college}</span>
      <div className="navbar-links">
        <Link to="/"            className={isActive('/')}>Browse</Link>
        <Link to="/messages"    className={isActive('/messages')}>Messages</Link>
        <Link to="/my-listings" className={isActive('/my-listings')}>My listings</Link>
        <Link to="/profile"     className={isActive('/profile')}>{user.name.split(' ')[0]}</Link>
        <Link to="/sell"        className="btn-sell">+ Sell</Link>
        <button onClick={handleLogout} className="nav-link" style={{background:'none',border:'none',cursor:'pointer',color:'#6b7280'}}>
          Logout
        </button>
      </div>
    </nav>
  );
}
