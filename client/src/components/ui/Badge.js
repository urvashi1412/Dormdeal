import { formatCondition } from '../../utils/format';

export default function Badge({ children, variant = 'neutral', className = '' }) {
  return (
    <span className={`dd-badge dd-badge--${variant} ${className}`}>
      {children}
    </span>
  );
}

export function ConditionBadge({ condition }) {
  const variants = {
    new: 'success',
    'like-new': 'accent',
    good: 'primary',
    fair: 'warning',
    poor: 'danger',
  };
  return (
    <Badge variant={variants[condition] || 'neutral'}>
      {formatCondition(condition)}
    </Badge>
  );
}
