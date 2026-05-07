// src/components/StartupLoaderGate.jsx
// Wraps the app and shows the cinematic film loading screen on first visit.
// It waits for a global "festorama:ready" event (dispatched by Dashboard when
// films are loaded) OR a fixed max timeout, then dismisses itself.

import { useEffect, useRef, useState } from "react";
import FilmLoadingScreen from "./FilmLoadingScreen";

const MAX_WAIT_MS = 5500; // hard cap so it never hangs forever

function StartupLoaderGate({ children }) {
  const [ready, setReady] = useState(false);   // films loaded signal
  const [visible, setVisible] = useState(true); // loader on screen
  const timerRef = useRef(null);

  useEffect(() => {
    // Listen for Dashboard to announce it's done
    const handleReady = () => {
      clearTimeout(timerRef.current);
      setReady(true);
    };

    window.addEventListener("festorama:ready", handleReady);

    // Hard-cap fallback — dismiss after MAX_WAIT_MS regardless
    timerRef.current = setTimeout(handleReady, MAX_WAIT_MS);

    return () => {
      window.removeEventListener("festorama:ready", handleReady);
      clearTimeout(timerRef.current);
    };
  }, []);

  // Once the exit animation finishes (~700ms after ready), unmount the loader
  const handleExitEnd = () => {
    if (ready) setVisible(false);
  };

  return (
    <>
      {/* Render the real app underneath immediately so data-fetching starts */}
      {children}

      {/* Overlay the loader on top */}
      {visible && (
        <div onAnimationEnd={handleExitEnd}>
          <FilmLoadingScreen onDone={ready ? true : null} />
        </div>
      )}
    </>
  );
}

export default StartupLoaderGate;
