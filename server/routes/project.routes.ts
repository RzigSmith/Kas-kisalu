import { Router } from "express";
import multer from "multer";
import { db, projects } from "../db";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Route PUT pour mettre à jour un projet
router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    
    console.log("PUT /projects/:id - Body reçu:", req.body);
    
    // Récupérer les données du body
    const body = req.body as {
      project_name: string;
      description: string;
      address?: string;
      status: string;
      sector: string;
      project_images?: string[];
    };

    if (!body.project_name || !body.sector) {
      return res.status(400).json({ message: "Nom du projet et secteur requis" });
    }

    // Mettre à jour le projet
    await db.update(projects)
      .set({
        project_name: body.project_name,
        description: body.description || undefined,
        address: body.address || undefined,
        status: body.status || undefined,
        sector: body.sector,
        project_images: JSON.stringify(body.project_images || [])
      })
      .where(eq(projects.id, id));

    console.log("Projet mis à jour avec succès:", id);
    res.json({ success: true, message: "Projet mis à jour avec succès" });
  } catch (err: any) {
    console.error("Erreur lors de la mise à jour du projet:", err);
    res.status(500).json({ message: err.message || "Erreur serveur" });
  }
});

// Route DELETE pour supprimer un projet
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    
    // Récupérer le projet pour obtenir les images à supprimer
    const rows = await db.select().from(projects).where(eq(projects.id, id));
    if (!rows.length) {
      return res.status(404).json({ message: "Projet non trouvé" });
    }

    const project = rows[0];
    
    // Supprimer les fichiers images si ils existent
    if (project.project_images) {
      try {
        const images = typeof project.project_images === 'string' 
          ? JSON.parse(project.project_images) 
          : project.project_images;
        
        for (const imagePath of images) {
          const fullPath = path.join(pathToUploads, path.basename(imagePath));
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        }
      } catch (e) {
        console.error("Erreur lors de la suppression des images:", e);
      }
    }

    // Supprimer le projet de la base de données
    await db.delete(projects).where(eq(projects.id, id));
    
    res.json({ success: true, message: "Projet supprimé avec succès" });
  } catch (err: any) {
    console.error("Erreur lors de la suppression du projet:", err);
    res.status(500).json({ message: err.message || "Erreur serveur" });
  }
});

export default router;