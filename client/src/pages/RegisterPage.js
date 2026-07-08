import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/ui/Logo';

export default function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: '', email: '', college: '', password: '', confirm: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return setError('Passwords do not match');
    if (!form.college.trim()) return setError('Please enter your college name');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.college);
      toast.success('Welcome to DormDeal!');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="dd-auth-page">
      <div className="dd-auth-layout">
        <div className="dd-auth-brand">
          <Logo />
          <h1 style={{ marginTop: 28 }}>
            Join your campus<br />
            <em>marketplace today.</em>
          </h1>
          <p>
            Create an account to start buying and selling with students at your college. It takes less than a minute.
          </p>
          <div className="dd-auth-features">
            <div className="dd-auth-feature"><Check size={16} /> Only see your college&apos;s listings</div>
            <div className="dd-auth-feature"><Check size={16} /> Message sellers directly</div>
            <div className="dd-auth-feature"><Check size={16} /> Post items in 60 seconds</div>
          </div>
        </div>

        <div className="dd-auth-card">
          <h2 className="dd-auth-card__title">Create account</h2>
          <p className="dd-auth-card__subtitle">Join your campus marketplace</p>

          <form onSubmit={handleSubmit}>
            <div className="dd-form-group">
              <label className="dd-form-label">Full name</label>
              <input className="dd-input" type="text" placeholder="Alex Johnson"
                value={form.name} onChange={set('name')} required />
            </div>
            <div className="dd-form-group">
              <label className="dd-form-label">Email</label>
              <input className="dd-input" type="email" placeholder="you@college.edu"
                value={form.email} onChange={set('email')} required />
            </div>
            <div className="dd-form-group">
              <label className="dd-form-label">College / University</label>
              <input className="dd-input" type="text" placeholder="e.g. UCLA, MIT, UT Austin"
                value={form.college} onChange={set('college')} required />
              <p className="dd-form-hint">You&apos;ll only see listings from students at your college</p>
            </div>
            <div className="dd-form-group">
              <label className="dd-form-label">Password</label>
              <input className="dd-input" type="password" placeholder="At least 6 characters"
                value={form.password} onChange={set('password')} required minLength={6} />
            </div>
            <div className="dd-form-group">
              <label className="dd-form-label">Confirm password</label>
              <input className="dd-input" type="password" placeholder="Repeat password"
                value={form.confirm} onChange={set('confirm')} required />
            </div>
            {error && <p className="dd-form-error">{error}</p>}
            <button type="submit" className="dd-btn dd-btn--primary dd-btn--block dd-btn--lg"
              disabled={loading} style={{ marginTop: 8 }}>
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="dd-auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
