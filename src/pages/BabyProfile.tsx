
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useBaby } from "@/context/BabyContext";
import { useMilestone } from "@/context/MilestoneContext";
import { getBabyAge, getCurrentAgeInMonths } from "@/lib/date-utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Baby, Book, Brain, MessagesSquare, Award, Dumbbell, ChevronRight, LineChart } from "lucide-react";
import BabySidebar from "@/components/dashboard/BabySidebar";
import ProfileDevelopmentChart from "@/components/profile/ProfileDevelopmentChart";
import SkillsPrediction from "@/components/profile/SkillsPrediction";
import RecommendedActivities from "@/components/profile/RecommendedActivities";

const BabyProfile = () => {
  const { currentBaby } = useBaby();
  const { milestones, babyMilestones, getMilestonesByCategory } = useMilestone();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Calculate development percentages
  const motorMilestones = getMilestonesByCategory("motor");
  const cognitiveMilestones = getMilestonesByCategory("cognitivo");
  const socialMilestones = getMilestonesByCategory("social");
  const languageMilestones = getMilestonesByCategory("linguagem");
  
  const calculateCompletion = (milestones: any[]) => {
    if (milestones.length === 0) return 0;
    const completed = milestones.filter(m => m.completed).length;
    return Math.round((completed / milestones.length) * 100);
  };
  
  const motorCompletion = calculateCompletion(motorMilestones);
  const cognitiveCompletion = calculateCompletion(cognitiveMilestones);
  const socialCompletion = calculateCompletion(socialMilestones);
  const languageCompletion = calculateCompletion(languageMilestones);
  
  // Calculate overall skills distribution
  const skillsDistribution = {
    motor: motorCompletion, 
    cognitivo: cognitiveCompletion, 
    social: socialCompletion, 
    linguagem: languageCompletion
  };
  
  // Find strongest and weakest areas
  const strongestArea = Object.entries(skillsDistribution).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  const weakestArea = Object.entries(skillsDistribution).reduce((a, b) => a[1] < b[1] ? a : b)[0];
  
  const currentAgeInMonths = getCurrentAgeInMonths(currentBaby);
  
  if (!currentBaby) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-8 bg-gray-50">
          <div className="container">
            <h1 className="text-2xl font-bold mb-4">Perfil do bebê</h1>
            <p>Selecione um bebê para ver o perfil de desenvolvimento.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8 bg-gray-50">
        <div className="container">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Perfil de {currentBaby.name}</h1>
            <p className="text-gray-600">
              Análise de habilidades e tendências de desenvolvimento
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <BabySidebar />
            
            <div className="lg:col-span-3">
              <Card className="mb-6">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Resumo de desenvolvimento</CardTitle>
                      <CardDescription>
                        Idade atual: {getBabyAge(currentBaby)}
                      </CardDescription>
                    </div>
                    <div className="bg-minipassos-purple/10 text-minipassos-purple font-medium px-4 py-2 rounded-full flex items-center">
                      <Award className="w-5 h-5 mr-2" />
                      <span>{Math.round((motorCompletion + cognitiveCompletion + socialCompletion + languageCompletion) / 4)}% Completo</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center">
                          <Dumbbell className="w-4 h-4 mr-2 text-minipassos-purple" />
                          <span className="text-sm font-medium">Habilidades Motoras</span>
                        </div>
                        <span className="text-sm font-medium">{motorCompletion}%</span>
                      </div>
                      <Progress value={motorCompletion} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center">
                          <Brain className="w-4 h-4 mr-2 text-minipassos-blue" />
                          <span className="text-sm font-medium">Habilidades Cognitivas</span>
                        </div>
                        <span className="text-sm font-medium">{cognitiveCompletion}%</span>
                      </div>
                      <Progress value={cognitiveCompletion} className="h-2 bg-gray-100" indicatorColor="bg-minipassos-blue" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center">
                          <Baby className="w-4 h-4 mr-2 text-minipassos-green" />
                          <span className="text-sm font-medium">Habilidades Sociais</span>
                        </div>
                        <span className="text-sm font-medium">{socialCompletion}%</span>
                      </div>
                      <Progress value={socialCompletion} className="h-2 bg-gray-100" indicatorColor="bg-minipassos-green" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center">
                          <MessagesSquare className="w-4 h-4 mr-2 text-minipassos-purple-dark" />
                          <span className="text-sm font-medium">Habilidades de Linguagem</span>
                        </div>
                        <span className="text-sm font-medium">{languageCompletion}%</span>
                      </div>
                      <Progress value={languageCompletion} className="h-2 bg-gray-100" indicatorColor="bg-minipassos-purple-dark" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                  <TabsTrigger value="skills">Análise de Habilidades</TabsTrigger>
                  <TabsTrigger value="recommendations">Recomendações</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center text-lg">
                          <LineChart className="w-5 h-5 mr-2 text-minipassos-purple" />
                          Desenvolvimento por Área
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <ProfileDevelopmentChart 
                          motorValue={motorCompletion} 
                          cognitiveValue={cognitiveCompletion} 
                          socialValue={socialCompletion} 
                          languageValue={languageCompletion}
                        />
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center text-lg">
                          <Award className="w-5 h-5 mr-2 text-minipassos-purple" />
                          Perfil de Habilidades
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <SkillsPrediction
                          skillsDistribution={skillsDistribution}
                          currentAge={currentAgeInMonths}
                          babyName={currentBaby.name}
                          strongestArea={strongestArea}
                          weakestArea={weakestArea}
                        />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="skills">
                  <Card>
                    <CardHeader>
                      <CardTitle>Análise Detalhada de Habilidades</CardTitle>
                      <CardDescription>
                        Análise baseada em marcos de desenvolvimento completados
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="p-4 border border-minipassos-purple/20 rounded-lg bg-minipassos-purple/5">
                          <h3 className="text-lg font-medium flex items-center mb-2">
                            <Dumbbell className="w-5 h-5 mr-2 text-minipassos-purple" />
                            Habilidades Motoras
                          </h3>
                          <p className="text-gray-700 mb-4">
                            {motorCompletion > 70 ? (
                              "Seu bebê demonstra excelente desenvolvimento motor, superando a média para a idade. Continuar com atividades físicas pode apoiar um potencial talento nesta área."
                            ) : motorCompletion > 50 ? (
                              "Seu bebê está se desenvolvendo bem motoramente, dentro do esperado para sua idade. Continue estimulando com atividades que envolvam movimento."
                            ) : (
                              "Seu bebê pode se beneficiar de mais estímulos na área motora. Tente incluir mais atividades que envolvam movimento no dia a dia."
                            )}
                          </p>
                          <div className="text-sm">
                            <div className="flex items-center justify-between">
                              <span>Marcos completados:</span>
                              <span className="font-medium">{motorMilestones.filter(m => m.completed).length} de {motorMilestones.length}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 border border-minipassos-blue/20 rounded-lg bg-minipassos-blue/5">
                          <h3 className="text-lg font-medium flex items-center mb-2">
                            <Brain className="w-5 h-5 mr-2 text-minipassos-blue" />
                            Habilidades Cognitivas
                          </h3>
                          <p className="text-gray-700 mb-4">
                            {cognitiveCompletion > 70 ? (
                              "Seu bebê demonstra habilidades cognitivas avançadas para a idade. Ele pode ter uma predisposição natural para resolução de problemas e raciocínio lógico."
                            ) : cognitiveCompletion > 50 ? (
                              "As habilidades cognitivas do seu bebê estão se desenvolvendo adequadamente para a idade. Continue oferecendo brincadeiras que estimulem o raciocínio."
                            ) : (
                              "Seu bebê pode se beneficiar de mais estímulos cognitivos. Experimente atividades que envolvam resolução de problemas simples adequados à idade."
                            )}
                          </p>
                          <div className="text-sm">
                            <div className="flex items-center justify-between">
                              <span>Marcos completados:</span>
                              <span className="font-medium">{cognitiveMilestones.filter(m => m.completed).length} de {cognitiveMilestones.length}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 border border-minipassos-green/20 rounded-lg bg-minipassos-green/5">
                          <h3 className="text-lg font-medium flex items-center mb-2">
                            <Baby className="w-5 h-5 mr-2 text-minipassos-green" />
                            Habilidades Sociais
                          </h3>
                          <p className="text-gray-700 mb-4">
                            {socialCompletion > 70 ? (
                              "Seu bebê demonstra habilidades sociais muito desenvolvidas. Ele parece ter facilidade em interagir e responder a estímulos sociais."
                            ) : socialCompletion > 50 ? (
                              "As habilidades sociais do seu bebê estão se desenvolvendo bem. Continue promovendo interações com outras pessoas."
                            ) : (
                              "Seu bebê pode se beneficiar de mais interações sociais. Tente proporcionar mais momentos de convívio com outras crianças e adultos."
                            )}
                          </p>
                          <div className="text-sm">
                            <div className="flex items-center justify-between">
                              <span>Marcos completados:</span>
                              <span className="font-medium">{socialMilestones.filter(m => m.completed).length} de {socialMilestones.length}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 border border-minipassos-purple-dark/20 rounded-lg bg-minipassos-purple-dark/5">
                          <h3 className="text-lg font-medium flex items-center mb-2">
                            <MessagesSquare className="w-5 h-5 mr-2 text-minipassos-purple-dark" />
                            Habilidades de Linguagem
                          </h3>
                          <p className="text-gray-700 mb-4">
                            {languageCompletion > 70 ? (
                              "Seu bebê demonstra habilidades de linguagem avançadas. Ele pode ter uma facilidade natural para comunicação e expressão verbal."
                            ) : languageCompletion > 50 ? (
                              "O desenvolvimento da linguagem do seu bebê está dentro do esperado para a idade. Continue conversando e lendo para estimular esta área."
                            ) : (
                              "Seu bebê pode se beneficiar de mais estímulos de linguagem. Aumente o tempo dedicado à leitura e conversas dirigidas a ele."
                            )}
                          </p>
                          <div className="text-sm">
                            <div className="flex items-center justify-between">
                              <span>Marcos completados:</span>
                              <span className="font-medium">{languageMilestones.filter(m => m.completed).length} de {languageMilestones.length}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="recommendations">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recomendações Personalizadas</CardTitle>
                      <CardDescription>
                        Sugestões de atividades baseadas no perfil de {currentBaby.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <RecommendedActivities 
                        skillsDistribution={skillsDistribution}
                        currentAge={currentAgeInMonths}
                        strongestArea={strongestArea}
                      />
                    </CardContent>
                  </Card>
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

export default BabyProfile;
