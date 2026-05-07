// src/components/FilmSkeleton.jsx
// Premium shimmer skeleton cards shown while films are loading.
import "./FilmSkeleton.css";

/** Single shimmer card (poster shape) */
export function FilmSkeletonCard({ delay = 0 }) {
  return (
    <div
      className="fsk-card"
      aria-hidden="true"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="fsk-poster" />
      <div className="fsk-title" />
      <div className="fsk-subtitle" />
    </div>
  );
}

/** Grid of skeleton cards — replaces the "All Films" grid while loading */
export function FilmSkeletonGrid({ count = 15 }) {
  return (
    <div>
      <div className="fsk-grid-label">
        Loading Films
        <span className="fsk-dot-group" aria-hidden="true">
          <span /><span /><span />
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: count }, (_, i) => (
          <FilmSkeletonCard key={i} delay={i * 35} />
        ))}
      </div>
    </div>
  );
}

/** Three-card skeleton row — replaces the Carousel while loading */
export function FilmSkeletonCarousel() {
  return (
    <section className="relative w-full rounded-2xl border border-zinc-800 bg-zinc-900/40 py-4 shadow-sm">
      <div className="fsk-carousel-row">
        <FilmSkeletonCard delay={80} />
        <FilmSkeletonCard delay={0} />
        <FilmSkeletonCard delay={80} />
      </div>
    </section>
  );
}

