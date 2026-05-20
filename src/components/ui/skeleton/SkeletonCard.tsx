import './SkeletonCard.scss';

interface SkeletonCardProps {
  index?: number;
}

export const SkeletonCard = ({ index = 0 }: SkeletonCardProps) => {
  return (
    <div
      className="skeleton-card-wrapper"
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      <div className="skeleton-card">
        <div className="skeleton-card__image skeleton-shimmer" />
        <div className="skeleton-card__body">
          <div className="skeleton-card__title skeleton-shimmer" />
          <div className="skeleton-card__genre skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
};