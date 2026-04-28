import Link from "next/link";
import { deleteOpportunity } from "@/app/actions";
import { prisma } from "@/lib/db";
import {
  formatCurrency,
  formatDate,
  formatMw,
  formatScore,
} from "@/lib/format";

export const dynamic = "force-dynamic";

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
  if (value === "Priority" || value === "Active") {
    return "bg-emerald-50 text-emerald-800 ring-emerald-100";
  }

  if (value === "Develop" || value === "New") {
    return "bg-blue-50 text-blue-800 ring-blue-100";
  }

  if (value === "Watch") {
    return "bg-amber-50 text-amber-800 ring-amber-100";
  }

  if (value === "Reject" || value === "Closed") {
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

export default async function Home() {
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

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-8 text-zinc-950 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6">
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Stranded Energy MVP
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Opportunity Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-600">
              Track early-stage energy opportunities and maintain the input data needed for later scoring.
            </p>
          </div>
          <nav className="flex flex-wrap gap-2">
            <Link
              className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800"
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
              className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
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

        <section className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-200 px-5 py-4">
            <h2 className="text-lg font-semibold">Opportunities</h2>
          </div>

          {opportunities.length === 0 ? (
            <div className="grid gap-3 px-5 py-10 text-center">
              <p className="text-sm text-zinc-600">No opportunities have been created yet.</p>
              <Link
                className="mx-auto inline-flex h-10 items-center justify-center rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
                href="/opportunities/new"
              >
                Create the first opportunity
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-zinc-200 text-left text-sm">
                <thead className="bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-600">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Asset Type</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Score</th>
                    <th className="px-4 py-3">Classification</th>
                    <th className="px-4 py-3">Recommended MW</th>
                    <th className="px-4 py-3">Estimated Capex</th>
                    <th className="px-4 py-3">EBITDA</th>
                    <th className="px-4 py-3">Last Updated</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {opportunities.map((opportunity) => {
                    const deleteAction = deleteOpportunity.bind(null, opportunity.id);
                    const latestScore = opportunity.scoringResults[0];
                    const latestGasToPower = opportunity.gasToPowerResults[0];
                    const latestFinancial = opportunity.financialScreenResults[0];

                    return (
                      <tr className="align-top transition hover:bg-zinc-50" key={opportunity.id}>
                        <td className="px-4 py-3 font-medium text-zinc-950">
                          {opportunity.name}
                        </td>
                        <td className="px-4 py-3 text-zinc-700">{opportunity.assetType}</td>
                        <td className="px-4 py-3 text-zinc-700">
                          {locationLabel(opportunity)}
                        </td>
                        <td className="px-4 py-3">
                          <Badge value={opportunity.status} />
                        </td>
                        <td className="px-4 py-3 text-zinc-700">
                          {formatScore(latestScore?.totalScore)}
                        </td>
                        <td className="px-4 py-3">
                          <Badge value={latestScore?.classification} />
                        </td>
                        <td className="px-4 py-3 text-zinc-700">
                          {formatMw(latestGasToPower?.recommendedMw)}
                        </td>
                        <td className="px-4 py-3 text-zinc-700">
                          {formatCurrency(latestFinancial?.totalCapexBase)}
                        </td>
                        <td
                          className={`px-4 py-3 ${
                            latestFinancial && latestFinancial.ebitda < 0
                              ? "font-semibold text-red-700"
                              : "text-zinc-700"
                          }`}
                        >
                          {formatCurrency(latestFinancial?.ebitda)}
                        </td>
                        <td className="px-4 py-3 text-zinc-700">
                          {formatDate(
                            latestDate([
                              opportunity.updatedAt,
                              latestScore?.createdAt,
                              latestGasToPower?.createdAt,
                              latestFinancial?.createdAt,
                            ]),
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Link
                              className="inline-flex h-8 items-center justify-center rounded-md border border-zinc-300 px-3 text-xs font-semibold text-zinc-700 transition hover:bg-white"
                              href={`/opportunities/${opportunity.id}`}
                            >
                              Edit
                            </Link>
                            <Link
                              className="inline-flex h-8 items-center justify-center rounded-md border border-emerald-200 px-3 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50"
                              href={`/opportunities/${opportunity.id}/score`}
                            >
                              Score
                            </Link>
                            <Link
                              className="inline-flex h-8 items-center justify-center rounded-md border border-blue-200 px-3 text-xs font-semibold text-blue-700 transition hover:bg-blue-50"
                              href={`/opportunities/${opportunity.id}/gas-to-power`}
                            >
                              G2P
                            </Link>
                            <Link
                              className="inline-flex h-8 items-center justify-center rounded-md border border-violet-200 px-3 text-xs font-semibold text-violet-700 transition hover:bg-violet-50"
                              href={`/opportunities/${opportunity.id}/financial`}
                            >
                              Financial
                            </Link>
                            <Link
                              className="inline-flex h-8 items-center justify-center rounded-md border border-amber-200 px-3 text-xs font-semibold text-amber-700 transition hover:bg-amber-50"
                              href={`/opportunities/${opportunity.id}/risks`}
                            >
                              Risks
                            </Link>
                            <Link
                              className="inline-flex h-8 items-center justify-center rounded-md border border-teal-200 px-3 text-xs font-semibold text-teal-700 transition hover:bg-teal-50"
                              href={`/opportunities/${opportunity.id}/monetization`}
                            >
                              Monetize
                            </Link>
                            <Link
                              className="inline-flex h-8 items-center justify-center rounded-md border border-zinc-300 px-3 text-xs font-semibold text-zinc-700 transition hover:bg-white"
                              href={`/opportunities/${opportunity.id}/memo`}
                            >
                              Memo
                            </Link>
                            <form action={deleteAction}>
                              <button
                                className="inline-flex h-8 items-center justify-center rounded-md border border-red-200 px-3 text-xs font-semibold text-red-700 transition hover:bg-red-50"
                                type="submit"
                              >
                                Delete
                              </button>
                            </form>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
