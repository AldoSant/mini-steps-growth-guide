
import { supabase } from "../integrations/supabase/client";
import { populateInitialMilestones } from "./populateMilestones";

export const populateInitialActivities = async () => {
  try {
    console.log("Iniciando população de atividades...");
    
    const activities = [
      // 0-3 meses
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
      },
      // 4-6 meses
      {
        title: "Brincadeira de esconder",
        description: "Estimule a permanência do objeto",
        instructions: "Mostre ao bebê um brinquedo que ele goste e, enquanto ele estiver olhando, esconda-o parcialmente embaixo de uma fralda ou pano. Veja se ele tenta encontrá-lo. Gradualmente, esconda o brinquedo completamente.",
        category: "Cognitivo",
        min_age_months: 4,
        max_age_months: 8,
        materials: ["Brinquedo pequeno", "Fralda ou pano"]
      },
      {
        title: "Exploração sensorial",
        description: "Estimule diferentes texturas",
        instructions: "Reúna tecidos com texturas diferentes (veludo, cetim, algodão). Passe suavemente pelo rosto, braços e pernas do bebê, nomeando as sensações.",
        category: "Sensorial",
        min_age_months: 3,
        max_age_months: 9,
        materials: ["Tecidos de diferentes texturas"]
      },
      {
        title: "Descobrindo sons",
        description: "Desenvolver a audição e atenção",
        instructions: "Reúna objetos que produzam sons diferentes, como chocalhos, sinetas ou mesmo potes com grãos. Produza os sons fora do campo de visão do bebê e veja se ele vira a cabeça para localizar a fonte sonora.",
        category: "Sensorial",
        min_age_months: 4,
        max_age_months: 10,
        materials: ["Objetos sonoros variados"]
      },
      // 7-12 meses
      {
        title: "Torre de blocos",
        description: "Desenvolver coordenação motora fina",
        instructions: "Demonstre como empilhar 2-3 blocos. Incentive o bebê a copiar. Celebre quando ele conseguir empilhar, mesmo se for apenas um bloco sobre o outro.",
        category: "Motor",
        min_age_months: 8,
        max_age_months: 12,
        materials: ["Blocos macios ou de espuma"]
      },
      {
        title: "Caixa surpresa",
        description: "Exploração e descoberta",
        instructions: "Coloque brinquedos pequenos e seguros dentro de uma caixa com uma abertura. Mostre ao bebê como tirar os objetos. Conforme ele avança, você pode colocar objetos em recipientes menores ou com tampas fáceis.",
        category: "Cognitivo",
        min_age_months: 9,
        max_age_months: 15,
        materials: ["Caixa", "Brinquedos pequenos e seguros"]
      },
      {
        title: "Canções com gestos",
        description: "Linguagem e coordenação",
        instructions: "Cante músicas infantis que incluam gestos simples, como 'Se você está feliz, bata palmas'. Faça os gestos e incentive o bebê a imitar.",
        category: "Linguagem",
        min_age_months: 7,
        max_age_months: 18,
        materials: []
      },
      // 12-24 meses
      {
        title: "Percurso de obstáculos",
        description: "Desenvolver habilidades motoras grossas",
        instructions: "Crie um percurso simples com almofadas para o bebê subir, travesseiros para passar por cima, mesas baixas para passar por baixo. Supervisione e encoraje-o a completar o percurso.",
        category: "Motor",
        min_age_months: 13,
        max_age_months: 24,
        materials: ["Almofadas", "Travesseiros", "Mesa baixa"]
      },
      {
        title: "Classificação de objetos",
        description: "Desenvolver raciocínio lógico",
        instructions: "Dê à criança objetos de diferentes cores (blocos, bolas) e recipientes correspondentes. Mostre como classificar os objetos por cor, colocando-os no recipiente certo.",
        category: "Cognitivo",
        min_age_months: 16,
        max_age_months: 30,
        materials: ["Objetos coloridos", "Recipientes coloridos"]
      },
      {
        title: "Leitura interativa",
        description: "Desenvolver vocabulário e compreensão",
        instructions: "Escolha livros com imagens grandes e claras. Ao ler, faça perguntas simples como 'Onde está o cachorro?' ou 'O que é isso?'. Deixe a criança virar as páginas.",
        category: "Linguagem",
        min_age_months: 12,
        max_age_months: 36,
        materials: ["Livros infantis com imagens"]
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
