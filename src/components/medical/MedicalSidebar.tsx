
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Edit, Hospital, Pill, Plus, Syringe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useBaby } from "@/context/BabyContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface MedicalData {
  id: string;
  baby_id: string;
  blood_type?: string;
  allergies?: string[];
  chronic_conditions?: string[];
  medications?: string[];
  pediatrician_name?: string;
  pediatrician_contact?: string;
  health_insurance?: string;
  health_insurance_number?: string;
  created_at?: string;
  updated_at?: string;
}

interface Vaccine {
  id: string;
  baby_id: string;
  name: string;
  date?: string;
  dose?: string;
  completed: boolean;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

const MedicalSidebar = () => {
  const { currentBaby } = useBaby();
  const [medicalData, setMedicalData] = useState<MedicalData | null>(null);
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [tempMedicalData, setTempMedicalData] = useState<Partial<MedicalData>>({});
  const [newVaccine, setNewVaccine] = useState({ name: "", completed: false });
  const { toast } = useToast();

  const fetchMedicalData = async () => {
    if (!currentBaby) return;
    
    setLoading(true);
    try {
      // Obter dados médicos
      const { data, error } = await supabase
        .from('medical_data')
        .select('*')
        .eq('baby_id', currentBaby.id)
        .maybeSingle();
        
      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setMedicalData(data);
        setTempMedicalData(data);
      } else {
        setMedicalData(null);
        setTempMedicalData({
          baby_id: currentBaby.id,
        });
      }
      
      // Obter vacinas
      const { data: vaccineData, error: vaccineError } = await supabase
        .from('vaccines')
        .select('*')
        .eq('baby_id', currentBaby.id)
        .order('created_at', { ascending: true });
        
      if (vaccineError) throw vaccineError;
      
      setVaccines(vaccineData || []);
    } catch (error) {
      console.error('Error fetching medical data:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados médicos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const saveMedicalData = async () => {
    if (!currentBaby) return;
    
    try {
      if (medicalData?.id) {
        // Atualizar dados existentes
        const { error } = await supabase
          .from('medical_data')
          .update(tempMedicalData)
          .eq('id', medicalData.id);
          
        if (error) throw error;
      } else {
        // Criar novo registro
        const { error } = await supabase
          .from('medical_data')
          .insert({ ...tempMedicalData, baby_id: currentBaby.id });
          
        if (error) throw error;
      }
      
      toast({
        title: "Sucesso",
        description: "Dados médicos salvos com sucesso",
      });
      
      // Recarregar dados
      fetchMedicalData();
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving medical data:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar os dados médicos",
        variant: "destructive",
      });
    }
  };

