"use client";

import { useState } from "react";
import Link from "next/link";
import type { Lead, LeadStatus } from "@/types";
import { LEAD_STATUSES, LEAD_STATUS_LABELS } from "@/types";
import { StatusBadge } from "./status-badge";

interface LeadTableProps {
  leads: Lead[];
}

export function LeadTable({ leads }: LeadTableProps) {
  const [activeStatus, setActiveStatus] = useState<LeadStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<keyof Lead>("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const filtered = leads
    .filter((lead) => {
      if (activeStatus !== "all" && lead.status !== activeStatus) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          lead.address.toLowerCase().includes(q) ||
          lead.city.toLowerCase().includes(q) ||
          lead.zip.includes(q) ||
          (lead.owner_name?.toLowerCase().includes(q) ?? false)
        );
      }
      return true;
    })
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });

  function toggleSort(field: keyof Lead) {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  }

  const sortIndicator = (field: keyof Lead) =>
    sortField === field ? (sortDir === "asc" ? " ↑" : " ↓") : "";

  return (
    <div>
      {/* Status tabs */}
      <div className="mb-4 flex flex-wrap gap-1">
        <TabButton
          active={activeStatus === "all"}
          onClick={() => setActiveStatus("all")}
          count={leads.length}
        >
          All
        </TabButton>
        {LEAD_STATUSES.map((status) => {
          const count = leads.filter((l) => l.status === status).length;
          return (
            <TabButton
              key={status}
              active={activeStatus === status}
              onClick={() => setActiveStatus(status)}
              count={count}
            >
              {LEAD_STATUS_LABELS[status]}
            </TabButton>
          );
        })}
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by address, city, zip, or owner..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-border bg-bg-elevated px-4 py-2 text-sm text-text placeholder-text-muted outline-none transition-colors focus:border-accent"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg-surface text-left text-xs uppercase tracking-wider text-text-muted">
              <th
                className="cursor-pointer px-4 py-3 hover:text-text"
                onClick={() => toggleSort("address")}
              >
                Address{sortIndicator("address")}
              </th>
              <th
                className="cursor-pointer px-4 py-3 hover:text-text"
                onClick={() => toggleSort("owner_name")}
              >
                Owner{sortIndicator("owner_name")}
              </th>
              <th className="px-4 py-3">Type</th>
              <th
                className="cursor-pointer px-4 py-3 text-right hover:text-text"
                onClick={() => toggleSort("arv")}
              >
                ARV{sortIndicator("arv")}
              </th>
              <th
                className="cursor-pointer px-4 py-3 text-right hover:text-text"
                onClick={() => toggleSort("mao")}
              >
                MAO{sortIndicator("mao")}
              </th>
              <th className="px-4 py-3">Status</th>
              <th
                className="cursor-pointer px-4 py-3 hover:text-text"
                onClick={() => toggleSort("created_at")}
              >
                Added{sortIndicator("created_at")}
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((lead) => (
              <tr
                key={lead.id}
                className="border-b border-border transition-colors hover:bg-bg-elevated"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/leads/${lead.id}`}
                    className="font-medium text-text hover:text-accent"
                  >
                    {lead.address}
                  </Link>
                  <p className="text-xs text-text-muted">
                    {lead.city}, {lead.state} {lead.zip}
                  </p>
                </td>
                <td className="px-4 py-3 text-text-muted">
                  {lead.owner_name ?? "—"}
                </td>
                <td className="px-4 py-3 text-text-muted">
                  {lead.property_type ?? "—"}
                </td>
                <td className="px-4 py-3 text-right font-mono">
                  {lead.arv ? `$${lead.arv.toLocaleString()}` : "—"}
                </td>
                <td className="px-4 py-3 text-right font-mono text-accent">
                  {lead.mao ? `$${lead.mao.toLocaleString()}` : "—"}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={lead.status} leadId={lead.id} />
                </td>
                <td className="px-4 py-3 text-text-muted">
                  {new Date(lead.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-12 text-center text-text-muted"
                >
                  {search || activeStatus !== "all"
                    ? "No leads match your filters"
                    : "No leads yet — add your first one!"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-text-muted">
        {filtered.length} of {leads.length} leads
      </p>
    </div>
  );
}

function TabButton({
  children,
  active,
  onClick,
  count,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "bg-accent/15 text-accent"
          : "text-text-muted hover:bg-bg-elevated hover:text-text"
      }`}
    >
      {children}
      <span className="ml-1.5 font-mono">{count}</span>
    </button>
  );
}
