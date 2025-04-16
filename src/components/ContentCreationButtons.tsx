
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
  const { userRole, userProfile } = useAuth();
  const isProfessional = userRole === 'professional' || userRole === 'admin';
  const isVerified = userProfile?.is_verified;

  if (!isProfessional) {
    return null;
  }

  return (
    <div className={className}>
      <Button
        className="bg-minipassos-purple hover:bg-minipassos-purple-dark"
        onClick={() => navigate("/criar-conteudo", { state: { defaultTab: type === "articles" ? "article" : "activity" }})}
        disabled={!isVerified}
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        {type === "articles" ? "Criar Artigo" : "Criar Atividade"}
      </Button>
    </div>
  );
};

export default ContentCreationButtons;
