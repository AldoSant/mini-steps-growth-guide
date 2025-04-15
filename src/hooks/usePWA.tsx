
import { useState, useEffect } from 'react';

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

  // Check if app is already installed
  useEffect(() => {
    const checkInstalled = () => {
      // Check if display-mode is standalone or PWA criteria
      const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || 
                                 (window.navigator as any).standalone || 
                                 document.referrer.includes('android-app://');
      
      setStatus(prev => ({
        ...prev,
        isInstalled: isInStandaloneMode
      }));
    };

    checkInstalled();
    window.addEventListener('appinstalled', checkInstalled);
    
    return () => {
      window.removeEventListener('appinstalled', checkInstalled);
    };
  }, []);

  // Capture the beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Store the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Update status
      setStatus(prev => ({
        ...prev,
        isInstallable: true
      }));
      
      console.info('PWA não está instalado, escutando beforeinstallprompt');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    // For debugging
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        console.info('Status do PWA:', status);
      }, 2000);
    }
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [status]);
  
  // Function to prompt user to install PWA
  const promptInstall = async () => {
    if (!deferredPrompt) {
      console.warn('Prompt de instalação não disponível');
      
      // On iOS, just show instructions as we can't automatically prompt
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      if (isIOS) {
        return Promise.reject(new Error('ios_instructions'));
      }
      
      return Promise.reject(new Error('no_prompt_available'));
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const choiceResult = await deferredPrompt.userChoice;
    
    // Update status based on user choice
    setStatus(prev => ({
      ...prev,
      wasDismissed: choiceResult.outcome === 'dismissed'
    }));

    // Clear the deferredPrompt as it can only be used once
    setDeferredPrompt(null);
    
    if (choiceResult.outcome === 'accepted') {
      console.info('Usuário aceitou a instalação do PWA');
      return Promise.resolve();
    } else {
      console.info('Usuário recusou a instalação do PWA');
      return Promise.reject(new Error('user_dismissed'));
    }
  };

  // Get PWA installation instructions for different platforms
  const getInstallInstructions = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isAndroid = /Android/.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    if (isIOS && isSafari) {
      return {
        platform: 'iOS',
        steps: [
          'Toque no ícone de compartilhamento',
          'Role para baixo e toque em "Adicionar à Tela Inicial"',
          'Confirme tocando em "Adicionar"'
        ]
      };
    } else if (isAndroid && /chrome/i.test(navigator.userAgent)) {
      return {
        platform: 'Android',
        steps: [
          'Toque no menu (três pontos)',
          'Toque em "Adicionar à Tela Inicial"',
          'Confirme a instalação'
        ]
      };
    } else {
      return {
        platform: 'Desktop',
        steps: [
          'Clique no ícone de instalação na barra de endereço',
          'Clique em "Instalar"'
        ]
      };
    }
  };
  
  return {
    isInstallable: status.isInstallable,
    isInstalled: status.isInstalled,
    wasDismissed: status.wasDismissed,
    promptInstall,
    getInstallInstructions
  };
};
