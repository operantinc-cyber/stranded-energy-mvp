import type { RiskItem } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  createRisk,
  deleteRisk,
  generateRisks,
  updateRisk,
} from "@/app/actions";
import { prisma } from "@/lib/db";
import { riskCategories, riskStatuses } from "@/lib/risks";

const probabilities = ["Low", "Medium", "High"];
const impacts = ["Low", "Medium", "High"];

function SelectField({
  label,
  name,
  options,
  defaultValue,
}: {
  label: string;
  name: string;
  options: readonly string[];
  defaultValue?: string;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-zinc-700">
      {label}
      <select
        className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 shadow-sm outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
        defaultValue={defaultValue}
        name={name}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextField({
  label,
  name,
  defaultValue,
  required = false,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  required?: boolean;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-zinc-700">
      {label}
      <input
        className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 shadow-sm outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
        defaultValue={defaultValue ?? ""}
        name={name}
        required={required}
      />
    </label>
  );
}

function TextAreaField({
  label,
  name,
  defaultValue,
  required = false,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  required?: boolean;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-zinc-700 md:col-span-2">
      {label}
      <textarea
        className="min-h-20 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
        defaultValue={defaultValue ?? ""}
        name={name}
        required={required}
      />
    </label>
  );
}

function RiskFields({ risk }: { risk?: RiskItem }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <SelectField
        defaultValue={risk?.category ?? "Resource"}
        label="Category"
        name="category"
        options={riskCategories}
      />
      <SelectField
        defaultValue={risk?.status ?? "Open"}
        label="Status"
        name="status"
        options={riskStatuses}
      />
      <SelectField
        defaultValue={risk?.probability ?? "Medium"}
        label="Probability"
        name="probability"
        options={probabilities}
      />
      <SelectField
        defaultValue={risk?.impact ?? "Medium"}
        label="Impact"
        name="impact"
        options={impacts}
      />
      <TextAreaField
        defaultValue={risk?.riskDescription}
        label="Risk Description"
        name="riskDescription"
        required
      />
      <TextAreaField
        defaultValue={risk?.mitigation}
        label="Mitigation"
        name="mitigation"
        required
      />
      <TextField defaultValue={risk?.owner} label="Owner" name="owner" />
      <TextField defaultValue={risk?.nextAction} label="Next Action" name="nextAction" />
    </div>
  );
}

function SeverityBadge({ severity }: { severity: number }) {
  const tone =
    severity >= 6
      ? "bg-red-50 text-red-700 ring-red-100"
      : severity >= 3
        ? "bg-amber-50 text-amber-800 ring-amber-100"
        : "bg-emerald-50 text-emerald-700 ring-emerald-100";

  return (
    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ring-1 ${tone}`}>
      Severity {severity}/9
    </span>
  );
}

function LevelBadge({ value }: { value: string }) {
  const tone =
    value === "High"
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

export default async function RisksPage({
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
      risks: {
        orderBy: [
          {
            severityScore: "desc",
          },
        ],
      },
    },
  });

  if (!opportunity) {
    notFound();
  }

  const createAction = createRisk.bind(null, opportunity.id);
  const generateAction = generateRisks.bind(null, opportunity.id);

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-8 text-zinc-950 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-6">
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link
              className="text-sm font-semibold text-amber-700 hover:text-amber-800"
              href={`/opportunities/${opportunity.id}`}
            >
              Back to opportunity
            </Link>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Risk Register: {opportunity.name}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-600">
              Track project risks, mitigations, owners, next actions, and status. Severity is probability multiplied by impact.
            </p>
          </div>
          <form action={generateAction}>
            <button
              className="inline-flex h-10 items-center justify-center rounded-md bg-amber-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700"
              type="submit"
            >
              Generate Default Risks
            </button>
          </form>
        </div>

        <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Add Risk</h2>
          <form action={createAction} className="mt-4 grid gap-4">
            <RiskFields />
            <div className="flex justify-end">
              <button
                className="inline-flex h-10 items-center justify-center rounded-md bg-amber-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700"
                type="submit"
              >
                Add Risk
              </button>
            </div>
          </form>
        </section>

        <section className="grid gap-4">
          <div className="rounded-lg border border-zinc-200 bg-white px-5 py-4 shadow-sm">
            <h2 className="text-lg font-semibold">Existing Risks</h2>
            <p className="mt-1 text-sm text-zinc-600">
              {opportunity.risks.length} risk{opportunity.risks.length === 1 ? "" : "s"} sorted by severity.
            </p>
          </div>

          {opportunity.risks.length === 0 ? (
            <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-600 shadow-sm">
              No risks have been added yet.
            </div>
          ) : (
            opportunity.risks.map((risk) => {
              const updateAction = updateRisk.bind(null, opportunity.id, risk.id);
              const deleteAction = deleteRisk.bind(null, opportunity.id, risk.id);

              return (
                <article
                  className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm"
                  key={risk.id}
                >
                  <div className="flex flex-col gap-3 border-b border-zinc-200 pb-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-semibold text-zinc-700">
                          {risk.category}
                        </span>
                        <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-semibold text-zinc-700">
                          {risk.status}
                        </span>
                        <SeverityBadge severity={risk.severityScore} />
                      </div>
                      <p className="mt-3 text-sm font-semibold text-zinc-950">
                        {risk.riskDescription}
                      </p>
                      <p className="mt-2 text-sm text-zinc-600">
                        <span className="mr-2">Probability:</span>
                        <LevelBadge value={risk.probability} />
                        <span className="mx-2">Impact:</span>
                        <LevelBadge value={risk.impact} />
                      </p>
                    </div>
                    <form action={deleteAction}>
                      <button
                        className="inline-flex h-9 items-center justify-center rounded-md border border-red-200 px-3 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                        type="submit"
                      >
                        Delete
                      </button>
                    </form>
                  </div>

                  <form action={updateAction} className="mt-4 grid gap-4">
                    <RiskFields risk={risk} />
                    <div className="flex justify-end">
                      <button
                        className="inline-flex h-10 items-center justify-center rounded-md border border-amber-200 px-4 text-sm font-semibold text-amber-700 transition hover:bg-amber-50"
                        type="submit"
                      >
                        Save Risk
                      </button>
                    </div>
                  </form>
                </article>
              );
            })
          )}
        </section>
      </div>
    </main>
  );
}
