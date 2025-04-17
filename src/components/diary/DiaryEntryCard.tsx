
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar, Check, Trash2 } from "lucide-react";
import { DiaryEntry } from "@/types";

interface DiaryEntryCardProps {
  entry: DiaryEntry;
  onDelete: (id: string) => Promise<void>;
}

const DiaryEntryCard = ({ entry, onDelete }: DiaryEntryCardProps) => {
  return (
    <div 
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
            onClick={() => onDelete(entry.id)}
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
  );
};

export default DiaryEntryCard;
