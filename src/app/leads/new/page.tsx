import { LeadForm } from "@/components/leads/lead-form";

export default function NewLeadPage() {
  return (
    <div>
      <h1 className="mb-6 font-mono text-2xl font-bold tracking-tight">
        Add New Lead
      </h1>
      <LeadForm />
    </div>
  );
}
