
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RegisterBaby from "@/components/RegisterBaby";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Baby, Calendar, Check, Clock, FileText, Plus, User } from "lucide-react";
import { differenceInMonths, format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import { useBaby } from "@/context/BabyContext";
import { useMilestone } from "@/context/MilestoneContext";
import MilestoneTimeline from "@/components/MilestoneTimeline";

const Dashboard = () => {
  const { user } = useAuth();
  const { babies, currentBaby, setCurrentBaby } = useBaby();
  const { milestones, babyMilestones } = useMilestone();
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  
  // Calcular a idade do bebê atual em meses
  const getBabyAge = () => {
    if (!currentBaby) return null;
    
    const birthDate = parseISO(currentBaby.birth_date);
    const now = new Date();
    const ageInMonths = differenceInMonths(now, birthDate);
    
    if (ageInMonths === 0) {
      // Menos de um mês
      const days = Math.floor((now.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));
      return `${days} dias`;
    } else if (ageInMonths < 24) {
      // Menos de 2 anos, mostrar em meses
      return ageInMonths === 1 ? "1 mês" : `${ageInMonths} meses`;
    } else {
      // 2 anos ou mais, mostrar em anos e meses
      const years = Math.floor(ageInMonths / 12);
      const remainingMonths = ageInMonths % 12;
      
      if (remainingMonths === 0) {
        return years === 1 ? "1 ano" : `${years} anos`;
      } else {
        const yearText = years === 1 ? "1 ano" : `${years} anos`;
        const monthText = remainingMonths === 1 ? "1 mês" : `${remainingMonths} meses`;
        return `${yearText} e ${monthText}`;
      }
    }
  };
  
  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };
  
  // Prepare milestones data for the timeline
  const getCurrentAgeInMonths = () => {
    if (!currentBaby) return 0;
    const birthDate = parseISO(currentBaby.birth_date);
    return differenceInMonths(new Date(), birthDate);
  };
  
  const currentAgeInMonths = getCurrentAgeInMonths();
  
  // Prepare milestone data with completion status
  const preparedMilestones = milestones.map(milestone => {
    const babyMilestone = babyMilestones.find(bm => 
      bm.milestone_id === milestone.id && currentBaby && bm.baby_id === currentBaby.id
    );
    
    return {
      ...milestone,
      completed: babyMilestone ? babyMilestone.completed : false,
      completion_date: babyMilestone ? babyMilestone.completion_date : undefined
    };
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8 bg-gray-50">
        <div className="container">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600">
              Acompanhe o desenvolvimento do seu bebê
            </p>
          </div>
          
          {babies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-minipassos-purple mb-6">
                <Baby size={64} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Bem-vindo ao MiniPassos!</h2>
              <p className="text-gray-500 text-center max-w-md mb-8">
                Para começar a acompanhar o desenvolvimento do seu bebê, registre as informações dele primeiro.
              </p>
              
              <RegisterBaby />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1 space-y-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex justify-between items-center">
                      <span>Bebês</span>
                      <Dialog open={registerDialogOpen} onOpenChange={setRegisterDialogOpen}>
                        <DialogTrigger asChild>
                          <Button size="icon" variant="ghost">
                            <Plus size={16} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Registrar novo bebê</DialogTitle>
                          </DialogHeader>
                          <RegisterBaby />
                        </DialogContent>
                      </Dialog>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {babies.map((baby) => (
                        <div 
                          key={baby.id}
                          className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                            currentBaby && currentBaby.id === baby.id
                              ? "bg-minipassos-purple text-white"
                              : "hover:bg-gray-100"
                          }`}
                          onClick={() => setCurrentBaby(baby)}
                        >
                          <div className="mr-3 bg-white rounded-full p-1">
                            <Baby size={20} className="text-minipassos-purple" />
                          </div>
                          <div>
                            <h3 className={`font-medium ${
                              currentBaby && currentBaby.id === baby.id
                                ? "text-white"
                                : "text-gray-800"
                            }`}>
                              {baby.name}
                            </h3>
                            <p className={`text-xs ${
                              currentBaby && currentBaby.id === baby.id
                                ? "text-white/80"
                                : "text-gray-500"
                            }`}>
                              {formatDate(baby.birth_date)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {currentBaby && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle>Informações</CardTitle>
                      <CardDescription>
                        Detalhes de {currentBaby.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock size={16} className="mr-2" />
                            <span>Idade</span>
                          </div>
                          <span className="text-sm font-medium">{getBabyAge()}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar size={16} className="mr-2" />
                            <span>Nascimento</span>
                          </div>
                          <span className="text-sm font-medium">
                            {formatDate(currentBaby.birth_date)}
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <div className="flex items-center text-sm text-gray-500">
                            <User size={16} className="mr-2" />
                            <span>Sexo</span>
                          </div>
                          <span className="text-sm font-medium capitalize">
                            {currentBaby.gender}
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <div className="flex items-center text-sm text-gray-500">
                            <FileText size={16} className="mr-2" />
                            <span>Peso ao nascer</span>
                          </div>
                          <span className="text-sm font-medium">
                            {Number(currentBaby.weight).toLocaleString()} kg
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <div className="flex items-center text-sm text-gray-500">
                            <FileText size={16} className="mr-2" />
                            <span>Altura ao nascer</span>
                          </div>
                          <span className="text-sm font-medium">
                            {Number(currentBaby.height).toLocaleString()} cm
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
              
              <div className="lg:col-span-3">
                {currentBaby && (
                  <Tabs defaultValue="overview">
                    <div className="flex justify-between items-center mb-6">
                      <TabsList>
                        <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                        <TabsTrigger value="milestones">Marcos</TabsTrigger>
                        <TabsTrigger value="activities">Atividades</TabsTrigger>
                      </TabsList>
                    </div>
                    
                    <TabsContent value="overview" className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Próximos marcos</CardTitle>
                          <CardDescription>
                            Marcos de desenvolvimento previstos para a idade atual
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="px-2">
                          <MilestoneTimeline 
                            milestones={preparedMilestones} 
                            currentMonth={currentAgeInMonths}
                          />
                        </CardContent>
                      </Card>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Próximas atividades</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">
                              4 atividades recomendadas para hoje
                            </p>
                            <div className="mt-2">
                              <Button 
                                size="sm" 
                                className="w-full bg-minipassos-purple hover:bg-minipassos-purple-dark"
                                onClick={() => window.location.href = "/atividades"}
                              >
                                Ver atividades
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Diário</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">
                              Registre momentos especiais no diário
                            </p>
                            <div className="mt-2">
                              <Button 
                                size="sm" 
                                className="w-full bg-minipassos-purple hover:bg-minipassos-purple-dark"
                                onClick={() => window.location.href = "/diario"}
                              >
                                Abrir diário
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Artigos</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">
                              Conteúdo especializado para a fase atual
                            </p>
                            <div className="mt-2">
                              <Button 
                                size="sm" 
                                className="w-full bg-minipassos-purple hover:bg-minipassos-purple-dark"
                                onClick={() => window.location.href = "/biblioteca"}
                              >
                                Acessar biblioteca
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="milestones">
                      <Card>
                        <CardHeader>
                          <CardTitle>Marcos de desenvolvimento</CardTitle>
                          <CardDescription>
                            Acompanhe o progresso de {currentBaby.name}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-8">
                            <MilestoneTimeline 
                              milestones={preparedMilestones}
                              currentMonth={currentAgeInMonths}
                            />
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <h3 className="font-semibold mb-3 flex items-center text-minipassos-purple">
                                  <Check size={16} className="mr-2" />
                                  Marcos alcançados
                                </h3>
                                <div className="space-y-2">
                                  {preparedMilestones
                                    .filter(m => m.completed)
                                    .slice(0, 2)
                                    .map(milestone => (
                                      <div key={milestone.id} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg border border-green-100">
                                        <Check size={16} className="text-green-500" />
                                        <span className="text-sm">{milestone.title}</span>
                                      </div>
                                    ))}
                                  {preparedMilestones.filter(m => m.completed).length === 0 && (
                                    <p className="text-sm text-gray-500 p-2">
                                      Nenhum marco alcançado ainda
                                    </p>
                                  )}
                                </div>
                              </div>
                              
                              <div>
                                <h3 className="font-semibold mb-3 flex items-center text-yellow-600">
                                  <Clock size={16} className="mr-2" />
                                  Próximos marcos
                                </h3>
                                <div className="space-y-2">
                                  {preparedMilestones
                                    .filter(m => !m.completed && m.age_months >= currentAgeInMonths)
                                    .slice(0, 2)
                                    .map(milestone => (
                                      <div key={milestone.id} className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg border border-yellow-100">
                                        <Clock size={16} className="text-yellow-500" />
                                        <span className="text-sm">{milestone.title}</span>
                                      </div>
                                    ))}
                                  {preparedMilestones.filter(m => !m.completed && m.age_months >= currentAgeInMonths).length === 0 && (
                                    <p className="text-sm text-gray-500 p-2">
                                      Não há próximos marcos para exibir
                                    </p>
                                  )}
                                </div>
                              </div>
                              
                              <div>
                                <h3 className="font-semibold mb-3 flex items-center">
                                  <Baby size={16} className="mr-2" />
                                  Distribuição
                                </h3>
                                <div className="space-y-2">
                                  {["motor", "cognitivo", "social", "linguagem"].map(category => {
                                    const total = preparedMilestones.filter(m => m.category === category).length;
                                    const completed = preparedMilestones.filter(m => m.category === category && m.completed).length;
                                    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
                                    
                                    return (
                                      <div key={category} className="space-y-1">
                                        <div className="flex justify-between text-xs">
                                          <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                                          <span>{percentage}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                          <div 
                                            className={`h-2 rounded-full ${
                                              category === "motor" ? "bg-minipassos-purple" :
                                              category === "cognitivo" ? "bg-minipassos-blue" :
                                              category === "social" ? "bg-minipassos-green" :
                                              "bg-minipassos-purple-dark"
                                            }`} 
                                            style={{ width: `${percentage}%` }}
                                          ></div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="activities">
                      <Card>
                        <CardHeader>
                          <CardTitle>Atividades recomendadas</CardTitle>
                          <CardDescription>
                            Atividades para estimular o desenvolvimento de {currentBaby.name}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 border rounded-lg">
                              <h3 className="font-medium mb-1">Hora do espelho</h3>
                              <p className="text-sm text-gray-600 mb-2">
                                Posicione o bebê em frente ao espelho e interaja com ele, apontando para partes do rosto.
                              </p>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">Cognitivo • 5-10 min</span>
                                <Button size="sm" variant="outline" className="h-7 text-xs">
                                  Ver detalhes
                                </Button>
                              </div>
                            </div>
                            <div className="p-4 border rounded-lg">
                              <h3 className="font-medium mb-1">Exploração sensorial</h3>
                              <p className="text-sm text-gray-600 mb-2">
                                Ofereça diferentes texturas para o bebê tocar e explorar com as mãos.
                              </p>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">Sensorial • 5-10 min</span>
                                <Button size="sm" variant="outline" className="h-7 text-xs">
                                  Ver detalhes
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-6 flex justify-center">
                            <Button 
                              className="bg-minipassos-purple hover:bg-minipassos-purple-dark"
                              onClick={() => window.location.href = "/atividades"}
                            >
                              Ver todas as atividades
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
