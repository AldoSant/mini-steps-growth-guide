
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Clock, 
  Award, 
  Brain, 
  Check, 
  FileText, 
  Smile, 
  MessagesSquare,
  Search,
  Tag,
  BookmarkPlus
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Mock activities data
const mockActivities = [
  {
    id: 1,
    title: "Brincadeira de esconde-achou",
    description: "Esconda um brinquedo sob um cobertor e incentive seu bebê a encontrá-lo, ajudando a desenvolver a permanência do objeto.",
    category: "cognitivo",
    duration: "5-10 min",
    ageRange: "6-9 meses",
    materials: ["Cobertor ou lenço", "Brinquedo pequeno"],
    difficulty: "fácil",
    videoThumbnail: "https://images.unsplash.com/photo-1596440114792-f793fea8f15c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    saved: false,
    completed: false
  },
  {
    id: 2,
    title: "Alcançar objetos durante engatinhamento",
    description: "Coloque brinquedos a uma curta distância para incentivar o bebê a engatinhar e alcançá-los.",
    category: "motor",
    duration: "10-15 min",
    ageRange: "7-10 meses",
    materials: ["Brinquedos coloridos"],
    difficulty: "médio",
    videoThumbnail: "https://images.unsplash.com/photo-1590649079730-78f064636349?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    saved: true,
    completed: false
  },
  {
    id: 3,
    title: "Imitação de sons e expressões faciais",
    description: "Faça diferentes expressões e sons para que o bebê imite, ajudando no desenvolvimento social e da linguagem.",
    category: "social",
    duration: "5 min",
    ageRange: "6-12 meses",
    materials: ["Nenhum"],
    difficulty: "fácil",
    videoThumbnail: "https://images.unsplash.com/photo-1518835459797-d855a3c3e100?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    saved: false,
    completed: true
  },
  {
    id: 4,
    title: "Empilhar blocos",
    description: "Demonstre como empilhar blocos e deixe o bebê tentar fazer o mesmo, desenvolvendo coordenação motora fina.",
    category: "motor",
    duration: "10 min",
    ageRange: "8-12 meses",
    materials: ["Blocos de empilhar"],
    difficulty: "médio",
    videoThumbnail: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    saved: false,
    completed: false
  },
  {
    id: 5,
    title: "Leitura interativa",
    description: "Leia livros com imagens coloridas, apontando e nomeando objetos para estimular a linguagem.",
    category: "linguagem",
    duration: "10 min",
    ageRange: "6-36 meses",
    materials: ["Livro infantil com imagens"],
    difficulty: "fácil",
    videoThumbnail: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    saved: true,
    completed: false
  },
  {
    id: 6,
    title: "Bater palmas com música",
    description: "Coloque músicas infantis e incentive o bebê a bater palmas no ritmo, desenvolvendo coordenação e senso musical.",
    category: "musical",
    duration: "8 min",
    ageRange: "7-24 meses",
    materials: ["Música infantil"],
    difficulty: "fácil",
    videoThumbnail: "https://images.unsplash.com/photo-1611905133569-152576e3da9a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    saved: false,
    completed: true
  }
];

