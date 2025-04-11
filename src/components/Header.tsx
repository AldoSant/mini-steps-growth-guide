
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Baby, BookOpen, Calendar, Activity, Image, BarChart, LogOut, LogIn, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navLinks = [
    { name: "Início", path: "/", icon: <Baby size={18} /> },
    { name: "Dashboard", path: "/dashboard", icon: <BarChart size={18} /> },
    { name: "Diário", path: "/diario", icon: <Image size={18} /> },
    { name: "Atividades", path: "/atividades", icon: <Activity size={18} /> },
    { name: "Biblioteca", path: "/biblioteca", icon: <BookOpen size={18} /> },
    { name: "Calendário", path: "/calendario", icon: <Calendar size={18} /> },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-minipassos-purple to-minipassos-purple-dark p-2 rounded-xl">
            <Baby size={24} className="text-white" />
          </div>
          <span className="text-xl font-bold text-minipassos-purple-dark hidden sm:inline-block">
            MiniPassos
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-minipassos-purple ${
                isActive(link.path)
                  ? "text-minipassos-purple"
                  : "text-gray-600"
              }`}
            >
              <span className={isActive(link.path) ? "text-minipassos-purple" : "text-gray-400"}>
                {link.icon}
              </span>
              {link.name}
            </Link>
          ))}
        </nav>

        {/* User Menu */}
        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  <User size={18} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="text-sm">
                  <span>{user.email}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden md:flex"
              onClick={() => navigate("/auth")}
            >
              <LogIn className="mr-2 h-4 w-4" />
              Entrar
            </Button>
          )}
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="fixed inset-0 top-16 z-50 bg-white md:hidden">
            <nav className="container grid gap-6 p-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-4 text-base font-medium ${
                    isActive(link.path)
                      ? "text-minipassos-purple"
                      : "text-gray-600"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className={isActive(link.path) ? "text-minipassos-purple" : "text-gray-400"}>
                    {link.icon}
                  </span>
                  {link.name}
                </Link>
              ))}
              {user ? (
                <Button 
                  variant="ghost" 
                  className="flex items-center justify-start px-0 text-red-500"
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                >
                  <LogOut className="mr-4 h-5 w-5" />
                  Sair
                </Button>
              ) : (
                <Button 
                  variant="ghost" 
                  className="flex items-center justify-start px-0 text-minipassos-purple"
                  onClick={() => {
                    navigate("/auth");
                    setIsMenuOpen(false);
                  }}
                >
                  <LogIn className="mr-4 h-5 w-5" />
                  Entrar
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
