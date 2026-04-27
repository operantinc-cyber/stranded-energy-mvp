import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteOpportunity, updateOpportunity } from "@/app/actions";
import { prisma } from "@/lib/db";
import { OpportunityForm } from "../_components/opportunity-form";

export default async function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const opportunity = await prisma.opportunity.findUnique({
    where: { id },
    include: {
      resourceData: true,
      infrastructureData: true,
      commercialData: true,
      regulatoryData: true,
    },
  });

  if (!opportunity) {
    notFound();
  }

  const updateAction = updateOpportunity.bind(null, opportunity.id);
  const deleteAction = deleteOpportunity.bind(null, opportunity.id);

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-8 text-zinc-950 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-6">
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link className="text-sm font-semibold text-emerald-700 hover:text-emerald-800" href="/">
              Back to dashboard
            </Link>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">{opportunity.name}</h1>
            <p className="mt-2 text-sm text-zinc-600">
              Edit the opportunity record and its resource, infrastructure, commercial, and regulatory data.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              className="inline-flex h-10 items-center justify-center rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
              href={`/opportunities/${opportunity.id}/score`}
            >
              Score Opportunity
            </Link>
            <form action={deleteAction}>
              <button
                className="inline-flex h-10 items-center justify-center rounded-md border border-red-200 px-4 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                type="submit"
              >
                Delete
              </button>
            </form>
          </div>
        </div>

        <OpportunityForm
          action={updateAction}
          opportunity={opportunity}
          submitLabel="Save Changes"
        />
      </div>
    </main>
  );
}
