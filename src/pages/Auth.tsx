
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Baby, Mail, Lock, Eye, EyeOff, User, AlertCircle, 
  Briefcase, GraduationCap, BadgeCheck, HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  
  // Professional account fields
  const [userRole, setUserRole] = useState<'parent' | 'professional'>('parent');
  const [professionalTitle, setProfessionalTitle] = useState("");
  const [professionalSpecialization, setProfessionalSpecialization] = useState("");
  const [professionalBio, setProfessionalBio] = useState("");
  const [showProfessionalFields, setShowProfessionalFields] = useState(false);
  const [step, setStep] = useState(1);

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email é obrigatório");
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Email inválido");
      return false;
    }
    setEmailError("");
    return true;
  };

  // Password validation
  const validatePassword = (password: string, isLogin = false) => {
    if (!password) {
      setPasswordError("Senha é obrigatória");
      return false;
    } else if (!isLogin && password.length < 6) {
      setPasswordError("Senha deve ter pelo menos 6 caracteres");
      return false;
    }
    setPasswordError("");
    return true;
  };

  // Name validation
  const validateFullName = (name: string) => {
    if (!name) {
      setFullNameError("Nome é obrigatório");
      return false;
    } else if (name.length < 3) {
      setFullNameError("Nome deve ter pelo menos 3 caracteres");
      return false;
    }
    setFullNameError("");
    return true;
  };

  // Validate professional fields
  const validateProfessionalFields = () => {
    if (userRole !== 'professional') return true;
    
    let isValid = true;
    
    if (!professionalTitle) {
      toast({
        title: "Título profissional é obrigatório",
        variant: "destructive",
      });
      isValid = false;
    }
    
    if (!professionalSpecialization) {
      toast({
        title: "Especialização é obrigatória", 
        variant: "destructive",
      });
      isValid = false;
    }
    
    if (!professionalBio || professionalBio.length < 50) {
      toast({
        title: "Bio profissional é obrigatória",
        description: "Por favor, forneça uma bio com pelo menos 50 caracteres",
        variant: "destructive",
      });
      isValid = false;
    }
    
    return isValid;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      // Validation of basic fields
      const isEmailValid = validateEmail(email);
      const isPasswordValid = validatePassword(password);
      const isFullNameValid = validateFullName(fullName);
      
      if (!isEmailValid || !isPasswordValid || !isFullNameValid) {
        return;
      }
      
      // If user chose professional role, show additional fields
      if (userRole === 'professional') {
        setShowProfessionalFields(true);
        setStep(2);
        return;
      }
    }
    
    // For professionals at step 2 or parents continuing from step 1
    if ((userRole === 'professional' && step === 2) || userRole === 'parent') {
      // Validate professional fields if applicable
      if (userRole === 'professional' && !validateProfessionalFields()) {
        return;
      }
      
      setLoading(true);
      
      try {
        // Register the user
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            }
          }
        });

        if (error) throw error;
        
        // If registration was successful, update the profile with role and professional data
        if (data.user) {
          const profileData: any = {
            user_role: userRole,
          };
          
          if (userRole === 'professional') {
            profileData.professional_title = professionalTitle;
            profileData.professional_specialization = professionalSpecialization;
            profileData.professional_bio = professionalBio;
          }
          
          // Update the profile
          const { error: profileError } = await supabase
            .from('profiles')
            .update(profileData)
            .eq('id', data.user.id);
            
          if (profileError) {
            console.error("Error updating profile:", profileError);
          }
        }
        
        toast({
          title: "Conta criada com sucesso!",
          description: "Verifique seu e-mail para confirmar o cadastro."
        });

        // Redirect to dashboard if user was created immediately
        if (data.user) {
          navigate("/dashboard");
        }
      } catch (error: any) {
        let errorMessage = "Erro ao criar conta";
        
        if (error.message.includes("already registered")) {
          errorMessage = "Este email já está registrado. Faça login.";
        }
        
        toast({
          title: "Erro ao criar conta",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
        setStep(1); // Reset step
      }
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation of email and password
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password, true);
    
    if (!isEmailValid || !isPasswordValid) {
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      navigate("/dashboard");
    } catch (error: any) {
      let errorMessage = "Dados de login incorretos. Verifique seu email e senha.";
      
      if (error.message.includes("Email not confirmed")) {
        errorMessage = "Email não confirmado. Verifique sua caixa de entrada.";
      }
      
      toast({
        title: "Erro ao fazer login",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error: any) {
      toast({
        title: "Erro ao fazer login com Google",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Reset fields when returning to step 1
  const handleBackToStep1 = () => {
    setStep(1);
    setShowProfessionalFields(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="bg-gradient-to-r from-minipassos-purple to-minipassos-purple-dark p-3 rounded-xl mb-3">
            <Baby size={32} className="text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-minipassos-purple-dark">MiniPassos</CardTitle>
          <CardDescription className="text-gray-500">Acompanhe o desenvolvimento do seu bebê</CardDescription>
        </CardHeader>
        
        {showProfessionalFields ? (
          // Step 2: Professional fields form
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg flex items-center">
                  <BadgeCheck className="mr-2 h-5 w-5 text-minipassos-purple" />
                  Perfil Profissional
                </h3>
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={handleBackToStep1}
                  className="text-sm"
                >
                  Voltar
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="professional-title">
                  Título Profissional 
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input 
                  id="professional-title" 
                  placeholder="Ex: Pediatra, Psicólogo Infantil, etc" 
                  value={professionalTitle}
                  onChange={(e) => setProfessionalTitle(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="professional-specialization">
                  Especialização 
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input 
                  id="professional-specialization" 
                  placeholder="Ex: Desenvolvimento infantil, Nutrição infantil, etc" 
                  value={professionalSpecialization}
                  onChange={(e) => setProfessionalSpecialization(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="professional-bio">
                    Biografia Profissional 
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <span className="text-xs text-gray-500">
                    {professionalBio.length}/300
                  </span>
                </div>
                <Textarea 
                  id="professional-bio" 
                  placeholder="Descreva sua formação, experiência e como você pode contribuir com conteúdo relevante para o MiniPassos" 
                  value={professionalBio}
                  onChange={(e) => setProfessionalBio(e.target.value)}
                  className="min-h-[100px]"
                  maxLength={300}
                  required
                />
                <p className="text-xs text-gray-500">
                  Mínimo de 50 caracteres. Essas informações ajudarão os pais a conhecerem você melhor.
                </p>
              </div>
              
              <div className="pt-2">
                <Button 
                  type="submit" 
                  className="w-full bg-minipassos-purple hover:bg-minipassos-purple-dark"
                  disabled={loading}
                >
                  {loading ? "Criando conta..." : "Concluir cadastro"}
                </Button>
              </div>
              
              <p className="text-xs text-gray-500 text-center mt-4">
                Sua conta será analisada por nossa equipe para verificação.
                Você poderá começar a criar conteúdo após essa verificação.
              </p>
            </form>
          </CardContent>
        ) : (
          // Step 1: Default login/register tabs
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="registro">Cadastre-se</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-login">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input 
                        id="email-login" 
                        type="email" 
                        placeholder="seuemail@exemplo.com" 
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          validateEmail(e.target.value);
                        }}
                        className={cn(
                          "pl-10",
                          emailError && "border-red-500 focus-visible:ring-red-500"
                        )}
                        required
                      />
                    </div>
                    {emailError && (
                      <p className="text-sm text-red-500 flex items-center mt-1">
                        <AlertCircle className="h-3 w-3 mr-1" /> {emailError}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="senha-login">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input 
                        id="senha-login" 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          validatePassword(e.target.value, true);
                        }}
                        className={cn(
                          "pl-10",
                          passwordError && "border-red-500 focus-visible:ring-red-500"
                        )}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500" />
                        )}
                      </button>
                    </div>
                    {passwordError && (
                      <p className="text-sm text-red-500 flex items-center mt-1">
                        <AlertCircle className="h-3 w-3 mr-1" /> {passwordError}
                      </p>
                    )}
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-minipassos-purple hover:bg-minipassos-purple-dark"
                    disabled={loading}
                  >
                    {loading ? "Entrando..." : "Entrar"}
                  </Button>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Ou continue com
                    </span>
                  </div>
                </div>

                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google
                </Button>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="registro">
              <CardContent>
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input 
                        id="name" 
                        placeholder="Seu nome completo" 
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          validateFullName(e.target.value);
                        }}
                        className={cn(
                          "pl-10",
                          fullNameError && "border-red-500 focus-visible:ring-red-500"
                        )}
                        required
                      />
                    </div>
                    {fullNameError && (
                      <p className="text-sm text-red-500 flex items-center mt-1">
                        <AlertCircle className="h-3 w-3 mr-1" /> {fullNameError}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email-registro">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input 
                        id="email-registro" 
                        type="email" 
                        placeholder="seuemail@exemplo.com" 
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          validateEmail(e.target.value);
                        }}
                        className={cn(
                          "pl-10",
                          emailError && "border-red-500 focus-visible:ring-red-500"
                        )}
                        required
                      />
                    </div>
                    {emailError && (
                      <p className="text-sm text-red-500 flex items-center mt-1">
                        <AlertCircle className="h-3 w-3 mr-1" /> {emailError}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="senha-registro">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input 
                        id="senha-registro" 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Mínimo 6 caracteres" 
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          validatePassword(e.target.value);
                        }}
                        className={cn(
                          "pl-10",
                          passwordError && "border-red-500 focus-visible:ring-red-500"
                        )}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500" />
                        )}
                      </button>
                    </div>
                    {passwordError && (
                      <p className="text-sm text-red-500 flex items-center mt-1">
                        <AlertCircle className="h-3 w-3 mr-1" /> {passwordError}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="user-role" className="mb-2 flex items-center">
                      Tipo de conta
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 ml-1 text-gray-400 cursor-pointer" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>Contas profissionais podem contribuir com conteúdo para o MiniPassos, como atividades e artigos para pais.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <RadioGroup 
                      value={userRole} 
                      onValueChange={(value) => setUserRole(value as 'parent' | 'professional')}
                      className="flex space-x-2"
                    >
                      <div className="flex items-center space-x-2 bg-white border rounded-md p-3 flex-1 cursor-pointer hover:bg-gray-50">
                        <RadioGroupItem value="parent" id="parent" />
                        <Label htmlFor="parent" className="cursor-pointer flex flex-col">
                          <span className="font-medium flex items-center">
                            <Baby className="h-4 w-4 mr-2 text-minipassos-purple" />
                            Pai/Mãe
                          </span>
                          <span className="text-xs text-gray-500">Para acompanhar o bebê</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 bg-white border rounded-md p-3 flex-1 cursor-pointer hover:bg-gray-50">
                        <RadioGroupItem value="professional" id="professional" />
                        <Label htmlFor="professional" className="cursor-pointer flex flex-col">
                          <span className="font-medium flex items-center">
                            <Briefcase className="h-4 w-4 mr-2 text-minipassos-purple" />
                            Profissional
                          </span>
                          <span className="text-xs text-gray-500">Para contribuir com conteúdo</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-minipassos-purple hover:bg-minipassos-purple-dark"
                    disabled={loading}
                  >
                    {loading ? "Criando conta..." : "Criar conta"}
                  </Button>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Ou continue com
                    </span>
                  </div>
                </div>

                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google
                </Button>
              </CardContent>
            </TabsContent>
          </Tabs>
        )}

        <CardFooter className="flex flex-col items-center text-center text-sm text-muted-foreground">
          <p>
            Ao criar uma conta, você concorda com os{" "}
            <a href="#" className="underline text-minipassos-purple">
              Termos de Serviço
            </a>{" "}
            e{" "}
            <a href="#" className="underline text-minipassos-purple">
              Política de Privacidade
            </a>
            .
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
