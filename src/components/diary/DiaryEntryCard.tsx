
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Check, 
  Trash2, 
  Image as ImageIcon, 
  File, 
  Download,
  ExternalLink
} from "lucide-react";
import { DiaryEntry } from "@/types";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DiaryEntryCardProps {
  entry: DiaryEntry;
  onDelete: (id: string) => Promise<void>;
}

const DiaryEntryCard = ({ entry, onDelete }: DiaryEntryCardProps) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setShowImagePreview(true);
  };

  const handleDelete = async () => {
    await onDelete(entry.id);
    setConfirmDelete(false);
  };

  const renderImages = () => {
    if (!entry.image_url || entry.image_url.length === 0) return null;
    
    // Se há apenas uma imagem, exiba-a como destaque
    if (entry.image_url.length === 1) {
      return (
        <div 
          className="h-48 bg-center bg-cover cursor-pointer"
          style={{ backgroundImage: `url(${entry.image_url[0]})` }}
          onClick={() => handleImageClick(entry.image_url![0])}
        />
      );
    }
    
    // Se houver múltiplas imagens, exiba a primeira como destaque e as outras como miniaturas
    return (
      <>
        <div 
          className="h-48 bg-center bg-cover cursor-pointer"
          style={{ backgroundImage: `url(${entry.image_url[0]})` }}
          onClick={() => handleImageClick(entry.image_url![0])}
        />
        <div className="flex overflow-x-auto p-1 gap-2">
          {entry.image_url.slice(1).map((img, index) => (
            <div 
              key={index}
              className="h-16 w-16 bg-center bg-cover flex-shrink-0 cursor-pointer rounded-md border border-gray-200"
              style={{ backgroundImage: `url(${img})` }}
              onClick={() => handleImageClick(img)}
            />
          ))}
        </div>
      </>
    );
  };

  const renderEntryTypeIcon = () => {
    if (entry.type === "photo") return <ImageIcon size={16} className="text-blue-500" />;
    return <File size={16} className="text-green-500" />;
  };

  return (
    <div 
      className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-all"
    >
      {entry.type === "photo" && renderImages()}
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            {renderEntryTypeIcon()}
            <h3 className="font-bold text-gray-800">{entry.title}</h3>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-400 hover:text-red-500"
            onClick={() => setConfirmDelete(true)}
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

      {/* Confirmação de exclusão */}
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Excluir
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Visualização da imagem */}
      <Dialog open={showImagePreview} onOpenChange={setShowImagePreview}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{entry.title}</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            {selectedImage && (
              <img 
                src={selectedImage} 
                alt={entry.title} 
                className="max-h-[70vh] object-contain"
              />
            )}
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button 
              variant="outline" 
              onClick={() => window.open(selectedImage!, '_blank')}
              className="flex items-center gap-2"
            >
              <ExternalLink size={16} />
              Abrir em nova aba
            </Button>
            <Button 
              onClick={() => {
                if (selectedImage) {
                  const link = document.createElement('a');
                  link.href = selectedImage;
                  link.download = `${entry.title.replace(/\s+/g, '_')}.jpg`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }
              }}
              className="flex items-center gap-2"
            >
              <Download size={16} />
              Download
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DiaryEntryCard;
