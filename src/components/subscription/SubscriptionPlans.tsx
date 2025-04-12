
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { SubscriptionPlan } from "@/types";

const plans: SubscriptionPlan[] = [
  {
    id: "basic",
    name: "Básico",
    price: 19.90,
    period: "mensal",
    features: [
      "Acompanhamento de marcos de desenvolvimento",
      "Diário do bebê com fotos e registros",
      "Lembretes de consultas e vacinas",
      "Acesso à biblioteca de conteúdo básico"
    ],
    color: "bg-minipassos-blue-light"
  },
  {
    id: "premium",
    name: "Premium",
    price: 39.90,
    period: "mensal",
    features: [
      "Todos os recursos do plano Básico",
      "Conteúdo exclusivo e aprofundado",
      "Avaliação personalizada de desenvolvimento",
      "Acesso a webinários com especialistas",
      "Suporte por e-mail em até 24 horas"
    ],
    isPopular: true,
    color: "bg-minipassos-purple"
  },
  {
    id: "family",
    name: "Família",
    price: 59.90,
    period: "mensal",
    features: [
      "Todos os recursos do plano Premium",
      "Suporte 24 horas por chat",
      "Consulta online com pediatra (mensal)",
      "Acompanhamento com especialistas",
      "Acesso para até 3 crianças",
      "Relatórios detalhados de desenvolvimento"
    ],
    color: "bg-minipassos-green"
  }
];

export default function SubscriptionPlans() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSubscribe = (planId: string) => {
    if (!user) {
      toast({
        title: "Você precisa estar logado",
        description: "Faça login para assinar um plano",
        variant: "destructive"
      });
      return;
    }
    
    setSelectedPlan(planId);
    toast({
      title: "Assinatura iniciada",
      description: `Você selecionou o plano ${plans.find(p => p.id === planId)?.name}. Em breve você será redirecionado para o pagamento.`,
    });
    
    // Aqui seria integrado com sistema de pagamento como Stripe
    // window.location.href = `/checkout/${planId}`;
  };

  return (
    <div className="container py-10">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h2 className="text-3xl font-bold mb-3">Planos de Assinatura</h2>
        <p className="text-gray-600">
          Escolha o plano ideal para acompanhar o desenvolvimento do seu bebê com conteúdo exclusivo e suporte de especialistas.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative flex flex-col border-2 ${plan.isPopular ? 'border-minipassos-purple shadow-lg' : 'border-gray-200'}`}
          >
            {plan.isPopular && (
              <div className="absolute -top-3 left-0 right-0 mx-auto w-32 bg-minipassos-purple text-white text-xs font-bold tracking-wider uppercase py-1 px-2 rounded-full text-center">
                Mais popular
              </div>
            )}
            
            <CardHeader className={`${plan.color} bg-opacity-20 text-center`}>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="mt-2">
                <span className="text-3xl font-bold">R$ {plan.price.toFixed(2)}</span>
                <span className="text-sm text-gray-600">/{plan.period}</span>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 pt-6">
              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            
            <CardFooter>
              <Button
                variant={plan.isPopular ? "default" : "outline"}
                className={`w-full ${plan.isPopular ? 'bg-minipassos-purple hover:bg-minipassos-purple-dark' : ''}`}
                onClick={() => handleSubscribe(plan.id)}
              >
                {selectedPlan === plan.id ? "Processando..." : "Assinar Agora"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="text-center mt-8 text-sm text-gray-500">
        <p>Todos os planos possuem garantia de satisfação de 7 dias. Cancele a qualquer momento sem compromisso.</p>
      </div>
    </div>
  );
}
