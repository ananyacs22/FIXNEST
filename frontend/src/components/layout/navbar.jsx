import { useState } from "react";
import {
  Menu,
  X,
  MapPin,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false);

  const navItems = [
    { label: "Home", href: "#home" },
    { label: "Explore", href: "#explore" },
    { label: "How it works", href: "#how-it-works" },
    { label: "About", href: "#about" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#071426]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">

        {/* Logo */}
        <a
          href="#home"
          className="flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/25">
            <MapPin size={23} strokeWidth={2.5} />
          </div>

          <div>
            <div className="text-xl font-extrabold tracking-tight text-white">
              Fix<span className="text-indigo-600">Nest</span>
            </div>

            <div className="hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 sm:block">
              Better communities
            </div>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-slate-300 transition hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <a
            href="/login"
            className="px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:text-white"
          >
            Sign in
          </a>

          <a
            href="/register"
            className="group flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-indigo-600"
          >
            Get Started
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </a>
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          className="rounded-xl border border-slate-200 p-2.5 text-slate-700 lg:hidden"
          aria-label="Toggle navigation"
        >
          {mobileMenu ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="border-t border-slate-200 bg-white px-5 py-5 lg:hidden">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenu(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
              >
                {item.label}
              </a>
            ))}

            <div className="mt-3 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
              <a
                href="/login"
                className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700"
              >
                Sign in
              </a>

              <a
                href="/register"
                className="rounded-xl bg-indigo-600 px-4 py-3 text-center text-sm font-semibold text-white"
              >
                Get Started
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;