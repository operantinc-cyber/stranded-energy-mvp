"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ChartPoint = Record<string, number | string | null>;

function ChartShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-zinc-950">{title}</h2>
      <div className="mt-4 h-72">{children}</div>
    </section>
  );
}

export function FinancialCharts({
  ebitdaByPowerPrice,
  paybackByCapex,
  revenueOpexEbitda,
  scenarioEbitda,
}: {
  ebitdaByPowerPrice: ChartPoint[];
  paybackByCapex: ChartPoint[];
  revenueOpexEbitda: ChartPoint[];
  scenarioEbitda: ChartPoint[];
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ChartShell title="Scenario EBITDA">
        <ResponsiveContainer height="100%" width="100%">
          <BarChart data={scenarioEbitda} margin={{ left: 12, right: 12 }}>
            <CartesianGrid stroke="#e4e4e7" strokeDasharray="3 3" />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="value" fill="#7c3aed" name="EBITDA" />
          </BarChart>
        </ResponsiveContainer>
      </ChartShell>

      <ChartShell title="EBITDA vs Power Price">
        <ResponsiveContainer height="100%" width="100%">
          <LineChart data={ebitdaByPowerPrice} margin={{ left: 12, right: 12 }}>
            <CartesianGrid stroke="#e4e4e7" strokeDasharray="3 3" />
            <XAxis dataKey="powerPrice" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line
              dataKey="ebitda"
              dot={false}
              name="EBITDA"
              stroke="#047857"
              strokeWidth={2}
              type="monotone"
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartShell>

      <ChartShell title="Payback vs Capex">
        <ResponsiveContainer height="100%" width="100%">
          <LineChart data={paybackByCapex} margin={{ left: 12, right: 12 }}>
            <CartesianGrid stroke="#e4e4e7" strokeDasharray="3 3" />
            <XAxis dataKey="capexPerKw" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line
              connectNulls={false}
              dataKey="payback"
              dot
              name="Payback"
              stroke="#1d4ed8"
              strokeWidth={2}
              type="monotone"
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartShell>

      <div className="lg:col-span-2">
        <ChartShell title="Revenue / Opex / EBITDA">
          <ResponsiveContainer height="100%" width="100%">
            <BarChart data={revenueOpexEbitda} margin={{ left: 12, right: 12 }}>
              <CartesianGrid stroke="#e4e4e7" strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#047857" name="USD" />
            </BarChart>
          </ResponsiveContainer>
        </ChartShell>
      </div>
    </div>
  );
}
