
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useBaby } from "@/context/BabyContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { getBabyAge } from "@/lib/date-utils";
import { Calendar, BookOpen, Layout, User, Stethoscope } from "lucide-react";

const BabySidebar = () => {
  const { currentBaby, babies, setCurrentBaby } = useBaby();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleBabySwitch = (babyId: string) => {
    const selectedBaby = babies.find(baby => baby.id === babyId);
    if (selectedBaby) {
      setCurrentBaby(selectedBaby);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 bg-white rounded-lg shadow mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">Bebê Selecionado</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 text-minipassos-purple hover:text-minipassos-purple-dark hover:bg-minipassos-purple-light/50" 
            onClick={() => navigate('/perfil')}
          >
            <Pencil size={16} />
            <span className="sr-only">Editar</span>
          </Button>
        </div>
        
        {currentBaby && (
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-minipassos-purple-light text-minipassos-purple-dark">
                {currentBaby.name[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-gray-700">{currentBaby.name}</p>
              <p className="text-sm text-muted-foreground">
                {getBabyAge(currentBaby)}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 space-y-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-medium mb-3">Navegação Rápida</h3>
          <nav className="space-y-1">
            {[
              { icon: Layout, label: 'Dashboard', path: '/dashboard' },
              { icon: Calendar, label: 'Diário', path: '/diario' },
              { icon: BookOpen, label: 'Atividades', path: '/atividades' },
              { icon: Stethoscope, label: 'Histórico Médico', path: '/historico-medico' },
              { icon: User, label: 'Perfil', path: '/perfil' },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                  location.pathname === item.path
                    ? 'bg-minipassos-purple text-white'
                    : 'text-gray-700 hover:bg-minipassos-purple-light hover:text-minipassos-purple-dark'
                }`}
              >
                <item.icon size={18} className="mr-2" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {babies && babies.length > 1 && (
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-medium mb-3">Outros Bebês</h3>
            <div className="space-y-2">
              {babies.map((baby) => (
                <Button
                  key={baby.id}
                  variant="outline"
                  className={`w-full justify-start text-sm ${
                    currentBaby?.id === baby.id
                      ? "bg-minipassos-purple-light text-minipassos-purple-dark hover:bg-minipassos-purple-light/80"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => handleBabySwitch(baby.id)}
                >
                  {baby.name}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BabySidebar;
