// Lead statuses in pipeline order
export const LEAD_STATUSES = [
  "new",
  "researching",
  "contacted",
  "offer_sent",
  "under_contract",
  "dead",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  researching: "Researching",
  contacted: "Contacted",
  offer_sent: "Offer Sent",
  under_contract: "Under Contract",
  dead: "Dead",
};

export const PROPERTY_TYPES = [
  "SFH",
  "MFH",
  "Condo",
  "Townhouse",
  "Land",
  "Commercial",
] as const;

export type PropertyType = (typeof PROPERTY_TYPES)[number];

export const COMM_TYPES = [
  "call",
  "text",
  "email",
  "door_knock",
  "other",
] as const;

export type CommType = (typeof COMM_TYPES)[number];

export type CommDirection = "inbound" | "outbound";

// --- Database row types ---

export interface Lead {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  county: string | null;
  owner_name: string | null;
  property_type: PropertyType | null;
  bedrooms: number | null;
  bathrooms: number | null;
  sqft: number | null;
  lot_size: number | null;
  year_built: number | null;
  asking_price: number | null;
  arv: number | null;
  repair_estimate: number | null;
  mao: number | null;
  status: LeadStatus;
  source: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface CommLog {
  id: string;
  lead_id: string;
  type: CommType;
  direction: CommDirection;
  summary: string | null;
  created_at: string;
}

export interface DealAnalysis {
  id: string;
  lead_id: string;
  arv: number | null;
  repair_roof: number;
  repair_hvac: number;
  repair_plumbing: number;
  repair_electrical: number;
  repair_kitchen: number;
  repair_bath: number;
  repair_flooring: number;
  repair_paint: number;
  repair_other: number;
  wholesale_fee: number;
  closing_costs_pct: number;
  holding_months: number;
  holding_cost_mo: number;
  total_repairs: number | null;
  total_costs: number | null;
  mao: number | null;
  profit_if_flip: number | null;
  created_at: string;
}

// --- Form input types ---

export interface LeadFormData {
  address: string;
  city: string;
  state: string;
  zip: string;
  county?: string;
  owner_name?: string;
  property_type?: PropertyType;
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
  lot_size?: number;
  year_built?: number;
  asking_price?: number;
  arv?: number;
  repair_estimate?: number;
  status?: LeadStatus;
  source?: string;
  notes?: string;
}

export interface DealAnalysisFormData {
  arv: number;
  repair_roof?: number;
  repair_hvac?: number;
  repair_plumbing?: number;
  repair_electrical?: number;
  repair_kitchen?: number;
  repair_bath?: number;
  repair_flooring?: number;
  repair_paint?: number;
  repair_other?: number;
  wholesale_fee?: number;
  closing_costs_pct?: number;
  holding_months?: number;
  holding_cost_mo?: number;
}

export interface CommLogFormData {
  lead_id: string;
  type: CommType;
  direction: CommDirection;
  summary?: string;
}
