// frontend/src/components/AppLayout.jsx
import { EnvelopeIcon } from "@heroicons/react/24/solid";

function AppLayout({ children }) {
  return (
    <div className="relative min-h-screen overflow-hidden text-zinc-100">
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
        <div className="flex w-full items-center justify-between gap-4 py-4 pl-3 pr-4 sm:pl-4 sm:pr-6 lg:pr-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <a
              href="#"
              className="inline-flex items-center"
              aria-label="FESTORAMA home"
            >
              <img src="/logo.png" alt="FESTORAMA" className="h-9 w-auto object-contain" />
            </a>
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-zinc-200 sm:text-sm">
              Integrated Information Technology Student Society
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 pb-8 pt-0 sm:px-6 lg:px-8">
        {children}
      </main>

      <footer className="relative mt-12 bg-[#2f3034] text-zinc-300">
        <div className="pointer-events-none absolute -top-14 left-0 h-20 w-full -skew-y-2 origin-top-left bg-[#2f3034]" />

        <div className="relative mx-auto w-full max-w-7xl px-4 pb-8 pt-16 sm:px-6 lg:px-8 lg:pt-20">
          <div className="flex flex-col items-start justify-between gap-10 sm:flex-row sm:items-center">
            {/* Branding */}
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Integrated Information Technology Student Society" className="h-11 w-auto object-contain" />
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.08em] text-zinc-400">
                  Integrated Information Technology Student Society
                </p>
                <p className="text-sm text-zinc-500">© {new Date().getFullYear()}. All rights reserved.</p>
              </div>
            </div>

            {/* Contact Us — email only */}
            <div>
              <h3 className="text-xl font-semibold text-white">Contact Us</h3>
              <a
                href="mailto:iintessalangilan@g.batstate-u.edu.ph"
                className="mt-3 flex items-center gap-3 text-sm text-zinc-400 transition hover:text-white"
              >
                <EnvelopeIcon className="h-5 w-5 flex-shrink-0" />
                <span>iintessalangilan@g.batstate-u.edu.ph</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AppLayout;
