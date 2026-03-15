import { getLeads } from "@/lib/actions/leads";
import { LEAD_STATUSES, LEAD_STATUS_LABELS } from "@/types";

export default async function DashboardPage() {
  const leads = await getLeads();

  const statusCounts = LEAD_STATUSES.reduce(
    (acc, status) => {
      acc[status] = leads.filter((l) => l.status === status).length;
      return acc;
    },
    {} as Record<string, number>
  );

  const totalLeads = leads.length;
  const activeLeads = leads.filter(
    (l) => l.status !== "dead" && l.status !== "under_contract"
  ).length;
  const offersOut = statusCounts["offer_sent"] ?? 0;
  const underContract = statusCounts["under_contract"] ?? 0;

  return (
    <div>
      <h1 className="mb-6 font-mono text-2xl font-bold tracking-tight">
        Dashboard
      </h1>

      {/* Metrics cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Total Leads" value={totalLeads} />
        <MetricCard label="Active Pipeline" value={activeLeads} accent />
        <MetricCard label="Offers Out" value={offersOut} />
        <MetricCard label="Under Contract" value={underContract} accent />
      </div>

      {/* Pipeline breakdown */}
      <div className="rounded-xl border border-border bg-bg-surface p-6">
        <h2 className="mb-4 font-mono text-sm font-semibold uppercase tracking-wider text-text-muted">
          Pipeline Breakdown
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {LEAD_STATUSES.map((status) => (
            <div
              key={status}
              className="rounded-lg border border-border bg-bg-elevated px-4 py-3 text-center"
            >
              <p className="font-mono text-2xl font-bold text-accent">
                {statusCounts[status]}
              </p>
              <p className="mt-1 text-xs text-text-muted">
                {LEAD_STATUS_LABELS[status]}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent leads */}
      {leads.length > 0 && (
        <div className="mt-6 rounded-xl border border-border bg-bg-surface p-6">
          <h2 className="mb-4 font-mono text-sm font-semibold uppercase tracking-wider text-text-muted">
            Recent Leads
          </h2>
          <div className="space-y-2">
            {leads.slice(0, 5).map((lead) => (
              <div
                key={lead.id}
                className="flex items-center justify-between rounded-lg border border-border bg-bg-elevated px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-text">
                    {lead.address}
                  </p>
                  <p className="text-xs text-text-muted">
                    {lead.city}, {lead.state} {lead.zip}
                  </p>
                </div>
                <div className="text-right">
                  {lead.mao && (
                    <p className="font-mono text-sm text-accent">
                      MAO ${lead.mao.toLocaleString()}
                    </p>
                  )}
                  <p className="text-xs text-text-muted">
                    {LEAD_STATUS_LABELS[lead.status]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {leads.length === 0 && (
        <div className="mt-6 rounded-xl border border-dashed border-border bg-bg-surface p-12 text-center">
          <p className="text-lg text-text-muted">No leads yet</p>
          <p className="mt-2 text-sm text-text-muted">
            Add your first lead from the{" "}
            <a href="/leads/new" className="text-accent hover:underline">
              Leads page
            </a>
          </p>
        </div>
      )}
    </div>
  );
}

function MetricCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-bg-surface p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
        {label}
      </p>
      <p
        className={`mt-2 font-mono text-3xl font-bold ${accent ? "text-accent" : "text-text"}`}
      >
        {value}
      </p>
    </div>
  );
}
