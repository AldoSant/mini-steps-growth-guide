
import { supabase } from "@/integrations/supabase/client";
import { Activity } from "@/types";

export async function getActivitiesByAge(ageInMonths: number) {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .lte('recommended_age_min', ageInMonths)
    .gte('recommended_age_max', ageInMonths)
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar atividades:', error);
    throw error;
  }

  return data as Activity[];
}

export async function createActivity(activity: Omit<Activity, 'id' | 'created_at' | 'created_by'>) {
  const { data, error } = await supabase
    .from('activities')
    .insert({
      ...activity,
      created_by: (await supabase.auth.getUser()).data.user?.id,
    })
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar atividade:', error);
    throw error;
  }

  return data as Activity;
}
