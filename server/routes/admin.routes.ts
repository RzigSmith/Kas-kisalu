import { Router, Request, Response } from "express";
import { db, projects, users } from "../db";

const router = Router();

// Dashboard admin
router.get("/dashboard", (_req: Request, res: Response) => {
  res.json({ message: "Bienvenue sur le dashboard admin via admin.routes" });
});

// Exemple route projets admin
router.get("/projects", (_req: Request, res: Response) => {
  res.json({ projects: [] });
});

// Stats route
router.get("/stats", async (_req, res) => {
  try {
    const projectsList = await db.select().from(projects);
    const usersList = await db.select().from(users);
    res.json({
      totalProjects: projectsList.length,
      totalUsers: usersList.length,
      projects: projectsList,
      users: usersList
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Erreur serveur" });
  }
});

// Nouvelle route pour récupérer les secteurs distincts
router.get("/sectors", async (_req, res) => {
  try {
    const rows = await db.select().from(projects);
    const sectors = Array.from(new Set(rows.map(row => row.sector).filter(Boolean)));
    res.json(sectors);
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Erreur serveur" });
  }
});

// Ajoute ici d'autres routes admin si besoin

export default router;
