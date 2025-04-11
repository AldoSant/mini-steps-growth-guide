
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

const BabyForm = () => {
  const [name, setName] = useState("");
  const [gender, setGender] = useState<string | undefined>(undefined);
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, gender, birthDate, weight, height });
    // Todo: Save baby info
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Bebê</Label>
        <Input 
          id="name" 
          placeholder="Como seu bebê se chama?" 
          value={name} 
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Gênero</Label>
        <RadioGroup value={gender} onValueChange={setGender} className="flex gap-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="menino" id="menino" />
            <Label htmlFor="menino" className="cursor-pointer">Menino</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="menina" id="menina" />
            <Label htmlFor="menina" className="cursor-pointer">Menina</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label>Data de Nascimento</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !birthDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {birthDate ? format(birthDate, "dd/MM/yyyy") : "Selecione uma data"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={birthDate}
              onSelect={setBirthDate}
              initialFocus
              disabled={(date) => date > new Date()}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="weight">Peso (kg)</Label>
          <Input 
            id="weight" 
            type="number" 
            step="0.01"
            placeholder="3.5"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="height">Altura (cm)</Label>
          <Input 
            id="height" 
            type="number" 
            step="0.1"
            placeholder="50"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            required
          />
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-minipassos-purple hover:bg-minipassos-purple-dark"
      >
        Cadastrar Bebê
      </Button>
    </form>
  );
};

export default BabyForm;
