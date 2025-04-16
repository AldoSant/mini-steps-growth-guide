
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBaby } from "@/context/BabyContext";
import { useMilestone } from "@/context/MilestoneContext";
import { useAuth } from "@/context/AuthContext";
import { getCurrentAgeInMonths } from "@/lib/date-utils";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, LayoutGrid, FileText, Activity, Clock } from "lucide-react";

// Imported components
import BabySidebar from "@/components/dashboard/BabySidebar";
import WelcomeScreen from "@/components/dashboard/WelcomeScreen";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import DashboardMilestones from "@/components/dashboard/DashboardMilestones";
import DashboardActivities from "@/components/dashboard/DashboardActivities";
import ProfessionalDashboard from "@/components/professional/ProfessionalDashboard";

const Dashboard = () => {
  const { babies, currentBaby } = useBaby();
  const { milestones, babyMilestones } = useMilestone();
  const { userRole, userProfile } = useAuth();
  
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
  
  // Check if user is a professional
  const isProfessional = userRole === 'professional' || userRole === 'admin';
  
  // Default to professional dashboard view if user is a professional and has no babies
  const [viewMode, setViewMode] = useState<'parent' | 'professional'>(
    (isProfessional && babies.length === 0) ? 'professional' : 'parent'
  );
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8 bg-gray-50">
        <div className="container">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
              {isProfessional && (
                <div className="flex items-center mt-1">
                  <Badge className="bg-marcos-purple">Conta Profissional</Badge>
                  {userProfile && !userProfile.is_verified && (
                    <Badge variant="outline" className="ml-2 text-amber-600 border-amber-600">
                      Em verificação
                    </Badge>
                  )}
                  {userProfile && userProfile.is_verified && (
                    <Badge variant="outline" className="ml-2 text-emerald-600 border-emerald-600">
                      Verificado
                    </Badge>
                  )}
                </div>
              )}
            </div>
            
            {isProfessional && babies.length > 0 && (
              <div className="flex gap-2">
                <Badge 
                  variant={viewMode === 'parent' ? 'default' : 'outline'}
                  className={`cursor-pointer ${viewMode === 'parent' ? 'bg-marcos-purple' : ''}`}
                  onClick={() => setViewMode('parent')}
                >
                  <LayoutGrid className="h-4 w-4 mr-1" />
                  Pai/Mãe
                </Badge>
                <Badge 
                  variant={viewMode === 'professional' ? 'default' : 'outline'} 
                  className={`cursor-pointer ${viewMode === 'professional' ? 'bg-marcos-purple' : ''}`}
                  onClick={() => setViewMode('professional')}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Profissional
                </Badge>
              </div>
            )}
          </div>
          
          {/* Professional verification notice */}
          {isProfessional && userProfile && !userProfile.is_verified && (
            <Alert className="mb-6 border-amber-200 bg-amber-50">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800">Conta em verificação</AlertTitle>
              <AlertDescription className="text-amber-700">
                Sua conta profissional está sendo verificada por nossa equipe. 
                Você será notificado quando puder começar a criar conteúdo.
              </AlertDescription>
            </Alert>
          )}
          
          {/* Determine which view to show */}
          {isProfessional && viewMode === 'professional' ? (
            <ProfessionalDashboard />
          ) : (
            babies.length === 0 ? (
              <WelcomeScreen isProfessional={isProfessional} />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <BabySidebar />
                
                <div className="lg:col-span-3">
                  {currentBaby && (
                    <Tabs defaultValue="overview">
                      <div className="flex justify-between items-center mb-6">
                        <TabsList>
                          <TabsTrigger value="overview">
                            <LayoutGrid className="h-4 w-4 mr-2" />
                            Visão Geral
                          </TabsTrigger>
                          <TabsTrigger value="milestones">
                            <Clock className="h-4 w-4 mr-2" />
                            Marcos
                          </TabsTrigger>
                          <TabsTrigger value="activities">
                            <Activity className="h-4 w-4 mr-2" />
                            Atividades
                          </TabsTrigger>
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
            )
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
