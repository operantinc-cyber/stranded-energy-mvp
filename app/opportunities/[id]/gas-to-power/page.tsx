import Link from "next/link";
import { notFound } from "next/navigation";
import { saveGasToPowerResult } from "@/app/actions";
import { prisma } from "@/lib/db";
import {
  calculateGasToPower,
  type GasToPowerResult,
} from "@/lib/gasToPower";
import {
  formatMmbtu,
  formatMw,
  formatMwh,
  formatNumber,
  formatPercent,
} from "@/lib/format";

function Field({
  label,
  name,
  defaultValue,
  suffix,
  min,
  max,
}: {
  label: string;
  name: string;
  defaultValue: number;
  suffix?: string;
  min?: number;
  max?: number;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-zinc-700">
      {label}
      <div className="flex rounded-md border border-zinc-300 bg-white shadow-sm focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100">
        <input
          className="h-10 min-w-0 flex-1 rounded-md px-3 text-sm text-zinc-950 outline-none"
          defaultValue={defaultValue}
          max={max}
          min={min ?? 0}
          name={name}
          required
          step="any"
          type="number"
        />
        {suffix ? (
          <span className="flex items-center border-l border-zinc-200 px-3 text-xs font-semibold text-zinc-500">
            {suffix}
          </span>
        ) : null}
      </div>
    </label>
  );
}

function OutputCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-zinc-950">{value}</p>
    </div>
  );
}

function resultFromVolume(result: GasToPowerResult, multiplier: number) {
  return calculateGasToPower({
    availableGasMMscfd: result.availableGasMMscfd * multiplier,
    heatingValueBtuScf: result.heatingValueBtuScf,
    generatorHeatRateBtuKwh: result.generatorHeatRateBtuKwh,
    availabilityPercent: result.availabilityPercent,
    parasiticLoadPercent: result.parasiticLoadPercent,
  });
}

