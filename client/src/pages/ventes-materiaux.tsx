import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ShoppingCart } from "lucide-react";
import React, { useEffect, useState } from "react";

// Import des images soldMat
const soldMatGlob = import.meta.glob('@/assets/soldMat*.{jpg,jpeg,png,webp}', { eager: true });
const soldMatImages: string[] = Object.values(soldMatGlob).map((mod: any) => mod.default);

// Carousel simple
function ImageCarousel({ images, title }: { images: string[]; title: string }) {
  const [index, setIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  if (!images || images.length === 0) return null;
  const prev = () => setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  return (
    <>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}>
        {images.map((img, idx) => (
          <div
            key={idx}
            style={{
              width: "8rem",
              height: "8rem",
              margin: "0 0.5rem",
              backgroundImage: `url(${img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: "0.5rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              cursor: "pointer",
              border: idx === index ? "2px solid #2563eb" : "2px solid transparent"
            }}
            title={title}
            onClick={() => { setIndex(idx); setModalOpen(true); }}
          ></div>
        ))}
      </div>
      {modalOpen && (
        <div
          onClick={() => setModalOpen(false)}
          style={{
            position: "fixed",
            zIndex: 50,
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "zoom-out"
          }}
        >
          <div style={{ position: "relative" }}>
            <img
              src={images[index]}
              alt={title}
              style={{
                maxWidth: "90vw",
                maxHeight: "90vh",
                borderRadius: "0.75rem",
                boxShadow: "0 4px 32px rgba(0,0,0,0.3)",
                background: "#fff"
              }}
              onClick={e => e.stopPropagation()}
            />
            {images.length > 1 && (
              <div style={{
                position: "absolute",
                top: "50%",
                left: 0,
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                transform: "translateY(-50%)"
              }}>
                <button onClick={e => { e.stopPropagation(); prev(); }} style={{
                  background: "rgba(255,255,255,0.8)",
                  border: "none",
                  borderRadius: "9999px",
                  width: "2.5rem",
                  height: "2.5rem",
                  fontSize: "2rem",
                  cursor: "pointer",
                  marginLeft: "0.5rem"
                }} aria-label="Précédent">‹</button>
                <button onClick={e => { e.stopPropagation(); next(); }} style={{
                  background: "rgba(255,255,255,0.8)",
                  border: "none",
                  borderRadius: "9999px",
                  width: "2.5rem",
                  height: "2.5rem",
                  fontSize: "2rem",
                  cursor: "pointer",
                  marginRight: "0.5rem"
                }} aria-label="Suivant">›</button>
              </div>
            )}
            <span style={{
              position: "absolute",
              bottom: "1rem",
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: "1rem",
              color: "#fff",
              background: "rgba(0,0,0,0.5)",
              padding: "0.2rem 1rem",
              borderRadius: "9999px"
            }}>{index + 1} / {images.length}</span>
          </div>
        </div>
      )}
    </>
  );
}

export default function VentesMateriaux() {
  // Ajout récupération projets secteur Ventes de matériaux
  const [dbProjects, setDbProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/projects");
        if (!res.ok) throw new Error("Erreur serveur");
        const data = await res.json();
        const filtered = data.filter((p: any) => p.sector === "Ventes de matériaux");
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
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-materiaux/10 rounded-full mb-4">
                <ShoppingCart className="text-materiaux text-2xl" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Vente de Matériaux
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Découvrez notre large gamme de matériaux de construction et fournitures pour tous vos projets, avec conseils personnalisés et livraison rapide.
              </p>
            </div>
            {/* Carousel d'images soldMat */}
            <ImageCarousel images={soldMatImages} title="Matériaux en vente" />
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Nos Produits</h2>
                <ul className="list-disc pl-5 text-gray-700 space-y-2">
                  <li>Matériaux de construction (ciment, sable, briques...)</li>
                  <li>Fournitures électriques et plomberie</li>
                  <li>Peintures, revêtements, carrelages</li>
                  <li>Outils et accessoires</li>
                </ul>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Services associés</h2>
                <ul className="list-disc pl-5 text-gray-700 space-y-2">
                  <li>Conseil technique personnalisé</li>
                  <li>Livraison sur chantier</li>
                  <li>Devis rapide</li>
                  <li>Particuliers et professionnels</li>
                </ul>
              </div>
            </div>
            {/* Projects Gallery - Ventes de matériaux */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                Projets de ventes de matériaux
              </h2>
              {loading ? (
                <div className="text-center text-gray-500 py-8">Chargement des projets...</div>
              ) : error ? (
                <div className="text-center text-red-500 py-8">{error}</div>
              ) : dbProjects.length === 0 ? (
                <div className="text-center text-gray-500 py-8">Aucun projet trouvé.</div>
              ) : (
                <div className="grid md:grid-cols-3 gap-6">
                  {dbProjects.map((project: any, idx: number) => (
                    <div key={idx} className="overflow-hidden rounded-lg shadow-lg bg-white">
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
                      <div className="p-6">
                        <h3 className="font-bold text-gray-900 mb-2">{project.project_name}</h3>
                        <p className="text-gray-700 mb-1">{project.description}</p>
                        {project.address && (
                          <p className="text-gray-500 text-sm mb-1">{project.address}</p>
                        )}
                        <p className="text-gray-500 text-sm">{project.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-12 text-center">
              <a
                href="mailto:contact@kaskisalu.com"
                className="inline-block bg-materiaux text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-materiaux/90 transition"
              >
                Demander un devis
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
