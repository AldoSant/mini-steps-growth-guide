
import { Image, BookOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyDiaryStateProps {
  activeTab: string;
  onNewEntry?: () => void;
}

const EmptyDiaryState = ({ activeTab, onNewEntry }: EmptyDiaryStateProps) => {
  const getIcon = () => {
    switch(activeTab) {
      case "photo":
        return <Image size={64} className="text-gray-300" />;
      case "note":
        return <BookOpen size={64} className="text-gray-300" />;
      default:
        return <BookOpen size={64} className="text-gray-300" />;
    }
  };

  const getMessage = () => {
    switch(activeTab) {
      case "todos":
        return "Comece a registrar os momentos especiais do seu bebê";
      case "photo":
        return "Adicione fotos dos momentos mais preciosos do seu bebê";
      case "note":
        return "Registre memórias e anotações importantes sobre seu bebê";
      default:
        return "Nenhum registro encontrado";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-gray-400 mb-4">
        {getIcon()}
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">Nenhum registro encontrado</h3>
      <p className="text-gray-500 text-center max-w-md mb-6">
        {getMessage()}
      </p>
      {onNewEntry && (
        <Button 
          onClick={onNewEntry}
          className="bg-minipassos-purple hover:bg-minipassos-purple-dark"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Registro
        </Button>
      )}
    </div>
  );
};

export default EmptyDiaryState;
