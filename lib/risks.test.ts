import { describe, expect, it } from "vitest";
import {
  calculateSeverity,
  generateDefaultRisks,
  impactValue,
  probabilityValue,
  type RiskOpportunityInput,
} from "./risks";

function opportunity(overrides: Partial<RiskOpportunityInput> = {}): RiskOpportunityInput {
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

describe("risks", () => {
  it("maps probability and impact levels", () => {
    expect(probabilityValue("Low")).toBe(1);
    expect(probabilityValue("Medium")).toBe(2);
    expect(probabilityValue("High")).toBe(3);
    expect(impactValue("Low")).toBe(1);
    expect(impactValue("Medium")).toBe(2);
    expect(impactValue("High")).toBe(3);
  });

  it("calculates severity as probability times impact", () => {
    expect(calculateSeverity("Low", "High")).toBe(3);
    expect(calculateSeverity("Medium", "High")).toBe(6);
    expect(calculateSeverity("High", "High")).toBe(9);
  });

  it("generates default risks", () => {
    expect(generateDefaultRisks(opportunity()).length).toBeGreaterThan(0);
  });

  it("adds land risk when land is unavailable", () => {
    const risks = generateDefaultRisks(
      opportunity({
        infrastructureData: {
          id: "i1",
          opportunityId: "opp_1",
          distanceToPipelineMiles: null,
          distanceToPowerLineMiles: null,
          distanceToSubstationMiles: null,
          distanceToRoadMiles: null,
          distanceToFiberMiles: null,
          distanceToIndustrialLoadMiles: null,
          distanceToDataCenterMiles: null,
          landAvailable: false,
          landOwnershipKnown: false,
          waterAvailable: false,
          existingFacilities: false,
          existingPowerInfrastructure: false,
          existingGasProcessing: false,
          existingCompression: false,
          siteAccessQuality: null,
          notes: null,
        },
      }),
    );

    expect(risks.some((risk) => risk.riskDescription.includes("Land availability"))).toBe(true);
  });

  it("adds interconnection and country/security risks from regulatory data", () => {
    const risks = generateDefaultRisks(
      opportunity({
        regulatoryData: {
          id: "reg1",
          opportunityId: "opp_1",
          existingPermits: false,
          airPermitRequired: false,
          waterPermitRequired: false,
          landUseApprovalRequired: false,
          interconnectionRequired: true,
          environmentalIssuesKnown: false,
          communityIssuesKnown: false,
          securityIssuesKnown: true,
          permittingComplexity: null,
          expectedPermittingMonths: null,
          notes: null,
        },
      }),
    );

    expect(risks.some((risk) => risk.category === "Infrastructure")).toBe(true);
    expect(risks.some((risk) => risk.category === "Country/Security")).toBe(true);
  });
});

