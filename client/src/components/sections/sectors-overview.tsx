import { Card, CardContent } from "@/components/ui/card";
import { HardHat, Sprout, Beef, Truck, ArrowRight } from "lucide-react";
import { Link } from "wouter";

const sectors = [
  {
    id: "construction",
    title: "Construction",
    icon: HardHat,
    color: "construction",
    description: "Réalisations de projets de construction résidentielle et commerciale avec expertise technique.",
    services: [
      "Projets résidentiels",
      "Bâtiments commerciaux", 
      "Rénovations",
      "Infrastructure"
    ],
    image: "https://pixabay.com/get/ge9fa8503e2e55e301c976e6e3ca9db141e4c5c1a2f6f38677d48a8ba4c7cbf399f54027a22f4f3b8baac213ade7ae668c795b03b8d299cbd37c65c7fb0bad4f0_1280.jpg",
    href: "/construction"
  },
  {
    id: "agriculture",
    title: "Agriculture", 
    icon: Sprout,
    color: "agriculture",
    description: "Services agricoles complets avec technologies modernes et pratiques durables.",
    services: [
      "Cultures céréalières",
      "Agriculture bio",
      "Conseil technique",
      "Équipements modernes"
    ],
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    href: "/agriculture"
  },
  {
    id: "elevage",
    title: "Élevage",
    icon: Beef,
    color: "elevage", 
    description: "Élevage professionnel avec standards de qualité élevés et bien-être animal.",
    services: [
      "Élevage bovin",
      "Élevage ovin",
      "Bien-être animal",
      "Production durable"
    ],
    image: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    href: "/elevage"
  },
  {
    id: "transport",
    title: "Transport",
    icon: Truck,
    color: "transport",
    description: "Solutions logistiques complètes avec flotte moderne et service fiable.",
    services: [
      "Transport routier",
      "Logistique", 
      "Livraisons express",
      "Flotte moderne"
    ],
    image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    href: "/transport"
  }
];

export function SectorsOverview() {
  return (
    <section id="nos-secteurs" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Nos Domaines d'Expertise</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Quatre secteurs d'activité complémentaires pour répondre à tous vos besoins professionnels
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {sectors.map((sector) => {
            const IconComponent = sector.icon;
            return (
              <Card 
                key={sector.id}
                className={`group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-${sector.color}`}
              >
                <div
                  className="h-48 bg-cover bg-center rounded-t-xl"
                  style={{ backgroundImage: `url(${sector.image})` }}
                ></div>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <IconComponent className={`text-${sector.color} text-2xl mr-3`} />
                    <h3 className="text-xl font-bold text-gray-900">{sector.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{sector.description}</p>
                  <ul className="text-sm text-gray-500 space-y-1 mb-6">
                    {sector.services.map((service, index) => (
                      <li key={index}>• {service}</li>
                    ))}
                  </ul>
                  <Link href={sector.href}>
                    <span className={`inline-flex items-center text-${sector.color} font-semibold hover:underline cursor-pointer`}>
                      En savoir plus <ArrowRight className="ml-2 h-4 w-4" />
                    </span>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
