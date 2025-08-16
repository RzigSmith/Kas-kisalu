import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import session from "express-session";

// Ajoute cette déclaration pour étendre la session
declare module "express-session" {
  interface SessionData {
    user?: {
      id: number;
      username: string;
      email: string;
      role: string;
    };
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Non authentifié" });
  }
  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Token invalide" });
  }
}

export function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  // Log cookies et session pour debug
  console.log("Cookies reçus:", req.cookies);
  console.log("Cookies signés reçus:", req.signedCookies);
  console.log("Session express reçue:", req.session);

  if (req.session?.user && req.session.user.role === "admin") {
    console.log("Session admin reconnue, accès autorisé.");
    return next();
  }
  if (req.signedCookies?.admin_session === "active") {
    console.log("Cookie admin_session actif, accès autorisé.");
    return next();
  }
  console.log("Accès refusé, aucune session/cookie admin valide.");
  return res.status(401).json({ error: "Accès refusé" });
}
