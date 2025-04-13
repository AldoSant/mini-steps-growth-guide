
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
  
  // Adicione standalone à interface Navigator
  interface Navigator {
    standalone?: boolean;
  }
}

export function usePWA() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // Verifique se o aplicativo já está instalado via display-mode
    const checkIfInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches || 
          (navigator.standalone === true)) {
        setIsInstalled(true);
        console.log('PWA já está instalado (display-mode: standalone)');
        return true;
      }
      return false;
    };

    const isCurrentlyInstalled = checkIfInstalled();
    
    if (!isCurrentlyInstalled) {
      console.log('PWA não está instalado, escutando beforeinstallprompt');
      
      // Ouça o evento beforeinstallprompt
      const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
        // Impedir que o Chrome 67 e anteriores mostrem automaticamente o prompt
        e.preventDefault();
        // Armazene o evento para que possa ser acionado mais tarde
        setInstallPrompt(e);
        setIsInstallable(true);
        console.log('PWA é instalável, beforeinstallprompt disparado');
      };

      // Para depuração - apenas no desenvolvimento
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);

      // Escute as alterações no display-mode
      const mediaQueryList = window.matchMedia('(display-mode: standalone)');
      const handleDisplayModeChange = (e: MediaQueryListEvent) => {
        setIsInstalled(e.matches);
        console.log('Modo de exibição alterado:', e.matches ? 'standalone' : 'browser');
      };
      
      if (mediaQueryList.addEventListener) {
        mediaQueryList.addEventListener('change', handleDisplayModeChange);
      }

      // Escute a instalação do aplicativo
      window.addEventListener('appinstalled', () => {
        setIsInstalled(true);
        setIsInstallable(false);
        setInstallPrompt(null);
        console.log('MiniPassos foi instalado com sucesso!');
      });
      
      // Forçar instalável para depuração - útil para testes
      setTimeout(() => {
        if (!isInstallable) {
          console.log("Forçando isInstallable para true (modo de teste)");
          setIsInstallable(true);
        }
      }, 5000);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
        if (mediaQueryList.removeEventListener) {
          mediaQueryList.removeEventListener('change', handleDisplayModeChange);
        }
      };
    }
  }, []);

  const promptInstall = async () => {
    if (!installPrompt) {
      console.log('Instalação não disponível - installPrompt é null');
      // Simular instalação para depuração
      console.log('Simulando instalação para teste!');
      
      // Mostrar uma mensagem que instrui o usuário
      alert("Para instalar o MiniPassos: \n1. No iOS: toque no botão compartilhar e selecione 'Adicionar à tela inicial'\n2. No Android: toque no menu do navegador (3 pontos) e selecione 'Instalar aplicativo'");
      
      return;
    }

    // Mostre o prompt de instalação
    await installPrompt.prompt();

    // Espere pelo usuário responder ao prompt
    const choiceResult = await installPrompt.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
      console.log('Usuário aceitou a instalação');
    } else {
      console.log('Usuário rejeitou a instalação');
    }

    // Redefina o installPrompt para null
    setInstallPrompt(null);
  };

  return { 
    isInstallable, 
    isInstalled, 
    promptInstall 
  };
}
