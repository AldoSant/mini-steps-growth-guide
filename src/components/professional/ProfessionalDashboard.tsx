
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Article, Activity } from "@/types";

// Componentes refatorados
import ContentStatCards from "./ContentStatCards";
import ContentTabs from "./ContentTabs";

const ProfessionalDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
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

  const handleCreateContent = () => {
    navigate("/criar-conteudo");
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <ContentStatCards articles={articles} activities={activities} />
      
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
          <ContentTabs 
            articles={articles}
            activities={activities}
            articlesLoading={articlesLoading}
            activitiesLoading={activitiesLoading}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onCreateContent={handleCreateContent}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfessionalDashboard;
