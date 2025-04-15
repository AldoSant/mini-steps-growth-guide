
import { useState, useEffect, useCallback } from 'react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

interface PWAStatus {
  isInstallable: boolean;
  isInstalled: boolean;
  wasDismissed: boolean | null;
}

export const usePWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [status, setStatus] = useState<PWAStatus>({
    isInstallable: false,
    isInstalled: false,
    wasDismissed: null
  });
  const [installInstructions, setInstallInstructions] = useState<{
    platform: string;
    steps: string[];
    images?: string[];
  }>({ platform: '', steps: [] });

  // Verifica se o app já está instalado
  useEffect(() => {
    const checkInstalled = () => {
      // Verifica se o modo de exibição é standalone ou critérios PWA
      const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || 
                               (window.navigator as any).standalone || 
                               document.referrer.includes('android-app://');
      
      setStatus(prev => ({
        ...prev,
        isInstalled: isInStandaloneMode
      }));
    };

    checkInstalled();
    
    // Detecta quando o app é instalado durante a sessão
    window.addEventListener('appinstalled', () => {
      checkInstalled();
      console.log('App instalado com sucesso!');
      // Armazena a informação de que o app foi instalado
      localStorage.setItem('pwa_installed', 'true');
    });
    
    // Detecta quando o app é iniciado no modo standalone
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('App iniciado no modo standalone');
    }
    
    return () => {
      window.removeEventListener('appinstalled', checkInstalled);
    };
  }, []);

  // Captura o evento beforeinstallprompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Previne a exibição do mini-infobar em dispositivos móveis
      e.preventDefault();
      // Armazena o evento para que possa ser acionado posteriormente
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Atualiza o status
      setStatus(prev => ({
        ...prev,
        isInstallable: true
      }));
      
      console.info('PWA: App disponível para instalação');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    // Para depuração
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        console.info('Status do PWA:', status);
      }, 2000);
    }
    
    // Detecta o tipo de plataforma para instruções de instalação
    const detectPlatform = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isIOS = /iphone|ipad|ipod/.test(userAgent) && !(window as any).MSStream;
      const isAndroid = /android/.test(userAgent);
      const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent);
      const isChrome = /chrome/.test(userAgent) && !/edge|edg/.test(userAgent);
      const isFirefox = /firefox/.test(userAgent);
      const isEdge = /edge|edg/.test(userAgent);
      const isSamsung = /samsungbrowser/.test(userAgent);
      
      setInstallInstructions(getInstructionsForPlatform({
        isIOS, isAndroid, isSafari, isChrome, isFirefox, isEdge, isSamsung
      }));
    };
    
    detectPlatform();
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [status]);
  
  // Função para obter instruções específicas por plataforma
  const getInstructionsForPlatform = useCallback(({ 
    isIOS, isAndroid, isSafari, isChrome, isFirefox, isEdge, isSamsung 
  }: {
    isIOS: boolean;
    isAndroid: boolean;
    isSafari: boolean;
    isChrome: boolean;
    isFirefox: boolean;
    isEdge: boolean;
    isSamsung: boolean;
  }) => {
    if (isIOS && isSafari) {
      return {
        platform: 'iOS',
        steps: [
          'Toque no ícone de compartilhamento na parte inferior da tela',
          'Role para baixo e toque em "Adicionar à Tela Inicial"',
          'Confirme tocando em "Adicionar" no canto superior direito'
        ],
        images: ['/pwa-instruction-ios.png']
      };
    } else if (isAndroid && isChrome) {
      return {
        platform: 'Android',
        steps: [
          'Toque no menu (três pontos) no canto superior direito',
          'Toque em "Instalar aplicativo" ou "Adicionar à tela inicial"',
          'Confirme a instalação tocando em "Instalar"'
        ],
        images: ['/pwa-instruction-android.png']
      };
    } else if (isAndroid && isSamsung) {
      return {
        platform: 'Android (Samsung)',
        steps: [
          'Toque no menu (três linhas) no canto inferior direito',
          'Toque em "Adicionar página à" e então "Tela inicial"',
          'Confirme a instalação'
        ]
      };
    } else if (isFirefox) {
      return {
        platform: 'Firefox',
        steps: [
          'Toque no menu (três pontos) na parte inferior da tela',
          'Toque em "Adicionar à Tela Inicial"',
          'Siga as instruções para completar a instalação'
        ]
      };
    } else if (isEdge) {
      return {
        platform: 'Edge',
        steps: [
          'Toque no menu (três pontos) na parte inferior da tela',
          'Toque em "Adicionar à tela inicial"',
          'Confirme a instalação'
        ]
      };
    } else {
      return {
        platform: 'Desktop',
        steps: [
          'Clique no ícone de instalação na barra de endereço (lado direito)',
          'Clique em "Instalar" no prompt que aparece',
          'O MiniPassos será instalado como um aplicativo em seu computador'
        ]
      };
    }
  }, []);
  
  // Função para solicitar a instalação do PWA
  const promptInstall = async () => {
    if (!deferredPrompt) {
      console.warn('Prompt de instalação não disponível');
      
      // No iOS, apenas mostre instruções, pois não podemos solicitar automaticamente
      const userAgent = navigator.userAgent.toLowerCase();
      const isIOS = /iphone|ipad|ipod/.test(userAgent) && !(window as any).MSStream;
      if (isIOS) {
        return Promise.reject(new Error('ios_instructions'));
      }
      
      return Promise.reject(new Error('no_prompt_available'));
    }

    try {
      // Mostra o prompt de instalação
      deferredPrompt.prompt();

      // Aguarda a resposta do usuário ao prompt
      const choiceResult = await deferredPrompt.userChoice;
      
      // Atualiza o status com base na escolha do usuário
      setStatus(prev => ({
        ...prev,
        wasDismissed: choiceResult.outcome === 'dismissed'
      }));

      // Limpa o deferredPrompt pois ele só pode ser usado uma vez
      setDeferredPrompt(null);
      
      if (choiceResult.outcome === 'accepted') {
        console.info('Usuário aceitou a instalação do PWA');
        return Promise.resolve();
      } else {
        console.info('Usuário recusou a instalação do PWA');
        return Promise.reject(new Error('user_dismissed'));
      }
    } catch (error) {
      console.error('Erro ao exibir prompt de instalação:', error);
      return Promise.reject(new Error('prompt_error'));
    }
  };
  
  // Verifica se o app está recebendo atualizações
  const checkForUpdates = useCallback(async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        
        // Força uma verificação de atualização
        await registration.update();
        
        if (registration.waiting) {
          // Há uma atualização esperando para ser instalada
          return true;
        }
        
        return false;
      } catch (error) {
        console.error('Erro ao verificar atualizações:', error);
        return false;
      }
    }
    return false;
  }, []);

  // Aplica as atualizações do service worker
  const applyUpdate = useCallback(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          return true;
        }
        return false;
      });
    }
  }, []);
  
  return {
    isInstallable: status.isInstallable,
    isInstalled: status.isInstalled,
    wasDismissed: status.wasDismissed,
    promptInstall,
    getInstallInstructions: () => installInstructions,
    checkForUpdates,
    applyUpdate
  };
};
