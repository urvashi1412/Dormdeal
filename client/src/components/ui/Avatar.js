export default function Avatar({ name, size = 'md', className = '' }) {
  const initials = name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?';

  return (
    <div className={`dd-avatar dd-avatar--${size} ${className}`} aria-hidden="true">
      {initials}
    </div>
  );
}
