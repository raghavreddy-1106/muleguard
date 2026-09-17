const express = require("express");
const cors = require("cors");
const pool = require("./db");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    service: "MuleGuard Backend",
    status: "running"
  });
});

app.get("/api/db-health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      database: "connected",
      time: result.rows[0].now
    });
  } catch (error) {
    res.status(500).json({
      database: "disconnected",
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`MuleGuard backend running on port ${PORT}`);
});