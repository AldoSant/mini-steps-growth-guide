
import { supabase } from "../integrations/supabase/client";

// Esta função pode ser executada uma vez através da console do navegador
// para popular o banco de dados com marcos iniciais
export const populateInitialMilestones = async () => {
  try {
    console.log("Iniciando população de marcos de desenvolvimento...");
    
    const milestones = [
      // 0-3 meses
      {
        title: "Levanta a cabeça quando de bruços",
        description: "O bebê consegue levantar a cabeça brevemente quando colocado de bruços",
        category: "motor",
        age_months: 1
      },
      {
        title: "Segue objetos com os olhos",
        description: "O bebê acompanha objetos em movimento com os olhos",
        category: "cognitivo",
        age_months: 2
      },
      {
        title: "Sorri em resposta",
        description: "O bebê sorri em resposta a rostos ou vozes familiares",
        category: "social",
        age_months: 2
      },
      {
        title: "Emite sons (arrulhos)",
        description: "O bebê começa a vocalizar com sons simples como 'ah', 'oh'",
        category: "linguagem",
        age_months: 3
      },
      // 4-6 meses
      {
        title: "Rola de barriga para cima para baixo",
        description: "O bebê consegue rolar de barriga para cima para baixo",
        category: "motor",
        age_months: 4
      },
      {
        title: "Agarra objetos",
        description: "O bebê consegue agarrar e segurar objetos com as mãos",
        category: "motor",
        age_months: 5
      },
      {
        title: "Reconhece rostos familiares",
        description: "O bebê demonstra reconhecimento de rostos familiares",
        category: "cognitivo",
        age_months: 4
      },
      {
        title: "Ri alto",
        description: "O bebê começa a rir alto em resposta a brincadeiras",
        category: "social",
        age_months: 4
      },
      {
        title: "Balbucia",
        description: "O bebê balbucia consoantes como 'ba', 'da', 'ga'",
        category: "linguagem",
        age_months: 6
      },
      // 7-9 meses
      {
        title: "Senta sem apoio",
        description: "O bebê consegue sentar-se sem apoio por períodos mais longos",
        category: "motor",
        age_months: 7
      },
      {
        title: "Transfere objetos entre as mãos",
        description: "O bebê consegue passar objetos de uma mão para a outra",
        category: "motor",
        age_months: 7
      },
      {
        title: "Procura por objetos escondidos",
        description: "O bebê procura por objetos que foram escondidos na frente dele",
        category: "cognitivo",
        age_months: 8
      },
      {
        title: "Demonstra ansiedade com estranhos",
        description: "O bebê mostra desconforto ou chora na presença de pessoas desconhecidas",
        category: "social",
        age_months: 8
      },
      {
        title: "Responde ao próprio nome",
        description: "O bebê olha ou responde quando seu nome é chamado",
        category: "linguagem",
        age_months: 9
      },
      // 10-12 meses
      {
        title: "Engatinha",
        description: "O bebê se move engatinhando com mãos e joelhos",
        category: "motor",
        age_months: 10
      },
      {
        title: "Fica em pé com apoio",
        description: "O bebê consegue ficar em pé segurando-se em móveis",
        category: "motor",
        age_months: 10
      },
      {
        title: "Entende comandos simples",
        description: "O bebê entende e responde a comandos simples como 'não' ou 'vem cá'",
        category: "cognitivo",
        age_months: 11
      },
      {
        title: "Brinca de jogos simples",
        description: "O bebê participa de jogos simples como 'achou' ou bater palmas",
        category: "social",
        age_months: 11
      },
      {
        title: "Diz primeiras palavras",
        description: "O bebê diz sua primeira palavra com significado como 'mamã' ou 'papá'",
        category: "linguagem",
        age_months: 12
      },
      // 13-18 meses
      {
        title: "Caminha sozinho",
        description: "A criança consegue caminhar alguns passos sem apoio",
        category: "motor",
        age_months: 13
      },
      {
        title: "Sobe escadas com ajuda",
        description: "A criança sobe escadas com a ajuda de um adulto",
        category: "motor",
        age_months: 16
      },
      {
        title: "Aponta para objetos de interesse",
        description: "A criança aponta para objetos que deseja ou que chamam sua atenção",
        category: "cognitivo",
        age_months: 14
      },
      {
        title: "Mostra afeto",
        description: "A criança demonstra afeto com abraços, beijos ou carinho",
        category: "social",
        age_months: 15
      },
      {
        title: "Vocabulário de 5-20 palavras",
        description: "A criança usa de 5 a 20 palavras com significado",
        category: "linguagem",
        age_months: 18
      },
      // 19-24 meses
      {
        title: "Corre com firmeza",
        description: "A criança consegue correr com mais estabilidade",
        category: "motor",
        age_months: 20
      },
      {
        title: "Chuta bola",
        description: "A criança consegue chutar uma bola para frente",
        category: "motor",
        age_months: 21
      },
      {
        title: "Brinca de faz-de-conta",
        description: "A criança começa a brincar de faz-de-conta, como alimentar uma boneca",
        category: "cognitivo",
        age_months: 22
      },
      {
        title: "Brinca ao lado de outras crianças",
        description: "A criança brinca ao lado de outras crianças, mas ainda não interage muito",
        category: "social",
        age_months: 23
      },
      {
        title: "Forma frases de 2 palavras",
        description: "A criança combina duas palavras em frases simples como 'quero água'",
        category: "linguagem",
        age_months: 24
      }
    ];
    
    // Verificar se já existem marcos no banco
    const { count } = await supabase
      .from('milestones')
      .select('*', { count: 'exact', head: true });
      
    if (count && count > 0) {
      console.log(`Já existem ${count} marcos no banco de dados. Pulando inserção.`);
      return false;
    }
    
    // Inserir marcos
    const { data, error } = await supabase
      .from('milestones')
      .insert(milestones);
      
    if (error) {
      console.error("Erro ao inserir marcos:", error);
      return false;
    }
    
    console.log("Marcos de desenvolvimento inseridos com sucesso!");
    return true;
  } catch (error) {
    console.error("Erro ao popular marcos:", error);
    return false;
  }
};

// Função para executar no console do navegador
export const setupInitialData = async () => {
  const result = await populateInitialMilestones();
  if (result) {
    console.log("Dados iniciais configurados com sucesso!");
  } else {
    console.log("Não foi possível configurar todos os dados iniciais. Verifique os erros acima.");
  }
  
  return result;
};
