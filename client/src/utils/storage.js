const WISHLIST_KEY = 'dd_wishlist';
const RECENT_SEARCHES_KEY = 'dd_recent_searches';
const RECENTLY_VIEWED_KEY = 'dd_recently_viewed';

export function getWishlist() {
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');
  } catch {
    return [];
  }
}

/** Load seed-generated wishlist for demo account (written by npm run seed). */
export async function loadDemoWishlistIfNeeded(userEmail) {
  if (!userEmail || getWishlist().length > 0) return;
  try {
    const res = await fetch('/demo-wishlist.json', { cache: 'no-store' });
    if (!res.ok) return;
    const data = await res.json();
    if (data.email !== userEmail || !Array.isArray(data.listingIds)) return;
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(data.listingIds));
    window.dispatchEvent(new Event('dd-wishlist-change'));
  } catch {
    // demo file optional
  }
}

export function isWishlisted(id) {
  return getWishlist().includes(id);
}

export function toggleWishlist(id) {
  const list = getWishlist();
  const next = list.includes(id) ? list.filter(x => x !== id) : [...list, id];
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event('dd-wishlist-change'));
  return next;
}

export function getRecentSearches() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || '[]');
  } catch {
    return [];
  }
}

export function addRecentSearch(query) {
  const trimmed = query.trim();
  if (!trimmed) return;
  const next = [trimmed, ...getRecentSearches().filter(s => s !== trimmed)].slice(0, 6);
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
}

export function clearRecentSearches() {
  localStorage.removeItem(RECENT_SEARCHES_KEY);
}

export function getRecentlyViewed() {
  try {
    return JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || '[]');
  } catch {
    return [];
  }
}

export function addRecentlyViewed(listing) {
  if (!listing?._id) return;
  const entry = {
    _id: listing._id,
    title: listing.title,
    price: listing.price,
    photos: listing.photos,
    category: listing.category,
  };
  const next = [entry, ...getRecentlyViewed().filter(l => l._id !== listing._id)].slice(0, 8);
  localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(next));
}
