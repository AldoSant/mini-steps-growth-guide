
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePWA } from '@/hooks/usePWA';

export default function PWAInstallBanner() {
  const { isInstallable, isInstalled, promptInstall } = usePWA();
  const [dismissed, setDismissed] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  
  // Check if the banner was previously dismissed in this session
  useEffect(() => {
    const wasDismissed = localStorage.getItem('pwa-banner-dismissed');
    
    if (!wasDismissed && isInstallable && !isInstalled) {
      // Small delay to ensure it appears after page load
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isInstallable, isInstalled]);

  const handleDismiss = () => {
    setDismissed(true);
    setShowBanner(false);
    // Store dismissal in localStorage to prevent showing again in this session
    localStorage.setItem('pwa-banner-dismissed', 'true');
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
              onClick={promptInstall}
            >
              Instalar
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
