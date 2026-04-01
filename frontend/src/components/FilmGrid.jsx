import FilmCard from "./FilmCard";
import "./FilmGrid.css";

function FilmGrid({ films = [] }) {
  return (
    <section className="film-grid-section">
      <div className="container">
        <div className="film-grid grid grid-3">
          {films.map((film) => (
            <FilmCard key={film._id || `${film.filmTitle || film.title}-${film.teamName}`} film={film} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FilmGrid;
