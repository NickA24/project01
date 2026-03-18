import { getLead } from "@/lib/actions/leads";
import { LeadForm } from "@/components/leads/lead-form";
import { notFound } from "next/navigation";

export default async function EditLeadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lead = await getLead(id);

  if (!lead) {
    notFound();
  }

  return (
    <div>
      <h1 className="mb-6 font-mono text-2xl font-bold tracking-tight">
        Edit Lead
      </h1>
      <LeadForm lead={lead} />
    </div>
  );
}
