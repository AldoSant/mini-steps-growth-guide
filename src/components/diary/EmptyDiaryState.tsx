
import { Image } from "lucide-react";

interface EmptyDiaryStateProps {
  activeTab: string;
}

const EmptyDiaryState = ({ activeTab }: EmptyDiaryStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-gray-400 mb-4">
        <Image size={64} />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">Nenhum registro encontrado</h3>
      <p className="text-gray-500 text-center max-w-md">
        {activeTab === "todos" 
          ? "Comece a registrar os momentos especiais do seu bebê clicando no botão \"Novo Registro\""
          : `Nenhum registro do tipo "${activeTab === "photo" ? "foto" : "nota"}" encontrado. Adicione um novo registro deste tipo.`
        }
      </p>
    </div>
  );
};

export default EmptyDiaryState;