const Activities = () => {
  const [activities, setActivities] = useState(mockActivities);
  const [activeTab, setActiveTab] = useState("recomendadas");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter activities based on active tab and search term
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "recomendadas") {
      return matchesSearch;
    } else if (activeTab === "salvas") {
      return activity.saved && matchesSearch;
    } else if (activeTab === "concluidas") {
      return activity.completed && matchesSearch;
    }
    return false;
  });
  
  const toggleSaved = (id: number) => {
    setActivities(activities.map(activity => 
      activity.id === id ? { ...activity, saved: !activity.saved } : activity
    ));
  };
  
  const toggleCompleted = (id: number) => {
    setActivities(activities.map(activity => 
      activity.id === id ? { ...activity, completed: !activity.completed } : activity
    ));
  };
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "motor": return "bg-minipassos-purple text-white";
      case "cognitivo": return "bg-minipassos-blue text-white";
      case "social": return "bg-minipassos-green text-white";
      case "linguagem": return "bg-minipassos-purple-dark text-white";
      case "musical": return "bg-[#F59E0B] text-white";
      default: return "bg-gray-200 text-gray-800";
    }
  };
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "motor": return <Award size={16} />;
      case "cognitivo": return <Brain size={16} />;
      case "social": return <Smile size={16} />;
      case "linguagem": return <MessagesSquare size={16} />;
      case "musical": return <FileText size={16} />;
      default: return <Tag size={16} />;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8 bg-gray-50">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Atividades</h1>
              <p className="text-gray-600">
                Atividades diárias personalizadas para o desenvolvimento do seu bebê
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Filtros</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Pesquisar</label>
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                        <Input 
                          placeholder="Buscar atividades..." 
                          className="pl-8"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Categorias</label>
                      <div className="flex flex-wrap gap-2">
                        {["motor", "cognitivo", "social", "linguagem", "musical"].map((category) => (
                          <Badge 
                            key={category} 
                            className={cn(
                              "cursor-pointer",
                              getCategoryColor(category)
                            )}
                            variant="outline"
                          >
                            {getCategoryIcon(category)}
                            <span className="ml-1 capitalize">{category}</span>
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Faixa Etária</label>
                      <div className="flex flex-wrap gap-2">
                        {["0-3 meses", "4-6 meses", "7-9 meses", "10-12 meses", "1-2 anos", "2-3 anos"].map((age) => (
                          <Badge 
                            key={age} 
                            className="cursor-pointer bg-white text-gray-800 hover:bg-gray-100"
                            variant="outline"
                          >
                            {age}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Duração</label>
                      <div className="flex flex-wrap gap-2">
                        {["5 min", "10 min", "15 min", "20+ min"].map((duration) => (
                          <Badge 
                            key={duration} 
                            className="cursor-pointer bg-white text-gray-800 hover:bg-gray-100"
                            variant="outline"
                          >
                            <Clock size={14} className="mr-1" />
                            {duration}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-3 space-y-6">
              <Tabs defaultValue="recomendadas" onValueChange={setActiveTab}>
                <div className="flex justify-between items-center">
                  <TabsList>
                    <TabsTrigger value="recomendadas">Recomendadas</TabsTrigger>
                    <TabsTrigger value="salvas">Salvas</TabsTrigger>
                    <TabsTrigger value="concluidas">Concluídas</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="recomendadas" className="mt-6">
                  {filteredActivities.length === 0 ? (
                    <div className="bg-white rounded-lg p-8 text-center">
                      <p className="text-gray-500">Nenhuma atividade encontrada para os filtros selecionados.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredActivities.map((activity) => (
                        <div 
                          key={activity.id} 
                          className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-all"
                        >
                          <div 
                            className="h-48 bg-center bg-cover relative"
                            style={{ backgroundImage: `url(${activity.videoThumbnail})` }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                              <Badge className={cn("capitalize", getCategoryColor(activity.category))}>
                                {getCategoryIcon(activity.category)}
                                <span className="ml-1">{activity.category}</span>
                              </Badge>
                              
                              <div className="flex gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className={cn(
                                    "rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40",
                                    activity.saved ? "text-yellow-400" : "text-white"
                                  )}
                                  onClick={() => toggleSaved(activity.id)}
                                >
                                  <BookmarkPlus size={18} />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className={cn(
                                    "rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40",
                                    activity.completed ? "text-green-400" : "text-white"
                                  )}
                                  onClick={() => toggleCompleted(activity.id)}
                                >
                                  <Check size={18} />
                                </Button>
                              </div>
                            </div>
                          </div>
                          <div className="p-5">
                            <h3 className="font-bold text-gray-800 mb-2">{activity.title}</h3>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{activity.description}</p>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                              <span className="flex items-center gap-1 text-xs text-gray-500">
                                <Clock size={14} />
                                {activity.duration}
                              </span>
                              <span className="flex items-center gap-1 text-xs text-gray-500">
                                <span>•</span>
                                {activity.ageRange}
                              </span>
                              <span className="flex items-center gap-1 text-xs text-gray-500">
                                <span>•</span>
                                Dificuldade: {activity.difficulty}
                              </span>
                            </div>
                            
                            <div className="space-y-2">
                              <p className="text-xs font-semibold text-gray-700">Materiais necessários:</p>
                              <div className="flex flex-wrap gap-1">
                                {activity.materials.map((material, index) => (
                                  <Badge 
                                    key={index} 
                                    variant="outline" 
                                    className="bg-gray-50 text-gray-600"
                                  >
                                    {material}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="px-5 py-3 border-t border-gray-100">
                            <Button className="w-full bg-minipassos-purple hover:bg-minipassos-purple-dark">
                              Ver atividade completa
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="salvas" className="mt-6">
                  {filteredActivities.length === 0 ? (
                    <div className="bg-white rounded-lg p-8 text-center">
                      <p className="text-gray-500">Nenhuma atividade salva encontrada.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredActivities.map((activity) => (
                        // Same activity card structure as above
                        <div 
                          key={activity.id} 
                          className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-all"
                        >
                          <div 
                            className="h-48 bg-center bg-cover relative"
                            style={{ backgroundImage: `url(${activity.videoThumbnail})` }}
                          >
                            {/* Card content same as above */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                              <Badge className={cn("capitalize", getCategoryColor(activity.category))}>
                                {getCategoryIcon(activity.category)}
                                <span className="ml-1">{activity.category}</span>
                              </Badge>
                              
                              <div className="flex gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className={cn(
                                    "rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40",
                                    activity.saved ? "text-yellow-400" : "text-white"
                                  )}
                                  onClick={() => toggleSaved(activity.id)}
                                >
                                  <BookmarkPlus size={18} />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className={cn(
                                    "rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40",
                                    activity.completed ? "text-green-400" : "text-white"
                                  )}
                                  onClick={() => toggleCompleted(activity.id)}
                                >
                                  <Check size={18} />
                                </Button>
                              </div>
                            </div>
                          </div>
                          <div className="p-5">
                            <h3 className="font-bold text-gray-800 mb-2">{activity.title}</h3>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{activity.description}</p>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                              <span className="flex items-center gap-1 text-xs text-gray-500">
                                <Clock size={14} />
                                {activity.duration}
                              </span>
                              <span className="flex items-center gap-1 text-xs text-gray-500">
                                <span>•</span>
                                {activity.ageRange}
                              </span>
                              <span className="flex items-center gap-1 text-xs text-gray-500">
                                <span>•</span>
                                Dificuldade: {activity.difficulty}
                              </span>
                            </div>
                            
                            <div className="space-y-2">
                              <p className="text-xs font-semibold text-gray-700">Materiais necessários:</p>
                              <div className="flex flex-wrap gap-1">
                                {activity.materials.map((material, index) => (
                                  <Badge 
                                    key={index} 
                                    variant="outline" 
                                    className="bg-gray-50 text-gray-600"
                                  >
                                    {material}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="px-5 py-3 border-t border-gray-100">
                            <Button className="w-full bg-minipassos-purple hover:bg-minipassos-purple-dark">
                              Ver atividade completa
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="concluidas" className="mt-6">
                  {filteredActivities.length === 0 ? (
                    <div className="bg-white rounded-lg p-8 text-center">
                      <p className="text-gray-500">Nenhuma atividade concluída encontrada.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredActivities.map((activity) => (
                        // Same activity card structure as above
                        <div 
                          key={activity.id} 
                          className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-all"
                        >
                          <div 
                            className="h-48 bg-center bg-cover relative"
                            style={{ backgroundImage: `url(${activity.videoThumbnail})` }}
                          >
                            {/* Card content same as above */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                              <Badge className={cn("capitalize", getCategoryColor(activity.category))}>
                                {getCategoryIcon(activity.category)}
                                <span className="ml-1">{activity.category}</span>
                              </Badge>
                              
                              <div className="flex gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className={cn(
                                    "rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40",
                                    activity.saved ? "text-yellow-400" : "text-white"
                                  )}
                                  onClick={() => toggleSaved(activity.id)}
                                >
                                  <BookmarkPlus size={18} />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className={cn(
                                    "rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40",
                                    activity.completed ? "text-green-400" : "text-white"
                                  )}
                                  onClick={() => toggleCompleted(activity.id)}
                                >
                                  <Check size={18} />
                                </Button>
                              </div>
                            </div>
                          </div>
                          <div className="p-5">
                            <h3 className="font-bold text-gray-800 mb-2">{activity.title}</h3>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{activity.description}</p>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                              <span className="flex items-center gap-1 text-xs text-gray-500">
                                <Clock size={14} />
                                {activity.duration}
                              </span>
                              <span className="flex items-center gap-1 text-xs text-gray-500">
                                <span>•</span>
                                {activity.ageRange}
                              </span>
                              <span className="flex items-center gap-1 text-xs text-gray-500">
                                <span>•</span>
                                Dificuldade: {activity.difficulty}
                              </span>
                            </div>
                            
                            <div className="space-y-2">
                              <p className="text-xs font-semibold text-gray-700">Materiais necessários:</p>
                              <div className="flex flex-wrap gap-1">
                                {activity.materials.map((material, index) => (
                                  <Badge 
                                    key={index} 
                                    variant="outline" 
                                    className="bg-gray-50 text-gray-600"
                                  >
                                    {material}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="px-5 py-3 border-t border-gray-100">
                            <Button className="w-full bg-minipassos-purple hover:bg-minipassos-purple-dark">
                              Ver atividade completa
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Activities;
