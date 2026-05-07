// frontend/src/components/FilmCard.jsx
import { useEffect, useRef } from "react";

function FilmCard({ title, thumbnailUrl, description, onClick }) {
  const imgRef = useRef(null);

  // Mark image as loaded so the CSS opacity transition fires
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    if (img.complete) {
      img.classList.add("loaded");
    } else {
      const onLoad = () => img.classList.add("loaded");
      img.addEventListener("load", onLoad);
      return () => img.removeEventListener("load", onLoad);
    }
  }, [thumbnailUrl]);

  return (
    <article
      className="group cursor-pointer overflow-hidden rounded-xl bg-zinc-900 shadow-lg
                 transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                 hover:scale-[1.04] hover:shadow-2xl hover:shadow-cyan-500/15
                 active:scale-[0.98] active:duration-100"
      onClick={onClick}
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-800">
        <img
          ref={imgRef}
          src={thumbnailUrl}
          alt={`${title} poster`}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover
                     transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
                     group-hover:scale-[1.07]"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center
                        bg-black/0 transition-[background-color] duration-300
                        group-hover:bg-black/55">
          <div className="scale-0 rounded-full bg-cyan-500/90 p-3 shadow-lg shadow-cyan-500/40
                          transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                          group-hover:scale-100">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="h-6 w-6">
              <path
                fillRule="evenodd"
                d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {/* Title bar at bottom */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent
                        p-3 sm:p-4 translate-y-0 transition-transform duration-300">
          <h3 className="text-xs font-semibold text-white drop-shadow line-clamp-2 sm:text-sm md:text-base">
            {title}
          </h3>
        </div>
      </div>
    </article>
  );
}

export default FilmCard;
