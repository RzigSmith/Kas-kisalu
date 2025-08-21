import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import cookieParser from "cookie-parser";
import cors from "cors";
import { users } from "./db"; // retire migrate
import multer from "multer";
import adminRoutes from "./routes/admin.routes";
import projectRoutes from "./routes/project.routes";
import realisationRoutes from "./routes/realisation.routes";
import * as realisationModel from "./models/realisation.model";
import { eq } from "drizzle-orm";
import { and } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import session from "express-session";
import path from "path";
import fs from "fs";
import { projects } from "./db";
import { fileURLToPath } from "url";
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connexion NeonDB adaptée (serverless, SSL)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // NeonDB gère le SSL automatiquement avec sslmode=require dans l'URL
});
export const db = drizzle(pool);

// Ajout du middleware express-session AVANT les routes
app.use(session({
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "lax", // "lax" pour le local, "none" en prod HTTPS
    secure: false,   // false en local, true en prod HTTPS
  }
}));

app.use(cors({
  origin: "http://127.0.0.1:5173", // Port du frontend (Vite)
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("super_secret_key")); // clé à personnaliser

const ADMIN_USER = "admin";
const ADMIN_PASS = "kaskisalu2025";
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24h

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Multer configuration pour upload d'images - pointe vers le dossier uploads à la racine
const uploadDir = path.resolve(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer storage: assure que les fichiers vont dans le dossier uploads à la racine
const multerStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + "-" + file.originalname.replace(/\s+/g, "_"));
  }
});
const upload = multer({
  storage: multerStorage,
  limits: { fileSize: 20 * 1024 * 1024, files: 30 },
  fileFilter: (_req, file, cb) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
      return cb(new Error("Seuls les fichiers jpg, png, webp sont autorisés"));
    }
    cb(null, true);
  }
});

// Inscription utilisateur (NeonDB, sécurisé)
app.post("/api/register", async (req: Request, res: Response) => {
  const { username, email, password, confirm_password } = req.body;
  if (!username || !email || !password || !confirm_password) {
    return res.status(400).json({ message: "Tous les champs sont requis" });
  }
  if (password !== confirm_password) {
    return res.status(400).json({ message: "Les mots de passe ne correspondent pas" });
  }
  // Vérifie si l'email existe déjà
  const existing = await db.select().from(users).where(eq(users.email, email));
  if (existing.length > 0) {
    return res.status(409).json({ message: "Cet email existe déjà" });
  }
  const hashed = await bcrypt.hash(password, 10);
  const role = email === "kaskisalu@gmail.com" ? "admin" : "visitor";
  const date_inscriptions = new Date();
  await db.insert(users).values({ username, email, password: hashed, role, date_inscriptions });
  res.json({ success: true, message: "Inscription réussie" });
});

// Connexion utilisateur (NeonDB, sécurisé)
app.post("/api/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis" });
  }
  const userArr = await db.select().from(users).where(eq(users.email, email));
  if (userArr.length === 0) {
    return res.status(401).json({ message: "Identifiants invalides" });
  }
  const user = userArr[0];
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ message: "Identifiants invalides" });
  }
  const token = jwt.sign(
    { id: user.id, username: user.username, email: user.email, role: user.role },
    process.env.SESSION_SECRET || "secret",
    { expiresIn: "7d" }
  );

  // Si admin, pose aussi le cookie signé admin_session
  if (user.role === "admin") {
    // Création de la session côté express-session
    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    };
    res.cookie("admin_session", "active", {
      signed: true,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24h
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }

  res.json({
    success: true,
    token,
    user: { id: user.id, username: user.username, email: user.email, role: user.role }
  });
});

// Middleware pour vérifier la session admin (cookie OU JWT)
function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  // Ajout d'un log pour debug session
  console.log("Session express reçue:", req.session);

  // Vérifie le cookie signé
  const sessionCookie = req.signedCookies && req.signedCookies.admin_session;
  if (sessionCookie && sessionCookie === "active") {
    return next();
  }

  // Vérifie le JWT dans l'en-tête Authorization
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    try {
      const payload = jwt.verify(token, process.env.SESSION_SECRET || "secret") as any;
      if (payload.role === "admin") {
        // Optionnel : tu peux attacher l'utilisateur à req.user
        (req as any).user = payload;
        return next();
      }
    } catch {
      // Token invalide
    }
  }

  res.status(401).json({ message: "Authentification admin requise" });
}

// Route de login admin
app.post("/admin/login", (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    res.cookie("admin_session", "active", {
      signed: true,
      httpOnly: true,
      maxAge: SESSION_DURATION_MS,
      sameSite: "strict",
      secure: false, // à mettre true en production HTTPS
    });
    return res.json({ success: true });
  }
  res.status(401).json({ message: "Identifiants admin invalides" });
});

