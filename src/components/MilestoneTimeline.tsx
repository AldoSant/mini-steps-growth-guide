
import { useState } from "react";
import { Check, Clock, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Milestone } from "@/types";
import { formatDate } from "@/lib/date-utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import MilestoneQuiz from "./MilestoneQuiz";
import { useMilestone } from "@/context/MilestoneContext";

interface MilestoneTimelineProps {
  milestones: (Milestone & { completed?: boolean; completion_date?: string })[];
  currentMonth: number;
}

const MilestoneTimeline = ({ milestones, currentMonth }: MilestoneTimelineProps) => {
  const [quizOpen, setQuizOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<(Milestone & { completed?: boolean; completion_date?: string }) | null>(null);
  const { completeMilestone } = useMilestone();
  
  // Filter milestones for the current window (current month +/- 2 months)
  const relevantMilestones = milestones.filter(
    (milestone) => 
      milestone.age_months >= currentMonth - 2 && 
      milestone.age_months <= currentMonth + 2
  );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "motor": return "bg-minipassos-purple";
      case "cognitivo": return "bg-minipassos-blue";
      case "social": return "bg-minipassos-green";
      case "linguagem": return "bg-minipassos-purple-dark";
      default: return "bg-gray-400";
    }
  };

  const getCategoryTextColor = (category: string) => {
    switch (category) {
      case "motor": return "text-minipassos-purple";
      case "cognitivo": return "text-minipassos-blue";
      case "social": return "text-minipassos-green";
      case "linguagem": return "text-minipassos-purple-dark";
      default: return "text-gray-400";
    }
  };

  const getCategoryBgColor = (category: string) => {
    switch (category) {
      case "motor": return "bg-minipassos-purple/10";
      case "cognitivo": return "bg-minipassos-blue/10";
      case "social": return "bg-minipassos-green/10";
      case "linguagem": return "bg-minipassos-purple-dark/10";
      default: return "bg-gray-100";
    }
  };

  const handleOpenQuiz = (milestone: (Milestone & { completed?: boolean; completion_date?: string })) => {
    setSelectedMilestone(milestone);
    setQuizOpen(true);
  };

  const handleQuizComplete = () => {
    setQuizOpen(false);
    setSelectedMilestone(null);
  };

  const handleToggleMilestone = async (milestone: Milestone & { completed?: boolean }) => {
    if (!milestone.completed) {
      // Se não está completo, abrir o quiz
      handleOpenQuiz(milestone);
    } else {
      // Se já está completo, apenas desmarcar
      await completeMilestone(milestone.id, false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex overflow-x-auto pb-4 gap-3 scrollbar-none">
        {["motor", "cognitivo", "social", "linguagem"].map((category) => (
          <div 
            key={category} 
            className={cn(
              "flex items-center px-4 py-2 rounded-full text-sm whitespace-nowrap",
              getCategoryBgColor(category)
            )}
          >
            <span className={cn("w-2 h-2 rounded-full mr-2", getCategoryColor(category))}></span>
            <span className={getCategoryTextColor(category)}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          </div>
        ))}
      </div>

      {relevantMilestones.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Não há marcos de desenvolvimento para exibir neste período.
        </div>
      ) : (
        <div className="space-y-6">
          {relevantMilestones.map((milestone) => (
            <div key={milestone.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div 
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-colors",
                    milestone.completed 
                      ? "bg-green-100 text-green-600 hover:bg-green-200" 
                      : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                  )}
                  onClick={() => handleToggleMilestone(milestone)}
                >
                  {milestone.completed ? <Check size={20} /> : <Clock size={20} />}
                </div>
                <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
              </div>

              <div className="pb-8 w-full">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span 
                      className={cn(
                        "w-2 h-2 rounded-full",
                        getCategoryColor(milestone.category)
                      )}
                    ></span>
                    <span className="text-sm text-gray-500 font-medium">
                      {milestone.category.charAt(0).toUpperCase() + milestone.category.slice(1)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-400">
                    {milestone.age_months} {milestone.age_months === 1 ? "mês" : "meses"}
                  </span>
                </div>

                <div className={cn(
                  "p-4 rounded-xl",
                  milestone.completed 
                    ? "bg-green-50 border border-green-100"
                    : milestone.age_months < currentMonth
                      ? "bg-amber-50 border border-amber-100"
                      : "bg-white border border-gray-100"
                )}>
                  <h3 className="font-bold text-gray-800">{milestone.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{milestone.description}</p>
                  
                  <div className="mt-3 flex items-center justify-between">
                    {milestone.completed && milestone.completion_date ? (
                      <div className="text-xs text-green-600 font-medium">
                        Completo em {formatDate(milestone.completion_date)}
                      </div>
                    ) : (
                      <div></div>
                    )}
                    
                    {!milestone.completed && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs text-minipassos-purple border-minipassos-purple hover:bg-minipassos-purple/10"
                        onClick={() => handleOpenQuiz(milestone)}
                      >
                        <HelpCircle className="mr-1 h-3 w-3" />
                        Avaliar marco
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <Dialog open={quizOpen} onOpenChange={setQuizOpen}>
        <DialogContent className="sm:max-w-[550px]">
          {selectedMilestone && (
            <MilestoneQuiz
              milestoneId={selectedMilestone.id}
              milestoneTitle={selectedMilestone.title}
              category={selectedMilestone.category}
              ageMonths={selectedMilestone.age_months}
              onComplete={handleQuizComplete}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MilestoneTimeline;
