import Link from "next/link";

const packages = [
  {
    name: "Opportunity Diagnostic",
    price: "$1,500-$5,000",
    timeline: "3-5 business days",
    bestFor: "Quick go/no-go review",
    deliverables: [
      "Intake review",
      "High-level opportunity summary",
      "Data gap list",
      "Initial monetization options",
      "Preliminary go/no-go view",
    ],
  },
  {
    name: "Development Screen",
    price: "$10,000-$35,000",
    timeline: "10-15 business days",
    bestFor: "Serious opportunities needing structured screening",
    deliverables: [
      "Full project development memo",
      "Gas-to-power or modular infrastructure sizing",
      "Preliminary economics",
      "Risk register",
      "Monetization pathway ranking",
      "Recommended development concept",
      "Next-step roadmap",
    ],
  },
  {
    name: "Advanced Pre-Feasibility Support",
    price: "$50,000-$150,000+",
    timeline: "4-8 weeks",
    bestFor: "Partner, investor, or offtaker discussions",
    deliverables: [
      "Deeper engineering review",
      "Vendor budgetary input coordination",
      "Permitting pathway review",
      "Refined financial model",
      "Offtaker/counterparty strategy",
      "Investor or partner memo support",
    ],
  },
  {
    name: "Development Partnership",
    price: "Custom",
    timeline: "Project-specific",
    bestFor: "Origination, structuring, financing, or development support",
    deliverables: [
      "Development fee",
      "Success fee",
      "Project equity",
      "Carried interest",
      "Revenue share",
      "O&M or optimization fee",
    ],
  },
];

const processSteps = [
  "Intake and NDA",
  "Data review",
  "Technical/commercial screening",
  "Development memo",
  "Decision meeting and next steps",
];

const resourceLinks = [
  "docs/service-overview.md",
  "docs/pricing-sheet.md",
  "templates/feasibility-proposal-template.md",
  "docs/report-disclaimer.md",
];

export default function CommercialPage() {
  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-8 text-zinc-950 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-6">
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Stranded Energy MVP
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Commercial Service Package
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-600">
              Founder-ready service overview and pricing structure for selling the Stranded Energy Development Screen as a concierge MVP.
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
              className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800"
              href="/commercial"
            >
              Commercial
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
          <h2 className="text-lg font-semibold">
            Stranded Energy Development Screen
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-zinc-600">
            AI-assisted screening for stranded gas, flare gas, marginal fields, and modular power opportunities. The service helps clients convert fragmented early-stage data into a practical development concept, risk view, monetization comparison, and next-step memo.
          </p>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          {packages.map((servicePackage) => (
            <article
              className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm"
              key={servicePackage.name}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold">
                    {servicePackage.name}
                  </h2>
                  <p className="mt-1 text-sm text-zinc-600">
                    {servicePackage.bestFor}
                  </p>
                </div>
                <div className="rounded-md bg-zinc-100 px-3 py-2 text-sm font-semibold text-zinc-950">
                  {servicePackage.price}
                </div>
              </div>
              <p className="mt-3 text-sm text-zinc-600">
                Timeline:{" "}
                <span className="font-semibold text-zinc-950">
                  {servicePackage.timeline}
                </span>
              </p>
              <ul className="mt-4 grid gap-2 text-sm text-zinc-700">
                {servicePackage.deliverables.map((deliverable) => (
                  <li className="flex gap-2" key={deliverable}>
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                    <span>{deliverable}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <article className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold">5-Step Process</h2>
            <ol className="mt-4 grid gap-3 text-sm text-zinc-700">
              {processSteps.map((step, index) => (
                <li className="flex gap-3" key={step}>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-xs font-semibold text-white">
                    {index + 1}
                  </span>
                  <span className="pt-1">{step}</span>
                </li>
              ))}
            </ol>
          </article>

          <article className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Commercial Files</h2>
            <ul className="mt-4 grid gap-2 text-sm text-zinc-700">
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
              These files can be copied into founder decks, proposals, engagement letters, or client-facing memo templates.
            </p>
          </article>
        </section>

        <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-950">
          <span className="font-semibold">Call to action:</span> Start with the client intake form, then create a new opportunity in the app.
        </section>
      </div>
    </main>
  );
}
