import { toGoogleDrivePosterUrl, toGoogleDriveVideoEmbedUrl } from "../utils/gdrive";

function FilmCard({ film }) {
  const {
    filmTitle,
    title,
    teamName,
    members = [],
    posterLink,
    videoLink,
  } = film;
  const displayTitle = filmTitle || title || "Untitled Film";

  const posterUrl = toGoogleDrivePosterUrl(posterLink);
  const videoUrl = toGoogleDriveVideoEmbedUrl(videoLink);

  return (
    <article className="overflow-hidden rounded-xl bg-white shadow-md">
      <img
        src={posterUrl}
        alt={`${displayTitle} poster`}
        className="h-52 w-full rounded-t-xl object-cover sm:h-56"
        loading="lazy"
      />

      <div className="space-y-2 p-4">
        <h2 className="line-clamp-2 text-lg font-semibold text-slate-900">{displayTitle}</h2>
        <p className="text-sm text-slate-600">
          Team: <span className="font-medium text-slate-800">{teamName}</span>
        </p>

        <ul className="space-y-1 text-sm text-slate-700">
          {members.map((member, index) => (
            <li key={`${member.name}-${index}`} className="flex flex-wrap gap-1">
              <span className="font-medium">{member.name}</span>
              <span className="text-slate-500">— {member.role}</span>
            </li>
          ))}
        </ul>

        <div className="overflow-hidden rounded-lg bg-black">
          <iframe
            src={videoUrl}
            title={`${displayTitle} video`}
            className="h-48 w-full sm:h-56"
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        </div>
      </div>
    </article>
  );
}

export default FilmCard;
