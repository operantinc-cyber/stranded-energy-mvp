import { describe, expect, it } from "vitest";
import { compareMonetizationOptions, type MonetizationInput } from "./monetization";

function optionScore(input: MonetizationInput, name: string) {
  const option = compareMonetizationOptions(input).find(
    (candidate) => candidate.name === name,
  );

  if (!option) {
    throw new Error(`Missing option ${name}`);
  }

  return option.score;
}

function opportunity(overrides: Partial<MonetizationInput> = {}): MonetizationInput {
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

function resource(availableGasMMscfd: number) {
  return {
    id: "r1",
    opportunityId: "opp_1",
    availableGasMMscfd,
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
    productionStability: null,
    oilProductionBopd: null,
    waterProductionBwpd: null,
    waterCutPercent: null,
    notes: null,
  };
}

function infrastructure(overrides = {}) {
  return {
    id: "i1",
    opportunityId: "opp_1",
    distanceToPipelineMiles: null,
    distanceToPowerLineMiles: null,
    distanceToSubstationMiles: null,
    distanceToRoadMiles: null,
    distanceToFiberMiles: null,
    distanceToIndustrialLoadMiles: null,
    distanceToDataCenterMiles: null,
    landAvailable: true,
    landOwnershipKnown: false,
    waterAvailable: false,
    existingFacilities: false,
    existingPowerInfrastructure: false,
    existingGasProcessing: false,
    existingCompression: false,
    siteAccessQuality: null,
    notes: null,
    ...overrides,
  };
}

function commercial(overrides = {}) {
  return {
    id: "c1",
    opportunityId: "opp_1",
    gasOwnerKnown: false,
    landOwnerKnown: false,
    mineralRightsKnown: false,
    existingGasContract: false,
    existingPowerOfftaker: false,
    nearbyIndustrialOfftaker: false,
    interestedCounterparty: false,
    preferredCommercialModel: null,
    targetPowerPriceUsdMwh: null,
    targetGasPriceUsdMmbtu: null,
    expectedCapacityFactorPercent: null,
    notes: null,
    ...overrides,
  };
}

describe("monetization", () => {
  it("improves gas-to-power when gas volume is at least 2 MMscfd", () => {
    const low = optionScore(opportunity({ resourceData: resource(1) }), "Gas-to-Power");
    const supported = optionScore(
      opportunity({ resourceData: resource(2) }),
      "Gas-to-Power",
    );

    expect(supported).toBeGreaterThan(low);
  });

  it("improves data center power when gas volume is at least 5 MMscfd", () => {
    const low = optionScore(opportunity({ resourceData: resource(2) }), "Data Center Power");
    const high = optionScore(opportunity({ resourceData: resource(5) }), "Data Center Power");

    expect(high).toBeGreaterThan(low);
  });

  it("improves pipeline tie-in when pipeline distance is under 5 miles", () => {
    const far = optionScore(
      opportunity({ infrastructureData: infrastructure({ distanceToPipelineMiles: 10 }) }),
      "Pipeline Tie-In",
    );
    const near = optionScore(
      opportunity({ infrastructureData: infrastructure({ distanceToPipelineMiles: 4 }) }),
      "Pipeline Tie-In",
    );

    expect(near).toBeGreaterThan(far);
  });

  it("improves onsite industrial power when nearby industrial offtaker exists", () => {
    const none = optionScore(
      opportunity({ commercialData: commercial({ nearbyIndustrialOfftaker: false }) }),
      "Onsite Industrial Power",
    );
    const nearby = optionScore(
      opportunity({ commercialData: commercial({ nearbyIndustrialOfftaker: true }) }),
      "Onsite Industrial Power",
    );

    expect(nearby).toBeGreaterThan(none);
  });

  it("improves EPF redevelopment for marginal oilfields", () => {
    const stranded = optionScore(opportunity({ assetType: "Stranded Gas" }), "EPF/Marginal Field Redevelopment");
    const marginal = optionScore(opportunity({ assetType: "Marginal Oilfield" }), "EPF/Marginal Field Redevelopment");

    expect(marginal).toBeGreaterThan(stranded);
  });

  it("reduces build-heavy options when land is unavailable", () => {
    const withLand = optionScore(
      opportunity({ infrastructureData: infrastructure({ landAvailable: true }) }),
      "Gas-to-Power",
    );
    const withoutLand = optionScore(
      opportunity({ infrastructureData: infrastructure({ landAvailable: false }) }),
      "Gas-to-Power",
    );

    expect(withoutLand).toBeLessThan(withLand);
  });
});

