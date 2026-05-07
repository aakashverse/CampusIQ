const express = require("express");
const cors = require("cors");
require("dotenv").config();

const collegeRoutes = require("./routes/colleges");
const authRoutes = require("./routes/auth");
const savedRoutes = require("./routes/saved");
const compareRoutes = require("./routes/compare");

const app = express();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://campusiq-flax.vercel.app"
  ]
}));
app.use(express.json());

// Routes
app.use("/api/colleges", collegeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/saved", savedRoutes);
app.use("/api/compare", compareRoutes);

// Health check
app.get("/", (req, res) => 
    res.json({ status: "ok", message: "College Platform API" })
);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => 
    console.log(`app is listening on port ${PORT}`)
);