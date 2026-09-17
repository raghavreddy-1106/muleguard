const express = require("express");
const axios = require("axios");
const pool = require("../db");
const authenticateToken = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");

const router = express.Router();

const AML_SERVICE_URL =
  process.env.AML_SERVICE_URL || "http://localhost:8001";

router.get(
  "/analysis",
  authenticateToken,
  requireRole("ANALYST", "ADMIN"),
  async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT
          account_id,
          counterparty_account_id,
          amount
        FROM transactions
      `);

      const response = await axios.post(
        `${AML_SERVICE_URL}/analyze`,
        {
          transactions: result.rows,
        }
      );

      res.json(response.data);
    } catch (error) {
      res.status(500).json({
        error: "Failed to analyze transaction network",
        details: error.message,
      });
    }
  }
);

module.exports = router;
