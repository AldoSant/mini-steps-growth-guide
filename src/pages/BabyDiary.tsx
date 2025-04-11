
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Image, Video, Heart, Calendar, Check, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock diary entries data
const mockEntries = [
  {
    id: 1,
    type: "photo",
    title: "Primeiro sorriso",
    description: "Hoje Maria deu seu primeiro sorriso real!",
    date: "2024-03-15",
    image: "https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    milestone: "Social"
  },
  {
    id: 2,
    type: "note",
    title: "Começou a sentar",
    description: "Hoje Maria conseguiu sentar por conta própria por alguns segundos sem apoio.",
    date: "2024-04-01",
    milestone: "Motor"
  },
  {
    id: 3,
    type: "photo",
    title: "Primeira papinha",
    description: "Primeiro contato com alimentos sólidos. Adorou a banana!",
    date: "2024-04-05",
    image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    milestone: "Alimentação"
  },
  {
    id: 4,
    type: "note",
    title: "Balbuciando",
    description: "Começou a fazer barulhinhos que parecem 'ma-ma-ma'.",
    date: "2024-04-10",
    milestone: "Linguagem"
  }
];

const BabyDiary = () => {
  const [activeTab, setActiveTab] = useState("todos");
  const [entries, setEntries] = useState(mockEntries);
  const [newEntry, setNewEntry] = useState({
    title: "",
    description: "",
    type: "note",
    date: format(new Date(), "yyyy-MM-dd"),
    milestone: ""
  });
  
  const handleAddEntry = () => {
    const entry = {
      id: entries.length + 1,
      ...newEntry,
      image: newEntry.type === "photo" ? "https://images.unsplash.com/photo-1533483595632-c5f0e57a1936?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" : undefined,
    };
    
    setEntries([entry, ...entries]);
    setNewEntry({
      title: "",
      description: "",
      type: "note",
      date: format(new Date(), "yyyy-MM-dd"),
      milestone: ""
    });
  };
  
  const filteredEntries = activeTab === "todos" 
    ? entries 
    : entries.filter(entry => entry.type === activeTab);
  
  const handleDeleteEntry = (id: number) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8 bg-gray-50">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Diário do Bebê</h1>
              <p className="text-gray-600">
                Registre os momentos especiais e acompanhe o crescimento
              </p>
            </div>
            
            <Dialog>
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
                      onValueChange={(value) => setNewEntry({...newEntry, type: value})}
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
                      value={newEntry.date}
                      onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
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
                      <Input id="photo" type="file" accept="image/*" className="col-span-3" />
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
                      value={newEntry.description}
                      onChange={(e) => setNewEntry({...newEntry, description: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button 
                    onClick={handleAddEntry}
                    className="bg-minipassos-purple hover:bg-minipassos-purple-dark"
                    disabled={!newEntry.title || !newEntry.date}
                  >
                    Salvar registro
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <CardTitle>Registros</CardTitle>
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
              {filteredEntries.length === 0 ? (
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
                      {entry.type === "photo" && entry.image && (
                        <div 
                          className="h-48 bg-center bg-cover" 
                          style={{ backgroundImage: `url(${entry.image})` }}
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
                        
                        <p className="text-gray-600 text-sm mb-4">{entry.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-gray-500 text-xs">
                            <Calendar size={14} />
                            <span>
                              {format(new Date(entry.date), "dd/MM/yyyy")}
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
