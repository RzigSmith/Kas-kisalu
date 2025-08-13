import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Bar, Doughnut } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import { Calendar } from "@/components/ui/calendar";

// Enregistrement des éléments Chart.js nécessaires
Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [stats, setStats] = useState<any>({});
  const [messages, setMessages] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: "", sector: "", description: "", photos: [] as string[] });

  // Chargement des données avec gestion d’erreur
  useEffect(() => {
    Promise.all([
      fetch("/admin/stats", { credentials: "include" }).then(r => r.ok ? r.json() : Promise.reject()),
      fetch("/admin/messages", { credentials: "include" }).then(r => r.ok ? r.json() : Promise.reject()),
      fetch("/admin/projects", { credentials: "include" }).then(r => r.ok ? r.json() : Promise.reject())
    ])
      .then(([statsData, messagesData, projectsData]) => {
        setStats(statsData);
        setMessages(messagesData);
        setProjects(projectsData);
      })
      .catch(() => setError("Erreur réseau ou accès refusé"));
  }, []);

  // Suppression projet
  const handleDeleteProject = async (id: number) => {
    await fetch(`/admin/projects/${id}`, { method: "DELETE", credentials: "include" });
    setProjects(projects => projects.filter(p => p.id !== id));
  };

  // Édition projet (pré-remplissage du formulaire)
  const handleEditProject = (p: any) => {
    setEditId(p.id);
    setForm({ title: p.title, sector: p.sector, description: p.description, photos: p.photos || [] });
  };

  // Sauvegarde projet (édition ou ajout)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editId ? `/admin/projects/${editId}` : "/admin/projects";
    const method = editId ? "PUT" : "POST";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    });
    setEditId(null);
    setForm({ title: "", sector: "", description: "", photos: [] });
    // Recharge la liste
    const res = await fetch("/admin/projects", { credentials: "include" });
    setProjects(await res.json());
  };

  const chartData = {
    labels: Object.keys(stats.projectsBySector || {}),
    datasets: [
      {
        label: "Projets par secteur",
        data: Object.values(stats.projectsBySector || {}),
        backgroundColor: ["#3b82f6", "#10b981", "#f59e42", "#ef4444"],
      },
    ],
  };

  const doughnutData = {
    labels: ["Réservations", "Visiteurs", "Messages"],
    datasets: [
      {
        data: [stats.totalProjects || 0, 120, stats.totalMessages || 0],
        backgroundColor: ["#3b82f6", "#10b981", "#f59e42"],
      },
    ],
  };

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow text-red-600 font-bold">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-20 bg-gray-900 text-white flex flex-col items-center py-6 space-y-8">
        {/* Remplacez par vos icônes */}
        <button title="Dashboard"><span>🏠</span></button>
        <button title="Projets"><span>📁</span></button>
        <button title="Messages"><span>✉️</span></button>
        <button title="Stats"><span>📊</span></button>
        <button title="Paramètres"><span>⚙️</span></button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Bienvenue sur le Dashboard</h1>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded"
            onClick={async () => {
              await fetch("/admin/logout", { method: "POST", credentials: "include" });
              setLocation("/login");
            }}
          >
            Déconnexion
          </button>
        </div>

        {/* Stats & Graphs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded shadow p-6 flex flex-col items-center">
            <div className="text-gray-500 mb-2">Projets</div>
            <div className="text-3xl font-bold">{stats.totalProjects || 0}</div>
          </div>
          <div className="bg-white rounded shadow p-6 flex flex-col items-center">
            <div className="text-gray-500 mb-2">Messages</div>
            <div className="text-3xl font-bold">{stats.totalMessages || 0}</div>
          </div>
          <div className="bg-white rounded shadow p-6 flex flex-col items-center">
            <div className="text-gray-500 mb-2">Graphique</div>
            <div className="w-24 h-24">
              <Doughnut data={doughnutData} />
            </div>
          </div>
        </div>

        {/* Graphique projets par secteur */}
        <div className="bg-white rounded shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Projets par secteur</h2>
          <Bar data={chartData} />
        </div>

        {/* Messages récents */}
        <div className="bg-white rounded shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Messages récents</h2>
          <ul>
            {messages.slice(0, 5).map((m: any) => (
              <li key={m.id} className="mb-2 border-b pb-2 flex justify-between items-center">
                <span>{m.content}</span>
                <button className="bg-red-600 text-white px-2 py-1 rounded" onClick={async () => {
                  await fetch(`/admin/messages/${m.id}`, { method: "DELETE", credentials: "include" });
                  setMessages(msgs => msgs.filter(msg => msg.id !== m.id));
                }}>Supprimer</button>
              </li>
            ))}
          </ul>
        </div>

        {/* Calendrier (exemple) */}
        <div className="bg-white rounded shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Calendrier</h2>
          <Calendar value={selectedDate} onChange={setSelectedDate} />
        </div>

        {/* Liste des projets/réalisations */}
        <div className="bg-white rounded shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Liste des projets/réalisations</h2>
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <input type="text" placeholder="Titre" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full border px-3 py-2 rounded" required />
            <select value={form.sector} onChange={e => setForm(f => ({ ...f, sector: e.target.value }))} className="w-full border px-3 py-2 rounded" required>
              <option value="">Secteur</option>
              <option value="construction">Construction</option>
              <option value="agriculture">Agriculture</option>
              <option value="elevage">Elevage</option>
              <option value="transport">Transport</option>
              <option value="vente_materiaux">Vente de matériaux</option>
              <option value="immobilier">Immobilier</option>
            </select>
            <textarea placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full border px-3 py-2 rounded" required />
            {/* Ajoutez ici l’upload de photos si besoin */}
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">{editId ? "Modifier" : "Ajouter"}</button>
          </form>
          <ul>
            {projects.length === 0 && <li>Aucun projet.</li>}
            {projects.map((p: any) => (
              <li key={p.id} className="mb-2 border-b pb-2 flex justify-between items-center">
                <div>
                  <strong>{p.title}</strong> ({p.sector})<br />
                  <span>{p.description}</span><br />
                  Photos: {p.photos && p.photos.join(", ")}
                </div>
                <div className="flex gap-2">
                  <button className="bg-yellow-500 text-white px-2 py-1 rounded" onClick={() => handleEditProject(p)}>Éditer</button>
                  <button className="bg-red-600 text-white px-2 py-1 rounded" onClick={() => handleDeleteProject(p.id)}>Supprimer</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}