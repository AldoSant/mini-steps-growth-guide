
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster"

// Page imports
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import BabyDiary from "@/pages/BabyDiary";
import BabyProfile from "@/pages/BabyProfile";
import Activities from "@/pages/Activities";
import ActivityDetails from "@/pages/ActivityDetails";
import Library from "@/pages/Library";
import LibraryDetails from "@/pages/LibraryDetails";
import Subscription from "@/pages/Subscription";
import MedicalHistory from "@/pages/MedicalHistory";
import NotFound from "@/pages/NotFound";
import CreateContent from "@/pages/CreateContent";
import UserProfile from "@/pages/UserProfile";

// Context Providers
import { AuthProvider } from "@/context/AuthContext";
import { BabyProvider } from "@/context/BabyContext";
import { MilestoneProvider } from "@/context/MilestoneContext";
import { EventProvider } from "@/context/EventContext";
import { ActivityProvider } from "@/context/ActivityContext";
import { ArticleProvider } from "@/context/ArticleContext";
import { MedicalDataProvider } from "@/context/MedicalDataContext";

// Components
import ProtectedRoute from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <BabyProvider>
        <MilestoneProvider>
          <EventProvider>
            <ActivityProvider>
              <ArticleProvider>
                <MedicalDataProvider>
                  {children}
                </MedicalDataProvider>
              </ArticleProvider>
            </ActivityProvider>
          </EventProvider>
        </MilestoneProvider>
      </BabyProvider>
    </AuthProvider>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Providers>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/diario" element={<BabyDiary />} />
              <Route path="/perfil/:id" element={<BabyProfile />} />
              <Route path="/perfil" element={<UserProfile />} />
              <Route path="/atividades" element={<Activities />} />
              <Route path="/atividades/:id" element={<ActivityDetails />} />
              <Route path="/biblioteca" element={<Library />} />
              <Route path="/biblioteca/:id" element={<LibraryDetails />} />
              <Route path="/assinatura" element={<Subscription />} />
              <Route path="/historico-medico" element={<MedicalHistory />} />
              <Route path="/criar-conteudo" element={<CreateContent />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </Providers>
    </QueryClientProvider>
  );
};

export default App;
