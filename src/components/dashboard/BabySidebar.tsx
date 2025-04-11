
import { Baby, Calendar, Clock, FileText, Plus, User } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import RegisterBaby from "@/components/RegisterBaby";
import { useBaby } from "@/context/BabyContext";
import { Baby as BabyType } from "@/types";
import { getBabyAge } from "@/lib/date-utils";

export const BabySidebar = () => {
  const { babies, currentBaby, setCurrentBaby } = useBaby();
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  
  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };
  
  return (
    <div className="lg:col-span-1 space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex justify-between items-center">
            <span>Bebês</span>
            <Dialog open={registerDialogOpen} onOpenChange={setRegisterDialogOpen}>
              <DialogTrigger asChild>
                <Button size="icon" variant="ghost">
                  <Plus size={16} />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Registrar novo bebê</DialogTitle>
                </DialogHeader>
                <RegisterBaby />
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {babies.map((baby) => (
              <div 
                key={baby.id}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                  currentBaby && currentBaby.id === baby.id
                    ? "bg-minipassos-purple text-white"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setCurrentBaby(baby)}
              >
                <div className="mr-3 bg-white rounded-full p-1">
                  <Baby size={20} className="text-minipassos-purple" />
                </div>
                <div>
                  <h3 className={`font-medium ${
                    currentBaby && currentBaby.id === baby.id
                      ? "text-white"
                      : "text-gray-800"
                  }`}>
                    {baby.name}
                  </h3>
                  <p className={`text-xs ${
                    currentBaby && currentBaby.id === baby.id
                      ? "text-white/80"
                      : "text-gray-500"
                  }`}>
                    {formatDate(baby.birth_date)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {currentBaby && <BabyInfoCard baby={currentBaby} formatDate={formatDate} />}
    </div>
  );
};

interface BabyInfoCardProps {
  baby: BabyType;
  formatDate: (date: string) => string;
}

const BabyInfoCard = ({ baby, formatDate }: BabyInfoCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Informações</CardTitle>
        <CardDescription>
          Detalhes de {baby.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <Clock size={16} className="mr-2" />
              <span>Idade</span>
            </div>
            <span className="text-sm font-medium">{getBabyAge(baby)}</span>
          </div>
          
          <div className="flex justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <Calendar size={16} className="mr-2" />
              <span>Nascimento</span>
            </div>
            <span className="text-sm font-medium">
              {formatDate(baby.birth_date)}
            </span>
          </div>
          
          <div className="flex justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <User size={16} className="mr-2" />
              <span>Sexo</span>
            </div>
            <span className="text-sm font-medium capitalize">
              {baby.gender}
            </span>
          </div>
          
          <div className="flex justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <FileText size={16} className="mr-2" />
              <span>Peso ao nascer</span>
            </div>
            <span className="text-sm font-medium">
              {Number(baby.weight).toLocaleString()} kg
            </span>
          </div>
          
          <div className="flex justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <FileText size={16} className="mr-2" />
              <span>Altura ao nascer</span>
            </div>
            <span className="text-sm font-medium">
              {Number(baby.height).toLocaleString()} cm
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BabySidebar;
