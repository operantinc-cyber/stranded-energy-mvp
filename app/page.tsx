const visionPoints = [
  "AI-native energy infrastructure developer.",
  "Focused on stranded and underused energy assets.",
  "Built around autonomous agents and structured development workflows.",
];

const wedgePoints = [
  "Stranded gas and flare gas.",
  "Marginal field redevelopment.",
  "Modular power infrastructure.",
  "Practical opportunities that can be screened and advanced quickly.",
];

const proofPointItems = [
  "Concierge development screen.",
  "Structured intake, screening, risk, and memo workflow.",
  "First proof point for the larger company vision.",
];

export default function PublicHome() {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-950">
      <header className="border-b border-stone-200 bg-stone-50">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-5 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-800">
            AI-native energy infrastructure developer
          </p>
          <nav className="flex flex-wrap gap-5 text-sm font-medium text-stone-700">
            <a className="hover:text-emerald-800" href="#vision">
              Vision
            </a>
            <a className="hover:text-emerald-800" href="#starting-point">
              Starting Point
            </a>
            <a className="hover:text-emerald-800" href="#proof-point">
              Proof Point
            </a>
            <a className="hover:text-emerald-800" href="#contact">
              Contact
            </a>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:py-24 lg:px-8">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800">
            Public website
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Building an AI-native energy developer for stranded assets.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-stone-700">
            We identify, screen, and structure stranded gas, flare gas,
            marginal field, and modular power opportunities, starting with a
            concierge development screen and evolving toward autonomous project
            origination.
          </p>
          <p className="mt-6 max-w-3xl text-base leading-7 text-stone-600">
            The current development screen is the first proof point, not the
            final product.
          </p>
        </div>
      </section>

      <section className="border-y border-stone-200 bg-white" id="vision">
        <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
          <h2 className="text-3xl font-semibold tracking-tight">
            Company vision
          </h2>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {visionPoints.map((point) => (
              <article
                className="rounded-2xl border border-stone-200 bg-stone-50 p-5"
                key={point}
              >
                <p className="text-sm leading-6 text-stone-700">{point}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 lg:px-8" id="starting-point">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">
              Starting wedge
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-stone-700">
              The first wedge is stranded gas, flare gas, marginal field
              redevelopment, and modular power infrastructure. These are the
              opportunities that need structured development work before they
              can be advanced with confidence.
            </p>
            <ul className="mt-8 grid gap-3 text-stone-700 sm:grid-cols-2">
              {wedgePoints.map((point) => (
                <li className="border-l-2 border-emerald-800 pl-4" key={point}>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <aside className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800">
              What this is
            </p>
            <h3 className="mt-3 text-xl font-semibold">
              An agentic development engine
            </h3>
            <p className="mt-3 text-sm leading-6 text-stone-700">
              Autonomous agents and structured workflows help originate,
              screen, structure, and advance overlooked energy opportunities.
              The long-term business is a development company, not a generic
              software product.
            </p>
          </aside>
        </div>
      </section>

      <section className="border-y border-stone-200 bg-white" id="proof-point">
        <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <aside className="rounded-2xl border border-stone-200 bg-stone-50 p-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800">
                Current MVP
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Concierge development screen
              </h2>
              <p className="mt-4 text-base leading-7 text-stone-700">
                The current MVP is the first proof point. It is an internal
                development desk used to review an opportunity, screen the
                resource, size a concept, assess risk, compare monetization
                pathways, and package the next development actions.
              </p>
            </aside>

            <div className="grid gap-5 sm:grid-cols-2">
              {proofPointItems.map((item) => (
                <article
                  className="rounded-2xl border border-stone-200 bg-white p-5"
                  key={item}
                >
                  <p className="text-sm leading-6 text-stone-700">{item}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 lg:px-8" id="contact">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-semibold tracking-tight">Contact</h2>
          <p className="mt-4 text-base leading-7 text-stone-700">
            If you are an operator, investor, offtaker, EPC partner, vendor, or
            advisor working on stranded or underused energy assets, start with a
            short conversation.
          </p>
          <div className="mt-7">
            <a
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-emerald-800 px-5 text-sm font-semibold text-white transition hover:bg-emerald-900"
              href="mailto:operantic@gmail.com?subject=Stranded%20Energy%20Development%20Screen"
            >
              Email for a discovery call
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-8 lg:px-8">
          <p className="text-sm leading-6 text-stone-600">
            The public website describes the company vision. The internal
            development desk is a preliminary commercial and technical
            screening workflow, not final engineering design, legal advice,
            investment advice, reserve certification, environmental opinion,
            interconnection study, or bankable feasibility study.
          </p>
        </div>
      </footer>
    </main>
  );
}
