
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, HelpCircle } from "lucide-react";
import { useMilestone } from "@/context/MilestoneContext";
import { toast } from "@/components/ui/use-toast";

interface QuizQuestion {
  id: string;
  question: string;
  options: { value: string; text: string }[];
  correctOption: string;
  explanation: string;
}

interface MilestoneQuizProps {
  milestoneId: string;
  milestoneTitle: string;
  category: string;
  ageMonths: number;
  onComplete: () => void;
}

export const getMilestoneQuestions = (category: string, ageMonths: number): QuizQuestion[] => {
  // Generate questions based on milestone category and age
  const questions: QuizQuestion[] = [];
  
  if (category === "motor") {
    if (ageMonths <= 3) {
      questions.push({
        id: "motor-1",
        question: "Seu bebê consegue levantar a cabeça quando está de barriga para baixo?",
        options: [
          { value: "yes", text: "Sim" },
          { value: "partially", text: "Parcialmente" },
          { value: "no", text: "Não" }
        ],
        correctOption: "yes",
        explanation: "Por volta dos 3 meses, a maioria dos bebês consegue levantar a cabeça quando está de barriga para baixo."
      });
    } else if (ageMonths <= 6) {
      questions.push({
        id: "motor-2",
        question: "Seu bebê consegue rolar de barriga para baixo para barriga para cima?",
        options: [
          { value: "yes", text: "Sim" },
          { value: "partially", text: "Parcialmente" },
          { value: "no", text: "Não" }
        ],
        correctOption: "yes",
        explanation: "Por volta dos 6 meses, a maioria dos bebês já consegue rolar em ambas as direções."
      });
    } else if (ageMonths <= 9) {
      questions.push({
        id: "motor-3",
        question: "Seu bebê consegue sentar sem apoio?",
        options: [
          { value: "yes", text: "Sim" },
          { value: "partially", text: "Com algum apoio" },
          { value: "no", text: "Não" }
        ],
        correctOption: "yes",
        explanation: "Por volta dos 7-9 meses, a maioria dos bebês já consegue sentar sem apoio."
      });
    } else if (ageMonths <= 12) {
      questions.push({
        id: "motor-4",
        question: "Seu bebê consegue engatinhar ou se arrastar para frente?",
        options: [
          { value: "yes", text: "Sim" },
          { value: "partially", text: "Faz movimentos de engatinhar" },
          { value: "no", text: "Não" }
        ],
        correctOption: "yes",
        explanation: "Por volta dos 9-12 meses, a maioria dos bebês já consegue engatinhar."
      });
    }
  } else if (category === "cognitivo") {
    if (ageMonths <= 3) {
      questions.push({
        id: "cog-1",
        question: "Seu bebê segue objetos em movimento com os olhos?",
        options: [
          { value: "yes", text: "Sim" },
          { value: "partially", text: "Às vezes" },
          { value: "no", text: "Não" }
        ],
        correctOption: "yes",
        explanation: "Até os 3 meses, bebês geralmente desenvolvem a capacidade de seguir objetos com os olhos."
      });
    } else if (ageMonths <= 6) {
      questions.push({
        id: "cog-2",
        question: "Seu bebê busca objetos que estão parcialmente escondidos?",
        options: [
          { value: "yes", text: "Sim" },
          { value: "partially", text: "Às vezes" },
          { value: "no", text: "Não" }
        ],
        correctOption: "yes",
        explanation: "Entre 4-6 meses, bebês começam a compreender que objetos existem mesmo quando parcialmente escondidos."
      });
    }
  } else if (category === "social") {
    if (ageMonths <= 3) {
      questions.push({
        id: "soc-1",
        question: "Seu bebê sorri em resposta à sua voz ou rosto?",
        options: [
          { value: "yes", text: "Sim" },
          { value: "partially", text: "Às vezes" },
          { value: "no", text: "Não" }
        ],
        correctOption: "yes",
        explanation: "Por volta dos 2-3 meses, bebês começam a sorrir socialmente em resposta a estímulos."
      });
    } else if (ageMonths <= 6) {
      questions.push({
        id: "soc-2",
        question: "Seu bebê demonstra interesse por outras crianças ou pessoas?",
        options: [
          { value: "yes", text: "Sim" },
          { value: "partially", text: "Às vezes" },
          { value: "no", text: "Não" }
        ],
        correctOption: "yes",
        explanation: "Entre 4-6 meses, bebês começam a demonstrar mais interesse social."
      });
    }
  } else if (category === "linguagem") {
    if (ageMonths <= 3) {
      questions.push({
        id: "lang-1",
        question: "Seu bebê reage a sons altos?",
        options: [
          { value: "yes", text: "Sim" },
          { value: "partially", text: "Às vezes" },
          { value: "no", text: "Não" }
        ],
        correctOption: "yes",
        explanation: "Nos primeiros 3 meses, bebês devem reagir a sons altos."
      });
    } else if (ageMonths <= 6) {
      questions.push({
        id: "lang-2",
        question: "Seu bebê faz sons de balbucio ('ba', 'ma', 'da')?",
        options: [
          { value: "yes", text: "Sim" },
          { value: "partially", text: "Alguns sons" },
          { value: "no", text: "Não" }
        ],
        correctOption: "yes",
        explanation: "Entre 4-6 meses, bebês geralmente começam a balbuciar combinações de vogais e consoantes."
      });
    }
  }
  
  // Adicionar uma questão genérica se não houver questões específicas
  if (questions.length === 0) {
    questions.push({
      id: "generic-1",
      question: `Seu bebê está atingindo os marcos de desenvolvimento ${category} esperados para ${ageMonths} meses?`,
      options: [
        { value: "yes", text: "Sim" },
        { value: "partially", text: "Parcialmente" },
        { value: "no", text: "Não" }
      ],
      correctOption: "yes",
      explanation: `A maioria dos bebês atinge os marcos de desenvolvimento ${category} por volta de ${ageMonths} meses.`
    });
  }
  
  return questions;
};

