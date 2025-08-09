import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Beef, Rabbit, Heart } from "lucide-react";

export default function Elevage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-elevage/10 rounded-full mb-4">
                <Beef className="text-elevage text-2xl" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Élevage</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Élevage responsable privilégiant le bien-être animal et la qualité
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-16">
              <Card className="shadow-lg text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-elevage/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Beef className="text-elevage text-2xl" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">Élevage Bovin</h2>
                  <p className="text-gray-600 mb-4">Troupeau de race pure avec suivi vétérinaire professionnel</p>
                  <div className="text-2xl font-bold text-elevage">200+</div>
                  <div className="text-sm text-gray-500">Têtes de bétail</div>
                </CardContent>
              </Card>

              <Card className="shadow-lg text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-elevage/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Rabbit className="text-elevage text-2xl" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">Élevage Ovin</h2>
                  <p className="text-gray-600 mb-4">Moutons élevés en pâturage naturel pour viande et laine</p>
                  <div className="text-2xl font-bold text-elevage">150+</div>
                  <div className="text-sm text-gray-500">Moutons</div>
                </CardContent>
              </Card>

              <Card className="shadow-lg text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-elevage/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="text-elevage text-2xl" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">Bien-être Animal</h2>
                  <p className="text-gray-600 mb-4">Standards élevés de soins et d'alimentation naturelle</p>
                  <div className="text-2xl font-bold text-elevage">100%</div>
                  <div className="text-sm text-gray-500">Éthique</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div
                  className="h-64 rounded-lg shadow-lg mb-4 bg-cover bg-center bg-elevage-1"
                ></div>
                <div
                  className="h-32 rounded-lg shadow-lg bg-cover bg-center bg-elevage-2"
                ></div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Notre Approche</h2>
                <div className="space-y-6">
                  <div className="border-l-4 border-elevage pl-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Alimentation Naturelle</h3>
                    <p className="text-gray-600">Fourrages de qualité et compléments naturels pour une croissance saine</p>
                  </div>
                  <div className="border-l-4 border-elevage pl-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Suivi Vétérinaire</h3>
                    <p className="text-gray-600">Contrôles réguliers et programme de prévention adapté</p>
                  </div>
                  <div className="border-l-4 border-elevage pl-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Conditions d'Élevage</h3>
                    <p className="text-gray-600">Espaces généreux et environnement respectueux du comportement animal</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
        </section>
      </main>
      <Footer />
    </div>
  );
}
