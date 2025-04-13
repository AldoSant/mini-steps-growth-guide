
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import MilestoneTimeline from "@/components/MilestoneTimeline";
import { Milestone } from "@/types";
import { Database, Sparkles } from "lucide-react";
import { useState } from "react";
import DataInitializer from "@/components/DataInitializer";
import { useAuth } from "@/context/AuthContext";

interface DashboardOverviewProps {
  currentBabyName: string;
  preparedMilestones: (Milestone & { completed?: boolean; completion_date?: string })[];
  currentAgeInMonths: number;
}

const DashboardOverview = ({ currentBabyName, preparedMilestones, currentAgeInMonths }: DashboardOverviewProps) => {
  const [dataDialogOpen, setDataDialogOpen] = useState(false);
  const { user } = useAuth();
  
  // Verifica se o email é do administrador (você pode adicionar seu email aqui)
  const isAdmin = user?.email === "admin@example.com"; // Substitua pelo seu email

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
              Atividades recomendadas para hoje
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
      
      {/* Inicialização de dados - visível para todos durante o MVP */}
      <Card className="border-dashed border-gray-300 bg-gray-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles size={18} className="text-minipassos-purple" />
            <span>Inicializar Dados do MVP</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-3">
            Para testar todas as funcionalidades do MVP, você pode carregar dados iniciais de marcos de desenvolvimento e atividades.
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full border-minipassos-purple text-minipassos-purple"
            onClick={() => setDataDialogOpen(true)}
          >
            <Database className="mr-2 h-4 w-4" />
            Carregar Dados de Demonstração
          </Button>
        </CardContent>
      </Card>
      
      <Dialog open={dataDialogOpen} onOpenChange={setDataDialogOpen}>
        <DialogContent>
          <DataInitializer />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardOverview;
