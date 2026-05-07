// frontend/src/components/FilmDetailModal.jsx
import { useEffect, useState } from "react";
import { XMarkIcon, PlayIcon, FilmIcon } from "@heroicons/react/24/solid";

function FilmDetailModal({ film, onClose }) {
  const [isClosing, setIsClosing] = useState(false);

  // Allow the exit animation to play before unmounting
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 210);
  };

  // Close on Escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") handleClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  if (!film) return null;

  const watchUrl =
    film.videoEmbedUrl ||
    film.videoSourceUrl ||
    (film.fileId
      ? `https://drive.google.com/file/d/${film.fileId}/preview`
      : null);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4
                  ${isClosing ? "animate-backdropOut" : "animate-backdropIn"}
                  bg-black/80 backdrop-blur-sm`}
      onClick={handleClose}
    >
      <div
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl
                    border border-zinc-700/60 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800
                    shadow-2xl shadow-black/60 scrollbar-thin
                    ${isClosing ? "animate-slideDown" : "animate-slideUp"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-3 top-3 z-10 rounded-full bg-black/50 p-1.5 text-zinc-300
                     backdrop-blur transition-[background-color,color,transform] duration-200
                     hover:bg-black/80 hover:text-white hover:rotate-90 active:scale-90"
          aria-label="Close"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>

        {/* Poster / Thumbnail */}
        <div className="relative w-full overflow-hidden rounded-t-2xl bg-zinc-950">
          {film.thumbnailUrl ? (
            <img
              src={film.thumbnailUrl}
              alt={`${film.title} poster`}
              className="w-full h-auto max-h-[50vh] object-contain transition-opacity duration-500"
            />
          ) : (
            <div className="flex h-48 w-full items-center justify-center bg-zinc-800">
              <FilmIcon className="h-16 w-16 text-zinc-600" />
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-zinc-900 to-transparent" />
        </div>

        {/* Body */}
        <div className="space-y-4 p-6 -mt-8 relative z-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300/90">
              FESTORAMA
            </p>
            <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {film.title}
            </h2>
            {film.releaseDate && (
              <p className="mt-1 text-sm text-zinc-400">
                Released{" "}
                {new Date(film.releaseDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
          </div>

          {film.description ? (
            <p className="text-sm leading-relaxed text-zinc-300">
              {film.description}
            </p>
          ) : (
            <p className="text-sm italic text-zinc-500">
              No description available.
            </p>
          )}

          {film.views > 0 && (
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              {film.views.toLocaleString()} views
            </div>
          )}

          {/* Watch button */}
          {watchUrl ? (
            <a
              href={watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 rounded-xl
                         bg-gradient-to-r from-cyan-500 to-blue-600
                         px-6 py-3 text-sm font-semibold text-white
                         shadow-lg shadow-cyan-500/20
                         transition-[transform,box-shadow,background-size] duration-300
                         ease-[cubic-bezier(0.34,1.56,0.64,1)]
                         hover:from-cyan-400 hover:to-blue-500
                         hover:shadow-xl hover:shadow-cyan-500/30
                         hover:scale-[1.03] active:scale-[0.97]"
            >
              <PlayIcon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110 group-hover:translate-x-0.5" />
              Watch Now
            </a>
          ) : (
            <p className="text-sm text-zinc-500 italic">
              No video link available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default FilmDetailModal;
