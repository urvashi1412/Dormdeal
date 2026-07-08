import { Link } from 'react-router-dom';

export default function Logo({ compact = false }) {
  return (
    <Link to="/" className="dd-logo" aria-label="DormDeal home">
      <span className="dd-logo-mark" aria-hidden="true">
        <svg viewBox="0 0 32 32" fill="none">
          <rect x="4" y="14" width="24" height="14" rx="2" fill="currentColor" opacity="0.12" />
          <path
            d="M16 4L6 14h20L16 4z"
            fill="currentColor"
          />
          <rect x="13" y="18" width="6" height="10" rx="1" fill="currentColor" />
          <circle cx="24" cy="8" r="3" fill="var(--accent)" />
        </svg>
      </span>
      {!compact && <span className="dd-logo-text">DormDeal</span>}
    </Link>
  );
}
