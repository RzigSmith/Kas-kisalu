import React, { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, MessageSquare, TrendingUp, BarChart3 } from "lucide-react";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

type Project = {
  id: number;
  project_name: string;
  description: string | null;
  address: string | null;
  status: string | null;
  project_images?: string[];
  sector: string | null;
};

type StatData = {
  totalProjects: number;
  totalUsers: number;
  totalMessages: number;
  projects: Project[];
  projectsBySector: { [key: string]: number };
  projectsByStatus: { [key: string]: number };
  recentActivity: string[];
};

export default function Stats() {
  const [stats, setStats] = useState<StatData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("/projects").then(res => res.json()),
      fetch("/admin/stats").then(res => res.json()).catch(() => ({ totalUsers: 0, totalMessages: 0 }))
    ])
      .then(([projects, adminStats]) => {
        // Calcul des statistiques par secteur
        const sectorStats: { [key: string]: number } = {};
        const statusStats: { [key: string]: number } = {};
        
        projects.forEach((project: Project) => {
          if (project.sector) {
            sectorStats[project.sector] = (sectorStats[project.sector] || 0) + 1;
          }
          if (project.status) {
            statusStats[project.status] = (statusStats[project.status] || 0) + 1;
          }
        });

        setStats({
          totalProjects: projects.length,
          totalUsers: adminStats.totalUsers || 0,
          totalMessages: adminStats.totalMessages || 0,
          projects: projects,
          projectsBySector: sectorStats,
          projectsByStatus: statusStats,
          recentActivity: [
            "Nouveau projet ajouté",
            "Projet mis à jour",
            "Utilisateur connecté"
          ]
        });
        setLoading(false);
      })
      .catch((err) => {
        setError("Erreur lors du chargement des statistiques : " + err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Chargement des statistiques...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!stats) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">Erreur lors du chargement</div>
        </div>
      </AdminLayout>
    );
  }

  const sectorChartData = {
    labels: Object.keys(stats.projectsBySector),
    datasets: [
      {
        data: Object.values(stats.projectsBySector),
        backgroundColor: [
          "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"
        ],
        borderWidth: 2,
        borderColor: "#fff"
      },
    ],
  };

  const statusChartData = {
    labels: Object.keys(stats.projectsByStatus),
    datasets: [
      {
        label: "Nombre de projets",
        data: Object.values(stats.projectsByStatus),
        backgroundColor: "#3b82f6",
        borderColor: "#1d4ed8",
        borderWidth: 1
      },
    ],
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Terminé": return "bg-green-100 text-green-800";
      case "En cours": return "bg-blue-100 text-blue-800";
      case "En attente": return "bg-yellow-100 text-yellow-800";
      case "Annulé": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Statistiques détaillées</h1>
          <p className="text-gray-600">Analyse complète de votre plateforme</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projets</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProjects}</div>
              <p className="text-xs text-muted-foreground">
                Répartis sur {Object.keys(stats.projectsBySector).length} secteurs
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
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
              <div className="text-2xl font-bold">{stats.totalMessages}</div>
              <p className="text-xs text-muted-foreground">
                Messages reçus
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taux de réussite</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalProjects > 0 
                  ? Math.round((stats.projectsByStatus["Terminé"] || 0) / stats.totalProjects * 100)
                  : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                Projets terminés
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Répartition par secteur</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(stats.projectsBySector).length > 0 ? (
                <div className="h-[300px] flex items-center justify-center">
                  <Pie 
                    data={sectorChartData} 
                    options={{
                      plugins: { 
                        legend: { position: "bottom" }
                      },
                      responsive: true,
                      maintainAspectRatio: false
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

          <Card>
            <CardHeader>
              <CardTitle>Répartition par statut</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(stats.projectsByStatus).length > 0 ? (
                <div className="h-[300px]">
                  <Bar 
                    data={statusChartData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            stepSize: 1
                          }
                        }
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
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Projects by Sector */}
          <Card>
            <CardHeader>
              <CardTitle>Détail par secteur</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(stats.projectsBySector).map(([sector, count]) => (
                  <div key={sector} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{sector}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{count} projets</span>
                      <Badge variant="outline">{Math.round(count / stats.totalProjects * 100)}%</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Projects by Status */}
          <Card>
            <CardHeader>
              <CardTitle>Détail par statut</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(stats.projectsByStatus).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(status)}>{status}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{count} projets</span>
                      <Badge variant="outline">{Math.round(count / stats.totalProjects * 100)}%</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Projets récents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.projects.slice(0, 5).map((project) => (
                <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{project.project_name}</h4>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline">{project.sector}</Badge>
                      <Badge className={getStatusColor(project.status || "")}>
                        {project.status || "Non défini"}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {project.project_images?.length || 0} images
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}