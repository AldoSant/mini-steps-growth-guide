
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, LogOut, User, FileText, Home, BookOpen, Calendar, Baby, Stethoscope, CreditCard } from "lucide-react";

const Header = () => {
  const { user, signOut } = useAuth();
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const routes = [
    { name: "Home", path: "/", icon: <Home className="h-5 w-5 mr-2" /> },
    { name: "Dashboard", path: "/dashboard", icon: <FileText className="h-5 w-5 mr-2" /> },
    { name: "Diário", path: "/diario", icon: <Calendar className="h-5 w-5 mr-2" /> },
    { name: "Atividades", path: "/atividades", icon: <BookOpen className="h-5 w-5 mr-2" /> },
    { name: "Histórico Médico", path: "/historico-medico", icon: <Stethoscope className="h-5 w-5 mr-2" /> },
    { name: "Perfil", path: "/perfil", icon: <Baby className="h-5 w-5 mr-2" /> },
    { name: "Assinatura", path: "/assinatura", icon: <CreditCard className="h-5 w-5 mr-2" /> },
  ];

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 md:h-16 items-center justify-between">
        <div className="flex items-center gap-4 md:gap-8">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="MiniPassos" className="h-8" />
            <span className="text-xl font-bold text-primary hidden sm:inline-block">
              MiniPassos
            </span>
          </Link>

          {!isMobile && user && (
            <nav className="hidden md:flex items-center gap-4 text-sm">
              {routes.slice(1).map((route) => (
                <Link
                  key={route.path}
                  to={route.path}
                  className={`flex items-center transition-colors hover:text-primary ${
                    location.pathname === route.path
                      ? "text-primary font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  {route.name}
                </Link>
              ))}
            </nav>
          )}
        </div>

        {isMobile ? (
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>MiniPassos</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                <nav className="flex flex-col gap-1">
                  {routes.map((route) => (
                    <Link
                      key={route.path}
                      to={route.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center py-3 px-3 rounded-md transition-colors ${
                        location.pathname === route.path
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      {route.icon}
                      {route.name}
                    </Link>
                  ))}
                </nav>

                <div className="mt-6">
                  {user ? (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={handleSignOut}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sair
                    </Button>
                  ) : (
                    <Button
                      variant="default"
                      className="w-full"
                      onClick={() => {
                        navigate("/auth");
                        setIsOpen(false);
                      }}
                    >
                      Entrar
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <div className="flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="relative">
                    <User className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline-block">Conta</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/historico-medico")}>
                    <Stethoscope className="h-4 w-4 mr-2" />
                    Histórico Médico
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/perfil")}>
                    <Baby className="h-4 w-4 mr-2" />
                    Perfil do bebê
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    <FileText className="h-4 w-4 mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/assinatura")}>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Assinatura
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => navigate("/auth")}>Entrar</Button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
