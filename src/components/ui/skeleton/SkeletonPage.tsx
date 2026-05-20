import './SkeletonPage.scss';

export const SkeletonSongPage = () => {
  return (
    <div className="skeleton-song-page">

      <div className="skeleton-song-page__content">

        <div className="skeleton-song-page__cover skeleton-shimmer" />

        <div className="skeleton-song-page__info">
          <div className="skeleton-song-page__info-title skeleton-shimmer" />
          <div className="skeleton-song-page__info-artist skeleton-shimmer" />
          <div className="skeleton-song-page__info-meta skeleton-shimmer" />
        </div>

        <div className="skeleton-song-page__actions">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton-song-page__action-btn skeleton-shimmer" />
          ))}
        </div>

        <div className="skeleton-song-page__progress">
          <div className="skeleton-song-page__progress-bar skeleton-shimmer" />
          <div className="skeleton-song-page__progress-times">
            <div className="skeleton-shimmer skeleton-song-page__time" />
            <div className="skeleton-shimmer skeleton-song-page__time" />
          </div>
        </div>

        <div className="skeleton-song-page__controls">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`skeleton-song-page__ctrl-btn skeleton-shimmer ${i === 2 ? 'skeleton-song-page__ctrl-btn--primary' : ''}`}
            />
          ))}
        </div>
      </div>

      <div className="skeleton-song-page__playlist">
        <div className="skeleton-song-page__playlist-header skeleton-shimmer" />

        <div className="skeleton-song-page__playlist-list">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="skeleton-song-page__playlist-item"
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <div className="skeleton-song-page__playlist-thumb skeleton-shimmer" />
              <div className="skeleton-song-page__playlist-meta">
                <div className="skeleton-song-page__playlist-name skeleton-shimmer" />
                <div className="skeleton-song-page__playlist-sub skeleton-shimmer" />
              </div>
              <div className="skeleton-song-page__playlist-dur skeleton-shimmer" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};