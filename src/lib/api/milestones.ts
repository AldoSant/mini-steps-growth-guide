
import { supabase } from "@/integrations/supabase/client";
import { Milestone, BabyMilestone } from "@/types";

export async function getMilestonesByAge(ageInMonths: number) {
  const { data, error } = await supabase
    .from('milestones')
    .select('*')
    .lte('age_range_min', ageInMonths)
    .gte('age_range_max', ageInMonths)
    .order('age_months', { ascending: true });

  if (error) {
    console.error('Erro ao buscar marcos:', error);
    throw error;
  }

  return data as Milestone[];
}

export async function getBabyMilestones(babyId: string) {
  const { data, error } = await supabase
    .from('baby_milestones')
    .select('*, milestone:milestones(*)')
    .eq('baby_id', babyId)
    .order('completion_date', { ascending: false });

  if (error) {
    console.error('Erro ao buscar marcos do bebê:', error);
    throw error;
  }

  return data as BabyMilestone[];
}

export async function updateBabyMilestone(
  babyId: string,
  milestoneId: string,
  completed: boolean,
  notes?: string
) {
  const { error } = await supabase
    .from('baby_milestones')
    .upsert({
      baby_id: babyId,
      milestone_id: milestoneId,
      completed,
      completion_date: completed ? new Date().toISOString() : null,
      notes,
    });

  if (error) {
    console.error('Erro ao atualizar marco:', error);
    throw error;
  }
}
