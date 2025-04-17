
import { useState } from "react";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DiaryEntry } from "@/types";

interface DiaryEntryFormProps {
  newEntry: Partial<DiaryEntry>;
  setNewEntry: (entry: Partial<DiaryEntry>) => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  handleAddEntry: () => Promise<void>;
  submitting: boolean;
}

const DiaryEntryForm = ({
  newEntry,
  setNewEntry,
  selectedFile,
  setSelectedFile,
  handleAddEntry,
  submitting
}: DiaryEntryFormProps) => {
  return (
    <>
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
            value={newEntry.milestone || "none"} 
            onValueChange={(value) => setNewEntry({...newEntry, milestone: value === "none" ? "" : value})}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Selecione um marco (opcional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Nenhum marco</SelectItem>
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
    </>
  );
};

export default DiaryEntryForm;
