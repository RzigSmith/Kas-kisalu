import React, { useEffect, useState } from "react";
import { useRoute, Link, useLocation } from "wouter";
import { FaChartBar, FaProjectDiagram, FaPlusCircle, FaCog, FaArrowLeft } from "react-icons/fa";
import "./dashboard.css";
import uploads from "path";

function Sidebar() {
  const [location] = useLocation();
  return (
    <nav className="dashboard-sidebar">
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
        <li className={location === "/admin/project-edit" ? "active" : ""}>
          <Link href="/admin/project-edit">
            <FaProjectDiagram style={{ marginRight: 8 }} />
            Éditer un projet
          </Link>
        </li>
        <li className={location === "/admin/site-management" ? "active" : ""}>
          <Link href="/admin/site-management">
            <FaCog style={{ marginRight: 8 }} />
            Gestion du site
          </Link>
        </li>
      </ul>
    </nav>
  );
}

type Project = {
  id: number;
  project_name: string;
  description: string | null;
  address: string | null;
  status: string | null;
  project_images?: string[];
  sector: string | null;
};

const API = import.meta.env.VITE_API_URL || "http://0.0.0.0:5000";

export default function ProjectEdit() {
  const [match, params] = useRoute("/admin/project-edit/:id");
  const projectId = params?.id ?? window.sessionStorage.getItem("edit_project_id");

  if (!projectId) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <div className="dashboard-content">
          <div className="dashboard-error">
            Aucun projet sélectionné.<br />
            Veuillez accéder à cette page via le bouton "Éditer" du dashboard.
          </div>
        </div>
      </div>
    );
  }

  const [, navigate] = useLocation();

  const [loading, setLoading] = useState(true);
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
    fetch(`${API}/api/projects/${projectId}`)
      .then(async res => {
        if (!res.ok) throw new Error("Projet introuvable");
        return res.json();
      })
      .then(data => {
        setProjectName(data.project_name ?? "");
        setDescription(data.description ?? "");
        setAddress(data.address ?? "");
        setStatus(data.status ?? "");
        setSector(data.sector ?? "");
        setProjectImages(Array.isArray(data.project_images) ? data.project_images : []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [projectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`${API}/api/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_name: projectName,
          description,
          address,
          status,
          sector
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erreur lors de la modification");
      }
      setSuccess("Projet modifié avec succès !");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    window.location.href = "/";
  };

  if (loading) return <div className="dashboard-loading">Chargement...</div>;
  if (error) return <div className="dashboard-error">{error}</div>;

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <div className="dashboard-header" style={{ marginBottom: "1rem", textAlign: "right" }}>
          <button className="dashboard-logout-btn" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
        <Link href="/admin/dashboard" className="dashboard-back-link">
          <FaArrowLeft style={{ marginRight: 8 }} />
          Retour Dashboard
        </Link>
        <h2 className="dashboard-form-title">Modifier le projet</h2>
        <form className="dashboard-form" onSubmit={handleSubmit}>
          <label>
            Nom du projet
            <input
              className="dashboard-input"
              value={projectName}
              onChange={e => setProjectName(e.target.value)}
              required
            />
          </label>
          <label>
            Description
            <input
              className="dashboard-input"
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
            />
          </label>
          <label>
            Adresse
            <input
              className="dashboard-input"
              value={address}
              onChange={e => setAddress(e.target.value)}
            />
          </label>
          <label>
            Statut
            <select
            title="Statut"
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">Statut</option>
            <option value="En cours">En cours</option>
            <option value="Terminé">Terminé</option>
            <option value="Suspendu">Suspendu</option>
          </select>
          </label>
          <label>
            Secteur
            <input
              className="dashboard-input"
              value={sector}
              onChange={e => setSector(e.target.value)}
              required
            />
          </label>
          <label>
            Images
            <div className="dashboard-project-images">
              {projectImages && projectImages.length > 0 ? (
                projectImages.map((img, i) => {
                  // Correction : retire le préfixe / si présent, et assure le bon chemin
                  // img doit être du type "uploads/xxx.jpeg"
                  const cleanPath = img.replace(/\\/g, "/").replace(/^\/+/, "");
                  const src = `${API}/${cleanPath}`;
                  return (
                    <img
                      key={i}
                      src={src}
                      alt={projectName}
                      className="dashboard-project-image"
                      onError={e => {
                        e.currentTarget.style.border = "2px solid red";
                        e.currentTarget.alt = "Image introuvable";
                      }}
                    />
                  );
                })
              ) : (
                <span>Aucune image</span>
              )}
            </div>
          </label>
          <button className="dashboard-submit-btn" type="submit">
            Enregistrer les modifications
          </button>
          {success && <div className="dashboard-success">{success}</div>}
          {error && <div className="dashboard-error">{error}</div>}
        </form>
      </div>
    </div>
  );
}
