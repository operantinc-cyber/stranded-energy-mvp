import { describe, expect, it } from "vitest";
import {
  calculateGasToPower,
  normalizeGasToPowerInputs,
} from "./gasToPower";

describe("gasToPower", () => {
  it("applies default assumptions", () => {
    expect(normalizeGasToPowerInputs({ availableGasMMscfd: 2 })).toEqual({
      availableGasMMscfd: 2,
      heatingValueBtuScf: 1050,
      generatorHeatRateBtuKwh: 8500,
      availabilityPercent: 85,
      parasiticLoadPercent: 5,
    });
  });

  it("calculates plausible MW results for 5 MMscfd", () => {
    const result = calculateGasToPower({
      availableGasMMscfd: 5,
      heatingValueBtuScf: 1050,
      generatorHeatRateBtuKwh: 8500,
    });

    expect(result.theoreticalMw).toBeGreaterThan(20);
    expect(result.theoreticalMw).toBeLessThan(30);
    expect(result.practicalMwLow).toBeLessThan(result.recommendedMw);
    expect(result.recommendedMw).toBeLessThan(result.practicalMwHigh);
  });

  it("uses recommended MW, 8760 hours, and availability for annual MWh", () => {
    const result = calculateGasToPower({
      availableGasMMscfd: 5,
      availabilityPercent: 80,
    });

    expect(result.annualMwh).toBeCloseTo(result.recommendedMw * 8760 * 0.8, 6);
  });

  it("rejects invalid gas volume", () => {
    expect(() => calculateGasToPower({ availableGasMMscfd: 0 })).toThrow(
      /availableGasMMscfd/,
    );
  });

  it("rejects invalid heat rate", () => {
    expect(() =>
      calculateGasToPower({
        availableGasMMscfd: 1,
        generatorHeatRateBtuKwh: 0,
      }),
    ).toThrow(/generatorHeatRateBtuKwh/);
  });

  it("rejects invalid availability and parasitic load", () => {
    expect(() =>
      calculateGasToPower({ availableGasMMscfd: 1, availabilityPercent: 101 }),
    ).toThrow(/availabilityPercent/);

    expect(() =>
      calculateGasToPower({ availableGasMMscfd: 1, parasiticLoadPercent: 60 }),
    ).toThrow(/parasiticLoadPercent/);
  });
});

