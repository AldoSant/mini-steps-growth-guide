
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
  getRecentMilestones: (count?: number) => (Milestone & { completed?: boolean; completion_date?: string })[];
  getMilestonesByCategory: (category: string) => (Milestone & { completed?: boolean; completion_date?: string })[];
}

export const MilestoneContext = createContext<MilestoneContextType>({
  milestones: [],
  babyMilestones: [],
  loading: true,
  refreshMilestones: async () => {},
  completeMilestone: async () => {},
  getRecentMilestones: () => [],
  getMilestonesByCategory: () => [],
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
  
  // Get recent milestones (completed or age-appropriate)
  const getRecentMilestones = (count = 5) => {
    if (!currentBaby) return [];
    
    // Prepare milestone data with completion status
    const preparedMilestones = milestones.map(milestone => {
      const babyMilestone = babyMilestones.find(bm => 
        bm.milestone_id === milestone.id && currentBaby && bm.baby_id === currentBaby.id
      );
      
      return {
        ...milestone,
        completed: babyMilestone ? babyMilestone.completed : false,
        completion_date: babyMilestone ? babyMilestone.completion_date : undefined
      };
    });
    
    // Sort by recently completed first, then by appropriate age
    return [...preparedMilestones]
      .sort((a, b) => {
        // First prioritize completed milestones
        if (a.completed && !b.completed) return -1;
        if (!a.completed && b.completed) return 1;
        
        // Then prioritize most recently completed
        if (a.completed && b.completed && a.completion_date && b.completion_date) {
          return new Date(b.completion_date).getTime() - new Date(a.completion_date).getTime();
        }
        
        // Then prioritize by age appropriateness
        return a.age_months - b.age_months;
      })
      .slice(0, count);
  };
  
  // Get milestones by category
  const getMilestonesByCategory = (category: string) => {
    if (!currentBaby) return [];
    
    // Prepare milestone data with completion status
    return milestones
      .filter(milestone => milestone.category === category)
      .map(milestone => {
        const babyMilestone = babyMilestones.find(bm => 
          bm.milestone_id === milestone.id && currentBaby && bm.baby_id === currentBaby.id
        );
        
        return {
          ...milestone,
          completed: babyMilestone ? babyMilestone.completed : false,
          completion_date: babyMilestone ? babyMilestone.completion_date : undefined,
          notes: babyMilestone ? babyMilestone.notes : undefined
        };
      })
      .sort((a, b) => a.age_months - b.age_months);
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
        getRecentMilestones,
        getMilestonesByCategory,
      }}
    >
      {children}
    </MilestoneContext.Provider>
  );
};

export const useMilestone = () => useContext(MilestoneContext);
