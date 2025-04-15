
import { useEffect, useState } from "react";
import { Download, X, Info, CheckCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePWA } from "@/hooks/usePWA";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const PWAInstallBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const { isInstallable, promptInstall, isInstalled, getInstallInstructions } = usePWA();
  const { toast } = useToast();
  const [installAttempted, setInstallAttempted] = useState(false);

  // Verifica se precisa mostrar o banner
  useEffect(() => {
    if (isInstallable && !isInstalled) {
      const hasSeenBanner = localStorage.getItem('pwa_banner_dismissed');
      const lastPrompt = parseInt(localStorage.getItem('pwa_last_prompt') || '0');
      const now = Date.now();
      const threeDays = 3 * 24 * 60 * 60 * 1000; // 3 dias em milissegundos
      
      // Mostrar o banner se:
      // 1. Nunca foi dispensado OU
      // 2. Foi dispensado mas já se passaram 3 dias desde o último prompt
      if (!hasSeenBanner || (now - lastPrompt > threeDays)) {
        // Espere um pouco para não interromper a experiência inicial do usuário
        const timer = setTimeout(() => {
          setShowBanner(true);
          localStorage.setItem('pwa_last_prompt', now.toString());
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [isInstallable, isInstalled]);

  const handleInstall = async () => {
    try {
      setInstallAttempted(true);
      await promptInstall();
      toast({
        title: "Instalação iniciada",
        description: "Siga as instruções na tela para completar a instalação",
        icon: <CheckCircle className="h-4 w-4 text-green-500" />
      });
      setShowBanner(false);
      localStorage.setItem('pwa_banner_dismissed', 'true');
    } catch (error: any) {
      console.error("Error installing PWA:", error);
      
      // Se for erro específico do iOS ou prompt não disponível
      if (error.message === 'ios_instructions' || error.message === 'no_prompt_available') {
        setShowDialog(true);
      } else if (error.message === 'user_dismissed') {
        toast({
          variant: "default",
          title: "Instalação adiada",
          description: "Você pode instalar o app a qualquer momento pelo menu do navegador."
        });
        dismissBanner();
      } else {
        toast({
          variant: "destructive",
          title: "Erro na instalação",
          description: "Não foi possível iniciar a instalação do aplicativo."
        });
      }
    }
  };

  const dismissBanner = () => {
    localStorage.setItem('pwa_banner_dismissed', 'true');
    localStorage.setItem('pwa_last_prompt', Date.now().toString());
    setShowBanner(false);
  };

  // Manuseio das instruções de instalação manual
  const instructions = getInstallInstructions();

  // Não renderizar nada se o banner não deve ser mostrado
  if (!showBanner) return null;

  return (
    <>
      <div className="fixed bottom-0 inset-x-0 pb-safe z-50 animate-slide-up">
        <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg p-4">
          <div className="container mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-minipassos-purple to-minipassos-purple-dark p-3 rounded-full">
                <Download className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 dark:text-gray-100">Instale o MiniPassos</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Acesse mais rápido e tenha recursos offline</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 ml-auto">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowDialog(true)}
                className="text-xs"
              >
                <Info className="h-3 w-3 mr-1" />
                Saiba mais
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={dismissBanner}
                className="rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
              <Button 
                className="bg-minipassos-purple hover:bg-minipassos-purple-dark text-white"
                onClick={handleInstall}
              >
                Instalar App
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Instale o MiniPassos no seu {instructions.platform}</DialogTitle>
            <DialogDescription>
              Acesse o app de forma mais rápida e aproveite recursos offline.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="rounded-lg bg-minipassos-purple/10 p-4">
              <h4 className="font-medium text-sm mb-2 flex items-center text-minipassos-purple">
                <Download className="h-4 w-4 mr-2" />
                Siga estes passos para instalar:
              </h4>
              <ol className="list-decimal pl-5 space-y-2 text-sm">
                {instructions.steps.map((step, i) => (
                  <li key={i} className="text-gray-700 dark:text-gray-300">
                    <div className="flex items-start">
                      <ChevronRight className="h-4 w-4 text-minipassos-purple mr-1 mt-0.5 shrink-0" />
                      <span>{step}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            
            {instructions.platform === 'iOS' && (
              <div className="text-center">
                <img 
                  src="/ios-install-steps.png" 
                  alt="Passos para instalar no iOS" 
                  className="max-w-[200px] mx-auto rounded-lg border"
                />
              </div>
            )}
            
            <div className="text-gray-500 text-sm">
              <p>O MiniPassos funciona como um aplicativo normal após instalado, mas sem ocupar espaço na App Store ou Google Play.</p>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowDialog(false);
                dismissBanner();
              }}
            >
              Lembrar depois
            </Button>
            {!installAttempted && instructions.platform !== 'iOS' && (
              <Button 
                onClick={() => {
                  setShowDialog(false);
                  handleInstall();
                }}
                className="bg-minipassos-purple hover:bg-minipassos-purple-dark"
              >
                Instalar agora
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PWAInstallBanner;
