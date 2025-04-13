
import { ArrowRight, Baby, BookOpen, Calendar, Activity, Image, BarChart, Check, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import BabyForm from "@/components/BabyForm";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <HeroSection />
        
        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Acompanhe todo o desenvolvimento do seu filho
              </h2>
              <p className="text-gray-600 text-lg">
                Baseado em recomendações da OMS e especialistas, o MiniPassos oferece uma visão completa do desenvolvimento do seu bebê.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="feature-card bg-minipassos-purple-light">
                <div className="feature-icon bg-minipassos-purple">
                  <BarChart size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Marcos de Desenvolvimento</h3>
                <p className="text-gray-600 text-sm">
                  Acompanhe os marcos físicos, cognitivos, sociais e de linguagem do seu bebê.
                </p>
              </div>
              
              {/* Feature 2 */}
              <div className="feature-card bg-minipassos-blue-light">
                <div className="feature-icon bg-minipassos-blue">
                  <Activity size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Atividades Diárias</h3>
                <p className="text-gray-600 text-sm">
                  Atividades personalizadas baseadas na idade e no desenvolvimento do seu bebê.
                </p>
              </div>
              
              {/* Feature 3 */}
              <div className="feature-card bg-minipassos-green-light">
                <div className="feature-icon bg-minipassos-green">
                  <Image size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Diário do Bebê</h3>
                <p className="text-gray-600 text-sm">
                  Registre momentos especiais com fotos, vídeos e anotações do desenvolvimento.
                </p>
              </div>
              
              {/* Feature 4 */}
              <div className="feature-card bg-minipassos-yellow">
                <div className="feature-icon bg-[#F59E0B]">
                  <Calendar size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Calendário de Vacinas</h3>
                <p className="text-gray-600 text-sm">
                  Não perca nenhuma vacina importante com nossos lembretes personalizados.
                </p>
              </div>
              
              {/* Feature 5 */}
              <div className="feature-card bg-minipassos-peach">
                <div className="feature-icon bg-[#F97316]">
                  <BookOpen size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Biblioteca Educativa</h3>
                <p className="text-gray-600 text-sm">
                  Conteúdo sobre sono, alimentação, choro e mais, validado por especialistas.
                </p>
              </div>
              
              {/* Feature 6 */}
              <div className="feature-card bg-minipassos-purple-light">
                <div className="feature-icon bg-minipassos-purple-dark">
                  <Stethoscope size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Histórico Médico</h3>
                <p className="text-gray-600 text-sm">
                  Registre consultas médicas, vacinas e monitore o crescimento do seu bebê.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Registration Section - Moved up */}
        <section className="py-20 bg-white">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Comece a acompanhar o desenvolvimento do seu bebê hoje mesmo
                </h2>
                <p className="text-gray-600 text-lg">
                  Cadastre as informações básicas do seu bebê e tenha acesso a um acompanhamento personalizado para cada etapa do desenvolvimento.
                </p>
                <ul className="space-y-4">
                  {[
                    "Marcos de desenvolvimento baseados em pesquisas",
                    "Atividades diárias personalizadas",
                    "Alertas de desenvolvimento precoces",
                    "Lembretes de consultas e vacinas"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="rounded-full p-1 bg-minipassos-purple/10 text-minipassos-purple mt-1">
                        <Check size={14} />
                      </div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
                
                {!user && (
                  <div className="mt-4">
                    <Button asChild size="lg" className="bg-minipassos-purple hover:bg-minipassos-purple-dark">
                      <Link to="/auth">
                        Criar uma conta
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
              
              <div>
                {user ? (
                  <BabyForm />
                ) : (
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center space-y-6">
                    <Baby size={60} className="mx-auto text-minipassos-purple" />
                    <h3 className="text-xl font-bold">Faça login para cadastrar seu bebê</h3>
                    <p className="text-gray-600">
                      Crie uma conta gratuita ou faça login para começar a acompanhar o desenvolvimento do seu bebê.
                    </p>
                    <Button 
                      asChild 
                      className="w-full bg-minipassos-purple hover:bg-minipassos-purple-dark"
                    >
                      <Link to="/auth">
                        Entrar ou Cadastrar
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonial Section */}
        <section className="py-20 bg-gray-50">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                O que dizem os pais
              </h2>
              <p className="text-gray-600 text-lg">
                Famílias de todo o Brasil já confiam no MiniPassos para acompanhar o desenvolvimento dos seus pequenos.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  text: "O MiniPassos me ajudou a entender melhor as fases do desenvolvimento da minha filha e me ensinou atividades que estimulam cada habilidade.",
                  name: "Ana Clara",
                  role: "Mãe da Sophia, 8 meses"
                },
                {
                  text: "Como pai de primeira viagem, o app tirou várias dúvidas sobre o desenvolvimento do meu filho e me deu ideias de brincadeiras que nunca teria pensado.",
                  name: "Marcos Paulo",
                  role: "Pai do Bernardo, 1 ano e 3 meses"
                },
                {
                  text: "A biblioteca de conteúdos me salvou várias vezes, especialmente nos momentos difíceis com problemas de sono e introdução alimentar.",
                  name: "Carolina Mendes",
                  role: "Mãe dos gêmeos Miguel e Gabriel, 2 anos"
                }
              ].map((testimonial, index) => (
                <div key={index} className="bg-white p-6 rounded-3xl shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#9b87f5" stroke="#9b87f5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6">"{testimonial.text}"</p>
                  <div>
                    <p className="font-bold text-gray-800">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Subscription Plans - Moved to the end as requested */}
        <section className="py-20 bg-gray-50">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Planos para cada fase do desenvolvimento
              </h2>
              <p className="text-gray-600 text-lg mb-6">
                Escolha o plano ideal para acompanhar o crescimento do seu bebê com conteúdo exclusivo.
              </p>
              <Button asChild size="lg" className="bg-minipassos-purple hover:bg-minipassos-purple-dark">
                <Link to="/assinatura">
                  Ver Planos de Assinatura
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Básico",
                  price: "R$19,90",
                  features: [
                    "Acompanhamento básico de desenvolvimento",
                    "Diário do bebê",
                    "Calendário de vacinas",
                    "Biblioteca básica"
                  ]
                },
                {
                  name: "Premium",
                  price: "R$39,90",
                  popular: true,
                  features: [
                    "Todos os recursos do plano básico",
                    "Conteúdo exclusivo e aprofundado",
                    "Avaliação personalizada",
                    "Suporte por e-mail em 24h"
                  ]
                },
                {
                  name: "Família",
                  price: "R$59,90",
                  features: [
                    "Todos os recursos do plano premium",
                    "Suporte 24 horas",
                    "Consulta mensal com especialista",
                    "Até 3 crianças por conta"
                  ]
                }
              ].map((plan, index) => (
                <div key={index} className={`bg-white rounded-xl border-2 p-6 shadow-sm relative ${plan.popular ? "border-minipassos-purple" : "border-gray-200"}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-0 right-0 mx-auto w-32 bg-minipassos-purple text-white text-xs font-bold tracking-wider uppercase py-1 px-2 rounded-full text-center">
                      Mais popular
                    </div>
                  )}
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-2xl font-bold text-minipassos-purple-dark">{plan.price}<span className="text-sm text-gray-500">/mês</span></p>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check size={18} className="text-green-500 shrink-0 mt-1" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild variant={plan.popular ? "default" : "outline"} className={`w-full ${plan.popular ? "bg-minipassos-purple hover:bg-minipassos-purple-dark" : ""}`}>
                    <Link to="/assinatura">
                      Saiba mais
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Button asChild size="lg" className="bg-minipassos-purple hover:bg-minipassos-purple-dark">
                <Link to={user ? "/dashboard" : "/auth"}>
                  {user ? "Ir para o Dashboard" : "Começar gratuitamente"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
