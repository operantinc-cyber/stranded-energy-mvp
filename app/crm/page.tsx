import Link from "next/link";

const crmColumns = [
  "Company",
  "Contact Name",
  "Role/Title",
  "Segment",
  "Geography",
  "Email",
  "Phone",
  "LinkedIn",
  "Website",
  "Relationship Strength",
  "Relevance Score",
  "Opportunity Type",
  "Potential Fit",
  "Last Contact Date",
  "Next Action",
  "Next Action Date",
  "Status",
  "Notes",
];

const contactMix = [
  ["Independent operators / gas producers", 30],
  ["EPC or modular infrastructure vendors", 15],
  ["Investors / family offices", 15],
  ["Data center or industrial power users", 10],
  ["Midstream / gas processing contacts", 10],
  ["Legal, permitting, and environmental advisors", 10],
  ["Nigeria/Africa energy contacts", 10],
] as const;

const resourceLinks = [
  "docs/target-counterparty-crm.md",
  "templates/target-counterparty-crm.csv",
  "docs/outreach-playbook.md",
  "docs/outreach-templates.md",
];

export default function CrmPage() {
  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-8 text-zinc-950 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-6">
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Stranded Energy MVP
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Counterparty CRM Resources
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-600">
              Organize market testing contacts for operators, investors, EPC partners, vendors, offtakers, lawyers, permitting advisors, and power users.
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
              className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800"
              href="/crm"
            >
              CRM
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
          <h2 className="text-lg font-semibold">Purpose</h2>
          <p className="mt-2 max-w-3xl text-sm text-zinc-600">
            The counterparty CRM is a lightweight business development tracker for MVP market testing. It helps the founder build a target list, prioritize outreach, track next actions, and move qualified opportunities into client intake.
          </p>
        </section>

        <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Recommended CRM Columns</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-200 text-left text-sm">
              <thead className="bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="px-3 py-3">Column</th>
                  <th className="px-3 py-3">Use</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {crmColumns.map((column) => (
                  <tr key={column}>
                    <td className="whitespace-nowrap px-3 py-3 font-medium text-zinc-950">
                      {column}
                    </td>
                    <td className="px-3 py-3 text-zinc-600">
                      Track this field in the CSV template for sorting, prioritization, and next actions.
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <article className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Target First-100 Mix</h2>
            <div className="mt-4 grid gap-3">
              {contactMix.map(([segment, count]) => (
                <div
                  className="flex items-center justify-between rounded-md border border-zinc-200 px-3 py-2"
                  key={segment}
                >
                  <span className="text-sm text-zinc-700">{segment}</span>
                  <span className="text-sm font-semibold text-zinc-950">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Resource Files</h2>
            <ul className="mt-4 grid gap-2 text-sm text-zinc-700">
              {resourceLinks.map((resource) => (
                <li className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2" key={resource}>
                  {resource}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-zinc-600">
              These files live in the repository and can be copied, edited, or imported into a spreadsheet.
            </p>
          </article>
        </section>

        <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-950">
          <span className="font-semibold">Next step:</span> Download or copy the CRM template, build a list of 100 targets, then start outreach using the playbook.
        </section>
      </div>
    </main>
  );
}
