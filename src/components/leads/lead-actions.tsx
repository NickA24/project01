"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteLead } from "@/lib/actions/leads";
import type { Lead } from "@/types";
import Link from "next/link";

export function LeadActions({ lead }: { lead: Lead }) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const ok = await deleteLead(lead.id);
      if (ok) {
        router.push("/leads");
      }
    });
  }

  return (
    <div className="flex gap-2">
      <Link
        href={`/leads/${lead.id}/edit`}
        className="rounded-lg border border-border px-3 py-1.5 text-xs text-text-muted transition-colors hover:border-accent hover:text-text"
      >
        Edit
      </Link>

      {!showConfirm ? (
        <button
          onClick={() => setShowConfirm(true)}
          className="rounded-lg border border-border px-3 py-1.5 text-xs text-text-muted transition-colors hover:border-danger hover:text-danger"
        >
          Delete
        </button>
      ) : (
        <div className="flex gap-1">
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="rounded-lg bg-danger px-3 py-1.5 text-xs text-white disabled:opacity-50"
          >
            {isPending ? "..." : "Confirm"}
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            className="rounded-lg border border-border px-3 py-1.5 text-xs text-text-muted"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
