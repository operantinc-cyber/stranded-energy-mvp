import Link from "next/link";
import { updateOpportunityStatus } from "@/app/actions";
import { prisma } from "@/lib/db";
import {
  formatCurrency,
  formatDate,
  formatMw,
  formatScore,
} from "@/lib/format";
import { StatusSelect } from "./status-select";

export const dynamic = "force-dynamic";

const pipelineStatuses = [
  "New",
  "Data Requested",
  "Screening",
  "Memo Drafted",
  "Pursue",
  "Watch",
  "Reject",
  "Archived",
] as const;

const summaryStatuses = [
  "New",
  "Screening",
  "Pursue",
  "Watch",
  "Reject",
  "Archived",
] as const;

function locationLabel(opportunity: {
  locationCity: string | null;
  locationState: string | null;
  locationCountry: string | null;
}) {
  const parts = [
    opportunity.locationCity,
    opportunity.locationState,
    opportunity.locationCountry,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(", ") : "Not provided";
}

function latestDate(dates: Array<Date | null | undefined>) {
  const validDates = dates.filter((date): date is Date => Boolean(date));

  return validDates.reduce(
    (latest, date) => (date.getTime() > latest.getTime() ? date : latest),
    validDates[0] ?? new Date(0),
  );
}

function badgeClass(value: string | null | undefined) {
  if (value === "Priority" || value === "Pursue") {
    return "bg-emerald-50 text-emerald-800 ring-emerald-100";
  }

  if (value === "Develop" || value === "New" || value === "Screening") {
    return "bg-blue-50 text-blue-800 ring-blue-100";
  }

  if (value === "Watch" || value === "Data Requested") {
    return "bg-amber-50 text-amber-800 ring-amber-100";
  }

  if (value === "Reject") {
    return "bg-red-50 text-red-700 ring-red-100";
  }

  return "bg-zinc-100 text-zinc-700 ring-zinc-200";
}

function Badge({ value }: { value: string | null | undefined }) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ring-1 ${badgeClass(value)}`}
    >
      {value ?? "Not calculated"}
    </span>
  );
}

export default async function PipelinePage() {
  const opportunities = await prisma.opportunity.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      scoringResults: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
      gasToPowerResults: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
      financialScreenResults: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
  });

  const discoveredStatuses = opportunities
    .map((opportunity) => opportunity.status)
    .filter((status) => !pipelineStatuses.includes(status as never));
  const columnStatuses = [
    ...pipelineStatuses,
    ...Array.from(new Set(discoveredStatuses)),
  ];
  const countByStatus = new Map<string, number>();

  for (const opportunity of opportunities) {
    countByStatus.set(
      opportunity.status,
      (countByStatus.get(opportunity.status) ?? 0) + 1,
    );
  }

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-8 text-zinc-950 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6">
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Stranded Energy MVP
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Opportunity Pipeline
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-600">
              Review opportunities by status and move records through the early screening workflow.
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
              className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800"
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
              className="inline-flex h-10 items-center justify-center rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
              href="/opportunities/new"
            >
              New Opportunity
            </Link>
          </nav>
        </div>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
          <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Total
            </p>
            <p className="mt-1 text-2xl font-semibold">{opportunities.length}</p>
          </div>
          {summaryStatuses.map((status) => (
            <div
              className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
              key={status}
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                {status}
              </p>
              <p className="mt-1 text-2xl font-semibold">
                {countByStatus.get(status) ?? 0}
              </p>
            </div>
          ))}
        </section>

        {opportunities.length === 0 ? (
          <section className="grid gap-3 rounded-lg border border-zinc-200 bg-white px-5 py-10 text-center shadow-sm">
            <p className="text-sm text-zinc-600">
              No opportunities have been created yet.
            </p>
            <Link
              className="mx-auto inline-flex h-10 items-center justify-center rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
              href="/opportunities/new"
            >
              Create the first opportunity
            </Link>
          </section>
        ) : (
          <section className="grid gap-4 overflow-x-auto pb-2 lg:grid-flow-col lg:auto-cols-[minmax(18rem,1fr)]">
            {columnStatuses.map((status) => {
              const columnOpportunities = opportunities.filter(
                (opportunity) => opportunity.status === status,
              );

              return (
                <div
                  className="min-h-80 rounded-lg border border-zinc-200 bg-zinc-50"
                  key={status}
                >
                  <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <h2 className="font-semibold">{status}</h2>
                      <span className="inline-flex rounded-full bg-white px-2 py-1 text-xs font-semibold text-zinc-600 ring-1 ring-zinc-200">
                        {columnOpportunities.length}
                      </span>
                    </div>
                  </div>
                  <div className="grid gap-3 p-3">
                    {columnOpportunities.length === 0 ? (
                      <p className="rounded-md border border-dashed border-zinc-300 bg-white p-4 text-sm text-zinc-500">
                        No opportunities in this status.
                      </p>
                    ) : (
                      columnOpportunities.map((opportunity) => {
                        const latestScore = opportunity.scoringResults[0];
                        const latestGasToPower = opportunity.gasToPowerResults[0];
                        const latestFinancial =
                          opportunity.financialScreenResults[0];
                        const statusAction = updateOpportunityStatus.bind(
                          null,
                          opportunity.id,
                        );

                        return (
                          <article
                            className="grid gap-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
                            key={opportunity.id}
                          >
                            <div className="grid gap-1">
                              <Link
                                className="font-semibold text-zinc-950 hover:text-emerald-700"
                                href={`/opportunities/${opportunity.id}`}
                              >
                                {opportunity.name}
                              </Link>
                              <p className="text-sm text-zinc-600">
                                {opportunity.assetType}
                              </p>
                              <p className="text-sm text-zinc-500">
                                {locationLabel(opportunity)}
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                                  Score
                                </p>
                                <p className="font-medium">
                                  {formatScore(latestScore?.totalScore)}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                                  Class
                                </p>
                                <Badge value={latestScore?.classification} />
                              </div>
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                                  Rec. MW
                                </p>
                                <p className="font-medium">
                                  {formatMw(latestGasToPower?.recommendedMw)}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                                  EBITDA
                                </p>
                                <p
                                  className={`font-medium ${
                                    latestFinancial &&
                                    latestFinancial.ebitda < 0
                                      ? "text-red-700"
                                      : "text-zinc-950"
                                  }`}
                                >
                                  {formatCurrency(latestFinancial?.ebitda)}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-end justify-between gap-3">
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                                  Last Updated
                                </p>
                                <p className="text-sm text-zinc-700">
                                  {formatDate(
                                    latestDate([
                                      opportunity.updatedAt,
                                      latestScore?.createdAt,
                                      latestGasToPower?.createdAt,
                                      latestFinancial?.createdAt,
                                    ]),
                                  )}
                                </p>
                              </div>
                              <Link
                                className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-300 px-3 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-50"
                                href={`/opportunities/${opportunity.id}`}
                              >
                                Detail
                              </Link>
                            </div>

                            <StatusSelect
                              action={statusAction}
                              currentStatus={opportunity.status}
                            />
                          </article>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}
