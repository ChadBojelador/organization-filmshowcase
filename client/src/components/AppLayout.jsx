// frontend/src/components/AppLayout.jsx
import {
  ChevronRightIcon,
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
} from "@heroicons/react/24/solid";

const quickLinks = [
  "Home",
  "Blog",
  "List Layout",
  "Contact",
];

const socialItems = ["Fb", "Tw", "In", "Ig", "Yt"];

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
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="Integrated Information Technology Student Society" className="h-11 w-auto object-contain" />
                <p className="text-xs uppercase tracking-[0.08em] text-zinc-400">
                  Integrated Information Technology Student Society
                </p>
              </div>

              <div className="flex items-center gap-3">
                {socialItems.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-600 text-[10px] font-semibold text-zinc-300 transition hover:border-zinc-400 hover:text-white"
                    aria-label={item}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <p className="text-sm text-zinc-400">© {new Date().getFullYear()}. All rights reserved.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white">Quick Links</h3>
              <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-base">
                {quickLinks.map((link) => (
                  <a key={link} href="#" className="inline-flex items-center gap-2 text-zinc-400 transition hover:text-white">
                    <ChevronRightIcon className="h-3.5 w-3.5" />
                    {link}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white">Contact Us</h3>
              <div className="mt-5 space-y-4 text-base text-zinc-400">
                <p className="flex items-start gap-3">
                  <MapPinIcon className="mt-0.5 h-5 w-5 flex-shrink-0" />
                  <span>Integrated Information Technology Student Society</span>
                </p>
                <p className="flex items-center gap-3">
                  <PhoneIcon className="h-5 w-5 flex-shrink-0" />
                  <span>+63 912 345 6789</span>
                </p>
                <p className="flex items-center gap-3">
                  <EnvelopeIcon className="h-5 w-5 flex-shrink-0" />
                  <span>iitss@example.com</span>
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white">Remain Updated</h3>
              <form
                className="mt-5 space-y-4"
                onSubmit={(event) => {
                  event.preventDefault();
                }}
              >
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full rounded-none border border-zinc-500 bg-zinc-100 px-4 py-3 text-zinc-900 placeholder:text-zinc-500 outline-none transition focus:border-orange-400"
                />
                <button
                  type="submit"
                  className="bg-orange-500 px-5 py-3 text-base font-semibold text-white transition hover:bg-orange-400"
                >
                  Sign up
                </button>
              </form>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AppLayout;
