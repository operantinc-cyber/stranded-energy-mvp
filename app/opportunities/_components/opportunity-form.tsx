import type {
  CommercialData,
  InfrastructureData,
  Opportunity,
  RegulatoryData,
  ResourceData,
} from "@prisma/client";
import Link from "next/link";

export type OpportunityWithData = Opportunity & {
  resourceData: ResourceData | null;
  infrastructureData: InfrastructureData | null;
  commercialData: CommercialData | null;
  regulatoryData: RegulatoryData | null;
};

type OpportunityFormProps = {
  action: (formData: FormData) => Promise<void>;
  opportunity?: OpportunityWithData;
  submitLabel: string;
};

function value(value: string | number | null | undefined) {
  return value ?? "";
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string | number | null;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-zinc-700">
      {label}
      <input
        className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 shadow-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
        name={name}
        type={type}
        step={type === "number" ? "any" : undefined}
        required={required}
        defaultValue={value(defaultValue)}
      />
    </label>
  );
}

function TextArea({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-zinc-700 md:col-span-2">
      {label}
      <textarea
        className="min-h-24 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
        name={name}
        defaultValue={value(defaultValue)}
      />
    </label>
  );
}

function Checkbox({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-700">
      <input
        className="size-4 rounded border-zinc-300 text-emerald-700 focus:ring-emerald-600"
        name={name}
        type="checkbox"
        defaultChecked={defaultChecked}
      />
      {label}
    </label>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-zinc-950">{title}</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

export function OpportunityForm({
  action,
  opportunity,
  submitLabel,
}: OpportunityFormProps) {
  const resource = opportunity?.resourceData;
  const infrastructure = opportunity?.infrastructureData;
  const commercial = opportunity?.commercialData;
  const regulatory = opportunity?.regulatoryData;

  return (
    <form action={action} className="grid gap-5">
      <Section title="Opportunity">
        <Field label="Name" name="name" required defaultValue={opportunity?.name} />
        <Field
          label="Asset Type"
          name="assetType"
          required
          defaultValue={opportunity?.assetType}
        />
        <Field label="Status" name="status" defaultValue={opportunity?.status ?? "New"} />
        <Field
          label="Country"
          name="locationCountry"
          defaultValue={opportunity?.locationCountry}
        />
        <Field
          label="State / Region"
          name="locationState"
          defaultValue={opportunity?.locationState}
        />
        <Field label="City / Area" name="locationCity" defaultValue={opportunity?.locationCity} />
        <Field label="Latitude" name="latitude" type="number" defaultValue={opportunity?.latitude} />
        <Field
          label="Longitude"
          name="longitude"
          type="number"
          defaultValue={opportunity?.longitude}
        />
        <Field label="Owner Name" name="ownerName" defaultValue={opportunity?.ownerName} />
        <Field label="Operator Name" name="operatorName" defaultValue={opportunity?.operatorName} />
        <Field label="Contact Name" name="contactName" defaultValue={opportunity?.contactName} />
        <Field label="Contact Email" name="contactEmail" type="email" defaultValue={opportunity?.contactEmail} />
        <TextArea label="Description" name="description" defaultValue={opportunity?.description} />
      </Section>

      <Section title="Resource Data">
        <Field label="Available Gas (MMscfd)" name="availableGasMMscfd" type="number" defaultValue={resource?.availableGasMMscfd} />
        <Field label="Heating Value (Btu/scf)" name="gasHeatingValueBtuScf" type="number" defaultValue={resource?.gasHeatingValueBtuScf} />
        <Field label="Gas Pressure (psig)" name="gasPressurePsig" type="number" defaultValue={resource?.gasPressurePsig} />
        <Field label="Gas Temperature (F)" name="gasTemperatureF" type="number" defaultValue={resource?.gasTemperatureF} />
        <Field label="Methane (%)" name="methanePercent" type="number" defaultValue={resource?.methanePercent} />
        <Field label="Ethane (%)" name="ethanePercent" type="number" defaultValue={resource?.ethanePercent} />
        <Field label="Propane (%)" name="propanePercent" type="number" defaultValue={resource?.propanePercent} />
        <Field label="CO2 (%)" name="co2Percent" type="number" defaultValue={resource?.co2Percent} />
        <Field label="H2S (ppm)" name="h2sPpm" type="number" defaultValue={resource?.h2sPpm} />
        <Field label="Nitrogen (%)" name="nitrogenPercent" type="number" defaultValue={resource?.nitrogenPercent} />
        <Field label="Liquids Content" name="liquidsContent" defaultValue={resource?.liquidsContent} />
        <Field label="Current Gas Use" name="currentGasUse" defaultValue={resource?.currentGasUse} />
        <Field label="Current Gas Price ($/MMBtu)" name="currentGasPriceUsdMmbtu" type="number" defaultValue={resource?.currentGasPriceUsdMmbtu} />
        <Field label="Flare Status" name="flareStatus" defaultValue={resource?.flareStatus} />
        <Field label="Shut-in Status" name="shutInStatus" defaultValue={resource?.shutInStatus} />
        <Field label="Production Stability" name="productionStability" defaultValue={resource?.productionStability} />
        <Field label="Oil Production (bopd)" name="oilProductionBopd" type="number" defaultValue={resource?.oilProductionBopd} />
        <Field label="Water Production (bwpd)" name="waterProductionBwpd" type="number" defaultValue={resource?.waterProductionBwpd} />
        <Field label="Water Cut (%)" name="waterCutPercent" type="number" defaultValue={resource?.waterCutPercent} />
        <TextArea label="Resource Notes" name="resourceNotes" defaultValue={resource?.notes} />
      </Section>

      <Section title="Infrastructure Data">
        <Field label="Distance to Pipeline (mi)" name="distanceToPipelineMiles" type="number" defaultValue={infrastructure?.distanceToPipelineMiles} />
        <Field label="Distance to Power Line (mi)" name="distanceToPowerLineMiles" type="number" defaultValue={infrastructure?.distanceToPowerLineMiles} />
        <Field label="Distance to Substation (mi)" name="distanceToSubstationMiles" type="number" defaultValue={infrastructure?.distanceToSubstationMiles} />
        <Field label="Distance to Road (mi)" name="distanceToRoadMiles" type="number" defaultValue={infrastructure?.distanceToRoadMiles} />
        <Field label="Distance to Fiber (mi)" name="distanceToFiberMiles" type="number" defaultValue={infrastructure?.distanceToFiberMiles} />
        <Field label="Distance to Industrial Load (mi)" name="distanceToIndustrialLoadMiles" type="number" defaultValue={infrastructure?.distanceToIndustrialLoadMiles} />
        <Field label="Distance to Data Center (mi)" name="distanceToDataCenterMiles" type="number" defaultValue={infrastructure?.distanceToDataCenterMiles} />
        <Field label="Site Access Quality" name="siteAccessQuality" defaultValue={infrastructure?.siteAccessQuality} />
        <div className="grid gap-3 md:col-span-2 md:grid-cols-2">
          <Checkbox label="Land available" name="landAvailable" defaultChecked={infrastructure?.landAvailable} />
          <Checkbox label="Land ownership known" name="landOwnershipKnown" defaultChecked={infrastructure?.landOwnershipKnown} />
          <Checkbox label="Water available" name="waterAvailable" defaultChecked={infrastructure?.waterAvailable} />
          <Checkbox label="Existing facilities" name="existingFacilities" defaultChecked={infrastructure?.existingFacilities} />
          <Checkbox label="Existing power infrastructure" name="existingPowerInfrastructure" defaultChecked={infrastructure?.existingPowerInfrastructure} />
          <Checkbox label="Existing gas processing" name="existingGasProcessing" defaultChecked={infrastructure?.existingGasProcessing} />
          <Checkbox label="Existing compression" name="existingCompression" defaultChecked={infrastructure?.existingCompression} />
        </div>
        <TextArea label="Infrastructure Notes" name="infrastructureNotes" defaultValue={infrastructure?.notes} />
      </Section>

      <Section title="Commercial Data">
        <Field label="Preferred Commercial Model" name="preferredCommercialModel" defaultValue={commercial?.preferredCommercialModel} />
        <Field label="Target Power Price ($/MWh)" name="targetPowerPriceUsdMwh" type="number" defaultValue={commercial?.targetPowerPriceUsdMwh} />
        <Field label="Target Gas Price ($/MMBtu)" name="targetGasPriceUsdMmbtu" type="number" defaultValue={commercial?.targetGasPriceUsdMmbtu} />
        <Field label="Expected Capacity Factor (%)" name="expectedCapacityFactorPercent" type="number" defaultValue={commercial?.expectedCapacityFactorPercent} />
        <div className="grid gap-3 md:col-span-2 md:grid-cols-2">
          <Checkbox label="Gas owner known" name="gasOwnerKnown" defaultChecked={commercial?.gasOwnerKnown} />
          <Checkbox label="Land owner known" name="landOwnerKnown" defaultChecked={commercial?.landOwnerKnown} />
          <Checkbox label="Mineral rights known" name="mineralRightsKnown" defaultChecked={commercial?.mineralRightsKnown} />
          <Checkbox label="Existing gas contract" name="existingGasContract" defaultChecked={commercial?.existingGasContract} />
          <Checkbox label="Existing power offtaker" name="existingPowerOfftaker" defaultChecked={commercial?.existingPowerOfftaker} />
          <Checkbox label="Nearby industrial offtaker" name="nearbyIndustrialOfftaker" defaultChecked={commercial?.nearbyIndustrialOfftaker} />
          <Checkbox label="Interested counterparty" name="interestedCounterparty" defaultChecked={commercial?.interestedCounterparty} />
        </div>
        <TextArea label="Commercial Notes" name="commercialNotes" defaultValue={commercial?.notes} />
      </Section>

      <Section title="Regulatory Data">
        <Field label="Permitting Complexity" name="permittingComplexity" defaultValue={regulatory?.permittingComplexity} />
        <Field label="Expected Permitting Months" name="expectedPermittingMonths" type="number" defaultValue={regulatory?.expectedPermittingMonths} />
        <div className="grid gap-3 md:col-span-2 md:grid-cols-2">
          <Checkbox label="Existing permits" name="existingPermits" defaultChecked={regulatory?.existingPermits} />
          <Checkbox label="Air permit required" name="airPermitRequired" defaultChecked={regulatory?.airPermitRequired} />
          <Checkbox label="Water permit required" name="waterPermitRequired" defaultChecked={regulatory?.waterPermitRequired} />
          <Checkbox label="Land use approval required" name="landUseApprovalRequired" defaultChecked={regulatory?.landUseApprovalRequired} />
          <Checkbox label="Interconnection required" name="interconnectionRequired" defaultChecked={regulatory?.interconnectionRequired} />
          <Checkbox label="Environmental issues known" name="environmentalIssuesKnown" defaultChecked={regulatory?.environmentalIssuesKnown} />
          <Checkbox label="Community issues known" name="communityIssuesKnown" defaultChecked={regulatory?.communityIssuesKnown} />
          <Checkbox label="Security issues known" name="securityIssuesKnown" defaultChecked={regulatory?.securityIssuesKnown} />
        </div>
        <TextArea label="Regulatory Notes" name="regulatoryNotes" defaultValue={regulatory?.notes} />
      </Section>

      <div className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm sm:flex-row sm:justify-end">
        <Link
          className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
          href="/"
        >
          Cancel
        </Link>
        <button
          className="inline-flex h-10 items-center justify-center rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
          type="submit"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
