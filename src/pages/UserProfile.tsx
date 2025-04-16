
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useBaby } from "@/context/BabyContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, User, Users, Save, LogOut, Baby, Award, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ParentProfileView from "@/components/profile/ParentProfileView";
import ProfessionalProfileView from "@/components/profile/ProfessionalProfileView";

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, userRole, userProfile, signOut, updateProfile, isProfileLoading } = useAuth();
  const { babies } = useBaby();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const form = useForm({
    defaultValues: {
      full_name: userProfile?.full_name || "",
      professional_title: userProfile?.professional_title || "",
      professional_specialization: userProfile?.professional_specialization || "",
      professional_bio: userProfile?.professional_bio || "",
    }
  });

  useEffect(() => {
    if (userProfile) {
      form.reset({
        full_name: userProfile.full_name || "",
        professional_title: userProfile?.professional_title || "",
        professional_specialization: userProfile?.professional_specialization || "",
        professional_bio: userProfile?.professional_bio || "",
      });
    }
  }, [userProfile, form]);

  const onSubmit = async (data: any) => {
    if (!user) return;
    
    setSaving(true);
    try {
      await updateProfile(data);
      
      toast({
        title: "Perfil atualizado com sucesso",
        description: "Suas informações foram salvas.",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Erro ao atualizar perfil",
        description: "Ocorreu um erro ao salvar suas informações.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      toast({
        title: "Erro ao sair",
        description: "Ocorreu um erro ao encerrar sua sessão.",
        variant: "destructive",
      });
    }
  };

  if (isProfileLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 text-minipassos-purple animate-spin" />
            <p className="mt-4 text-gray-600">Carregando perfil...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user || !userProfile) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8 bg-gray-50">
        <div className="container max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Meu Perfil</h1>
            <p className="text-gray-600">Gerencie suas informações pessoais</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <Card className="mb-4">
                <CardContent className="pt-6 flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={userProfile?.avatar_url || ""} />
                    <AvatarFallback className="bg-minipassos-purple text-white text-xl">
                      {userProfile?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  
                  <h2 className="text-xl font-semibold text-center">{userProfile?.full_name || "Usuário"}</h2>
                  
                  <div className="mt-2">
                    <Badge className={userRole === 'professional' ? "bg-blue-500" : "bg-minipassos-purple"}>
                      {userRole === 'professional' ? "Profissional" : "Pai/Mãe"}
                    </Badge>
                    
                    {userRole === 'professional' && (
                      <div className="mt-1 text-center">
                        {userProfile?.is_verified ? (
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                            <Award className="h-3 w-3 mr-1" /> Verificado
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                            Em verificação
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-500 mt-2">{user.email}</p>
                  
                  {userRole === 'professional' && userProfile?.professional_title && (
                    <p className="text-sm font-medium text-gray-700 mt-2">{userProfile.professional_title}</p>
                  )}
                  
                  <div className="mt-6 w-full">
                    <Button 
                      variant="outline" 
                      className="w-full mb-2"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar Perfil
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={handleSignOut}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sair
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {userRole === 'parent' && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center">
                      <Baby className="h-4 w-4 mr-2 text-minipassos-purple" />
                      Meus Bebês
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {babies.length === 0 ? (
                        <p className="text-sm text-gray-500">
                          Nenhum bebê cadastrado
                        </p>
                      ) : (
                        babies.map((baby) => (
                          <div key={baby.id} className="flex items-center justify-between py-1">
                            <span className="text-sm">{baby.name}</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 text-xs"
                              onClick={() => navigate(`/perfil/${baby.id}`)}
                            >
                              Ver
                            </Button>
                          </div>
                        ))
                      )}
                      
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-minipassos-purple"
                        onClick={() => navigate("/dashboard")}
                      >
                        {babies.length === 0 ? "Adicionar bebê" : "Gerenciar bebês"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            
            <div className="md:col-span-3">
              {isEditing ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Editar Perfil</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                          control={form.control}
                          name="full_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome completo</FormLabel>
                              <FormControl>
                                <Input placeholder="Seu nome completo" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {userRole === 'professional' && (
                          <>
                            <FormField
                              control={form.control}
                              name="professional_title"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Título Profissional</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Ex: Pediatra, Psicóloga, etc." {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="professional_specialization"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Especialização</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Ex: Neurologia Pediátrica, Psicologia Infantil" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="professional_bio"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Biografia Profissional</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="Conte um pouco sobre sua formação e experiência..." 
                                      className="min-h-[120px]" 
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </>
                        )}
                        
                        <div className="flex justify-end space-x-2">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setIsEditing(false)}
                          >
                            Cancelar
                          </Button>
                          <Button 
                            type="submit" 
                            className="bg-minipassos-purple hover:bg-minipassos-purple-dark"
                            disabled={saving}
                          >
                            {saving ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Salvando...
                              </>
                            ) : (
                              <>
                                <Save className="mr-2 h-4 w-4" />
                                Salvar Alterações
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              ) : (
                userRole === 'professional' ? (
                  <ProfessionalProfileView profile={userProfile} />
                ) : (
                  <ParentProfileView profile={userProfile} babies={babies} />
                )
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UserProfile;
