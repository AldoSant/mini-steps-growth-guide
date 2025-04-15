
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Baby, Mail, Lock, Eye, EyeOff, User, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

  // Redirecionar para o dashboard se já estiver logado
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // Validação de email
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

  // Validação de senha
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

  // Validação de nome
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação de todos os campos
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isFullNameValid = validateFullName(fullName);
    
    if (!isEmailValid || !isPasswordValid || !isFullNameValid) {
      return;
    }
    
    setLoading(true);
    
    try {
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
      
      toast({
        title: "Conta criada com sucesso!",
        description: "Verifique seu e-mail para confirmar o cadastro.",
      });

      // Verificar se o usuário foi criado imediatamente (para desenvolvimento sem confirmação de email)
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
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação de email e senha
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
