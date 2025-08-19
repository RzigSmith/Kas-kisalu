import React, { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Users, MessageSquare, Edit, Trash2 } from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend);

type Project = {
  id: number;
  project_name: string;
  description: string | null;
  address: string | null;
  status: string | null;
  project_images?: string[];
  sector: string | null;
};

type User = {
  id: number;
  username: string;
  email: string;
  role: string;
};

type Stats = {
  totalProjects: number;
  totalUsers: number;
  projects: Project[];
  users: User[];
};

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, navigate] = useLocation();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("/projects").then(res => res.json()),
      fetch("/admin/stats").then(res => res.json()).catch(() => ({ totalUsers: 0, totalMessages: 0 }))
    ])
      .then(([projects, adminStats]) => {
        setStats({
          totalProjects: projects.length,
          totalUsers: adminStats.totalUsers || 0,
          projects: projects,
          users: []
        });
        setLoading(false);
      })
      .catch((err) => {
        setError("Erreur lors du chargement des données : " + err.message);
        setLoading(false);
      });
  }, []);

  const sectors = stats?.projects
    ? Array.from(new Set(stats.projects.map(p => p.sector).filter(Boolean)))
    : [];
  
  const projectsBySector = sectors.length && stats?.projects
    ? sectors.map(sector =>
        stats.projects.filter(p => p.sector === sector).length
      )
    : [];
  
  const sectorChartData = {
    labels: sectors,
    datasets: [
      {
        data: projectsBySector,
        backgroundColor: [
          "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"
        ],
        borderWidth: 2,
        borderColor: "#fff"
      },
    ],
  };

  const handleEdit = (projectId: number) => {
    sessionStorage.setItem("edit_project_id", projectId.toString());
    navigate(`/admin/project-edit/${projectId}`);
  };
  
  const handleDelete = async (projectId: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) return;
    
    try {
      const response = await fetch(`/projects/${projectId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Recharger les données
        setStats(prev => prev ? {
          ...prev,
          projects: prev.projects.filter(p => p.id !== projectId),
          totalProjects: prev.totalProjects - 1
        } : null);
      } else {
        alert("Erreur lors de la suppression du projet");
      }
    } catch (error) {
      alert("Erreur de réseau lors de la suppression");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Chargement...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Vue d'ensemble de votre plateforme</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projets</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalProjects ?? "0"}</div>
              <p className="text-xs text-muted-foreground">
                Répartis sur {sectors.length} secteurs
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers ?? "0"}</div>
              <p className="text-xs text-muted-foreground">
                Utilisateurs enregistrés
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Messages reçus
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Répartition des projets par secteur</CardTitle>
            </CardHeader>
            <CardContent>
              {projectsBySector.length > 0 ? (
                <div className="h-[300px] flex items-center justify-center">
                  <Pie 
                    data={sectorChartData} 
                    options={{
                      plugins: { 
                        legend: { position: "bottom" },
                        responsive: true,
                        maintainAspectRatio: false
                      }
                    }} 
                  />
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  Aucune donnée disponible
                </div>
              )}
            </CardContent>
          </Card>

          {/* Projects List */}
          <Card>
            <CardHeader>
              <CardTitle>Projets récents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.projects?.length ? (
                  stats.projects.slice(0, 5).map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{project.project_name}</h4>
                        <p className="text-sm text-gray-500">{project.sector} • {project.status}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(project.id)}
                          data-testid={`button-edit-${project.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
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
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    Aucun projet trouvé
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/admin/project-form">
                <Button className="w-full" data-testid="button-add-project">
                  Ajouter un projet
                </Button>
              </Link>
              <Link href="/admin/projects">
                <Button variant="outline" className="w-full" data-testid="button-view-projects">
                  Voir tous les projets
                </Button>
              </Link>
              <Link href="/admin/site-management">
                <Button variant="outline" className="w-full" data-testid="button-site-management">
                  Gérer le site
                </Button>
              </Link>
              <Link href="/admin/stats">
                <Button variant="outline" className="w-full" data-testid="button-detailed-stats">
                  Statistiques détaillées
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}