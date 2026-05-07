// frontend/src/pages/Dashboard.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { PlayIcon } from "@heroicons/react/24/solid";
import AppLayout from "../components/AppLayout";
import Carousel from "../components/Carousel";
import FilmCard from "../components/FilmCard";
import FilmDetailModal from "../components/FilmDetailModal";
import { FilmSkeletonGrid, FilmSkeletonCarousel } from "../components/FilmSkeleton";
import { apiRequest } from "../lib/apiClient";

const SECTION_KEYS = ["mostViewed", "allFilms"];

const HERO_TRAILER_SOURCE_URL = "/hero-trailer.mp4";
const HERO_TRAILER_THUMBNAIL_URL =
  "https://images.unsplash.com/photo-1489599834029-1001621125e7?auto=format&fit=crop&w=1600&q=80";

const fallbackFilms = [
  {
    id: "1201",
    title: "Sakripisyo",
    description: "A woman who quietly carrying more than she should. With her eyes closed and hands over her heart, she feels the weight of every sacrifice she\u2019s made.",
    thumbnailUrl: "/posters/1stYear_BSIT1201_SAKRIPISYO.png",
    views: 0,
    releaseDate: "2026-05-01",
    videoEmbedUrl: "https://drive.google.com/file/d/1BLTYP2s_R85kHK53l_GB62oZsEWvi7EX/preview",
    videoSourceUrl: "https://drive.google.com/file/d/1BLTYP2s_R85kHK53l_GB62oZsEWvi7EX/view",
    fileId: "1BLTYP2s_R85kHK53l_GB62oZsEWvi7EX",
  },
  {
    id: "1202",
    title: "Sistema",
    description: "The system was never broken. It was built this way. A journalist who uncovers the truth\u2014straight to the heart of her own family.",
    thumbnailUrl: "/posters/1stYear_BSIT1202_Sistema.jpg",
    views: 0,
    releaseDate: "2026-05-01",
    videoEmbedUrl: "https://drive.google.com/file/d/19QQa0FP795E8fos0wDS_vTHxhtkpWUlB/preview",
    videoSourceUrl: "https://drive.google.com/file/d/19QQa0FP795E8fos0wDS_vTHxhtkpWUlB/view",
    fileId: "19QQa0FP795E8fos0wDS_vTHxhtkpWUlB",
  },
  {
    id: "1203",
    title: "Tinnitus",
    description: "A young woman fractured into multiple versions of herself, symbolizing emotional pressure, identity conflict, and inner struggle.",
    thumbnailUrl: "/posters/1stYear_BSIT-1203_TINNITUS.jpg",
    views: 0,
    releaseDate: "2026-05-01",
    videoEmbedUrl: "https://drive.google.com/file/d/1nxKx06biHwTE2CF4FwesM3LqGcHkIlnp/preview",
    videoSourceUrl: "https://drive.google.com/file/d/1nxKx06biHwTE2CF4FwesM3LqGcHkIlnp/view",
    fileId: "1nxKx06biHwTE2CF4FwesM3LqGcHkIlnp",
  },
  {
    id: "1204",
    title: "Sagada",
    description: "A story about love that is always there. The kind of friendship that once felt permanent\u2014late laughs, shared dreams, and the belief that you\u2019d all make it together.",
    thumbnailUrl: "/posters/1stYear_ IT-1204_SAGADA.png",
    views: 0,
    releaseDate: "2026-05-01",
    videoEmbedUrl: "https://drive.google.com/file/d/1P3K1BK3oHBWlUPe-Pk5w7NYhkE_eCJYm/preview",
    videoSourceUrl: "https://drive.google.com/file/d/1P3K1BK3oHBWlUPe-Pk5w7NYhkE_eCJYm/view",
    fileId: "1P3K1BK3oHBWlUPe-Pk5w7NYhkE_eCJYm",
  },
  {
    id: "1205",
    title: "Listahan",
    description: "Sila ang nagsusulat. Sila rin ang nagpapasya. A haunting short film centered on a blood-stained clipboard\u2014a lethal ledger.",
    thumbnailUrl: "/posters/1stYear_BSIT-1205_LISTAHAN.jpg",
    views: 0,
    releaseDate: "2026-05-01",
    videoEmbedUrl: "https://drive.google.com/file/d/1mnU5dml8sJDNbCWiz1E0_bMlNQGTc3qM/preview",
    videoSourceUrl: "https://drive.google.com/file/d/1mnU5dml8sJDNbCWiz1E0_bMlNQGTc3qM/view",
    fileId: "1mnU5dml8sJDNbCWiz1E0_bMlNQGTc3qM",
  },
  {
    id: "1206",
    title: "Pangarap",
    description: "In a world where success is measured by lines of code and perfect percentages, a young man\u2019s aspirations become his greatest prison.",
    thumbnailUrl: "/posters/1STYear_ IT-1206_ PANGARAP.jpg",
    views: 0,
    releaseDate: "2026-05-01",
    videoEmbedUrl: "https://drive.google.com/file/d/1xk_ZdDTJoLT9KaYpXsG5ygVbe8pdPyhQ/preview",
    videoSourceUrl: "https://drive.google.com/file/d/1xk_ZdDTJoLT9KaYpXsG5ygVbe8pdPyhQ/view",
    fileId: "1xk_ZdDTJoLT9KaYpXsG5ygVbe8pdPyhQ",
  },
  {
    id: "1207",
    title: "The Equation of Us",
    description: "Inspired by the 100-peso bill, the poster uses \u20b1100 to represent the reality of living in poverty.",
    thumbnailUrl: "/posters/1st Year_BSIT-1207_THE EQUATION OF US.png",
    views: 0,
    releaseDate: "2026-05-01",
    videoEmbedUrl: "https://drive.google.com/drive/folders/11yDx57PQYAIMFjbKXvFXho3UOTGC0FFz",
    videoSourceUrl: "https://drive.google.com/drive/folders/11yDx57PQYAIMFjbKXvFXho3UOTGC0FFz",
    fileId: "11yDx57PQYAIMFjbKXvFXho3UOTGC0FFz",
  },
  {
    id: "1208",
    title: "To Do List",
    description: "Some memories heal you. Some memories keep you trapped. To-Do List: In Every Lifetime follows Noah, a man trapped in the shadows of grief.",
    thumbnailUrl: "/posters/1st Year_BSIT-1208_TODOLIST.png",
    views: 0,
    releaseDate: "2026-05-01",
    videoEmbedUrl: "https://drive.google.com/file/d/1dvwH1N6TrUPVv0eFlXopdb8xi74nuxfg/preview",
    videoSourceUrl: "https://drive.google.com/file/d/1dvwH1N6TrUPVv0eFlXopdb8xi74nuxfg/view",
    fileId: "1dvwH1N6TrUPVv0eFlXopdb8xi74nuxfg",
  },
  {
    id: "1209",
    title: "Kargada",
    description: "How would you rebuild a life full of false hopes? Jayson, the eldest of the family, was forced to stop studying and be the breadwinner.",
    thumbnailUrl: "/posters/1stYear_BSIT1209_Kargada.png",
    views: 0,
    releaseDate: "2026-05-01",
    videoEmbedUrl: "https://drive.google.com/drive/folders/1xun8LXMXorTuoy3ZAAv7Iv2oSqx9GVu9",
    videoSourceUrl: "https://drive.google.com/drive/folders/1xun8LXMXorTuoy3ZAAv7Iv2oSqx9GVu9",
    fileId: "1xun8LXMXorTuoy3ZAAv7Iv2oSqx9GVu9",
  },
  {
    id: "1210",
    title: "Blessing in Blood",
    description: "A dark and emotional atmosphere that reflects the film\u2019s serious message about family struggles, poverty, and emotional suffering.",
    thumbnailUrl: "/posters/1stYear_IT-1210-BlessinginBlood.png",
    views: 0,
    releaseDate: "2026-05-01",
    videoEmbedUrl: "https://drive.google.com/drive/folders/114a_eHaUmgCMlfn8gyiXSfHjHxx2bcdW",
    videoSourceUrl: "https://drive.google.com/drive/folders/114a_eHaUmgCMlfn8gyiXSfHjHxx2bcdW",
    fileId: "114a_eHaUmgCMlfn8gyiXSfHjHxx2bcdW",
  },
  {
    id: "1211",
    title: "Balot Rutina",
    description: "The struggles of ordinary Filipinos living under corruption, poverty, and social injustice. \u201cAng bawat suhol ay isang patalim sa likod ng bayan.\u201d",
    thumbnailUrl: "/posters/1stYear_IT-1211-BalotRutina.jpg",
    views: 0,
    releaseDate: "2026-05-01",
    videoEmbedUrl: "https://drive.google.com/file/d/1KmJpuuC1XYOLSksPFEukUAfVLkZ19nSK/preview",
    videoSourceUrl: "https://drive.google.com/file/d/1KmJpuuC1XYOLSksPFEukUAfVLkZ19nSK/view",
    fileId: "1KmJpuuC1XYOLSksPFEukUAfVLkZ19nSK",
  },
  {
    id: "1212",
    title: "Boses Papel",
    description: "Laban na para sa Lahat. A woman raises her voice\u2014through ink, through paper\u2014against a system that refuses to listen.",
    thumbnailUrl: "/posters/1stYear_BSIT1212_BosesPapel.png",
    views: 0,
    releaseDate: "2026-05-01",
    videoEmbedUrl: "https://drive.google.com/drive/folders/17iQ9LMTFveNSm1UpsgTE4CXCMtHy3CmY",
    videoSourceUrl: "https://drive.google.com/drive/folders/17iQ9LMTFveNSm1UpsgTE4CXCMtHy3CmY",
    fileId: "17iQ9LMTFveNSm1UpsgTE4CXCMtHy3CmY",
  },
  {
    id: "1213",
    title: "Tuhog",
    description: "Ang salitang \u201cTuhog\u201d ay nagsisilbing isang masalimoot na lunduyan ng dalawang magkatunggaling mundo sa buhay ni Dante.",
    thumbnailUrl: "/posters/1stYear_BSIT-1213_TUHOG.png",
    views: 0,
    releaseDate: "2026-05-01",
    videoEmbedUrl: "https://drive.google.com/file/d/1oxCihXUG82KvaO260ebU404cJ9VJmRwb/preview",
    videoSourceUrl: "https://drive.google.com/file/d/1oxCihXUG82KvaO260ebU404cJ9VJmRwb/view",
    fileId: "1oxCihXUG82KvaO260ebU404cJ9VJmRwb",
  },
  {
    id: "1214",
    title: "Taya",
    description: "Taya is a story about the weight of a single decision. When you keep betting on a better tomorrow \u2014 what are you really losing today?",
    thumbnailUrl: "/posters/1stYear_ IT-1214_TAYA.png",
    views: 0,
    releaseDate: "2026-05-01",
    videoEmbedUrl: "https://drive.google.com/file/d/1yH1kb0oiXcKOqFTLFY5VdYiCy4jXoAkz/preview",
    videoSourceUrl: "https://drive.google.com/file/d/1yH1kb0oiXcKOqFTLFY5VdYiCy4jXoAkz/view",
    fileId: "1yH1kb0oiXcKOqFTLFY5VdYiCy4jXoAkz",
  },
  {
    id: "1215",
    title: "Mirage",
    description: "One Face, A Thousand Life. A powerful visual of a young woman whose head is distorted into a blurred, multi-faced streak, representing her fractured identity.",
    thumbnailUrl: "/posters/1ST Year_BSIT-1215_Mirage.jpg",
    views: 0,
    releaseDate: "2026-05-01",
    videoEmbedUrl: "https://drive.google.com/file/d/13d_yuMnNIDwn7oBSElhWRaSmaj08KAKa/preview",
    videoSourceUrl: "https://drive.google.com/file/d/13d_yuMnNIDwn7oBSElhWRaSmaj08KAKa/view",
    fileId: "13d_yuMnNIDwn7oBSElhWRaSmaj08KAKa",
  },
];

