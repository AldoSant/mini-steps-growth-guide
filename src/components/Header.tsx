
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Baby, BookOpen, Calendar, Activity, Image, BarChart } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
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
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
