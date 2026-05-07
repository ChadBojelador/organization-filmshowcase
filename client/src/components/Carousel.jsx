// frontend/src/components/Carousel.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import FilmCard from "./FilmCard";
import { FilmSkeletonCarousel } from "./FilmSkeleton";

const SWIPE_THRESHOLD = 40;
const WHEEL_COOLDOWN_MS = 460;

function getWrappedDistance(index, activeIndex, total) {
  if (total <= 1) return 0;

  let distance = index - activeIndex;
  const half = total / 2;

  if (distance > half) distance -= total;
  if (distance < -half) distance += total;

  return distance;
}

function getStepSize(viewportWidth) {
  if (viewportWidth < 640) return 210;
  if (viewportWidth < 1024) return 240;
  return 285;
}

export default function Carousel({ films = [], isLoading = false, fullWidth = false, onFilmClick }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(
    typeof window === "undefined" ? 1280 : window.innerWidth
  );
  const pointerStartRef = useRef(null);
  const wheelCooldownRef = useRef(false);
  const wheelTimeoutRef = useRef(null);

  useEffect(() => {
    if (activeIndex >= films.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, films.length]);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (wheelTimeoutRef.current) {
        clearTimeout(wheelTimeoutRef.current);
      }
    };
  }, []);

  const cardStep = useMemo(() => getStepSize(viewportWidth), [viewportWidth]);

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % films.length);
  };

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + films.length) % films.length);
  };

  const handlePointerDown = (event) => {
    pointerStartRef.current = event.clientX;
  };

  const handlePointerUp = (event) => {
    if (pointerStartRef.current == null) return;

    const delta = event.clientX - pointerStartRef.current;
    pointerStartRef.current = null;

    if (Math.abs(delta) < SWIPE_THRESHOLD) return;
    if (delta < 0) goNext();
    if (delta > 0) goPrev();
  };

  const handleWheel = (event) => {
    if (wheelCooldownRef.current) return;

    const movement = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    if (Math.abs(movement) < 8) return;

    event.preventDefault();
    wheelCooldownRef.current = true;

    if (movement > 0) goNext();
    if (movement < 0) goPrev();

    wheelTimeoutRef.current = setTimeout(() => {
      wheelCooldownRef.current = false;
    }, WHEEL_COOLDOWN_MS);
  };

  if (isLoading) {
    return <FilmSkeletonCarousel />;
  }

  if (!Array.isArray(films) || films.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 text-sm text-zinc-400">
        No films available yet.
      </div>
    );
  }

  return (
    <section
      className={`relative w-full rounded-2xl border border-zinc-200/60 bg-white/60 py-4 shadow-sm backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/40 ${
        fullWidth ? "rounded-none border-x-0" : ""
      }`}
    >
      <button
        type="button"
        aria-label="Previous poster"
        onClick={goPrev}
        className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-zinc-300
                   bg-white/90 px-3 py-2 text-xs font-medium text-zinc-700 shadow-md
                   transition-[transform,background-color,box-shadow] duration-200
                   ease-[cubic-bezier(0.34,1.56,0.64,1)]
                   hover:-translate-y-[54%] hover:bg-white hover:shadow-lg
                   active:scale-90
                   dark:border-zinc-700 dark:bg-zinc-900/90 dark:text-zinc-200 dark:hover:bg-zinc-800"
      >
        Previous
      </button>

      <button
        type="button"
        aria-label="Next poster"
        onClick={goNext}
        className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-zinc-300
                   bg-white/90 px-3 py-2 text-xs font-medium text-zinc-700 shadow-md
                   transition-[transform,background-color,box-shadow] duration-200
                   ease-[cubic-bezier(0.34,1.56,0.64,1)]
                   hover:-translate-y-[54%] hover:bg-white hover:shadow-lg
                   active:scale-90
                   dark:border-zinc-700 dark:bg-zinc-900/90 dark:text-zinc-200 dark:hover:bg-zinc-800"
      >
        Next
      </button>

      <div
        className={`relative mx-auto h-[320px] w-full touch-pan-y select-none overflow-hidden sm:h-[360px] lg:h-[400px] ${
          fullWidth ? "max-w-none px-8 sm:px-12 lg:px-16" : "max-w-5xl"
        }`}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          pointerStartRef.current = null;
        }}
        onWheel={handleWheel}
      >
        {films.map((film, index) => {
          const distance = getWrappedDistance(index, activeIndex, films.length);
          const absDistance = Math.abs(distance);
          const isVisible = absDistance <= 2;
          const opacity = absDistance === 0 ? 1 : absDistance === 1 ? 0.5 : 0.2;
          const zIndex = 50 - absDistance;
          const translateX = distance * cardStep;

          return (
            <div
              key={`${film.id ?? film.title}-${film.thumbnailUrl}`}
              aria-hidden={absDistance !== 0}
              className="absolute left-1/2 top-1/2 w-[44vw] max-w-[190px] min-w-[140px]
                         transition-[transform,opacity] duration-500
                         ease-[cubic-bezier(0.25,1,0.5,1)]
                         sm:w-[32vw] md:w-[22vw] lg:w-[185px]"
              style={{
                transform: `translate(-50%, -50%) translateX(${translateX}px)`,
                opacity: isVisible ? opacity : 0,
                zIndex,
                pointerEvents: absDistance === 0 ? "auto" : "none",
              }}
            >
              <FilmCard
                title={film.title}
                thumbnailUrl={film.thumbnailUrl}
                onClick={() => onFilmClick && onFilmClick(film)}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
