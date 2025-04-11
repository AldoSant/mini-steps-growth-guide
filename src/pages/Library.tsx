
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  BookOpen, 
  Moon, 
  Baby, 
  Utensils, 
  Heart, 
  Play, 
  ArrowRight,
  Clock,
  User,
  Calendar
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Mock articles data
const mockArticles = [
  {
    id: 1,
    title: "Como estabelecer uma rotina de sono saudável para bebês",
    summary: "Descubra como criar um ambiente propício e estabelecer rotinas que ajudem o seu bebê a dormir melhor durante a noite.",
    category: "sono",
    readTime: "7 min",
    author: "Dra. Ana Cardoso",
    date: "12 de abril, 2025",
    image: "https://images.unsplash.com/photo-1595586964632-b215dfbc064a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    featured: true,
  },
  {
    id: 2,
    title: "Introdução alimentar: por onde começar",
    summary: "Guia completo sobre como iniciar a alimentação complementar do seu bebê de forma segura e nutritiva.",
    category: "alimentação",
    readTime: "10 min",
    author: "Nutricionista Teresa Melo",
    date: "5 de abril, 2025",
    image: "https://images.unsplash.com/photo-1590996538291-831778db04d7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    featured: false,
  },
  {
    id: 3,
    title: "Desenvolvimento motor: estímulos importantes no primeiro ano",
    summary: "Descubra atividades e estímulos que auxiliam o desenvolvimento motor do bebê desde o nascimento até 12 meses.",
    category: "desenvolvimento",
    readTime: "8 min",
    author: "Fisioterapeuta Marcos Oliveira",
    date: "28 de março, 2025",
    image: "https://images.unsplash.com/photo-1581553673739-c4906b5d0de8?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    featured: false,
  },
  {
    id: 4,
    title: "Como acalmar o choro do bebê: técnicas eficientes",
    summary: "Aprenda diferentes métodos para acalmar seu bebê em momentos de choro intenso ou desconforto.",
    category: "comportamento",
    readTime: "6 min",
    author: "Dr. Paulo Santos",
    date: "20 de março, 2025",
    image: "https://images.unsplash.com/photo-1590998521582-a15280bfd1b7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    featured: false,
  },
  {
    id: 5,
    title: "Sinais de alerta no desenvolvimento infantil",
    summary: "Aprenda a identificar sinais que podem indicar atrasos ou problemas no desenvolvimento do seu bebê.",
    category: "saúde",
    readTime: "9 min",
    author: "Dra. Juliana Mendes",
    date: "15 de março, 2025",
    image: "https://images.unsplash.com/photo-1608217437013-c66c361555d6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    featured: true,
  },
  {
    id: 6,
    title: "Brincadeiras para estimular a comunicação e linguagem",
    summary: "Descubra jogos e atividades que incentivam o desenvolvimento da fala e comunicação no seu bebê.",
    category: "comunicação",
    readTime: "8 min",
    author: "Fonoaudióloga Carla Ribeiro",
    date: "10 de março, 2025",
    image: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    featured: false,
  }
];

