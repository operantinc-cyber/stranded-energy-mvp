import Link from "next/link";
import { createOpportunity } from "@/app/actions";
import { OpportunityForm } from "../_components/opportunity-form";

export default function NewOpportunityPage() {
  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-8 text-zinc-950 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link className="text-sm font-semibold text-emerald-700 hover:text-emerald-800" href="/">
              Back to dashboard
            </Link>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">New Opportunity</h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-600">
              Capture the core opportunity profile and supporting MVP diligence data.
            </p>
          </div>
        </div>

        <OpportunityForm action={createOpportunity} submitLabel="Create Opportunity" />
      </div>
    </main>
  );
}