const MilestoneQuiz = ({ milestoneId, milestoneTitle, category, ageMonths, onComplete }: MilestoneQuizProps) => {
  const [questions] = useState(() => getMilestoneQuestions(category, ageMonths));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const { completeMilestone } = useMilestone();
  
  const currentQuestion = questions[currentQuestionIndex];
  
  const handleAnswer = (value: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };
  
  const handleComplete = async () => {
    // Check if majority of answers are correct or partially correct
    const totalQuestions = questions.length;
    const correctAnswers = questions.filter(q => 
      selectedAnswers[q.id] === q.correctOption || 
      selectedAnswers[q.id] === "partially"
    ).length;
    
    // If more than 50% of answers are correct or partially correct, mark milestone as completed
    const passThreshold = totalQuestions > 0 ? correctAnswers / totalQuestions >= 0.5 : true;
    
    // Compile notes from quiz answers
    const notes = questions.map(q => {
      const selected = selectedAnswers[q.id];
      return `${q.question}: ${selected === "yes" ? "Sim" : selected === "partially" ? "Parcialmente" : "Não"}`;
    }).join(" | ");
    
    await completeMilestone(milestoneId, passThreshold, notes);
    
    toast({
      title: passThreshold ? "Marco atingido!" : "Marco em progresso",
      description: passThreshold 
        ? "Parabéns! Seu bebê está se desenvolvendo bem nesta área." 
        : "Continue estimulando seu bebê nesta área de desenvolvimento.",
      variant: passThreshold ? "default" : "secondary",
    });
    
    onComplete();
  };
  
  // Calculate score
  const getCorrectAnswersCount = () => {
    return questions.filter(q => selectedAnswers[q.id] === q.correctOption).length;
  };
  
  const getPartialAnswersCount = () => {
    return questions.filter(q => selectedAnswers[q.id] === "partially").length;
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Avaliação: {milestoneTitle}</CardTitle>
        <CardDescription>
          Responda às perguntas sobre o desenvolvimento do seu bebê nesta área
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!showResults ? (
          <div className="space-y-4">
            <p className="text-sm font-medium mb-2">
              Questão {currentQuestionIndex + 1} de {questions.length}
            </p>
            
            <h3 className="text-base font-semibold mb-4">
              {currentQuestion.question}
            </h3>
            
            <RadioGroup 
              value={selectedAnswers[currentQuestion.id] || ""}
              onValueChange={handleAnswer}
              className="space-y-3"
            >
              {currentQuestion.options.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value}>{option.text}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-xl font-medium">Resultado</h3>
            
            <div className="flex items-center justify-center space-x-4 py-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500">
                  {getCorrectAnswersCount()}
                </div>
                <div className="text-sm text-gray-500">Respostas Positivas</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-500">
                  {getPartialAnswersCount()}
                </div>
                <div className="text-sm text-gray-500">Parcialmente</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-red-500">
                  {questions.length - getCorrectAnswersCount() - getPartialAnswersCount()}
                </div>
                <div className="text-sm text-gray-500">Respostas Negativas</div>
              </div>
            </div>
            
            <div className="rounded-lg bg-gray-50 p-4">
              <h4 className="font-medium mb-2 flex items-center">
                <HelpCircle className="h-4 w-4 mr-2 text-blue-500" />
                Orientações
              </h4>
              <p className="text-sm text-gray-600">
                {getCorrectAnswersCount() + getPartialAnswersCount() > questions.length / 2 
                  ? "Seu bebê parece estar se desenvolvendo bem nesta área! Continue com as atividades recomendadas."
                  : "Seu bebê pode precisar de mais estímulos nesta área de desenvolvimento. Confira as atividades recomendadas."}
              </p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        {!showResults ? (
          <Button 
            onClick={handleNext} 
            disabled={!selectedAnswers[currentQuestion.id]}
            className="bg-minipassos-purple hover:bg-minipassos-purple-dark"
          >
            {currentQuestionIndex < questions.length - 1 ? "Próxima" : "Ver resultado"}
          </Button>
        ) : (
          <Button 
            onClick={handleComplete}
            className="bg-minipassos-purple hover:bg-minipassos-purple-dark"
          >
            Concluir avaliação
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default MilestoneQuiz;
