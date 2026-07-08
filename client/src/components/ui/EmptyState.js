export default function EmptyState({ illustration, title, description, action }) {
  return (
    <div className="dd-empty">
      <div className="dd-empty-art" aria-hidden="true">
        {illustration}
      </div>
      <h3 className="dd-empty-title">{title}</h3>
      {description && <p className="dd-empty-desc">{description}</p>}
      {action}
    </div>
  );
}

export function EmptyIllustration({ type = 'box' }) {
  if (type === 'messages') {
    return (
      <svg viewBox="0 0 120 100" fill="none">
        <rect x="20" y="25" width="80" height="50" rx="8" fill="var(--primary-light)" />
        <path d="M20 35l40 28 40-28" stroke="var(--primary)" strokeWidth="2" fill="none" />
        <circle cx="90" cy="30" r="12" fill="var(--accent-light)" />
      </svg>
    );
  }
  if (type === 'listings') {
    return (
      <svg viewBox="0 0 120 100" fill="none">
        <rect x="25" y="20" width="70" height="55" rx="6" fill="var(--surface)" stroke="var(--border)" />
        <rect x="32" y="28" width="56" height="28" rx="4" fill="var(--bg)" />
        <rect x="32" y="62" width="24" height="6" rx="3" fill="var(--primary-light)" />
        <rect x="60" y="62" width="28" height="6" rx="3" fill="var(--border)" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 120 100" fill="none">
      <path d="M60 15L25 45v35h70V45L60 15z" fill="var(--primary-light)" />
      <rect x="48" y="55" width="24" height="25" rx="2" fill="var(--primary)" opacity="0.3" />
      <circle cx="85" cy="25" r="10" fill="var(--accent-light)" />
    </svg>
  );
}
