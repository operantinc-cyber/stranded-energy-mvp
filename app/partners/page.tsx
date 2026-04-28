import Link from "next/link";

const partnerCards = [
  {
    title: "Investors",
    audience: "Infrastructure investors, family offices, and project finance lenders.",
    use: "Explain the platform thesis, business model, milestones, and why early screening can become valuable.",
  },
  {
    title: "Operators",
    audience: "Independent operators, gas producers, and marginal field owners.",
    use: "Frame stranded gas, flare gas, shut-in gas, marginal assets, and modular redevelopment opportunities.",
  },
  {
    title: "EPC/Vendors",
    audience: "EPC firms, modular infrastructure providers, and equipment vendors.",
    use: "Recruit partners for budgetary quotes, constructability input, modular configurations, and repeatable templates.",
  },
  {
    title: "Offtakers",
    audience: "Data center developers, industrial users, industrial parks, and large loads.",
    use: "Position dedicated power, behind-the-meter power, reliability, and early-stage site screening.",
  },
  {
    title: "Advisors",
    audience: "Power, finance, legal, permitting, EPC, gas processing, and data center power experts.",
    use: "Build an advisor bench for practical review of methodology, assumptions, and real opportunities.",
  },
];

const resourceLinks = [
  "docs/thesis-deck-outline.md",
  "docs/investor-one-pager.md",
  "docs/operator-partner-one-pager.md",
  "docs/epc-vendor-partner-one-pager.md",
  "docs/offtaker-partner-one-pager.md",
  "docs/advisor-recruitment-note.md",
];

export default function PartnersPage() {
  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-8 text-zinc-950 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-6">
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Stranded Energy MVP
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Investor And Partner Materials
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-600">
              Narrative materials for explaining the business thesis, recruiting advisors, and starting operator, investor, vendor, and offtaker conversations.
            </p>
          </div>
          <nav className="flex flex-wrap gap-2">
            <Link
              className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
              href="/dashboard"
            >
              Dashboard
            </Link>
            <Link
              className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
              href="/pipeline"
            >
              Pipeline
            </Link>
            <Link
              className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
              href="/intake"
            >
              Intake
            </Link>
            <Link
              className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
              href="/crm"
            >
              CRM
            </Link>
            <Link
              className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
              href="/commercial"
            >
              Commercial
            </Link>
            <Link
              className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800"
              href="/partners"
            >
              Partners
            </Link>
            <Link
              className="inline-flex h-10 items-center justify-center rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
              href="/opportunities/new"
            >
              New Opportunity
            </Link>
          </nav>
        </div>

        <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Narrative Summary</h2>
          <p className="mt-2 max-w-3xl text-sm text-zinc-600">
            The Stranded Energy Development Screen is a concierge MVP for finding and packaging overlooked energy development opportunities. It starts with founder-led screening and can compound into a repeatable project development workflow, opportunity database, partner network, and standardized modular infrastructure playbook.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {partnerCards.map((card) => (
            <article
              className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm"
              key={card.title}
            >
              <h2 className="text-lg font-semibold">{card.title}</h2>
              <p className="mt-2 text-sm font-medium text-zinc-700">
                {card.audience}
              </p>
              <p className="mt-3 text-sm text-zinc-600">{card.use}</p>
            </article>
          ))}
        </section>

        <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Resource Files</h2>
          <ul className="mt-4 grid gap-2 text-sm text-zinc-700 md:grid-cols-2">
            {resourceLinks.map((resource) => (
              <li
                className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2"
                key={resource}
              >
                {resource}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-zinc-600">
            Use these materials to start focused conversations, then move qualified opportunities into intake and screening.
          </p>
        </section>
      </div>
    </main>
  );
}
