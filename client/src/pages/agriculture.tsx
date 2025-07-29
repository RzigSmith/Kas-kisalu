import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Sprout, Wheat, Leaf, Cog } from "lucide-react";

export default function Agriculture() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-agriculture/10 rounded-full mb-4">
                <Sprout className="text-agriculture text-2xl" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Agriculture</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Agriculture moderne et durable avec technologies de pointe
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <div className="order-2 lg:order-1">
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className="h-48 rounded-lg shadow-lg col-span-2 bg-cover bg-center"
                    style={{
                      backgroundImage: "url('https://images.unsplash.com/photo-1560493676-04071c5f467b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300')"
                    }}
                  ></div>
                  <div
                    className="h-48 rounded-lg shadow-lg bg-cover bg-center"
                    style={{
                      backgroundImage: "url('https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300')"
                    }}
                  ></div>
                  <div
                    className="h-48 rounded-lg shadow-lg bg-cover bg-center"
                    style={{
                      backgroundImage: "url('https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300')"
                    }}
                  ></div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Nos Services Agricoles</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-agriculture/10 rounded-full flex items-center justify-center">
                      <Wheat className="text-agriculture text-sm" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Cultures Céréalières</h3>
                      <p className="text-gray-600">Production de blé, maïs, orge avec rendements optimisés</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-agriculture/10 rounded-full flex items-center justify-center">
                      <Leaf className="text-agriculture text-sm" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Agriculture Biologique</h3>
                      <p className="text-gray-600">Pratiques durables sans pesticides chimiques</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-agriculture/10 rounded-full flex items-center justify-center">
                      <Cog className="text-agriculture text-sm" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Technologies Modernes</h3>
                      <p className="text-gray-600">Équipements de précision et agriculture connectée</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-agriculture/5 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-3">Statistiques 2023</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-agriculture">500+</div>
                      <div className="text-sm text-gray-600">Hectares cultivés</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-agriculture">15%</div>
                      <div className="text-sm text-gray-600">Augmentation rendement</div>
                    </div>
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
