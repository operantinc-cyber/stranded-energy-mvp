import Link from "next/link";
import { notFound } from "next/navigation";
import { saveFinancialScreenResult } from "@/app/actions";
import { prisma } from "@/lib/db";
import { calculateFinancialScreen } from "@/lib/financial";
import { FinancialCharts } from "./charts";

function money(value: number, digits = 1) {
  const abs = Math.abs(value);
  const prefix = value < 0 ? "-$" : "$";

  if (abs >= 1_000_000) {
    return `${prefix}${(abs / 1_000_000).toFixed(digits)}M`;
  }

  if (abs >= 1_000) {
    return `${prefix}${(abs / 1_000).toFixed(digits)}K`;
  }

  return `${prefix}${abs.toFixed(0)}`;
}

function number(value: number, digits = 1) {
  return new Intl.NumberFormat("en", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value);
}

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
  const assumptions = {
    projectSizeMw:
      latestFinancial?.projectSizeMw ?? latestGasToPower?.recommendedMw ?? 1,
    annualMwh: latestFinancial?.annualMwh ?? latestGasToPower?.annualMwh ?? 1,
    powerPriceUsdMwh: latestFinancial?.powerPriceUsdMwh ?? 70,
    gasPriceUsdMmbtu: latestFinancial?.gasPriceUsdMmbtu ?? 2.5,
    annualFuelMmbtu:
      savedAnnualFuelMmbtu ?? latestGasToPower?.fuelEnergyMmbtuYear ?? 0,
    capexPerKwLow: latestFinancial?.capexPerKwLow ?? 1000,
    capexPerKwBase: latestFinancial?.capexPerKwBase ?? 1400,
    capexPerKwHigh: latestFinancial?.capexPerKwHigh ?? 1800,
    fixedOpexUsdKwYear: latestFinancial?.fixedOpexUsdKwYear ?? 25,
    variableOpexUsdMwh: latestFinancial?.variableOpexUsdMwh ?? 5,
  };
  const result = calculateFinancialScreen(assumptions);
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
            href="/"
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
            <OutputCard label="Total Capex Low" value={money(result.totalCapexLow)} />
            <OutputCard label="Total Capex Base" value={money(result.totalCapexBase)} />
            <OutputCard label="Total Capex High" value={money(result.totalCapexHigh)} />
            <OutputCard label="Annual Revenue" value={money(result.annualRevenue)} />
            <OutputCard label="Annual Fuel Cost" value={money(result.annualFuelCost)} />
            <OutputCard label="Annual Fixed Opex" value={money(result.annualFixedOpex)} />
            <OutputCard label="Annual Variable Opex" value={money(result.annualVariableOpex)} />
            <OutputCard label="Total Annual Opex" value={money(result.totalAnnualOpex)} />
            <OutputCard label="EBITDA" value={money(result.ebitda)} />
            <OutputCard
              label="Simple Payback"
              value={
                result.simplePaybackYears == null
                  ? "N/A"
                  : `${number(result.simplePaybackYears, 1)} yrs`
              }
            />
            <OutputCard
              label="Break-even Power Price"
              value={`$${number(result.breakEvenPowerPrice, 2)}/MWh`}
            />
            <OutputCard
              label="Last Saved EBITDA"
              value={latestFinancial ? money(latestFinancial.ebitda) : "None"}
            />
          </section>

          <FinancialCharts
            ebitdaByPowerPrice={ebitdaByPowerPrice}
            paybackByCapex={paybackByCapex}
            revenueOpexEbitda={revenueOpexEbitda}
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
