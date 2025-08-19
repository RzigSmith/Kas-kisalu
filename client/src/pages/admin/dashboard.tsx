import React, { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
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

function Sidebar({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const [location] = useLocation();
  return (
    <aside className={`dashboard-sidebar${open ? " open" : ""}`}>
      <button className="sidebar-toggle" onClick={() => setOpen(!open)}>
        ☰
      </button>
      <ul>
        <li className={location === "/admin/dashboard" ? "active" : ""}>
          <Link href="/admin/dashboard">
            <FaChartBar style={{ marginRight: 8 }} />
            Dashboard
          </Link>
        </li>
        <li className={location === "/admin/projects-realised" ? "active" : ""}>
          <Link href="/admin/projects-realised">
            <FaProjectDiagram style={{ marginRight: 8 }} />
            Projets réalisés
          </Link>
        </li>
        <li className={location === "/admin/project-form" ? "active" : ""}>
          <Link href="/admin/project-form">
            <FaPlusCircle style={{ marginRight: 8 }} />
            Ajouter un projet
          </Link>
        </li>
        <li className={location === "/admin/site-management" ? "active" : ""}>
          <Link href="/admin/site-management">
            <FaCog style={{ marginRight: 8 }} />
            Gestion du site
          </Link>
        </li>
        <li className={location === "/admin/project-edit" ? "active" : ""}>
          <Link href="/admin/project-edit">
            <FaProjectDiagram style={{ marginRight: 8 }} />
            Éditer un projet
          </Link>
        </li>
      </ul>
    </aside>
  );
}

function DashboardMain() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, navigate] = useLocation();

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
          "#1976d2", "#43a047", "#ffa726", "#d32f2f", "#7e57c2", "#00897b"
        ],
        borderWidth: 2,
        borderColor: "#fff"
      },
    ],
  };

  // Handler placeholders (à remplacer par ta logique réelle)
  const handleEdit = (projectId: number) => {
    navigate(`/admin/project-edit/${projectId}`);
  };
  const handleDelete = (projectId: number) => {
    if (window.confirm("Supprimer ce projet ?")) {
      alert(`Supprimer projet ID: ${projectId}`);
      // Ajoute ici la logique de suppression réelle
    }
  };

  return (
    <div className="dashboard-responsive-container">
      {error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}
      <div className="dashboard-cards-row">
        <div className="dashboard-card">
          <div className="dashboard-card-icon"><FaProjectDiagram color="#1976d2" size={28} /></div>
          <div className="dashboard-card-title">Projets</div>
          <div className="dashboard-card-value">{stats?.totalProjects ?? "0"}</div>
        </div>
        <div className="dashboard-card">
          <div className="dashboard-card-icon"><FaUser color="#43a047" size={28} /></div>
          <div className="dashboard-card-title">Utilisateurs</div>
          <div className="dashboard-card-value">{stats?.totalUsers ?? "0"}</div>
        </div>
        <div className="dashboard-card">
          <div className="dashboard-card-icon"><FaChartBar color="#ffa726" size={28} /></div>
          <div className="dashboard-card-title">Secteurs</div>
          <div className="dashboard-card-value">{sectors.length}</div>
        </div>
      </div>
      <div className="dashboard-graphs-row">
        <div className="dashboard-graph-card">
          <h3>Répartition des projets par secteur</h3>
          {projectsBySector.length > 0 ? (
            <Pie data={sectorChartData} options={{
              plugins: { legend: { position: "bottom" } }
            }} />
          ) : (
            <div>Aucune donnée secteur</div>
          )}
        </div>
        <div className="dashboard-list-card">
          <h3>Utilisateurs</h3>
          <ul>
            {stats?.users?.length
              ? stats.users.map((u) => (
                  <li key={u.id}>
                    <strong>{u.username}</strong> — <span className="dashboard-card-value">{u.email}</span> — <span style={{color:"#d32f2f"}}>{u.role}</span>
                  </li>
                ))
              : <li>Aucun utilisateur</li>
            }
          </ul>
        </div>
        <div className="dashboard-list-card">
          <h3>Projets</h3>
          <ul>
            {stats?.projects?.length
              ? stats.projects.map((p) => (
                  <li key={p.id} className="dashboard-project-item">
                    <span>
                      <strong>{p.project_name}</strong> — <span className="dashboard-card-value">{p.sector}</span> — <span style={{color:"#43a047"}}>{p.status}</span>
                    </span>
                    <span className="dashboard-project-actions">
                      <button
                        className="dashboard-edit-btn"
                        onClick={() => handleEdit(p.id)}
                      >
                        Éditer
                      </button>
                      <button
                        className="dashboard-delete-btn"
                        onClick={() => handleDelete(p.id)}
                      >
                        Supprimer
                      </button>
                    </span>
                  </li>
                ))
              : <li>Aucun projet</li>
            }
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="dashboard-layout">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="dashboard-content">
        <button className="sidebar-toggle floating" onClick={() => setSidebarOpen(!sidebarOpen)}>
          ☰
        </button>
        <div className="dashboard-header">
          <button className="dashboard-logout-btn" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
        <DashboardMain />
      </div>
    </div>
  );
}
  return (
    <div className="dashboard-layout">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="dashboard-content">
        <button className="sidebar-toggle floating" onClick={() => setSidebarOpen(!sidebarOpen)}>
          ☰
        </button>
        <div className="dashboard-header" style={{ marginBottom: "1rem", textAlign: "right" }}>
          <button className="dashboard-logout-btn" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
        <DashboardMain />
      </div>
    </div>
  );
