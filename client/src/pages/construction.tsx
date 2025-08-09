import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { HardHat, Check } from "lucide-react";

// Import dynamique des images realisations et maquettes
function importAll(r: __WebpackModuleApi.RequireContext) {
  return r.keys().map(r);
}
const realisationsImages: string[] = importAll(
  require.context("@/assets", false, /^\.\/realisations.*\.(jpg|jpeg|png|webp)$/)
);
const maquetteImages: string[] = importAll(
  require.context("@/assets", false, /^\.\/maquette.*\.(jpg|jpeg|png|webp)$/)
);

const projects = [
  {
    name: "Centre d'Affaires Moderne",
    description: "Immeuble de bureaux de 8 étages avec espaces commerciaux",
    year: "2023",
    status: "Terminé",
    image:
      "https://images.unsplash.com/photo-1445116572660-236099ec97a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
  },
  {
    name: "Résidence Les Jardins",
    description: "Complexe résidentiel de 50 appartements avec jardins",
    year: "2023",
    status: "En cours",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
  },
  {
    name: "Entrepôt Logistique",
    description: "Installation industrielle de 5000m² avec quais de chargement",
    year: "2022",
    status: "Terminé",
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
  },
];

export default function Construction() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-construction/10 rounded-full mb-4">
                <HardHat className="text-construction text-2xl" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Construction
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Des projets de construction menés avec expertise technique et
                respect des délais
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Notre Expertise
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-construction/10 rounded-full flex items-center justify-center">
                      <Check className="text-construction text-sm" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Construction Résidentielle
                      </h3>
                      <p className="text-gray-600">
                        Maisons individuelles, appartements et complexes
                        résidentiels
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-construction/10 rounded-full flex items-center justify-center">
                      <Check className="text-construction text-sm" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Bâtiments Commerciaux
                      </h3>
                      <p className="text-gray-600">
                        Bureaux, centres commerciaux et installations
                        industrielles
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-construction/10 rounded-full flex items-center justify-center">
                      <Check className="text-construction text-sm" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Rénovation & Extension
                      </h3>
                      <p className="text-gray-600">
                        Modernisation et agrandissement de bâtiments existants
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div
                  className="h-48 rounded-lg shadow-lg bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300')",
                  }}
                ></div>
                <div
                  className="h-48 rounded-lg shadow-lg bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300')",
                  }}
                ></div>
                <div
                  className="h-48 rounded-lg shadow-lg col-span-2 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300')",
                  }}
                ></div>
              </div>
            </div>

            {/* Section Maquettes */}
            {maquetteImages.length > 0 && (
              <div className="mb-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                  Nos Maquettes
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {maquetteImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="h-48 rounded-lg shadow-lg bg-cover bg-center"
                      style={{ backgroundImage: `url(${img})` }}
                      title={`Maquette ${idx + 1}`}
                    ></div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects Gallery */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                Nos Réalisations
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {/* Images realisations depuis assets */}
                {realisationsImages.map((img, idx) => (
                  <Card
                    key={idx}
                    className="overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    <div
                      className="h-48 bg-cover bg-center"
                      style={{ backgroundImage: `url(${img})` }}
                      title={`Réalisation ${idx + 1}`}
                    ></div>
                    <CardContent className="p-6">
                      <h3 className="font-bold text-gray-900 mb-2">
                        Réalisation {idx + 1}
                      </h3>
                    </CardContent>
                  </Card>
                ))}
                {/* ...existing code for projects if you want to keep them... */}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
