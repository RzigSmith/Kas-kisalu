import React from "react";
import  { useState } from "react";
export default function SiteManagement() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="dashboard-form-section">
      <div className="dashboard-header" style={{ marginBottom: "1rem", textAlign: "right" }}>
        <button className="dashboard-logout-btn" onClick={handleLogout}>
          Déconnexion
        </button>
      </div>
      <h1 className="dashboard-form-title">Gestion du site</h1>
      <p>
        Cette section permet à l'administrateur de gérer les paramètres du site, les
        utilisateurs, les rôles, et d'autres fonctionnalités à venir.
      </p>
      <div style={{ marginTop: "2rem", color: "#555" }}>
        <ul>
          <li>Gestion des utilisateurs (à venir)</li>
          <li>Gestion des rôles (à venir)</li>
          <li>Paramètres généraux du site (à venir)</li>
        </ul>
      </div>
    </div>
  );
}
