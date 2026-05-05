const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const walletRoutes = require("./routes/wallet.routes");
const transactionRoutes = require("./routes/transaction.routes");
const swapRoutes = require("./routes/swap.routes");
const marketRoutes = require("./routes/market.routes");
const kycRoutes = require("./routes/kyc.routes");
const subscriptionRoutes = require("./routes/subscription.routes");
const cryptoRoutes = require("./routes/crypto.routes");
const { register, login } = require("./controllers/auth.controller");
const { getMe } = require("./controllers/user.controller");
const { protect } = require("./middleware/auth.middleware");
const { validate } = require("./middleware/validate.middleware");
const { body } = require("express-validator");

const app = express();

const normalizeOrigin = (origin) => origin?.trim().replace(/\/$/, "");
const allowedOrigins = (
  process.env.CLIENT_URL ||
  "http://localhost:5173,https://interim-assesment-mubikay488.vercel.app"
)
  .split(",")
  .map((o) => normalizeOrigin(o))
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      const normalizedOrigin = normalizeOrigin(origin);
      // allow server-to-server / curl (no origin header) and whitelisted origins
      if (!origin || allowedOrigins.includes(normalizedOrigin)) {
        callback(null, origin || true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    credentials: true,
  }),
);

// Explicit OPTIONS preflight handler for all routes
app.options(
  "*",
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin || true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/swap", swapRoutes);
app.use("/api/market", marketRoutes);
app.use("/api/kyc", kycRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/crypto", cryptoRoutes);

// README-spec top-level shortcuts (exact paths from the assignment)
app.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
  ],
  validate,
  register,
);
app.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password required"),
  ],
  validate,
  login,
);
app.get("/profile", protect, getMe);
app.use("/crypto", cryptoRoutes);

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal server error" });
});

module.exports = app;
