import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { HardHat, Check } from "lucide-react";
import React, { useState, useEffect } from "react";
import styles from "./construction.module.css";

// const realisationsGlob = import.meta.glob('@/assets/realisations*.{jpg,jpeg,png,webp}', { eager: true });
// const realisationsImages: string[] = Object.values(realisationsGlob).map((mod: any) => mod.default);

const maquetteGlob = import.meta.glob('@/assets/maquette*.{jpg,jpeg,png,webp}', { eager: true });
const maquetteImages: string[] = Object.values(maquetteGlob).map((mod: any) => mod.default);

const mwekaGlob = import.meta.glob('@/assets/mweka*.{jpg,jpeg,png,webp}', { eager: true });
const mwekaImages: string[] = Object.values(mwekaGlob).map((mod: any) => mod.default);

const carreauxGlob = import.meta.glob('@/assets/carreaux*.{jpg,jpeg,png,webp}', { eager: true });
const carreauxImages: string[] = Object.values(carreauxGlob).map((mod: any) => mod.default);

const yangambiGlob = import.meta.glob('@/assets/yangambi*.{jpg,jpeg,png,webp}', { eager: true });
const yangambiImages: string[] = Object.values(yangambiGlob).map((mod: any) => mod.default);

const cartoumeGlob = import.meta.glob('@/assets/cartoume*.{jpg,jpeg,png,webp}', { eager: true });
const cartoumeImages: string[] = Object.values(cartoumeGlob).map((mod: any) => mod.default);

const decoIntLingwalaGlob = import.meta.glob('@/assets/decoIntLingwala*.{jpg,jpeg,png,webp}', { eager: true });
const decoIntLingwalaImages: string[] = Object.values(decoIntLingwalaGlob).map((mod: any) => mod.default);

const renovCampGlob = import.meta.glob('@/assets/renovCamp*.{jpg,jpeg,png,webp}', { eager: true });
const renovCampImages: string[] = Object.values(renovCampGlob).map((mod: any) => mod.default);

const kabHuiGlob = import.meta.glob('@/assets/kabHui*.{jpg,jpeg,png,webp}', { eager: true });
const kabHuiImages: string[] = Object.values(kabHuiGlob).map((mod: any) => mod.default);

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
  {
    name: "Construction d’un immeuble R+4",
    description: "École primaire et secondaire PPISG dans la commune de Lingwala / Mweka.",
    year: "2024",
    status: "En cours",
    images: mwekaImages,
  },
  {
    name: "Construction d’un immeuble appartement R+3",
    description: "Dans la commune de Ngaliema / Quartier carreaux Congo.",
    year: "2024",
    status: "En cours",
    images: carreauxImages,
  },
  {
    name: "Construction d’un immeuble appartement R+2",
    description: "Dans la commune de Ngiringiri / Quartier yangambi.",
    year: "2024",
    status: "En cours",
    images: yangambiImages,
  },
  {
    name: "Construction d’un immeuble appartement R+3",
    description: "Commune de Ngiringiri / cartoume.",
    year: "2024",
    status: "En cours",
    images: cartoumeImages,
  },
  {
    name: "Décoration intérieure d’une maison à lingwala",
    description: "Décoration intérieure d’une maison à lingwala.",
    year: "2024",
    status: "Terminé",
    images: decoIntLingwalaImages,
  },
  {
    name: "Rénovation d’un appartement",
    description: "Rénovation d’un appartement dans la commune de Ngaliema / Ma campagne.",
    year: "2024",
    status: "Terminé",
    images: renovCampImages,
  },
  {
    name: "Construction d’un immeuble R+10",
    description: "Dans la commune de Lingwala / kabinda huilerie.",
    year: "2024",
    status: "En cours",
    images: kabHuiImages,
  },
];

