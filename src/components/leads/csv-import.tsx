"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { parseCSV } from "@/lib/utils/csv-parser";
import { importLeadsFromCSV } from "@/lib/actions/leads";
import type { LeadFormData } from "@/types";

export function CSVImport() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [parsed, setParsed] = useState<{
    leads: LeadFormData[];
    errors: string[];
  } | null>(null);
  const [result, setResult] = useState<{
    success: number;
    failed: number;
  } | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const parsed = parseCSV(text);
      setParsed(parsed);
      setResult(null);
    };
    reader.readAsText(file);
  }

  function handleImport() {
    if (!parsed || parsed.leads.length === 0) return;

    startTransition(async () => {
      const res = await importLeadsFromCSV(parsed.leads);
      setResult(res);
    });
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="rounded-xl border border-border bg-bg-surface p-5">
        <h2 className="mb-3 font-mono text-xs font-semibold uppercase tracking-wider text-text-muted">
          Upload CSV File
        </h2>
        <p className="mb-4 text-sm text-text-muted">
          Required columns: <code className="text-accent">address</code>,{" "}
          <code className="text-accent">city</code>,{" "}
          <code className="text-accent">state</code>,{" "}
          <code className="text-accent">zip</code>. Optional: owner_name,
          property_type, bedrooms, bathrooms, sqft, year_built, asking_price,
          arv, repair_estimate, notes.
        </p>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="block w-full text-sm text-text-muted file:mr-4 file:rounded-lg file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-accent-hover"
        />
      </div>

      {parsed && (
        <div className="rounded-xl border border-border bg-bg-surface p-5">
          <h2 className="mb-3 font-mono text-xs font-semibold uppercase tracking-wider text-text-muted">
            Preview
          </h2>
          <p className="mb-2 text-sm text-text">
            Found <span className="font-mono text-accent">{parsed.leads.length}</span>{" "}
            valid leads
          </p>

          {parsed.errors.length > 0 && (
            <div className="mb-4 rounded-lg border border-danger/30 bg-danger/10 p-3">
              <p className="mb-1 text-xs font-medium text-danger">
                {parsed.errors.length} error(s):
              </p>
              {parsed.errors.map((err, i) => (
                <p key={i} className="text-xs text-danger/80">
                  {err}
                </p>
              ))}
            </div>
          )}

          {parsed.leads.length > 0 && (
            <>
              <div className="mb-4 max-h-60 overflow-auto rounded-lg border border-border">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border bg-bg-elevated text-text-muted">
                      <th className="px-3 py-2 text-left">Address</th>
                      <th className="px-3 py-2 text-left">City</th>
                      <th className="px-3 py-2 text-left">State</th>
                      <th className="px-3 py-2 text-left">ZIP</th>
                      <th className="px-3 py-2 text-left">Owner</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsed.leads.slice(0, 10).map((lead, i) => (
                      <tr key={i} className="border-b border-border">
                        <td className="px-3 py-2 text-text">{lead.address}</td>
                        <td className="px-3 py-2 text-text-muted">{lead.city}</td>
                        <td className="px-3 py-2 text-text-muted">{lead.state}</td>
                        <td className="px-3 py-2 text-text-muted">{lead.zip}</td>
                        <td className="px-3 py-2 text-text-muted">
                          {lead.owner_name ?? "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {parsed.leads.length > 10 && (
                  <p className="px-3 py-2 text-xs text-text-muted">
                    ...and {parsed.leads.length - 10} more
                  </p>
                )}
              </div>

              <button
                onClick={handleImport}
                disabled={isPending}
                className="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
              >
                {isPending
                  ? "Importing..."
                  : `Import ${parsed.leads.length} Leads`}
              </button>
            </>
          )}
        </div>
      )}

      {result && (
        <div className="rounded-xl border border-success/30 bg-success/10 p-5">
          <p className="text-sm text-success">
            Imported <strong>{result.success}</strong> leads successfully.
            {result.failed > 0 && (
              <span className="text-danger">
                {" "}
                {result.failed} failed.
              </span>
            )}
          </p>
          <button
            onClick={() => router.push("/leads")}
            className="mt-3 text-sm text-accent hover:underline"
          >
            View Leads →
          </button>
        </div>
      )}
    </div>
  );
}
