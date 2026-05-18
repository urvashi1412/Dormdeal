import { Link } from 'react-router-dom';

const CONDITION_BADGE = {
  'new':      'badge badge-green',
  'like-new': 'badge badge-green',
  'good':     'badge badge-blue',
  'fair':     'badge badge-amber',
  'poor':     'badge badge-red',
};

const CATEGORY_EMOJI = {
  textbooks:'📚', furniture:'🛋️', electronics:'💻', clothes:'👕', food:'🍕', other:'📦'
};

export default function ListingCard({ listing }) {
  return (
    <Link to={`/listing/${listing._id}`} className="card">
      <div className="card-img">
        {listing.photos && listing.photos.length > 0
          ? <img src={listing.photos[0]} alt={listing.title} />
          : <span>{CATEGORY_EMOJI[listing.category] || '📦'}</span>
        }
      </div>
      <div className="card-body">
        <div className="card-title">{listing.title}</div>
        <div className="card-meta">
          <span className="card-price">${listing.price}</span>
          <span className={CONDITION_BADGE[listing.condition] || 'badge badge-blue'}>
            {listing.condition}
          </span>
        </div>
        {listing.dorm && <div className="card-dorm">📍 {listing.dorm}</div>}
        {listing.seller && (
          <div className="card-dorm" style={{marginTop:2}}>
            {listing.seller.name}
            {listing.seller.rating > 0 && ` · ⭐ ${listing.seller.rating.toFixed(1)}`}
          </div>
        )}
      </div>
    </Link>
  );
}