// Carousel component (minimal, no external lib)
function ImageCarousel({ images, title }: { images: string[]; title: string }) {
  const [index, setIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<boolean[]>([]);
  
  useEffect(() => {
    if (images && images.length > 0) {
      // Vérifier quelles images se chargent correctement
      const checkImages = images.map((src, i) => {
        return new Promise<boolean>((resolve) => {
          const img = new Image();
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
          img.src = src;
        });
      });
      
      Promise.all(checkImages).then(results => {
        setLoadedImages(results);
        // Si l'image actuelle ne se charge pas, passer à la première qui se charge
        if (!results[index]) {
          const firstLoaded = results.findIndex(loaded => loaded);
          if (firstLoaded !== -1) {
            setIndex(firstLoaded);
          }
        }
      });
    }
  }, [images, index]);

  if (!images || images.length === 0) return null;
  
  // Filtrer pour ne montrer que les images qui se chargent
  const validImages = images.filter((_, i) => loadedImages[i]);
  if (validImages.length === 0 && loadedImages.length > 0) {
    return (
      <div className={styles.carouselContainer}>
        <div className={styles.carouselImage} style={{ 
          backgroundColor: '#f3f4f6', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: '#6b7280'
        }}>
          Image non disponible
        </div>
      </div>
    );
  }
  
  const prev = () => setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  
  return (
    <div className={styles.carouselContainer}>
      <div 
        className={styles.carouselImage} 
        style={{ backgroundImage: `url(${images[index]})` }} 
        title={title}
        onError={(e) => {
          // Si l'image échoue à charger, passer à la suivante
          const nextValidIndex = images.findIndex((_, i) => i > index && loadedImages[i]);
          if (nextValidIndex !== -1) {
            setIndex(nextValidIndex);
          }
        }}
      ></div>
      {images.length > 1 && (
        <div className={styles.carouselControls}>
          <button onClick={prev} className={styles.carouselBtn} aria-label="Précédent">‹</button>
          <span className={styles.carouselIndicator}>{index + 1} / {images.length}</span>
          <button onClick={next} className={styles.carouselBtn} aria-label="Suivant">›</button>
        </div>
      )}
    </div>
  );
}

export default function Construction() {
  const [dbProjects, setDbProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        // Utilise l'API proxy de Vite pour la cohérence
        const res = await fetch("/projects");
        if (!res.ok) throw new Error("Erreur serveur");
        const data = await res.json();
        // Filtre sur sector = "Construction"
        const filtered = data.filter((p: any) => p.sector === "Construction");
        // Parse project_images si c'est une string
        const parsed = filtered.map((p: any) => ({
          ...p,
          project_images: typeof p.project_images === "string"
            ? JSON.parse(p.project_images)
            : Array.isArray(p.project_images)
              ? p.project_images
              : []
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
                        Maisons individuelles, appartements et complexes résidentiels
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
                        Bureaux, centres commerciaux et installations industrielles
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
                <div className="h-48 rounded-lg shadow-lg bg-cover bg-center bg-construction-1"></div>
                <div className="h-48 rounded-lg shadow-lg bg-cover bg-center bg-construction-2"></div>
                <div className="h-48 rounded-lg shadow-lg col-span-2 bg-cover bg-center bg-construction-3"></div>
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
                      className={styles.bgImage}
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
              {loading ? (
                <div className="text-center text-gray-500 py-8">Chargement des projets...</div>
              ) : error ? (
                <div className="text-center text-red-500 py-8">{error}</div>
              ) : dbProjects.length === 0 ? (
                <div className="text-center text-gray-500 py-8">Aucun projet de construction trouvé.</div>
              ) : (
                <div className="grid md:grid-cols-3 gap-6">
                  {dbProjects.map((project: any, idx: number) => (
                    <Card key={idx} className="overflow-hidden hover:shadow-xl transition-shadow col-span-1">
                      {/* Images du projet */}
                      {project.project_images && project.project_images.length > 0 ? (
                        project.project_images.length > 1 ? (
                          <ImageCarousel
                            images={project.project_images.map((img: string) =>
                              img.startsWith("/uploads/")
                                ? img.replace(/\\/g, "/")
                                : img
                            )}
                            title={project.project_name}
                          />
                        ) : (
                          <div
                            className={styles.bgImage}
                            style={{
                              backgroundImage: `url(${
                                project.project_images[0].startsWith("/uploads/")
                                  ? project.project_images[0].replace(/\\/g, "/")
                                  : project.project_images[0]
                              })`
                            }}
                            title={project.project_name}
                          ></div>
                        )
                      ) : null}
                      <CardContent className="p-6">
                        <h3 className="font-bold text-gray-900 mb-2">{project.project_name}</h3>
                        <p className="text-gray-700 mb-1">{project.description}</p>
                        {project.address && (
                          <p className="text-gray-500 text-sm mb-1">{project.address}</p>
                        )}
                        <p className="text-gray-500 text-sm">{project.status}</p>
                      </CardContent>
                    </Card>
                  ))}
                  {/* Projet Mweka avec carousel */}
                  <Card className="overflow-hidden hover:shadow-xl transition-shadow col-span-1">
                    <ImageCarousel images={mwekaImages} title="Projet Mweka" />
                    <CardContent className="p-6">
                      <h3 className="font-bold text-gray-900 mb-2">
                        Construction d’un immeuble R+4
                      </h3>
                      <p className="text-gray-700 mb-1">
                        École primaire et secondaire PPISG
                      </p>
                      <p className="text-gray-500 text-sm">
                        Commune de Lingwala / Mweka, 2024 – En cours
                      </p>
                    </CardContent>
                  </Card>
                  {/* Projet Carreaux avec carousel */}
                  <Card className="overflow-hidden hover:shadow-xl transition-shadow col-span-1">
                    <ImageCarousel images={carreauxImages} title="Projet Carreaux" />
                    <CardContent className="p-6">
                      <h3 className="font-bold text-gray-900 mb-2">
                        Construction d’un immeuble appartement R+3
                      </h3>
                      <p className="text-gray-700 mb-1">
                        Quartier carreaux Congo
                      </p>
                      <p className="text-gray-500 text-sm">
                        Commune de Ngaliema, 2024 – En cours
                      </p>
                    </CardContent>
                  </Card>
                  {/* Projet Yangambi avec carousel */}
                  <Card className="overflow-hidden hover:shadow-xl transition-shadow col-span-1">
                    <ImageCarousel images={yangambiImages} title="Projet Yangambi" />
                    <CardContent className="p-6">
                      <h3 className="font-bold text-gray-900 mb-2">
                        Construction d’un immeuble appartement R+2
                      </h3>
                      <p className="text-gray-700 mb-1">
                        Quartier yangambi
                      </p>
                      <p className="text-gray-500 text-sm">
                        Commune de Ngiringiri, 2024 – En cours
                      </p>
                    </CardContent>
                  </Card>
                  {/* Projet Cartoume avec carousel */}
                  <Card className="overflow-hidden hover:shadow-xl transition-shadow col-span-1">
                    <ImageCarousel images={cartoumeImages} title="Projet Cartoume" />
                    <CardContent className="p-6">
                      <h3 className="font-bold text-gray-900 mb-2">
                        Construction d’un immeuble appartement R+3
                      </h3>
                      <p className="text-gray-700 mb-1">
                        Quartier cartoume
                      </p>
                      <p className="text-gray-500 text-sm">
                        Commune de Ngiringiri, 2024 – En cours
                      </p>
                    </CardContent>
                  </Card>
                  {/* Projet Décoration intérieure Lingwala avec carousel */}
                  <Card className="overflow-hidden hover:shadow-xl transition-shadow col-span-1">
                    <ImageCarousel images={decoIntLingwalaImages} title="Décoration intérieure Lingwala" />
                    <CardContent className="p-6">
                      <h3 className="font-bold text-gray-900 mb-2">
                        Décoration intérieure d’une maison à lingwala
                      </h3>
                      <p className="text-gray-700 mb-1">
                        Maison à Lingwala
                      </p>
                      <p className="text-gray-500 text-sm">
                        2024 – Terminé
                      </p>
                    </CardContent>
                  </Card>
                  {/* Projet Rénovation Ma Campagne avec carousel */}
                  <Card className="overflow-hidden hover:shadow-xl transition-shadow col-span-1">
                    <ImageCarousel images={renovCampImages} title="Rénovation Ma Campagne" />
                    <CardContent className="p-6">
                      <h3 className="font-bold text-gray-900 mb-2">
                        Rénovation d’un appartement
                      </h3>
                      <p className="text-gray-700 mb-1">
                        Ma campagne, Ngaliema
                      </p>
                      <p className="text-gray-500 text-sm">
                        2024 – Terminé
                      </p>
                    </CardContent>
                  </Card>
                  {/* Projet Kabinda Huilerie avec carousel */}
                  <Card className="overflow-hidden hover:shadow-xl transition-shadow col-span-1">
                    <ImageCarousel images={kabHuiImages} title="Projet Kabinda Huilerie" />
                    <CardContent className="p-6">
                      <h3 className="font-bold text-gray-900 mb-2">
                        Construction d’un immeuble R+10
                      </h3>
                      <p className="text-gray-700 mb-1">
                        Kabinda huilerie
                      </p>
                      <p className="text-gray-500 text-sm">
                        Commune de Lingwala, 2024 – En cours
                      </p>
                    </CardContent>
                  </Card>
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