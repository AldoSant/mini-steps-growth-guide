
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { BabyProvider } from "./context/BabyContext";
import { MilestoneProvider } from "./context/MilestoneContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PWAInstallBanner from "./components/PWAInstallBanner";
import AppStatusIndicator from "./components/AppStatusIndicator";
import FloatingMenu from "./components/FloatingMenu";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import BabyDiary from "./pages/BabyDiary";
import Activities from "./pages/Activities";
import ActivityDetails from "./pages/ActivityDetails";
import Library from "./pages/Library";
import LibraryDetails from "./pages/LibraryDetails";
import BabyProfile from "./pages/BabyProfile";
import MedicalHistory from "./pages/MedicalHistory";
import Subscription from "./pages/Subscription";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";

// Configure o QueryClient para melhor suporte offline
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 24 * 60 * 60 * 1000, // 24 horas (para suporte offline)
      refetchOnWindowFocus: false, // Melhor UX para PWA
      refetchOnMount: true
    },
    mutations: {
      retry: 2,
      retryDelay: 1000
    }
  }
});

const App = () => {
  // Registrar o service worker assim que o app carregar
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then(registration => {
            console.log('Service Worker registrado com sucesso:', registration.scope);
          })
          .catch(error => {
            console.error('Falha ao registrar o Service Worker:', error);
          });
      });
    }
    
    // Função para lidar com atualizações do service worker
    const handleServiceWorkerUpdate = () => {
      navigator.serviceWorker.ready.then(registration => {
        registration.addEventListener('updatefound', () => {
          const installingWorker = registration.installing;
          if (installingWorker == null) return;
          
          installingWorker.addEventListener('statechange', () => {
            if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('Nova versão disponível, pronto para atualizar.');
            }
          });
        });
      });
    };
    
    if ('serviceWorker' in navigator) {
      handleServiceWorkerUpdate();
    }
    
    // Registrar ouvintes para mensagens do service worker
    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'CACHE_UPDATED') {
        console.log('Recursos em cache atualizados:', event.data.url);
      }
    };
    
    navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
    
    return () => {
      navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BabyProvider>
          <MilestoneProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/assinatura" element={<Subscription />} />
                  
                  {/* Rotas protegidas */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/diario" element={<BabyDiary />} />
                    <Route path="/atividades" element={<Activities />} />
                    <Route path="/atividades/:id" element={<ActivityDetails />} />
                    <Route path="/biblioteca" element={<Library />} />
                    <Route path="/biblioteca/:id" element={<LibraryDetails />} />
                    <Route path="/perfil" element={<BabyProfile />} />
                    <Route path="/historico-medico" element={<MedicalHistory />} />
                  </Route>
                  
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <FloatingMenu />
                <PWAInstallBanner />
                <AppStatusIndicator />
              </BrowserRouter>
            </TooltipProvider>
          </MilestoneProvider>
        </BabyProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
