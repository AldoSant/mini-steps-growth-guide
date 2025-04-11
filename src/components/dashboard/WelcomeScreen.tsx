
import { Baby, Sparkles } from "lucide-react";
import RegisterBaby from "@/components/RegisterBaby";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const WelcomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-minipassos-purple mb-6">
        <Baby size={64} />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Bem-vindo ao MiniPassos!</h2>
      <p className="text-gray-500 text-center max-w-md mb-8">
        Para começar a acompanhar o desenvolvimento do seu bebê, registre as informações dele primeiro.
      </p>
      
      <div className="space-y-8 w-full max-w-md">
        <RegisterBaby />
        
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
          <h3 className="font-bold flex items-center gap-2 mb-3">
            <Sparkles size={18} className="text-minipassos-purple" />
            <span>O que você pode fazer com o MiniPassos:</span>
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 bg-minipassos-purple rounded-full"></div>
              <span>Acompanhar marcos de desenvolvimento baseados em pesquisas</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 bg-minipassos-purple rounded-full"></div>
              <span>Registrar momentos importantes no diário do bebê</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 bg-minipassos-purple rounded-full"></div>
              <span>Explorar atividades de estímulo recomendadas</span>
            </li>
          </ul>
          <div className="mt-4">
            <Button 
              variant="outline" 
              onClick={() => navigate("/biblioteca")}
              className="w-full"
            >
              Explorar biblioteca
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
