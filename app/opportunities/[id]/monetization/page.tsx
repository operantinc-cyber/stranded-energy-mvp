import Link from "next/link";
import { notFound } from "next/navigation";
import { setPreferredMonetization } from "@/app/actions";
import { prisma } from "@/lib/db";
import { formatScore } from "@/lib/format";
import { compareMonetizationOptions } from "@/lib/monetization";

function Badge({ value }: { value: string }) {
  const tone =
    value === "High" || value === "Long"
      ? "bg-red-50 text-red-700 ring-red-100"
      : value === "Medium"
        ? "bg-amber-50 text-amber-800 ring-amber-100"
        : "bg-emerald-50 text-emerald-700 ring-emerald-100";

  return (
    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ring-1 ${tone}`}>
      {value}
    </span>
  );
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
        {title}
      </h3>
      <ul className="mt-2 grid gap-1 text-sm text-zinc-700">
        {items.map((item) => (
          <li key={item}>- {item}</li>
        ))}
      </ul>
    </div>
  );
}

export default async function MonetizationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const opportunity = await prisma.opportunity.findUnique({
    where: { id },
    include: {
      resourceData: true,
      infrastructureData: true,
      commercialData: true,
      regulatoryData: true,
      projectMemo: true,
    },
  });

  if (!opportunity) {
    notFound();
  }

  const options = compareMonetizationOptions(opportunity);
  const preferredOption = opportunity.projectMemo?.recommendedConcept ?? null;
  const preferredAction = setPreferredMonetization.bind(null, opportunity.id);
  const isPreferred = (optionName: string) =>
    preferredOption === optionName ||
    preferredOption?.startsWith(`Recommended concept: ${optionName}.`);

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-8 text-zinc-950 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-6">
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link
              className="text-sm font-semibold text-teal-700 hover:text-teal-800"
              href={`/opportunities/${opportunity.id}`}
            >
              Back to opportunity
            </Link>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Monetization Options: {opportunity.name}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-600">
              Compare rule-based monetization pathways and mark one preferred concept for the project memo.
            </p>
          </div>
          <Link
            className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
            href="/dashboard"
          >
            Dashboard
          </Link>
        </div>

        <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Preferred Option</h2>
          <p className="mt-2 text-sm text-zinc-600">
            {preferredOption ?? "No preferred monetization option has been selected."}
          </p>
        </section>

        <section className="grid gap-4">
          {options.map((option, index) => (
            <article
              className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm"
              key={option.name}
            >
              <div className="flex flex-col gap-4 border-b border-zinc-200 pb-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-semibold text-zinc-700">
                      Rank {index + 1}
                    </span>
                    {isPreferred(option.name) ? (
                      <span className="rounded-full bg-teal-50 px-2 py-1 text-xs font-semibold text-teal-700 ring-1 ring-teal-100">
                        Preferred
                      </span>
                    ) : null}
                  </div>
                  <h2 className="mt-3 text-xl font-semibold text-zinc-950">
                    {option.name}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-zinc-700">
                    {option.recommendation}
                  </p>
                </div>
                <div className="grid gap-2 sm:grid-cols-4 lg:min-w-[420px]">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Score
                    </p>
                    <p className="mt-1 text-2xl font-semibold">
                      {formatScore(option.score)}
                      <span className="text-sm font-medium text-zinc-500">/100</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Feasibility
                    </p>
                    <p className="mt-2">
                      <Badge value={option.feasibility} />
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Capex
                    </p>
                    <p className="mt-2">
                      <Badge value={option.capexIntensity} />
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Time
                    </p>
                    <p className="mt-2">
                      <Badge value={option.timeToExecute} />
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_1fr_auto]">
                <ListBlock items={option.keyRequirements} title="Key Requirements" />
                <ListBlock items={option.keyRisks} title="Key Risks" />
                <form action={preferredAction} className="flex items-start lg:justify-end">
                  <input name="preferredOption" type="hidden" value={option.name} />
                  <button
                    className="inline-flex h-10 items-center justify-center rounded-md border border-teal-200 px-4 text-sm font-semibold text-teal-700 transition hover:bg-teal-50"
                    type="submit"
                  >
                    Mark Preferred
                  </button>
                </form>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
