
import { useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";
import { Wifi, WifiOff } from 'lucide-react';

/**
 * Hook para monitorar o status de conexão de rede do usuário
 * @returns objeto contendo informações sobre o status da rede
 */
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [sinceLastChange, setSinceLastChange] = useState<Date | null>(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setSinceLastChange(new Date());
      
      // Mostra um toast quando a conexão é restaurada
      toast({
        title: "Conexão restaurada",
        description: "Você está online novamente.",
        icon: <Wifi className="h-4 w-4 text-green-500" />,
        duration: 3000,
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSinceLastChange(new Date());
      
      // Mostra um toast quando a conexão é perdida
      toast({
        variant: "destructive",
        title: "Sem conexão",
        description: "Algumas funcionalidades podem estar limitadas.",
        icon: <WifiOff className="h-4 w-4" />,
        duration: 5000,
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    isOnline,
    sinceLastChange,
    // Tempo desde a última alteração em segundos
    timeSinceChange: sinceLastChange 
      ? Math.round((new Date().getTime() - sinceLastChange.getTime()) / 1000)
      : null
  };
};
