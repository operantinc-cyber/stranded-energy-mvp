import Link from "next/link";
import { notFound } from "next/navigation";
import { saveOpportunityScore } from "@/app/actions";
import { prisma } from "@/lib/db";
import {
  calculateTotalScore,
  classifyOpportunity,
  suggestScores,
  type CategoryScores,
} from "@/lib/scoring";

const scoreFields: Array<{
  name: keyof CategoryScores;
  label: string;
  description: string;
}> = [
  {
    name: "resourceQualityScore",
    label: "Resource Quality",
    description: "Gas volume, gas quality, stability, and contamination risk.",
  },
  {
    name: "infrastructureScore",
    label: "Infrastructure Proximity",
    description: "Access to roads, power, pipeline, loads, and site infrastructure.",
  },
  {
    name: "marketDemandScore",
    label: "Market Demand",
    description: "Nearby load, offtake signals, and power pricing visibility.",
  },
  {
    name: "technicalFeasibilityScore",
    label: "Technical Feasibility",
    description: "Combined resource and infrastructure readiness.",
  },
  {
    name: "commercialControlScore",
    label: "Commercial Control",
    description: "Known owners, rights, contracts, and commercial model clarity.",
  },
  {
    name: "regulatoryFeasibilityScore",
    label: "Regulatory Feasibility",
    description: "Permits, approvals, issue flags, and permitting timeline.",
  },
  {
    name: "economicPotentialScore",
    label: "Economic Potential",
    description: "Early view of resource scale, demand, control, and utilization.",
  },
  {
    name: "speedToExecuteScore",
    label: "Speed to Execute",
    description: "How quickly the project can plausibly move into development.",
  },
  {
    name: "strategicRepeatabilityScore",
    label: "Strategic Repeatability",
    description: "Pattern value for future similar opportunities.",
  },
  {
    name: "counterpartySeriousnessScore",
    label: "Counterparty Seriousness",
    description: "Interest level, contactability, and commercial specificity.",
  },
];

function scoreDefaults(
  suggestedScores: CategoryScores,
  latestScore: CategoryScores | null,
) {
  return Object.fromEntries(
    scoreFields.map((field) => [
      field.name,
      latestScore?.[field.name] ?? suggestedScores[field.name],
    ]),
  ) as CategoryScores;
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-zinc-950">{value}</p>
    </div>
  );
}

export default async function OpportunityScorePage({
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
      scoringResults: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
  });

  if (!opportunity) {
    notFound();
  }

  const suggestedScores = suggestScores(opportunity);
  const latestScore = opportunity.scoringResults[0] ?? null;
  const defaults = scoreDefaults(suggestedScores, latestScore);
  const previewTotal = calculateTotalScore(defaults);
  const previewClassification = classifyOpportunity(previewTotal);
  const saveAction = saveOpportunityScore.bind(null, opportunity.id);

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-8 text-zinc-950 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-6">
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link
              className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
              href={`/opportunities/${opportunity.id}`}
            >
              Back to opportunity
            </Link>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Score {opportunity.name}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-600">
              Review deterministic suggested scores, adjust any category, and save a scoring result.
            </p>
          </div>
          <Link
            className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
            href="/dashboard"
          >
            Dashboard
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Stat label="Current Total" value={`${previewTotal}/100`} />
          <Stat label="Classification" value={previewClassification} />
          <Stat
            label="Last Saved"
            value={latestScore ? `${Math.round(latestScore.totalScore)}/100` : "None"}
          />
        </div>

        {latestScore?.recommendation ? (
          <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Latest Recommendation</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-700">
              {latestScore.recommendation}
            </p>
          </section>
        ) : null}

        <form action={saveAction} className="rounded-lg border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-200 px-5 py-4">
            <h2 className="text-lg font-semibold">Scoring Categories</h2>
            <p className="mt-1 text-sm text-zinc-600">
              Category scores are clamped from 1 to 10. The saved total is normalized to 100.
            </p>
          </div>

          <div className="grid gap-4 p-5">
            {scoreFields.map((field) => (
              <label
                className="grid gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 md:grid-cols-[1fr_160px]"
                key={field.name}
              >
                <span>
                  <span className="block text-sm font-semibold text-zinc-950">
                    {field.label}
                  </span>
                  <span className="mt-1 block text-sm text-zinc-600">
                    {field.description}
                  </span>
                  <span className="mt-2 block text-xs font-medium text-emerald-700">
                    Suggested: {suggestedScores[field.name]}/10
                  </span>
                </span>
                <input
                  className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 shadow-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  defaultValue={defaults[field.name]}
                  max={10}
                  min={1}
                  name={field.name}
                  required
                  step="0.1"
                  type="number"
                />
              </label>
            ))}
          </div>

          <div className="flex flex-col gap-3 border-t border-zinc-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-zinc-600">
              Saving creates a new scoring snapshot and updates the dashboard to the latest result.
            </p>
            <button
              className="inline-flex h-10 items-center justify-center rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
              type="submit"
            >
              Save Score
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