  const addVaccine = async () => {
    if (!currentBaby || !newVaccine.name.trim()) return;
    
    try {
      const { error } = await supabase
        .from('vaccines')
        .insert({ 
          baby_id: currentBaby.id,
          name: newVaccine.name,
          completed: newVaccine.completed
        });
        
      if (error) throw error;
      
      setNewVaccine({ name: "", completed: false });
      fetchMedicalData(); // Recarregar vacinas
    } catch (error) {
      console.error('Error adding vaccine:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a vacina",
        variant: "destructive",
      });
    }
  };

  const toggleVaccine = async (id: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('vaccines')
        .update({ completed: !completed })
        .eq('id', id);
        
      if (error) throw error;
      
      setVaccines(vaccines.map(vaccine => 
        vaccine.id === id 
          ? { ...vaccine, completed: !vaccine.completed } 
          : vaccine
      ));
    } catch (error) {
      console.error('Error updating vaccine status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status da vacina",
        variant: "destructive",
      });
    }
  };

  const deleteVaccine = async (id: string) => {
    try {
      const { error } = await supabase
        .from('vaccines')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setVaccines(vaccines.filter(vaccine => vaccine.id !== id));
    } catch (error) {
      console.error('Error deleting vaccine:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a vacina",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchMedicalData();
  }, [currentBaby]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Carregando dados médicos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center">
              <Hospital className="h-5 w-5 mr-2" />
              Dados Médicos
            </CardTitle>
            
            {isEditing ? (
              <div className="flex space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setTempMedicalData(medicalData || { baby_id: currentBaby?.id });
                    setIsEditing(false);
                  }}
                >
                  Cancelar
                </Button>
                <Button size="sm" onClick={saveMedicalData}>
                  Salvar
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-1" />
                Editar
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="blood_type">Tipo Sanguíneo</Label>
                  <Input
                    id="blood_type"
                    placeholder="Ex: O+"
                    value={tempMedicalData.blood_type || ""}
                    onChange={(e) => setTempMedicalData({...tempMedicalData, blood_type: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pediatrician_name">Pediatra</Label>
                  <Input
                    id="pediatrician_name"
                    placeholder="Nome do pediatra"
                    value={tempMedicalData.pediatrician_name || ""}
                    onChange={(e) => setTempMedicalData({...tempMedicalData, pediatrician_name: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="health_insurance">Plano de Saúde</Label>
                  <Input
                    id="health_insurance"
                    placeholder="Nome do plano"
                    value={tempMedicalData.health_insurance || ""}
                    onChange={(e) => setTempMedicalData({...tempMedicalData, health_insurance: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="health_insurance_number">Número do Plano</Label>
                  <Input
                    id="health_insurance_number"
                    placeholder="Número da carteirinha"
                    value={tempMedicalData.health_insurance_number || ""}
                    onChange={(e) => setTempMedicalData({...tempMedicalData, health_insurance_number: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="allergies">Alergias (separadas por vírgula)</Label>
                <Input
                  id="allergies"
                  placeholder="Ex: Leite, Ovo, Poeira"
                  value={tempMedicalData.allergies?.join(', ') || ""}
                  onChange={(e) => setTempMedicalData({
                    ...tempMedicalData, 
                    allergies: e.target.value ? e.target.value.split(',').map(item => item.trim()) : []
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="chronic_conditions">Condições Crônicas (separadas por vírgula)</Label>
                <Input
                  id="chronic_conditions"
                  placeholder="Ex: Asma, Eczema"
                  value={tempMedicalData.chronic_conditions?.join(', ') || ""}
                  onChange={(e) => setTempMedicalData({
                    ...tempMedicalData, 
                    chronic_conditions: e.target.value ? e.target.value.split(',').map(item => item.trim()) : []
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="medications">Medicamentos (separados por vírgula)</Label>
                <Input
                  id="medications"
                  placeholder="Ex: Vitamina D, Probióticos"
                  value={tempMedicalData.medications?.join(', ') || ""}
                  onChange={(e) => setTempMedicalData({
                    ...tempMedicalData, 
                    medications: e.target.value ? e.target.value.split(',').map(item => item.trim()) : []
                  })}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {!medicalData && !isEditing ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-3">
                    Nenhum dado médico registrado ainda
                  </p>
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    Adicionar Dados Médicos
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Tipo Sanguíneo</p>
                      <p className="text-sm text-muted-foreground">
                        {medicalData?.blood_type || "Não informado"}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium">Pediatra</p>
                      <p className="text-sm text-muted-foreground">
                        {medicalData?.pediatrician_name || "Não informado"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Plano de Saúde</p>
                      <p className="text-sm text-muted-foreground">
                        {medicalData?.health_insurance || "Não informado"}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium">Número do Plano</p>
                      <p className="text-sm text-muted-foreground">
                        {medicalData?.health_insurance_number || "Não informado"}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Alergias</p>
                    {medicalData?.allergies?.length ? (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {medicalData.allergies.map((allergy, index) => (
                          <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                            {allergy}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Nenhuma alergia registrada</p>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Condições Crônicas</p>
                    {medicalData?.chronic_conditions?.length ? (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {medicalData.chronic_conditions.map((condition, index) => (
                          <span key={index} className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                            {condition}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Nenhuma condição registrada</p>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Medicamentos</p>
                    {medicalData?.medications?.length ? (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {medicalData.medications.map((medication, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {medication}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Nenhum medicamento registrado</p>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Seção de Vacinas */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center">
              <Syringe className="h-5 w-5 mr-2" />
              Carteira de Vacinação
            </CardTitle>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {/* Formulário para adicionar vacina */}
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Adicionar vacina"
                value={newVaccine.name}
                onChange={(e) => setNewVaccine({...newVaccine, name: e.target.value})}
                className="flex-grow"
              />
              <Button onClick={addVaccine} disabled={!newVaccine.name.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Lista de vacinas */}
            {vaccines.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-muted-foreground">Nenhuma vacina registrada</p>
              </div>
            ) : (
              <div className="space-y-2">
                {vaccines.map((vaccine) => (
                  <div 
                    key={vaccine.id} 
                    className="flex items-center justify-between p-2 border rounded hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={vaccine.completed}
                        onCheckedChange={() => toggleVaccine(vaccine.id, vaccine.completed)}
                        id={`vaccine-${vaccine.id}`}
                      />
                      <label 
                        htmlFor={`vaccine-${vaccine.id}`} 
                        className={`text-sm ${vaccine.completed ? 'line-through text-muted-foreground' : ''}`}
                      >
                        {vaccine.name}
                      </label>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-destructive opacity-60 hover:opacity-100"
                      onClick={() => deleteVaccine(vaccine.id)}
                    >
                      <Pill className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalSidebar;
