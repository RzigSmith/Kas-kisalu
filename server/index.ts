import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import cookieParser from "cookie-parser";
import cors from "cors";
import { db, users } from "./db"; // retire migrate
import multer from "multer";
import realisationRoutes from "./routes/realisation.routes";
import projectRoutes from "./routes/project.routes";
import * as realisationModel from "./models/realisation.model";
import { eq } from "drizzle-orm";
import { and } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();
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

// Multer configuration pour upload de photos
const upload = multer({ dest: "uploads/" });

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
  res.json({
    success: true,
    token,
    user: { id: user.id, username: user.username, email: user.email, role: user.role }
  });
});

// Middleware pour vérifier la session admin
function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const session = req.signedCookies && req.signedCookies.admin_session;
  if (session && session === "active") {
    return next();
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

app.post("/admin/projects", requireAdminAuth, upload.array("photos", 10), async (req: Request, res: Response) => {
  const { title, sector, description } = req.body;
  const photos = req.files ? (req.files as Express.Multer.File[]).map(f => f.path) : [];
  if (!title || !sector || !description) {
    return res.status(400).json({ message: "Champs requis manquants" });
  }
  await realisationModel.createRealisation({ title, sector, description, photos });
  res.json({ success: true });
});

app.put("/admin/projects/:id", requireAdminAuth, upload.array("photos", 10), async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const { title, sector, description } = req.body;
  const photos = req.files ? (req.files as Express.Multer.File[]).map(f => f.path) : undefined;
  await realisationModel.updateRealisation(id, { title, sector, description, ...(photos ? { photos } : {}) });
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

app.use("/api/realisations", realisationRoutes);
app.use("/api/projects", projectRoutes);

(async () => {
  // Vérifie et crée la table users si elle n'existe pas (sécurisé pour Postgres/NeonDB)
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

  // Listen on localhost (Windows local)
  const port = parseInt(process.env.PORT || "3000", 10);
  app.listen(port, "127.0.0.1", () => {
    log(`Server running on http://127.0.0.1:${port}`);
  });
})();

// NOTE: If you see "require is not defined", check your frontend (React/Vite) code for any usage of `require` and replace with ES module `import` syntax.