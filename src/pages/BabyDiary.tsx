
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Image, Video, Heart, Calendar, Check, Trash2, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useBaby } from "@/context/BabyContext";
import { DiaryEntry } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

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
      // Se não houver um bebê selecionado, redirecionar para o dashboard
      navigate('/dashboard');
      return;
    }
    
    fetchEntries();
  }, [currentBaby]);
  
  const fetchEntries = async () => {
    if (!currentBaby) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('diary_entries')
        .select('*')
        .eq('baby_id', currentBaby.id)
        .order('entry_date', { ascending: false });
        
      if (error) throw error;
      
      // Converter os dados do banco para o formato usado no componente
      const formattedEntries: DiaryEntry[] = data.map(entry => ({
        ...entry,
        type: entry.image_url && entry.image_url.length > 0 ? "photo" : 
              entry.video_url && entry.video_url.length > 0 ? "video" : "note"
      }));
      
      setEntries(formattedEntries);
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
      
      let imageUrl: string[] = [];
      
      // Se for uma entrada com foto, fazer upload da imagem
      if (newEntry.type === "photo" && selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${currentBaby.id}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('diary_images')
          .upload(filePath, selectedFile);
          
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('diary_images')
          .getPublicUrl(filePath);
          
        imageUrl = [publicUrl];
      }
      
      const entry = {
        baby_id: currentBaby.id,
        title: newEntry.title,
        content: newEntry.content,
        entry_date: newEntry.entry_date,
        image_url: newEntry.type === "photo" ? imageUrl : [],
        video_url: [] // Implementação futura para vídeos
      };
      
      const { data, error } = await supabase
        .from('diary_entries')
        .insert(entry)
        .select()
        .single();
        
      if (error) throw error;
      
      // Adicionar a nova entrada à lista
      const newEntryWithType: DiaryEntry = {
        ...data,
        type: imageUrl.length > 0 ? "photo" : "note",
        milestone: newEntry.milestone || undefined
      };
      
      setEntries([newEntryWithType, ...entries]);
      
      // Limpar o formulário
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
      const { error } = await supabase
        .from('diary_entries')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
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
    return null; // O useEffect irá redirecionar para o dashboard
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
                <DialogHeader>
                  <DialogTitle>Adicionar novo registro</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 gap-4 items-center">
                    <label htmlFor="entry-type" className="text-right text-sm font-medium">Tipo</label>
                    <Select 
                      value={newEntry.type} 
                      onValueChange={(value) => setNewEntry({...newEntry, type: value as "note" | "photo" | "video"})}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Tipo de registro" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="note">Anotação</SelectItem>
                        <SelectItem value="photo">Foto</SelectItem>
                        <SelectItem value="video">Vídeo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 gap-4 items-center">
                    <label htmlFor="title" className="text-right text-sm font-medium">Título</label>
                    <Input 
                      id="title" 
                      placeholder="Título do registro" 
                      className="col-span-3" 
                      value={newEntry.title}
                      onChange={(e) => setNewEntry({...newEntry, title: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-4 items-center">
                    <label htmlFor="date" className="text-right text-sm font-medium">Data</label>
                    <Input 
                      id="date" 
                      type="date" 
                      className="col-span-3" 
                      value={newEntry.entry_date}
                      onChange={(e) => setNewEntry({...newEntry, entry_date: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-4 items-center">
                    <label htmlFor="milestone" className="text-right text-sm font-medium">Marco</label>
                    <Select 
                      value={newEntry.milestone} 
                      onValueChange={(value) => setNewEntry({...newEntry, milestone: value})}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Selecione um marco (opcional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Motor">Motor</SelectItem>
                        <SelectItem value="Cognitivo">Cognitivo</SelectItem>
                        <SelectItem value="Social">Social</SelectItem>
                        <SelectItem value="Linguagem">Linguagem</SelectItem>
                        <SelectItem value="Alimentação">Alimentação</SelectItem>
                        <SelectItem value="Sono">Sono</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {newEntry.type === "photo" && (
                    <div className="grid grid-cols-4 gap-4 items-center">
                      <label htmlFor="photo" className="text-right text-sm font-medium">Foto</label>
                      <Input 
                        id="photo" 
                        type="file" 
                        accept="image/*" 
                        className="col-span-3" 
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            setSelectedFile(e.target.files[0]);
                          }
                        }}
                      />
                    </div>
                  )}
                  {newEntry.type === "video" && (
                    <div className="grid grid-cols-4 gap-4 items-center">
                      <label htmlFor="video" className="text-right text-sm font-medium">Vídeo</label>
                      <Input id="video" type="file" accept="video/*" className="col-span-3" />
                    </div>
                  )}
                  <div className="grid grid-cols-4 gap-4 items-start">
                    <label htmlFor="description" className="text-right text-sm font-medium">Descrição</label>
                    <Textarea 
                      id="description" 
                      placeholder="Detalhes do momento..." 
                      className="col-span-3" 
                      value={newEntry.content || ''}
                      onChange={(e) => setNewEntry({...newEntry, content: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button 
                    onClick={handleAddEntry}
                    className="bg-minipassos-purple hover:bg-minipassos-purple-dark"
                    disabled={submitting || !newEntry.title || !newEntry.entry_date}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      'Salvar registro'
                    )}
                  </Button>
                </div>
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
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Image size={64} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Nenhum registro encontrado</h3>
                  <p className="text-gray-500 text-center max-w-md">
                    Comece a registrar os momentos especiais do seu bebê clicando no botão "Novo Registro"
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredEntries.map((entry) => (
                    <div 
                      key={entry.id} 
                      className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-all"
                    >
                      {entry.type === "photo" && entry.image_url && entry.image_url.length > 0 && (
                        <div 
                          className="h-48 bg-center bg-cover" 
                          style={{ backgroundImage: `url(${entry.image_url[0]})` }}
                        />
                      )}
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-gray-800">{entry.title}</h3>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-gray-400 hover:text-red-500"
                            onClick={() => handleDeleteEntry(entry.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-4">{entry.content}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-gray-500 text-xs">
                            <Calendar size={14} />
                            <span>
                              {format(new Date(entry.entry_date), "dd/MM/yyyy")}
                            </span>
                          </div>
                          
                          {entry.milestone && (
                            <div className="flex items-center gap-1.5 bg-minipassos-purple/10 text-minipassos-purple px-2 py-1 rounded-full text-xs">
                              <Check size={12} />
                              {entry.milestone}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
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
