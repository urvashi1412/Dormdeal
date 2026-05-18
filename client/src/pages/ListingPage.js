import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const CONDITION_BADGE = {
  'new':'badge badge-green','like-new':'badge badge-green',
  'good':'badge badge-blue','fair':'badge badge-amber','poor':'badge badge-red'
};

export default function ListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    axios.get(`/api/listings/${id}`)
      .then(r => setListing(r.data))
      .catch(() => toast.error('Listing not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleContact = () => {
    const roomId = `${listing._id}_${user._id}`;
    navigate(`/messages/${roomId}`, { state: { listing, receiver: listing.seller } });
  };

  const handleMarkSold = async () => {
    setMarking(true);
    try {
      await axios.patch(`/api/listings/${id}`, { status: 'sold' });
      setListing(l => ({ ...l, status: 'sold' }));
      toast.success('Marked as sold!');
    } catch { toast.error('Could not update listing'); }
    finally { setMarking(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this listing?')) return;
    try {
      await axios.delete(`/api/listings/${id}`);
      toast.success('Listing deleted');
      navigate('/my-listings');
    } catch { toast.error('Could not delete'); }
  };

  if (loading) return <p className="loading-screen">Loading…</p>;
  if (!listing) return <p className="loading-screen">Listing not found.</p>;

  const isMine = user._id === listing.seller?._id;
  const initials = listing.seller?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';

  return (
    <div>
      <button onClick={() => navigate(-1)} className="btn btn-outline btn-sm" style={{ marginBottom:20 }}>
        ← Back
      </button>

      <div className="listing-detail">
        {/* Photos */}
        <div>
          {listing.photos && listing.photos.length > 0 ? (
            <div className="listing-photos">
              {listing.photos.map((p, i) => (
                <img key={i} src={p} alt={listing.title}
                  className={i === 0 ? 'main-photo' : ''} />
              ))}
            </div>
          ) : (
            <div style={{ background:'var(--bg)', borderRadius:10, height:300,
              display:'flex', alignItems:'center', justifyContent:'center', fontSize:80 }}>
              📦
            </div>
          )}

          <div style={{ marginTop:24 }}>
            <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap', marginBottom:12 }}>
              <h1 style={{ fontSize:22, fontWeight:700 }}>{listing.title}</h1>
              {listing.status === 'sold' && <span className="badge badge-red">Sold</span>}
            </div>
            <div style={{ display:'flex', gap:8, marginBottom:16 }}>
              <span className={CONDITION_BADGE[listing.condition] || 'badge badge-blue'}>
                {listing.condition}
              </span>
              <span className="badge badge-blue">{listing.category}</span>
            </div>
            <p style={{ color:'var(--muted)', lineHeight:1.7 }}>{listing.description}</p>
            {listing.dorm && <p style={{ marginTop:12, color:'var(--muted)', fontSize:14 }}>📍 {listing.dorm}</p>}
          </div>
        </div>

        {/* Sidebar */}
        <div className="listing-sidebar">
          <div className="listing-price-card">
            <div className="listing-price">${listing.price}</div>

            {/* Seller info */}
            <div className="seller-card">
              <div className="seller-avatar">{initials}</div>
              <div>
                <div style={{ fontWeight:600 }}>{listing.seller?.name}</div>
                <div style={{ fontSize:13, color:'var(--muted)' }}>
                  {listing.seller?.rating > 0
                    ? `⭐ ${listing.seller.rating.toFixed(1)} (${listing.seller.ratingCount} ratings)`
                    : 'New seller'}
                </div>
              </div>
            </div>

            {isMine ? (
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {listing.status === 'active' && (
                  <button onClick={handleMarkSold} className="btn btn-primary" disabled={marking}
                    style={{ justifyContent:'center' }}>
                    {marking ? 'Updating…' : '✓ Mark as sold'}
                  </button>
                )}
                <button onClick={handleDelete} className="btn btn-danger" style={{ justifyContent:'center' }}>
                  Delete listing
                </button>
              </div>
            ) : (
              <button onClick={handleContact} className="btn btn-primary"
                style={{ width:'100%', justifyContent:'center' }}
                disabled={listing.status === 'sold'}>
                {listing.status === 'sold' ? 'Item sold' : '💬 Message seller'}
              </button>
            )}

            <p style={{ fontSize:12, color:'var(--muted)', textAlign:'center', marginTop:12 }}>
              Meet on campus · Cash or Venmo only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
