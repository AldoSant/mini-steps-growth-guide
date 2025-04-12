import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useBaby } from "@/context/BabyContext";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MedicalAppointment } from "@/types";
import { createMedicalAppointment, updateMedicalAppointment } from "@/lib/supabase-helpers";

interface MedicalAppointmentFormProps {
  appointment?: MedicalAppointment;
  onComplete: () => void;
}

const MedicalAppointmentForm = ({ appointment, onComplete }: MedicalAppointmentFormProps) => {
  const { currentBaby } = useBaby();
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(
    appointment?.appointment_date ? new Date(appointment.appointment_date) : new Date()
  );
  const [formData, setFormData] = useState({
    appointment_date: appointment?.appointment_date || format(new Date(), "yyyy-MM-dd"),
    appointment_time: appointment?.appointment_time || "",
    doctor_name: appointment?.doctor_name || "",
    appointment_type: appointment?.appointment_type || "consulta_rotina",
    location: appointment?.location || "",
    notes: appointment?.notes || "",
    completed: appointment?.completed || false
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      setFormData((prev) => ({
        ...prev,
        appointment_date: format(selectedDate, "yyyy-MM-dd"),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!currentBaby) {
      toast({
        title: "Erro",
        description: "Nenhum bebê selecionado",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const payload = {
        baby_id: currentBaby.id,
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time || null,
        doctor_name: formData.doctor_name,
        appointment_type: formData.appointment_type,
        location: formData.location || null,
        notes: formData.notes || null,
        completed: formData.completed
      };
      
      if (appointment) {
        // Update existing appointment
        await updateMedicalAppointment(appointment.id, payload);
        
        toast({
          title: "Consulta atualizada",
          description: "O agendamento foi atualizado com sucesso",
        });
      } else {
        // Create new appointment
        await createMedicalAppointment(payload);
        
        toast({
          title: "Consulta agendada",
          description: "A consulta foi agendada com sucesso",
        });
      }
      
      if (onComplete) onComplete();
    } catch (error) {
      console.error("Erro ao salvar agendamento:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o agendamento",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-1">
      <div className="space-y-2">
        <Label htmlFor="appointment_date">Data da Consulta</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "dd/MM/yyyy") : <span>Selecione uma data</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="appointment_time">Horário (opcional)</Label>
        <Input
          id="appointment_time"
          name="appointment_time"
          type="time"
          value={formData.appointment_time}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="appointment_type">Tipo de Consulta</Label>
        <Select 
          value={formData.appointment_type} 
          onValueChange={(value) => handleSelectChange("appointment_type", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo de consulta" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="consulta_rotina">Consulta de Rotina</SelectItem>
            <SelectItem value="vacinacao">Vacinação</SelectItem>
            <SelectItem value="exame">Exame</SelectItem>
            <SelectItem value="outro">Outro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="doctor_name">Nome do Médico</Label>
        <Input
          id="doctor_name"
          name="doctor_name"
          value={formData.doctor_name}
          onChange={handleChange}
          placeholder="Nome completo do médico"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Local (opcional)</Label>
        <Input
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Clínica, hospital, etc."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Observações (opcional)</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Motivo da consulta, preparação necessária, etc."
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onComplete}>
          Cancelar
        </Button>
        <Button type="submit">
          {appointment ? "Atualizar" : "Agendar"} Consulta
        </Button>
      </div>
    </form>
  );
};

export default MedicalAppointmentForm;
