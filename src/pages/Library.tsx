
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useArticle } from "@/context/ArticleContext";
import { useBaby } from "@/context/BabyContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCurrentAgeInMonths } from "@/lib/date-utils";
import { Search, Filter, Clock, BookOpen } from "lucide-react";
import { Article } from "@/types";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import ContentCreationButtons from "@/components/ContentCreationButtons";

const Library = () => {
  const navigate = useNavigate();
  const { articles, setArticles } = useArticle();
  const { currentBaby } = useBaby();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  
  const currentBabyAgeInMonths = currentBaby ? getCurrentAgeInMonths(currentBaby) : 0;

  // Carrega os artigos do Supabase ao montar o componente
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data } = await supabase
          .from('articles')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false });
          
        if (data) {
          setArticles(data);
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, [setArticles]);

  // Filtra os artigos com base nos critérios
  useEffect(() => {
    let filtered = [...articles];
    
    // Filtrar por termo de busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(term) || 
        article.content.toLowerCase().includes(term) ||
        (article.summary && article.summary.toLowerCase().includes(term))
      );
    }
    
    // Filtrar por categoria
    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter(article => 
        article.categories && article.categories.includes(selectedCategory)
      );
    }
    
    // Filtrar por idade do bebê atual
    if (currentBaby) {
      filtered = filtered.filter(article => 
        !article.min_age_months || !article.max_age_months ||
        (currentBabyAgeInMonths >= (article.min_age_months || 0) && 
         currentBabyAgeInMonths <= (article.max_age_months || 36))
      );
    }
    
    setFilteredArticles(filtered);
  }, [articles, searchTerm, selectedCategory, currentBaby, currentBabyAgeInMonths]);

  // Extrai categorias únicas para o filtro
  const allCategories = articles.flatMap(article => article.categories || []);
  const categories = [...new Set(allCategories)];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8 bg-gray-50">
        <div className="container">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Biblioteca</h1>
              <p className="text-gray-600">Artigos e conteúdo especializado sobre desenvolvimento infantil</p>
            </div>
            
            <ContentCreationButtons type="articles" className="mb-2 md:mb-0" />
          </div>
          
          {/* Filtros */}
          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Buscar artigos..."
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
          
          {/* Lista de artigos */}
          {filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Nenhum artigo encontrado para os filtros selecionados.</p>
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
              {filteredArticles.map(article => (
                <Card key={article.id} className="flex flex-col overflow-hidden hover:shadow-md transition-shadow">
                  {article.image_url && (
                    <div className="aspect-[2/1] w-full overflow-hidden">
                      <img 
                        src={article.image_url} 
                        alt={article.title} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  
                  <CardHeader className="pb-3">
                    {article.categories && article.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {article.categories.slice(0, 2).map(category => (
                          <div 
                            key={category} 
                            className="text-xs font-medium bg-minipassos-purple/10 text-minipassos-purple rounded-full px-2 py-0.5"
                          >
                            {category}
                          </div>
                        ))}
                        {article.categories.length > 2 && (
                          <div className="text-xs font-medium text-gray-500">
                            +{article.categories.length - 2}
                          </div>
                        )}
                      </div>
                    )}
                    <CardTitle className="text-lg">{article.title}</CardTitle>
                    {article.created_at && (
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {format(new Date(article.created_at), "dd MMM yyyy", { locale: pt })}
                      </div>
                    )}
                  </CardHeader>
                  
                  <CardContent className="pb-4 flex-grow">
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {article.summary || article.content.slice(0, 150) + "..."}
                    </p>
                  </CardContent>
                  
                  <CardFooter className="pt-0">
                    <Button 
                      className="w-full"
                      variant="outline"
                      onClick={() => navigate(`/biblioteca/${article.id}`)}
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Ler artigo
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

export default Library;
