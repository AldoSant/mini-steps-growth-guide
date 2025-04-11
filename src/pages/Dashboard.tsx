
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MilestoneTimeline from "@/components/MilestoneTimeline";
import { Baby, Calendar, Award, CheckCircle } from "lucide-react";

const Dashboard = () => {
  const [currentTab, setCurrentTab] = useState("visao-geral");
  
  // Mock baby data
  const babyData = {
    name: "Maria Clara",
    age: {
      months: 8,
      days: 12
    },
    nextAppointment: "15 de maio",
    nextVaccine: "Reforço Pneumocócica",
    weight: "8,2kg",
    height: "68cm",
    lastUpdate: "22 de abril",
    completedMilestones: 24,
    totalMilestones: 32
  };
  
  // Mock milestones data
  const mockMilestones = [
    {
      id: 1,
      title: "Senta sem apoio",
      description: "Consegue sentar sozinho e manter-se na posição sem precisar se apoiar com as mãos.",
      category: "motor",
      ageMonths: 7,
      completed: true,
      date: "12 de março"
    },
    {
      id: 2,
      title: "Responde ao próprio nome",
      description: "Olha ou sorri quando seu nome é chamado.",
      category: "cognitivo",
      ageMonths: 7,
      completed: true,
      date: "5 de março"
    },
    {
      id: 3,
      title: "Transfere objetos entre as mãos",
      description: "Passa um brinquedo de uma mão para outra com facilidade.",
      category: "motor",
      ageMonths: 7,
      completed: true,
      date: "18 de março"
    },
    {
      id: 4,
      title: "Demonstra estranheza com pessoas desconhecidas",
      description: "Começa a demonstrar timidez ou ansiedade ao redor de pessoas desconhecidas.",
      category: "social",
      ageMonths: 8,
      completed: false
    },
    {
      id: 5,
      title: "Combina sílabas ao balbuciar",
      description: "Começa a juntar sílabas como 'ma-ma', 'pa-pa' mesmo que ainda sem sentido específico.",
      category: "linguagem",
      ageMonths: 8,
      completed: false
    },
    {
      id: 6,
      title: "Engatinha",
      description: "Consegue se deslocar engatinhando usando mãos e joelhos.",
      category: "motor",
      ageMonths: 9,
      completed: false
    },
    {
      id: 7,
      title: "Compreende 'não'",
      description: "Entende o significado da palavra 'não' e pode parar brevemente o que está fazendo quando ouve.",
      category: "cognitivo",
      ageMonths: 9,
      completed: false
    },
    {
      id: 8,
      title: "Pega objetos com pinça",
      description: "Utiliza o polegar e o indicador para pegar pequenos objetos (pinça fina).",
      category: "motor",
      ageMonths: 10,
      completed: false
    }
  ];

  // Progress calculation
  const progressPercentage = (babyData.completedMilestones / babyData.totalMilestones) * 100;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8 bg-gray-50">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Olá, bem-vindo de volta!
              </h1>
              <p className="text-gray-600">
                Veja o desenvolvimento de {babyData.name}, {babyData.age.months} meses e {babyData.age.days} dias
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 inline-flex items-center gap-2 bg-minipassos-green/10 text-minipassos-green-dark px-3 py-1.5 rounded-full text-sm">
              <CheckCircle size={16} />
              <span>Últimos dados atualizados em {babyData.lastUpdate}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Card 1 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Próxima consulta
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{babyData.nextAppointment}</p>
                  </div>
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                    <Calendar size={20} />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Card 2 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Próxima vacina
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{babyData.nextVaccine}</p>
                  </div>
                  <div className="p-2 bg-green-100 text-green-600 rounded-full">
                    <Award size={20} />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Card 3 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Peso atual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{babyData.weight}</p>
                  </div>
                  <div className="p-2 bg-purple-100 text-purple-600 rounded-full">
                    <Baby size={20} />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Card 4 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Altura atual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{babyData.height}</p>
                  </div>
                  <div className="p-2 bg-purple-100 text-purple-600 rounded-full">
                    <Baby size={20} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="visao-geral" className="mb-8" onValueChange={setCurrentTab}>
            <div className="bg-white rounded-lg p-1 mb-6 inline-block">
              <TabsList className="grid grid-cols-3 w-[400px]">
                <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
                <TabsTrigger value="marcos">Marcos de Desenvolvimento</TabsTrigger>
                <TabsTrigger value="atividades">Atividades</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="visao-geral" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Progresso de Desenvolvimento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Marcos Completados</span>
                      <span className="text-sm font-medium">{babyData.completedMilestones}/{babyData.totalMilestones}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-full bg-minipassos-purple rounded-full"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 pt-4">
                      {/* Category progress blocks */}
                      {[
                        { name: "Motor", color: "bg-minipassos-purple", progress: "7/10" },
                        { name: "Cognitivo", color: "bg-minipassos-blue", progress: "6/8" },
                        { name: "Social", color: "bg-minipassos-green", progress: "5/6" },
                        { name: "Linguagem", color: "bg-minipassos-purple-dark", progress: "6/8" }
                      ].map((category, index) => (
                        <div key={index} className="flex flex-col">
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                            <span className="text-xs font-medium">{category.name}</span>
                          </div>
                          <span className="text-sm text-gray-600">{category.progress}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Próximos Marcos Importantes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {mockMilestones.filter(m => !m.completed).slice(0, 3).map((milestone) => (
                        <li key={milestone.id} className="flex gap-4">
                          <div className={`w-1 self-stretch rounded-full bg-minipassos-${
                            milestone.category === "motor" ? "purple" : 
                            milestone.category === "cognitivo" ? "blue" : 
                            milestone.category === "social" ? "green" : "purple-dark"
                          }`}></div>
                          <div>
                            <p className="font-medium text-gray-800">{milestone.title}</p>
                            <p className="text-sm text-gray-500">{milestone.ageMonths} meses</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Atividades Recomendadas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      <li className="flex gap-4">
                        <div className="w-1 self-stretch rounded-full bg-minipassos-blue"></div>
                        <div>
                          <p className="font-medium text-gray-800">Brincadeira de esconde-achou</p>
                          <p className="text-sm text-gray-500">Estimula memória e cognição</p>
                        </div>
                      </li>
                      <li className="flex gap-4">
                        <div className="w-1 self-stretch rounded-full bg-minipassos-purple"></div>
                        <div>
                          <p className="font-medium text-gray-800">Alcançar objetos durante engatinhamento</p>
                          <p className="text-sm text-gray-500">Fortalece os músculos e coordenação</p>
                        </div>
                      </li>
                      <li className="flex gap-4">
                        <div className="w-1 self-stretch rounded-full bg-minipassos-green"></div>
                        <div>
                          <p className="font-medium text-gray-800">Imitação de sons e expressões faciais</p>
                          <p className="text-sm text-gray-500">Desenvolve interação social</p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="marcos">
              <Card>
                <CardHeader>
                  <CardTitle>Marcos de Desenvolvimento</CardTitle>
                </CardHeader>
                <CardContent>
                  <MilestoneTimeline 
                    milestones={mockMilestones} 
                    currentMonth={babyData.age.months}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="atividades">
              <Card>
                <CardHeader>
                  <CardTitle>Atividades Recomendadas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      {
                        title: "Brincadeira de esconde-achou",
                        description: "Esconda um brinquedo sob um cobertor e incentive seu bebê a encontrá-lo.",
                        area: "Cognitivo",
                        time: "5 minutos",
                        materials: "Cobertor, brinquedo pequeno"
                      },
                      {
                        title: "Alcançar objetos durante engatinhamento",
                        description: "Coloque brinquedos a uma curta distância para incentivar o engatinhar.",
                        area: "Motor",
                        time: "10 minutos",
                        materials: "Brinquedos coloridos"
                      },
                      {
                        title: "Imitação de sons e expressões",
                        description: "Faça sons e expressões faciais para o bebê imitar, estimulando interação.",
                        area: "Social",
                        time: "5 minutos",
                        materials: "Nenhum"
                      },
                      {
                        title: "Empilhar blocos",
                        description: "Demonstre como empilhar blocos e deixe o bebê tentar fazer o mesmo.",
                        area: "Motor Fino",
                        time: "10 minutos",
                        materials: "Blocos de empilhar"
                      },
                      {
                        title: "Leitura interativa",
                        description: "Leia livros com imagens coloridas, apontando e nomeando objetos.",
                        area: "Linguagem",
                        time: "10 minutos",
                        materials: "Livro infantil com imagens"
                      },
                      {
                        title: "Bater palmas com música",
                        description: "Coloque músicas infantis e incentive o bebê a bater palmas no ritmo.",
                        area: "Musical",
                        time: "8 minutos",
                        materials: "Música infantil"
                      }
                    ].map((activity, index) => (
                      <div key={index} className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-all">
                        <div className="h-32 bg-gradient-to-r from-minipassos-purple/80 to-minipassos-blue/80 flex items-center justify-center">
                          <span className="text-2xl font-bold text-white">Atividade {index + 1}</span>
                        </div>
                        <div className="p-5">
                          <h3 className="font-bold text-gray-800 mb-2">{activity.title}</h3>
                          <p className="text-gray-600 text-sm mb-4">{activity.description}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            <span className="px-2 py-1 bg-minipassos-purple/10 text-minipassos-purple text-xs rounded-full">
                              {activity.area}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              {activity.time}
                            </span>
                          </div>
                          
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-gray-700">Materiais:</p>
                            <p className="text-xs text-gray-600">{activity.materials}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
