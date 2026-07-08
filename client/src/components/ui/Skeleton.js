export function Skeleton({ className = '', style }) {
  return <div className={`dd-skeleton ${className}`} style={style} aria-hidden="true" />;
}

export function ListingCardSkeleton() {
  return (
    <div className="dd-listing-card dd-listing-card--skeleton">
      <Skeleton className="dd-listing-card__media" />
      <div className="dd-listing-card__body">
        <Skeleton style={{ height: 14, width: '85%', marginBottom: 10 }} />
        <Skeleton style={{ height: 20, width: '40%', marginBottom: 12 }} />
        <Skeleton style={{ height: 12, width: '60%' }} />
      </div>
    </div>
  );
}

export function ListingGridSkeleton({ count = 8 }) {
  return (
    <div className="dd-listing-grid">
      {Array.from({ length: count }).map((_, i) => (
        <ListingCardSkeleton key={i} />
      ))}
    </div>
  );
}
