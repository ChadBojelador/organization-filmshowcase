import { useEffect, useState } from "react";
import FilmGrid from "../components/FilmGrid";
import { apiFetch } from "../utils/api";

function PublicGallery() {
  const [films, setFilms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadFilms = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await apiFetch("/films");

        if (!response.ok) {
          throw new Error("Failed to load films.");
        }

        const data = await response.json();
        setFilms(Array.isArray(data) ? data : []);
      } catch (loadError) {
        setError(loadError.message || "Failed to load films.");
      } finally {
        setIsLoading(false);
      }
    };

    loadFilms();
  }, []);

  return (
    <main className="gallery-main">
      <header className="gallery-header">
        <div className="container">
          <h1>Short Film Gallery</h1>
          <p className="text-secondary">Public submissions from registered directors.</p>
        </div>
      </header>

      {isLoading ? (
        <section className="film-grid-section">
          <div className="container text-secondary">Loading approved films...</div>
        </section>
      ) : null}

      {error ? (
        <section className="film-grid-section">
          <div className="container text-secondary">{error}</div>
        </section>
      ) : null}

      {!isLoading && !error ? <FilmGrid films={films} /> : null}
    </main>
  );
}

export default PublicGallery;
