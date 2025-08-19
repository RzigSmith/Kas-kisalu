import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Truck, Package, Zap, Route, TruckIcon, Warehouse } from "lucide-react";
import React, { useEffect, useState } from "react";


export default function Transport() {
  // Ajout récupération projets secteur Transport
  const [dbProjects, setDbProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/projects");
        if (!res.ok) throw new Error("Erreur serveur");
        const data = await res.json();
        const filtered = data.filter((p: any) => p.sector === "Transport");
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
              <div className="inline-flex items-center justify-center w-16 h-16 bg-transport/10 rounded-full mb-4">
                <Truck className="text-transport text-2xl" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Transport & Logistique
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Solutions complètes de transport avec flotte moderne et service
                fiable
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Nos Services Transport
                </h2>
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  <Card className="p-4">
                    <CardContent className="p-0">
                      <Truck className="text-transport text-xl mb-2" />
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Transport Routier
                      </h3>
                      <p className="text-sm text-gray-600">
                        Livraisons régionales et nationales
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="p-4">
                    <CardContent className="p-0">
                      <Package className="text-transport text-xl mb-2" />
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Logistique
                      </h3>
                      <p className="text-sm text-gray-600">
                        Stockage et distribution
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="p-4">
                    <CardContent className="p-0">
                      <Zap className="text-transport text-xl mb-2" />
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Express
                      </h3>
                      <p className="text-sm text-gray-600">
                        Livraisons urgentes 24h
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="p-4">
                    <CardContent className="p-0">
                      <Route className="text-transport text-xl mb-2" />
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Suivi GPS
                      </h3>
                      <p className="text-sm text-gray-600">
                        Traçabilité en temps réel
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-transport/5 p-6 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-4">
                    Performance 2023
                  </h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-xl font-bold text-transport">5000+</div>
                      <div className="text-xs text-gray-600">Livraisons</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-transport">98%</div>
                      <div className="text-xs text-gray-600">À l'heure</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-transport">4.9/5</div>
                      <div className="text-xs text-gray-600">Satisfaction</div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div
                  className="h-48 rounded-lg shadow-lg mb-4 bg-cover bg-center bg-transport-1"
                ></div>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className="h-32 rounded-lg shadow-lg bg-cover bg-center bg-transport-2"
                  ></div>
                  <div
                    className="h-32 rounded-lg shadow-lg bg-cover bg-center bg-transport-3"
                  ></div>
                </div>
              </div>
            </div>

            {/* Fleet Information */}
            <div className="bg-gray-50 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                Notre Flotte
              </h2>
              <div className="grid md:grid-cols-4 gap-6 text-center">
                <div>
                  <Truck className="text-3xl text-transport mb-3 mx-auto" />
                  <div className="text-2xl font-bold text-gray-900">25</div>
                  <div className="text-sm text-gray-600">Camions</div>
                </div>
                <div>
                  <TruckIcon className="text-3xl text-transport mb-3 mx-auto" />
                  <div className="text-2xl font-bold text-gray-900">15</div>
                  <div className="text-sm text-gray-600">Semi-remorques</div>
                </div>
                <div>
                  <Package className="text-3xl text-transport mb-3 mx-auto" />
                  <div className="text-2xl font-bold text-gray-900">10</div>
                  <div className="text-sm text-gray-600">Fourgonnettes</div>
                </div>
                <div>
                  <Warehouse className="text-3xl text-transport mb-3 mx-auto" />
                  <div className="text-2xl font-bold text-gray-900">3</div>
                  <div className="text-sm text-gray-600">Entrepôts</div>
                </div>
              </div>
            </div>

            {/* Projects Gallery - Transport */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                Projets de transport
              </h2>
              {loading ? (
                <div className="text-center text-gray-500 py-8">
                  Chargement des projets...
                </div>
              ) : error ? (
                <div className="text-center text-red-500 py-8">{error}</div>
              ) : dbProjects.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  Aucun projet de transport trouvé.
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-6">
                  {dbProjects.map((project: any, idx: number) => (
                    <Card
                      key={idx}
                      className="overflow-hidden hover:shadow-xl transition-shadow col-span-1"
                    >
                      {project.project_images && project.project_images.length > 0 ? (
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
                      <CardContent className="p-6">
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
                        <p className="text-gray-500 text-sm">{project.status}</p>
                      </CardContent>
                    </Card>
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