import { getLeads } from "@/lib/actions/leads";
import { LeadTable } from "@/components/leads/lead-table";
import Link from "next/link";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const params = await searchParams;
  const leads = await getLeads(params.status as undefined);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-mono text-2xl font-bold tracking-tight">Leads</h1>
        <div className="flex gap-3">
          <Link
            href="/leads/import"
            className="rounded-lg border border-border bg-bg-surface px-4 py-2 text-sm text-text-muted transition-colors hover:border-accent hover:text-text"
          >
            Import CSV
          </Link>
          <Link
            href="/leads/new"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
          >
            + Add Lead
          </Link>
        </div>
      </div>

      <LeadTable leads={leads} />
    </div>
  );
}
