import { describe, expect, it } from "vitest";
import { calculateFinancialScreen } from "./financial";

describe("financial", () => {
  it("calculates capex, revenue, opex, EBITDA, payback, and break-even price", () => {
    const result = calculateFinancialScreen({
      projectSizeMw: 10,
      annualMwh: 70_000,
      powerPriceUsdMwh: 70,
      gasPriceUsdMmbtu: 2.5,
      annualFuelMmbtu: 500_000,
      capexPerKwLow: 1000,
      capexPerKwBase: 1400,
      capexPerKwHigh: 1800,
      fixedOpexUsdKwYear: 25,
      variableOpexUsdMwh: 5,
    });

    expect(result.projectSizeKw).toBe(10_000);
    expect(result.totalCapexLow).toBe(10_000_000);
    expect(result.totalCapexBase).toBe(14_000_000);
    expect(result.totalCapexHigh).toBe(18_000_000);
    expect(result.annualRevenue).toBe(4_900_000);
    expect(result.annualFuelCost).toBe(1_250_000);
    expect(result.annualFixedOpex).toBe(250_000);
    expect(result.annualVariableOpex).toBe(350_000);
    expect(result.totalAnnualOpex).toBe(1_850_000);
    expect(result.ebitda).toBe(3_050_000);
    expect(result.simplePaybackYears).toBeCloseTo(14_000_000 / 3_050_000, 6);
    expect(result.breakEvenPowerPrice).toBeCloseTo(1_850_000 / 70_000, 6);
  });

  it("sets payback to null when EBITDA is zero or negative", () => {
    const zero = calculateFinancialScreen({
      projectSizeMw: 1,
      annualMwh: 100,
      powerPriceUsdMwh: 10,
      gasPriceUsdMmbtu: 1,
      annualFuelMmbtu: 1000,
      fixedOpexUsdKwYear: 0,
      variableOpexUsdMwh: 0,
    });
    const negative = calculateFinancialScreen({
      projectSizeMw: 1,
      annualMwh: 100,
      powerPriceUsdMwh: 5,
      gasPriceUsdMmbtu: 1,
      annualFuelMmbtu: 1000,
      fixedOpexUsdKwYear: 0,
      variableOpexUsdMwh: 0,
    });

    expect(zero.ebitda).toBe(0);
    expect(zero.simplePaybackYears).toBeNull();
    expect(negative.ebitda).toBeLessThan(0);
    expect(negative.simplePaybackYears).toBeNull();
  });
});

