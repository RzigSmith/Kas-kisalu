import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Handshake, Star, Leaf } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">À Propos de MultiGroup</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Une entreprise familiale devenue leader multi-sectoriel grâce à l'expertise et l'innovation
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Notre Histoire</h2>
                <p className="text-gray-600 mb-4">
                  Fondée en 1995, MultiGroup a débuté comme une petite entreprise de construction avant de diversifier ses activités vers l'agriculture, l'élevage et le transport. Cette expansion naturelle répond aux besoins complémentaires de nos clients et de notre région.
                </p>
                <p className="text-gray-600 mb-6">
                  Aujourd'hui, nous sommes fiers d'être un acteur majeur dans ces quatre secteurs, alliant tradition et modernité pour offrir des services de qualité supérieure.
                </p>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-white rounded-lg shadow">
                    <div className="text-2xl font-bold text-primary">28+</div>
                    <div className="text-sm text-gray-600">Années d'expérience</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow">
                    <div className="text-2xl font-bold text-primary">150+</div>
                    <div className="text-sm text-gray-600">Employés</div>
                  </div>
                </div>
              </div>
              <div>
                <div
                  className="h-80 rounded-lg shadow-lg bg-cover bg-center"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500')"
                  }}
                ></div>
              </div>
            </div>

            {/* Values Section */}
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center p-6 shadow-lg">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Handshake className="text-primary text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Confiance</h3>
                  <p className="text-gray-600">Relations durables basées sur la transparence et la fiabilité</p>
                </CardContent>
              </Card>
              <Card className="text-center p-6 shadow-lg">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="text-secondary text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Excellence</h3>
                  <p className="text-gray-600">Standards de qualité élevés dans tous nos domaines d'activité</p>
                </CardContent>
              </Card>
              <Card className="text-center p-6 shadow-lg">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Leaf className="text-accent text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Durabilité</h3>
                  <p className="text-gray-600">Pratiques respectueuses de l'environnement et responsables</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
