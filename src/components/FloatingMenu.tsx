
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Calendar, X, Menu as MenuIcon, Stethoscope, Baby, Library } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useBaby } from "@/context/BabyContext";
import { useAuth } from "@/context/AuthContext";

export default function FloatingMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { currentBaby } = useBaby();
  const { userRole } = useAuth();
  
  // Only show menu for parent accounts, not for professional accounts
  const isProfessional = userRole === 'professional' || userRole === 'admin';
  
  if (isProfessional || !isMobile) return null;

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuItems = [
    { icon: <Baby size={20} />, label: "Dashboard", path: "/dashboard", color: "bg-blue-500" },
    { icon: <Calendar size={20} />, label: "Diário", path: "/diario", color: "bg-green-500" },
    { icon: <BookOpen size={20} />, label: "Atividades", path: "/atividades", color: "bg-amber-500" },
    { icon: <Library size={20} />, label: "Biblioteca", path: "/biblioteca", color: "bg-indigo-500" },
    { icon: <Stethoscope size={20} />, label: "Histórico", path: "/historico-medico", color: "bg-purple-500" },
  ];

  const handleNavigation = (path: string) => {
    if (!currentBaby && path !== "/biblioteca" && path !== "/dashboard") {
      toast({
        title: "Nenhum bebê selecionado",
        description: "Cadastre um bebê primeiro para acessar esta função",
        variant: "destructive",
      });
      navigate("/dashboard");
    } else {
      navigate(path);
    }
    setIsOpen(false);
  };

  return (
    <div className="fixed right-4 bottom-4 z-50 safe-area-bottom">
      <AnimatePresence>
        {isOpen && (
          <div className="absolute bottom-16 right-0 flex flex-col-reverse gap-2">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className={`flex items-center gap-2 pr-3 shadow-md border-none ${item.color} text-white hover:opacity-90`}
                  onClick={() => handleNavigation(item.path)}
                >
                  {item.icon}
                  <span className="text-xs font-medium">{item.label}</span>
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      <Button
        size="icon"
        className="h-12 w-12 rounded-full shadow-lg bg-minipassos-purple hover:bg-minipassos-purple-dark"
        onClick={toggleMenu}
      >
        {isOpen ? <X size={24} /> : <MenuIcon size={24} />}
      </Button>
    </div>
  );
}
