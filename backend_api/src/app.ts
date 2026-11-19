import express, { Application, Request, Response } from "express";
import cors from "cors";

// Initialize Express application
const app: Application = express();

// Configure middlewares for Express application
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "ERM-6 API Server is running!" });
});

import authRoutes from "./modules/auth/auth.route";
// Mount all auth module routes under prefix /api/auth
app.use("/api/auth", authRoutes);

// Handle 404 Not Found for undefined routes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

export default app;
