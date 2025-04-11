
import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Milestone, BabyMilestone } from "@/types";
import { useBaby } from "./BabyContext";
import { toast } from "@/components/ui/use-toast";

interface MilestoneContextType {
  milestones: Milestone[];
  babyMilestones: BabyMilestone[];
  loading: boolean;
  refreshMilestones: () => Promise<void>;
  completeMilestone: (milestoneId: string, completed: boolean, notes?: string) => Promise<void>;
}

export const MilestoneContext = createContext<MilestoneContextType>({
  milestones: [],
  babyMilestones: [],
  loading: true,
  refreshMilestones: async () => {},
  completeMilestone: async () => {},
});

export const MilestoneProvider = ({ children }: { children: ReactNode }) => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [babyMilestones, setBabyMilestones] = useState<BabyMilestone[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentBaby } = useBaby();

  const fetchMilestones = async () => {
    try {
      setLoading(true);
      
      // Fetch all milestones
      const { data: milestonesData, error: milestonesError } = await supabase
        .from('milestones')
        .select('*')
        .order('age_months', { ascending: true });
      
      if (milestonesError) throw milestonesError;
      
      setMilestones(milestonesData || []);
      
      // If there's a current baby selected, fetch their milestone progress
      if (currentBaby) {
        const { data: babyMilestonesData, error: babyMilestonesError } = await supabase
          .from('baby_milestones')
          .select('*, milestone:milestones(*)')
          .eq('baby_id', currentBaby.id);
        
        if (babyMilestonesError) throw babyMilestonesError;
        
        setBabyMilestones(babyMilestonesData || []);
      } else {
        setBabyMilestones([]);
      }
    } catch (error) {
      console.error('Erro ao buscar marcos de desenvolvimento:', error);
      toast({
        title: "Erro ao carregar marcos",
        description: "Não foi possível buscar os marcos de desenvolvimento",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const completeMilestone = async (milestoneId: string, completed: boolean, notes?: string) => {
    if (!currentBaby) return;
    
    try {
      // Check if there's already a baby_milestone record
      const { data: existingRecord } = await supabase
        .from('baby_milestones')
        .select('id')
        .eq('baby_id', currentBaby.id)
        .eq('milestone_id', milestoneId)
        .maybeSingle();
      
      if (existingRecord) {
        // Update existing record
        const { error } = await supabase
          .from('baby_milestones')
          .update({
            completed,
            completion_date: completed ? new Date().toISOString().split('T')[0] : null,
            notes: notes || null,
          })
          .eq('id', existingRecord.id);
        
        if (error) throw error;
      } else {
        // Create new record
        const { error } = await supabase
          .from('baby_milestones')
          .insert({
            baby_id: currentBaby.id,
            milestone_id: milestoneId,
            completed,
            completion_date: completed ? new Date().toISOString().split('T')[0] : null,
            notes: notes || null,
          });
        
        if (error) throw error;
      }
      
      // Refresh milestones
      await fetchMilestones();
      
      toast({
        title: completed ? "Marco completado!" : "Marco desmarcado",
        description: completed ? "Parabéns pelo progresso do seu bebê!" : "O marco foi desmarcado com sucesso",
      });
    } catch (error) {
      console.error('Erro ao atualizar marco:', error);
      toast({
        title: "Erro ao atualizar marco",
        description: "Não foi possível atualizar o status do marco",
        variant: "destructive",
      });
    }
  };
  
  useEffect(() => {
    fetchMilestones();
  }, [currentBaby]);
  
  return (
    <MilestoneContext.Provider
      value={{
        milestones,
        babyMilestones,
        loading,
        refreshMilestones: fetchMilestones,
        completeMilestone,
      }}
    >
      {children}
    </MilestoneContext.Provider>
  );
};

export const useMilestone = () => useContext(MilestoneContext);
