-- Wholesale Engine: Initial Schema
-- Run this in your Supabase SQL Editor to set up the database

-- Leads table: the core entity
CREATE TABLE leads (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  address       text NOT NULL,
  city          text NOT NULL,
  state         text NOT NULL,
  zip           text NOT NULL,
  county        text,
  owner_name    text,
  property_type text CHECK (property_type IN ('SFH','MFH','Condo','Townhouse','Land','Commercial')),
  bedrooms      int,
  bathrooms     numeric(3,1),
  sqft          int,
  lot_size      numeric(10,2),
  year_built    int,

  -- Deal analysis fields
  asking_price    numeric(12,2),
  arv             numeric(12,2),
  repair_estimate numeric(12,2),
  mao             numeric(12,2),

  -- Pipeline
  status        text DEFAULT 'new' CHECK (status IN ('new','researching','contacted','offer_sent','under_contract','dead')),
  source        text DEFAULT 'manual',
  notes         text,

  -- Metadata
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now(),
  user_id       text NOT NULL DEFAULT 'default'
);

-- Communication log
CREATE TABLE comm_log (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id     uuid REFERENCES leads(id) ON DELETE CASCADE,
  type        text CHECK (type IN ('call','text','email','door_knock','other')),
  direction   text CHECK (direction IN ('inbound','outbound')),
  summary     text,
  created_at  timestamptz DEFAULT now()
);

-- Deal analysis with detailed repair breakdown
CREATE TABLE deal_analyses (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id         uuid REFERENCES leads(id) ON DELETE CASCADE,
  arv             numeric(12,2),

  -- Repair breakdown
  repair_roof       numeric(10,2) DEFAULT 0,
  repair_hvac       numeric(10,2) DEFAULT 0,
  repair_plumbing   numeric(10,2) DEFAULT 0,
  repair_electrical numeric(10,2) DEFAULT 0,
  repair_kitchen    numeric(10,2) DEFAULT 0,
  repair_bath       numeric(10,2) DEFAULT 0,
  repair_flooring   numeric(10,2) DEFAULT 0,
  repair_paint      numeric(10,2) DEFAULT 0,
  repair_other      numeric(10,2) DEFAULT 0,

  -- Costs
  wholesale_fee     numeric(10,2) DEFAULT 10000,
  closing_costs_pct numeric(4,2) DEFAULT 3.00,
  holding_months    int DEFAULT 6,
  holding_cost_mo   numeric(10,2) DEFAULT 1500,

  -- Computed (updated by app logic)
  total_repairs     numeric(12,2),
  total_costs       numeric(12,2),
  mao               numeric(12,2),
  profit_if_flip    numeric(12,2),

  created_at        timestamptz DEFAULT now()
);

-- Indexes for common queries
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_user_id ON leads(user_id);
CREATE INDEX idx_leads_city_state ON leads(city, state);
CREATE INDEX idx_leads_zip ON leads(zip);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_comm_log_lead_id ON comm_log(lead_id);
CREATE INDEX idx_deal_analyses_lead_id ON deal_analyses(lead_id);

-- Auto-update updated_at on leads
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
