import { describe, expect, it } from "vitest";
import {
  calculateTotalScore,
  classifyOpportunity,
  clamp,
  scoreCommercialControl,
  scoreResourceQuality,
  suggestScores,
  type CategoryScores,
  type ScoringInput,
} from "./scoring";

function scores(value: number): CategoryScores {
  return {
    resourceQualityScore: value,
    infrastructureScore: value,
    marketDemandScore: value,
    technicalFeasibilityScore: value,
    commercialControlScore: value,
    regulatoryFeasibilityScore: value,
    economicPotentialScore: value,
    speedToExecuteScore: value,
    strategicRepeatabilityScore: value,
    counterpartySeriousnessScore: value,
  };
}

function opportunity(overrides: Partial<ScoringInput> = {}): ScoringInput {
  return {
    id: "opp_1",
    name: "Test",
    locationCountry: "USA",
    locationState: null,
    locationCity: null,
    latitude: null,
    longitude: null,
    assetType: "Stranded Gas",
    ownerName: null,
    operatorName: null,
    contactName: null,
    contactEmail: null,
    status: "New",
    description: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    resourceData: null,
    infrastructureData: null,
    commercialData: null,
    regulatoryData: null,
    ...overrides,
  };
}

describe("scoring", () => {
  it("clamps values between min and max", () => {
    expect(clamp(-5)).toBe(1);
    expect(clamp(5)).toBe(5);
    expect(clamp(20)).toBe(10);
    expect(clamp(20, 0, 5)).toBe(5);
  });

  it("normalizes category scores to a 100 point total", () => {
    expect(calculateTotalScore(scores(10))).toBe(100);
    expect(calculateTotalScore(scores(7.5))).toBe(75);
    expect(calculateTotalScore(scores(1))).toBe(10);
  });

  it("classifies score bands correctly", () => {
    expect(classifyOpportunity(100)).toBe("Priority");
    expect(classifyOpportunity(80)).toBe("Priority");
    expect(classifyOpportunity(79)).toBe("Develop");
    expect(classifyOpportunity(60)).toBe("Develop");
    expect(classifyOpportunity(59)).toBe("Watch");
    expect(classifyOpportunity(40)).toBe("Watch");
    expect(classifyOpportunity(39)).toBe("Reject");
  });

  it("resource quality improves with higher stable gas volume", () => {
    const low = scoreResourceQuality({
      id: "r1",
      opportunityId: "opp_1",
      availableGasMMscfd: 1,
      gasHeatingValueBtuScf: 1050,
      gasPressurePsig: null,
      gasTemperatureF: null,
      methanePercent: null,
      ethanePercent: null,
      propanePercent: null,
      co2Percent: null,
      h2sPpm: null,
      nitrogenPercent: null,
      liquidsContent: null,
      currentGasUse: null,
      currentGasPriceUsdMmbtu: null,
      flareStatus: null,
      shutInStatus: null,
      productionStability: "Stable",
      oilProductionBopd: null,
      waterProductionBwpd: null,
      waterCutPercent: null,
      notes: null,
    });
    const high = scoreResourceQuality({
      id: "r2",
      opportunityId: "opp_1",
      availableGasMMscfd: 10,
      gasHeatingValueBtuScf: 1050,
      gasPressurePsig: null,
      gasTemperatureF: null,
      methanePercent: null,
      ethanePercent: null,
      propanePercent: null,
      co2Percent: null,
      h2sPpm: null,
      nitrogenPercent: null,
      liquidsContent: null,
      currentGasUse: null,
      currentGasPriceUsdMmbtu: null,
      flareStatus: null,
      shutInStatus: null,
      productionStability: "Stable",
      oilProductionBopd: null,
      waterProductionBwpd: null,
      waterCutPercent: null,
      notes: null,
    });

    expect(high).toBeGreaterThan(low);
  });

  it("high H2S and CO2 reduce resource and technical attractiveness", () => {
    const clean = opportunity({
      resourceData: {
        id: "r1",
        opportunityId: "opp_1",
        availableGasMMscfd: 5,
        gasHeatingValueBtuScf: 1050,
        gasPressurePsig: null,
        gasTemperatureF: null,
        methanePercent: null,
        ethanePercent: null,
        propanePercent: null,
        co2Percent: 1,
        h2sPpm: 0,
        nitrogenPercent: null,
        liquidsContent: null,
        currentGasUse: null,
        currentGasPriceUsdMmbtu: null,
        flareStatus: null,
        shutInStatus: null,
        productionStability: "Stable",
        oilProductionBopd: null,
        waterProductionBwpd: null,
        waterCutPercent: null,
        notes: null,
      },
    });
    const sour = opportunity({
      resourceData: {
        ...clean.resourceData!,
        id: "r2",
        co2Percent: 12,
        h2sPpm: 250,
      },
    });

    expect(scoreResourceQuality(sour.resourceData)).toBeLessThan(
      scoreResourceQuality(clean.resourceData),
    );
    expect(suggestScores(sour).technicalFeasibilityScore).toBeLessThan(
      suggestScores(clean).technicalFeasibilityScore,
    );
  });

  it("missing commercial control reduces commercial score", () => {
    const missing = scoreCommercialControl(null);
    const controlled = scoreCommercialControl({
      id: "c1",
      opportunityId: "opp_1",
      gasOwnerKnown: true,
      landOwnerKnown: true,
      mineralRightsKnown: true,
      existingGasContract: true,
      existingPowerOfftaker: true,
      nearbyIndustrialOfftaker: true,
      interestedCounterparty: true,
      preferredCommercialModel: "PPA",
      targetPowerPriceUsdMwh: null,
      targetGasPriceUsdMmbtu: null,
      expectedCapacityFactorPercent: null,
      notes: null,
    });

    expect(controlled).toBeGreaterThan(missing);
  });
});

