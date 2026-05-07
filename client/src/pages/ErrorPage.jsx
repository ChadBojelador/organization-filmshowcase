// src/pages/ErrorPage.jsx
// Shown for any unmatched route (404) or critical render error.

import { useNavigate, useRouteError } from "react-router-dom";

function ErrorPage() {
  const navigate = useNavigate();
  const routeError = useRouteError();

  // Determine if it's a 404 vs a generic crash
  const is404 =
    !routeError ||
    routeError?.status === 404 ||
    routeError?.statusCode === 404;

  const headline = is404 ? "404" : "Oops";
  const title = is404 ? "Scene Not Found" : "Something Went Wrong";
  const subtitle = is404
    ? "The reel you're looking for doesn't exist — or it was cut from the edit."
    : "An unexpected error interrupted the screening. Try refreshing the page.";

  return (
    <div className="err-root">
      {/* Animated grain overlay */}
      <div className="err-grain" aria-hidden="true" />

      {/* Vertical film-strip decorations */}
      <div className="err-strip err-strip--left" aria-hidden="true">
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} className="err-hole" />
        ))}
      </div>
      <div className="err-strip err-strip--right" aria-hidden="true">
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} className="err-hole" />
        ))}
      </div>

      {/* Center content */}
      <main className="err-center">
        {/* Spotlight glow behind the number */}
        <div className="err-spotlight" aria-hidden="true" />

        <p className="err-eyebrow">FESTORAMA</p>

        <h1 className="err-headline">{headline}</h1>

        <div className="err-divider" aria-hidden="true">
          <span />
          <span className="err-clapper" aria-hidden="true">
            {/* mini SVG clapperboard */}
            <svg viewBox="0 0 40 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0" y="10" width="40" height="22" rx="3" fill="#27272a" />
              <rect x="0" y="10" width="40" height="8" rx="2" fill="#3f3f46" />
              {/* diagonal stripes on the top board */}
              {[0, 8, 16, 24, 32].map((x) => (
                <line key={x} x1={x} y1="10" x2={x + 8} y2="18" stroke="#facc15" strokeWidth="2.5" />
              ))}
              {/* sprocket holes */}
              <circle cx="6" cy="25" r="2.5" fill="#52525b" />
              <circle cx="20" cy="25" r="2.5" fill="#52525b" />
              <circle cx="34" cy="25" r="2.5" fill="#52525b" />
            </svg>
          </span>
          <span />
        </div>

        <h2 className="err-title">{title}</h2>
        <p className="err-subtitle">{subtitle}</p>

        <div className="err-actions">
          <button
            id="err-back-btn"
            type="button"
            onClick={() => navigate(-1)}
            className="err-btn err-btn--ghost"
          >
            ← Go Back
          </button>
          <button
            id="err-home-btn"
            type="button"
            onClick={() => navigate("/dashboard", { replace: true })}
            className="err-btn err-btn--primary"
          >
            Return to Dashboard
          </button>
        </div>
      </main>

      <style>{`
        /* ============================================================
           ErrorPage — cinematic 404 / crash screen
           ============================================================ */

        .err-root {
          position: relative;
          min-height: 100vh;
          background: #09090b;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          font-family: 'Inter', system-ui, sans-serif;
          color: #fff;
        }

        /* Grain texture */
        .err-grain {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.035;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          background-repeat: repeat;
          animation: err-grain-move 0.4s steps(1) infinite;
        }

        @keyframes err-grain-move {
          0%   { background-position: 0 0; }
          25%  { background-position: -30px 15px; }
          50%  { background-position: 20px -10px; }
          75%  { background-position: -15px 30px; }
          100% { background-position: 10px -20px; }
        }

        /* Film strip side bars */
        .err-strip {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 52px;
          background: #18181b;
          border: 1px solid #27272a;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-evenly;
          padding: 16px 0;
          z-index: 1;
        }

        .err-strip--left { left: 0; border-left: none; }
        .err-strip--right { right: 0; border-right: none; }

        @media (max-width: 600px) {
          .err-strip { width: 28px; }
          .err-hole { width: 14px !important; height: 10px !important; }
        }

        .err-hole {
          width: 22px;
          height: 16px;
          border-radius: 3px;
          background: #09090b;
          border: 1px solid #3f3f46;
          flex-shrink: 0;
        }

        /* Spotlight glow */
        .err-spotlight {
          position: absolute;
          top: -180px;
          left: 50%;
          transform: translateX(-50%);
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(ellipse at center, rgba(6,182,212,0.12) 0%, transparent 68%);
          pointer-events: none;
          animation: err-pulse 4s ease-in-out infinite;
        }

        @keyframes err-pulse {
          0%, 100% { opacity: 0.7; transform: translateX(-50%) scale(1); }
          50%       { opacity: 1;   transform: translateX(-50%) scale(1.08); }
        }

        /* Center block */
        .err-center {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 48px 24px;
          max-width: 560px;
          width: 100%;
        }

        .err-eyebrow {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: rgba(6,182,212,0.85);
          margin-bottom: 12px;
        }

        .err-headline {
          font-size: clamp(6rem, 20vw, 10rem);
          font-weight: 900;
          line-height: 1;
          letter-spacing: -0.04em;
          background: linear-gradient(135deg, #fff 30%, #a1a1aa 80%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 20px;
          text-shadow: none;
          animation: err-flicker 6s ease-in-out infinite;
        }

        @keyframes err-flicker {
          0%, 94%, 96%, 98%, 100% { opacity: 1; }
          95%, 97%                 { opacity: 0.82; }
        }

        /* Divider with clapperboard */
        .err-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          max-width: 320px;
          margin-bottom: 20px;
        }

        .err-divider span:first-child,
        .err-divider span:last-child {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, #3f3f46, transparent);
        }

        .err-clapper svg {
          width: 40px;
          height: auto;
          opacity: 0.7;
        }

        .err-title {
          font-size: clamp(1.3rem, 4vw, 1.75rem);
          font-weight: 700;
          color: #f4f4f5;
          margin: 0 0 10px;
          letter-spacing: -0.01em;
        }

        .err-subtitle {
          font-size: 0.95rem;
          color: #71717a;
          line-height: 1.65;
          margin: 0 0 36px;
          max-width: 400px;
        }

        /* Action buttons */
        .err-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: center;
        }

        .err-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 11px 24px;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          letter-spacing: 0.03em;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }

        .err-btn--ghost {
          background: rgba(255,255,255,0.05);
          color: #a1a1aa;
          border: 1px solid #3f3f46;
        }

        .err-btn--ghost:hover {
          background: rgba(255,255,255,0.1);
          color: #e4e4e7;
          border-color: #52525b;
        }

        .err-btn--primary {
          background: linear-gradient(135deg, #06b6d4, #0891b2);
          color: #fff;
          box-shadow: 0 4px 24px rgba(6,182,212,0.3);
        }

        .err-btn--primary:hover {
          background: linear-gradient(135deg, #22d3ee, #06b6d4);
          box-shadow: 0 6px 28px rgba(6,182,212,0.45);
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}

export default ErrorPage;
