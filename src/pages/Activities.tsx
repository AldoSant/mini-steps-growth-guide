import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useActivity } from "@/context/ActivityContext";
import { useBaby } from "@/context/BabyContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCurrentAgeInMonths } from "@/lib/date-utils";
import { Search, Filter } from "lucide-react";
import { Activity } from "@/types";
import ContentCreationButtons from "@/components/ContentCreationButtons";
import { supabase } from "@/integrations/supabase/client";

const Activities = () => {
  const { activities, setActivities } = useActivity();
  const { currentBaby } = useBaby();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  
  const currentBabyAgeInMonths = currentBaby ? getCurrentAgeInMonths(currentBaby) : 0;

  // Carrega as atividades do Supabase ao montar o componente
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const { data } = await supabase
          .from('activities')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false });
          
        if (data) {
          setActivities(data);
        }
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    fetchActivities();
  }, [setActivities]);

  // Filtra as atividades com base nos critérios
  useEffect(() => {
    let filtered = [...activities];
    
    // Filtrar por termo de busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(activity => 
        activity.title.toLowerCase().includes(term) || 
        activity.description.toLowerCase().includes(term)
      );
    }
    
    // Filtrar por categoria
    if (selectedCategory) {
      filtered = filtered.filter(activity => 
        activity.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    // Filtrar por idade do bebê atual
    if (currentBaby) {
      filtered = filtered.filter(activity => 
        currentBabyAgeInMonths >= (activity.min_age_months || 0) && 
        currentBabyAgeInMonths <= (activity.max_age_months || 36)
      );
    }
    
    setFilteredActivities(filtered);
  }, [activities, searchTerm, selectedCategory, currentBaby, currentBabyAgeInMonths]);

  // Extrai categorias únicas para o filtro
  const categories = [...new Set(activities.map(activity => activity.category))];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8 bg-gray-50">
        <div className="container">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Atividades</h1>
              <p className="text-gray-600">Explore atividades para estimular o desenvolvimento do bebê</p>
            </div>
            
            <ContentCreationButtons type="activities" />
          </div>
          
          {/* Filtros */}
          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Buscar atividades..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas as categorias</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Lista de atividades */}
          {filteredActivities.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Nenhuma atividade encontrada para os filtros selecionados.</p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
                }}
              >
                <Filter className="h-4 w-4 mr-2" />
                Limpar filtros
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredActivities.map(activity => (
                <Card key={activity.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  {activity.image_url && (
                    <div className="aspect-video w-full overflow-hidden">
                      <img 
                        src={activity.image_url} 
                        alt={activity.title} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-medium bg-minipassos-purple/10 text-minipassos-purple rounded-full px-2 py-0.5">
                        {activity.category}
                      </div>
                      <div className="text-xs text-gray-500">
                        {activity.min_age_months}-{activity.max_age_months} meses
                      </div>
                    </div>
                    <CardTitle className="text-lg mt-2">{activity.title}</CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-sm text-gray-600 line-clamp-2">{activity.description}</p>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      className="w-full bg-minipassos-purple hover:bg-minipassos-purple-dark"
                      onClick={() => navigate(`/atividades/${activity.id}`)}
                    >
                      Ver Detalhes
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Activities;
