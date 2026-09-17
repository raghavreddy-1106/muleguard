const express = require("express");
const pool = require("../db");
const authenticateToken = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");

const router = express.Router();

// Get all investigations
router.get(
  "/",
  authenticateToken,
  requireRole("ANALYST", "ADMIN"),
  async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT
          i.id,
          i.alert_key,
          i.account_id,
          i.analyst_id,
          i.status,
          i.notes,
          i.created_at,
          i.updated_at,
          u.name AS analyst_name
        FROM investigations i
        LEFT JOIN users u
          ON i.analyst_id = u.id
        ORDER BY i.created_at DESC
      `);

      res.json(result.rows);
    } catch (error) {
      res.status(500).json({
        error: "Failed to fetch investigations",
        details: error.message
      });
    }
  }
);

// Create investigation
router.post(
  "/",
  authenticateToken,
  requireRole("ANALYST", "ADMIN"),
  async (req, res) => {
    const { alert_key, account_id, notes = "" } = req.body;

    if (alert_key === undefined ||
        alert_key === null ||
        account_id === undefined || 
        account_id === null
    ) {
      return res.status(400).json({
        error: "alert_key and account_id are required"
      });
    }

    try {
      const result = await pool.query(
        `INSERT INTO investigations
          (alert_key, account_id, analyst_id, status, notes)
         VALUES ($1, $2, $3, 'OPEN', $4)
         RETURNING *`,
        [alert_key, account_id, req.user.id, notes]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({
        error: "Failed to create investigation",
        details: error.message
      });
    }
  }
);

// Update investigation
router.patch(
  "/:id",
  authenticateToken,
  requireRole("ANALYST", "ADMIN"),
  async (req, res) => {
    const { status, notes } = req.body;

    const allowedStatuses = [
      "OPEN",
      "IN_REVIEW",
      "CONFIRMED",
      "FALSE_POSITIVE",
      "CLOSED"
    ];

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        error: "Invalid investigation status"
      });
    }

    try {
      const result = await pool.query(
        `UPDATE investigations
         SET
           status = COALESCE($1, status),
           notes = COALESCE($2, notes),
           updated_at = CURRENT_TIMESTAMP
         WHERE id = $3
         RETURNING *`,
        [status || null, notes || null, req.params.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          error: "Investigation not found"
        });
      }

      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({
        error: "Failed to update investigation",
        details: error.message
      });
    }
  }
);

module.exports = router;