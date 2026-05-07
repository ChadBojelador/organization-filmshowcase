// src/components/FilmSkeleton.jsx
// Shimmer placeholder cards shown while films are loading.
import "./FilmSkeleton.css";

/** Single shimmer card (poster shape) */
export function FilmSkeletonCard() {
  return (
    <div className="fsk-card" aria-hidden="true">
      <div className="fsk-poster" />
      <div className="fsk-title" />
    </div>
  );
}

/** Grid of skeleton cards — replaces the "All Films" grid while loading */
export function FilmSkeletonGrid({ count = 10 }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {Array.from({ length: count }, (_, i) => (
        <FilmSkeletonCard key={i} />
      ))}
    </div>
  );
}

/** Three-card skeleton row — replaces the Carousel while loading */
export function FilmSkeletonCarousel() {
  return (
    <section className="relative w-full rounded-2xl border border-zinc-800 bg-zinc-900/40 py-4 shadow-sm">
      <div className="fsk-carousel-row">
        <FilmSkeletonCard />
        <FilmSkeletonCard />
        <FilmSkeletonCard />
      </div>
    </section>
  );
}