export default async function GasToPowerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const opportunity = await prisma.opportunity.findUnique({
    where: { id },
    include: {
      resourceData: true,
      gasToPowerResults: {
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

  const latestResult = opportunity.gasToPowerResults[0] ?? null;
  const assumptions = {
    availableGasMMscfd:
      latestResult?.availableGasMMscfd ??
      opportunity.resourceData?.availableGasMMscfd ??
      1,
    heatingValueBtuScf:
      latestResult?.heatingValueBtuScf ??
      opportunity.resourceData?.gasHeatingValueBtuScf ??
      1050,
    generatorHeatRateBtuKwh: latestResult?.generatorHeatRateBtuKwh ?? 8500,
    availabilityPercent: latestResult?.assumedAvailabilityPercent ?? 85,
    parasiticLoadPercent: latestResult?.parasiticLoadPercent ?? 5,
  };
  const calculated = calculateGasToPower(assumptions);
  const saveAction = saveGasToPowerResult.bind(null, opportunity.id);
  const sensitivities = [
    { label: "75% gas volume", multiplier: 0.75 },
    { label: "100% gas volume", multiplier: 1 },
    { label: "125% gas volume", multiplier: 1.25 },
  ].map((row) => ({
    ...row,
    result: resultFromVolume(calculated, row.multiplier),
  }));

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-8 text-zinc-950 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-6">
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link
              className="text-sm font-semibold text-blue-700 hover:text-blue-800"
              href={`/opportunities/${opportunity.id}`}
            >
              Back to opportunity
            </Link>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Gas-to-Power: {opportunity.name}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-600">
              Estimate power capacity from available gas and save a calculation snapshot.
            </p>
          </div>
          <Link
            className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
            href="/dashboard"
          >
            Dashboard
          </Link>
        </div>

        <form action={saveAction} className="grid gap-6">
          <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Inputs and Assumptions</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Field
                defaultValue={assumptions.availableGasMMscfd}
                label="Available Gas"
                min={0.000001}
                name="availableGasMMscfd"
                suffix="MMscfd"
              />
              <Field
                defaultValue={assumptions.heatingValueBtuScf}
                label="Heating Value"
                min={0.000001}
                name="heatingValueBtuScf"
                suffix="Btu/scf"
              />
              <Field
                defaultValue={assumptions.generatorHeatRateBtuKwh}
                label="Generator Heat Rate"
                min={0.000001}
                name="generatorHeatRateBtuKwh"
                suffix="Btu/kWh"
              />
              <Field
                defaultValue={assumptions.availabilityPercent}
                label={`Availability (${formatPercent(assumptions.availabilityPercent)})`}
                max={100}
                name="availabilityPercent"
                suffix="%"
              />
              <Field
                defaultValue={assumptions.parasiticLoadPercent}
                label={`Parasitic Load (${formatPercent(assumptions.parasiticLoadPercent)})`}
                max={50}
                name="parasiticLoadPercent"
                suffix="%"
              />
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <OutputCard
              label="Theoretical MW"
              value={formatMw(calculated.theoreticalMw)}
            />
            <OutputCard
              label="Practical MW Low"
              value={formatMw(calculated.practicalMwLow)}
            />
            <OutputCard
              label="Practical MW High"
              value={formatMw(calculated.practicalMwHigh)}
            />
            <OutputCard
              label="Recommended MW"
              value={formatMw(calculated.recommendedMw)}
            />
            <OutputCard
              label="Annual MWh"
              value={formatMwh(calculated.annualMwh)}
            />
            <OutputCard
              label="Fuel Energy MMBtu/day"
              value={`${formatMmbtu(calculated.fuelEnergyMmbtuDay)}/day`}
            />
            <OutputCard
              label="Fuel Energy MMBtu/year"
              value={`${formatMmbtu(calculated.fuelEnergyMmbtuYear)}/year`}
            />
            <OutputCard
              label="Last Saved"
              value={
                latestResult
                  ? formatMw(latestResult.recommendedMw)
                  : "None"
              }
            />
          </section>

          <section className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
            <div className="border-b border-zinc-200 px-5 py-4">
              <h2 className="text-lg font-semibold">Gas Volume Sensitivity</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-zinc-200 text-left text-sm">
                <thead className="bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-600">
                  <tr>
                    <th className="px-4 py-3">Case</th>
                    <th className="px-4 py-3">Gas Volume</th>
                    <th className="px-4 py-3">Theoretical MW</th>
                    <th className="px-4 py-3">Practical MW Low</th>
                    <th className="px-4 py-3">Practical MW High</th>
                    <th className="px-4 py-3">Recommended MW</th>
                    <th className="px-4 py-3">Annual MWh</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {sensitivities.map((row) => (
                    <tr key={row.label}>
                      <td className="px-4 py-3 font-medium text-zinc-950">{row.label}</td>
                      <td className="px-4 py-3 text-zinc-700">
                        {formatNumber(row.result.availableGasMMscfd, {
                          maximumFractionDigits: 2,
                        })} MMscfd
                      </td>
                      <td className="px-4 py-3 text-zinc-700">
                        {formatMw(row.result.theoreticalMw)}
                      </td>
                      <td className="px-4 py-3 text-zinc-700">
                        {formatMw(row.result.practicalMwLow)}
                      </td>
                      <td className="px-4 py-3 text-zinc-700">
                        {formatMw(row.result.practicalMwHigh)}
                      </td>
                      <td className="px-4 py-3 text-zinc-700">
                        {formatMw(row.result.recommendedMw)}
                      </td>
                      <td className="px-4 py-3 text-zinc-700">
                        {formatMwh(row.result.annualMwh)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-zinc-600">
              Saving creates a new gas-to-power result and updates Recommended MW on the dashboard.
            </p>
            <button
              className="inline-flex h-10 items-center justify-center rounded-md bg-blue-700 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
              type="submit"
            >
              Save Gas-to-Power Result
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
