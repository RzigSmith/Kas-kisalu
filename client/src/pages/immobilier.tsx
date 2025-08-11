import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Building2 } from "lucide-react";

export default function Immobilier() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-immobilier/10 rounded-full mb-4">
                <Building2 className="text-immobilier text-2xl" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Immobilier
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Découvrez nos services immobiliers : vente, location, gestion et conseil pour tous vos projets résidentiels et commerciaux.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Nos Services</h2>
                <ul className="list-disc pl-5 text-gray-700 space-y-2">
                  <li>Vente de maisons, appartements et terrains</li>
                  <li>Location de biens résidentiels et commerciaux</li>
                  <li>Gestion locative et administrative</li>
                  <li>Conseil en investissement immobilier</li>
                </ul>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Pourquoi choisir Kas Kisalu ?</h2>
                <ul className="list-disc pl-5 text-gray-700 space-y-2">
                  <li>Accompagnement personnalisé</li>
                  <li>Réseau local et expertise du marché</li>
                  <li>Transparence et sécurité des transactions</li>
                  <li>Solutions adaptées à chaque besoin</li>
                </ul>
              </div>
            </div>
            <div className="mt-12 text-center">
              <a
                href="mailto:contact@kaskisalu.com"
                className="inline-block bg-immobilier text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-immobilier/90 transition"
              >
                Nous contacter
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
