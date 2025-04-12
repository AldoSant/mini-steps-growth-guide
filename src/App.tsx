
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { BabyProvider } from "./context/BabyContext";
import { MilestoneProvider } from "./context/MilestoneContext";
import ProtectedRoute from "./components/ProtectedRoute";
import FloatingMenu from "./components/FloatingMenu";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import BabyDiary from "./pages/BabyDiary";
import Activities from "./pages/Activities";
import Library from "./pages/Library";
import BabyProfile from "./pages/BabyProfile";
import MedicalHistory from "./pages/MedicalHistory";
import Subscription from "./pages/Subscription";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
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
                  <Route path="/biblioteca" element={<Library />} />
                  <Route path="/perfil" element={<BabyProfile />} />
                  <Route path="/historico-medico" element={<MedicalHistory />} />
                </Route>
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <FloatingMenu />
            </BrowserRouter>
          </TooltipProvider>
        </MilestoneProvider>
      </BabyProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
