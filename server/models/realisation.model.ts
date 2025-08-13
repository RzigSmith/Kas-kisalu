import { db, projects } from "../db";

export async function getAllRealisations() {
  return db.select().from(projects);
}

import { eq } from "drizzle-orm";

export async function getRealisationById(id: number) {
  return db.select().from(projects).where(eq(projects.id, id));
}

export async function createRealisation(data: { title: string; sector: string; description: string; photos: string[] }) {
  return db.insert(projects).values(data);
}

export async function updateRealisation(id: number, data: Partial<{ title: string; sector: string; description: string; photos: string[] }>) {
  return db.update(projects).set(data).where(eq(projects.id, id));
}

export async function deleteRealisation(id: number) {
  return db.delete(projects).where(eq(projects.id, id));
}


