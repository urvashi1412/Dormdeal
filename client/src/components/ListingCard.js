import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Heart, MapPin } from 'lucide-react';
import { ConditionBadge } from './ui/Badge';
import Avatar from './ui/Avatar';
import { formatPrice, timeAgo } from '../utils/format';
import { isWishlisted, toggleWishlist } from '../utils/storage';

const CATEGORY_LABELS = {
  textbooks: 'Books',
  furniture: 'Furniture',
  electronics: 'Electronics',
  clothes: 'Clothes',
  food: 'Food',
  other: 'Other',
};

export default function ListingCard({ listing, compact = false }) {
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    setWishlisted(isWishlisted(listing._id));
    const handler = () => setWishlisted(isWishlisted(listing._id));
    window.addEventListener('dd-wishlist-change', handler);
    return () => window.removeEventListener('dd-wishlist-change', handler);
  }, [listing._id]);

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(listing._id);
  };

  return (
    <Link to={`/listing/${listing._id}`} className={`dd-listing-card ${compact ? 'dd-listing-card--compact' : ''}`}>
      <div className="dd-listing-card__media">
        {listing.photos?.length > 0 ? (
          <img src={listing.photos[0]} alt={listing.title} loading="lazy" />
        ) : (
          <div className="dd-listing-card__placeholder">
            <span>{CATEGORY_LABELS[listing.category]?.charAt(0) || '?'}</span>
          </div>
        )}
        <div className="dd-listing-card__badges">
          <ConditionBadge condition={listing.condition} />
          {listing.status === 'sold' && <span className="dd-badge dd-badge--danger">Sold</span>}
        </div>
        <button
          type="button"
          className={`dd-listing-card__wishlist ${wishlisted ? 'is-active' : ''}`}
          onClick={handleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="dd-listing-card__body">
        <h3 className="dd-listing-card__title">{listing.title}</h3>
        <div className="dd-listing-card__price">{formatPrice(listing.price)}</div>
        <div className="dd-listing-card__meta">
          {listing.dorm && (
            <span className="dd-listing-card__location">
              <MapPin size={12} />
              {listing.dorm}
            </span>
          )}
          {listing.createdAt && (
            <span className="dd-listing-card__time">{timeAgo(listing.createdAt)}</span>
          )}
        </div>
        {listing.seller && (
          <div className="dd-listing-card__seller">
            <Avatar name={listing.seller.name} size="xs" />
            <span>{listing.seller.name}</span>
            {listing.seller.rating > 0 && (
              <span className="dd-listing-card__rating">{listing.seller.rating.toFixed(1)}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
