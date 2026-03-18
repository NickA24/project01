"use server";

import { supabase } from "@/lib/supabase";
import type { CommLog, CommLogFormData } from "@/types";
import { revalidatePath } from "next/cache";

export async function getCommLogs(leadId: string): Promise<CommLog[]> {
  const { data, error } = await supabase
    .from("comm_log")
    .select("*")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching comm logs:", error);
    return [];
  }

  return (data as CommLog[]) ?? [];
}

export async function createCommLog(
  formData: CommLogFormData
): Promise<CommLog | null> {
  const { data, error } = await supabase
    .from("comm_log")
    .insert(formData)
    .select()
    .single();

  if (error) {
    console.error("Error creating comm log:", error);
    return null;
  }

  revalidatePath(`/leads/${formData.lead_id}`);
  return data as CommLog;
}

export async function deleteCommLog(
  id: string,
  leadId: string
): Promise<boolean> {
  const { error } = await supabase.from("comm_log").delete().eq("id", id);

  if (error) {
    console.error("Error deleting comm log:", error);
    return false;
  }

  revalidatePath(`/leads/${leadId}`);
  return true;
}
