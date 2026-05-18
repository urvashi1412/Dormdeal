import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import ListingCard from '../components/ListingCard';

export default function MyListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/listings/user/me')
      .then(r => setListings(r.data))
      .catch(() => toast.error('Could not load listings'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="loading-screen">Loading…</p>;

  const active = listings.filter(l => l.status === 'active');
  const sold   = listings.filter(l => l.status === 'sold');

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <h1 className="page-title" style={{ margin:0 }}>My listings</h1>
        <Link to="/sell" className="btn btn-primary">+ New listing</Link>
      </div>

      {listings.length === 0 && (
        <div style={{ textAlign:'center', padding:'60px 0', color:'var(--muted)' }}>
          <div style={{ fontSize:48, marginBottom:12 }}>📦</div>
          <p style={{ fontWeight:600, marginBottom:8 }}>No listings yet</p>
          <Link to="/sell" className="btn btn-primary">Post your first listing</Link>
        </div>
      )}

      {active.length > 0 && (
        <>
          <h2 style={{ fontSize:16, fontWeight:600, marginBottom:14, color:'var(--muted)' }}>
            Active ({active.length})
          </h2>
          <div className="listing-grid" style={{ marginBottom:32 }}>
            {active.map(l => <ListingCard key={l._id} listing={l} />)}
          </div>
        </>
      )}

      {sold.length > 0 && (
        <>
          <h2 style={{ fontSize:16, fontWeight:600, marginBottom:14, color:'var(--muted)' }}>
            Sold ({sold.length})
          </h2>
          <div className="listing-grid" style={{ opacity:0.6 }}>
            {sold.map(l => <ListingCard key={l._id} listing={l} />)}
          </div>
        </>
      )}
    </div>
  );
}
