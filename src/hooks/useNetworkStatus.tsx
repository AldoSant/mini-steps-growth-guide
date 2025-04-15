
import { useState, useEffect, useCallback } from 'react';
import { toast } from "@/hooks/use-toast";
import { Wifi, WifiOff, CloudSync } from 'lucide-react';

/**
 * Hook para monitorar o status de conexão de rede do usuário
 * com recursos adicionais para sincronização
 */
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [sinceLastChange, setSinceLastChange] = useState<Date | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingSync, setPendingSync] = useState(false);
  
  // Verifica se há dados pendentes de sincronização
  const checkPendingSyncData = useCallback(async () => {
    if (!('caches' in window)) return false;
    
    try {
      const syncCaches = ['diary-entries-sync', 'medical-data-sync'];
      let hasPending = false;
      
      for (const cacheName of syncCaches) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        if (keys.length > 0) {
          hasPending = true;
          break;
        }
      }
      
      setPendingSync(hasPending);
      return hasPending;
    } catch (error) {
      console.error('Erro ao verificar dados pendentes:', error);
      return false;
    }
  }, []);

  // Tenta sincronizar dados quando a conexão é restabelecida
  const syncData = useCallback(async () => {
    if (!('serviceWorker' in navigator) || !('SyncManager' in window)) return false;
    
    try {
      setIsSyncing(true);
      const registration = await navigator.serviceWorker.ready;
      
      // Registra tarefas de sincronização
      await registration.sync.register('sync-diary-entries');
      await registration.sync.register('sync-medical-data');
      
      // Espera um tempo para a sincronização ocorrer
      setTimeout(() => {
        setIsSyncing(false);
        checkPendingSyncData();
      }, 3000);
      
      return true;
    } catch (error) {
      console.error('Erro ao sincronizar dados:', error);
      setIsSyncing(false);
      return false;
    }
  }, [checkPendingSyncData]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setSinceLastChange(new Date());
      
      // Tenta sincronizar dados quando a conexão é restabelecida
      if (pendingSync) {
        syncData();
        
        toast({
          title: "Sincronizando dados",
          description: (
            <div className="flex items-center">
              <CloudSync className="h-4 w-4 text-blue-500 mr-2 animate-spin" />
              <span>Sincronizando dados salvos offline...</span>
            </div>
          ),
          duration: 5000,
        });
      } else {
        toast({
          title: "Conexão restaurada",
          description: (
            <div className="flex items-center">
              <Wifi className="h-4 w-4 text-green-500 mr-2" />
              <span>Você está online novamente.</span>
            </div>
          ),
          duration: 3000,
        });
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSinceLastChange(new Date());
      
      toast({
        variant: "destructive",
        title: "Sem conexão",
        description: (
          <div className="flex items-center">
            <WifiOff className="h-4 w-4 mr-2" />
            <span>Algumas funcionalidades podem estar limitadas.</span>
          </div>
        ),
        duration: 5000,
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Verifica dados pendentes na inicialização
    checkPendingSyncData();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [pendingSync, syncData, checkPendingSyncData]);

  return {
    isOnline,
    sinceLastChange,
    // Tempo desde a última alteração em segundos
    timeSinceChange: sinceLastChange 
      ? Math.round((new Date().getTime() - sinceLastChange.getTime()) / 1000)
      : null,
    // Novos recursos
    isSyncing,
    pendingSync,
    checkPendingSyncData,
    syncData
  };
};
