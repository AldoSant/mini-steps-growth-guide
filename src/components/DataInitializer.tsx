
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
      
      // Verificar se o bucket de armazenamento para o diário existe e criar se não existir
      const { data: buckets, error: bucketsError } = await supabase
        .storage
        .listBuckets();

      if (bucketsError) {
        throw new Error('Erro ao verificar buckets de armazenamento');
      }
      
      const diaryBucketExists = buckets?.some(bucket => bucket.name === 'diary_images');
      
      if (!diaryBucketExists) {
        const { error: createBucketError } = await supabase
          .storage
          .createBucket('diary_images', { public: true });
          
        if (createBucketError) {
          throw new Error('Erro ao criar bucket de armazenamento para imagens do diário');
        }
        
        toast({
          title: "Bucket de armazenamento criado",
          description: "Bucket para imagens do diário criado com sucesso.",
          variant: "default",
        });
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
      toast({
        title: "Verificação concluída",
        description: "O sistema está configurado corretamente para armazenamento de dados.",
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
        Verificar Sistema
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <div className="p-2">
            <h3 className="text-lg font-medium mb-4">Verificação do Sistema</h3>
            <p className="text-gray-600 mb-6">
              Esta ferramenta permite verificar se o sistema está configurado corretamente 
              para armazenamento de dados e funcionalidades principais.
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
                  'Verificar Sistema'
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