// Route de logout admin
app.post("/admin/logout", requireAdminAuth, (_req: Request, res: Response) => {
  res.clearCookie("admin_session");
  res.json({ success: true });
});

// Dashboard admin (protégé)
app.get("/admin/dashboard", requireAdminAuth, (_req: Request, res: Response) => {
  res.json({ message: "Bienvenue sur le dashboard admin" });
});

// Example in-memory messages array for demonstration purposes
let messages: { id: number; content: string }[] = [
  { id: 1, content: "Bienvenue sur Kas-kisalu!" },
  { id: 2, content: "Nouveau projet ajouté." }
];

// CRUD projets/réalisations (admin, base NeonDB)
app.get("/admin/projects", requireAdminAuth, async (_req, res) => {
  const projects = await realisationModel.getAllRealisations();
  res.json(projects);
});

// POST /admin/projects : upload via champ "images"
app.post("/admin/projects", requireAdminAuth, upload.array("images", 10), async (req: Request, res: Response) => {
  const { project_name, description, address, status, sector } = req.body;
  const images = req.files ? (req.files as Express.Multer.File[]).map(f => f.path) : [];
  if (!project_name || !description || !status || !sector) {
    return res.status(400).json({ message: "Champs requis manquants" });
  }
  await realisationModel.createRealisation({
    project_name,
    description,
    address,
    status,
    sector,
    project_images: images
  });
  res.json({ success: true });
});

// PUT /admin/projects/:id : upload via champ "images"
app.put("/admin/projects/:id", requireAdminAuth, upload.array("images", 10), async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const { project_name, description, address, status, sector } = req.body;
  const images = req.files ? (req.files as Express.Multer.File[]).map(f => f.path) : undefined;
  await realisationModel.updateRealisation(id, {
    project_name,
    description,
    address,
    status,
    sector,
    ...(images ? { project_images: images } : {})
  });
  res.json({ success: true });
});

app.delete("/admin/projects/:id", requireAdminAuth, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  await realisationModel.deleteRealisation(id);
  res.json({ success: true });
});

// Messages (exemple)
app.get("/admin/messages", requireAdminAuth, (_req, res) => {
  res.json(messages);
});
app.delete("/admin/messages/:id", requireAdminAuth, (req, res) => {
  const id = parseInt(req.params.id, 10);
  messages = messages.filter(m => m.id !== id);
  res.json({ success: true });
});

