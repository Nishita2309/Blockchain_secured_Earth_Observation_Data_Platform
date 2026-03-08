import { pgTable, serial, text, varchar, timestamp, decimal, jsonb, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export * from "./models/auth";
import { users } from "./models/auth";

export * from "./models/chat";
import { conversations, messages } from "./models/chat";

export const datasets = pgTable("datasets", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  resolution: text("resolution").notNull(),
  location: text("location").notNull(),
  price: decimal("price").notNull(),
  ipfsHash: text("ipfs_hash").notNull(),
  imageUrl: text("image_url").notNull(),
  aiAnalysis: jsonb("ai_analysis"), // e.g. { landClass: "forest", disaster: "none" }
  ownerId: varchar("owner_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const purchases = pgTable("purchases", {
  id: serial("id").primaryKey(),
  datasetId: integer("dataset_id").references(() => datasets.id).notNull(),
  buyerId: varchar("buyer_id").references(() => users.id).notNull(),
  transactionHash: text("transaction_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const datasetsRelations = relations(datasets, ({ one }) => ({
  owner: one(users, {
    fields: [datasets.ownerId],
    references: [users.id],
  }),
}));

export const purchasesRelations = relations(purchases, ({ one }) => ({
  dataset: one(datasets, {
    fields: [purchases.datasetId],
    references: [datasets.id],
  }),
  buyer: one(users, {
    fields: [purchases.buyerId],
    references: [users.id],
  }),
}));

export const insertDatasetSchema = createInsertSchema(datasets).omit({
  id: true,
  createdAt: true,
  ownerId: true,
  aiAnalysis: true, // Generate this later or set default
});

export const insertPurchaseSchema = createInsertSchema(purchases).omit({
  id: true,
  createdAt: true,
  buyerId: true,
});

export type Dataset = typeof datasets.$inferSelect;
export type InsertDataset = z.infer<typeof insertDatasetSchema>;

export type Purchase = typeof purchases.$inferSelect;
export type InsertPurchase = z.infer<typeof insertPurchaseSchema>;
