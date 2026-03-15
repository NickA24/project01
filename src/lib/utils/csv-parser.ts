import type { LeadFormData, PropertyType } from "@/types";
import { PROPERTY_TYPES } from "@/types";

/**
 * Parse a CSV string into lead form data.
 * Expected columns (case-insensitive, flexible naming):
 *   address, city, state, zip, county, owner_name, property_type,
 *   bedrooms, bathrooms, sqft, year_built, asking_price, arv, repair_estimate, notes
 */
export function parseCSV(csvText: string): {
  leads: LeadFormData[];
  errors: string[];
} {
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length < 2) {
    return { leads: [], errors: ["CSV must have a header row and at least one data row."] };
  }

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/[^a-z_]/g, ""));
  const leads: LeadFormData[] = [];
  const errors: string[] = [];

  // Map common header variations
  const headerMap: Record<string, string> = {};
  for (const h of headers) {
    if (h.includes("address") || h === "street") headerMap[h] = "address";
    else if (h === "city") headerMap[h] = "city";
    else if (h === "state" || h === "st") headerMap[h] = "state";
    else if (h === "zip" || h === "zipcode" || h === "zip_code") headerMap[h] = "zip";
    else if (h.includes("county")) headerMap[h] = "county";
    else if (h.includes("owner") || h === "name") headerMap[h] = "owner_name";
    else if (h.includes("type") || h === "property_type") headerMap[h] = "property_type";
    else if (h.includes("bed")) headerMap[h] = "bedrooms";
    else if (h.includes("bath")) headerMap[h] = "bathrooms";
    else if (h === "sqft" || h.includes("square")) headerMap[h] = "sqft";
    else if (h.includes("year")) headerMap[h] = "year_built";
    else if (h.includes("asking") || h === "price" || h === "list_price") headerMap[h] = "asking_price";
    else if (h === "arv" || h.includes("after_repair")) headerMap[h] = "arv";
    else if (h.includes("repair")) headerMap[h] = "repair_estimate";
    else if (h.includes("note")) headerMap[h] = "notes";
    else headerMap[h] = h;
  }

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === 0 || (values.length === 1 && values[0].trim() === "")) continue;

    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      const mapped = headerMap[h] ?? h;
      row[mapped] = values[idx]?.trim() ?? "";
    });

    if (!row.address || !row.city || !row.state || !row.zip) {
      errors.push(`Row ${i + 1}: Missing required fields (address, city, state, zip).`);
      continue;
    }

    const propertyType = row.property_type?.toUpperCase() as PropertyType | undefined;

    leads.push({
      address: row.address,
      city: row.city,
      state: row.state,
      zip: row.zip,
      county: row.county || undefined,
      owner_name: row.owner_name || undefined,
      property_type: propertyType && PROPERTY_TYPES.includes(propertyType) ? propertyType : undefined,
      bedrooms: row.bedrooms ? parseInt(row.bedrooms) || undefined : undefined,
      bathrooms: row.bathrooms ? parseFloat(row.bathrooms) || undefined : undefined,
      sqft: row.sqft ? parseInt(row.sqft) || undefined : undefined,
      year_built: row.year_built ? parseInt(row.year_built) || undefined : undefined,
      asking_price: row.asking_price ? parseFloat(row.asking_price.replace(/[$,]/g, "")) || undefined : undefined,
      arv: row.arv ? parseFloat(row.arv.replace(/[$,]/g, "")) || undefined : undefined,
      repair_estimate: row.repair_estimate ? parseFloat(row.repair_estimate.replace(/[$,]/g, "")) || undefined : undefined,
      notes: row.notes || undefined,
    });
  }

  return { leads, errors };
}

/** Simple CSV line parser that handles quoted fields */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        result.push(current);
        current = "";
      } else {
        current += ch;
      }
    }
  }
  result.push(current);
  return result;
}
