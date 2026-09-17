const express = require("express");
const pool = require("../db");

const router = express.Router();

// Get all transactions
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        txn_id,
        account_id,
        counterparty_account_id,
        source_type,
        tx_count,
        amount,
        start_time,
        end_time
      FROM transactions
      ORDER BY txn_id
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch transactions",
      details: error.message
    });
  }
});

// Get one transaction
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        txn_id,
        account_id,
        counterparty_account_id,
        source_type,
        tx_count,
        amount,
        start_time,
        end_time
       FROM transactions
       WHERE txn_id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Transaction not found"
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch transaction",
      details: error.message
    });
  }
});

// Create transaction
router.post("/", async (req, res) => {
  const {
    txn_id,
    account_id,
    counterparty_account_id,
    source_type,
    tx_count,
    amount,
    start_time,
    end_time
  } = req.body;

  if (
    txn_id === undefined ||
    account_id === undefined ||
    counterparty_account_id === undefined ||
    !source_type ||
    tx_count === undefined ||
    amount === undefined ||
    start_time === undefined ||
    end_time === undefined
  ) {
    return res.status(400).json({
      error: "All transaction fields are required"
    });
  }

  if (amount <= 0 || tx_count <= 0) {
    return res.status(400).json({
      error: "Amount and transaction count must be greater than zero"
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO transactions
        (txn_id, account_id, counterparty_account_id, source_type,
         tx_count, amount, start_time, end_time)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING *`,
      [
        txn_id,
        account_id,
        counterparty_account_id,
        source_type,
        tx_count,
        amount,
        start_time,
        end_time
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({
      error: "Failed to create transaction",
      details: error.message
    });
  }
});

module.exports = router;