
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { setupAllInitialData } from "@/scripts/populateActivities";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DataInitializerProps {
  onClose: () => void;
}

const DataInitializer = ({ onClose }: DataInitializerProps) => {
  const [initializing, setInitializing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const { toast } = useToast();

  const handleInitialize = async () => {
    setInitializing(true);
    try {
      const result = await setupAllInitialData();
      if (result) {
        toast({
          title: "Dados inicializados",
          description: "Os dados iniciais foram carregados com sucesso.",
        });
        setCompleted(true);
        setTimeout(onClose, 2000); // Fecha automaticamente após 2 segundos
      } else {
        toast({
          title: "Inicialização parcial",
          description: "Alguns dados já existem e não foram reinseridos.",
          variant: "default",
        });
        setCompleted(true);
        setTimeout(onClose, 2000);
      }
    } catch (error) {
      toast({
        title: "Erro na inicialização",
        description: "Não foi possível carregar os dados iniciais.",
        variant: "destructive",
      });
    } finally {
      setInitializing(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-lg font-medium mb-4">Inicialização de Dados para MVP</h3>
      <p className="text-gray-600 mb-6">
        Para testar o MVP, vamos carregar dados iniciais de marcos de desenvolvimento e atividades recomendadas.
        Isso permitirá que a aplicação funcione normalmente para demonstração e validação.
      </p>
      {completed ? (
        <div className="bg-green-50 p-4 rounded-md text-green-700 mb-4">
          Dados inicializados com sucesso!
        </div>
      ) : (
        <Button 
          onClick={handleInitialize} 
          disabled={initializing} 
          className="w-full bg-minipassos-purple hover:bg-minipassos-purple-dark"
        >
          {initializing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Inicializando...
            </>
          ) : (
            'Carregar Dados Iniciais'
          )}
        </Button>
      )}
      
      {!completed && (
        <Button 
          variant="outline" 
          onClick={onClose} 
          className="w-full mt-3" 
          disabled={initializing}
        >
          Cancelar
        </Button>
      )}
    </div>
  );
};

export default DataInitializer;
