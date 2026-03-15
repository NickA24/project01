"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createLead, updateLead } from "@/lib/actions/leads";
import { PROPERTY_TYPES } from "@/types";
import type { Lead, LeadFormData } from "@/types";

interface LeadFormProps {
  lead?: Lead;
}

export function LeadForm({ lead }: LeadFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = new FormData(e.currentTarget);
    const data: LeadFormData = {
      address: form.get("address") as string,
      city: form.get("city") as string,
      state: form.get("state") as string,
      zip: form.get("zip") as string,
      county: (form.get("county") as string) || undefined,
      owner_name: (form.get("owner_name") as string) || undefined,
      property_type:
        (form.get("property_type") as LeadFormData["property_type"]) ||
        undefined,
      bedrooms: form.get("bedrooms")
        ? Number(form.get("bedrooms"))
        : undefined,
      bathrooms: form.get("bathrooms")
        ? Number(form.get("bathrooms"))
        : undefined,
      sqft: form.get("sqft") ? Number(form.get("sqft")) : undefined,
      year_built: form.get("year_built")
        ? Number(form.get("year_built"))
        : undefined,
      asking_price: form.get("asking_price")
        ? Number(form.get("asking_price"))
        : undefined,
      arv: form.get("arv") ? Number(form.get("arv")) : undefined,
      repair_estimate: form.get("repair_estimate")
        ? Number(form.get("repair_estimate"))
        : undefined,
      notes: (form.get("notes") as string) || undefined,
    };

    if (!data.address || !data.city || !data.state || !data.zip) {
      setError("Address, City, State, and ZIP are required.");
      return;
    }

    startTransition(async () => {
      const result = lead
        ? await updateLead(lead.id, data)
        : await createLead(data);

      if (result) {
        router.push("/leads");
      } else {
        setError("Failed to save lead. Check your database connection.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {error && (
        <div className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      {/* Location */}
      <fieldset className="rounded-xl border border-border bg-bg-surface p-5">
        <legend className="px-2 font-mono text-xs font-semibold uppercase tracking-wider text-text-muted">
          Location
        </legend>
        <div className="space-y-4">
          <FormField
            label="Address"
            name="address"
            required
            defaultValue={lead?.address}
            placeholder="123 Main Street"
          />
          <div className="grid grid-cols-3 gap-4">
            <FormField
              label="City"
              name="city"
              required
              defaultValue={lead?.city}
            />
            <FormField
              label="State"
              name="state"
              required
              defaultValue={lead?.state}
              placeholder="TX"
            />
            <FormField
              label="ZIP"
              name="zip"
              required
              defaultValue={lead?.zip}
              placeholder="77001"
            />
          </div>
          <FormField
            label="County"
            name="county"
            defaultValue={lead?.county ?? ""}
          />
        </div>
      </fieldset>

      {/* Owner & Property */}
      <fieldset className="rounded-xl border border-border bg-bg-surface p-5">
        <legend className="px-2 font-mono text-xs font-semibold uppercase tracking-wider text-text-muted">
          Property Details
        </legend>
        <div className="space-y-4">
          <FormField
            label="Owner Name"
            name="owner_name"
            defaultValue={lead?.owner_name ?? ""}
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-text-muted">
                Property Type
              </label>
              <select
                name="property_type"
                defaultValue={lead?.property_type ?? ""}
                className="w-full rounded-lg border border-border bg-bg-elevated px-3 py-2 text-sm text-text outline-none focus:border-accent"
              >
                <option value="">Select...</option>
                {PROPERTY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <FormField
              label="Year Built"
              name="year_built"
              type="number"
              defaultValue={lead?.year_built ?? ""}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <FormField
              label="Bedrooms"
              name="bedrooms"
              type="number"
              defaultValue={lead?.bedrooms ?? ""}
            />
            <FormField
              label="Bathrooms"
              name="bathrooms"
              type="number"
              step="0.5"
              defaultValue={lead?.bathrooms ?? ""}
            />
            <FormField
              label="Sqft"
              name="sqft"
              type="number"
              defaultValue={lead?.sqft ?? ""}
            />
          </div>
        </div>
      </fieldset>

      {/* Financials */}
      <fieldset className="rounded-xl border border-border bg-bg-surface p-5">
        <legend className="px-2 font-mono text-xs font-semibold uppercase tracking-wider text-text-muted">
          Financials
        </legend>
        <div className="grid grid-cols-3 gap-4">
          <FormField
            label="Asking Price"
            name="asking_price"
            type="number"
            prefix="$"
            defaultValue={lead?.asking_price ?? ""}
          />
          <FormField
            label="ARV"
            name="arv"
            type="number"
            prefix="$"
            defaultValue={lead?.arv ?? ""}
          />
          <FormField
            label="Repair Estimate"
            name="repair_estimate"
            type="number"
            prefix="$"
            defaultValue={lead?.repair_estimate ?? ""}
          />
        </div>
      </fieldset>

      {/* Notes */}
      <fieldset className="rounded-xl border border-border bg-bg-surface p-5">
        <legend className="px-2 font-mono text-xs font-semibold uppercase tracking-wider text-text-muted">
          Notes
        </legend>
        <textarea
          name="notes"
          rows={4}
          defaultValue={lead?.notes ?? ""}
          placeholder="Any additional notes about this lead..."
          className="w-full rounded-lg border border-border bg-bg-elevated px-3 py-2 text-sm text-text placeholder-text-muted outline-none focus:border-accent"
        />
      </fieldset>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
        >
          {isPending ? "Saving..." : lead ? "Update Lead" : "Add Lead"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-border px-6 py-2.5 text-sm text-text-muted transition-colors hover:border-accent hover:text-text"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function FormField({
  label,
  name,
  type = "text",
  required,
  defaultValue,
  placeholder,
  prefix,
  step,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string | number;
  placeholder?: string;
  prefix?: string;
  step?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-text-muted">
        {label}
        {required && <span className="text-secondary"> *</span>}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-muted">
            {prefix}
          </span>
        )}
        <input
          type={type}
          name={name}
          required={required}
          defaultValue={defaultValue}
          placeholder={placeholder}
          step={step}
          className={`w-full rounded-lg border border-border bg-bg-elevated py-2 text-sm text-text placeholder-text-muted outline-none focus:border-accent ${prefix ? "pl-7 pr-3" : "px-3"}`}
        />
      </div>
    </div>
  );
}
