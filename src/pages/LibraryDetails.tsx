
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Tag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Activity } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const LibraryDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchActivity = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('activities')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        setActivity(data as Activity);
      } catch (error) {
        console.error('Error fetching activity:', error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar conteúdo",
          description: "Não foi possível obter os detalhes deste conteúdo."
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivity();
  }, [id, toast]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch (e) {
      return "Data não disponível";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-6 bg-gray-50">
        <div className="container max-w-4xl">
          <Button 
            variant="ghost" 
            className="mb-4 -ml-2" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-64 w-full rounded-lg" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : !activity ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-700">Conteúdo não encontrado</h2>
              <p className="text-gray-500 mt-2">O conteúdo que você procura não existe ou foi removido.</p>
              <Button 
                className="mt-4 bg-minipassos-purple hover:bg-minipassos-purple-dark"
                onClick={() => navigate("/biblioteca")}
              >
                Ver todos os conteúdos
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{activity.title}</h1>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600">
                  {activity.category && (
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 mr-1" />
                      <span>{activity.category}</span>
                    </div>
                  )}
                  
                  {activity.created_at && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(activity.created_at)}</span>
                    </div>
                  )}
                </div>
              </div>

              {activity.image_url && (
                <div className="relative h-64 md:h-80 w-full overflow-hidden rounded-lg">
                  <img 
                    src={activity.image_url} 
                    alt={activity.title}
                    className="absolute inset-0 w-full h-full object-cover" 
                  />
                </div>
              )}

              <Card>
                <CardContent className="pt-6">
                  <div className="prose max-w-none">
                    {activity.description && (
                      <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-2">Descrição</h2>
                        <p>{activity.description}</p>
                      </div>
                    )}
                    
                    {activity.instructions && (
                      <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-2">Instruções</h2>
                        {activity.instructions.split('\n\n').map((paragraph, i) => (
                          <p key={i} className="mb-4">{paragraph}</p>
                        ))}
                      </div>
                    )}
                    
                    {activity.materials && activity.materials.length > 0 && (
                      <div className="mt-8 pt-4 border-t border-gray-100">
                        <h2 className="text-lg font-semibold mb-2">Materiais</h2>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                          {activity.materials.map((material, i) => (
                            <li key={i}>{material}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LibraryDetails;
