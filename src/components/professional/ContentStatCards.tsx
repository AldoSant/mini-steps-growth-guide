
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, Play } from "lucide-react";
import { Article, Activity } from "@/types";

interface ContentStatCardsProps {
  articles: Article[];
  activities: Activity[];
}

const ContentStatCards = ({ articles, activities }: ContentStatCardsProps) => {
  const contentCount = articles.length + activities.length;
  const publishedArticles = articles.filter(article => article.published).length;
  const publishedActivities = activities.filter(activity => activity.published).length;

  return (
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
  );
};

export default ContentStatCards;
