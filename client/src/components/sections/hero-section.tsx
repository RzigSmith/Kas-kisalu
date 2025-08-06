import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export function HeroSection() {
  const scrollToSectors = () => {
    const sectorsElement = document.getElementById("nos-secteurs");
    sectorsElement?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToContact = () => {
    const contactElement = document.getElementById("contact");
    contactElement?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-gray-900/80 to-green-900/90"></div>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')"
        }}
      ></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Excellence Multi-Sectorielle
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">
          Votre partenaire de confiance dans la construction, l'agriculture, l'élevage et le transport
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={scrollToSectors}
            className="bg-primary hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-all"
          >
            Découvrir nos secteurs
          </Button>
          <Button
            onClick={scrollToContact}
            variant="outline"
            className="bg-gray-800 text-white hover:bg-blue-700 hover:text-white px-8 py-4 text-lg font-semibold transition-all"
          >
            Nous contacter
          </Button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="text-white text-2xl" />
      </div>
    </section>
  );
}
