
import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { Baby } from "@/types";
import { toast } from "@/components/ui/use-toast";

interface BabyContextType {
  babies: Baby[];
  loading: boolean;
  currentBaby: Baby | null;
  setCurrentBaby: (baby: Baby | null) => void;
  addBaby: (baby: Omit<Baby, "id" | "user_id" | "created_at" | "updated_at">) => Promise<Baby | null>;
  updateBaby: (id: string, baby: Partial<Baby>) => Promise<Baby | null>;
  deleteBaby: (id: string) => Promise<boolean>;
  refreshBabies: () => Promise<void>;
}

export const BabyContext = createContext<BabyContextType>({
  babies: [],
  loading: true,
  currentBaby: null,
  setCurrentBaby: () => {},
  addBaby: async () => null,
  updateBaby: async () => null,
  deleteBaby: async () => false,
  refreshBabies: async () => {},
});

export const BabyProvider = ({ children }: { children: ReactNode }) => {
  const [babies, setBabies] = useState<Baby[]>([]);
  const [currentBaby, setCurrentBaby] = useState<Baby | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchBabies = async () => {
    if (!user) {
      setBabies([]);
      setCurrentBaby(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('babies')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setBabies(data || []);
      
      // Se temos bebês e nenhum está selecionado, selecionar o primeiro
      if (data && data.length > 0 && !currentBaby) {
        setCurrentBaby(data[0]);
      }
    } catch (error) {
      console.error('Erro ao buscar bebês:', error);
      toast({
        title: "Erro ao carregar bebês",
        description: "Não foi possível carregar a lista de bebês",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addBaby = async (baby: Omit<Baby, "id" | "user_id" | "created_at" | "updated_at">) => {
    if (!user) return null;

    try {
      const newBaby = {
        ...baby,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from('babies')
        .insert(newBaby)
        .select()
        .single();

      if (error) throw error;

      setBabies(prev => [data, ...prev]);
      
      // Se este é o primeiro bebê, definir como atual
      if (babies.length === 0) {
        setCurrentBaby(data);
      }
      
      toast({
        title: "Bebê adicionado",
        description: `${baby.name} foi adicionado com sucesso!`,
      });
      
      return data;
    } catch (error) {
      console.error('Erro ao adicionar bebê:', error);
      toast({
        title: "Erro ao adicionar bebê",
        description: "Não foi possível adicionar o bebê",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateBaby = async (id: string, babyUpdate: Partial<Baby>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('babies')
        .update(babyUpdate)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setBabies(prev => prev.map(b => (b.id === id ? data : b)));
      
      // Atualizar o bebê atual se ele for o que está sendo atualizado
      if (currentBaby && currentBaby.id === id) {
        setCurrentBaby(data);
      }
      
      toast({
        title: "Bebê atualizado",
        description: `As informações de ${data.name} foram atualizadas!`,
      });
      
      return data;
    } catch (error) {
      console.error('Erro ao atualizar bebê:', error);
      toast({
        title: "Erro ao atualizar bebê",
        description: "Não foi possível atualizar as informações",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteBaby = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('babies')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setBabies(prev => prev.filter(b => b.id !== id));
      
      // Se o bebê atual foi excluído, selecionar outro ou null
      if (currentBaby && currentBaby.id === id) {
        const remainingBabies = babies.filter(b => b.id !== id);
        setCurrentBaby(remainingBabies.length > 0 ? remainingBabies[0] : null);
      }
      
      toast({
        title: "Bebê removido",
        description: "O registro foi removido com sucesso",
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao excluir bebê:', error);
      toast({
        title: "Erro ao remover bebê",
        description: "Não foi possível remover o registro",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchBabies();
  }, [user]);

  return (
    <BabyContext.Provider
      value={{
        babies,
        loading,
        currentBaby,
        setCurrentBaby,
        addBaby,
        updateBaby,
        deleteBaby,
        refreshBabies: fetchBabies,
      }}
    >
      {children}
    </BabyContext.Provider>
  );
};

export const useBaby = () => useContext(BabyContext);
