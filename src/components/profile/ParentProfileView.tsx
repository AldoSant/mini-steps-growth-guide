
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Baby, Activity, Book, Heart } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { pt } from "date-fns/locale";
import { Baby as BabyType } from "@/types";

interface ParentProfileViewProps {
  profile: any;
  babies: BabyType[];
}

const ParentProfileView = ({ profile, babies }: ParentProfileViewProps) => {
  const navigate = useNavigate();
  
  const joinDate = profile?.created_at 
    ? formatDistanceToNow(new Date(profile.created_at), { addSuffix: true, locale: pt })
    : "";
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Visão Geral</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Membro desde</h3>
              <p className="flex items-center mt-1">
                <CalendarDays className="h-4 w-4 mr-2 text-minipassos-purple" />
                {joinDate}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Bebês cadastrados</h3>
              <p className="flex items-center mt-1">
                <Baby className="h-4 w-4 mr-2 text-minipassos-purple" />
                {babies.length}
              </p>
            </div>
            
            <div className="pt-2">
              <Button 
                className="w-full bg-minipassos-purple hover:bg-minipassos-purple-dark"
                onClick={() => navigate("/dashboard")}
              >
                Ir para o Dashboard
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                <Baby className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium">Diário do Bebê</h3>
              <p className="text-sm text-gray-500 mt-1">Registre momentos especiais</p>
              <Button 
                variant="link" 
                className="mt-2 text-minipassos-purple" 
                onClick={() => navigate("/diario")}
              >
                Acessar
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-3">
                <Activity className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="font-medium">Atividades</h3>
              <p className="text-sm text-gray-500 mt-1">Explore atividades para o bebê</p>
              <Button 
                variant="link" 
                className="mt-2 text-minipassos-purple" 
                onClick={() => navigate("/atividades")}
              >
                Explorar
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                <Book className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-medium">Biblioteca</h3>
              <p className="text-sm text-gray-500 mt-1">Artigos e conteúdo educativo</p>
              <Button 
                variant="link" 
                className="mt-2 text-minipassos-purple" 
                onClick={() => navigate("/biblioteca")}
              >
                Acessar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Desenvolvimento do bebê</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Acompanhe o desenvolvimento dos seus filhos, complete marcos importantes e explore conteúdo e atividades personalizadas para a idade deles.
            </p>
            <Button 
              variant="outline" 
              className="w-full border-minipassos-purple text-minipassos-purple hover:bg-minipassos-purple hover:text-white"
              onClick={() => navigate("/dashboard")}
            >
              <Heart className="mr-2 h-4 w-4" />
              Ver progresso dos bebês
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ParentProfileView;
