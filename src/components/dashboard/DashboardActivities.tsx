
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useBaby } from "@/context/BabyContext";
import { Activity } from "@/types";
import { getCurrentAgeInMonths, getAgeRangeText } from "@/lib/date-utils";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DashboardActivitiesProps {
  currentBabyName: string;
}

const DashboardActivities = ({ currentBabyName }: DashboardActivitiesProps) => {
  const { currentBaby } = useBaby();
  const navigate = useNavigate();
  const currentAgeInMonths = getCurrentAgeInMonths(currentBaby);
  
  const { data: activities, isLoading } = useQuery({
    queryKey: ['recommended-activities', currentBaby?.id, currentAgeInMonths],
    queryFn: async () => {
      if (!currentBaby) return [];
      
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .lte('min_age_months', currentAgeInMonths)
        .gte('max_age_months', currentAgeInMonths)
        .limit(4);
        
      if (error) {
        console.error('Error fetching activities:', error);
        return [];
      }
      
      return data as Activity[];
    },
    enabled: !!currentBaby
  });
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Atividades recomendadas</CardTitle>
        <CardDescription>
          Atividades para estimular o desenvolvimento de {currentBabyName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-minipassos-purple" />
          </div>
        ) : !activities || activities.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500 mb-4">Ainda não há atividades disponíveis para a idade atual.</p>
            <Button 
              className="bg-minipassos-purple hover:bg-minipassos-purple-dark"
              onClick={() => navigate("/atividades")}
            >
              Explorar todas as atividades
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activities.slice(0, 4).map((activity) => (
                <div key={activity.id} className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-1">{activity.title}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {activity.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {activity.category} • {getAgeRangeText(activity.min_age_months, activity.max_age_months)}
                    </span>
                    <Button size="sm" variant="outline" className="h-7 text-xs">
                      Ver detalhes
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-center">
              <Button 
                className="bg-minipassos-purple hover:bg-minipassos-purple-dark"
                onClick={() => navigate("/atividades")}
              >
                Ver todas as atividades
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardActivities;
