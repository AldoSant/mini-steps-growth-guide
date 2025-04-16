
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface ContentCreationButtonsProps {
  type: "activities" | "articles";
  className?: string;
}

const ContentCreationButtons = ({ type, className = "" }: ContentCreationButtonsProps) => {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const isProfessional = userRole === 'professional' || userRole === 'admin';

  if (!isProfessional) {
    return null;
  }

  return (
    <div className={className}>
      <Button
        className="bg-marcos-purple hover:bg-marcos-purple-dark"
        onClick={() => navigate("/criar-conteudo", { state: { defaultTab: type === "articles" ? "article" : "activity" }})}
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        {type === "articles" ? "Criar Artigo" : "Criar Atividade"}
      </Button>
    </div>
  );
};

export default ContentCreationButtons;
