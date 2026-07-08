import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  ArrowLeft, MapPin, MessageCircle, Share2, Heart, Shield, Trash2, CheckCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ListingCard from '../components/ListingCard';
import Avatar from '../components/ui/Avatar';
import Badge, { ConditionBadge } from '../components/ui/Badge';
import { ListingGridSkeleton } from '../components/ui/Skeleton';
import { formatPrice } from '../utils/format';
import { addRecentlyViewed, getRecentlyViewed, isWishlisted, toggleWishlist } from '../utils/storage';

export default function ListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [related, setRelated] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/listings/${id}`)
      .then(r => {
        setListing(r.data);
        addRecentlyViewed(r.data);
        setWishlisted(isWishlisted(r.data._id));
        return axios.get('/api/listings', {
          params: { category: r.data.category, limit: 5 },
        });
      })
      .then(r => {
        if (r?.data?.listings) {
          setRelated(r.data.listings.filter(l => l._id !== id).slice(0, 4));
        }
      })
      .catch(() => toast.error('Listing not found'))
      .finally(() => setLoading(false));

    setRecentlyViewed(getRecentlyViewed().filter(l => l._id !== id));
  }, [id]);

  useEffect(() => {
    const handler = () => setWishlisted(isWishlisted(id));
    window.addEventListener('dd-wishlist-change', handler);
    return () => window.removeEventListener('dd-wishlist-change', handler);
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
    } catch {
      toast.error('Could not update listing');
    } finally {
      setMarking(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this listing?')) return;
    try {
      await axios.delete(`/api/listings/${id}`);
      toast.success('Listing deleted');
      navigate('/my-listings');
    } catch {
      toast.error('Could not delete');
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: listing.title, url });
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied!');
    }
  };

  const handleWishlist = () => {
    toggleWishlist(id);
    setWishlisted(isWishlisted(id));
  };

  if (loading) {
    return (
      <div className="dd-listing-page">
        <ListingGridSkeleton count={1} />
      </div>
    );
  }

  if (!listing) {
    return <p className="loading-screen">Listing not found.</p>;
  }

  const isMine = user._id === listing.seller?._id;
  const photos = listing.photos || [];

  return (
    <div className="dd-listing-page">
      <button type="button" onClick={() => navigate(-1)} className="dd-btn dd-btn--outline dd-btn--sm dd-back-btn">
        <ArrowLeft size={16} />
        Back
      </button>

      <div className="dd-listing-detail">
        <div>
          {photos.length > 0 ? (
            <div>
              <div className="dd-gallery" style={{ gridTemplateColumns: '1fr' }}>
                <img
                  src={photos[activePhoto]}
                  alt={listing.title}
                  className="dd-gallery__main"
                />
              </div>
              {photos.length > 1 && (
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  {photos.map((p, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActivePhoto(i)}
                      style={{
                        padding: 0,
                        border: activePhoto === i ? '2px solid var(--primary)' : '2px solid transparent',
                        borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        width: 72,
                        height: 72,
                        background: 'none',
                      }}
                    >
                      <img src={p} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="dd-gallery__empty">?</div>
          )}

          <div className="dd-listing-info">
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <h1 className="dd-listing-info__title">{listing.title}</h1>
              {listing.status === 'sold' && <Badge variant="danger">Sold</Badge>}
            </div>
            <div className="dd-listing-info__tags">
              <ConditionBadge condition={listing.condition} />
              <Badge variant="neutral">{listing.category}</Badge>
            </div>
            <p className="dd-listing-info__desc">{listing.description}</p>
            {listing.dorm && (
              <p className="dd-listing-info__location">
                <MapPin size={15} />
                {listing.dorm}
              </p>
            )}
          </div>
        </div>

        <div className="dd-listing-sidebar">
          <div className="dd-price-card">
            <div className="dd-price-card__price">{formatPrice(listing.price)}</div>

            <div className="dd-seller-row">
              <Avatar name={listing.seller?.name} size="md" />
              <div>
                <div className="dd-seller-row__name">{listing.seller?.name}</div>
                <div className="dd-seller-row__meta">
                  {listing.seller?.rating > 0
                    ? `${listing.seller.rating.toFixed(1)} · ${listing.seller.ratingCount} ratings`
                    : 'New seller'}
                </div>
              </div>
            </div>

            {isMine ? (
              <div className="dd-price-card__actions">
                {listing.status === 'active' && (
                  <button
                    onClick={handleMarkSold}
                    className="dd-btn dd-btn--primary dd-btn--block"
                    disabled={marking}
                  >
                    <CheckCircle size={16} />
                    {marking ? 'Updating…' : 'Mark as sold'}
                  </button>
                )}
                <button onClick={handleDelete} className="dd-btn dd-btn--danger dd-btn--block">
                  <Trash2 size={16} />
                  Delete listing
                </button>
              </div>
            ) : (
              <div className="dd-price-card__actions">
                <button
                  onClick={handleContact}
                  className="dd-btn dd-btn--primary dd-btn--block"
                  disabled={listing.status === 'sold'}
                >
                  <MessageCircle size={16} />
                  {listing.status === 'sold' ? 'Item sold' : 'Message seller'}
                </button>
                <div className="dd-price-card__secondary">
                  <button type="button" className="dd-btn dd-btn--outline" style={{ flex: 1 }} onClick={handleWishlist}>
                    <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
                    {wishlisted ? 'Saved' : 'Save'}
                  </button>
                  <button type="button" className="dd-btn dd-btn--outline" style={{ flex: 1 }} onClick={handleShare}>
                    <Share2 size={16} />
                    Share
                  </button>
                </div>
              </div>
            )}

            <p className="dd-price-card__note">Meet on campus · Cash or Venmo only</p>
          </div>

          <div className="dd-safety-card">
            <div className="dd-safety-card__title">
              <Shield size={14} />
              Safety tips
            </div>
            <p>Inspect items in person. Meet in well-lit public areas. Never share payment info in chat.</p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="dd-related">
          <div className="dd-section-header">
            <h2 className="dd-section-title">Related items</h2>
          </div>
          <div className="dd-listing-grid">
            {related.map(l => <ListingCard key={l._id} listing={l} />)}
          </div>
        </section>
      )}

      {recentlyViewed.length > 0 && (
        <section className="dd-related">
          <div className="dd-section-header">
            <h2 className="dd-section-title">Recently viewed</h2>
          </div>
          <div className="dd-listing-grid">
            {recentlyViewed.slice(0, 4).map(l => (
              <Link key={l._id} to={`/listing/${l._id}`} className="dd-listing-card">
                <div className="dd-listing-card__media">
                  {l.photos?.[0] ? <img src={l.photos[0]} alt={l.title} /> : <div className="dd-listing-card__placeholder"><span>?</span></div>}
                </div>
                <div className="dd-listing-card__body">
                  <h3 className="dd-listing-card__title">{l.title}</h3>
                  <div className="dd-listing-card__price">{formatPrice(l.price)}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
