import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import "./dashboard.css"; // Ajout du fichier CSS externe

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    project_name: "",
    description: "",
    address: "",
    status: "",
    sector: "",
    images: [],
  });
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true); // Ajout du loader
  const [error, setError] = useState(null); // Ajout de l'erreur

  // Fetch projects from backend
  useEffect(() => {
    setLoading(true);
    setError(null);
    axios
      .get("/api/projects") // Change to your actual API endpoint
      .then((res) => {
        setProjects(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Erreur lors du chargement des projets.");
        setLoading(false);
      });
  }, [refresh]);

  // Stats calculation
  const totalProjects = projects.length;
  const statusCounts = projects.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {});
  const sectors = Array.from(new Set(projects.map((p) => p.sector)));
  const projectsWithImages = projects.filter(
    (p) => p.project_images && p.project_images.length > 0
  ).length;

  const stats = [
    { label: "Nombre total de projets", value: totalProjects },
    ...Object.entries(statusCounts).map(([status, count]) => ({
      label: `Projets "${status}"`,
      value: count,
    })),
    { label: "Secteurs représentés", value: sectors.length },
    { label: "Projets avec images", value: projectsWithImages },
  ];

  // Chart data
  const chartData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        label: "Projets par statut",
        data: Object.values(statusCounts),
        backgroundColor: "#1976d2",
      },
    ],
  };

  // Form handlers
  const handleChange = (
    e
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setForm({
      ...form,
      images: e.target.files ? Array.from(e.target.files) : [],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("project_name", form.project_name);
    formData.append("description", form.description);
    formData.append("address", form.address);
    formData.append("status", form.status);
    formData.append("sector", form.sector);
    form.images.forEach((img) => formData.append("images", img));
    await axios.post("/api/projects", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setForm({
      project_name: "",
      description: "",
      address: "",
      status: "",
      sector: "",
      images: [],
    });
    setRefresh((r) => !r);
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard Admin</h1>
      {loading && (
        <div style={{ textAlign: "center", margin: "2rem" }}>Chargement...</div>
      )}
      {error && (
        <div style={{ color: "red", textAlign: "center", margin: "2rem" }}>
          {error}
        </div>
      )}
      {!loading && !error && (
        <>
          <div className="dashboard-stats">
            {stats.map((stat) => (
              <div key={stat.label} className="dashboard-stat-card">
                <div className="dashboard-stat-value">{stat.value}</div>
                <div className="dashboard-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="dashboard-form-section">
            <h2 className="dashboard-form-title">Ajouter un projet</h2>
            <form onSubmit={handleSubmit} className="dashboard-form">
              <input
                name="project_name"
                placeholder="Nom du projet"
                aria-label="Nom du projet"
                value={form.project_name}
                onChange={handleChange}
                required
                className="dashboard-input"
              />
              <textarea
                name="description"
                placeholder="Description"
                aria-label="Description"
                value={form.description}
                onChange={handleChange}
                required
                className="dashboard-input"
              />
              <input
                name="address"
                placeholder="Adresse"
                aria-label="Adresse"
                value={form.address}
                onChange={handleChange}
                required
                className="dashboard-input"
              />
              <input
                name="status"
                placeholder="Statut"
                aria-label="Statut"
                value={form.status}
                onChange={handleChange}
                required
                className="dashboard-input"
              />
              <input
                name="sector"
                placeholder="Secteur"
                aria-label="Secteur"
                value={form.sector}
                onChange={handleChange}
                required
                className="dashboard-input"
              />
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="dashboard-input"
                aria-label="Images du projet"
              />
              <button type="submit" className="dashboard-submit-btn">
                Ajouter
              </button>
            </form>
          </div>
          <div className="dashboard-chart-section">
            <h2 className="dashboard-chart-title">
              Graphique des projets par statut
            </h2>
            <Bar data={chartData} />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;