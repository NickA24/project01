"use client";

import { useState, useTransition } from "react";
import { createCommLog } from "@/lib/actions/comm-log";
import { COMM_TYPES } from "@/types";
import type { CommLog, CommType, CommDirection } from "@/types";

const typeLabels: Record<CommType, string> = {
  call: "Call",
  text: "Text",
  email: "Email",
  door_knock: "Door Knock",
  other: "Other",
};

interface CommLogSectionProps {
  leadId: string;
  logs: CommLog[];
}

export function CommLogSection({ leadId, logs }: CommLogSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    startTransition(async () => {
      await createCommLog({
        lead_id: leadId,
        type: form.get("type") as CommType,
        direction: form.get("direction") as CommDirection,
        summary: (form.get("summary") as string) || undefined,
      });
      setShowForm(false);
    });
  }

  return (
    <div className="rounded-xl border border-border bg-bg-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-text-muted">
          Communication Log
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-xs text-accent hover:underline"
        >
          {showForm ? "Cancel" : "+ Log Communication"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-4 rounded-lg border border-border bg-bg-elevated p-4"
        >
          <div className="mb-3 grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-text-muted">Type</label>
              <select
                name="type"
                required
                className="w-full rounded-lg border border-border bg-bg px-3 py-1.5 text-sm text-text outline-none focus:border-accent"
              >
                {COMM_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {typeLabels[t]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-text-muted">
                Direction
              </label>
              <select
                name="direction"
                required
                className="w-full rounded-lg border border-border bg-bg px-3 py-1.5 text-sm text-text outline-none focus:border-accent"
              >
                <option value="outbound">Outbound</option>
                <option value="inbound">Inbound</option>
              </select>
            </div>
          </div>
          <div className="mb-3">
            <label className="mb-1 block text-xs text-text-muted">
              Summary
            </label>
            <textarea
              name="summary"
              rows={2}
              placeholder="What happened..."
              className="w-full rounded-lg border border-border bg-bg px-3 py-1.5 text-sm text-text placeholder-text-muted outline-none focus:border-accent"
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-accent px-4 py-1.5 text-xs font-medium text-white hover:bg-accent-hover disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save"}
          </button>
        </form>
      )}

      {logs.length === 0 && !showForm && (
        <p className="text-sm text-text-muted">No communications logged yet.</p>
      )}

      {logs.length > 0 && (
        <div className="space-y-2">
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-3 rounded-lg border border-border bg-bg-elevated px-4 py-3"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-text">
                    {typeLabels[log.type]}
                  </span>
                  <span className="text-xs text-text-muted">
                    {log.direction === "outbound" ? "→ Out" : "← In"}
                  </span>
                  <span className="text-xs text-text-muted">
                    {new Date(log.created_at).toLocaleDateString()}{" "}
                    {new Date(log.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                {log.summary && (
                  <p className="mt-1 text-sm text-text-muted">{log.summary}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
