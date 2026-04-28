import { describe, expect, it } from "vitest";
import {
  formatCurrency,
  formatDate,
  formatMmbtu,
  formatMw,
  formatMwh,
  formatNullable,
  formatPaybackYears,
  formatPercent,
  formatScore,
} from "./format";

describe("format helpers", () => {
  it("formats currency with sensible compact rounding and negative values", () => {
    expect(formatCurrency(1_400_000)).toBe("$1.4M");
    expect(formatCurrency(-1_400_000)).toBe("-$1.4M");
    expect(formatCurrency(null)).toBe("Not calculated");
  });

  it("formats energy and power units", () => {
    expect(formatMw(12.345)).toBe("12.3 MW");
    expect(formatMwh(12345.6)).toBe("12,346 MWh");
    expect(formatMmbtu(12345.6)).toBe("12,346 MMBtu");
    expect(formatMw(null)).toBe("Not calculated");
  });

  it("formats percentages, scores, dates, and payback", () => {
    expect(formatPercent(85)).toBe("85%");
    expect(formatScore(82.34)).toBe("82.3");
    expect(formatDate(new Date("2026-04-28T00:00:00Z"))).toContain("2026");
    expect(formatPaybackYears(4.567)).toBe("4.6 years");
    expect(formatPaybackYears(null)).toBe("Not meaningful");
  });

  it("formats nullable values", () => {
    expect(formatNullable(null)).toBe("Not provided");
    expect(formatNullable(5, (value) => `${value}x`)).toBe("5x");
  });
});
