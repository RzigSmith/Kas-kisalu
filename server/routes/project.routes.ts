import { Router } from "express";
import multer from "multer";
import { db, projects } from "../db";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";

const router = Router();
const pathToUploads = path.resolve(__dirname, "uploads"); // Dossier server/uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      // Crée le dossier server/uploads si il n'existe pas
      if (!fs.existsSync(pathToUploads)) {
        fs.mkdirSync(pathToUploads, { recursive: true });
      }
      cb(null, pathToUploads);
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, uuidv4() + ext);
    }
  })
});

router.post("/", upload.array("project_images", 10), async (req, res) => {
  try {
    const body = req.body as {
      project_name: string;
      description: string;
      address?: string;
      status: string;
      sector: string;
    };
    const { project_name, description, address, status, sector } = body;
    if (!project_name || !description || !status || !sector) {
      return res.status(400).json({ message: "Champs requis manquants" });
    }
    // Stocke le chemin relatif pour l'accès public
    const images = req.files
      ? (req.files as Express.Multer.File[]).map(f => "/uploads/" + path.basename(f.path))
      : [];
    await db.insert(projects).values({
      project_name,
      description,
      address,
      status,
      project_images: JSON.stringify(images),
      sector
    });
    res.status(201).json({ success: true, message: "Projet ajouté avec succès" });
  } catch (err: any) {
    console.error("Erreur lors de l'ajout du projet:", err);
    res.status(500).json({ message: err.message || "Erreur serveur" });
  }
});

import { eq } from "drizzle-orm";

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const rows = await db.select().from(projects).where(eq(projects.id, id));
    if (!rows.length) return res.status(404).json({ message: "Projet non trouvé" });
    const row = rows[0];
    let images: string[] = [];
    try {
      if (typeof row.project_images === "string") {
        images = JSON.parse(row.project_images);
      } else if (Array.isArray(row.project_images)) {
        images = row.project_images;
      }
    } catch (e) {
      console.error("Erreur parsing project_images:", row.project_images, e);
      images = [];
    }
    // S'assure que chaque image commence par /uploads/
    images = images.map(img => img.startsWith("/uploads/") ? img : "/uploads/" + path.basename(img));
    res.json({
      ...row,
      project_images: images
    });
  } catch (err: any) {
    console.error("Erreur get /:id:", err);
    res.status(500).json({ message: err.message || "Erreur serveur" });
  }
});

export default router;