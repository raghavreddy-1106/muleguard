const express = require("express");
const pool = require("../db");
const { assessTransaction } = require("../services/riskService");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:txnId", authenticateToken, async (req, res) => {
  try {
    const result = await assessTransaction(req.params.txnId);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: "Risk assessment failed",
      details: error.message
    });
  }
});
router.get(
  "/history/:txnId",
  authenticateToken,
  async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT
           id,
           txn_id,
           account_id,
           ml_score,
           rule_score,
           network_score,
           final_risk_score,
           risk_level,
           decision,
           reasons,
           created_at
         FROM risk_assessments
         WHERE txn_id = $1
         ORDER BY created_at DESC`,
        [req.params.txnId]
      );

      res.json(result.rows);
    } catch (error) {
      res.status(500).json({
        error: "Failed to fetch risk history",
        details: error.message,
      });
    }
  }
);

module.exports = router;