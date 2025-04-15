
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
import { Article } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const LibraryDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        setArticle(data as Article);
      } catch (error) {
        console.error('Error fetching article:', error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar artigo",
          description: "Não foi possível obter os detalhes deste artigo."
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
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
          ) : !article ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-700">Artigo não encontrado</h2>
              <p className="text-gray-500 mt-2">O artigo que você procura não existe ou foi removido.</p>
              <Button 
                className="mt-4 bg-minipassos-purple hover:bg-minipassos-purple-dark"
                onClick={() => navigate("/biblioteca")}
              >
                Ver todos os artigos
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{article.title}</h1>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600">
                  {article.author && (
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      <span>{article.author}</span>
                    </div>
                  )}
                  
                  {article.published_date && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(article.published_date)}</span>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2 mt-1">
                    {article.categories && article.categories.map((category, i) => (
                      <span 
                        key={i} 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-minipassos-purple/10 text-minipassos-purple"
                      >
                        <Tag className="mr-1 h-3 w-3" />
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {article.image_url && (
                <div className="relative h-64 md:h-80 w-full overflow-hidden rounded-lg">
                  <img 
                    src={article.image_url} 
                    alt={article.title}
                    className="absolute inset-0 w-full h-full object-cover" 
                  />
                </div>
              )}

              <Card>
                <CardContent className="pt-6">
                  <div className="prose max-w-none">
                    {article.content && article.content.split('\n\n').map((paragraph, i) => (
                      <p key={i} className="mb-4">{paragraph}</p>
                    ))}
                    
                    {article.references && article.references.length > 0 && (
                      <div className="mt-8 pt-4 border-t border-gray-100">
                        <h2 className="text-lg font-semibold mb-2">Referências</h2>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                          {article.references.map((reference, i) => (
                            <li key={i}>{reference}</li>
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
