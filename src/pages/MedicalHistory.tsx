
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useBaby } from "@/context/BabyContext";
import MedicalSidebar from "@/components/medical/MedicalSidebar";
import MedicalTimeline from "@/components/medical/MedicalTimeline";
import UpcomingVisits from "@/components/medical/UpcomingVisits";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BabySidebar from "@/components/dashboard/BabySidebar";
import { useMobile } from "@/hooks/use-mobile";

const MedicalHistory = () => {
  const { currentBaby } = useBaby();
  const { isMobile } = useMobile();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8 bg-gray-50">
        <div className="container">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Histórico Médico</h1>
            <p className="text-gray-600">
              Acompanhamento pediátrico e visitas médicas
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {!isMobile && <BabySidebar />}
            
            <div className="lg:col-span-3">
              {currentBaby ? (
                <Tabs defaultValue="timeline">
                  <div className="flex justify-between items-center mb-6">
                    <TabsList>
                      <TabsTrigger value="timeline">Histórico</TabsTrigger>
                      <TabsTrigger value="upcoming">Próximas Visitas</TabsTrigger>
                      <TabsTrigger value="sidebar">Dados Médicos</TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <TabsContent value="timeline">
                    <MedicalTimeline />
                  </TabsContent>
                  
                  <TabsContent value="upcoming">
                    <UpcomingVisits />
                  </TabsContent>
                  
                  <TabsContent value="sidebar">
                    <MedicalSidebar />
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="bg-white p-8 rounded-lg shadow text-center">
                  <h3 className="text-xl font-medium mb-2">Nenhum bebê selecionado</h3>
                  <p className="text-muted-foreground mb-4">
                    Selecione ou registre um bebê para acessar o histórico médico
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MedicalHistory;
