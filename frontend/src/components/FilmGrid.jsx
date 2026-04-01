import FilmCard from "./FilmCard";

function FilmGrid({ films = [] }) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {films.map((film) => (
          <FilmCard key={film._id || `${film.filmTitle || film.title}-${film.teamName}`} film={film} />
        ))}
      </div>
    </section>
  );
}

export default FilmGrid;
