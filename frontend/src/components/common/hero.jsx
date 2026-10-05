import {
  ArrowRight,
  MapPinned,
  ShieldCheck,
  Users,
  Sparkles,
} from "lucide-react";

function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden pt-32 lg:pt-40"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[8%] top-20 h-72 w-72 rounded-full bg-indigo-400/15 blur-3xl" />
        <div className="absolute right-[5%] top-40 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-16 px-5 pb-24 lg:grid-cols-2 lg:px-8 lg:pb-32">

        {/* Left */}
        <div>
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-700">
            <Sparkles size={14} />
            BUILDING BETTER COMMUNITIES
          </div>

          <h1 className="max-w-3xl text-5xl font-black leading-[1.05] tracking-tight text-white drop-shadow-sm sm:text-6xl lg:text-7xl">
            Your community.
            <span className="block text-indigo-600">
              Your voice.
            </span>
            <span className="block">
              Your solution.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">
            FixNest connects residents, local service providers, and
            community administrators to report, track, and resolve
            everyday neighborhood problems.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="/register"
              className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-indigo-600 px-6 py-4 font-bold text-white shadow-xl shadow-indigo-600/25 transition hover:-translate-y-1 hover:bg-indigo-700"
            >
              Report an Issue
              <ArrowRight
                size={19}
                className="transition-transform group-hover:translate-x-1"
              />
            </a>

            <a
              href="#explore"
              className="inline-flex items-center justify-center gap-3 rounded-2xl border border-slate-600 bg-slate-800/80 px-6 py-4 font-bold text-white shadow-lg transition hover:-translate-y-1 hover:border-indigo-400 hover:bg-slate-700"
            >
              <MapPinned size={19} />
              Explore Issues
            </a>
          </div>

          {/* Trust indicators */}
          <div className="mt-10 flex flex-wrap gap-6 border-t border-slate-700 pt-7">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <ShieldCheck size={18} className="text-emerald-500" />
              Verified reports
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Users size={18} className="text-indigo-500" />
              Community powered
            </div>
          </div>
        </div>

        {/* Right visual */}
        <div className="relative">
          <div className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-br from-indigo-500/10 to-cyan-400/10 blur-2xl" />

          <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-4 shadow-2xl shadow-slate-900/10 backdrop-blur">

            {/* Fake map */}
            <div className="relative h-[480px] overflow-hidden rounded-[1.5rem] bg-slate-100">

              {/* Map pattern */}
              <div className="absolute inset-0 opacity-40">
                <div className="absolute left-[10%] top-0 h-full w-20 rotate-[18deg] bg-white" />
                <div className="absolute left-[45%] top-[-10%] h-[120%] w-12 rotate-[65deg] bg-white" />
                <div className="absolute right-[10%] top-[-10%] h-[120%] w-24 rotate-[-35deg] bg-white" />

                <div className="absolute left-0 top-[30%] h-12 w-full rotate-[8deg] bg-white" />
                <div className="absolute left-0 top-[65%] h-16 w-full rotate-[-12deg] bg-white" />
              </div>

              {/* Map header */}
              <div className="absolute left-5 right-5 top-5 z-10 flex items-center justify-between rounded-2xl border border-white/70 bg-white/90 p-4 shadow-lg backdrop-blur">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Community map
                  </p>
                  <p className="mt-1 font-bold text-slate-900">
                    24 active reports
                  </p>
                </div>

                <div className="rounded-xl bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-600">
                  Live
                </div>
              </div>

              {/* Markers */}
              <div className="absolute left-[22%] top-[38%]">
                <div className="relative">
                  <div className="absolute -inset-2 animate-ping rounded-full bg-red-400/30" />
                  <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-red-500 text-white shadow-lg">
                    <MapPinned size={20} />
                  </div>
                </div>
              </div>

              <div className="absolute left-[62%] top-[28%]">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-500 text-white shadow-lg">
                  <MapPinned size={20} />
                </div>
              </div>

              <div className="absolute left-[72%] top-[65%]">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg">
                  <MapPinned size={20} />
                </div>
              </div>

              {/* Issue card */}
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/80 bg-white/95 p-5 shadow-xl backdrop-blur">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600">
                      Road issue
                    </span>

                    <h3 className="mt-3 text-lg font-extrabold text-slate-900">
                      Damaged road near Block A
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Reported by a community member
                    </p>
                  </div>

                  <div className="rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-600">
                    Verified
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-sm font-semibold text-slate-300">
                    18 upvotes
                  </span>

                  <button className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white">
                    View issue
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Floating stats */}
          <div className="absolute -bottom-6 -left-4 hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-xl sm:block">
            <p className="text-2xl font-black text-slate-900">
              92%
            </p>
            <p className="text-xs font-medium text-slate-500">
              issues resolved
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;