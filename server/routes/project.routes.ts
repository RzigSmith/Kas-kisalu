import { Router } from "express";
import multer from "multer";
import { db, projects } from "../db";
import { v4 as uuidv4 } from "uuid";
import path from "path";

const router = Router();
const upload = multer({
  dest: "uploads/",
  storage: multer.diskStorage({
    destination: "uploads/",
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, uuidv4() + ext);
    }
  })
});

router.post("/", upload.array("project_images", 10), async (req, res) => {
  try {
    const { project_name, description, address, status, sector } = req.body;
    if (!project_name || !description || !status || !sector) {
      return res.status(400).json({ message: "Champs requis manquants" });
    }
    const images = req.files ? (req.files as Express.Multer.File[]).map(f => f.path) : [];
    await db.insert(projects).values({
      project_name,
      description,
      address,
      status,
      sector,
      project_images: images.join(",")
    });
    res.status(201).json({ success: true, message: "Projet ajouté avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
