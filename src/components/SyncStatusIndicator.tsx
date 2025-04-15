
import React, { useEffect } from 'react';
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { Cloud, CloudOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

/**
 * Componente que exibe o status de sincronização de dados offline
 */
const SyncStatusIndicator: React.FC = () => {
  const { isOnline, isSyncing, pendingSync, syncData, checkPendingSyncData } = useNetworkStatus();
  const { toast } = useToast();

  useEffect(() => {
    // Verifica dados pendentes periodicamente quando online
    if (isOnline) {
      const interval = setInterval(() => {
        checkPendingSyncData();
      }, 60000); // Verifica a cada minuto
      
      return () => clearInterval(interval);
    }
  }, [isOnline, checkPendingSyncData]);

  const handleManualSync = async () => {
    if (!isOnline) {
      toast({
        variant: "destructive",
        title: "Sem conexão",
        description: "Conecte-se à internet para sincronizar os dados."
      });
      return;
    }
    
    toast({
      title: "Sincronização",
      description: "Iniciando sincronização manual..."
    });
    
    await syncData();
  };

  if (!pendingSync && !isSyncing) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            size="sm" 
            variant={isSyncing ? "outline" : "default"}
            className={`fixed bottom-16 right-4 z-50 p-2 shadow-md ${isSyncing ? 'bg-blue-100 dark:bg-blue-900' : 'bg-yellow-100 dark:bg-yellow-900'}`}
            onClick={handleManualSync}
            disabled={isSyncing || !isOnline}
          >
            {isSyncing ? (
              <Cloud className="h-4 w-4 text-blue-500 animate-spin" />
            ) : (
              <CloudOff className="h-4 w-4 text-yellow-500" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          {isSyncing 
            ? "Sincronizando dados..." 
            : "Dados pendentes de sincronização. Clique para sincronizar agora."}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SyncStatusIndicator;
