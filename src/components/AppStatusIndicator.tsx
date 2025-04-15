
import { useEffect, useState } from 'react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { Wifi, WifiOff, RefreshCw, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePWA } from '@/hooks/usePWA';

type ServiceWorkerStatus = 'installing' | 'waiting' | 'active' | 'redundant' | 'none';

const AppStatusIndicator = () => {
  const { isOnline } = useNetworkStatus();
  const { isInstalled, isInstallable, promptInstall } = usePWA();
  const [swStatus, setSwStatus] = useState<ServiceWorkerStatus>('none');
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);

  useEffect(() => {
    // Verifica o status do service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        if (registration.active) {
          setSwStatus('active');
        }
        
        // Verifica se há uma atualização esperando
        if (registration.waiting) {
          setIsUpdateAvailable(true);
          setSwStatus('waiting');
        }
        
        // Configura um listener para atualizações futuras
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            setSwStatus('installing');
            
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setIsUpdateAvailable(true);
                setSwStatus('waiting');
              }
            });
          }
        });
      });
      
      // Configura um evento para ouvir atualizações do service worker
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setIsUpdateAvailable(false);
        setSwStatus('active');
      });
    }
  }, []);
  
  // Atualiza a aplicação
  const updateApp = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      });
    }
  };
  
  // Se não estiver em um ambiente PWA ou não tiver service worker, não mostra nada
  if (!isInstalled && !isInstallable && swStatus === 'none') {
    return null;
  }

  return (
    <div className="fixed bottom-3 right-3 z-40">
      <TooltipProvider delayDuration={300}>
        <div className="flex flex-col gap-2">
          {/* Indicador de status online/offline */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                isOnline ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
              }`}>
                {isOnline ? (
                  <Wifi size={14} className="text-green-600 dark:text-green-400" />
                ) : (
                  <WifiOff size={14} className="text-red-600 dark:text-red-400" />
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>{isOnline ? 'Online' : 'Offline'}</p>
            </TooltipContent>
          </Tooltip>
          
          {/* Botão de atualização disponível */}
          {isUpdateAvailable && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 animate-pulse"
                  onClick={updateApp}
                >
                  <RefreshCw size={14} className="text-blue-600 dark:text-blue-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Nova versão disponível. Clique para atualizar.</p>
              </TooltipContent>
            </Tooltip>
          )}
          
          {/* Botão de instalação do PWA */}
          {!isInstalled && isInstallable && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30"
                  onClick={() => promptInstall()}
                >
                  <Download size={14} className="text-purple-600 dark:text-purple-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Instalar aplicativo</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </TooltipProvider>
    </div>
  );
};

export default AppStatusIndicator;
