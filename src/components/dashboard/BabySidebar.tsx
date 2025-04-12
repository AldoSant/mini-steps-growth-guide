
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Baby, Edit2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import RegisterBaby from "@/components/RegisterBaby";
import BabyForm from "@/components/BabyForm";
import { useBaby } from "@/context/BabyContext";
import { formatDate, getBabyAge } from "@/lib/date-utils";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";

const BabySidebar = () => {
  const { babies, currentBaby, setCurrentBaby, deleteBaby } = useBaby();
  const navigate = useNavigate();
  const [editBabyId, setEditBabyId] = useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  
  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este registro?")) {
      const success = await deleteBaby(id);
      if (success) {
        toast({
          title: "Bebê removido",
          description: "O registro foi excluído com sucesso.",
        });
      }
    }
  };

  return (
    <div className="lg:col-span-1">
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium">Meus bebês</h2>
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar bebê</DialogTitle>
                </DialogHeader>
                <RegisterBaby onComplete={() => setAddDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-3">
            {babies.map((baby) => (
              <div
                key={baby.id}
                className={`p-3 rounded-md cursor-pointer transition-colors ${
                  currentBaby?.id === baby.id
                    ? "bg-primary/10 border border-primary/20"
                    : "hover:bg-accent"
                }`}
                onClick={() => setCurrentBaby(baby)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className={`w-2 h-2 rounded-full mr-2 ${
                        baby.gender === "M"
                          ? "bg-blue-500"
                          : baby.gender === "F"
                          ? "bg-pink-500"
                          : "bg-purple-500"
                      }`}
                    ></div>
                    <span className="font-medium">{baby.name}</span>
                  </div>

                  <Dialog open={editDialogOpen && editBabyId === baby.id} onOpenChange={(open) => {
                    setEditDialogOpen(open);
                    if (!open) setEditBabyId(null);
                  }}>
                    <DialogTrigger asChild onClick={(e) => {
                      e.stopPropagation();
                      setEditBabyId(baby.id);
                    }}>
                      <Button variant="ghost" size="icon" className="h-6 w-6 opacity-70 hover:opacity-100">
                        <Edit2 className="h-3 w-3" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar bebê</DialogTitle>
                      </DialogHeader>
                      <BabyForm
                        baby={baby}
                        onComplete={() => {
                          setEditDialogOpen(false);
                          setEditBabyId(null);
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="mt-1 text-xs text-muted-foreground">
                  {getBabyAge(baby)}
                </div>

                <div className="mt-2 text-xs text-muted-foreground">
                  Nascido em {formatDate(baby.birth_date).split(" de ").slice(0, -1).join(" de ")}
                </div>
              </div>
            ))}

            {babies.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                <p className="text-sm">Nenhum bebê cadastrado</p>
                <p className="text-xs mt-1">
                  Adicione um bebê para começar a acompanhar o desenvolvimento
                </p>
              </div>
            )}
          </div>
        </CardContent>

        {currentBaby && (
          <CardFooter className="flex justify-between p-4 pt-0">
            <Button
              variant="outline"
              size="sm"
              className="w-full border-minipassos-purple text-minipassos-purple hover:bg-minipassos-purple/10"
              onClick={() => navigate("/perfil")}
            >
              <Baby className="mr-2 h-4 w-4" />
              Ver perfil completo
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default BabySidebar;
