
import { Baby, Sparkles, FileText, BookOpen, PlusCircle } from "lucide-react";
import RegisterBaby from "@/components/RegisterBaby";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WelcomeScreenProps {
  isProfessional?: boolean;
}

const WelcomeScreen = ({ isProfessional = false }: WelcomeScreenProps) => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  
  // Check if the professional account is verified
  const isVerified = isProfessional && userProfile?.is_verified;

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-minipassos-purple mb-6">
        <Baby size={64} />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Bem-vindo ao MiniPassos!</h2>
      
      {isProfessional ? (
        <div className="space-y-8 w-full max-w-4xl">
          <p className="text-gray-500 text-center max-w-md mx-auto mb-8">
            {isVerified 
              ? "Compartilhe seu conhecimento e ajude famílias no desenvolvimento de seus bebês."
              : "Obrigado por se registrar como profissional. Sua conta está em processo de verificação."}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <FileText className="h-5 w-5 mr-2 text-minipassos-purple" />
                  Criar Conteúdo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  {isVerified 
                    ? "Compartilhe seu conhecimento criando artigos e atividades para os pais."
                    : "Você poderá criar conteúdo assim que sua conta for verificada."}
                </p>
                <Button 
                  variant={isVerified ? "default" : "outline"}
                  className={isVerified ? "w-full bg-minipassos-purple hover:bg-minipassos-purple-dark" : "w-full"}
                  onClick={() => navigate("/criar-conteudo")}
                  disabled={!isVerified}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Criar conteúdo
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <BookOpen className="h-5 w-5 mr-2 text-minipassos-purple" />
                  Explorar Biblioteca
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  Explore nossa biblioteca de artigos sobre desenvolvimento infantil.
                </p>
                <Button 
                  onClick={() => navigate("/biblioteca")}
                  className="w-full bg-minipassos-purple hover:bg-minipassos-purple-dark"
                >
                  Acessar biblioteca
                </Button>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <Baby className="h-5 w-5 mr-2 text-minipassos-purple" />
                  Registrar um Bebê
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  Você também pode registrar seu próprio bebê para testar as funcionalidades do app.
                </p>
                <RegisterBaby />
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="space-y-8 w-full max-w-md">
          <p className="text-gray-500 text-center max-w-md mb-8">
            Para começar a acompanhar o desenvolvimento do seu bebê, registre as informações dele primeiro.
          </p>
          
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
      )}
    </div>
  );
};

export default WelcomeScreen;
