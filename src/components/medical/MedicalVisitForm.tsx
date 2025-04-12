
import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
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

interface MedicalVisit {
  id: string;
  baby_id: string;
  visit_date: string;
  doctor_name: string;
  visit_type: string;
  notes: string;
  height?: number;
  weight?: number;
  created_at?: string;
  updated_at?: string;
}

interface MedicalVisitFormProps {
  visit?: MedicalVisit;
  onComplete: () => void;
}

const MedicalVisitForm = ({ visit, onComplete }: MedicalVisitFormProps) => {
  const { currentBaby } = useBaby();
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(
    visit?.visit_date ? new Date(visit.visit_date) : new Date()
  );
  const [formData, setFormData] = useState({
    visit_date: visit?.visit_date || format(new Date(), "yyyy-MM-dd"),
    doctor_name: visit?.doctor_name || "",
    visit_type: visit?.visit_type || "consulta_rotina",
    notes: visit?.notes || "",
    height: visit?.height || "",
    weight: visit?.weight || ""
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
        visit_date: format(selectedDate, "yyyy-MM-dd"),
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
        visit_date: formData.visit_date,
        doctor_name: formData.doctor_name,
        visit_type: formData.visit_type,
        notes: formData.notes,
        height: formData.height ? parseFloat(formData.height as string) : null,
        weight: formData.weight ? parseFloat(formData.weight as string) : null
      };
      
      if (visit) {
        // Atualizar visita existente
        const { error } = await supabase
          .from("medical_visits")
          .update(payload)
          .eq("id", visit.id);
          
        if (error) throw error;
        
        toast({
          title: "Visita atualizada",
          description: "Os detalhes da visita foram atualizados com sucesso",
        });
      } else {
        // Criar nova visita
        const { error } = await supabase
          .from("medical_visits")
          .insert(payload);
          
        if (error) throw error;
        
        toast({
          title: "Visita registrada",
          description: "A visita médica foi registrada com sucesso",
        });
      }
      
      if (onComplete) onComplete();
    } catch (error) {
      console.error("Erro ao salvar visita médica:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar os dados da visita",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-1">
      <div className="space-y-2">
        <Label htmlFor="visit_date">Data da Visita</Label>
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
        <Label htmlFor="visit_type">Tipo de Visita</Label>
        <Select 
          value={formData.visit_type} 
          onValueChange={(value) => handleSelectChange("visit_type", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo de visita" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="consulta_rotina">Consulta de Rotina</SelectItem>
            <SelectItem value="exame">Exame</SelectItem>
            <SelectItem value="vacinacao">Vacinação</SelectItem>
            <SelectItem value="emergencia">Emergência</SelectItem>
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="weight">Peso (kg)</Label>
          <Input
            id="weight"
            name="weight"
            type="number"
            step="0.01"
            value={formData.weight}
            onChange={handleChange}
            placeholder="Ex: 5.4"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="height">Altura (cm)</Label>
          <Input
            id="height"
            name="height"
            type="number"
            step="0.1"
            value={formData.height}
            onChange={handleChange}
            placeholder="Ex: 60.5"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Anotações da consulta, recomendações médicas, etc."
          rows={4}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onComplete}>
          Cancelar
        </Button>
        <Button type="submit">
          {visit ? "Atualizar" : "Registrar"} Visita
        </Button>
      </div>
    </form>
  );
};

export default MedicalVisitForm;
