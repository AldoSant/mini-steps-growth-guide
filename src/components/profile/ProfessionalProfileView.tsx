
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Edit3, FileText, PlusCircle, Book, Play, Award } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { pt } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProfessionalProfileViewProps {
  profile: any;
}

const ProfessionalProfileView = ({ profile }: ProfessionalProfileViewProps) => {
  const navigate = useNavigate();

  const joinDate = profile?.created_at 
    ? formatDistanceToNow(new Date(profile.created_at), { addSuffix: true, locale: pt })
    : "";

  // Fetch statistics for the professional
  const { data: stats = { articles: 0, activities: 0 } } = useQuery({
    queryKey: ['professional-stats', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return { articles: 0, activities: 0 };

      const [articlesResponse, activitiesResponse] = await Promise.all([
        supabase.from('articles').select('id').eq('author_id', profile.id),
        supabase.from('activities').select('id').eq('creator_id', profile.id)
      ]);

      return { 
        articles: articlesResponse.data?.length || 0, 
        activities: activitiesResponse.data?.length || 0 
      };
    },
    enabled: !!profile?.id,
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Perfil Profissional</CardTitle>
          {!profile?.is_verified && (
            <CardDescription className="flex items-center text-amber-600">
              <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 mr-2">
                Em verificação
              </Badge>
              Sua conta está sendo verificada por nossa equipe.
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {profile?.professional_title && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Título</h3>
              <p className="mt-1 font-medium">{profile.professional_title}</p>
            </div>
          )}
          
          {profile?.professional_specialization && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Especialização</h3>
              <p className="mt-1">{profile.professional_specialization}</p>
            </div>
          )}
          
          {profile?.professional_bio && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Sobre</h3>
              <p className="mt-1 text-sm">{profile.professional_bio}</p>
            </div>
          )}
          
          <Separator />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Membro desde</h3>
              <p className="flex items-center mt-1">
                <CalendarDays className="h-4 w-4 mr-2 text-minipassos-purple" />
                {joinDate}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <p className="flex items-center mt-1">
                {profile?.is_verified ? (
                  <Badge className="bg-emerald-500 flex items-center">
                    <Award className="h-3 w-3 mr-1" /> Verificado
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
                    Em verificação
                  </Badge>
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Book className="mr-2 h-4 w-4 text-minipassos-purple" />
              Artigos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.articles}</div>
            <p className="text-sm text-muted-foreground mb-4">
              Artigos publicados
            </p>
            
            <Button 
              className="w-full bg-minipassos-purple hover:bg-minipassos-purple-dark"
              onClick={() => navigate("/criar-conteudo")}
              disabled={!profile?.is_verified}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Criar Novo Artigo
            </Button>
            
            {stats.articles > 0 && (
              <Button 
                variant="outline" 
                className="w-full mt-2"
                onClick={() => navigate("/dashboard")}
              >
                <Edit3 className="mr-2 h-4 w-4" />
                Gerenciar Artigos
              </Button>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Play className="mr-2 h-4 w-4 text-minipassos-purple" />
              Atividades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.activities}</div>
            <p className="text-sm text-muted-foreground mb-4">
              Atividades publicadas
            </p>
            
            <Button 
              className="w-full bg-minipassos-purple hover:bg-minipassos-purple-dark"
              onClick={() => navigate("/criar-conteudo")}
              disabled={!profile?.is_verified}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Criar Nova Atividade
            </Button>
            
            {stats.activities > 0 && (
              <Button 
                variant="outline" 
                className="w-full mt-2"
                onClick={() => navigate("/dashboard")}
              >
                <Edit3 className="mr-2 h-4 w-4" />
                Gerenciar Atividades
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <FileText className="mr-2 h-4 w-4 text-minipassos-purple" />
            Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Acesse seu dashboard para gerenciar todo o seu conteúdo, visualizar estatísticas e criar novos artigos ou atividades.
            </p>
            <Button 
              className="w-full bg-minipassos-purple hover:bg-minipassos-purple-dark"
              onClick={() => navigate("/dashboard")}
            >
              Acessar Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfessionalProfileView;
