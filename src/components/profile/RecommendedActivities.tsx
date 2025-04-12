
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dumbbell, Brain, Baby, MessagesSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface RecommendedActivitiesProps {
  skillsDistribution: {
    motor: number;
    cognitivo: number;
    social: number;
    linguagem: number;
  };
  currentAge: number;
  strongestArea: string;
}

interface Activity {
  id: string;
  title: string;
  description: string;
  category: string;
  min_age_months: number;
  max_age_months: number;
}

const RecommendedActivities = ({
  skillsDistribution,
  currentAge,
  strongestArea
}: RecommendedActivitiesProps) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Determine which areas to focus on
  const getAreas = () => {
    // Get strongest and weakest areas
    const areas = Object.entries(skillsDistribution);
    areas.sort((a, b) => b[1] - a[1]);
    
    // Focus on strongest area and least developed areas
    const strongestAreaName = areas[0][0];
    const weakestAreaName = areas[3][0];
    
    return {
      primary: strongestAreaName, // Continue developing strength
      secondary: weakestAreaName, // Work on improvement in weakest area
    };
  };
  
  // Map category names to database values
  const mapAreaToCategory = (area: string) => {
    switch (area) {
      case 'motor': return 'motor';
      case 'cognitivo': return 'cognitivo';
      case 'social': return 'social';
      case 'linguagem': return 'linguagem';
      default: return area;
    }
  };
  
  // Fetch recommended activities
  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      
      const areas = getAreas();
      
      try {
        // Get activities appropriate for age and focused on our primary and secondary areas
        const { data, error } = await supabase
          .from('activities')
          .select('*')
          .or(`category.eq.${mapAreaToCategory(areas.primary)},category.eq.${mapAreaToCategory(areas.secondary)}`)
          .lte('min_age_months', currentAge)
          .gte('max_age_months', currentAge)
          .limit(6);
        
        if (error) {
          console.error('Error fetching activities:', error);
          return;
        }
        
        setActivities(data || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchActivities();
  }, [currentAge, strongestArea]);
  
  // Get icon for category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'motor':
        return <Dumbbell className="w-4 h-4 text-minipassos-purple" />;
      case 'cognitivo':
        return <Brain className="w-4 h-4 text-minipassos-blue" />;
      case 'social':
        return <Baby className="w-4 h-4 text-minipassos-green" />;
      case 'linguagem':
        return <MessagesSquare className="w-4 h-4 text-minipassos-purple-dark" />;
      default:
        return <Brain className="w-4 h-4 text-gray-500" />;
    }
  };
  
  // Get color class for category
  const getCategoryColorClass = (category: string) => {
    switch (category) {
      case 'motor':
        return 'bg-minipassos-purple/10 border-minipassos-purple/20';
      case 'cognitivo':
        return 'bg-minipassos-blue/10 border-minipassos-blue/20';
      case 'social':
        return 'bg-minipassos-green/10 border-minipassos-green/20';
      case 'linguagem':
        return 'bg-minipassos-purple-dark/10 border-minipassos-purple-dark/20';
      default:
        return 'bg-gray-100 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-2">Recomendações Personalizadas</h3>
        <p className="text-sm text-gray-600 mb-6">
          Estas atividades foram selecionadas para potencializar as habilidades naturais do seu bebê 
          e também trabalhar áreas que podem se beneficiar de mais estímulo.
        </p>
      </div>
      
      {loading ? (
        <div className="text-center py-8">Carregando atividades recomendadas...</div>
      ) : activities.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Não encontramos atividades específicas para esta faixa etária. Por favor, consulte a página de atividades para outras opções.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activities.map((activity) => (
            <Card key={activity.id} className={`border ${getCategoryColorClass(activity.category)}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  {getCategoryIcon(activity.category)}
                  <span className="text-sm font-medium capitalize">
                    {activity.category}
                  </span>
                </div>
                <h4 className="font-medium mb-1">{activity.title}</h4>
                <p className="text-sm text-gray-600">{activity.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendedActivities;
