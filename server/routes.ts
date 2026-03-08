import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { api } from "@shared/routes";
import { z } from "zod";
import { openai } from "./replit_integrations/audio"; // Reusing the openai instance from audio
import { db } from "./db";
import { users } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup authentication first
  await setupAuth(app);
  registerAuthRoutes(app);

  // --- Datasets ---
  
  // List datasets
  app.get(api.datasets.list.path, async (req, res) => {
    try {
      const allDatasets = await storage.getDatasets();
      res.status(200).json(allDatasets);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to list datasets" });
    }
  });

  // Get single dataset
  app.get(api.datasets.get.path, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
         return res.status(400).json({ message: "Invalid ID format" });
      }
      const dataset = await storage.getDataset(id);
      if (!dataset) {
        return res.status(404).json({ message: "Dataset not found" });
      }
      res.status(200).json(dataset);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to get dataset" });
    }
  });

  // Create dataset (Protected)
  app.post(api.datasets.create.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const input = api.datasets.create.input.parse(req.body);
      
      const dataset = await storage.createDataset({
        ...input,
        ownerId: userId,
      });
      
      res.status(201).json(dataset);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }
      console.error(err);
      res.status(500).json({ message: "Failed to create dataset" });
    }
  });

  // Analyze dataset with AI (Protected)
  app.post(api.datasets.analyze.path, isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
         return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const dataset = await storage.getDataset(id);
      if (!dataset) {
        return res.status(404).json({ message: "Dataset not found" });
      }
      
      // Call OpenAI to analyze the image
      // Assuming dataset.imageUrl is a valid URL to the satellite image
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // Using an explicit model capable of vision if gpt-5.1 supports it, but fallback to 4o
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze this satellite image. Provide a JSON response with 'landClass' (e.g., 'forest', 'water', 'urban', 'agriculture') and 'disaster' (e.g., 'flood', 'fire', 'none'). Also include a short 'description'." },
              {
                type: "image_url",
                image_url: {
                  url: dataset.imageUrl,
                },
              },
            ],
          },
        ],
        response_format: { type: "json_object" },
      });

      const analysisRaw = response.choices[0]?.message?.content || "{}";
      let analysis;
      try {
        analysis = JSON.parse(analysisRaw);
      } catch (e) {
        analysis = { error: "Failed to parse analysis" };
      }

      const updatedDataset = await storage.updateDatasetAnalysis(id, analysis);
      res.status(200).json(updatedDataset);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to analyze dataset" });
    }
  });

  // --- Purchases ---
  
  // List user's purchases (Protected)
  app.get(api.purchases.list.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const purchases = await storage.getPurchases(userId);
      res.status(200).json(purchases);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to list purchases" });
    }
  });

  // Create purchase (Protected)
  app.post(api.purchases.create.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const input = api.purchases.create.input.parse(req.body);
      
      // Verify dataset exists
      const dataset = await storage.getDataset(input.datasetId);
      if (!dataset) {
         return res.status(404).json({ message: "Dataset not found" });
      }

      // Mocking blockchain transaction hash
      const mockTxHash = "0x" + Math.random().toString(16).substr(2, 40) + Date.now().toString(16);

      const purchase = await storage.createPurchase({
        ...input,
        buyerId: userId,
        transactionHash: input.transactionHash || mockTxHash,
      });
      
      res.status(201).json(purchase);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }
      console.error(err);
      res.status(500).json({ message: "Failed to create purchase" });
    }
  });

  // Seed database logic if needed can be placed here or in index.ts
  // For OrbitalX we will rely on users uploading datasets, but we can seed a few.
  // We'll run the seed directly in a script or at startup if empty.
  seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  try {
    const existing = await storage.getDatasets();
    if (existing.length === 0) {
      const dummyUserId = "system-seed-user";
      
      // Upsert the dummy user first to satisfy foreign key constraint
      await db.insert(users).values({
        id: dummyUserId,
        email: "seed@orbitalx.replit.app",
        firstName: "System",
        lastName: "Seeder",
      }).onConflictDoNothing();

      await storage.createDataset({
        title: "Amazon Rainforest Canopy - Sector 7G",
        description: "High-resolution multi-spectral imagery of the Amazon canopy. Useful for detecting illegal logging activities.",
        resolution: "0.5m/px",
        location: "Amazon Basin, Brazil",
        price: "0.05",
        ipfsHash: "QmYwAPJzv5CZsnA625s3Xf2sm5DyaTzH9aT2217G1Tq6A1",
        imageUrl: "https://images.unsplash.com/photo-1518349619113-03114f06ac3a?auto=format&fit=crop&q=80&w=1000",
        ownerId: dummyUserId
      });

      await storage.createDataset({
        title: "California Central Valley Agriculture",
        description: "Infrared dataset showing crop health and irrigation patterns across the central valley.",
        resolution: "1m/px",
        location: "California, USA",
        price: "0.02",
        ipfsHash: "QmYwAPJzv5CZsnA625s3Xf2sm5DyaTzH9aT2217G1Tq6A2",
        imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000",
        ownerId: dummyUserId
      });
      
      console.log("Database seeded with initial datasets");
    }
  } catch (error) {
    console.error("Failed to seed database:", error);
  }
}