// Mock videos data
const mockVideos = [
  {
    id: 1,
    title: "Massagem para cólicas: técnica passo a passo",
    duration: "4:35",
    category: "saúde",
    thumbnail: "https://images.unsplash.com/photo-1590998521582-a15280bfd1b7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    id: 2,
    title: "Como preparar a primeira papinha do bebê",
    duration: "7:12",
    category: "alimentação",
    thumbnail: "https://images.unsplash.com/photo-1590996538291-831778db04d7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    id: 3,
    title: "Exercícios para fortalecer pescoço e tronco",
    duration: "6:48",
    category: "desenvolvimento",
    thumbnail: "https://images.unsplash.com/photo-1581553673739-c4906b5d0de8?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    id: 4,
    title: "Rotina de sono: preparando o bebê para dormir",
    duration: "5:27",
    category: "sono",
    thumbnail: "https://images.unsplash.com/photo-1595586964632-b215dfbc064a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  }
];

const Library = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("todos");
  
  const categories = [
    { id: "todos", name: "Todos", icon: <BookOpen size={16} /> },
    { id: "sono", name: "Sono", icon: <Moon size={16} /> },
    { id: "alimentação", name: "Alimentação", icon: <Utensils size={16} /> },
    { id: "desenvolvimento", name: "Desenvolvimento", icon: <Baby size={16} /> },
    { id: "saúde", name: "Saúde", icon: <Heart size={16} /> },
    { id: "comportamento", name: "Comportamento", icon: <Baby size={16} /> },
    { id: "comunicação", name: "Comunicação", icon: <BookOpen size={16} /> },
  ];
  
  const filteredArticles = mockArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          article.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "todos" || article.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  const filteredVideos = mockVideos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "todos" || video.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  const featuredArticles = filteredArticles.filter(article => article.featured);
  const regularArticles = filteredArticles.filter(article => !article.featured);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8 bg-gray-50">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Biblioteca</h1>
              <p className="text-gray-600">
                Artigos e vídeos educativos para apoiar a jornada da maternidade e paternidade
              </p>
            </div>
          </div>
          
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input 
                placeholder="Pesquisar na biblioteca..." 
                className="pl-10 py-6 text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="mb-8 overflow-x-auto pb-4">
            <div className="flex gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant="outline"
                  className={cn(
                    "flex items-center gap-2 whitespace-nowrap",
                    activeCategory === category.id
                      ? "bg-minipassos-purple text-white hover:bg-minipassos-purple-dark"
                      : "bg-white"
                  )}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.icon}
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
          
          <Tabs defaultValue="artigos">
            <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
              <TabsTrigger value="artigos">Artigos</TabsTrigger>
              <TabsTrigger value="videos">Vídeos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="artigos" className="mt-6 space-y-8">
              {featuredArticles.length > 0 && (
                <>
                  <h2 className="text-2xl font-bold text-gray-800">Destaques</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {featuredArticles.map((article) => (
                      <Card key={article.id} className="overflow-hidden">
                        <div 
                          className="h-60 bg-center bg-cover" 
                          style={{ backgroundImage: `url(${article.image})` }}
                        />
                        <CardContent className="p-5">
                          <Badge className="mb-2 bg-minipassos-purple/10 text-minipassos-purple hover:bg-minipassos-purple/20">
                            {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                          </Badge>
                          <h3 className="text-xl font-bold text-gray-800 mb-2">{article.title}</h3>
                          <p className="text-gray-600 text-sm mb-4">{article.summary}</p>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1.5">
                              <User size={14} />
                              <span>{article.author}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Calendar size={14} />
                              <span>{article.date}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock size={14} />
                              <span>{article.readTime} de leitura</span>
                            </div>
                          </div>
                          
                          <Button 
                            variant="link" 
                            className="p-0 mt-4 text-minipassos-purple hover:text-minipassos-purple-dark"
                          >
                            Ler artigo completo 
                            <ArrowRight size={16} className="ml-1" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              )}
              
              <h2 className="text-2xl font-bold text-gray-800">Todos os Artigos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularArticles.map((article) => (
                  <Card key={article.id} className="overflow-hidden">
                    <div 
                      className="h-48 bg-center bg-cover" 
                      style={{ backgroundImage: `url(${article.image})` }}
                    />
                    <CardContent className="p-5">
                      <Badge className="mb-2 bg-minipassos-purple/10 text-minipassos-purple hover:bg-minipassos-purple/20">
                        {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                      </Badge>
                      <h3 className="font-bold text-gray-800 mb-2">{article.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{article.summary}</p>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">{article.readTime} de leitura</span>
                        <Button 
                          variant="link" 
                          className="p-0 text-minipassos-purple hover:text-minipassos-purple-dark"
                        >
                          Ler mais 
                          <ArrowRight size={16} className="ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {filteredArticles.length === 0 && (
                <div className="bg-white rounded-lg p-8 text-center">
                  <p className="text-gray-500">Nenhum artigo encontrado para os filtros selecionados.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="videos" className="mt-6 space-y-8">
              <h2 className="text-2xl font-bold text-gray-800">Vídeos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVideos.map((video) => (
                  <div 
                    key={video.id} 
                    className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-all"
                  >
                    <div className="relative">
                      <div 
                        className="h-48 bg-center bg-cover" 
                        style={{ backgroundImage: `url(${video.thumbnail})` }}
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="rounded-full bg-minipassos-purple/90 p-4 backdrop-blur-sm">
                          <Play size={24} className="text-white" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
                        {video.duration}
                      </div>
                    </div>
                    <div className="p-5">
                      <Badge className="mb-2 bg-minipassos-purple/10 text-minipassos-purple hover:bg-minipassos-purple/20">
                        {video.category.charAt(0).toUpperCase() + video.category.slice(1)}
                      </Badge>
                      <h3 className="font-bold text-gray-800">{video.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredVideos.length === 0 && (
                <div className="bg-white rounded-lg p-8 text-center">
                  <p className="text-gray-500">Nenhum vídeo encontrado para os filtros selecionados.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Library;
