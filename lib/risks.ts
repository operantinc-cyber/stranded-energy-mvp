import type {
  CommercialData,
  InfrastructureData,
  Opportunity,
  RegulatoryData,
  ResourceData,
} from "@prisma/client";

export const riskCategories = [
  "Resource",
  "Technical",
  "Commercial",
  "Regulatory",
  "Land",
  "Infrastructure",
  "Market",
  "Financing",
  "Execution",
  "Country/Security",
  "Environmental/Social",
  "Counterparty",
] as const;

export const riskStatuses = ["Open", "Mitigating", "Closed", "Accepted"] as const;
export const probabilityLevels = ["Low", "Medium", "High"] as const;
export const impactLevels = ["Low", "Medium", "High"] as const;

export type RiskCategory = (typeof riskCategories)[number];
export type RiskStatus = (typeof riskStatuses)[number];
export type RiskLevel = (typeof probabilityLevels)[number];

export type RiskTemplate = {
  category: RiskCategory;
  riskDescription: string;
  probability: RiskLevel;
  impact: RiskLevel;
  mitigation: string;
  owner?: string | null;
  nextAction?: string | null;
  status?: RiskStatus;
};

export type RiskOpportunityInput = Opportunity & {
  resourceData: ResourceData | null;
  infrastructureData: InfrastructureData | null;
  commercialData: CommercialData | null;
  regulatoryData: RegulatoryData | null;
};

export function probabilityValue(probability: string) {
  if (probability === "High") {
    return 3;
  }

  if (probability === "Medium") {
    return 2;
  }

  return 1;
}

export function impactValue(impact: string) {
  if (impact === "High") {
    return 3;
  }

  if (impact === "Medium") {
    return 2;
  }

  return 1;
}

export function calculateSeverity(probability: string, impact: string) {
  return probabilityValue(probability) * impactValue(impact);
}

function withSeverity(template: RiskTemplate) {
  return {
    ...template,
    status: template.status ?? "Open",
    owner: template.owner ?? null,
    nextAction: template.nextAction ?? null,
    severityScore: calculateSeverity(template.probability, template.impact),
  };
}

