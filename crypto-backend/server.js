import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cryptoRoutes from "./routes/cryptoRoutes.js";
import { seedCrypto } from "./utils/seedCrypto.js";

dotenv.config();

const app = express();

const normalizeOrigin = (origin) => origin?.trim().replace(/\/$/, "");
const allowedOrigins = (
  process.env.CLIENT_URL || "https://interim-assesment-mubikay488.vercel.app"
)
  .split(",")
  .map(normalizeOrigin)
  .filter(Boolean);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      const normalized = normalizeOrigin(origin);
      if (!origin || allowedOrigins.includes(normalized)) {
        callback(null, origin || true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    credentials: true,
  }),
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/crypto", cryptoRoutes);

// Test routes
app.get("/", (req, res) => {
  res.send("API is running...");
});
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Start server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected ✅");
    await seedCrypto();
  })
  .catch((err) => console.log(err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
