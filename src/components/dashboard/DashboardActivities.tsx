
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DashboardActivitiesProps {
  currentBabyName: string;
}

const DashboardActivities = ({ currentBabyName }: DashboardActivitiesProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Atividades recomendadas</CardTitle>
        <CardDescription>
          Atividades para estimular o desenvolvimento de {currentBabyName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-1">Hora do espelho</h3>
            <p className="text-sm text-gray-600 mb-2">
              Posicione o bebê em frente ao espelho e interaja com ele, apontando para partes do rosto.
            </p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Cognitivo • 5-10 min</span>
              <Button size="sm" variant="outline" className="h-7 text-xs">
                Ver detalhes
              </Button>
            </div>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-1">Exploração sensorial</h3>
            <p className="text-sm text-gray-600 mb-2">
              Ofereça diferentes texturas para o bebê tocar e explorar com as mãos.
            </p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Sensorial • 5-10 min</span>
              <Button size="sm" variant="outline" className="h-7 text-xs">
                Ver detalhes
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-center">
          <Button 
            className="bg-minipassos-purple hover:bg-minipassos-purple-dark"
            onClick={() => window.location.href = "/atividades"}
          >
            Ver todas as atividades
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardActivities;
