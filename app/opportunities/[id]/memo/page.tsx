import Link from "next/link";
import { notFound } from "next/navigation";
import {
  generateAndSaveProjectMemo,
  saveProjectMemo,
} from "@/app/actions";
import { prisma } from "@/lib/db";
import {
  generateProjectMemo,
  MEMO_DISCLAIMER,
  projectMemoToMarkdown,
  type GeneratedProjectMemo,
} from "@/lib/memo";
import { ExportMarkdownButton } from "./export-button";

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

function slug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function TextArea({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue: string | null;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-zinc-700">
      {label}
      <textarea
        className="min-h-32 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm leading-6 text-zinc-950 shadow-sm outline-none transition focus:border-zinc-700 focus:ring-2 focus:ring-zinc-100"
        defaultValue={defaultValue ?? ""}
        name={name}
      />
    </label>
  );
}

function PreviewSection({
  index,
  label,
  value,
}: {
  index: number;
  label: string;
  value: string | null;
}) {
  return (
    <section className="border-b border-zinc-200 py-5 last:border-b-0">
      <h3 className="text-base font-semibold text-zinc-950">
        {index}. {label}
      </h3>
      <div className="mt-2 max-w-4xl whitespace-pre-line text-sm leading-6 text-zinc-700">
        {value || "Not provided."}
      </div>
    </section>
  );
}

export default async function MemoPage({
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
    nextActions: opportunity.projectMemo?.nextActions
      ? opportunity.projectMemo.nextActions
          .split("\n\nAssumptions:")[0]
          .trim()
      : generated.nextActions,
    assumptions:
      opportunity.projectMemo?.nextActions?.match(
        /Assumptions:\n([\s\S]*?)(?:\n\nData gaps:|$)/,
      )?.[1] ?? generated.assumptions,
    dataGaps:
      opportunity.projectMemo?.nextActions?.match(/Data gaps:\n([\s\S]*)/)?.[1] ??
      generated.dataGaps,
  };
  const saveAction = saveProjectMemo.bind(null, opportunity.id);
  const generateAction = generateAndSaveProjectMemo.bind(null, opportunity.id);
  const markdown = projectMemoToMarkdown(opportunity.name, memo);

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-8 text-zinc-950 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-6">
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link
              className="text-sm font-semibold text-zinc-700 hover:text-zinc-950"
              href={`/opportunities/${opportunity.id}`}
            >
              Back to opportunity
            </Link>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Project Memo: {opportunity.name}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-600">
              Generate, edit, preview, and export a screening-level project memo.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <form action={generateAction}>
              <button
                className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-700"
                type="submit"
              >
                Generate Memo
              </button>
            </form>
            <ExportMarkdownButton
              filename={`${slug(opportunity.name)}-project-memo.md`}
              markdown={markdown}
            />
            <Link
              className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
              href={`/opportunities/${opportunity.id}/memo/print`}
              target="_blank"
            >
              Print / Save as PDF
            </Link>
          </div>
        </div>

        <form action={saveAction} className="grid gap-6">
          <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold">Edit Memo</h2>
                <p className="mt-1 text-sm text-zinc-600">
                  Existing saved fields are shown first. Empty fields use the generated draft.
                </p>
              </div>
              <label className="grid gap-1.5 text-sm font-medium text-zinc-700">
                Status
                <input
                  className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 shadow-sm outline-none transition focus:border-zinc-700 focus:ring-2 focus:ring-zinc-100"
                  defaultValue={opportunity.projectMemo?.memoStatus ?? "Draft"}
                  name="memoStatus"
                />
              </label>
            </div>
            <div className="mt-5 grid gap-4">
              {fields.map((field) => (
                <TextArea
                  defaultValue={memo[field.key]}
                  key={field.key}
                  label={field.label}
                  name={field.key}
                />
              ))}
            </div>
            <div className="mt-5 flex justify-end">
              <button
                className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-700"
                type="submit"
              >
                Save Memo
              </button>
            </div>
          </section>
        </form>

        <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Preview</h2>
          <div className="mt-4 rounded-md border border-zinc-200 bg-zinc-50 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Screening Disclaimer
            </h3>
            <p className="mt-2 text-sm leading-6 text-zinc-700">
              {MEMO_DISCLAIMER}
            </p>
          </div>
          <div className="mt-2">
            {fields.map((field, index) => (
              <PreviewSection
                index={index + 1}
                key={field.key}
                label={field.label}
                value={memo[field.key]}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
