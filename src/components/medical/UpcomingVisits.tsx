
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Clock, Plus, CheckCircle2, CalendarClock } from "lucide-react";
import { formatDate } from "@/lib/date-utils";
import { supabase } from "@/integrations/supabase/client";
import { useBaby } from "@/context/BabyContext";
import MedicalAppointmentForm from "./MedicalAppointmentForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface MedicalAppointment {
  id: string;
  baby_id: string;
  appointment_date: string;
  appointment_time?: string;
  doctor_name: string;
  appointment_type: string;
  location?: string;
  notes?: string;
  completed: boolean;
  created_at?: string;
  updated_at?: string;
}

const UpcomingVisits = () => {
  const { currentBaby } = useBaby();
  const [appointments, setAppointments] = useState<MedicalAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<MedicalAppointment | null>(null);
  const { toast } = useToast();

  const fetchAppointments = async () => {
    if (!currentBaby) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('medical_appointments')
        .select('*')
        .eq('baby_id', currentBaby.id)
        .order('appointment_date', { ascending: true });
        
      if (error) {
        throw error;
      }
      
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as consultas agendadas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleAppointmentStatus = async (id: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('medical_appointments')
        .update({ completed: !completed })
        .eq('id', id);
        
      if (error) throw error;
      
      setAppointments(appointments.map(appointment => 
        appointment.id === id 
          ? { ...appointment, completed: !appointment.completed } 
          : appointment
      ));
      
      toast({
        title: completed ? "Consulta reaberta" : "Consulta marcada como realizada",
        description: completed 
          ? "A consulta foi marcada como pendente" 
          : "A consulta foi marcada como realizada",
      });
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status da consulta",
        variant: "destructive",
      });
    }
  };

  const deleteAppointment = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este agendamento?")) {
      try {
        const { error } = await supabase
          .from('medical_appointments')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        
        setAppointments(appointments.filter(appointment => appointment.id !== id));
        toast({
          title: "Sucesso",
          description: "Agendamento excluído com sucesso",
        });
      } catch (error) {
        console.error('Error deleting appointment:', error);
        toast({
          title: "Erro",
          description: "Não foi possível excluir o agendamento",
          variant: "destructive",
        });
      }
    }
  };

  const handleFormComplete = () => {
    setIsAddDialogOpen(false);
    setEditingAppointment(null);
    fetchAppointments();
  };

  useEffect(() => {
    fetchAppointments();
  }, [currentBaby]);

  const getAppointmentTypeName = (type: string) => {
    switch (type) {
      case "consulta_rotina":
        return "Consulta de Rotina";
      case "vacinacao":
        return "Vacinação";
      case "exame":
        return "Exame";
      default:
        return type;
    }
  };

  // Filtrar consultas futuras e passadas
  const upcomingAppointments = appointments.filter(a => !a.completed);
  const pastAppointments = appointments.filter(a => a.completed);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">Próximas Consultas</h3>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Agendar Consulta
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agendar Nova Consulta</DialogTitle>
              </DialogHeader>
              <MedicalAppointmentForm onComplete={handleFormComplete} />
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Carregando consultas...</p>
          </div>
        ) : upcomingAppointments.length === 0 ? (
          <div className="text-center py-8 border rounded-md bg-gray-50">
            <CalendarClock className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium mb-2">Nenhuma consulta agendada</h3>
            <p className="text-muted-foreground mb-4">
              Adicione as próximas consultas e exames do bebê
            </p>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Agendar Consulta
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div 
                key={appointment.id} 
                className="flex gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start pt-1">
                  <Checkbox
                    checked={appointment.completed}
                    onCheckedChange={() => toggleAppointmentStatus(appointment.id, appointment.completed)}
                  />
                </div>
                
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <h4 className="font-medium">{getAppointmentTypeName(appointment.appointment_type)}</h4>
                    
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8"
                            onClick={() => setEditingAppointment(appointment)}>
                            Editar
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Editar Consulta</DialogTitle>
                          </DialogHeader>
                          <MedicalAppointmentForm 
                            appointment={appointment}
                            onComplete={handleFormComplete}
                          />
                        </DialogContent>
                      </Dialog>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 text-destructive"
                        onClick={() => deleteAppointment(appointment.id)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground mt-1 flex flex-wrap gap-y-1 gap-x-3">
                    <span className="flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      {formatDate(appointment.appointment_date)}
                    </span>
                    
                    {appointment.appointment_time && (
                      <span className="flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        {appointment.appointment_time}
                      </span>
                    )}
                    
                    {appointment.doctor_name && (
                      <span>Dr(a). {appointment.doctor_name}</span>
                    )}
                  </div>
                  
                  {appointment.location && (
                    <div className="mt-2 text-sm">
                      <span>Local: {appointment.location}</span>
                    </div>
                  )}
                  
                  {appointment.notes && (
                    <div className="mt-2 text-sm bg-gray-100 p-2 rounded">
                      {appointment.notes}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Consultas já realizadas */}
      {pastAppointments.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-6">Consultas Realizadas</h3>
          
          <div className="space-y-4">
            {pastAppointments.map((appointment) => (
              <div 
                key={appointment.id} 
                className="flex gap-4 p-4 border rounded-lg bg-gray-50"
              >
                <div className="flex-shrink-0 text-primary">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <h4 className="font-medium">{getAppointmentTypeName(appointment.appointment_type)}</h4>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => toggleAppointmentStatus(appointment.id, appointment.completed)}
                    >
                      Desfazer
                    </Button>
                  </div>
                  
                  <div className="text-sm text-muted-foreground mt-1">
                    <span className="flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      {formatDate(appointment.appointment_date)}
                    </span>
                  </div>
                  
                  {appointment.notes && (
                    <div className="mt-2 text-sm bg-gray-100 p-2 rounded">
                      {appointment.notes}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingVisits;