const sectionMeta = [
  { key: "mostViewed", title: "Most Viewed Films" },
  { key: "allFilms", title: "All Films" },
];

const emptySections = {
  mostViewed: [],
  allFilms: [],
};

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function buildSectionsFromArray(films) {
  const sortedByViews = [...films].sort((a, b) => (b.views || 0) - (a.views || 0));

  return {
    mostViewed: sortedByViews.slice(0, 10),
    allFilms: films,
  };
}

function normalizeSectionPayload(payload) {
  if (!payload) return emptySections;

  if (Array.isArray(payload)) {
    return buildSectionsFromArray(payload);
  }

  const hasSectionKeys = SECTION_KEYS.some((key) => Array.isArray(payload[key]));
  if (hasSectionKeys) {
    return {
      mostViewed: safeArray(payload.mostViewed),
      allFilms: safeArray(payload.allFilms),
    };
  }

  if (Array.isArray(payload.films)) {
    return buildSectionsFromArray(payload.films);
  }

  return emptySections;
}

function Dashboard() {
  const [sections, setSections] = useState(emptySections);
  const [isLoading, setIsLoading] = useState(true);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [selectedFilm, setSelectedFilm] = useState(null);
  const heroVideoRef = useRef(null);

  useEffect(() => {
    const tryPlay = () => {
      const video = heroVideoRef.current;
      if (!video) return;

      video.muted = isMuted;
      video.defaultMuted = isMuted;
      video.volume = isMuted ? 0 : 1;
      video.playsInline = true;

      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {});
      }
    };

    tryPlay();
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        tryPlay();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [isMuted]);

  useEffect(() => {
    let isActive = true;

    const fetchFilms = async () => {
      setIsLoading(true);

      try {
        const payload = await apiRequest("/api/films");
        if (!isActive) return;

        setSections(normalizeSectionPayload(payload));
      } catch (err) {
        if (!isActive) return;

        console.warn("Films API unavailable, using local fallback data.", err);
        setSections(buildSectionsFromArray(fallbackFilms));
      } finally {
        if (isActive) {
          setIsLoading(false);
          // Signal the loading screen that films are ready
          window.dispatchEvent(new Event("festorama:ready"));
        }
      }
    };

    fetchFilms();

    return () => {
      isActive = false;
    };
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedFilm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedFilm]);

  const sectionItems = useMemo(
    () =>
      sectionMeta.map((section) => ({
        ...section,
        films: safeArray(sections[section.key]),
      })),
    [sections]
  );

  return (
    <AppLayout>
      <div className="space-y-8">
        <section className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-hidden">
          <div className="relative h-[55vh] w-full sm:h-[72vh] lg:h-[88vh]">
            <video
              ref={heroVideoRef}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              preload="metadata"
              disablePictureInPicture
              controlsList="nodownload noplaybackrate noremoteplayback"
              onLoadedData={(event) => {
                event.currentTarget.play().catch(() => {});
              }}
              onEnded={(event) => {
                event.currentTarget.currentTime = 0;
                event.currentTarget.play().catch(() => {});
              }}
              className="absolute inset-0 h-full w-full object-cover"
              poster={HERO_TRAILER_THUMBNAIL_URL}
            >
              <source src={HERO_TRAILER_SOURCE_URL} type="video/mp4" />
            </video>

            <div
              className={`pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-black/70 p-6 transition duration-200 sm:p-10 ${
                isAboutOpen ? "opacity-100 backdrop-blur-sm" : "opacity-0 backdrop-blur-0"
              }`}
              aria-hidden={!isAboutOpen}
            >
              <div className="max-w-3xl text-center text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/85 sm:text-sm">
                  ABOUT FESTORAMA
                </p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                  LIGHTS, CAMERA, ADVOCATE!
                </h2>
                <p className="mx-auto mt-4 text-sm leading-relaxed text-white/90 sm:text-base">
                  FESTORAMA is a creator-first film and advocacy platform where stories, code, and community converge.
                  Explore cinematic showcases, build meaningful projects, and champion ideas that make an impact.
                </p>
              </div>
            </div>

            <div className="relative z-10 grid h-full grid-cols-1">
              <div className="flex flex-col justify-end p-4 sm:p-8 lg:p-10">
                <div className="w-full max-w-3xl rounded-2xl bg-gradient-to-r from-black/65 via-black/35 to-transparent p-3 text-white backdrop-blur-[1px] sm:p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200 drop-shadow sm:text-sm">
                    FESTORAMA
                  </p>
                  <h1 className="mt-2 text-2xl font-semibold uppercase tracking-tight text-white drop-shadow sm:mt-3 sm:text-5xl lg:text-6xl">
                    LIGHTS, CAMERA, ADVOCATE!
                  </h1>
                  <p className="mt-2 hidden max-w-2xl text-sm text-slate-100 drop-shadow sm:mt-4 sm:block sm:text-base">
                    A brand-new stage for creators to launch stories, build with code, and advocate for communities.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 sm:mt-6 sm:gap-3">
                  <a
                    href={HERO_TRAILER_SOURCE_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-md border border-cyan-300/40 bg-cyan-400/20 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100 transition hover:bg-cyan-300/30 sm:px-5 sm:py-2.5 sm:text-sm"
                  >
                    <PlayIcon className="h-5 w-5" />
                    Watch the trailer
                  </a>
                  <button
                    type="button"
                    onClick={() => setIsMuted((prev) => !prev)}
                    className="rounded-md border border-white/40 bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-white/20 sm:px-5 sm:py-2.5 sm:text-sm"
                  >
                    {isMuted ? "Unmute" : "Mute"}
                  </button>
                  <div className="relative">
                    <button
                      type="button"
                      onMouseEnter={() => setIsAboutOpen(true)}
                      onMouseLeave={() => setIsAboutOpen(false)}
                      onFocus={() => setIsAboutOpen(true)}
                      onBlur={() => setIsAboutOpen(false)}
                      className="rounded-md border border-white/40 bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-white/20 sm:px-5 sm:py-2.5 sm:text-sm"
                    >
                      About FESTORAMA
                    </button>
                  </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {sectionItems.map((section) => {
          const isMostViewed = section.key === "mostViewed";
          const isAllFilms = section.key === "allFilms";

          return (
            <section
              key={section.key}
              className={isMostViewed ? "relative left-1/2 right-1/2 w-screen -translate-x-1/2 space-y-3" : "space-y-3"}
            >
              <div className={isMostViewed ? "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8" : ""}>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 sm:text-xl">
                  {section.title}
                </h2>
              </div>
              {isAllFilms ? (
                isLoading ? (
                  <FilmSkeletonGrid count={10} />
                ) : section.films.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {section.films.map((film) => (
                      <FilmCard
                        key={`${film.id ?? film.title}-${film.thumbnailUrl}`}
                        title={film.title}
                        thumbnailUrl={film.thumbnailUrl}
                        description={film.description}
                        onClick={() => setSelectedFilm(film)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 text-sm text-zinc-400">
                    No films available yet.
                  </div>
                )
              ) : (
                <Carousel
                  films={section.films}
                  isLoading={isLoading}
                  fullWidth={isMostViewed}
                  onFilmClick={(film) => setSelectedFilm(film)}
                />
              )}
            </section>
          );
        })}
      </div>

      {/* Film Detail Modal */}
      {selectedFilm && (
        <FilmDetailModal
          film={selectedFilm}
          onClose={() => setSelectedFilm(null)}
        />
      )}
    </AppLayout>
  );
}

export default Dashboard;