
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SubscriptionPlans from "@/components/subscription/SubscriptionPlans";
import { Button } from "@/components/ui/button";
import { ArrowDown, ShieldCheck } from "lucide-react";

export default function Subscription() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="bg-gradient-to-b from-minipassos-purple/10 to-white py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-6">Conteúdo exclusivo para o desenvolvimento do seu bebê</h1>
              <p className="text-xl text-gray-600 mb-8">
                Acesse conteúdo especializado e tenha acompanhamento profissional para cada fase do desenvolvimento.
              </p>
              <Button size="lg" className="bg-minipassos-purple hover:bg-minipassos-purple-dark">
                <ShieldCheck className="mr-2 h-5 w-5" />
                Ver nossos planos
              </Button>
              <div className="mt-10 flex justify-center">
                <ArrowDown className="animate-bounce h-8 w-8 text-minipassos-purple" />
              </div>
            </div>
          </div>
        </section>
        
        <SubscriptionPlans />
        
        <section className="py-16 bg-gray-50">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-10">Perguntas Frequentes</h2>
              
              <div className="space-y-6">
                {[
                  {
                    question: "Como funciona a garantia de satisfação?",
                    answer: "Você tem 7 dias para experimentar qualquer plano. Se não estiver satisfeito, basta cancelar e solicitar o reembolso. Sem perguntas, sem complicações."
                  },
                  {
                    question: "Posso mudar de plano depois?",
                    answer: "Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. A cobrança será ajustada proporcionalmente."
                  },
                  {
                    question: "Como funciona o acesso a especialistas?",
                    answer: "No plano Premium, você tem acesso a webinários com especialistas. No plano Família, além dos webinários, você tem direito a consultas online mensais com pediatras e outros profissionais."
                  },
                  {
                    question: "O que são os conteúdos exclusivos?",
                    answer: "São artigos, vídeos e guias aprofundados sobre desenvolvimento infantil, produzidos por especialistas em pediatria, psicologia do desenvolvimento e educação infantil."
                  }
                ].map((item, i) => (
                  <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold mb-2">{item.question}</h3>
                    <p className="text-gray-600">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
