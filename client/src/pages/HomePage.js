import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import ListingCard from '../components/ListingCard';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['all','textbooks','furniture','electronics','clothes','food','other'];
const SORTS = [
  { value: 'newest',     label: 'Newest first' },
  { value: 'price_asc',  label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
];

export default function HomePage() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [category, setCategory] = useState('all');
  const [sort, setSort]         = useState('newest');
  const [search, setSearch]     = useState('');
  const [query, setQuery]       = useState('');
  const [page, setPage]         = useState(1);
  const [pages, setPages]       = useState(1);

  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/listings', {
        params: { category, sort, search: query, page, limit: 20 }
      });
      setListings(data.listings);
      setPages(data.pages);
    } catch {
      toast.error('Could not load listings');
    } finally {
      setLoading(false);
    }
  }, [category, sort, query, page]);

  useEffect(() => { fetchListings(); }, [fetchListings]);

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(search);
    setPage(1);
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
          Listings at {user?.college}
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>
          Only students from your college can see these
        </p>
      </div>

      {/* Search & Sort */}
      <div className="filters">
        <form onSubmit={handleSearch} style={{ display:'flex', gap:8, flex:1 }}>
          <input className="search-input" placeholder="Search listings…"
            value={search} onChange={e => setSearch(e.target.value)} />
          <button type="submit" className="btn btn-primary btn-sm">Search</button>
          {query && <button type="button" className="btn btn-outline btn-sm"
            onClick={() => { setQuery(''); setSearch(''); }}>Clear</button>}
        </form>
        <select className="form-select" style={{ width:'auto', padding:'8px 12px' }}
          value={sort} onChange={e => { setSort(e.target.value); setPage(1); }}>
          {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      {/* Category pills */}
      <div className="filters" style={{ marginBottom: 20 }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => { setCategory(cat); setPage(1); }}
            className={`filter-pill ${category === cat ? 'active' : ''}`}>
            {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <p style={{ color:'var(--muted)', textAlign:'center', padding:'60px 0' }}>Loading…</p>
      ) : listings.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px 0', color:'var(--muted)' }}>
          <div style={{ fontSize:48, marginBottom:12 }}>🏫</div>
          <p style={{ fontWeight:600, marginBottom:6 }}>No listings found</p>
          <p style={{ fontSize:14 }}>Be the first to post something!</p>
        </div>
      ) : (
        <div className="listing-grid">
          {listings.map(l => <ListingCard key={l._id} listing={l} />)}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div style={{ display:'flex', gap:8, justifyContent:'center', marginTop:28 }}>
          <button className="btn btn-outline btn-sm" disabled={page === 1}
            onClick={() => setPage(p => p - 1)}>← Prev</button>
          <span style={{ padding:'6px 12px', fontSize:14, color:'var(--muted)' }}>
            {page} / {pages}
          </span>
          <button className="btn btn-outline btn-sm" disabled={page === pages}
            onClick={() => setPage(p => p + 1)}>Next →</button>
        </div>
      )}
    </div>
  );
}
