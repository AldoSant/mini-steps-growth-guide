
import { Milestone } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useBaby } from "@/context/BabyContext";
import { Loader2 } from "lucide-react";

const MedicalTimeline = () => {
  const { currentBaby } = useBaby();
  
  const { data: medicalVisits, isLoading } = useQuery({
    queryKey: ['medical-visits', currentBaby?.id],
    queryFn: async () => {
      if (!currentBaby) return [];
      
      const { data, error } = await supabase
        .from('medical_visits')
        .select('*')
        .eq('baby_id', currentBaby.id)
        .order('visit_date', { ascending: false });
        
      if (error) {
        console.error('Error fetching medical visits:', error);
        return [];
      }
      
      return data;
    },
    enabled: !!currentBaby
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-marcos-purple" />
      </div>
    );
  }

  if (!medicalVisits || medicalVisits.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">Nenhuma consulta registrada ainda</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {medicalVisits.map((visit) => (
        <div key={visit.id} className="bg-white p-4 rounded-lg border">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-medium">{visit.visit_type}</h3>
              <p className="text-sm text-gray-500">
                {new Date(visit.visit_date).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <span className="text-sm font-medium text-marcos-purple">
              Dr(a). {visit.doctor_name}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 my-4 text-sm">
            {visit.weight && (
              <div>
                <span className="text-gray-500">Peso:</span>
                <span className="ml-2 font-medium">{visit.weight}kg</span>
              </div>
            )}
            {visit.height && (
              <div>
                <span className="text-gray-500">Altura:</span>
                <span className="ml-2 font-medium">{visit.height}cm</span>
              </div>
            )}
          </div>
          
          {visit.notes && (
            <div className="mt-2 text-sm text-gray-600">
              <p>{visit.notes}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MedicalTimeline;
