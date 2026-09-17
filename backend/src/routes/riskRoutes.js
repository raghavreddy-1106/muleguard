const express = require("express");
const { assessTransaction } = require("../services/riskService");

const router = express.Router();

router.get("/:txnId", async (req, res) => {
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

module.exports = router;