import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Sprout, Wheat, Leaf, Cog } from "lucide-react";
import React, { useEffect, useState } from "react";


// Import dynamique des images agriculture
const agricultureGlob = import.meta.glob(
  "@/assets/agriculture*.{jpg,jpeg,png,webp}",
  { eager: true }
);
const agricultureImages: string[] = Object.values(agricultureGlob).map(
  (mod: any) => mod.default
);

export default function Agriculture() {
  // Ajout récupération projets secteur Agriculture
  const [dbProjects, setDbProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/projects");
        if (!res.ok) throw new Error("Erreur serveur");
        const data = await res.json();
        const filtered = data.filter((p: any) => p.sector === "Agriculture");
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-agriculture/10 rounded-full mb-4">
                <Sprout className="text-agriculture text-2xl" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Agriculture
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Agriculture moderne et durable avec technologies de pointe
              </p>
            </div>

            {/* Galerie d'images agriculture */}
            {agricultureImages.length > 0 && (
              <div className="mb-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                  Galerie de nos activités agricoles
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {agricultureImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="h-48 rounded-lg shadow-lg bg-cover bg-center"
                      style={{ backgroundImage: `url(${img})` }}
                      title={`Agriculture ${idx + 1}`}
                    ></div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <div className="order-2 lg:order-1">
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className="h-48 rounded-lg shadow-lg col-span-2 bg-cover bg-center bg-agriculture-1"
                  ></div>
                  <div
                    className="h-48 rounded-lg shadow-lg bg-cover bg-center bg-agriculture-2"
                  ></div>
                  <div
                    className="h-48 rounded-lg shadow-lg bg-cover bg-center bg-agriculture-3"
                  ></div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Nos Services Agricoles
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-agriculture/10 rounded-full flex items-center justify-center">
                      <Wheat className="text-agriculture text-sm" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Cultures Céréalières
                      </h3>
                      <p className="text-gray-600">
                        Production de blé, maïs, orge avec rendements optimisés
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-agriculture/10 rounded-full flex items-center justify-center">
                      <Leaf className="text-agriculture text-sm" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Agriculture Biologique
                      </h3>
                      <p className="text-gray-600">
                        Pratiques durables sans pesticides chimiques
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-agriculture/10 rounded-full flex items-center justify-center">
                      <Cog className="text-agriculture text-sm" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Technologies Modernes
                      </h3>
                      <p className="text-gray-600">
                        Équipements de précision et agriculture connectée
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-agriculture/5 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-3">
                    Statistiques 2023
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-agriculture">
                        500+
                      </div>
                      <div className="text-sm text-gray-600">
                        Hectares cultivés
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-agriculture">
                        15%
                      </div>
                      <div className="text-sm text-gray-600">
                        Augmentation rendement
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Projects Gallery - Agriculture */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                Projets agricoles
              </h2>
              {loading ? (
                <div className="text-center text-gray-500 py-8">
                  Chargement des projets...
                </div>
              ) : error ? (
                <div className="text-center text-red-500 py-8">{error}</div>
              ) : dbProjects.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  Aucun projet agricole trouvé.
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
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}