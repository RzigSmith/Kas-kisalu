import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Building2 } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function Immobilier() {
  // Ajout récupération projets secteur Immobilier
  const [dbProjects, setDbProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/projects");
        if (!res.ok) throw new Error("Erreur serveur");
        const data = await res.json();
        const filtered = data.filter((p: any) => p.sector === "Immobilier");
        const parsed = filtered.map((p: any) => ({
          ...p,
          project_images:
            typeof p.project_images === "string"
              ? JSON.parse(p.project_images)
              : Array.isArray(p.project_images)
              ? p.project_images
              : [],
        }));
        setDbProjects(parsed);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Erreur lors de la récupération des projets");
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

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
                Découvrez nos services immobiliers : vente, location, gestion et
                conseil pour tous vos projets résidentiels et commerciaux.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Nos Services
                </h2>
                <ul className="list-disc pl-5 text-gray-700 space-y-2">
                  <li>Vente de maisons, appartements et terrains</li>
                  <li>Location de biens résidentiels et commerciaux</li>
                  <li>Gestion locative et administrative</li>
                  <li>Conseil en investissement immobilier</li>
                </ul>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Pourquoi choisir Kas Kisalu ?
                </h2>
                <ul className="list-disc pl-5 text-gray-700 space-y-2">
                  <li>Accompagnement personnalisé</li>
                  <li>Réseau local et expertise du marché</li>
                  <li>Transparence et sécurité des transactions</li>
                  <li>Solutions adaptées à chaque besoin</li>
                </ul>
              </div>
            </div>
            {/* Projects Gallery - Immobilier */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                Projets immobiliers
              </h2>
              {loading ? (
                <div className="text-center text-gray-500 py-8">
                  Chargement des projets...
                </div>
              ) : error ? (
                <div className="text-center text-red-500 py-8">{error}</div>
              ) : dbProjects.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  Aucun projet immobilier trouvé.
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-6">
                  {dbProjects.map((project: any, idx: number) => (
                    <div
                      key={idx}
                      className="overflow-hidden rounded-lg shadow-lg bg-white"
                    >
                      {project.project_images &&
                      project.project_images.length > 0 ? (
                        <div
                          className="h-48 bg-cover bg-center"
                          style={{
                    backgroundImage: `url(${
                              project.project_images[0].startsWith("/uploads/")
                                ? `http://0.0.0.0:5000${project.project_images[0].replace(/\\/g, "/")}`
                                : project.project_images[0]
                            })`,
                          }}
                          title={project.project_name}
                        ></div>
                      ) : null}
                      <div className="p-6">
                        <h3 className="font-bold text-gray-900 mb-2">
                          {project.project_name}
                        </h3>
                        <p className="text-gray-700 mb-1">
                          {project.description}
                        </p>
                        {project.address && (
                          <p className="text-gray-500 text-sm mb-1">
                            {project.address}
                          </p>
                        )}
                        <p className="text-gray-500 text-sm">
                          {project.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
