
import { useRef, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { Menu, X, LogOut, User, Baby, Settings, Book, Activity, Heart, PlusCircle } from "lucide-react";
import { useMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import logo from "/assets/logo.svg";

const Header = () => {
  const navigate = useNavigate();
  const { user, userProfile, userRole, signOut } = useAuth();
  const isMobile = useMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center h-16">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="MiniPassos" className="h-8" />
        </Link>

        {/* Desktop Navigation */}
        {!isMobile && (
          <nav className="hidden md:flex items-center space-x-1">
            {user ? (
              <>
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:text-minipassos-purple hover:bg-gray-100"
                  onClick={() => navigate("/dashboard")}
                >
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:text-minipassos-purple hover:bg-gray-100"
                  onClick={() => navigate("/atividades")}
                >
                  Atividades
                </Button>
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:text-minipassos-purple hover:bg-gray-100"
                  onClick={() => navigate("/biblioteca")}
                >
                  Biblioteca
                </Button>
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:text-minipassos-purple hover:bg-gray-100"
                  onClick={() => navigate("/historico-medico")}
                >
                  Saúde
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:text-minipassos-purple hover:bg-gray-100"
                  onClick={() => navigate("/")}
                >
                  Início
                </Button>
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:text-minipassos-purple hover:bg-gray-100"
                >
                  Sobre
                </Button>
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:text-minipassos-purple hover:bg-gray-100"
                  onClick={() => navigate("/assinatura")}
                >
                  Planos
                </Button>
              </>
            )}
          </nav>
        )}

        <div className="flex items-center">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={userProfile?.avatar_url || ""} />
                    <AvatarFallback className="bg-minipassos-purple text-white">
                      {userProfile?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuItem 
                  className="flex items-center cursor-pointer"
                  onClick={() => navigate("/perfil")}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Meu Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="flex items-center cursor-pointer"
                  onClick={() => navigate("/dashboard")}
                >
                  <Baby className="mr-2 h-4 w-4" />
                  <span>Meus Bebês</span>
                </DropdownMenuItem>
                
                {userRole === 'professional' && (
                  <DropdownMenuItem
                    className="flex items-center cursor-pointer"
                    onClick={() => navigate("/criar-conteudo")}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    <span>Criar Conteúdo</span>
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex items-center cursor-pointer"
                  onClick={() => navigate("/atividades")}
                >
                  <Activity className="mr-2 h-4 w-4" />
                  <span>Atividades</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center cursor-pointer"
                  onClick={() => navigate("/biblioteca")}
                >
                  <Book className="mr-2 h-4 w-4" />
                  <span>Biblioteca</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center cursor-pointer"
                  onClick={() => navigate("/historico-medico")}
                >
                  <Heart className="mr-2 h-4 w-4" />
                  <span>Saúde</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex items-center cursor-pointer text-red-600 focus:text-red-500"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              className="bg-minipassos-purple hover:bg-minipassos-purple-dark"
              onClick={() => navigate("/auth")}
            >
              Entrar
            </Button>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <Button
              variant="ghost"
              className="ml-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobile && (
        <div
          ref={menuRef}
          className={cn(
            "fixed inset-0 z-40 bg-white transform transition-transform duration-300 ease-in-out",
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex justify-between items-center h-16 px-4 border-b">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="MiniPassos" className="h-8" />
            </Link>
            <Button
              variant="ghost"
              onClick={() => setIsMenuOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <nav className="p-4 space-y-2">
            {user ? (
              <>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg mb-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={userProfile?.avatar_url || ""} />
                    <AvatarFallback className="bg-minipassos-purple text-white">
                      {userProfile?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{userProfile?.full_name || "Usuário"}</div>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-xs text-minipassos-purple"
                      onClick={() => {
                        navigate("/perfil");
                        setIsMenuOpen(false);
                      }}
                    >
                      Ver perfil
                    </Button>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    navigate("/dashboard");
                    setIsMenuOpen(false);
                  }}
                >
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    navigate("/atividades");
                    setIsMenuOpen(false);
                  }}
                >
                  Atividades
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    navigate("/biblioteca");
                    setIsMenuOpen(false);
                  }}
                >
                  Biblioteca
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    navigate("/historico-medico");
                    setIsMenuOpen(false);
                  }}
                >
                  Saúde
                </Button>
                
                {userRole === 'professional' && (
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      navigate("/criar-conteudo");
                      setIsMenuOpen(false);
                    }}
                  >
                    Criar Conteúdo
                  </Button>
                )}
                
                <div className="pt-4 border-t mt-4">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    navigate("/");
                    setIsMenuOpen(false);
                  }}
                >
                  Início
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    setIsMenuOpen(false);
                  }}
                >
                  Sobre
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    navigate("/assinatura");
                    setIsMenuOpen(false);
                  }}
                >
                  Planos
                </Button>
                <div className="pt-4">
                  <Button
                    className="w-full bg-minipassos-purple hover:bg-minipassos-purple-dark"
                    onClick={() => {
                      navigate("/auth");
                      setIsMenuOpen(false);
                    }}
                  >
                    Entrar
                  </Button>
                </div>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
