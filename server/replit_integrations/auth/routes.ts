import type { Express } from "express";
import { authStorage } from "./storage";
import { isAuthenticated } from "./replitAuth";

// Register auth-specific routes
export function registerAuthRoutes(app: Express): void {
  // Wallet-based login
  app.post("/api/auth/wallet", async (req: any, res, next) => {
    try {
      const { walletAddress } = req.body ?? {};

      if (!walletAddress || typeof walletAddress !== "string") {
        return res
          .status(400)
          .json({ message: "walletAddress is required and must be a string" });
      }

      const normalizedAddress = walletAddress.toLowerCase();

      const user = await authStorage.upsertUser({
        id: normalizedAddress,
      });

      req.login({ id: user.id }, (err: any) => {
        if (err) {
          return next(err);
        }
        return res.json(user);
      });
    } catch (error) {
      console.error("Error during wallet auth:", error);
      return res.status(500).json({ message: "Failed to authenticate wallet" });
    }
  });

  // Get current authenticated user
  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const user = await authStorage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
}
