import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Play, 
  PlusCircle, 
  AlertCircle, 
  Clock, 
  BookOpen, 
  Check, 
  ArrowRight, 
  Edit3 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Article, Activity } from "@/types";

const ProfessionalDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, userProfile } = useAuth();
  // Auto-verify professional accounts for testing
  const isVerified = true;
  const [activeTab, setActiveTab] = useState("articles");

  // Fetch articles created by the user
  const { data: articles = [], isLoading: articlesLoading } = useQuery({
    queryKey: ['professional-articles', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('author_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as Article[];
    },
    enabled: !!user && !!isVerified,
  });

  // Fetch activities created by the user
  const { data: activities = [], isLoading: activitiesLoading } = useQuery({
    queryKey: ['professional-activities', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as Activity[];
    },
    enabled: !!user && !!isVerified,
  });

  const contentCount = articles.length + activities.length;
  const publishedArticles = articles.filter(article => article.published).length;
  const publishedActivities = activities.filter(activity => activity.published).length;

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('pt-BR', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleCreateContent = () => {
    navigate("/criar-conteudo");
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Remove verification alert since we're auto-verifying */}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <FileText className="mr-2 h-4 w-4 text-minipassos-purple" />
              Total de Conteúdo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contentCount}</div>
            <p className="text-xs text-muted-foreground">
              {publishedArticles + publishedActivities} publicados
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <BookOpen className="mr-2 h-4 w-4 text-minipassos-purple" />
              Artigos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{articles.length}</div>
            <p className="text-xs text-muted-foreground">
              {publishedArticles} publicados
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <Play className="mr-2 h-4 w-4 text-minipassos-purple" />
              Atividades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activities.length}</div>
            <p className="text-xs text-muted-foreground">
              {publishedActivities} publicadas
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Meu Conteúdo</CardTitle>
            <Button 
              size="sm" 
              onClick={handleCreateContent}
              className="bg-minipassos-purple hover:bg-minipassos-purple-dark"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Conteúdo
            </Button>
          </div>
          <CardDescription>
            Gerencie os artigos e atividades que você criou
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs 
            defaultValue="articles" 
            value={activeTab} 
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="articles" className="flex items-center">
                <BookOpen className="mr-2 h-4 w-4" />
                Artigos
              </TabsTrigger>
              <TabsTrigger value="activities" className="flex items-center">
                <Play className="mr-2 h-4 w-4" />
                Atividades
              </TabsTrigger>
            </TabsList>
            
            <div className="mt-4">
              <TabsContent value="articles">
                {articlesLoading ? (
                  <div className="text-center py-8 text-gray-500">Carregando artigos...</div>
                ) : articles.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-2" />
                    <p>Você ainda não criou nenhum artigo.</p>
                    <Button 
                      onClick={handleCreateContent}
                      className="mt-4 bg-minipassos-purple hover:bg-minipassos-purple-dark"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Criar artigo
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {articles.map(article => (
                      <div key={article.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-md bg-white hover:bg-gray-50">
                        <div className="flex-1 min-w-0 mb-2 md:mb-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium truncate">{article.title}</h4>
                            <Badge variant={article.published ? "default" : "outline"} className={article.published ? "bg-emerald-500" : "text-amber-600 border-amber-600"}>
                              {article.published ? "Publicado" : "Rascunho"}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 truncate">{article.summary || 'Sem resumo'}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-xs text-gray-400 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatDate(article.created_at)}
                            </span>
                            {article.min_age_months && article.max_age_months && (
                              <span className="text-xs text-gray-400">
                                {article.min_age_months}-{article.max_age_months} meses
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                          <Button variant="outline" size="sm" className="flex-1 md:flex-none">
                            <Edit3 className="h-4 w-4 mr-2" />
                            Editar
                          </Button>
                          <Button variant="ghost" size="sm" className="flex-1 md:flex-none">
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="activities">
                {activitiesLoading ? (
                  <div className="text-center py-8 text-gray-500">Carregando atividades...</div>
                ) : activities.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Play className="h-16 w-16 text-gray-300 mx-auto mb-2" />
                    <p>Você ainda não criou nenhuma atividade.</p>
                    <Button 
                      onClick={handleCreateContent}
                      className="mt-4 bg-minipassos-purple hover:bg-minipassos-purple-dark"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Criar atividade
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activities.map(activity => (
                      <div key={activity.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-md bg-white hover:bg-gray-50">
                        <div className="flex-1 min-w-0 mb-2 md:mb-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium truncate">{activity.title}</h4>
                            <Badge variant={activity.published ? "default" : "outline"} className={activity.published ? "bg-emerald-500" : "text-amber-600 border-amber-600"}>
                              {activity.published ? "Publicado" : "Rascunho"}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 truncate">{activity.description}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-xs text-gray-400">
                              {activity.category}
                            </span>
                            <span className="text-xs text-gray-400">
                              {activity.min_age_months}-{activity.max_age_months} meses
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                          <Button variant="outline" size="sm" className="flex-1 md:flex-none">
                            <Edit3 className="h-4 w-4 mr-2" />
                            Editar
                          </Button>
                          <Button variant="ghost" size="sm" className="flex-1 md:flex-none">
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfessionalDashboard;
