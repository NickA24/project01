"use client";

import { useState, useTransition } from "react";
import { LEAD_STATUSES, LEAD_STATUS_LABELS } from "@/types";
import type { LeadStatus } from "@/types";
import { updateLeadStatus } from "@/lib/actions/leads";

const statusColors: Record<LeadStatus, string> = {
  new: "bg-blue-500/15 text-blue-400",
  researching: "bg-yellow-500/15 text-yellow-400",
  contacted: "bg-purple-500/15 text-purple-400",
  offer_sent: "bg-orange-500/15 text-orange-400",
  under_contract: "bg-green-500/15 text-green-400",
  dead: "bg-red-500/15 text-red-400",
};

interface StatusBadgeProps {
  status: LeadStatus;
  leadId: string;
}

export function StatusBadge({ status, leadId }: StatusBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleStatusChange(newStatus: LeadStatus) {
    setIsOpen(false);
    startTransition(async () => {
      await updateLeadStatus(leadId, newStatus);
    });
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[status]} ${isPending ? "opacity-50" : "cursor-pointer"}`}
      >
        {isPending ? "..." : LEAD_STATUS_LABELS[status]}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 z-20 mt-1 w-40 rounded-lg border border-border bg-bg-elevated py-1 shadow-lg">
            {LEAD_STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => handleStatusChange(s)}
                className={`w-full px-3 py-1.5 text-left text-xs transition-colors hover:bg-bg-surface ${
                  s === status ? "text-accent" : "text-text-muted hover:text-text"
                }`}
              >
                {LEAD_STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
