"use server";

import { supabase } from "@/lib/supabase";
import type { Lead, LeadFormData, LeadStatus } from "@/types";
import { revalidatePath } from "next/cache";

const USER_ID = "default"; // Will be replaced with Clerk user ID in Phase 3

export async function getLeads(status?: LeadStatus): Promise<Lead[]> {
  let query = supabase
    .from("leads")
    .select("*")
    .eq("user_id", USER_ID)
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching leads:", error);
    return [];
  }

  return (data as Lead[]) ?? [];
}

export async function getLead(id: string): Promise<Lead | null> {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .eq("user_id", USER_ID)
    .single();

  if (error) {
    console.error("Error fetching lead:", error);
    return null;
  }

  return data as Lead;
}

export async function createLead(formData: LeadFormData): Promise<Lead | null> {
  const { data, error } = await supabase
    .from("leads")
    .insert({
      ...formData,
      user_id: USER_ID,
      source: formData.source ?? "manual",
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating lead:", error);
    return null;
  }

  revalidatePath("/leads");
  revalidatePath("/dashboard");
  return data as Lead;
}

export async function updateLead(
  id: string,
  formData: Partial<LeadFormData>
): Promise<Lead | null> {
  const { data, error } = await supabase
    .from("leads")
    .update(formData)
    .eq("id", id)
    .eq("user_id", USER_ID)
    .select()
    .single();

  if (error) {
    console.error("Error updating lead:", error);
    return null;
  }

  revalidatePath("/leads");
  revalidatePath(`/leads/${id}`);
  revalidatePath("/dashboard");
  return data as Lead;
}

export async function updateLeadStatus(
  id: string,
  status: LeadStatus
): Promise<boolean> {
  const { error } = await supabase
    .from("leads")
    .update({ status })
    .eq("id", id)
    .eq("user_id", USER_ID);

  if (error) {
    console.error("Error updating lead status:", error);
    return false;
  }

  revalidatePath("/leads");
  revalidatePath(`/leads/${id}`);
  revalidatePath("/dashboard");
  return true;
}

export async function deleteLead(id: string): Promise<boolean> {
  const { error } = await supabase
    .from("leads")
    .delete()
    .eq("id", id)
    .eq("user_id", USER_ID);

  if (error) {
    console.error("Error deleting lead:", error);
    return false;
  }

  revalidatePath("/leads");
  revalidatePath("/dashboard");
  return true;
}

export async function importLeadsFromCSV(
  rows: LeadFormData[]
): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;

  // Batch insert in chunks of 50
  const chunkSize = 50;
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize).map((row) => ({
      ...row,
      user_id: USER_ID,
      source: "csv_import",
    }));

    const { data, error } = await supabase.from("leads").insert(chunk).select();

    if (error) {
      console.error("Error importing chunk:", error);
      failed += chunk.length;
    } else {
      success += data?.length ?? 0;
    }
  }

  revalidatePath("/leads");
  revalidatePath("/dashboard");
  return { success, failed };
}
