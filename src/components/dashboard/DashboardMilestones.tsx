
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Clock, Baby, BookOpen, Award, BarChart } from "lucide-react";
import MilestoneTimeline from "@/components/MilestoneTimeline";
import { Milestone } from "@/types";
import { useState } from "react";
import { useMilestone } from "@/context/MilestoneContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DashboardMilestonesProps {
  currentBabyName: string;
  preparedMilestones: (Milestone & { completed?: boolean; completion_date?: string })[];
  currentAgeInMonths: number;
}

const DashboardMilestones = ({ 
  currentBabyName, 
  preparedMilestones, 
  currentAgeInMonths 
}: DashboardMilestonesProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { getMilestonesByCategory } = useMilestone();
  
  // Filter milestones by category if selected
  const filteredMilestones = selectedCategory === "all" 
    ? preparedMilestones 
    : getMilestonesByCategory(selectedCategory);

  // Group milestones by category
  const motorMilestones = getMilestonesByCategory("motor");
  const cognitiveMilestones = getMilestonesByCategory("cognitivo");
  const socialMilestones = getMilestonesByCategory("social");
  const languageMilestones = getMilestonesByCategory("linguagem");
  
  // Calculate completion percentages by category
  const calculateCompletion = (milestones: (Milestone & { completed?: boolean; })[]) => {
    if (milestones.length === 0) return 0;
    const completed = milestones.filter(m => m.completed).length;
    return Math.round((completed / milestones.length) * 100);
  };
  
  const motorCompletion = calculateCompletion(motorMilestones);
  const cognitiveCompletion = calculateCompletion(cognitiveMilestones);
  const socialCompletion = calculateCompletion(socialMilestones);
  const languageCompletion = calculateCompletion(languageMilestones);
  
  // Calculate overall completion
  const overallCompletion = calculateCompletion(preparedMilestones);
  
  return (
    <div className="space-y-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Desenvolvimento de {currentBabyName}</span>
            <div className="flex items-center text-lg font-normal">
              <Award className="text-minipassos-purple mr-2 h-5 w-5" />
              <span>
                {overallCompletion}% completo
              </span>
            </div>
          </CardTitle>
          <CardDescription>
            Acompanhe o progresso por categoria de desenvolvimento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-minipassos-purple/10 p-4 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-minipassos-purple">Motor</h3>
                <span className="text-sm font-bold">{motorCompletion}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-minipassos-purple h-2 rounded-full" 
                  style={{ width: `${motorCompletion}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-minipassos-blue/10 p-4 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-minipassos-blue">Cognitivo</h3>
                <span className="text-sm font-bold">{cognitiveCompletion}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-minipassos-blue h-2 rounded-full" 
                  style={{ width: `${cognitiveCompletion}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-minipassos-green/10 p-4 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-minipassos-green">Social</h3>
                <span className="text-sm font-bold">{socialCompletion}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-minipassos-green h-2 rounded-full" 
                  style={{ width: `${socialCompletion}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-minipassos-purple-dark/10 p-4 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-minipassos-purple-dark">Linguagem</h3>
                <span className="text-sm font-bold">{languageCompletion}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-minipassos-purple-dark h-2 rounded-full" 
                  style={{ width: `${languageCompletion}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Linha do tempo</CardTitle>
          <CardDescription>Marcos de desenvolvimento por idade</CardDescription>
          <div className="pt-4">
            <Tabs defaultValue="all" onValueChange={setSelectedCategory}>
              <TabsList className="grid grid-cols-5 w-full">
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="motor">Motor</TabsTrigger>
                <TabsTrigger value="cognitivo">Cognitivo</TabsTrigger>
                <TabsTrigger value="social">Social</TabsTrigger>
                <TabsTrigger value="linguagem">Linguagem</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <MilestoneTimeline 
            milestones={filteredMilestones}
            currentMonth={currentAgeInMonths}
          />
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Marcos recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {preparedMilestones
                .filter(m => m.completed)
                .slice(0, 3)
                .map(milestone => (
                  <div key={milestone.id} className="flex items-start gap-2 p-2 bg-green-50 rounded-lg border border-green-100">
                    <Check size={16} className="text-green-500 mt-0.5" />
                    <div>
                      <span className="text-sm font-medium">{milestone.title}</span>
                      <div className="text-xs text-gray-500 mt-1">
                        {milestone.completion_date && `Completado em ${milestone.completion_date.split('-').reverse().join('/')}`}
                      </div>
                    </div>
                  </div>
                ))}
              {preparedMilestones.filter(m => m.completed).length === 0 && (
                <p className="text-sm text-gray-500 p-2">
                  Nenhum marco alcançado ainda
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Próximos marcos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {preparedMilestones
                .filter(m => !m.completed && m.age_months >= currentAgeInMonths)
                .slice(0, 3)
                .map(milestone => (
                  <div key={milestone.id} className="flex items-start gap-2 p-2 bg-amber-50 rounded-lg border border-amber-100">
                    <Clock size={16} className="text-amber-500 mt-0.5" />
                    <div>
                      <span className="text-sm font-medium">{milestone.title}</span>
                      <div className="text-xs text-gray-500 mt-1">
                        Previsto para {milestone.age_months} {milestone.age_months === 1 ? 'mês' : 'meses'}
                      </div>
                    </div>
                  </div>
                ))}
              {preparedMilestones.filter(m => !m.completed && m.age_months >= currentAgeInMonths).length === 0 && (
                <p className="text-sm text-gray-500 p-2">
                  Não há próximos marcos para exibir
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardMilestones;
