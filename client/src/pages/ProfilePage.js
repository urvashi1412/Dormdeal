import { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import { Award, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({ active: 0, sold: 0, total: 0 });

  useEffect(() => {
    api.get('/api/listings/user/me')
      .then(r => {
        const listings = r.data;
        setStats({
          active: listings.filter(l => l.status === 'active').length,
          sold: listings.filter(l => l.status === 'sold').length,
          total: listings.length,
        });
      })
      .catch(() => {});
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch('/api/users/me', { name });
      toast.success('Profile updated!');
    } catch {
      toast.error('Could not update profile');
    } finally {
      setSaving(false);
    }
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : null;

  return (
    <div className="dd-profile-page">
      <h1 className="page-title">Profile</h1>

      <div className="dd-profile-card">
        <div className="dd-profile-header">
          <Avatar name={user?.name} size="xl" />
          <div className="dd-profile-header__info">
            <h2>{user?.name}</h2>
            <p>{user?.email}</p>
            <div style={{ marginTop: 8 }}>
              <Badge variant="primary">{user?.college}</Badge>
            </div>
            {memberSince && (
              <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>
                Member since {memberSince}
              </p>
            )}
          </div>
        </div>

        <div className="dd-profile-stats">
          <div className="dd-profile-stat">
            <div className="dd-profile-stat__value">{stats.active}</div>
            <div className="dd-profile-stat__label">Active listings</div>
          </div>
          <div className="dd-profile-stat">
            <div className="dd-profile-stat__value">{stats.sold}</div>
            <div className="dd-profile-stat__label">Items sold</div>
          </div>
          <div className="dd-profile-stat">
            <div className="dd-profile-stat__value">
              {user?.rating > 0 ? user.rating.toFixed(1) : '—'}
            </div>
            <div className="dd-profile-stat__label">Rating</div>
          </div>
        </div>

        {user?.rating > 0 && (
          <div style={{
            background: 'var(--bg)', borderRadius: 'var(--radius)',
            padding: '12px 16px', marginBottom: 20, fontSize: 14,
          }}>
            <Star size={15} style={{ display: 'inline', verticalAlign: 'middle', color: 'var(--warning)' }} />
            {' '}
            <strong>{user.rating.toFixed(1)}</strong>
            <span style={{ color: 'var(--muted)', marginLeft: 6 }}>
              ({user.ratingCount} {user.ratingCount === 1 ? 'rating' : 'ratings'})
            </span>
          </div>
        )}

        <div className="dd-achievements">
          {stats.total > 0 && (
            <Badge variant="success"><Award size={12} style={{ marginRight: 4 }} />First listing</Badge>
          )}
          {stats.sold > 0 && (
            <Badge variant="accent"><Award size={12} style={{ marginRight: 4 }} />First sale</Badge>
          )}
          {stats.active >= 3 && (
            <Badge variant="primary"><Award size={12} style={{ marginRight: 4 }} />Active seller</Badge>
          )}
        </div>

        <form onSubmit={handleSave}>
          <div className="dd-form-group">
            <label className="dd-form-label">Display name</label>
            <input
              className="dd-input"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div className="dd-form-group">
            <label className="dd-form-label">College email</label>
            <input
              className="dd-input"
              type="email"
              value={user?.email}
              disabled
              style={{ opacity: 0.6, cursor: 'not-allowed' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" className="dd-btn dd-btn--primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            <button type="button" className="dd-btn dd-btn--outline" onClick={logout}>
              Log out
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
