
import { Baby } from "lucide-react";
import RegisterBaby from "@/components/RegisterBaby";

const WelcomeScreen = () => {
  return (
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
  );
};

export default WelcomeScreen;
