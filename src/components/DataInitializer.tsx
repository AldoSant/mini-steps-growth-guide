
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

export default function DataInitializer() {
  const [initializing, setInitializing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleInitialize = async () => {
    setInitializing(true);
    try {
      // Verificar se já existem dados
      const { count: milestonesCount, error: milestonesError } = await supabase
        .from('milestones')
        .select('*', { count: 'exact', head: true });
        
      const { count: activitiesCount, error: activitiesError } = await supabase
        .from('activities')
        .select('*', { count: 'exact', head: true });
        
      if (milestonesError || activitiesError) {
        throw new Error('Erro ao verificar dados existentes');
      }
      
      if ((milestonesCount || 0) > 0 && (activitiesCount || 0) > 0) {
        toast({
          title: "Dados já existem",
          description: "O banco de dados já contém dados de marcos e atividades.",
          variant: "default",
        });
        setCompleted(true);
        setTimeout(() => setOpen(false), 2000);
        return;
      }

      // Para integração futura com sistema real de inicialização de dados
      // Esta é uma versão simplificada que apenas informa o usuário
      toast({
        title: "Funcionalidade em desenvolvimento",
        description: "A inicialização de dados reais será implementada em breve.",
      });
      
      setCompleted(true);
      setTimeout(() => setOpen(false), 2000);
    } catch (error) {
      console.error("Erro na inicialização:", error);
      toast({
        title: "Erro na inicialização",
        description: "Não foi possível verificar ou carregar os dados iniciais.",
        variant: "destructive",
      });
    } finally {
      setInitializing(false);
    }
  };

  return (
    <>
      <Button 
        onClick={() => setOpen(true)}
        className="fixed right-4 top-20 z-50 bg-marcos-purple hover:bg-marcos-purple-dark"
      >
        Gerenciar Dados
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <div className="p-2">
            <h3 className="text-lg font-medium mb-4">Gerenciamento de Dados</h3>
            <p className="text-gray-600 mb-6">
              Esta ferramenta permite verificar e gerenciar os dados básicos do sistema,
              como marcos de desenvolvimento e atividades recomendadas.
            </p>
            {completed ? (
              <div className="bg-green-50 p-4 rounded-md text-green-700 mb-4">
                Verificação concluída!
              </div>
            ) : (
              <Button 
                onClick={handleInitialize} 
                disabled={initializing} 
                className="w-full bg-marcos-purple hover:bg-marcos-purple-dark"
              >
                {initializing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  'Verificar Dados'
                )}
              </Button>
            )}
            
            {!completed && (
              <Button 
                variant="outline" 
                onClick={() => setOpen(false)} 
                className="w-full mt-3" 
                disabled={initializing}
              >
                Cancelar
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
