import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/ui/Logo';

export default function LoginPage() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dd-auth-page">
      <div className="dd-auth-layout">
        <div className="dd-auth-brand">
          <Logo />
          <h1 style={{ marginTop: 28 }}>
            Your campus marketplace,<br />
            <em>built for students.</em>
          </h1>
          <p>
            Buy and sell with verified students at your college. No strangers, no scams — just your campus community.
          </p>
          <div className="dd-auth-features">
            <div className="dd-auth-feature"><Check size={16} /> Campus-exclusive listings</div>
            <div className="dd-auth-feature"><Check size={16} /> In-app messaging</div>
            <div className="dd-auth-feature"><Check size={16} /> Free to list items</div>
          </div>
        </div>

        <div className="dd-auth-card">
          <h2 className="dd-auth-card__title">Sign in</h2>
          <p className="dd-auth-card__subtitle">Welcome back to DormDeal</p>

          <form onSubmit={handleSubmit}>
            <div className="dd-form-group">
              <label className="dd-form-label">Email</label>
              <input
                className="dd-input"
                type="email"
                placeholder="you@college.edu"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                autoFocus
              />
            </div>

            <div className="dd-form-group">
              <label className="dd-form-label">Password</label>
              <input
                className="dd-input"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            {error && <p className="dd-form-error">{error}</p>}

            <button
              type="submit"
              className="dd-btn dd-btn--primary dd-btn--block dd-btn--lg"
              disabled={loading}
              style={{ marginTop: 8 }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="dd-auth-footer">
            Don&apos;t have an account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
