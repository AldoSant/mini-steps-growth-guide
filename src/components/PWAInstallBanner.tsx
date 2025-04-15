
import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePWA } from "@/hooks/usePWA";
import { useToast } from "@/components/ui/use-toast";

const PWAInstallBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const { isInstallable, promptInstall, isInstalled } = usePWA();
  const { toast } = useToast();

  // Show banner if PWA is installable and not already showing a toast
  useEffect(() => {
    if (isInstallable && !isInstalled) {
      const hasSeenBanner = localStorage.getItem('pwa_banner_dismissed');
      if (!hasSeenBanner) {
        // Wait a bit before showing the banner to not interrupt initial user experience
        const timer = setTimeout(() => {
          setShowBanner(true);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [isInstallable, isInstalled]);

  const handleInstall = async () => {
    try {
      await promptInstall();
      toast({
        title: "Instalação iniciada",
        description: "Siga as instruções na tela para completar a instalação",
      });
      setShowBanner(false);
    } catch (error) {
      console.error("Error installing PWA:", error);
      toast({
        variant: "destructive",
        title: "Erro na instalação",
        description: "Não foi possível iniciar a instalação do aplicativo."
      });
    }
  };

  const dismissBanner = () => {
    localStorage.setItem('pwa_banner_dismissed', 'true');
    setShowBanner(false);
  };

  // Don't render anything if banner shouldn't be shown
  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 pb-safe z-50">
      <div className="bg-white border-t border-gray-200 shadow-lg p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-minipassos-purple to-minipassos-purple-dark p-3 rounded-full">
              <Download className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Instale o MiniPassos</h3>
              <p className="text-sm text-gray-600">Acesse o app direto da sua tela inicial</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={dismissBanner}
              className="rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
            <Button 
              className="bg-minipassos-purple hover:bg-minipassos-purple-dark"
              onClick={handleInstall}
            >
              Instalar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallBanner;
