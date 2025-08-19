import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertContactMessageSchema } from "@shared/schema";
import { z } from "zod";
import { requireAdminAuth } from "./middlewares/auth.middleware";
import adminRoutes from "./routes/admin.routes";
import projectRoutes from "./routes/project.routes";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      res.json({ success: true, message: "Message envoyé avec succès" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Données invalides", 
          errors: error.errors 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: "Erreur serveur" 
        });
      }
    }
  });

  // Get contact messages (protected route - requires authentication)
  app.get("/api/contact-messages", isAuthenticated, async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Erreur lors de la récupération des messages" 
      });
    }
  });

  // Projects routes
  app.use("/api/projects", projectRoutes);

  // Admin routes
  app.use("/admin", requireAdminAuth, adminRoutes);

  const httpServer = createServer(app);
  return httpServer;
}
