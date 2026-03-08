import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import {
  datasets,
  purchases,
  type Dataset,
  type InsertDataset,
  type Purchase,
  type InsertPurchase
} from "@shared/schema";

export interface IStorage {
  // Datasets
  getDatasets(): Promise<Dataset[]>;
  getDataset(id: number): Promise<Dataset | undefined>;
  createDataset(dataset: InsertDataset): Promise<Dataset>;
  updateDatasetAnalysis(id: number, analysis: any): Promise<Dataset>;
  
  // Purchases
  getPurchases(userId: string): Promise<Purchase[]>;
  createPurchase(purchase: InsertPurchase): Promise<Purchase>;
}

export class DatabaseStorage implements IStorage {
  // --- Datasets ---
  async getDatasets(): Promise<Dataset[]> {
    return await db.select().from(datasets).orderBy(desc(datasets.createdAt));
  }

  async getDataset(id: number): Promise<Dataset | undefined> {
    const [dataset] = await db.select().from(datasets).where(eq(datasets.id, id));
    return dataset;
  }

  async createDataset(dataset: InsertDataset): Promise<Dataset> {
    const [newDataset] = await db.insert(datasets).values(dataset).returning();
    return newDataset;
  }

  async updateDatasetAnalysis(id: number, analysis: any): Promise<Dataset> {
    const [updated] = await db
      .update(datasets)
      .set({ aiAnalysis: analysis })
      .where(eq(datasets.id, id))
      .returning();
    return updated;
  }

  // --- Purchases ---
  async getPurchases(userId: string): Promise<Purchase[]> {
    return await db.select().from(purchases).where(eq(purchases.buyerId, userId)).orderBy(desc(purchases.createdAt));
  }

  async createPurchase(purchase: InsertPurchase): Promise<Purchase> {
    const [newPurchase] = await db.insert(purchases).values(purchase).returning();
    return newPurchase;
  }
}

export const storage = new DatabaseStorage();
