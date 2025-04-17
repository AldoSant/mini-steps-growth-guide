
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Play, PlusCircle } from "lucide-react";
import { Article, Activity } from "@/types";
import ContentList from "./ContentList";
import { Button } from "@/components/ui/button";

interface ContentTabsProps {
  articles: Article[];
  activities: Activity[];
  articlesLoading: boolean;
  activitiesLoading: boolean;
  activeTab: string;
  onTabChange: (value: string) => void;
  onCreateContent: () => void;
}

const ContentTabs = ({
  articles,
  activities,
  articlesLoading,
  activitiesLoading,
  activeTab,
  onTabChange,
  onCreateContent
}: ContentTabsProps) => {
  return (
    <Tabs 
      defaultValue="articles" 
      value={activeTab} 
      onValueChange={onTabChange}
    >
      <div className="flex justify-between items-center mb-4">
        <TabsList className="grid w-64 grid-cols-2">
          <TabsTrigger value="articles" className="flex items-center">
            <BookOpen className="mr-2 h-4 w-4" />
            Artigos
          </TabsTrigger>
          <TabsTrigger value="activities" className="flex items-center">
            <Play className="mr-2 h-4 w-4" />
            Atividades
          </TabsTrigger>
        </TabsList>
        
        <Button
          size="sm"
          onClick={onCreateContent}
          className="bg-marcos-purple hover:bg-marcos-purple-dark"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          {activeTab === "articles" ? "Criar Artigo" : "Criar Atividade"}
        </Button>
      </div>
      
      <div className="mt-4">
        <TabsContent value="articles">
          <ContentList 
            content={articles} 
            contentType="articles"
            isLoading={articlesLoading}
            onCreateContent={onCreateContent}
          />
        </TabsContent>
        
        <TabsContent value="activities">
          <ContentList 
            content={activities} 
            contentType="activities"
            isLoading={activitiesLoading}
            onCreateContent={onCreateContent}
          />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default ContentTabs;
