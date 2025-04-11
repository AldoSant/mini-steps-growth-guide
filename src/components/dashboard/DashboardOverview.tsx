
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MilestoneTimeline from "@/components/MilestoneTimeline";
import { Milestone } from "@/types";

interface DashboardOverviewProps {
  currentBabyName: string;
  preparedMilestones: (Milestone & { completed?: boolean; completion_date?: string })[];
  currentAgeInMonths: number;
}

const DashboardOverview = ({ currentBabyName, preparedMilestones, currentAgeInMonths }: DashboardOverviewProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Próximos marcos</CardTitle>
          <CardDescription>
            Marcos de desenvolvimento previstos para a idade atual
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2">
          <MilestoneTimeline 
            milestones={preparedMilestones} 
            currentMonth={currentAgeInMonths}
          />
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Próximas atividades</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              4 atividades recomendadas para hoje
            </p>
            <div className="mt-2">
              <Button 
                size="sm" 
                className="w-full bg-minipassos-purple hover:bg-minipassos-purple-dark"
                onClick={() => window.location.href = "/atividades"}
              >
                Ver atividades
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Diário</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Registre momentos especiais no diário
            </p>
            <div className="mt-2">
              <Button 
                size="sm" 
                className="w-full bg-minipassos-purple hover:bg-minipassos-purple-dark"
                onClick={() => window.location.href = "/diario"}
              >
                Abrir diário
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Artigos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Conteúdo especializado para a fase atual
            </p>
            <div className="mt-2">
              <Button 
                size="sm" 
                className="w-full bg-minipassos-purple hover:bg-minipassos-purple-dark"
                onClick={() => window.location.href = "/biblioteca"}
              >
                Acessar biblioteca
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
