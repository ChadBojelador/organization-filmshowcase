// src/components/FilmLoadingScreen.jsx
import { useEffect, useRef, useState } from "react";
import "./FilmLoadingScreen.css";

const POSTER_URLS = [
  "/posters/1stYear_BSIT1201_SAKRIPISYO.png",
  "/posters/1stYear_BSIT1202_Sistema.jpg",
  "/posters/1stYear_BSIT-1203_TINNITUS.jpg",
  "/posters/1stYear_ IT-1204_SAGADA.png",
  "/posters/1stYear_BSIT-1205_LISTAHAN.jpg",
  "/posters/1STYear_ IT-1206_ PANGARAP.jpg",
  "/posters/1st Year_BSIT-1207_THE EQUATION OF US.png",
  "/posters/1st Year_BSIT-1208_TODOLIST.png",
  "/posters/1stYear_BSIT1209_Kargada.png",
  "/posters/1stYear_IT-1210-BlessinginBlood.png",
  "/posters/1stYear_IT-1211-BalotRutina.jpg",
  "/posters/1stYear_BSIT1212_BosesPapel.png",
  "/posters/1stYear_BSIT-1213_TUHOG.png",
  "/posters/1stYear_ IT-1214_TAYA.png",
  "/posters/1ST Year_BSIT-1215_Mirage.jpg",
];

// Duplicate for seamless loop
const STRIP_FRAMES = [...POSTER_URLS, ...POSTER_URLS];

const LOADING_MESSAGES = [
  "Cueing the reel…",
  "Loading films…",
  "Preparing the screening…",
  "Almost showtime…",
  "Lights, camera…",
];

function FilmStrip({ direction = "left", offsetY = 0, speed = "28s" }) {
  return (
    <div
      className="flg-strip-track"
      style={{ "--speed": speed, "--offset-y": `${offsetY}px` }}
      data-dir={direction}
    >
      <div className="flg-strip-inner">
        {STRIP_FRAMES.map((src, i) => (
          <div className="flg-frame" key={i}>
            {/* top perforations */}
            <div className="flg-perfs flg-perfs--top">
              {[...Array(4)].map((_, h) => (
                <span key={h} className="flg-hole" />
              ))}
            </div>

            <div className="flg-frame-img">
              <img src={src} alt="" draggable="false" loading="eager" />
            </div>

            {/* bottom perforations */}
            <div className="flg-perfs flg-perfs--bottom">
              {[...Array(4)].map((_, h) => (
                <span key={h} className="flg-hole" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FilmLoadingScreen({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);
  const [exiting, setExiting] = useState(false);
  const progressRef = useRef(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  // Smooth progress bar: fast at first, slows near 90, then jumps to 100 on onDone
  useEffect(() => {
    const DURATION = 2800; // ms to reach ~90%

    const tick = (now) => {
      if (!startRef.current) startRef.current = now;
      const elapsed = now - startRef.current;
      // Ease-out curve: fast start, slow finish
      const raw = Math.min(elapsed / DURATION, 1);
      const eased = 1 - Math.pow(1 - raw, 2.4);
      const next = Math.min(Math.round(eased * 90), 90);

      if (next !== progressRef.current) {
        progressRef.current = next;
        setProgress(next);
      }

      if (raw < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Cycle loading messages
  useEffect(() => {
    const id = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 700);
    return () => clearInterval(id);
  }, []);

  // When parent signals done: jump to 100% then exit
  useEffect(() => {
    if (!onDone) return;

    setProgress(100);
    progressRef.current = 100;

    const exitTimer = setTimeout(() => {
      setExiting(true);
    }, 400);

    return () => clearTimeout(exitTimer);
  }, [onDone]);

  return (
    <div className={`flg-root${exiting ? " flg-root--exit" : ""}`}>
      {/* Grain overlay */}
      <div className="flg-grain" aria-hidden="true" />

      {/* Spotlight cone */}
      <div className="flg-spotlight" aria-hidden="true" />

      {/* Three film strips */}
      <div className="flg-strips-container" aria-hidden="true">
        <FilmStrip direction="left" offsetY={-40} speed="32s" />
        <FilmStrip direction="right" offsetY={20} speed="24s" />
        <FilmStrip direction="left" offsetY={60} speed="38s" />
      </div>

      {/* Dark vignette */}
      <div className="flg-vignette" aria-hidden="true" />

      {/* Center HUD */}
      <div className="flg-hud">
        {/* Clapperboard icon */}
        <div className="flg-clapper" aria-hidden="true">
          <div className="flg-clapper-top" />
          <div className="flg-clapper-body">
            <div className="flg-clapper-stripe" />
            <div className="flg-clapper-stripe" />
            <div className="flg-clapper-stripe" />
          </div>
        </div>

        <div className="flg-brand">
          <img src="/logo.png" alt="FESTORAMA" className="flg-logo" />
          <span className="flg-brand-name">FESTORAMA</span>
        </div>

        <p className="flg-tagline">Lights · Camera · Advocate</p>

        {/* Progress bar */}
        <div className="flg-bar-wrap">
          <div className="flg-bar-fill" style={{ width: `${progress}%` }} />
        </div>

        <p className="flg-msg" key={msgIndex}>
          {LOADING_MESSAGES[msgIndex]}
        </p>

        <span className="flg-pct">{progress}%</span>
      </div>
    </div>
  );
}

export default FilmLoadingScreen;
