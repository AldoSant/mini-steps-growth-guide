
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePWA } from '@/hooks/usePWA';
import { useToast } from '@/hooks/use-toast';

export default function PWAInstallBanner() {
  const { isInstallable, isInstalled, promptInstall } = usePWA();
  const [dismissed, setDismissed] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const { toast } = useToast();
  
  // Verifique se o banner foi dispensado anteriormente nesta sessão
  useEffect(() => {
    const wasDismissed = localStorage.getItem('pwa-banner-dismissed');
    
    if (isInstallable && !isInstalled && !wasDismissed) {
      console.log("PWA é instalável e não instalado - mostrando banner");
      // Pequeno atraso para garantir que apareça após o carregamento da página
      const timer = setTimeout(() => {
        setShowBanner(true);
        console.log("Definindo showBanner como true");
      }, 2000);
      
      return () => clearTimeout(timer);
    } else {
      console.log("Status do PWA:", { isInstallable, isInstalled, wasDismissed });
    }
  }, [isInstallable, isInstalled]);

  const handleDismiss = () => {
    setDismissed(true);
    setShowBanner(false);
    // Armazene a dispensa no localStorage para evitar mostrar novamente nesta sessão
    localStorage.setItem('pwa-banner-dismissed', 'true');
    toast({
      title: "Notificação ocultada",
      description: "Você pode instalar o app a qualquer momento nas configurações"
    });
  };

  const handleInstall = async () => {
    try {
      await promptInstall();
      toast({
        title: "Instalação iniciada",
        description: "Siga as instruções para instalar o MiniPassos"
      });
    } catch (error) {
      console.error("Erro na instalação:", error);
      toast({
        title: "Erro na instalação",
        description: "Não foi possível iniciar a instalação",
        variant: "destructive"
      });
    }
  };

  if (!showBanner || dismissed || !isInstallable || isInstalled) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-4 inset-x-0 mx-auto w-11/12 max-w-md z-50"
      >
        <div className="bg-white p-4 rounded-lg shadow-lg border border-minipassos-purple/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-minipassos-purple/10 p-2 rounded-full">
              <Download size={20} className="text-minipassos-purple" />
            </div>
            <div>
              <p className="text-sm font-medium">Instalar MiniPassos</p>
              <p className="text-xs text-gray-500">Acesse diretamente do seu celular</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="h-8 w-8 p-0" 
              onClick={handleDismiss}
              aria-label="Fechar"
            >
              <X size={16} />
              <span className="sr-only">Fechar</span>
            </Button>
            <Button 
              size="sm" 
              className="h-8 bg-minipassos-purple hover:bg-minipassos-purple-dark"
              onClick={handleInstall}
            >
              Instalar
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
