
import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
  
  // Add standalone to the Navigator interface
  interface Navigator {
    standalone?: boolean;
  }
}

export function usePWA() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // Check if app is already installed via display-mode
    const checkIfInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches || 
          (navigator.standalone === true)) {
        setIsInstalled(true);
        console.log('PWA is already installed (display-mode: standalone)');
        return true;
      }
      return false;
    };

    const isCurrentlyInstalled = checkIfInstalled();
    
    if (!isCurrentlyInstalled) {
      console.log('PWA is not installed, listening for beforeinstallprompt');
      
      // Listen for the beforeinstallprompt event
      const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later
        setInstallPrompt(e);
        setIsInstallable(true);
        console.log('PWA is installable, beforeinstallprompt fired');
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

      // Listen for display-mode changes
      const mediaQueryList = window.matchMedia('(display-mode: standalone)');
      const handleDisplayModeChange = (e: MediaQueryListEvent) => {
        setIsInstalled(e.matches);
        console.log('Display mode changed:', e.matches ? 'standalone' : 'browser');
      };
      
      if (mediaQueryList.addEventListener) {
        mediaQueryList.addEventListener('change', handleDisplayModeChange);
      }

      // Listen for app install
      window.addEventListener('appinstalled', () => {
        setIsInstalled(true);
        setIsInstallable(false);
        setInstallPrompt(null);
        console.log('MiniPassos foi instalado com sucesso!');
      });
      
      // Force installable for debugging (remove in production)
      // setTimeout(() => setIsInstallable(true), 3000);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        if (mediaQueryList.removeEventListener) {
          mediaQueryList.removeEventListener('change', handleDisplayModeChange);
        }
      };
    }
  }, []);

  const promptInstall = async () => {
    if (!installPrompt) {
      console.log('Instalação não disponível - installPrompt is null');
      return;
    }

    // Show the install prompt
    await installPrompt.prompt();

    // Wait for the user to respond to the prompt
    const choiceResult = await installPrompt.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
      console.log('Usuário aceitou a instalação');
    } else {
      console.log('Usuário rejeitou a instalação');
    }

    // Reset the installPrompt to null
    setInstallPrompt(null);
  };

  return { 
    isInstallable, 
    isInstalled, 
    promptInstall 
  };
}
