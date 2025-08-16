import { db, projects } from "../db";
import { eq } from "drizzle-orm";

export interface Projects {
  id?: number;
  project_name: string;
  description: string;
  address?: string;
  status: string;
  sector: string;
  project_images?: string[]; // Pour l'usage TypeScript
}

// Lecture : convertit la string JSON en tableau d’images
export async function getAllRealisations() {
  const rows = await db.select().from(projects);
  return rows.map(row => ({
    ...row,
    project_images: typeof row.project_images === "string"
      ? JSON.parse(row.project_images)
      : Array.isArray(row.project_images)
        ? row.project_images
        : []
  }));
}

export async function getRealisationById(id: number) {
  const rows = await db.select().from(projects).where(eq(projects.id, id));
  return rows.map(row => ({
    ...row,
    project_images: typeof row.project_images === "string"
      ? JSON.parse(row.project_images)
      : Array.isArray(row.project_images)
        ? row.project_images
        : []
  }));
}

// Insertion : convertit le tableau d’images en string JSON
export async function createRealisation(data: Projects) {
  const insertData: any = { ...data };
  if (Array.isArray(insertData.project_images)) {
    insertData.project_images = JSON.stringify(insertData.project_images);
  }
  // S'assure que address existe (même vide)
  if (typeof insertData.address === "undefined") {
    insertData.address = "";
  }
  return db.insert(projects).values(insertData);
}

// Mise à jour : convertit le tableau d’images en string JSON
export async function updateRealisation(id: number, data: Partial<Projects>) {
  const updatedData: any = { ...data };
  if (Array.isArray(updatedData.project_images)) {
    updatedData.project_images = JSON.stringify(updatedData.project_images);
  }
  // S'assure que address existe (même vide)
  if (typeof updatedData.address === "undefined") {
    updatedData.address = "";
  }
  return db.update(projects).set(updatedData).where(eq(projects.id, id));
}

export async function deleteRealisation(id: number) {
  return db.delete(projects).where(eq(projects.id, id));
}

