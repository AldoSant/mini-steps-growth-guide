
import { Lightbulb, ChevronRight, Dumbbell, Brain, MessagesSquare, Baby } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface SkillsPredictionProps {
  skillsDistribution: {
    motor: number;
    cognitivo: number;
    social: number;
    linguagem: number;
  };
  currentAge: number;
  babyName: string;
  strongestArea: string;
  weakestArea: string;
}

const SkillsPrediction = ({
  skillsDistribution,
  currentAge,
  babyName,
  strongestArea,
  weakestArea
}: SkillsPredictionProps) => {
  // Get icon based on area
  const getAreaIcon = (area: string) => {
    switch (area) {
      case 'motor': return <Dumbbell className="w-5 h-5 text-minipassos-purple" />;
      case 'cognitivo': return <Brain className="w-5 h-5 text-minipassos-blue" />;
      case 'social': return <Baby className="w-5 h-5 text-minipassos-green" />;
      case 'linguagem': return <MessagesSquare className="w-5 h-5 text-minipassos-purple-dark" />;
      default: return <Lightbulb className="w-5 h-5 text-amber-500" />;
    }
  };
  
  // Get area name in Portuguese
  const getAreaName = (area: string) => {
    switch (area) {
      case 'motor': return 'Motora';
      case 'cognitivo': return 'Cognitiva';
      case 'social': return 'Social';
      case 'linguagem': return 'Linguagem';
      default: return area;
    }
  };

  // Get career areas recommendations based on strongest skills
  const getCareerRecommendations = (area: string) => {
    switch (area) {
      case 'motor':
        return "Esportes, dança, artes manuais ou profissões que exigem coordenação motora fina.";
      case 'cognitivo':
        return "Ciências, matemática, engenharia ou áreas que exigem pensamento analítico.";
      case 'social':
        return "Liderança, comunicação, ensino ou áreas que envolvam trabalho em equipe.";
      case 'linguagem':
        return "Comunicação, escrita, idiomas ou profissões que envolvam expressão verbal.";
      default:
        return "Diversas áreas conforme os interesses se desenvolvam.";
    }
  };

  // Get suggested activities based on strongest area
  const getSuggestedActivities = (area: string) => {
    if (currentAge < 12) {
      switch (area) {
        case 'motor':
          return "Brincadeiras que envolvam movimento, agarrar objetos, e desafios físicos apropriados para a idade.";
        case 'cognitivo':
          return "Jogos de encaixe, quebra-cabeças simples e brincadeiras de causa e efeito.";
        case 'social':
          return "Interação com outras crianças, brincadeiras de imitação e jogos interativos.";
        case 'linguagem':
          return "Leitura diária, conversar bastante e nomear objetos do ambiente.";
        default:
          return "Uma variedade de atividades equilibradas em todas as áreas de desenvolvimento.";
      }
    } else {
      switch (area) {
        case 'motor':
          return "Atividades ao ar livre, dança, jogos com bola e atividades que estimulem a coordenação motora.";
        case 'cognitivo':
          return "Jogos de classificação, quebra-cabeças mais complexos e brincadeiras que envolvam números e formas.";
        case 'social':
          return "Brincadeiras em grupo, jogos de regras simples e atividades que estimulem o compartilhamento.";
        case 'linguagem':
          return "Leitura interativa, contar histórias e jogos de palavras adaptados à idade.";
        default:
          return "Uma variedade de atividades equilibradas em todas as áreas de desenvolvimento.";
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4 mb-4">
        <div className="bg-amber-50 p-2 rounded-full">
          <Lightbulb className="w-6 h-6 text-amber-500" />
        </div>
        <div>
          <h3 className="font-medium text-gray-800 mb-1">
            Tendências de Desenvolvimento
          </h3>
          <p className="text-sm text-gray-600">
            Com base nos marcos atingidos, {babyName} demonstra maior facilidade na área {getAreaName(strongestArea).toLowerCase()}.
          </p>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-minipassos-purple/10 to-minipassos-blue/10 p-4 rounded-lg">
        <div className="flex items-center mb-3">
          {getAreaIcon(strongestArea)}
          <h3 className="ml-2 font-medium">Destaque em {getAreaName(strongestArea)}</h3>
        </div>
        <p className="text-sm text-gray-700 mb-3">
          {babyName} mostra um desenvolvimento acima da média em habilidades {getAreaName(strongestArea).toLowerCase()}s, 
          o que pode indicar uma predisposição natural para esta área.
        </p>
        <div className="text-sm">
          <div className="flex items-center text-gray-500 mb-1">
            <span className="font-medium mr-2">Possíveis áreas de interesse futuro:</span> 
          </div>
          <p className="text-gray-700 ml-1">{getCareerRecommendations(strongestArea)}</p>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg border">
        <h3 className="font-medium mb-2">Atividades recomendadas</h3>
        <p className="text-sm text-gray-700 mb-4">
          {getSuggestedActivities(strongestArea)}
        </p>
        <Button 
          variant="outline" 
          size="sm"
          className="w-full border-minipassos-purple text-minipassos-purple hover:bg-minipassos-purple/10"
          asChild
        >
          <Link to="/atividades">
            Ver atividades personalizadas
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default SkillsPrediction;
