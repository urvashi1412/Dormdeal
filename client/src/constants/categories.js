export const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'textbooks', label: 'Books' },
  { id: 'electronics', label: 'Electronics' },
  { id: 'furniture', label: 'Furniture' },
  { id: 'clothes', label: 'Clothes' },
  { id: 'food', label: 'Food' },
  { id: 'other', label: 'Other' },
];

export const CONDITION_STYLES = {
  new: 'success',
  'like-new': 'accent',
  good: 'primary',
  fair: 'warning',
  poor: 'danger',
};

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
];
