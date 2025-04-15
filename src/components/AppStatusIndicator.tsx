
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { usePWA } from "@/hooks/usePWA";
import { useEffect, useState } from "react";
import { ArrowUpCircle, CloudDown, CloudOff, WifiOff, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import SyncStatusIndicator from "./SyncStatusIndicator";

const AppStatusIndicator = () => {
  const { isOnline } = useNetworkStatus();
  const { checkForUpdates, applyUpdate } = usePWA();
  const [hasUpdate, setHasUpdate] = useState(false);
  const [checkingUpdate, setCheckingUpdate] = useState(false);

  // Verificar atualizações periodicamente
  useEffect(() => {
    const checkUpdates = async () => {
      if (!isOnline) return;
      
      try {
        setCheckingUpdate(true);
        const updateAvailable = await checkForUpdates();
        setHasUpdate(updateAvailable);
      } catch (error) {
        console.error('Erro ao verificar atualizações:', error);
      } finally {
        setCheckingUpdate(false);
      }
    };

    // Verificar inicialmente
    checkUpdates();

    // Verificar a cada 30 minutos
    const interval = setInterval(checkUpdates, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [isOnline, checkForUpdates]);

  // Aplicar atualização quando disponível
  const handleUpdateClick = () => {
    applyUpdate();
    // Recarrega a página após aplicar a atualização
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <>
      {/* Indicador de Conexão */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div 
              className={`fixed bottom-4 right-4 z-50 rounded-full p-2 shadow-md ${
                isOnline ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
              }`}
            >
              {isOnline ? (
                <Wifi className="h-4 w-4 text-green-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-500" />
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent side="left">
            {isOnline 
              ? "Você está conectado à internet" 
              : "Você está offline. Algumas funcionalidades podem estar limitadas."}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Indicador de Atualização */}
      {hasUpdate && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                className="fixed bottom-4 right-14 z-50 h-8 w-8 rounded-full p-0 shadow-md bg-blue-100 dark:bg-blue-900"
                onClick={handleUpdateClick}
              >
                <ArrowUpCircle className="h-4 w-4 text-blue-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              Nova versão disponível. Clique para atualizar.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Indicador de Sincronização */}
      <SyncStatusIndicator />
    </>
  );
};

export default AppStatusIndicator;
