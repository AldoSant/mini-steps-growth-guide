
import { createContext, useState, useContext } from "react";
import { Article } from "@/types";

interface ArticleContextType {
  articles: Article[];
  setArticles: (articles: Article[]) => void;
  createArticle: (article: Omit<Article, "id" | "created_at">) => Promise<void>;
  updateArticle: (id: string, article: Partial<Article>) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  getArticle: (id: string) => Article | undefined;
}

export const ArticleContext = createContext<ArticleContextType>({
  articles: [],
  setArticles: () => {},
  createArticle: async () => {},
  updateArticle: async () => {},
  deleteArticle: async () => {},
  getArticle: () => undefined,
});

export const ArticleProvider = ({ children }: { children: React.ReactNode }) => {
  const [articles, setArticles] = useState<Article[]>([]);

  const createArticle = async (article: Omit<Article, "id" | "created_at">) => {
    // Implementation will be added in the future
  };

  const updateArticle = async (id: string, article: Partial<Article>) => {
    // Implementation will be added in the future
  };

  const deleteArticle = async (id: string) => {
    // Implementation will be added in the future
  };

  const getArticle = (id: string) => {
    return articles.find(article => article.id === id);
  };

  return (
    <ArticleContext.Provider
      value={{
        articles,
        setArticles,
        createArticle,
        updateArticle,
        deleteArticle,
        getArticle,
      }}
    >
      {children}
    </ArticleContext.Provider>
  );
};

export const useArticle = () => useContext(ArticleContext);
