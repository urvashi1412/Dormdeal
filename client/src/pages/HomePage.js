import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';
import {
  Search, X, Shield, Check, ArrowRight, BookOpen, Laptop, Sofa,
  Shirt, UtensilsCrossed, Package, LayoutGrid,
} from 'lucide-react';
import ListingCard from '../components/ListingCard';
import EmptyState, { EmptyIllustration } from '../components/ui/EmptyState';
import { ListingGridSkeleton } from '../components/ui/Skeleton';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES, SORT_OPTIONS } from '../constants/categories';
import { formatPrice } from '../utils/format';
import {
  getRecentSearches, addRecentSearch, clearRecentSearches,
  getWishlist, isWishlisted,
} from '../utils/storage';

const CATEGORY_ICONS = {
  all: LayoutGrid,
  textbooks: BookOpen,
  electronics: Laptop,
  furniture: Sofa,
  clothes: Shirt,
  food: UtensilsCrossed,
  other: Package,
};

export default function HomePage() {
  const { user } = useAuth();
  const searchRef = useRef(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('newest');
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchFocused, setSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);

  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/listings', {
        params: { category, sort, search: query, page, limit: 20 },
      });
      setListings(data.listings);
      setPages(data.pages);
      setTotal(data.total);
    } catch {
      toast.error('Could not load listings');
    } finally {
      setLoading(false);
    }
  }, [category, sort, query, page]);

  useEffect(() => { fetchListings(); }, [fetchListings]);

  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, [query]);

  useEffect(() => {
    const onFocus = () => {
      searchRef.current?.focus();
      setSearchFocused(true);
    };
    const onWishlist = () => {
      setWishlistOpen(true);
      setShowWishlistOnly(true);
    };
    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onFocus();
      }
    };
    window.addEventListener('dd-focus-search', onFocus);
    window.addEventListener('dd-open-wishlist', onWishlist);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('dd-focus-search', onFocus);
      window.removeEventListener('dd-open-wishlist', onWishlist);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!wishlistOpen && !showWishlistOnly) return;
    const ids = getWishlist();
    if (ids.length === 0) {
      setWishlistItems([]);
      return;
    }
    Promise.all(
      ids.map(id =>
        api.get(`/api/listings/${id}`).then(r => r.data).catch(() => null)
      )
    ).then(items => setWishlistItems(items.filter(Boolean)));
  }, [wishlistOpen, showWishlistOnly, listings]);

  const handleSearch = (e) => {
    e.preventDefault();
    addRecentSearch(search);
    setQuery(search);
    setPage(1);
    setShowWishlistOnly(false);
    setSearchFocused(false);
  };

  const applyRecentSearch = (term) => {
    setSearch(term);
    setQuery(term);
    addRecentSearch(term);
    setPage(1);
    setShowWishlistOnly(false);
    setSearchFocused(false);
  };

  const clearSearch = () => {
    setQuery('');
    setSearch('');
    setPage(1);
    setShowWishlistOnly(false);
  };

  const displayedListings = showWishlistOnly
    ? listings.filter(l => isWishlisted(l._id))
    : listings;

  const trending = [...listings].slice(0, 4);
  const featuredSellers = Object.values(
    listings.reduce((acc, l) => {
      if (!l.seller?._id) return acc;
      if (!acc[l.seller._id]) {
        acc[l.seller._id] = { seller: l.seller, count: 0 };
      }
      acc[l.seller._id].count += 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  return (
    <div>
      {wishlistOpen && (
        <>
          <div className="dd-drawer-backdrop" onClick={() => setWishlistOpen(false)} />
          <div className="dd-drawer" role="dialog" aria-label="Wishlist">
            <div className="dd-drawer__head">
              <h2 className="dd-drawer__title">Wishlist</h2>
              <button type="button" className="dd-icon-btn" onClick={() => setWishlistOpen(false)} aria-label="Close">
                <X size={18} />
              </button>
            </div>
            <div className="dd-drawer__body">
              {wishlistItems.length === 0 ? (
                <EmptyState
                  illustration={<EmptyIllustration type="listings" />}
                  title="No saved items"
                  description="Tap the heart on any listing to save it here."
                />
              ) : (
                wishlistItems.map(item => (
                  <Link
                    key={item._id}
                    to={`/listing/${item._id}`}
                    className="dd-drawer-item"
                    onClick={() => setWishlistOpen(false)}
                  >
                    {item.photos?.[0] ? (
                      <img src={item.photos[0]} alt="" />
                    ) : (
                      <div className="dd-drawer-item__placeholder" />
                    )}
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{item.title}</div>
                      <div style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 13 }}>
                        {formatPrice(item.price)}
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </>
      )}

      <div className="dd-home-layout">
        <div className="dd-home-main">
          <section className="dd-hero">
            <div>
              <p className="dd-hero__eyebrow">{user?.college}</p>
              <h1 className="dd-hero__title">
                Buy. Sell. Connect.<br />
                Only with students from <em>your campus.</em>
              </h1>
              <p className="dd-hero__desc">
                The trusted marketplace built exclusively for your college community.
              </p>
              <div className="dd-hero__trust">
                <span className="dd-hero__trust-item"><Check size={14} /> Verified students</span>
                <span className="dd-hero__trust-item"><Check size={14} /> Safe & secure</span>
                <span className="dd-hero__trust-item"><Check size={14} /> Campus exclusive</span>
              </div>
            </div>
            <div className="dd-hero__art" aria-hidden="true">
              <svg viewBox="0 0 180 140" fill="none">
                <rect x="50" y="60" width="80" height="60" rx="4" fill="var(--primary-light)" />
                <path d="M90 30L45 65h90L90 30z" fill="var(--primary)" opacity="0.2" />
                <circle cx="130" cy="40" r="16" fill="var(--accent-light)" />
                <circle cx="50" cy="45" r="10" fill="var(--success-light)" />
                <rect x="75" y="85" width="30" height="35" rx="2" fill="var(--primary)" opacity="0.15" />
              </svg>
            </div>
          </section>

          <div className="dd-search-panel">
            <form onSubmit={handleSearch}>
              <div className="dd-search-bar">
                <Search size={18} className="dd-search-bar__icon" />
                <input
                  ref={searchRef}
                  className="dd-search-bar__input"
                  placeholder="Search anything on campus…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
                />
                {searchFocused && recentSearches.length > 0 && !query && (
                  <div className="dd-search-bar__dropdown">
                    <div className="dd-search-bar__recent-label">Recent searches</div>
                    {recentSearches.map(term => (
                      <button
                        key={term}
                        type="button"
                        className="dd-search-bar__recent-item"
                        onMouseDown={() => applyRecentSearch(term)}
                      >
                        {term}
                      </button>
                    ))}
                    <button
                      type="button"
                      className="dd-search-bar__recent-item"
                      style={{ color: 'var(--muted)', fontSize: 12 }}
                      onMouseDown={() => { clearRecentSearches(); setRecentSearches([]); }}
                    >
                      Clear recent
                    </button>
                  </div>
                )}
              </div>
              <div className="dd-search-filters">
                <button type="submit" className="dd-btn dd-btn--primary dd-btn--sm">Search</button>
                {query && (
                  <button type="button" className="dd-btn dd-btn--outline dd-btn--sm" onClick={clearSearch}>
                    Clear
                  </button>
                )}
                <select
                  className="dd-select"
                  value={sort}
                  onChange={e => { setSort(e.target.value); setPage(1); }}
                >
                  {SORT_OPTIONS.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </form>
          </div>

          <div className="dd-category-row">
            {CATEGORIES.map(({ id, label }) => {
              const Icon = CATEGORY_ICONS[id] || Package;
              return (
                <button
                  key={id}
                  type="button"
                  className={`dd-category-chip ${category === id ? 'is-active' : ''}`}
                  onClick={() => { setCategory(id); setPage(1); setShowWishlistOnly(false); }}
                >
                  <Icon size={15} />
                  {label}
                </button>
              );
            })}
          </div>

          {showWishlistOnly && (
            <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="dd-badge dd-badge--primary">Showing wishlist</span>
              <button type="button" className="dd-btn dd-btn--ghost dd-btn--sm" onClick={() => setShowWishlistOnly(false)}>
                Show all
              </button>
            </div>
          )}

          <div className="dd-section-header">
            <h2 className="dd-section-title">
              {query ? `Results for "${query}"` : showWishlistOnly ? 'Saved items' : 'Recently added'}
            </h2>
            {!loading && displayedListings.length > 0 && (
              <span className="dd-section-link">{total} listings</span>
            )}
          </div>

          {loading ? (
            <ListingGridSkeleton count={8} />
          ) : displayedListings.length === 0 ? (
            <EmptyState
              illustration={<EmptyIllustration type="listings" />}
              title={showWishlistOnly ? 'No wishlist items match' : 'No listings found'}
              description={
                showWishlistOnly
                  ? 'Save items from browse to see them here.'
                  : 'Be the first to post something on your campus.'
              }
              action={
                !showWishlistOnly && (
                  <Link to="/sell" className="dd-btn dd-btn--primary">Post a listing</Link>
                )
              }
            />
          ) : (
            <div className="dd-listing-grid">
              {displayedListings.map(l => (
                <ListingCard key={l._id} listing={l} />
              ))}
            </div>
          )}

          {pages > 1 && !showWishlistOnly && (
            <div className="dd-pagination">
              <button
                className="dd-btn dd-btn--outline dd-btn--sm"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                Previous
              </button>
              <span className="dd-pagination__info">{page} of {pages}</span>
              <button
                className="dd-btn dd-btn--outline dd-btn--sm"
                disabled={page === pages}
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>

        <aside className="dd-home-aside">
          {trending.length > 0 && (
            <div className="dd-panel">
              <h3 className="dd-panel__title">Campus vibes</h3>
              {trending.map((item, i) => (
                <Link key={item._id} to={`/listing/${item._id}`} className="dd-trending-item">
                  <span className="dd-trending-rank">{i + 1}</span>
                  {item.photos?.[0] ? (
                    <img src={item.photos[0]} alt="" className="dd-trending-thumb" />
                  ) : (
                    <div className="dd-trending-thumb" />
                  )}
                  <div className="dd-trending-info">
                    <div className="dd-trending-name">{item.title}</div>
                    <div className="dd-trending-price">{formatPrice(item.price)}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="dd-panel">
            <h3 className="dd-panel__title">
              <Shield size={16} />
              Safety first
            </h3>
            <ul className="dd-safety-list">
              <li><Check size={14} /> Verify seller identity before meeting</li>
              <li><Check size={14} /> Keep all conversations in-app</li>
              <li><Check size={14} /> Meet in public campus locations</li>
            </ul>
          </div>

          <div className="dd-panel">
            <h3 className="dd-panel__title">Campus stats</h3>
            <div className="dd-stats-grid">
              <div className="dd-stat">
                <div className="dd-stat__value">{total || listings.length}</div>
                <div className="dd-stat__label">Active listings</div>
              </div>
              <div className="dd-stat">
                <div className="dd-stat__value">{featuredSellers.length || '—'}</div>
                <div className="dd-stat__label">Top sellers</div>
              </div>
            </div>
          </div>

          {featuredSellers.length > 0 && (
            <div className="dd-panel">
              <h3 className="dd-panel__title">Featured sellers</h3>
              {featuredSellers.map(({ seller, count }) => (
                <div key={seller._id} className="dd-trending-item" style={{ cursor: 'default' }}>
                  <div className="dd-avatar dd-avatar--sm">{seller.name?.charAt(0)}</div>
                  <div className="dd-trending-info">
                    <div className="dd-trending-name">{seller.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>{count} active listings</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="dd-panel dd-invite-panel">
            <h3 className="dd-panel__title">Invite friends</h3>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12, lineHeight: 1.5 }}>
              More students means more deals on campus.
            </p>
            <button
              type="button"
              className="dd-btn dd-btn--primary dd-btn--sm"
              onClick={() => {
                navigator.clipboard?.writeText(window.location.origin);
                toast.success('Link copied!');
              }}
            >
              Invite now <ArrowRight size={14} />
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