export function generateDefaultRisks(opportunity: RiskOpportunityInput) {
  const resource = opportunity.resourceData;
  const infrastructure = opportunity.infrastructureData;
  const commercial = opportunity.commercialData;
  const regulatory = opportunity.regulatoryData;

  const templates: RiskTemplate[] = [
    {
      category: "Resource",
      riskDescription: "Gas volume uncertainty could reduce viable project size.",
      probability: resource?.availableGasMMscfd ? "Medium" : "High",
      impact: "High",
      mitigation: "Confirm flow history, decline profile, and deliverability with operator data.",
      nextAction: "Request production and flare data package.",
    },
    {
      category: "Resource",
      riskDescription: "Gas composition uncertainty could affect equipment selection and performance.",
      probability: resource?.gasHeatingValueBtuScf ? "Medium" : "High",
      impact: "Medium",
      mitigation: "Obtain recent gas chromatograph and confirm fuel treatment requirements.",
      nextAction: "Request gas analysis.",
    },
    {
      category: "Technical",
      riskDescription: "H2S/CO2 treatment requirement may increase capex, opex, and schedule.",
      probability:
        (resource?.h2sPpm ?? 0) > 100 || (resource?.co2Percent ?? 0) > 8
          ? "High"
          : "Medium",
      impact: "High",
      mitigation: "Screen treating package requirements and vendor availability early.",
      nextAction: "Confirm contaminant levels and treatment design basis.",
    },
    {
      category: "Commercial",
      riskDescription: "No bankable offtake could prevent financing or final investment decision.",
      probability: commercial?.existingPowerOfftaker ? "Low" : "High",
      impact: "High",
      mitigation: "Develop offtake shortlist and validate credit support requirements.",
      nextAction: "Identify priority offtake counterparties.",
    },
    {
      category: "Land",
      riskDescription: "Land rights unclear may delay site control and construction access.",
      probability: commercial?.landOwnerKnown ? "Medium" : "High",
      impact: "High",
      mitigation: "Confirm surface ownership, lease path, and access easements.",
      nextAction: "Begin land title and ownership review.",
    },
    {
      category: "Regulatory",
      riskDescription: "Air permit delay could extend development schedule.",
      probability: regulatory?.airPermitRequired ? "High" : "Medium",
      impact: "Medium",
      mitigation: "Engage local permitting advisor and map emissions thresholds.",
      nextAction: "Confirm permitting pathway.",
    },
    {
      category: "Infrastructure",
      riskDescription: "Interconnection uncertainty could constrain export or onsite load strategy.",
      probability: regulatory?.interconnectionRequired ? "High" : "Medium",
      impact: "High",
      mitigation: "Validate interconnection process, queue timing, and alternatives.",
      nextAction: "Contact utility or interconnection advisor.",
    },
    {
      category: "Execution",
      riskDescription: "Equipment lead time could delay deployment.",
      probability: "Medium",
      impact: "Medium",
      mitigation: "Pre-screen modular generation vendors and delivery slots.",
      nextAction: "Request budgetary quotes and lead times.",
    },
    {
      category: "Financing",
      riskDescription: "Capex escalation could erode returns and delay approval.",
      probability: "Medium",
      impact: "High",
      mitigation: "Maintain low/base/high capex cases and refresh vendor quotes.",
      nextAction: "Benchmark capex assumptions.",
    },
    {
      category: "Counterparty",
      riskDescription: "Counterparty credit weakness may limit bankability.",
      probability: commercial?.interestedCounterparty ? "Medium" : "High",
      impact: "High",
      mitigation: "Assess counterparty financials, credit support, and payment security.",
      nextAction: "Request counterparty profile.",
    },
    {
      category: "Environmental/Social",
      riskDescription: "Community opposition could delay permits or site access.",
      probability: regulatory?.communityIssuesKnown ? "High" : "Medium",
      impact: "Medium",
      mitigation: "Map stakeholders and prepare local engagement plan.",
      nextAction: "Identify community stakeholders.",
    },
    {
      category: "Market",
      riskDescription: "Power price volatility could reduce project economics.",
      probability: "Medium",
      impact: "High",
      mitigation: "Use contracted offtake, floors, or hedging where feasible.",
      nextAction: "Run sensitivity cases around power price.",
    },
  ];

  if ((resource?.h2sPpm ?? 0) > 100) {
    templates.push({
      category: "Technical",
      riskDescription: `High H2S level (${resource?.h2sPpm} ppm) may require dedicated treatment and safety controls.`,
      probability: "High",
      impact: "High",
      mitigation: "Confirm H2S specification, safety systems, and treating cost.",
      nextAction: "Request sour gas treatment quote.",
    });
  }

  if ((resource?.co2Percent ?? 0) > 8) {
    templates.push({
      category: "Environmental/Social",
      riskDescription: `High CO2 content (${resource?.co2Percent}%) may create treatment, emissions, or permitting burden.`,
      probability: "High",
      impact: "Medium",
      mitigation: "Confirm emissions basis and CO2 handling requirements.",
      nextAction: "Review emissions implications.",
    });
  }

  if (infrastructure?.landAvailable === false) {
    templates.push({
      category: "Land",
      riskDescription: "Land availability is not confirmed for project siting.",
      probability: "High",
      impact: "High",
      mitigation: "Identify alternate sites and confirm surface access rights.",
      nextAction: "Build site control plan.",
    });
  }

  if (regulatory?.interconnectionRequired) {
    templates.push({
      category: "Infrastructure",
      riskDescription: "Interconnection approval is required and may affect schedule or project size.",
      probability: "High",
      impact: "High",
      mitigation: "Start interconnection study and evaluate behind-the-meter alternatives.",
      nextAction: "Define interconnection application requirements.",
    });
  }

  if (regulatory?.securityIssuesKnown) {
    templates.push({
      category: "Country/Security",
      riskDescription: "Known security issues could affect construction, operations, or personnel safety.",
      probability: "High",
      impact: "High",
      mitigation: "Prepare country/security plan and assess local operating partners.",
      nextAction: "Request security assessment.",
    });
  }

  return templates.map(withSeverity);
}

