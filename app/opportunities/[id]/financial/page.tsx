import Link from "next/link";
import { notFound } from "next/navigation";
import { saveFinancialScreenResult } from "@/app/actions";
import { prisma } from "@/lib/db";
import {
  calculateFinancialScenarios,
  calculateFinancialScreen,
} from "@/lib/financial";
import {
  formatCurrency,
  formatMmbtu,
  formatMwh,
  formatPaybackYears,
} from "@/lib/format";
import { FinancialCharts } from "./charts";

function Field({
  label,
  name,
  defaultValue,
  suffix,
  min,
}: {
  label: string;
  name: string;
  defaultValue: number;
  suffix?: string;
  min?: number;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-zinc-700">
      {label}
      <div className="flex rounded-md border border-zinc-300 bg-white shadow-sm focus-within:border-violet-600 focus-within:ring-2 focus-within:ring-violet-100">
        <input
          className="h-10 min-w-0 flex-1 rounded-md px-3 text-sm text-zinc-950 outline-none"
          defaultValue={defaultValue}
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
  emphasis = "normal",
}: {
  label: string;
  value: string;
  emphasis?: "normal" | "negative";
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{label}</p>
      <p
        className={`mt-2 text-2xl font-semibold ${
          emphasis === "negative" ? "text-red-700" : "text-zinc-950"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export default async function FinancialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const opportunity = await prisma.opportunity.findUnique({
    where: { id },
    include: {
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

  if (!opportunity) {
    notFound();
  }

  const latestGasToPower = opportunity.gasToPowerResults[0] ?? null;
  const latestFinancial = opportunity.financialScreenResults[0] ?? null;
  const savedAnnualFuelMmbtu =
    latestFinancial && latestFinancial.gasPriceUsdMmbtu > 0
      ? latestFinancial.annualFuelCost / latestFinancial.gasPriceUsdMmbtu
      : null;
  const useLatestGasToPower =
    latestGasToPower &&
    (!latestFinancial ||
      latestGasToPower.createdAt.getTime() >= latestFinancial.createdAt.getTime());
  const assumptions = {
    projectSizeMw: useLatestGasToPower
      ? latestGasToPower.recommendedMw
      : latestFinancial?.projectSizeMw ?? 1,
    annualMwh: useLatestGasToPower
      ? latestGasToPower.annualMwh
      : latestFinancial?.annualMwh ?? 1,
    powerPriceUsdMwh: latestFinancial?.powerPriceUsdMwh ?? 70,
    gasPriceUsdMmbtu: latestFinancial?.gasPriceUsdMmbtu ?? 2.5,
    annualFuelMmbtu:
      useLatestGasToPower
        ? latestGasToPower.fuelEnergyMmbtuYear
        : savedAnnualFuelMmbtu ?? 0,
    capexPerKwLow: latestFinancial?.capexPerKwLow ?? 1000,
    capexPerKwBase: latestFinancial?.capexPerKwBase ?? 1400,
    capexPerKwHigh: latestFinancial?.capexPerKwHigh ?? 1800,
    fixedOpexUsdKwYear: latestFinancial?.fixedOpexUsdKwYear ?? 25,
    variableOpexUsdMwh: latestFinancial?.variableOpexUsdMwh ?? 5,
  };
  const result = calculateFinancialScreen(assumptions);
  const scenarios = calculateFinancialScenarios(assumptions);
  const saveAction = saveFinancialScreenResult.bind(null, opportunity.id);
  const ebitdaByPowerPrice = [50, 60, 70, 80, 90, 100].map((powerPrice) => ({
    powerPrice,
    ebitda: Math.round(
      calculateFinancialScreen({
        ...assumptions,
        powerPriceUsdMwh: powerPrice,
      }).ebitda,
    ),
  }));
  const paybackByCapex = [
    assumptions.capexPerKwLow,
    assumptions.capexPerKwBase,
    assumptions.capexPerKwHigh,
  ].map((capexPerKw) => ({
    capexPerKw,
    payback:
      calculateFinancialScreen({
        ...assumptions,
        capexPerKwBase: capexPerKw,
      }).simplePaybackYears ?? null,
  }));
  const revenueOpexEbitda = [
    { label: "Revenue", value: Math.round(result.annualRevenue) },
    { label: "Opex", value: Math.round(result.totalAnnualOpex) },
    { label: "EBITDA", value: Math.round(result.ebitda) },
  ];
  const scenarioEbitda = scenarios.map((scenario) => ({
    label: scenario.name,
    value: Math.round(scenario.ebitda),
  }));

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-8 text-zinc-950 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-6">
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link
              className="text-sm font-semibold text-violet-700 hover:text-violet-800"
              href={`/opportunities/${opportunity.id}`}
            >
              Back to opportunity
            </Link>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Financial Screen: {opportunity.name}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-600">
              Run a simple revenue, capex, opex, EBITDA, and payback screen from the latest gas-to-power result.
            </p>
          </div>
          <Link
            className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
            href="/dashboard"
          >
            Dashboard
          </Link>
        </div>

        {!latestGasToPower ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            No gas-to-power result exists yet. Defaults are shown, but the financial screen is most useful after running Gas-to-Power.
          </div>
        ) : null}

        <form action={saveAction} className="grid gap-6">
          <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Inputs and Assumptions</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Field defaultValue={assumptions.projectSizeMw} label="Project Size" min={0.000001} name="projectSizeMw" suffix="MW" />
              <Field defaultValue={assumptions.annualMwh} label="Annual Energy" min={0.000001} name="annualMwh" suffix="MWh" />
              <Field defaultValue={assumptions.powerPriceUsdMwh} label="Power Price" name="powerPriceUsdMwh" suffix="$/MWh" />
              <Field defaultValue={assumptions.gasPriceUsdMmbtu} label="Gas Price" name="gasPriceUsdMmbtu" suffix="$/MMBtu" />
              <Field defaultValue={assumptions.annualFuelMmbtu} label="Annual Fuel" name="annualFuelMmbtu" suffix="MMBtu" />
              <Field defaultValue={assumptions.capexPerKwLow} label="Capex Low" name="capexPerKwLow" suffix="$/kW" />
              <Field defaultValue={assumptions.capexPerKwBase} label="Capex Base" name="capexPerKwBase" suffix="$/kW" />
              <Field defaultValue={assumptions.capexPerKwHigh} label="Capex High" name="capexPerKwHigh" suffix="$/kW" />
              <Field defaultValue={assumptions.fixedOpexUsdKwYear} label="Fixed Opex" name="fixedOpexUsdKwYear" suffix="$/kW-yr" />
              <Field defaultValue={assumptions.variableOpexUsdMwh} label="Variable Opex" name="variableOpexUsdMwh" suffix="$/MWh" />
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <OutputCard label="Total Capex Low" value={formatCurrency(result.totalCapexLow)} />
            <OutputCard label="Total Capex Base" value={formatCurrency(result.totalCapexBase)} />
            <OutputCard label="Total Capex High" value={formatCurrency(result.totalCapexHigh)} />
            <OutputCard label="Annual Revenue" value={formatCurrency(result.annualRevenue)} />
            <OutputCard label="Annual Fuel Cost" value={formatCurrency(result.annualFuelCost)} />
            <OutputCard label="Annual Fixed Opex" value={formatCurrency(result.annualFixedOpex)} />
            <OutputCard label="Annual Variable Opex" value={formatCurrency(result.annualVariableOpex)} />
            <OutputCard label="Total Annual Opex" value={formatCurrency(result.totalAnnualOpex)} />
            <OutputCard
              emphasis={result.ebitda < 0 ? "negative" : "normal"}
              label="EBITDA"
              value={formatCurrency(result.ebitda)}
            />
            <OutputCard
              label="Simple Payback"
              value={formatPaybackYears(result.simplePaybackYears)}
            />
            <OutputCard
              label="Break-even Power Price"
              value={`${formatCurrency(result.breakEvenPowerPrice, {
                compact: false,
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              })}/MWh`}
            />
            <OutputCard
              label="Last Saved EBITDA"
              value={latestFinancial ? formatCurrency(latestFinancial.ebitda) : "None"}
            />
          </section>

          <section className="rounded-lg border border-zinc-200 bg-white p-4 text-sm text-zinc-700 shadow-sm">
            <span className="font-semibold text-zinc-950">Screening basis:</span>{" "}
            {formatMwh(assumptions.annualMwh)} and{" "}
            {formatMmbtu(assumptions.annualFuelMmbtu)} annual fuel.
          </section>

          <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <div>
              <h2 className="text-lg font-semibold">Scenario Comparison</h2>
              <p className="mt-1 text-sm text-zinc-600">
                Low, base, and high cases are derived from the current assumptions and are not saved separately.
              </p>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full divide-y divide-zinc-200 text-sm">
                <thead className="bg-zinc-50 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  <tr>
                    <th className="px-3 py-3">Case</th>
                    <th className="px-3 py-3">Power Price</th>
                    <th className="px-3 py-3">Annual MWh</th>
                    <th className="px-3 py-3">Gas Price</th>
                    <th className="px-3 py-3">Base Capex</th>
                    <th className="px-3 py-3">Revenue</th>
                    <th className="px-3 py-3">Opex</th>
                    <th className="px-3 py-3">EBITDA</th>
                    <th className="px-3 py-3">Payback</th>
                    <th className="px-3 py-3">Break-even Power Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {scenarios.map((scenario) => (
                    <tr key={scenario.name}>
                      <td className="whitespace-nowrap px-3 py-3 font-semibold text-zinc-950">
                        {scenario.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-zinc-700">
                        {formatCurrency(scenario.powerPriceUsdMwh, {
                          compact: false,
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                        /MWh
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-zinc-700">
                        {formatMwh(scenario.annualMwh)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-zinc-700">
                        {formatCurrency(scenario.gasPriceUsdMmbtu, {
                          compact: false,
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                        /MMBtu
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-zinc-700">
                        {formatCurrency(scenario.totalCapexBase)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-zinc-700">
                        {formatCurrency(scenario.annualRevenue)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-zinc-700">
                        {formatCurrency(scenario.totalAnnualOpex)}
                      </td>
                      <td
                        className={`whitespace-nowrap px-3 py-3 font-semibold ${
                          scenario.ebitda < 0 ? "text-red-700" : "text-zinc-950"
                        }`}
                      >
                        {formatCurrency(scenario.ebitda)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-zinc-700">
                        {formatPaybackYears(scenario.simplePaybackYears)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-zinc-700">
                        {formatCurrency(scenario.breakEvenPowerPrice, {
                          compact: false,
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                        /MWh
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <FinancialCharts
            ebitdaByPowerPrice={ebitdaByPowerPrice}
            paybackByCapex={paybackByCapex}
            revenueOpexEbitda={revenueOpexEbitda}
            scenarioEbitda={scenarioEbitda}
          />

          <div className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-zinc-600">
              Saving creates a financial screen result and updates base capex and EBITDA on the dashboard.
            </p>
            <button
              className="inline-flex h-10 items-center justify-center rounded-md bg-violet-700 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-800"
              type="submit"
            >
              Save Financial Screen
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
