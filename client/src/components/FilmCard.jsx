// frontend/src/components/FilmCard.jsx
function FilmCard({ title, thumbnailUrl, description, onClick }) {
  return (
    <article
      className="group cursor-pointer overflow-hidden rounded-xl bg-zinc-900 shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-cyan-500/10"
      onClick={onClick}
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-800">
        <img
          src={thumbnailUrl}
          alt={`${title} poster`}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Hover overlay with play icon */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/50">
          <div className="scale-0 rounded-full bg-cyan-500/90 p-3 shadow-lg shadow-cyan-500/30 transition-transform duration-300 group-hover:scale-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              className="h-6 w-6"
            >
              <path
                fillRule="evenodd"
                d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {/* Title overlay at bottom */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 sm:p-4">
          <h3 className="text-xs font-semibold text-white drop-shadow sm:text-sm md:text-base line-clamp-2">
            {title}
          </h3>
        </div>
      </div>
    </article>
  );
}

export default FilmCard;
