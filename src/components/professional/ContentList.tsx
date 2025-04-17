
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, Edit3, BookOpen, Play, PlusCircle } from "lucide-react";
import { Article, Activity } from "@/types";
import { useNavigate } from "react-router-dom";

interface ContentListProps {
  content: Article[] | Activity[];
  contentType: 'articles' | 'activities';
  isLoading: boolean;
  onCreateContent: () => void;
}

const ContentList = ({ 
  content, 
  contentType, 
  isLoading, 
  onCreateContent 
}: ContentListProps) => {
  const navigate = useNavigate();
  const isEmpty = content.length === 0;
  const isArticles = contentType === 'articles';
  const ContentIcon = isArticles ? BookOpen : Play;

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('pt-BR', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  const handleEditContent = (item: Article | Activity) => {
    // Navigate to edit content page with the item id
    navigate("/criar-conteudo", { 
      state: { 
        editMode: true,
        contentId: item.id,
        defaultTab: isArticles ? 'article' : 'activity' 
      } 
    });
  };

  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">Carregando {isArticles ? 'artigos' : 'atividades'}...</div>
  }

  if (isEmpty) {
    return (
      <div className="text-center py-8 text-gray-500">
        <ContentIcon className="h-16 w-16 text-gray-300 mx-auto mb-2" />
        <p>Você ainda não criou {isArticles ? 'nenhum artigo' : 'nenhuma atividade'}.</p>
        <Button 
          onClick={onCreateContent}
          className="mt-4 bg-marcos-purple hover:bg-marcos-purple-dark"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Criar {isArticles ? 'artigo' : 'atividade'}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {content.map((item: any) => (
        <div key={item.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-md bg-white hover:bg-gray-50">
          <div className="flex-1 min-w-0 mb-2 md:mb-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium truncate">{item.title}</h4>
              <Badge variant={item.published ? "default" : "outline"} className={item.published ? "bg-emerald-500" : "text-amber-600 border-amber-600"}>
                {item.published ? "Publicado" : "Rascunho"}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 truncate">
              {isArticles ? item.summary || 'Sem resumo' : item.description}
            </p>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-xs text-gray-400 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {formatDate(item.created_at)}
              </span>
              {isArticles ? (
                item.min_age_months && item.max_age_months && (
                  <span className="text-xs text-gray-400">
                    {item.min_age_months}-{item.max_age_months} meses
                  </span>
                )
              ) : (
                <>
                  <span className="text-xs text-gray-400">
                    {item.category}
                  </span>
                  <span className="text-xs text-gray-400">
                    {item.min_age_months}-{item.max_age_months} meses
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 md:flex-none"
              onClick={() => handleEditContent(item)}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-1 md:flex-none"
              onClick={() => navigate(isArticles ? `/biblioteca/${item.id}` : `/atividades/${item.id}`)}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContentList;
