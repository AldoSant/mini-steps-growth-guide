
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";
import { useBaby } from "@/context/BabyContext";
import { DiaryEntry } from "@/types";
import { toast } from "@/components/ui/use-toast";

// Componentes refatorados
import DiaryEntryForm from "@/components/diary/DiaryEntryForm";
import DiaryEntryCard from "@/components/diary/DiaryEntryCard";
import EmptyDiaryState from "@/components/diary/EmptyDiaryState";

// API para o diário
import { fetchDiaryEntries, addDiaryEntry, deleteDiaryEntry } from "@/lib/api/diary";

const BabyDiary = () => {
  const [activeTab, setActiveTab] = useState("todos");
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newEntry, setNewEntry] = useState<Partial<DiaryEntry>>({
    title: "",
    content: "",
    type: "note",
    entry_date: format(new Date(), "yyyy-MM-dd"),
    milestone: ""
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const { currentBaby } = useBaby();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!currentBaby) {
      navigate('/dashboard');
      return;
    }
    
    loadDiaryEntries();
  }, [currentBaby]);
  
  const loadDiaryEntries = async () => {
    if (!currentBaby) return;
    
    try {
      setLoading(true);
      const diaryEntries = await fetchDiaryEntries(currentBaby.id);
      setEntries(diaryEntries);
    } catch (error) {
      console.error('Erro ao buscar entradas do diário:', error);
      toast({
        title: "Erro ao carregar o diário",
        description: "Não foi possível carregar as entradas do diário",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddEntry = async () => {
    if (!currentBaby) return;
    
    try {
      setSubmitting(true);
      
      const entry = {
        ...newEntry,
        baby_id: currentBaby.id
      };
      
      const newDiaryEntry = await addDiaryEntry(entry, 
        newEntry.type === "photo" ? selectedFile || undefined : undefined);
      
      setEntries([newDiaryEntry, ...entries]);
      
      // Reset form
      setNewEntry({
        title: "",
        content: "",
        type: "note",
        entry_date: format(new Date(), "yyyy-MM-dd"),
        milestone: ""
      });
      
      setSelectedFile(null);
      setDialogOpen(false);
      
      toast({
        title: "Entrada adicionada",
        description: "Nova entrada adicionada ao diário com sucesso!",
      });
      
    } catch (error) {
      console.error('Erro ao adicionar entrada:', error);
      toast({
        title: "Erro ao adicionar entrada",
        description: "Não foi possível adicionar a entrada ao diário",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleDeleteEntry = async (id: string) => {
    try {
      await deleteDiaryEntry(id);
      setEntries(entries.filter(entry => entry.id !== id));
      
      toast({
        title: "Entrada removida",
        description: "A entrada foi removida do diário com sucesso",
      });
      
    } catch (error) {
      console.error('Erro ao excluir entrada:', error);
      toast({
        title: "Erro ao remover entrada",
        description: "Não foi possível remover a entrada do diário",
        variant: "destructive",
      });
    }
  };
  
  const filteredEntries = activeTab === "todos" 
    ? entries 
    : entries.filter(entry => entry.type === activeTab);
  
  if (!currentBaby) {
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8 bg-gray-50">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Diário do Bebê</h1>
              <p className="text-gray-600">
                Registre os momentos especiais e acompanhe o crescimento de {currentBaby.name}
              </p>
            </div>
            
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="mt-4 md:mt-0 bg-minipassos-purple hover:bg-minipassos-purple-dark">
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Registro
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DiaryEntryForm
                  newEntry={newEntry}
                  setNewEntry={setNewEntry}
                  selectedFile={selectedFile}
                  setSelectedFile={setSelectedFile}
                  handleAddEntry={handleAddEntry}
                  submitting={submitting}
                />
              </DialogContent>
            </Dialog>
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <CardTitle>Registros de {currentBaby.name}</CardTitle>
                <Tabs defaultValue="todos" onValueChange={setActiveTab} className="w-full sm:w-auto">
                  <TabsList className="grid grid-cols-3 w-full sm:w-[300px]">
                    <TabsTrigger value="todos">Todos</TabsTrigger>
                    <TabsTrigger value="photo">Fotos</TabsTrigger>
                    <TabsTrigger value="note">Notas</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-minipassos-purple" />
                </div>
              ) : filteredEntries.length === 0 ? (
                <EmptyDiaryState activeTab={activeTab} />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredEntries.map((entry) => (
                    <DiaryEntryCard 
                      key={entry.id} 
                      entry={entry} 
                      onDelete={handleDeleteEntry} 
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BabyDiary;
