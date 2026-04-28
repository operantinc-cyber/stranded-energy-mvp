import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import {
  generateProjectMemo,
  MEMO_DISCLAIMER,
  type GeneratedProjectMemo,
} from "@/lib/memo";
import { formatDate } from "@/lib/format";
import { PrintButton } from "./print-button";

const fields: Array<{
  key: keyof GeneratedProjectMemo;
  label: string;
}> = [
  { key: "executiveSummary", label: "Executive Summary" },
  { key: "assetDescription", label: "Asset and Location Overview" },
  { key: "resourceBasis", label: "Resource Basis" },
  { key: "infrastructureReview", label: "Infrastructure Review" },
  { key: "monetizationOptions", label: "Monetization Options" },
  { key: "recommendedConcept", label: "Recommended Development Concept" },
  { key: "technicalDesign", label: "Preliminary Technical Configuration" },
  { key: "commercialStructure", label: "Commercial Structure" },
  { key: "financialSummary", label: "Preliminary Financial Screen" },
  { key: "riskSummary", label: "Risk Register Summary" },
  { key: "developmentRoadmap", label: "Development Roadmap" },
  { key: "goNoGoRecommendation", label: "Go / No-Go Recommendation" },
  { key: "nextActions", label: "Immediate Next Actions" },
  { key: "assumptions", label: "Assumptions" },
  { key: "dataGaps", label: "Data Gaps" },
];

function memoFromStoredNextActions(value: string | null | undefined) {
  return {
    nextActions: value?.split("\n\nAssumptions:")[0].trim() ?? null,
    assumptions:
      value?.match(/Assumptions:\n([\s\S]*?)(?:\n\nData gaps:|$)/)?.[1] ??
      null,
    dataGaps: value?.match(/Data gaps:\n([\s\S]*)/)?.[1] ?? null,
  };
}

export default async function PrintMemoPage({
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
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      gasToPowerResults: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      financialScreenResults: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      risks: {
        orderBy: { severityScore: "desc" },
      },
      projectMemo: true,
    },
  });

  if (!opportunity) {
    notFound();
  }

  const generated = generateProjectMemo(opportunity);
  const storedNextActions = memoFromStoredNextActions(
    opportunity.projectMemo?.nextActions,
  );
  const memo: GeneratedProjectMemo = {
    executiveSummary:
      opportunity.projectMemo?.executiveSummary ?? generated.executiveSummary,
    assetDescription:
      opportunity.projectMemo?.assetDescription ?? generated.assetDescription,
    resourceBasis: opportunity.projectMemo?.resourceBasis ?? generated.resourceBasis,
    infrastructureReview:
      opportunity.projectMemo?.infrastructureReview ??
      generated.infrastructureReview,
    monetizationOptions:
      opportunity.projectMemo?.monetizationOptions ??
      generated.monetizationOptions,
    recommendedConcept:
      opportunity.projectMemo?.recommendedConcept ?? generated.recommendedConcept,
    technicalDesign:
      opportunity.projectMemo?.technicalDesign ?? generated.technicalDesign,
    commercialStructure:
      opportunity.projectMemo?.commercialStructure ?? generated.commercialStructure,
    financialSummary:
      opportunity.projectMemo?.financialSummary ?? generated.financialSummary,
    riskSummary: opportunity.projectMemo?.riskSummary ?? generated.riskSummary,
    developmentRoadmap:
      opportunity.projectMemo?.developmentRoadmap ?? generated.developmentRoadmap,
    goNoGoRecommendation:
      opportunity.projectMemo?.goNoGoRecommendation ??
      generated.goNoGoRecommendation,
    nextActions: storedNextActions.nextActions ?? generated.nextActions,
    assumptions: storedNextActions.assumptions ?? generated.assumptions,
    dataGaps: storedNextActions.dataGaps ?? generated.dataGaps,
  };

  return (
    <main className="min-h-screen bg-white px-6 py-8 text-zinc-950 print:px-0 print:py-0">
      <article className="mx-auto max-w-4xl print:max-w-none">
        <div className="mb-6 flex items-center justify-between gap-4 print:hidden">
          <a
            className="text-sm font-semibold text-zinc-700 hover:text-zinc-950"
            href={`/opportunities/${opportunity.id}/memo`}
          >
            Back to memo
          </a>
          <PrintButton />
        </div>

        <header className="border-b border-zinc-300 pb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Stranded Energy MVP
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            {opportunity.name} Project Memo
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Export date: {formatDate(new Date())}
          </p>
        </header>

        <section className="mt-6 rounded-md border border-zinc-300 bg-zinc-50 p-4 print:bg-white">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-600">
            Screening Disclaimer
          </h2>
          <p className="mt-2 text-sm leading-6 text-zinc-700">{MEMO_DISCLAIMER}</p>
        </section>

        <div className="mt-4">
          {fields.map((field, index) => (
            <section
              className="break-inside-avoid border-b border-zinc-200 py-5"
              key={field.key}
            >
              <h2 className="text-lg font-semibold text-zinc-950">
                {index + 1}. {field.label}
              </h2>
              <div className="mt-2 whitespace-pre-line text-sm leading-6 text-zinc-700">
                {memo[field.key] || "Not provided."}
              </div>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}

