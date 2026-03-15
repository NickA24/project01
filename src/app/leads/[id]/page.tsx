import { getLead } from "@/lib/actions/leads";
import { getCommLogs } from "@/lib/actions/comm-log";
import { notFound } from "next/navigation";
import { LEAD_STATUS_LABELS, PROPERTY_TYPES } from "@/types";
import { LeadActions } from "@/components/leads/lead-actions";
import { CommLogSection } from "@/components/leads/comm-log-section";
import Link from "next/link";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lead = await getLead(id);

  if (!lead) {
    notFound();
  }

  const commLogs = await getCommLogs(id);

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <Link
            href="/leads"
            className="mb-2 inline-block text-xs text-text-muted hover:text-accent"
          >
            ← Back to Leads
          </Link>
          <h1 className="font-mono text-2xl font-bold tracking-tight">
            {lead.address}
          </h1>
          <p className="text-text-muted">
            {lead.city}, {lead.state} {lead.zip}
            {lead.county && ` · ${lead.county} County`}
          </p>
        </div>
        <LeadActions lead={lead} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Property Info */}
        <div className="rounded-xl border border-border bg-bg-surface p-5">
          <h2 className="mb-4 font-mono text-xs font-semibold uppercase tracking-wider text-text-muted">
            Property Details
          </h2>
          <dl className="space-y-3 text-sm">
            <InfoRow label="Owner" value={lead.owner_name} />
            <InfoRow label="Type" value={lead.property_type} />
            <InfoRow
              label="Bed / Bath"
              value={
                lead.bedrooms || lead.bathrooms
                  ? `${lead.bedrooms ?? "—"} bd / ${lead.bathrooms ?? "—"} ba`
                  : null
              }
            />
            <InfoRow
              label="Sqft"
              value={lead.sqft?.toLocaleString()}
            />
            <InfoRow label="Year Built" value={lead.year_built?.toString()} />
            <InfoRow label="Source" value={lead.source} />
            <InfoRow label="Status" value={LEAD_STATUS_LABELS[lead.status]} />
          </dl>
        </div>

        {/* Financials */}
        <div className="rounded-xl border border-border bg-bg-surface p-5">
          <h2 className="mb-4 font-mono text-xs font-semibold uppercase tracking-wider text-text-muted">
            Financials
          </h2>
          <dl className="space-y-3 text-sm">
            <InfoRow
              label="Asking Price"
              value={
                lead.asking_price
                  ? `$${lead.asking_price.toLocaleString()}`
                  : null
              }
            />
            <InfoRow
              label="ARV"
              value={lead.arv ? `$${lead.arv.toLocaleString()}` : null}
            />
            <InfoRow
              label="Repair Estimate"
              value={
                lead.repair_estimate
                  ? `$${lead.repair_estimate.toLocaleString()}`
                  : null
              }
            />
            <InfoRow
              label="MAO"
              value={lead.mao ? `$${lead.mao.toLocaleString()}` : null}
              highlight
            />
          </dl>

          <div className="mt-4 border-t border-border pt-4">
            <Link
              href={`/calculator?lead=${lead.id}`}
              className="text-sm text-accent hover:underline"
            >
              Run detailed analysis →
            </Link>
          </div>
        </div>

        {/* Notes */}
        {lead.notes && (
          <div className="rounded-xl border border-border bg-bg-surface p-5 lg:col-span-2">
            <h2 className="mb-3 font-mono text-xs font-semibold uppercase tracking-wider text-text-muted">
              Notes
            </h2>
            <p className="whitespace-pre-wrap text-sm text-text">
              {lead.notes}
            </p>
          </div>
        )}

        {/* Communication Log */}
        <div className="lg:col-span-2">
          <CommLogSection leadId={lead.id} logs={commLogs} />
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string | null | undefined;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between">
      <dt className="text-text-muted">{label}</dt>
      <dd
        className={`font-medium ${highlight ? "font-mono text-accent" : "text-text"}`}
      >
        {value ?? "—"}
      </dd>
    </div>
  );
}
