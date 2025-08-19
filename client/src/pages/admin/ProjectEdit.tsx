import React, { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Upload, X } from "lucide-react";
import { Link } from "wouter";

type Project = {
  id: number;
  project_name: string;
  description: string | null;
  address: string | null;
  status: string | null;
  project_images?: string[];
  sector: string | null;
};

export default function ProjectEdit() {
  const [match, params] = useRoute("/admin/project-edit/:id");
  const projectId = params?.id ?? sessionStorage.getItem("edit_project_id");
  const [, navigate] = useLocation();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Champs du projet
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("");
  const [sector, setSector] = useState("");
  const [projectImages, setProjectImages] = useState<string[]>([]);

  useEffect(() => {
    if (!projectId) return;
    setLoading(true);
    fetch(`/projects/${projectId}`)
      .then(async res => {
        if (!res.ok) throw new Error("Projet introuvable");
        return res.json();
      })
      .then(data => {
        console.log("Données du projet reçues:", data);
        setProjectName(data.project_name ?? "");
        setDescription(data.description ?? "");
        setAddress(data.address ?? "");
        setStatus(data.status ?? "");
        setSector(data.sector ?? "");
        
        // Gérer les images - elles peuvent être string JSON ou array
        let images = [];
        if (data.project_images) {
          if (typeof data.project_images === 'string') {
            try {
              images = JSON.parse(data.project_images);
            } catch (e) {
              console.error("Erreur parsing images:", e);
              images = [];
            }
          } else if (Array.isArray(data.project_images)) {
            images = data.project_images;
          }
        }
        setProjectImages(Array.isArray(images) ? images : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur chargement projet:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [projectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      const res = await fetch(`/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_name: projectName,
          description,
          address,
          status,
          sector,
          project_images: projectImages
        }),
      });

      if (!res.ok) {
        throw new Error("Erreur lors de la mise à jour");
      }

      setSuccess("Projet mis à jour avec succès !");
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append("images", file);
    });

    try {
      const response = await fetch("/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        if (result.filenames) {
          setProjectImages(prev => [...prev, ...result.filenames]);
        }
      } else {
        setError("Erreur lors du téléchargement des images");
      }
    } catch (error) {
      setError("Erreur de réseau lors du téléchargement");
    }
  };

  const removeImage = (imageToRemove: string) => {
    setProjectImages(prev => prev.filter(img => img !== imageToRemove));
  };

  if (!projectId) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Aucun projet sélectionné</h2>
          <p className="text-gray-600">Veuillez accéder à cette page via le bouton "Éditer" du dashboard.</p>
          <Link href="/admin/dashboard">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour au Dashboard
            </Button>
          </Link>
        </div>
      </AdminLayout>
    );
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Chargement du projet...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Éditer le projet</h1>
            <p className="text-gray-600">Modifiez les informations du projet</p>
          </div>
          <Link href="/admin/dashboard">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informations du projet */}
            <Card>
              <CardHeader>
                <CardTitle>Informations du projet</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="project-name">Nom du projet *</Label>
                  <Input
                    id="project-name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    required
                    data-testid="input-project-name"
                  />
                </div>

                <div>
                  <Label htmlFor="sector">Secteur *</Label>
                  <Select value={sector} onValueChange={setSector} required>
                    <SelectTrigger data-testid="select-sector">
                      <SelectValue placeholder="Sélectionnez un secteur" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Construction">Construction</SelectItem>
                      <SelectItem value="Agriculture">Agriculture</SelectItem>
                      <SelectItem value="Élevage">Élevage</SelectItem>
                      <SelectItem value="Transport">Transport</SelectItem>
                      <SelectItem value="Ventes-matériaux">Ventes de Matériaux</SelectItem>
                      <SelectItem value="Immobilier">Immobilier</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">Statut</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger data-testid="select-status">
                      <SelectValue placeholder="Sélectionnez un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="En cours">En cours</SelectItem>
                      <SelectItem value="Terminé">Terminé</SelectItem>
                      <SelectItem value="En attente">En attente</SelectItem>
                      <SelectItem value="Annulé">Annulé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="address">Adresse</Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    data-testid="input-address"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    data-testid="textarea-description"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Images du projet */}
            <Card>
              <CardHeader>
                <CardTitle>Images du projet</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="image-upload">Ajouter des images</Label>
                  <Input
                    id="image-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    data-testid="input-images"
                  />
                </div>

                {/* Gallery des images existantes */}
                <div className="space-y-2">
                  <Label>Images actuelles</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {projectImages.map((imagePath, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={imagePath.startsWith('/uploads/') ? imagePath : `/uploads/${imagePath}`}
                          alt={`Image ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border"
                          onError={(e) => {
                            // Si l'image ne se charge pas, essayer sans préfixe
                            const target = e.target as HTMLImageElement;
                            if (target.src.includes('/uploads/')) {
                              target.src = imagePath.replace('/uploads/', '');
                            }
                          }}
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(imagePath)}
                          data-testid={`button-remove-image-${index}`}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  {projectImages.length === 0 && (
                    <div className="text-center text-gray-500 py-8 border-2 border-dashed border-gray-300 rounded-lg">
                      Aucune image ajoutée
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-4">
            <Link href="/admin/dashboard">
              <Button type="button" variant="outline">
                Annuler
              </Button>
            </Link>
            <Button type="submit" disabled={saving} data-testid="button-save">
              {saving ? (
                <>
                  <Upload className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Enregistrer
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}