// Stats (exemple)
app.get("/admin/stats", requireAdminAuth, async (_req, res) => {
  const projects = await realisationModel.getAllRealisations();
  res.json({
    totalProjects: projects.length,
    totalMessages: messages.length,
    projectsBySector: projects.reduce((acc: Record<string, number>, p: any) => {
      acc[p.sector] = (acc[p.sector] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  });
});

app.use("/api/admin", adminRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/realisations", realisationRoutes);

// GET /projects : liste tous les projets
app.get("/projects", async (_req, res) => {
  const rows = await db.select().from(projects);
  const data = rows.map(row => {
    let images = typeof row.project_images === "string"
      ? JSON.parse(row.project_images)
      : Array.isArray(row.project_images)
        ? row.project_images
        : [];
    
    // Normalise les chemins d'images pour qu'ils commencent tous par /uploads/
    images = images.map((img: string) => {
      // Remplace les backslashes par des slashes
      let normalizedPath = img.replace(/\\/g, "/");
      // Assure que le chemin commence par /uploads/
      if (!normalizedPath.startsWith("/uploads/")) {
        if (normalizedPath.startsWith("uploads/")) {
          normalizedPath = "/" + normalizedPath;
        } else {
          normalizedPath = "/uploads/" + normalizedPath.replace(/^\/+/, "");
        }
      }
      return normalizedPath;
    });

    return {
      ...row,
      project_images: images
    };
  });
  res.json(data);
});

// POST /projects : ajout projet + upload images
app.post("/projects", upload.array("project_images", 30), async (req: Request, res: Response) => {
  try {
    const { project_name, description, address, status, sector } = req.body;
    if (!project_name || !description || !status || !sector) {
      return res.status(400).json({ message: "Champs requis manquants" });
    }
    // Les fichiers sont uploadés dans server/uploads grâce à multerStorage
    // On stocke le chemin relatif pour l'accès public
    const images = req.files
      ? (req.files as Express.Multer.File[]).map(f => "/uploads/" + path.basename(f.path))
      : [];
    const insertData = {
      project_name,
      description,
      address,
      status,
      sector,
      project_images: JSON.stringify(images), // stocke comme string JSON
      created_at: new Date()
    };
    const result = await db.insert(projects).values(insertData).returning();
    res.json({ success: true, project: result[0] });
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Erreur serveur" });
  }
});

// PUT /projects/:id : modifier projet + remplacer images si upload
app.put("/projects/:id", upload.array("project_images", 30), async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { project_name, description, address, status, sector } = req.body;
    const images = req.files ? (req.files as Express.Multer.File[]).map(f => "/uploads/" + path.basename(f.path)) : undefined;

    // Récupère projet existant pour supprimer anciennes images si remplacées
    const oldRows = await db.select().from(projects).where(eq(projects.id, id));
    if (oldRows.length === 0) return res.status(404).json({ message: "Projet non trouvé" });

    let updateData: any = { project_name, description, address, status, sector };
    if (images && images.length > 0) {
      // Supprime anciennes images locales
      const oldImages = typeof oldRows[0].project_images === "string"
        ? JSON.parse(oldRows[0].project_images)
        : [];
      oldImages.forEach((imgPath: string) => {
        const absPath = path.join(__dirname, "..", imgPath.replace(/^\/uploads\//, "uploads/"));
        if (fs.existsSync(absPath)) fs.unlinkSync(absPath);
      });
      updateData.project_images = JSON.stringify(images); // stocke comme string JSON
    }
    await db.update(projects).set(updateData).where(eq(projects.id, id));
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Erreur serveur" });
  }
});

// DELETE /projects/:id : supprime projet et images locales
app.delete("/projects/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const rows = await db.select().from(projects).where(eq(projects.id, id));
    if (rows.length === 0) return res.status(404).json({ message: "Projet non trouvé" });
    const images = typeof rows[0].project_images === "string"
      ? JSON.parse(rows[0].project_images)
      : [];
    images.forEach((imgPath: string) => {
      const absPath = path.join(__dirname, "..", imgPath.replace(/^\/uploads\//, "uploads/"));
      if (fs.existsSync(absPath)) fs.unlinkSync(absPath);
    });
    await db.delete(projects).where(eq(projects.id, id));
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Erreur serveur" });
  }
});

// Sert les images uploadées depuis le dossier uploads à la racine du projet
app.use("/uploads", express.static(path.resolve(__dirname, "..", "uploads")));

(async () => {
  // Vérifie et crée la table users si elle n'existe pas
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'visitor',
        date_inscriptions TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    log("Vérification/création de la table 'users' OK.");
  } catch (err) {
    log("Erreur lors de la vérification/création de la table 'users' : " + (err as Error).message);
    process.exit(1);
  }

  // Vérifie et crée la table projects si elle n'existe pas
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        project_name VARCHAR(255) NOT NULL,
        description VARCHAR(255) NOT NULL,
        address TEXT,
        status VARCHAR(100) NOT NULL,
        project_images TEXT,
        sector VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    // Ajoute la colonne address si elle n'existe pas déjà
    await db.execute(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name='projects' AND column_name='address'
        ) THEN
          ALTER TABLE projects ADD COLUMN address TEXT;
        END IF;
      END
      $$;
    `);
    log("Vérification/création de la table 'projects' OK.");
  } catch (err) {
    log("Erreur lors de la vérification/création de la table 'projects' : " + (err as Error).message);
    process.exit(1);
  }

  // Vérifie et crée la table messages si elle n'existe pas
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        userName TEXT NOT NULL,
        userEmail TEXT NOT NULL,
        message TEXT NOT NULL
      );
    `);
    log("Vérification/création de la table 'messages' OK.");
  } catch (err) {
    log("Erreur lors de la vérification/création de la table 'messages' : " + (err as Error).message);
    process.exit(1);
  }

  // Vérifie et crée la table contact_messages si elle n'existe pas
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL,
        sector TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    log("Vérification/création de la table 'contact_messages' OK.");
  } catch (err) {
    log("Erreur lors de la vérification/création de la table 'contact_messages' : " + (err as Error).message);
    process.exit(1);
  }

  const server = await registerRoutes(app);

  // Setup Vite or serve static files
  if (app.get("env") === "development") {
    // Vite middleware should be set up before routes for HMR to work
    await setupVite(app, server);
  }

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500; 
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  if (app.get("env") !== "development") {
    serveStatic(app);
  }

  const port = parseInt(process.env.PORT || "2000", 10);
  app.listen(port, "127.0.0.1", () => {
    log(`Server running on http://127.0.0.1:${port}`);
  });
})();

// NOTE: If you see "require is not defined", check your frontend (React/Vite) code for any usage of `require` and replace with ES module `import` syntax.