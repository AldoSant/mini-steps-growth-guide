
import { Link } from "react-router-dom";
import { Baby, Mail, Instagram, Facebook, Twitter, Stethoscope, CreditCard } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-marcos-purple to-marcos-purple-dark p-2 rounded-xl">
                <Baby size={20} className="text-white" />
              </div>
              <span className="text-lg font-bold text-marcos-purple-dark">Marcos Baby</span>
            </Link>
            <p className="text-gray-500 text-sm">
              Cada pequeno passo, uma grande conquista.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-marcos-purple">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-marcos-purple">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-marcos-purple">
                <Twitter size={18} />
              </a>
              <a href="mailto:contato@marcosbaby.com.br" className="text-gray-400 hover:text-marcos-purple">
                <Mail size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-gray-800 mb-3 text-sm md:text-base">Recursos</h3>
            <ul className="space-y-2 text-xs md:text-sm">
              <li>
                <Link to="/dashboard" className="text-gray-500 hover:text-marcos-purple">Dashboard</Link>
              </li>
              <li>
                <Link to="/diario" className="text-gray-500 hover:text-marcos-purple">Diário do Bebê</Link>
              </li>
              <li>
                <Link to="/atividades" className="text-gray-500 hover:text-marcos-purple">Atividades</Link>
              </li>
              <li>
                <Link to="/historico-medico" className="text-gray-500 hover:text-marcos-purple">Histórico Médico</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-800 mb-3 text-sm md:text-base">Sobre</h3>
            <ul className="space-y-2 text-xs md:text-sm">
              <li>
                <Link to="/sobre" className="text-gray-500 hover:text-marcos-purple">Quem Somos</Link>
              </li>
              <li>
                <Link to="/especialistas" className="text-gray-500 hover:text-marcos-purple">Especialistas</Link>
              </li>
              <li>
                <Link to="/assinatura" className="text-gray-500 hover:text-marcos-purple flex items-center gap-1">
                  <CreditCard size={12} />
                  <span>Planos</span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-800 mb-3 text-sm md:text-base">Suporte</h3>
            <ul className="space-y-2 text-xs md:text-sm">
              <li>
                <Link to="/ajuda" className="text-gray-500 hover:text-marcos-purple">Ajuda</Link>
              </li>
              <li>
                <Link to="/contato" className="text-gray-500 hover:text-marcos-purple">Contato</Link>
              </li>
              <li>
                <Link to="/termos" className="text-gray-500 hover:text-marcos-purple">Termos de Uso</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-100 mt-6 pt-6 text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Marcos Baby. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
