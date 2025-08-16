import { useState, FormEvent } from "react";


export default function ProjectForm() {
  const [project_name, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("");
  const [sector, setSector] = useState("");
  const [project_images, setProjectImages] = useState<FileList | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);

    const formData = new FormData();
    formData.append("project_name", project_name);
    formData.append("description", description);
    formData.append("address", address);
    formData.append("status", status);
    if (project_images) {
      Array.from(project_images).forEach((file) => {
        formData.append("project_images", file);
      });
    }
    formData.append("sector", sector);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) {
        let data;
        try {
          data = await res.json();
        } catch {
          setError("Erreur lors de l'ajout du projet");
          return;
        }
        setError(data.message || "Erreur lors de l'ajout du projet");
        return;
      }
      setSuccess("Projet ajouté avec succès !");
      setProjectName("");
      setDescription("");
      setAddress("");
      setStatus("");
      setSector("");
      setProjectImages(null);
      const fileInput = document.getElementById("project-images-input") as HTMLInputElement | null;
      if (fileInput) fileInput.value = "";
    } catch {
      setError("Erreur réseau");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-2">Ajouter un projet</h2>
      <input
        title="Nom du projet"
        type="text"
        placeholder="Nom du projet"
        value={project_name}
        onChange={e => setProjectName(e.target.value)}
        className="w-full border px-3 py-2 rounded"
        required
      />
      <input
        title="Description"
        type="text"
        placeholder="Description du projet"
        value={description}
        onChange={e => setDescription(e.target.value)}
        className="w-full border px-3 py-2 rounded"
        required
      />
      <input
        title="Adresse"
        type="text"
        placeholder="Adresse"
        value={address}
        onChange={e => setAddress(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />
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
    
      <input
        id="project-images-input"
        type="file"
        multiple
        accept="image/*"
        onChange={e => setProjectImages(e.target.files)}
        className="w-full"
      />
        <select
        title="Secteur"
        value={sector}
        onChange={e => setSector(e.target.value)}
        className="w-full border px-3 py-2 rounded"
        required
      >
        <option value="">Secteur</option>
        <option value="Construction">Construction</option>
        <option value="Élevage">Élevage</option>
        <option value="Transport">Transport</option>
        <option value="Agriculture">Agriculture</option>
        <option value="Immobilier">Immobilier</option>
        <option value="Ventes de matériaux">Ventes de matériaux</option>
      </select>
      {success && <div className="text-green-600">{success}</div>}
      {error && <div className="text-red-600">{error}</div>}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Ajouter
      </button>
    </form>
  );
}
