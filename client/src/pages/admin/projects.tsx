import React, { useEffect, useState } from "react";
import { Link } from "wouter";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Building2, Edit, Trash2, Plus, Search } from "lucide-react";

type Project = {
  id: number;
  project_name: string;
  description: string | null;
  address: string | null;
  status: string | null;
  project_images?: string[];
  sector: string | null;
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch("/projects")
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(err => {
        setError("Erreur lors du chargement des projets : " + err.message);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (projectId: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) return;
    
    try {
      const response = await fetch(`/projects/${projectId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setProjects(prev => prev.filter(p => p.id !== projectId));
      } else {
        alert("Erreur lors de la suppression du projet");
      }
    } catch (error) {
      alert("Erreur de réseau lors de la suppression");
    }
  };

  const filteredProjects = projects.filter(project =>
    project.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.sector?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "Terminé": return "bg-green-100 text-green-800";
      case "En cours": return "bg-blue-100 text-blue-800";
      case "En attente": return "bg-yellow-100 text-yellow-800";
      case "Annulé": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Chargement des projets...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projets</h1>
            <p className="text-gray-600">Gérez tous vos projets</p>
          </div>
          <Link href="/admin/project-form">
            <Button data-testid="button-add-project">
              <Plus className="mr-2 h-4 w-4" />
              Nouveau projet
            </Button>
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher par nom, secteur ou statut..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="h-4 w-4 bg-green-600 rounded-full"></div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Terminés</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {projects.filter(p => p.status === "Terminé").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <div className="h-4 w-4 bg-blue-600 rounded-full"></div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">En cours</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {projects.filter(p => p.status === "En cours").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <div className="h-4 w-4 bg-yellow-600 rounded-full"></div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">En attente</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {projects.filter(p => p.status === "En attente").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects List */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des projets ({filteredProjects.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredProjects.length > 0 ? (
              <div className="space-y-4">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1 space-y-2 sm:space-y-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{project.project_name}</h3>
                        <div className="flex gap-2">
                          <Badge className={getStatusColor(project.status)}>
                            {project.status || "Non défini"}
                          </Badge>
                          <Badge variant="outline">{project.sector}</Badge>
                        </div>
                      </div>
                      {project.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
                      )}
                      {project.address && (
                        <p className="text-sm text-gray-500">{project.address}</p>
                      )}
                      {project.project_images && project.project_images.length > 0 && (
                        <p className="text-xs text-gray-400">
                          {project.project_images.length} image(s)
                        </p>
                      )}
                    </div>
                    
                    <div className="flex space-x-2 mt-4 sm:mt-0">
                      <Link href={`/admin/project-edit/${project.id}`}>
                        <Button
                          size="sm"
                          variant="outline"
                          data-testid={`button-edit-${project.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(project.id)}
                        className="text-red-600 hover:text-red-700"
                        data-testid={`button-delete-${project.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun projet trouvé</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm ? "Aucun projet ne correspond à votre recherche." : "Commencez par créer un nouveau projet."}
                </p>
                {!searchTerm && (
                  <div className="mt-6">
                    <Link href="/admin/project-form">
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Nouveau projet
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}