// src/components/StartupLoaderGate.jsx
// Wraps the app and shows the cinematic film loading screen on first visit.
// It waits for a global "festorama:ready" event (dispatched by Dashboard when
// films are loaded) OR a fixed max timeout, then dismisses itself.

import { useEffect, useRef, useState } from "react";
import FilmLoadingScreen from "./FilmLoadingScreen";

const MAX_WAIT_MS = 5500;  // hard cap so it never hangs forever
const EXIT_ANIM_MS = 750;  // matches .flg-root--exit animation duration

function StartupLoaderGate({ children }) {
  const [ready, setReady] = useState(false);   // films loaded signal
  const [visible, setVisible] = useState(true); // loader on screen
  const timerRef = useRef(null);
  const exitRef = useRef(null);

  useEffect(() => {
    // Listen for Dashboard to announce it's done
    const handleReady = () => {
      clearTimeout(timerRef.current);
      setReady(true);
      // Unmount after the CSS exit animation finishes
      exitRef.current = setTimeout(() => setVisible(false), EXIT_ANIM_MS);
    };

    window.addEventListener("festorama:ready", handleReady);

    // Hard-cap fallback — dismiss after MAX_WAIT_MS regardless
    timerRef.current = setTimeout(handleReady, MAX_WAIT_MS);

    return () => {
      window.removeEventListener("festorama:ready", handleReady);
      clearTimeout(timerRef.current);
      clearTimeout(exitRef.current);
    };
  }, []);

  return (
    <>
      {/* Render the real app underneath immediately so data-fetching starts */}
      {children}

      {/* Overlay the loader on top */}
      {visible && <FilmLoadingScreen onDone={ready ? true : null} />}
    </>
  );
}

export default StartupLoaderGate;
