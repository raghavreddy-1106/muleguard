const axios = require("axios");
const pool = require("../db");

const ML_SERVICE_URL =
  process.env.ML_SERVICE_URL || "http://localhost:8000";

const AML_SERVICE_URL =
  process.env.AML_SERVICE_URL || "http://localhost:8001";

async function assessTransaction(txnId) {
  const txResult = await pool.query(
    `SELECT * FROM transactions WHERE txn_id = $1`,
    [txnId]
  );

  if (txResult.rows.length === 0) {
    throw new Error("Transaction not found");
  }

  const transaction = txResult.rows[0];
  const accountId = transaction.account_id;

  const accountTxResult = await pool.query(
    `SELECT * FROM transactions WHERE account_id = $1`,
    [accountId]
  );

  const accountTx = accountTxResult.rows;
  const transactionCount = accountTx.length;

  const amounts = accountTx.map((tx) => Number(tx.amount));
  const totalAmount = amounts.reduce((sum, amount) => sum + amount, 0);
  const avgAmount =
    transactionCount > 0 ? totalAmount / transactionCount : 0;
  const maxAmount =
    transactionCount > 0 ? Math.max(...amounts) : 0;

  const uniqueCounterparties = new Set(
    accountTx.map((tx) => tx.counterparty_account_id)
  ).size;

  const mlResponse = await axios.post(`${ML_SERVICE_URL}/predict`, {
    transaction_count: transactionCount,
    total_amount: totalAmount,
    avg_amount: avgAmount,
    max_amount: maxAmount,
    unique_counterparties: uniqueCounterparties,
  });

  const allTxResult = await pool.query(
    `SELECT account_id, counterparty_account_id, amount FROM transactions`
  );

  const amlResponse = await axios.post(`${AML_SERVICE_URL}/analyze`, {
    transactions: allTxResult.rows,
  });

  const mlScore = Number(mlResponse.data.risk_score);

  const suspiciousAccount =
    amlResponse.data.suspicious_accounts.find(
      (account) => String(account.account_id) === String(accountId)
    );

  const networkScore = suspiciousAccount ? 1 : 0;

  const ruleScore =
    suspiciousAccount &&
    suspiciousAccount.reasons &&
    suspiciousAccount.reasons.length > 0
      ? 1
      : 0;

  const finalRiskScore =
    mlScore * 0.6 + ruleScore * 0.2 + networkScore * 0.2;

  let riskLevel = "LOW";

  if (finalRiskScore >= 0.7) {
    riskLevel = "HIGH";
  } else if (finalRiskScore >= 0.4) {
    riskLevel = "MEDIUM";
  }

  const reasons = [];

  if (mlScore >= 0.7) {
    reasons.push("High ML risk score");
  }

  if (suspiciousAccount) {
    reasons.push(...suspiciousAccount.reasons);
  }

  const riskResult = {
    transaction_id: txnId,
    account_id: accountId,
    ml_score: Number(mlScore.toFixed(4)),
    rule_score: ruleScore,
    network_score: networkScore,
    final_risk_score: Number(finalRiskScore.toFixed(4)),
    risk_level: riskLevel,
    reasons,
  };

  let decision = "ALLOW";

  if (riskLevel === "HIGH") {
    decision = "BLOCK";
  } else if (riskLevel === "MEDIUM") {
    decision = "REVIEW";
  }

  await pool.query(
    `INSERT INTO risk_assessments
     (txn_id, account_id, ml_score, rule_score, network_score,
      final_risk_score, risk_level, decision, reasons)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
    [
      txnId,
      accountId,
      riskResult.ml_score,
      riskResult.rule_score,
      riskResult.network_score,
      riskResult.final_risk_score,
      riskResult.risk_level,
      decision,
      reasons.join("; "),
    ]
  );

  return { ...riskResult, decision };
}

async function checkServices() {
  const mlResponse = await axios.get(`${ML_SERVICE_URL}/health`);
  const amlResponse = await axios.get(`${AML_SERVICE_URL}/health`);

  return {
    ml_service: mlResponse.data,
    aml_service: amlResponse.data,
  };
}

module.exports = {
  assessTransaction,
  checkServices,
};
