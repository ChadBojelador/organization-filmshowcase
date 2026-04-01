import FilmGrid from "../components/FilmGrid";

const sampleFilms = [
  {
    _id: "1",
    title: "After the Rain",
    teamName: "Northlight Collective",
    members: [
      { name: "Ari Mendoza", role: "Director" },
      { name: "Theo Ramos", role: "Editor" },
    ],
    posterLink: "https://drive.google.com/file/d/1a2b3c4d5e6f7g8h9i0j/view?usp=sharing",
    videoLink: "https://drive.google.com/file/d/0j9i8h7g6f5e4d3c2b1a/view?usp=sharing",
  },
  {
    _id: "2",
    title: "City of Paper Birds",
    teamName: "Framebound Studios",
    members: [
      { name: "Lia Cruz", role: "Director" },
      { name: "Miko Ong", role: "Cinematographer" },
      { name: "Yana De Leon", role: "Production Designer" },
    ],
    posterLink: "https://drive.google.com/file/d/2a2b3c4d5e6f7g8h9i0j/view?usp=sharing",
    videoLink: "https://drive.google.com/file/d/3a2b3c4d5e6f7g8h9i0j/view?usp=sharing",
  },
  {
    _id: "3",
    title: "The Last Lantern",
    teamName: "Sunset Reel",
    members: [
      { name: "Noel Tan", role: "Director" },
      { name: "Ira Perez", role: "Sound Designer" },
    ],
    posterLink: "https://drive.google.com/file/d/4a2b3c4d5e6f7g8h9i0j/view?usp=sharing",
    videoLink: "https://drive.google.com/file/d/5a2b3c4d5e6f7g8h9i0j/view?usp=sharing",
  },
];

function PublicGallery() {
  return (
    <main className="min-h-screen bg-slate-100 py-6 sm:py-8">
      <header className="mx-auto mb-4 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Short Film Gallery
        </h1>
        <p className="mt-1 text-sm text-slate-600 sm:text-base">
          Public submissions from registered directors.
        </p>
      </header>

      <FilmGrid films={sampleFilms} />
    </main>
  );
}

export default PublicGallery;
