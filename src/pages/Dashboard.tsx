
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { useBaby } from "@/context/BabyContext";
import { useMilestone } from "@/context/MilestoneContext";
import { getCurrentAgeInMonths } from "@/lib/date-utils";

// Imported refactored components
import BabySidebar from "@/components/dashboard/BabySidebar";
import WelcomeScreen from "@/components/dashboard/WelcomeScreen";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import DashboardMilestones from "@/components/dashboard/DashboardMilestones";
import DashboardActivities from "@/components/dashboard/DashboardActivities";

const Dashboard = () => {
  const { babies, currentBaby } = useBaby();
  const { milestones, babyMilestones } = useMilestone();
  
  // Prepare milestones data for the timeline
  const currentAgeInMonths = getCurrentAgeInMonths(currentBaby);
  
  // Prepare milestone data with completion status
  const preparedMilestones = milestones.map(milestone => {
    const babyMilestone = babyMilestones.find(bm => 
      bm.milestone_id === milestone.id && currentBaby && bm.baby_id === currentBaby.id
    );
    
    return {
      ...milestone,
      completed: babyMilestone ? babyMilestone.completed : false,
      completion_date: babyMilestone ? babyMilestone.completion_date : undefined
    };
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8 bg-gray-50">
        <div className="container">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600">
              Acompanhe o desenvolvimento do seu bebê
            </p>
          </div>
          
          {babies.length === 0 ? (
            <WelcomeScreen />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <BabySidebar />
              
              <div className="lg:col-span-3">
                {currentBaby && (
                  <Tabs defaultValue="overview">
                    <div className="flex justify-between items-center mb-6">
                      <TabsList>
                        <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                        <TabsTrigger value="milestones">Marcos</TabsTrigger>
                        <TabsTrigger value="activities">Atividades</TabsTrigger>
                      </TabsList>
                    </div>
                    
                    <TabsContent value="overview">
                      <DashboardOverview 
                        currentBabyName={currentBaby.name} 
                        preparedMilestones={preparedMilestones}
                        currentAgeInMonths={currentAgeInMonths}
                      />
                    </TabsContent>
                    
                    <TabsContent value="milestones">
                      <DashboardMilestones 
                        currentBabyName={currentBaby.name}
                        preparedMilestones={preparedMilestones}
                        currentAgeInMonths={currentAgeInMonths}
                      />
                    </TabsContent>
                    
                    <TabsContent value="activities">
                      <DashboardActivities currentBabyName={currentBaby.name} />
                    </TabsContent>
                  </Tabs>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
