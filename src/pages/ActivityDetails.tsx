
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Tag, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Activity } from "@/types";
import { getAgeRangeText } from "@/lib/date-utils";

const ActivityDetails = () => {
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
          title: "Erro ao carregar atividade",
          description: "Não foi possível obter os detalhes desta atividade."
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivity();
  }, [id, toast]);

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
              <h2 className="text-2xl font-semibold text-gray-700">Atividade não encontrada</h2>
              <p className="text-gray-500 mt-2">A atividade que você procura não existe ou foi removida.</p>
              <Button 
                className="mt-4 bg-minipassos-purple hover:bg-minipassos-purple-dark"
                onClick={() => navigate("/atividades")}
              >
                Ver todas as atividades
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{activity.title}</h1>
                <div className="flex flex-wrap gap-3 mt-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-minipassos-purple/10 text-minipassos-purple">
                    <Tag className="mr-1 h-3 w-3" />
                    {activity.category}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <Clock className="mr-1 h-3 w-3" />
                    {getAgeRangeText(activity.min_age_months, activity.max_age_months)}
                  </span>
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
                    <h2 className="text-xl font-semibold mb-2">Descrição</h2>
                    <p className="text-gray-700">{activity.description}</p>
                    
                    <h2 className="text-xl font-semibold mt-6 mb-2">Instruções</h2>
                    <div className="space-y-4 mt-3">
                      {activity.instructions.split('\n').map((instruction, i) => (
                        instruction.trim() && (
                          <div key={i} className="flex gap-2">
                            <CheckCircle2 className="h-5 w-5 text-minipassos-purple shrink-0 mt-0.5" />
                            <span>{instruction}</span>
                          </div>
                        )
                      ))}
                    </div>
                    
                    {activity.materials && activity.materials.length > 0 && (
                      <>
                        <h2 className="text-xl font-semibold mt-6 mb-2">Materiais Necessários</h2>
                        <ul className="list-disc list-inside space-y-1">
                          {activity.materials.map((material, i) => (
                            <li key={i} className="text-gray-700">{material}</li>
                          ))}
                        </ul>
                      </>
                    )}
                    
                    {activity.video_url && (
                      <div className="mt-6">
                        <h2 className="text-xl font-semibold mb-2">Vídeo</h2>
                        <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                          <iframe 
                            src={activity.video_url} 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                            className="w-full h-64 md:h-96"
                          ></iframe>
                        </div>
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

export default ActivityDetails;
