
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePWA } from '@/hooks/usePWA';

export default function PWAInstallBanner() {
  const { isInstallable, isInstalled, promptInstall } = usePWA();
  const [dismissed, setDismissed] = useState(false);

  if (!isInstallable || isInstalled || dismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-16 inset-x-0 mx-auto w-11/12 max-w-md z-50"
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
              onClick={() => setDismissed(true)}
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
