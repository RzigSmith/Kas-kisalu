import { Router, Request, Response } from "express";

const router = Router();

// Dashboard admin
router.get("/dashboard", (_req: Request, res: Response) => {
  res.json({ message: "Bienvenue sur le dashboard admin via admin.routes" });
});

// Ajoute ici d'autres routes admin si besoin

export default router;
