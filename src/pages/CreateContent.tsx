
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { 
  BookOpen, 
  Play, 
  ArrowLeft, 
  Eye, 
  Save, 
  Upload,
  FileText, 
  Info
} from "lucide-react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Alert, AlertDescription } from "@/components/ui/alert";

const CreateContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const { toast } = useToast();
  const { user, userProfile, isProfileLoading } = useAuth();
  const queryClient = useQueryClient();
  const [contentType, setContentType] = useState<'article' | 'activity'>(
    state?.defaultTab === 'activity' ? 'activity' : 'article'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // For articles
  const { register: registerArticle, handleSubmit: handleSubmitArticle, formState: { errors: errorsArticle } } = useForm();
  
  // For activities
  const { register: registerActivity, handleSubmit: handleSubmitActivity, formState: { errors: errorsActivity } } = useForm();
  
  // Redirect if not verified professional
  if (!isProfileLoading && (!userProfile || userProfile.user_role !== 'professional' || !userProfile.is_verified)) {
    navigate("/dashboard");
    return null;
  }

  const onSubmitArticle = async (data: any) => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      // Create article in database
      const { data: article, error } = await supabase
        .from('articles')
        .insert({
          title: data.title,
          content: data.content,
          summary: data.summary,
          author_id: user.id,
          published: false, // Start as a draft
          min_age_months: parseInt(data.minAge) || null,
          max_age_months: parseInt(data.maxAge) || null,
          categories: data.categories ? data.categories.split(',').map((cat: string) => cat.trim()) : []
        })
        .select('id')
        .single();
        
      if (error) throw error;
      
      // Update cache
      queryClient.invalidateQueries({ queryKey: ['professional-articles'] });
      
      toast({
        title: "Artigo criado com sucesso!",
        description: "Seu rascunho foi salvo e poderá ser editado e publicado mais tarde.",
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Erro ao criar artigo",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const onSubmitActivity = async (data: any) => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      // Create activity in database
      const { data: activity, error } = await supabase
        .from('activities')
        .insert({
          title: data.title,
          description: data.description,
          instructions: data.instructions,
          category: data.category,
          creator_id: user.id,
          published: false, // Start as a draft
          min_age_months: parseInt(data.minAge),
          max_age_months: parseInt(data.maxAge),
          materials: data.materials ? data.materials.split(',').map((mat: string) => mat.trim()) : []
        })
        .select('id')
        .single();
        
      if (error) throw error;
      
      // Update cache
      queryClient.invalidateQueries({ queryKey: ['professional-activities'] });
      
      toast({
        title: "Atividade criada com sucesso!",
        description: "Seu rascunho foi salvo e poderá ser editado e publicado mais tarde.",
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Erro ao criar atividade",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8 bg-gray-50">
        <div className="container max-w-4xl">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/dashboard')}
                className="px-0 text-gray-600 font-normal hover:text-minipassos-purple hover:bg-transparent -ml-2 mb-2"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Voltar para o Dashboard
              </Button>
              <h1 className="text-2xl font-bold text-gray-800">Criar Conteúdo</h1>
              <p className="text-gray-600">
                Compartilhe seu conhecimento para ajudar famílias
              </p>
            </div>
            
            <RadioGroup
              defaultValue="article"
              value={contentType}
              onValueChange={(value) => setContentType(value as 'article' | 'activity')}
              className="flex gap-2"
            >
              <div className={`flex items-center space-x-2 bg-white border rounded-md p-2 ${contentType === 'article' ? 'border-minipassos-purple' : 'border-gray-200'} cursor-pointer hover:bg-gray-50`}>
                <RadioGroupItem value="article" id="article" />
                <Label htmlFor="article" className="cursor-pointer flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-minipassos-purple" />
                  Artigo
                </Label>
              </div>
              <div className={`flex items-center space-x-2 bg-white border rounded-md p-2 ${contentType === 'activity' ? 'border-minipassos-purple' : 'border-gray-200'} cursor-pointer hover:bg-gray-50`}>
                <RadioGroupItem value="activity" id="activity" />
                <Label htmlFor="activity" className="cursor-pointer flex items-center">
                  <Play className="h-4 w-4 mr-2 text-minipassos-purple" />
                  Atividade
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Todo o conteúdo criado passa por uma análise antes de ser publicado. Após a criação, ele ficará como rascunho até ser aprovado.
            </AlertDescription>
          </Alert>
          
          <div className="bg-white border rounded-lg shadow-sm">
            <div className="p-6">
              {contentType === 'article' ? (
                // Article form
                <form onSubmit={handleSubmitArticle(onSubmitArticle)} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="article-title">Título do Artigo</Label>
                    <Input 
                      id="article-title" 
                      placeholder="Digite um título informativo e atraente"
                      {...registerArticle('title', { required: 'O título é obrigatório' })}
                    />
                    {errorsArticle.title && (
                      <p className="text-sm text-red-500">{errorsArticle.title.message as string}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="article-summary">Resumo</Label>
                    <Textarea 
                      id="article-summary" 
                      placeholder="Um breve resumo do conteúdo do artigo (máx. 200 caracteres)"
                      maxLength={200}
                      {...registerArticle('summary', { required: 'O resumo é obrigatório' })}
                    />
                    {errorsArticle.summary && (
                      <p className="text-sm text-red-500">{errorsArticle.summary.message as string}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="article-content">Conteúdo</Label>
                    <Textarea 
                      id="article-content" 
                      placeholder="Escreva o conteúdo completo do artigo aqui"
                      className="min-h-[300px]"
                      {...registerArticle('content', { required: 'O conteúdo é obrigatório' })}
                    />
                    {errorsArticle.content && (
                      <p className="text-sm text-red-500">{errorsArticle.content.message as string}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="article-categories">Categorias</Label>
                      <Input 
                        id="article-categories" 
                        placeholder="Separadas por vírgula (ex: Alimentação, Sono)"
                        {...registerArticle('categories')}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="article-min-age">Idade Mínima (meses)</Label>
                        <Input 
                          id="article-min-age"
                          type="number"
                          placeholder="0"
                          min={0}
                          max={36}
                          {...registerArticle('minAge')}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="article-max-age">Idade Máxima (meses)</Label>
                        <Input 
                          id="article-max-age"
                          type="number" 
                          placeholder="36"
                          min={0}
                          max={36}
                          {...registerArticle('maxAge')}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-4 pt-2">
                    <Button variant="outline" type="button" onClick={() => navigate('/dashboard')}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Cancelar
                    </Button>
                    <Button 
                      type="submit"
                      className="bg-minipassos-purple hover:bg-minipassos-purple-dark"
                      disabled={isSubmitting}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {isSubmitting ? 'Salvando...' : 'Salvar Rascunho'}
                    </Button>
                  </div>
                </form>
              ) : (
                // Activity form
                <form onSubmit={handleSubmitActivity(onSubmitActivity)} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="activity-title">Título da Atividade</Label>
                    <Input 
                      id="activity-title" 
                      placeholder="Digite um título curto e descriptivo"
                      {...registerActivity('title', { required: 'O título é obrigatório' })}
                    />
                    {errorsActivity.title && (
                      <p className="text-sm text-red-500">{errorsActivity.title.message as string}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="activity-category">Categoria</Label>
                      <Input 
                        id="activity-category" 
                        placeholder="Ex: Motora, Cognitiva, Sensorial"
                        {...registerActivity('category', { required: 'A categoria é obrigatória' })}
                      />
                      {errorsActivity.category && (
                        <p className="text-sm text-red-500">{errorsActivity.category.message as string}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="activity-materials">Materiais necessários</Label>
                      <Input 
                        id="activity-materials" 
                        placeholder="Separados por vírgula (ex: Bola, Chocalho)"
                        {...registerActivity('materials')}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="activity-min-age">Idade Mínima (meses)</Label>
                      <Input 
                        id="activity-min-age"
                        type="number"
                        placeholder="0"
                        min={0}
                        max={36}
                        {...registerActivity('minAge', { required: 'A idade mínima é obrigatória' })}
                      />
                      {errorsActivity.minAge && (
                        <p className="text-sm text-red-500">{errorsActivity.minAge.message as string}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="activity-max-age">Idade Máxima (meses)</Label>
                      <Input 
                        id="activity-max-age"
                        type="number" 
                        placeholder="36"
                        min={0}
                        max={36}
                        {...registerActivity('maxAge', { required: 'A idade máxima é obrigatória' })}
                      />
                      {errorsActivity.maxAge && (
                        <p className="text-sm text-red-500">{errorsActivity.maxAge.message as string}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="activity-description">Descrição</Label>
                    <Textarea 
                      id="activity-description" 
                      placeholder="Uma breve descrição da atividade e seus benefícios"
                      className="min-h-[100px]"
                      {...registerActivity('description', { required: 'A descrição é obrigatória' })}
                    />
                    {errorsActivity.description && (
                      <p className="text-sm text-red-500">{errorsActivity.description.message as string}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="activity-instructions">Instruções</Label>
                    <Textarea 
                      id="activity-instructions" 
                      placeholder="Instruções detalhadas, passo a passo, de como realizar a atividade"
                      className="min-h-[200px]"
                      {...registerActivity('instructions', { required: 'As instruções são obrigatórias' })}
                    />
                    {errorsActivity.instructions && (
                      <p className="text-sm text-red-500">{errorsActivity.instructions.message as string}</p>
                    )}
                  </div>
                  
                  <div className="flex justify-end space-x-4 pt-2">
                    <Button variant="outline" type="button" onClick={() => navigate('/dashboard')}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Cancelar
                    </Button>
                    <Button 
                      type="submit"
                      className="bg-minipassos-purple hover:bg-minipassos-purple-dark"
                      disabled={isSubmitting}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {isSubmitting ? 'Salvando...' : 'Salvar Rascunho'}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CreateContent;
