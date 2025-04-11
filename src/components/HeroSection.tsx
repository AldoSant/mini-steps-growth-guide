
import { ArrowRight, Baby } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 hero-pattern" />

      <div className="container relative z-10 py-20 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block rounded-full bg-minipassos-purple/10 px-4 py-1.5 text-sm font-medium text-minipassos-purple">
              Lançamento 2025
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900">
              Acompanhe cada momento do desenvolvimento do seu bebê
            </h1>
            <p className="text-xl text-gray-600">
              Cada pequeno passo, uma grande conquista. MiniPassos ajuda os pais a monitorar e estimular o desenvolvimento dos seus filhos de 0 a 6 anos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-minipassos-purple hover:bg-minipassos-purple-dark">
                <Link to="/cadastro">
                  Começar agora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/como-funciona">Saiba mais</Link>
              </Button>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-2">
                <div className="h-8 w-8 rounded-full border-2 border-white bg-minipassos-purple-light"></div>
                <div className="h-8 w-8 rounded-full border-2 border-white bg-minipassos-green-light"></div>
                <div className="h-8 w-8 rounded-full border-2 border-white bg-minipassos-blue-light"></div>
              </div>
              <p className="text-sm text-gray-500">
                Mais de <span className="font-bold text-minipassos-purple">10.000</span> famílias já utilizam
              </p>
            </div>
          </div>

          <div className="aspect-square rounded-full bg-gradient-to-br from-minipassos-purple-light via-white to-minipassos-blue-light p-8 flex items-center justify-center animate-float">
            <div className="bg-white rounded-full p-6 shadow-xl">
              <div className="bg-gradient-to-r from-minipassos-purple to-minipassos-purple-dark p-10 rounded-full">
                <Baby size={120} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 200">
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,96L60,106.7C120,117,240,139,360,133.3C480,128,600,96,720,90.7C840,85,960,107,1080,117.3C1200,128,1320,128,1380,128L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
