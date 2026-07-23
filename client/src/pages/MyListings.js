import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';
import { Plus, Package, CheckCircle, Eye } from 'lucide-react';
import ListingCard from '../components/ListingCard';
import EmptyState, { EmptyIllustration } from '../components/ui/EmptyState';
import { ListingGridSkeleton } from '../components/ui/Skeleton';

export default function MyListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/listings/user/me')
      .then(r => setListings(r.data))
      .catch(() => toast.error('Could not load listings'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <div className="dd-dashboard-header">
          <h1 className="page-title" style={{ margin: 0 }}>My listings</h1>
        </div>
        <ListingGridSkeleton count={4} />
      </div>
    );
  }

  const active = listings.filter(l => l.status === 'active');
  const sold = listings.filter(l => l.status === 'sold');

  return (
    <div>
      <div className="dd-dashboard-header">
        <h1 className="page-title" style={{ margin: 0 }}>My listings</h1>
        <Link to="/sell" className="dd-btn dd-btn--primary">
          <Plus size={16} />
          New listing
        </Link>
      </div>

      <div className="dd-analytics">
        <div className="dd-analytic-card">
          <div className="dd-analytic-card__value">{active.length}</div>
          <div className="dd-analytic-card__label">
            <Package size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />
            {' '}Active
          </div>
        </div>
        <div className="dd-analytic-card">
          <div className="dd-analytic-card__value">{sold.length}</div>
          <div className="dd-analytic-card__label">
            <CheckCircle size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />
            {' '}Sold
          </div>
        </div>
        <div className="dd-analytic-card">
          <div className="dd-analytic-card__value">{listings.length}</div>
          <div className="dd-analytic-card__label">
            <Eye size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />
            {' '}Total posted
          </div>
        </div>
      </div>

      {listings.length === 0 && (
        <EmptyState
          illustration={<EmptyIllustration type="listings" />}
          title="No listings yet"
          description="Start selling to students on your campus in under a minute."
          action={<Link to="/sell" className="dd-btn dd-btn--primary">Post your first listing</Link>}
        />
      )}

      {active.length > 0 && (
        <section className="dd-listings-section">
          <h2 className="dd-listings-section__title">
            Active
            <span className="dd-badge dd-badge--primary">{active.length}</span>
          </h2>
          <div className="dd-listing-grid">
            {active.map(l => <ListingCard key={l._id} listing={l} />)}
          </div>
        </section>
      )}

      {sold.length > 0 && (
        <section className="dd-listings-section dd-listings-section--sold">
          <h2 className="dd-listings-section__title">
            Sold
            <span className="dd-badge dd-badge--neutral">{sold.length}</span>
          </h2>
          <div className="dd-listing-grid">
            {sold.map(l => <ListingCard key={l._id} listing={l} />)}
          </div>
        </section>
      )}
    </div>
  );
}
