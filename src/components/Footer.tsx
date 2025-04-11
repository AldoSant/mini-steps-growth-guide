
import { Link } from "react-router-dom";
import { Baby, Mail, Instagram, Facebook, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-minipassos-purple to-minipassos-purple-dark p-2 rounded-xl">
                <Baby size={24} className="text-white" />
              </div>
              <span className="text-xl font-bold text-minipassos-purple-dark">MiniPassos</span>
            </Link>
            <p className="text-gray-500 text-sm">
              Cada pequeno passo, uma grande conquista.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-minipassos-purple">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-minipassos-purple">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-minipassos-purple">
                <Twitter size={20} />
              </a>
              <a href="mailto:contato@minipassos.com.br" className="text-gray-400 hover:text-minipassos-purple">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-gray-800 mb-4">Recursos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/dashboard" className="text-gray-500 hover:text-minipassos-purple">Dashboard</Link>
              </li>
              <li>
                <Link to="/diario" className="text-gray-500 hover:text-minipassos-purple">Diário do Bebê</Link>
              </li>
              <li>
                <Link to="/atividades" className="text-gray-500 hover:text-minipassos-purple">Atividades Diárias</Link>
              </li>
              <li>
                <Link to="/calendario" className="text-gray-500 hover:text-minipassos-purple">Calendário</Link>
              </li>
              <li>
                <Link to="/biblioteca" className="text-gray-500 hover:text-minipassos-purple">Biblioteca</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-800 mb-4">Sobre</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/sobre" className="text-gray-500 hover:text-minipassos-purple">Quem Somos</Link>
              </li>
              <li>
                <Link to="/especialistas" className="text-gray-500 hover:text-minipassos-purple">Especialistas</Link>
              </li>
              <li>
                <Link to="/metodologia" className="text-gray-500 hover:text-minipassos-purple">Metodologia</Link>
              </li>
              <li>
                <Link to="/para-profissionais" className="text-gray-500 hover:text-minipassos-purple">Para Profissionais</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-800 mb-4">Suporte</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/ajuda" className="text-gray-500 hover:text-minipassos-purple">Ajuda</Link>
              </li>
              <li>
                <Link to="/contato" className="text-gray-500 hover:text-minipassos-purple">Contato</Link>
              </li>
              <li>
                <Link to="/termos" className="text-gray-500 hover:text-minipassos-purple">Termos de Uso</Link>
              </li>
              <li>
                <Link to="/privacidade" className="text-gray-500 hover:text-minipassos-purple">Política de Privacidade</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-100 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} MiniPassos. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
