import React, { useState } from "react";
import { useLocation } from "wouter";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProjectForm() {
  const [, setLocation] = useLocation();
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("");
  const [sector, setSector] = useState("");
  const [images, setImages] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!projectName || !description || !status || !sector) {
      setError("Tous les champs obligatoires doivent être remplis");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("project_name", projectName);
      formData.append("description", description);
      formData.append("address", address);
      formData.append("status", status);
      formData.append("sector", sector);

      if (images) {
        for (let i = 0; i < images.length; i++) {
          formData.append("project_images", images[i]);
        }
      }

      const response = await fetch("/api/projects", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setSuccess("Projet ajouté avec succès !");
        // Rediriger vers la liste des projets après 2 secondes
        setTimeout(() => {
          setLocation("/admin/projects");
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.message || "Erreur lors de l'ajout du projet");
      }
    } catch (err: any) {
      setError("Erreur de réseau : " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ajouter un projet</h1>
          <p className="text-gray-600">Créez un nouveau projet pour votre portfolio</p>
        </div>

        {/* Messages */}
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

        {/* Formulaire */}
        <Card>
          <CardHeader>
            <CardTitle>Informations du projet</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nom du projet */}
                <div className="space-y-2">
                  <Label htmlFor="project_name">
                    Nom du projet <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="project_name"
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Entrez le nom du projet"
                    required
                    data-testid="input-project-name"
                  />
                </div>

                {/* Secteur */}
                <div className="space-y-2">
                  <Label htmlFor="sector">
                    Secteur <span className="text-red-500">*</span>
                  </Label>
                  <Select value={sector} onValueChange={setSector} required>
                    <SelectTrigger data-testid="select-sector">
                      <SelectValue placeholder="Sélectionnez un secteur" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Construction">Construction</SelectItem>
                      <SelectItem value="Agriculture">Agriculture</SelectItem>
                      <SelectItem value="Élevage">Élevage</SelectItem>
                      <SelectItem value="Transport">Transport</SelectItem>
                      <SelectItem value="Ventes-matériaux">Ventes-matériaux</SelectItem>
                      <SelectItem value="Immobilier">Immobilier</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Décrivez le projet en détail"
                  rows={4}
                  required
                  data-testid="input-description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Adresse */}
                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Input
                    id="address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Adresse du projet (optionnel)"
                    data-testid="input-address"
                  />
                </div>

                {/* Statut */}
                <div className="space-y-2">
                  <Label htmlFor="status">
                    Statut <span className="text-red-500">*</span>
                  </Label>
                  <Select value={status} onValueChange={setStatus} required>
                    <SelectTrigger data-testid="select-status">
                      <SelectValue placeholder="Sélectionnez un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="En attente">En attente</SelectItem>
                      <SelectItem value="En cours">En cours</SelectItem>
                      <SelectItem value="Terminé">Terminé</SelectItem>
                      <SelectItem value="Annulé">Annulé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Images */}
              <div className="space-y-2">
                <Label htmlFor="images">Images du projet</Label>
                <Input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setImages(e.target.files)}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  data-testid="input-images"
                />
                <p className="text-sm text-gray-500">
                  Vous pouvez sélectionner plusieurs images (formats: JPG, PNG, WebP)
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/admin/projects")}
                  data-testid="button-cancel"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  data-testid="button-submit"
                >
                  {loading ? "Ajout en cours..." : "Ajouter le projet"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}