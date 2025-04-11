
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Clock, Baby } from "lucide-react";
import MilestoneTimeline from "@/components/MilestoneTimeline";
import { Milestone } from "@/types";

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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Marcos de desenvolvimento</CardTitle>
        <CardDescription>
          Acompanhe o progresso de {currentBabyName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <MilestoneTimeline 
            milestones={preparedMilestones}
            currentMonth={currentAgeInMonths}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="font-semibold mb-3 flex items-center text-minipassos-purple">
                <Check size={16} className="mr-2" />
                Marcos alcançados
              </h3>
              <div className="space-y-2">
                {preparedMilestones
                  .filter(m => m.completed)
                  .slice(0, 2)
                  .map(milestone => (
                    <div key={milestone.id} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg border border-green-100">
                      <Check size={16} className="text-green-500" />
                      <span className="text-sm">{milestone.title}</span>
                    </div>
                  ))}
                {preparedMilestones.filter(m => m.completed).length === 0 && (
                  <p className="text-sm text-gray-500 p-2">
                    Nenhum marco alcançado ainda
                  </p>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3 flex items-center text-yellow-600">
                <Clock size={16} className="mr-2" />
                Próximos marcos
              </h3>
              <div className="space-y-2">
                {preparedMilestones
                  .filter(m => !m.completed && m.age_months >= currentAgeInMonths)
                  .slice(0, 2)
                  .map(milestone => (
                    <div key={milestone.id} className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg border border-yellow-100">
                      <Clock size={16} className="text-yellow-500" />
                      <span className="text-sm">{milestone.title}</span>
                    </div>
                  ))}
                {preparedMilestones.filter(m => !m.completed && m.age_months >= currentAgeInMonths).length === 0 && (
                  <p className="text-sm text-gray-500 p-2">
                    Não há próximos marcos para exibir
                  </p>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3 flex items-center">
                <Baby size={16} className="mr-2" />
                Distribuição
              </h3>
              <div className="space-y-2">
                {["motor", "cognitivo", "social", "linguagem"].map(category => {
                  const total = preparedMilestones.filter(m => m.category === category).length;
                  const completed = preparedMilestones.filter(m => m.category === category && m.completed).length;
                  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
                  
                  return (
                    <div key={category} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                        <span>{percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            category === "motor" ? "bg-minipassos-purple" :
                            category === "cognitivo" ? "bg-minipassos-blue" :
                            category === "social" ? "bg-minipassos-green" :
                            "bg-minipassos-purple-dark"
                          }`} 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardMilestones;
