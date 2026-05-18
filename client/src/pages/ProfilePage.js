import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.patch('/api/users/me', { name });
      toast.success('Profile updated!');
    } catch { toast.error('Could not update profile'); }
    finally { setSaving(false); }
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';

  return (
    <div style={{ maxWidth: 520, margin: '0 auto' }}>
      <h1 className="page-title">Profile</h1>

      <div style={{ background:'white', border:'1px solid var(--border)', borderRadius:12, padding:28 }}>
        <div className="profile-header">
          <div className="profile-avatar">{initials}</div>
          <div>
            <div style={{ fontWeight:700, fontSize:18 }}>{user?.name}</div>
            <div style={{ color:'var(--muted)', fontSize:14 }}>{user?.email}</div>
            <div style={{ marginTop:4 }}>
              <span className="badge badge-blue">🎓 {user?.college}</span>
            </div>
          </div>
        </div>

        {user?.rating > 0 && (
          <div style={{ background:'var(--bg)', borderRadius:8, padding:'12px 16px', marginBottom:20 }}>
            <span style={{ fontWeight:600 }}>⭐ {user.rating.toFixed(1)}</span>
            <span style={{ color:'var(--muted)', fontSize:13, marginLeft:6 }}>
              ({user.ratingCount} {user.ratingCount === 1 ? 'rating' : 'ratings'})
            </span>
          </div>
        )}

        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Display name</label>
            <input className="form-input" type="text" value={name}
              onChange={e => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">College email</label>
            <input className="form-input" type="email" value={user?.email} disabled
              style={{ opacity:0.6, cursor:'not-allowed' }} />
          </div>
          <div style={{ display:'flex', gap:12 }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            <button type="button" className="btn btn-outline" onClick={logout}>
              Log out
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
