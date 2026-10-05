import Navbar from "../components/layout/Navbar";
import Hero from "../components/common/Hero";

function Home() {
  return (
    <div className="min-h-screen bg-transparent">
      <Navbar />

      <main>
        <Hero />

        <section
          id="explore"
          className="mx-auto max-w-7xl px-5 py-24 lg:px-8"
        >
          <div className="grid gap-6 md:grid-cols-3">

            <div className="rounded-3xl border border-slate-700/60 bg-slate-900/70 p-7 shadow-xl backdrop-blur">
              <div className="mb-5 text-3xl">📍</div>
              <h3 className="text-xl font-extrabold text-white">
                Report locally
              </h3>
              <p className="mt-3 leading-7 text-slate-300">
                Report potholes, water leaks, garbage issues,
                streetlight problems, and other community concerns.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-700/60 bg-slate-900/70 p-7 shadow-xl backdrop-blur">
              <div className="mb-5 text-3xl">🤝</div>
              <h3 className="text-xl font-extrabold text-white">
                Work together
              </h3>
              <p className="mt-3 leading-7 text-slate-300">
                Let community members upvote important issues
                and help bring attention to problems.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-700/60 bg-slate-900/70 p-7 shadow-xl backdrop-blur">
              <div className="mb-5 text-3xl">✅</div>
              <h3 className="text-xl font-extrabold text-white">
                Track progress
              </h3>
              <p className="mt-3 leading-7 text-slate-300">
                Follow every report from verification to
                assignment, progress, and resolution.
              </p>
            </div>

          </div>
        </section>

        <section
          id="how-it-works"
          className="bg-slate-900 px-5 py-24 text-white"
        >
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-400">
                How FixNest works
              </p>

              <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
                From problem to solution.
              </h2>

              <p className="mt-5 leading-8 text-slate-400">
                A simple workflow designed to make community
                problem solving transparent and trackable.
              </p>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-4">
              {[
                ["01", "Report", "Submit an issue with its location and details."],
                ["02", "Verify", "Community administrators review the report."],
                ["03", "Resolve", "A suitable service provider handles the issue."],
                ["04", "Track", "Residents can follow the entire process."],
              ].map(([number, title, description]) => (
                <div
                  key={number}
                  className="rounded-3xl border border-white/10 bg-white/5 p-7"
                >
                  <span className="text-sm font-black text-indigo-400">
                    {number}
                  </span>

                  <h3 className="mt-6 text-xl font-extrabold">
                    {title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-400">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="about"
          className="mx-auto max-w-7xl px-5 py-24 lg:px-8"
        >
          <div className="rounded-[2rem] bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 text-white shadow-2xl sm:p-12">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-200">
              FixNest
            </p>

            <h2 className="mt-4 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
              Technology that turns community reports into visible action.
            </h2>

            <p className="mt-5 max-w-2xl leading-8 text-indigo-100">
              Residents report. Communities collaborate. Providers
              solve. Administrators coordinate.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
