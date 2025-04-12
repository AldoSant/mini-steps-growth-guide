import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  FileText, 
  Plus, 
  Stethoscope, 
  Trash2,
  Edit
} from "lucide-react";
import { formatDate } from "@/lib/date-utils";
import { useBaby } from "@/context/BabyContext";
import MedicalVisitForm from "./MedicalVisitForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MedicalVisit } from "@/types";
import { getMedicalVisits, deleteMedicalVisit } from "@/lib/supabase-helpers";

const MedicalTimeline = () => {
  const { currentBaby } = useBaby();
  const [medicalVisits, setMedicalVisits] = useState<MedicalVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingVisit, setEditingVisit] = useState<MedicalVisit | null>(null);
  const { toast } = useToast();

  const fetchMedicalVisits = async () => {
    if (!currentBaby) return;
    
    setLoading(true);
    try {
      const data = await getMedicalVisits(currentBaby.id);
      setMedicalVisits(data);
    } catch (error) {
      console.error('Error fetching medical visits:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o histórico médico",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVisit = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este registro médico?")) {
      try {
        await deleteMedicalVisit(id);
        
        setMedicalVisits(medicalVisits.filter(visit => visit.id !== id));
        toast({
          title: "Sucesso",
          description: "Registro médico excluído com sucesso",
        });
      } catch (error) {
        console.error('Error deleting medical visit:', error);
        toast({
          title: "Erro",
          description: "Não foi possível excluir o registro",
          variant: "destructive",
        });
      }
    }
  };

  const handleFormComplete = () => {
    setIsAddDialogOpen(false);
    setEditingVisit(null);
    fetchMedicalVisits();
  };

  useEffect(() => {
    fetchMedicalVisits();
  }, [currentBaby]);

  const getVisitTypeIcon = (type: string) => {
    switch (type) {
      case "consulta_rotina":
        return <Stethoscope className="h-5 w-5" />;
      case "exame":
        return <FileText className="h-5 w-5" />;
      case "vacinacao":
        return <Stethoscope className="h-5 w-5" />;
      default:
        return <Stethoscope className="h-5 w-5" />;
    }
  };

  const getVisitTypeName = (type: string) => {
    switch (type) {
      case "consulta_rotina":
        return "Consulta de Rotina";
      case "exame":
        return "Exame";
      case "vacinacao":
        return "Vacinação";
      default:
        return type;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Histórico de Visitas Médicas</h3>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Adicionar Visita
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Visita Médica</DialogTitle>
            </DialogHeader>
            <MedicalVisitForm onComplete={handleFormComplete} />
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Carregando histórico médico...</p>
        </div>
      ) : medicalVisits.length === 0 ? (
        <div className="text-center py-8 border rounded-md bg-gray-50">
          <Stethoscope className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium mb-2">Nenhuma visita registrada</h3>
          <p className="text-muted-foreground mb-4">
            Registre as consultas médicas e exames do bebê para acompanhar seu desenvolvimento
          </p>
          <Button variant="outline" onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Adicionar Primeira Visita
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {medicalVisits.map((visit) => (
            <div key={visit.id} className="flex gap-4 border-b pb-6 last:border-0">
              <div className="flex-shrink-0 p-2 rounded-full bg-primary/10">
                {getVisitTypeIcon(visit.visit_type)}
              </div>
              
              <div className="flex-grow">
                <div className="flex justify-between">
                  <h4 className="font-medium">{getVisitTypeName(visit.visit_type)}</h4>
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8"
                          onClick={() => setEditingVisit(visit)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Editar Visita Médica</DialogTitle>
                        </DialogHeader>
                        <MedicalVisitForm 
                          visit={visit}
                          onComplete={handleFormComplete}
                        />
                      </DialogContent>
                    </Dialog>
                    
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" 
                      onClick={() => handleDeleteVisit(visit.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground flex items-center mt-1">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  <span>{formatDate(visit.visit_date)}</span>
                  
                  {visit.doctor_name && (
                    <>
                      <span className="mx-2">•</span>
                      <span>Dr(a). {visit.doctor_name}</span>
                    </>
                  )}
                </div>
                
                {(visit.height || visit.weight) && (
                  <div className="mt-2 flex space-x-4 text-sm">
                    {visit.height && (
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        Altura: {visit.height} cm
                      </span>
                    )}
                    {visit.weight && (
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        Peso: {visit.weight} kg
                      </span>
                    )}
                  </div>
                )}
                
                {visit.notes && (
                  <div className="mt-3 text-sm bg-gray-50 p-3 rounded">
                    {visit.notes}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicalTimeline;
