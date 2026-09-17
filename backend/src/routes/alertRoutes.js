const express = require("express");
const pool = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        a.alert_key,
        a.account_id,
        a.customer_id,
        a.event_date,
        a.check_name,
        a.organization_type,
        a.escalated_to_case_investigation,
        ac.is_fraud
      FROM alerts a
      LEFT JOIN accounts ac
        ON a.account_id = ac.account_id
      ORDER BY a.alert_key
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch alerts",
      details: error.message
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        a.alert_key,
        a.account_id,
        a.customer_id,
        a.event_date,
        a.check_name,
        a.organization_type,
        a.escalated_to_case_investigation,
        ac.is_fraud
      FROM alerts a
      LEFT JOIN accounts ac
        ON a.account_id = ac.account_id
      WHERE a.alert_key = $1
      `,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Alert not found"
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch alert",
      details: error.message
    });
  }
});

module.exports = router;