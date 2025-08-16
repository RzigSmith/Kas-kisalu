import React, { useEffect, useState } from "react";
import { Link } from "wouter";
import { FaChartBar, FaProjectDiagram, FaPlusCircle, FaCog, FaUser } from "react-icons/fa";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "./dashboard.css";
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

const API = "http://0.0.0.0:5000";

function Sidebar() {
  return (
    <nav className="dashboard-sidebar">
      <ul>
        <li>
          <Link href="/admin/dashboard">
            <FaChartBar style={{ marginRight: 8 }} />
            Dashboard
          </Link>
        </li>
        <li>
          <Link href="/admin/projects-realised">
            <FaProjectDiagram style={{ marginRight: 8 }} />
            Projets réalisés
          </Link>
        </li>
        <li>
          <Link href="/admin/project-form">
            <FaPlusCircle style={{ marginRight: 8 }} />
            Ajouter un projet
          </Link>
        </li>
        <li>
          <Link href="/admin/site-management">
            <FaCog style={{ marginRight: 8 }} />
            Gestion du site
          </Link>
        </li>
      </ul>
    </nav>
  );
}

function DashboardMain() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/api/admin/stats`)
      .then(async res => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Erreur stats: ${res.status}\n${text}`);
        }
        return res.json();
      })
      .then(statsData => {
        setStats(statsData);
        setLoading(false);
      })
      .catch((err) => {
        setError("Erreur lors du chargement des données : " + err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="dashboard-loading">Chargement...</div>;
  if (error) return (
    <div className="dashboard-error">
      {error}
    </div>
  );

  // Calcule les secteurs à partir des projets reçus
  const sectors = stats?.projects
    ? Array.from(new Set(stats.projects.map(p => p.sector).filter(Boolean)))
    : [];

  // Pie chart data
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
          "#1976d2", "#43a047", "#ffa726", "#d32f2f", "#7e57c2", "#00897b"
        ],
        borderWidth: 2,
        borderColor: "#fff"
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <FaUser size={22} style={{ marginRight: 8, color: "#1976d2" }} />
        <span style={{ fontWeight: "bold", color: "#1976d2" }}>
          {stats?.users?.length ?? 0} utilisateurs
        </span>
      </div>
      <h1 className="dashboard-title">
        <FaChartBar style={{ marginRight: 8, verticalAlign: "middle" }} />
        Dashboard Administrateur
      </h1>
      <div className="dashboard-stats">
        <div className="dashboard-stat-card">
          <FaProjectDiagram size={32} color="#1976d2" />
          <div className="dashboard-stat-value">{stats?.totalProjects ?? "0"}</div>
          <div className="dashboard-stat-label">Projets</div>
        </div>
        <div className="dashboard-stat-card">
          <FaChartBar size={32} color="#43a047" />
          <div className="dashboard-stat-value">{sectors.length}</div>
          <div className="dashboard-stat-label">Secteurs</div>
        </div>
        <div className="dashboard-stat-card">
          <FaUser size={32} color="#d32f2f" />
          <div className="dashboard-stat-value">{stats?.totalUsers ?? "0"}</div>
          <div className="dashboard-stat-label">Utilisateurs</div>
        </div>
      </div>
      <div className="dashboard-chart-section">
        <h2 className="dashboard-chart-title">
          Répartition des projets par secteur
        </h2>
        {projectsBySector.length > 0 ? (
          <Pie data={sectorChartData} options={{
            plugins: {
              legend: { position: "bottom" }
            }
          }} />
        ) : (
          <div>Aucune donnée secteur</div>
        )}
      </div>
      <div className="dashboard-form-section">
        <h2 className="dashboard-form-title">Liste des projets</h2>
        <ul className="dashboard-project-list">
          {stats?.projects?.length
            ? stats.projects.map((p) => (
                <li key={p.id} className="dashboard-project-item">
                  <strong>{p.project_name}</strong> — <span style={{color:"#1976d2"}}>{p.sector}</span> — <span style={{color:"#43a047"}}>{p.status}</span>
                  {p.project_images && p.project_images.length > 0 && (
                    <div>
                      {p.project_images.map((img, i) => (
                        <img key={i} src={`${API}${img}`} alt={p.project_name} className="dashboard-project-image" />
                      ))}
                    </div>
                  )}
                </li>
              ))
            : <li>Aucun projet</li>
          }
        </ul>
      </div>
      <div className="dashboard-form-section">
        <h2 className="dashboard-form-title">Liste des utilisateurs</h2>
        <ul>
          {stats?.users?.length
            ? stats.users.map((u) => (
                <li key={u.id}>
                  <strong>{u.username}</strong> — <span style={{color:"#1976d2"}}>{u.email}</span> — <span style={{color:"#d32f2f"}}>{u.role}</span>
                </li>
              ))
            : <li>Aucun utilisateur</li>
          }
        </ul>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <DashboardMain />
      </div>
    </div>
  );
}


