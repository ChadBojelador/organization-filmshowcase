import { toGoogleDrivePosterUrl, toGoogleDriveVideoEmbedUrl } from "../utils/gdrive";
import "./FilmCard.css";

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
    <article className="film-card card">
      <div className="film-card-poster">
        <img
          src={posterUrl}
          alt={`${displayTitle} poster`}
          loading="lazy"
        />
      </div>

      <div className="film-card-content">
        <h2 className="film-card-title">{displayTitle}</h2>
        <p className="film-card-team">
          Team: <span>{teamName}</span>
        </p>

        <ul className="film-card-members">
          {members.map((member, index) => (
            <li key={`${member.name}-${index}`}>
              <span className="member-name">{member.name}</span>
              <span className="member-role">— {member.role}</span>
            </li>
          ))}
        </ul>

        <div className="film-card-video">
          <iframe
            src={videoUrl}
            title={`${displayTitle} video`}
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        </div>
      </div>
    </article>
  );
}

export default FilmCard;
