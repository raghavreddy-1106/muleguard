const express = require("express");
const pool = require("../db");

const router = express.Router();

router.get("/summary", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM transactions) AS total_transactions,
        (SELECT COUNT(*) FROM alerts) AS aml_alerts,
        (SELECT COUNT(*) FROM accounts WHERE is_fraud = TRUE) AS high_risk_accounts,
        (SELECT COUNT(*) FROM investigations
         WHERE status IN ('OPEN', 'IN_REVIEW')) AS open_investigations
    `);

    const data = result.rows[0];

    res.json({
      total_transactions: Number(data.total_transactions),
      aml_alerts: Number(data.aml_alerts),
      high_risk_accounts: Number(data.high_risk_accounts),
      open_investigations: Number(data.open_investigations)
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to load dashboard summary",
      details: error.message
    });
  }
});

module.exports = router;