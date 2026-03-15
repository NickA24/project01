import { CSVImport } from "@/components/leads/csv-import";

export default function ImportPage() {
  return (
    <div>
      <h1 className="mb-6 font-mono text-2xl font-bold tracking-tight">
        Import Leads from CSV
      </h1>
      <CSVImport />
    </div>
  );
}
