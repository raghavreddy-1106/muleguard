const express = require("express");
const pool = require("../db");
const authenticateToken = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/",
  authenticateToken,
  requireRole("ADMIN"),
  async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT
          a.id,
          a.action,
          a.resource_type,
          a.resource_id,
          a.details,
          a.created_at,
          u.name AS user_name,
          u.email AS user_email
        FROM audit_logs a
        LEFT JOIN users u
          ON a.user_id = u.id
        ORDER BY a.created_at DESC
      `);

      res.json(result.rows);
    } catch (error) {
      res.status(500).json({
        error: "Failed to fetch audit logs",
        details: error.message,
      });
    }
  }
);

module.exports = router;