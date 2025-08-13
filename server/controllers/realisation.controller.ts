import { Request, Response } from "express";
import * as model from "../models/realisation.model";

export async function listRealisations(req: Request, res: Response) {
  const { sector } = req.query;
  const all = await model.getAllRealisations();
  if (sector) {
    return res.json(all.filter((r: any) => r.sector === sector));
  }
  res.json(all);
}

export async function getRealisation(req: Request, res: Response) {
  const id = Number(req.params.id);
  const real = await model.getRealisationById(id);
  if (!real) return res.status(404).json({ message: "Not found" });
  res.json(real);
}

export async function createRealisation(req: Request, res: Response) {
  const { title, sector, description } = req.body;
  const photos = req.files ? (req.files as Express.Multer.File[]).map(f => f.path) : [];
  if (!title || !sector || !description) {
    return res.status(400).json({ message: "Champs requis manquants" });
  }
  await model.createRealisation({ title, sector, description, photos });
  res.status(201).json({ success: true });
}

export async function updateRealisation(req: Request, res: Response) {
  const id = Number(req.params.id);
  const { title, sector, description } = req.body;
  const photos = req.files ? (req.files as Express.Multer.File[]).map(f => f.path) : undefined;
  await model.updateRealisation(id, { title, sector, description, ...(photos ? { photos } : {}) });
  res.json({ success: true });
}

export async function deleteRealisation(req: Request, res: Response) {
  const id = Number(req.params.id);
  await model.deleteRealisation(id);
  res.json({ success: true });
}
