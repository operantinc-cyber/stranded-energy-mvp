import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatNumber } from "@/lib/format";
import {
  getGoogleMapsUrl,
  getOpenStreetMapEmbedUrl,
  getOpenStreetMapExternalUrl,
  hasCoordinates,
} from "@/lib/maps";

function locationLabel(opportunity: {
  locationCity: string | null;
  locationState: string | null;
  locationCountry: string | null;
}) {
  const parts = [
    opportunity.locationCity,
    opportunity.locationState,
    opportunity.locationCountry,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(", ") : "Not provided";
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-zinc-950">
        {value ?? "Not provided"}
      </p>
    </div>
  );
}

export default async function OpportunityMapPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const opportunity = await prisma.opportunity.findUnique({
    where: { id },
  });

  if (!opportunity) {
    notFound();
  }

  const hasLocation = hasCoordinates(opportunity);
  const latitude = opportunity.latitude;
  const longitude = opportunity.longitude;

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-8 text-zinc-950 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-6">
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link
              className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
              href={`/opportunities/${opportunity.id}`}
            >
              Back to opportunity
            </Link>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Map: {opportunity.name}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-600">
              Lightweight asset location view using manually entered latitude and longitude.
            </p>
          </div>
          <Link
            className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
            href="/"
          >
            Dashboard
          </Link>
        </div>

        <section className="grid gap-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm md:grid-cols-2 lg:grid-cols-4">
          <Detail label="Asset Name" value={opportunity.name} />
          <Detail label="Asset Type" value={opportunity.assetType} />
          <Detail label="Status" value={opportunity.status} />
          <Detail label="Location" value={locationLabel(opportunity)} />
        </section>

        {hasLocation && latitude != null && longitude != null ? (
          <>
            <section className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
              <iframe
                className="h-[28rem] w-full border-0"
                loading="lazy"
                src={getOpenStreetMapEmbedUrl(latitude, longitude)}
                title={`Map location for ${opportunity.name}`}
              />
            </section>

            <section className="grid gap-4 lg:grid-cols-3">
              <article className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold">Location Summary</h2>
                <p className="mt-2 text-sm text-zinc-600">
                  This view centers on the opportunity coordinates and is intended for quick visual review only.
                </p>
              </article>
              <article className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold">Coordinates</h2>
                <p className="mt-2 text-sm text-zinc-700">
                  Latitude:{" "}
                  <span className="font-semibold text-zinc-950">
                    {formatNumber(latitude, { maximumFractionDigits: 6 })}
                  </span>
                </p>
                <p className="mt-1 text-sm text-zinc-700">
                  Longitude:{" "}
                  <span className="font-semibold text-zinc-950">
                    {formatNumber(longitude, { maximumFractionDigits: 6 })}
                  </span>
                </p>
              </article>
              <article className="grid gap-3 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold">External Maps</h2>
                <a
                  className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
                  href={getOpenStreetMapExternalUrl(latitude, longitude)}
                  rel="noreferrer"
                  target="_blank"
                >
                  Open in OpenStreetMap
                </a>
                <a
                  className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
                  href={getGoogleMapsUrl(latitude, longitude)}
                  rel="noreferrer"
                  target="_blank"
                >
                  Open in Google Maps
                </a>
              </article>
            </section>
          </>
        ) : (
          <section className="grid gap-4 rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-950 shadow-sm">
            <h2 className="text-xl font-semibold">
              No coordinates available for this opportunity.
            </h2>
            <p className="text-sm">
              Add latitude and longitude from the opportunity detail/edit page to enable the map view. Use decimal degrees, for example 31.9686, -99.9018.
            </p>
            <Link
              className="inline-flex h-10 w-fit items-center justify-center rounded-md bg-amber-700 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-800"
              href={`/opportunities/${opportunity.id}`}
            >
              Edit Opportunity
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}
