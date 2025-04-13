
import { ArrowRight, Baby, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { usePWA } from "@/hooks/usePWA";

const HeroSection = () => {
  const { isInstallable, promptInstall } = usePWA();

  return (
    <section className="relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 hero-pattern" />

      <div className="container relative z-10 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-4 md:space-y-6">
            <div className="inline-block rounded-full bg-minipassos-purple/10 px-4 py-1.5 text-sm font-medium text-minipassos-purple">
              Lançamento 2025
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900">
              Acompanhe cada momento do desenvolvimento do seu bebê
            </h1>
            <p className="text-lg text-gray-600">
              Cada pequeno passo, uma grande conquista. MiniPassos ajuda os pais a monitorar e estimular o desenvolvimento dos seus filhos de 0 a 6 anos.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="bg-minipassos-purple hover:bg-minipassos-purple-dark w-full sm:w-auto">
                <Link to="/auth">
                  Começar agora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              
              {isInstallable && (
                <Button variant="outline" size="lg" className="w-full sm:w-auto" onClick={promptInstall}>
                  <Download className="mr-2 h-4 w-4" />
                  Instalar App
                </Button>
              )}
            </div>

            <div className="flex items-center gap-4 pt-2">
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

          <div className="aspect-square max-w-xs mx-auto md:max-w-none rounded-full bg-gradient-to-br from-minipassos-purple-light via-white to-minipassos-blue-light p-6 sm:p-8 flex items-center justify-center">
            <div className="bg-white rounded-full p-4 sm:p-6 shadow-xl">
              <div className="bg-gradient-to-r from-minipassos-purple to-minipassos-purple-dark p-8 sm:p-10 rounded-full">
                <Baby size={100} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave divider - responsive */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-12 md:h-16">
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,64L60,58.7C120,53,240,43,360,48C480,53,600,75,720,80C840,85,960,75,1080,69.3C1200,64,1320,64,1380,64L1440,64L1440,100L1380,100C1320,100,1200,100,1080,100C960,100,840,100,720,100C600,100,480,100,360,100C240,100,120,100,60,100L0,100Z"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
