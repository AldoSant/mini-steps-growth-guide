
import { supabase } from "../integrations/supabase/client";
import { populateInitialMilestones } from "./populateMilestones";

export const populateInitialActivities = async () => {
  try {
    console.log("Iniciando população de atividades...");
    
    const activities = [
      {
        title: "Hora do espelho",
        description: "Mostre ao bebê sua imagem no espelho",
        instructions: "Segure o bebê em frente a um espelho seguro. Aponte para partes do rosto dele e diga os nomes. Faça expressões faciais para ele observar.",
        category: "Cognitivo",
        min_age_months: 1,
        max_age_months: 6,
        materials: ["Espelho seguro para bebês"]
      },
      {
        title: "Ginástica do bebê",
        description: "Movimentos suaves para fortalecer os músculos",
        instructions: "Com o bebê deitado de barriga para cima, mova suavemente suas pernas em movimentos circulares, como se estivesse pedalando. Depois, estique e dobre seus braços gentilmente.",
        category: "Motor",
        min_age_months: 1,
        max_age_months: 4,
        materials: ["Superfície macia"]
      },
      {
        title: "Tempo de barriga para baixo",
        description: "Fortalecer o pescoço e os ombros",
        instructions: "Coloque o bebê de barriga para baixo em uma superfície firme e macia por 3-5 minutos, várias vezes ao dia. Fique sempre ao lado dele. Use brinquedos coloridos para chamar sua atenção e incentivá-lo a levantar a cabeça.",
        category: "Motor",
        min_age_months: 0,
        max_age_months: 6,
        materials: ["Superfície firme e macia", "Brinquedos coloridos"]
      }
    ];
    
    // Verificar se já existem atividades no banco
    const { count } = await supabase
      .from('activities')
      .select('*', { count: 'exact', head: true });
      
    if (count && count > 0) {
      console.log(`Já existem ${count} atividades no banco de dados. Pulando inserção.`);
      return false;
    }
    
    // Inserir atividades
    const { data, error } = await supabase
      .from('activities')
      .insert(activities);
      
    if (error) {
      console.error("Erro ao inserir atividades:", error);
      return false;
    }
    
    console.log("Atividades inseridas com sucesso!");
    return true;
  } catch (error) {
    console.error("Erro ao popular atividades:", error);
    return false;
  }
};

// Função para executar no console do navegador - executa ambos os scripts
export const setupAllInitialData = async () => {
  const milestonesResult = await populateInitialMilestones();
  const activitiesResult = await populateInitialActivities();
  
  if (milestonesResult && activitiesResult) {
    console.log("Todos os dados iniciais foram configurados com sucesso!");
  } else {
    console.log("Alguns dados não puderam ser configurados. Verifique os erros acima.");
  }
  
  return milestonesResult && activitiesResult;
};

