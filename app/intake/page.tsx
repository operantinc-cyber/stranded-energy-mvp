import Link from "next/link";

const intakeSections = [
  {
    title: "A. Contact Information",
    items: [
      "Name",
      "Company",
      "Role/title",
      "Email",
      "Phone",
      "Preferred communication method",
    ],
  },
  {
    title: "B. Asset / Opportunity Basics",
    items: [
      "Asset name",
      "Asset type",
      "Country/state/region",
      "Owner/operator",
      "Current status",
      "Brief description",
      "Main objective",
    ],
  },
  {
    title: "C. Resource Data",
    items: [
      "Available gas volume, MMscfd",
      "Gas heating value, Btu/scf",
      "Gas pressure",
      "Gas temperature",
      "Gas composition if known",
      "H2S / CO2 / N2 content",
      "Current gas use",
      "Current gas price or realized value",
      "Flaring or shut-in status",
      "Production stability",
      "Oil production, if applicable",
      "Water production, if applicable",
    ],
  },
  {
    title: "D. Infrastructure Data",
    items: [
      "Distance to pipeline",
      "Distance to power line",
      "Distance to substation",
      "Distance to road",
      "Distance to fiber",
      "Distance to industrial load",
      "Land availability",
      "Water availability",
      "Existing facilities",
      "Existing compression",
      "Existing gas processing",
      "Site access quality",
    ],
  },
  {
    title: "E. Commercial Data",
    items: [
      "Gas owner",
      "Land owner",
      "Mineral rights owner",
      "Existing gas contracts",
      "Existing power offtaker",
      "Nearby industrial offtakers",
      "Interested counterparties",
      "Preferred commercial model",
      "Target power price",
      "Target gas price",
      "Desired transaction structure",
    ],
  },
  {
    title: "F. Regulatory / Execution Data",
    items: [
      "Existing permits",
      "Air permit requirements",
      "Water permit requirements",
      "Land use approval",
      "Interconnection requirements",
      "Known environmental issues",
      "Known community issues",
      "Known security issues",
      "Expected permitting complexity",
      "Expected schedule constraints",
    ],
  },
  {
    title: "G. Available Documents",
    items: [
      "Production history",
      "Gas analysis",
      "P&IDs",
      "Plot plans",
      "Facility drawings",
      "Well files",
      "Maps",
      "Permits",
      "Contracts",
      "Photos",
      "Prior studies",
      "Utility/interconnection correspondence",
    ],
  },
  {
    title: "H. Confidentiality and Next Steps",
    items: [
      "NDA needed?",
      "Who can approve data sharing?",
      "Who should receive the screening memo?",
      "Desired timeline",
      "Decision-maker names",
    ],
  },
];

const reviewChecks = [
  "Confirm gas volume is measured or supported by credible production history.",
  "Confirm gas, land, mineral rights, and operator authority are clear enough to proceed.",
  "Check whether H2S, CO2, or N2 levels require specialist technical review.",
  "Confirm road/site access and enough land for modular equipment.",
  "Identify a realistic offtake path before spending time on detailed screening.",
  "Flag permitting, community, environmental, security, and interconnection blockers early.",
  "Confirm the counterparty will sign an NDA and provide source documents.",
];

const redFlags = [
  "Unclear gas ownership or land control.",
  "No realistic offtake or power use case.",
  "Severe H2S/CO2 with no technical partner.",
  "No road/site access.",
  "Security issues that limit field execution.",
  "Unclear permits or unrealistic timeline.",
  "Speculative resource with no production support.",
  "Counterparty unwilling to share data under NDA.",
];

export default function IntakePage() {
  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-8 text-zinc-950 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-6">
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Stranded Energy MVP
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Client Intake Checklist
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-600">
              Use this page to review the minimum operator, investor, or asset owner data needed before creating and screening an opportunity.
            </p>
          </div>
          <nav className="flex flex-wrap gap-2">
            <Link
              className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
              href="/"
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
              className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800"
              href="/intake"
            >
              Intake
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
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Founder Workflow</h2>
              <p className="mt-1 max-w-3xl text-sm text-zinc-600">
                Send the Markdown questionnaire at{" "}
                <span className="font-semibold text-zinc-950">
                  docs/client-intake-form.md
                </span>{" "}
                to the client, review the responses against this checklist, then create an opportunity when the minimum data is credible.
              </p>
            </div>
            <Link
              className="inline-flex h-10 items-center justify-center rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
              href="/opportunities/new"
            >
              Create Opportunity
            </Link>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {intakeSections.map((section) => (
            <article
              className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm"
              key={section.title}
            >
              <h2 className="text-lg font-semibold">{section.title}</h2>
              <ul className="mt-4 grid gap-2 text-sm text-zinc-700">
                {section.items.map((item) => (
                  <li className="flex gap-2" key={item}>
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <article className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Internal Review Checks</h2>
            <ul className="mt-4 grid gap-2 text-sm text-zinc-700">
              {reviewChecks.map((item) => (
                <li className="flex gap-2" key={item}>
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-lg border border-red-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-red-800">Red Flags</h2>
            <ul className="mt-4 grid gap-2 text-sm text-zinc-700">
              {redFlags.map((item) => (
                <li className="flex gap-2" key={item}>
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950">
          This intake checklist supports preliminary screening only. It does not replace engineering, legal, environmental, interconnection, reserve, investment, or project finance diligence.
        </section>
      </div>
    </main>
  );
}
